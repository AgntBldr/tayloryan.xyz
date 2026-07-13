import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "audits", "site-audit");
const OUT_JSON = path.join(OUT_DIR, "audit-results.json");
const OUT_DASHBOARD = path.join(OUT_DIR, "dashboard.html");

const CHECK_TIMEOUT_MS = Number(process.env.LINK_CHECK_TIMEOUT_MS || 12000);
const CHECK_CONCURRENCY = Number(process.env.LINK_CHECK_CONCURRENCY || 10);
const MAX_CHECKS = Number(process.env.LINK_CHECK_MAX || 0);

const SKIP_DIRS_FOR_LINK_SCAN = new Set([
  ".git",
  "node_modules",
  "brain",
  "backups",
  "execution",
  "portfolio",
  "quest-portfolio",
  "quest_portfolio_data",
  "work",
  "work_some",
  "work_video",
  "__BACKUP_DUPLICATES__",
  "__ARCHIVE_NOT_USED_FOR_DEPLOY__",
  "DEPLOY_CLOUDFLARE",
]);

const LINK_SCAN_EXTENSIONS = new Set([
  ".html",
  ".js",
  ".json",
  ".md",
  ".csv",
  ".txt",
  ".css",
]);

const URL_RE = /https?:\/\/[^\s"',<>\\)`]+/gi;
const ATTR_RE = /\b(href|src|action)=["']([^"']+)["']/gi;
const CSS_URL_RE = /url\(["']?([^"')]+)["']?\)/gi;

function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function readTextIfExists(filePath) {
  if (!fileExists(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}

function git(command) {
  try {
    return execSync(`git ${command}`, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function trimUrl(raw) {
  return raw
    .trim()
    .replace(/[),.;\]}`]+$/g, "")
    .replace(/&amp;/g, "&");
}

function isPlaceholder(value) {
  const v = String(value || "").trim();
  return !v || v === "#" || /^n\/a$/i.test(v) || /^na$/i.test(v) || /^none$/i.test(v);
}

function classifyUrl(value) {
  if (!value) return "empty";
  const url = String(value).trim();

  if (isPlaceholder(url)) return "placeholder";
  if (url.startsWith("mailto:")) return "email";
  if (url.startsWith("tel:")) return "phone";
  if (url.startsWith("#")) return "anchor";
  if (url.startsWith("javascript:")) return "script";
  if (url.startsWith("data:")) return "data-uri";

  if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../") || !/^[a-z][a-z0-9+.-]*:/i.test(url)) {
    return "internal";
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return "invalid";
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const pathname = parsed.pathname.toLowerCase();

  if (host === "docs.google.com" && pathname.includes("/document/")) return "google-doc";
  if (host === "docs.google.com" && pathname.includes("/spreadsheets/")) return "google-sheet";
  if (host === "docs.google.com" && pathname.includes("/presentation/")) return "google-slide";
  if (host === "docs.google.com" && pathname.includes("/forms/")) return "google-form";
  if (host === "drive.google.com") return "google-drive";
  if (host.endsWith("layer3.xyz")) return "layer3";
  if (host.includes("youtube.com") || host === "youtu.be" || host === "img.youtube.com") return "video";
  if (host === "x.com" || host === "twitter.com" || host === "t.me" || host.includes("telegram") || host.includes("discord") || host === "linkedin.com" || host === "github.com") return "social";
  if (host.includes("cdn.") || host === "unpkg.com" || host === "cdnjs.cloudflare.com" || host === "cdn.jsdelivr.net" || host.includes("fonts.google")) return "cdn";
  if (url.includes("ref=") || url.includes("referral") || url.includes("invite=") || url.includes("code=")) return "referral";
  if (pathname.endsWith(".pdf")) return "pdf";
  if (host.includes("gitbook.io") || host.startsWith("docs.")) return "documentation";

  return "external";
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    const trackerParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
    ];
    for (const param of trackerParams) parsed.searchParams.delete(param);
    return parsed.toString();
  } catch {
    return String(url || "").trim();
  }
}

function addRecord(records, record) {
  const url = String(record.url || "").trim();
  if (!url) return;
  const forcedClassification = record.source_kind === "placeholder" ? "placeholder" : "";
  const classification = classifyUrl(url);
  records.push({
    url,
    normalized_url: (forcedClassification || classification) === "internal" ? url : normalizeUrl(url),
    classification: forcedClassification || classification,
    source_path: record.source_path || "",
    source_line: record.source_line || null,
    page_or_modal: record.page_or_modal || "",
    item_title: record.item_title || "",
    field: record.field || "",
    source_kind: record.source_kind || "scan",
    note: record.note || "",
  });
}

function lineForOffset(text, offset) {
  return text.slice(0, offset).split(/\r?\n/).length;
}

function extractUrlsFromText(text, filePath, records, sourceKind = "file") {
  const seenSpans = new Set();
  for (const match of text.matchAll(URL_RE)) {
    const url = trimUrl(match[0]);
    const key = `${match.index}:${url}`;
    seenSpans.add(key);
    addRecord(records, {
      url,
      source_path: rel(filePath),
      source_line: lineForOffset(text, match.index || 0),
      field: "text-url",
      source_kind: sourceKind,
    });
  }

  for (const match of text.matchAll(ATTR_RE)) {
    const [, attr, value] = match;
    const clean = trimUrl(value);
    if (clean.includes("${")) continue;
    if (isPlaceholder(clean)) {
      addRecord(records, {
        url: clean || "(empty)",
        source_path: rel(filePath),
        source_line: lineForOffset(text, match.index || 0),
        field: attr,
        source_kind: "placeholder",
        note: "Placeholder attribute value.",
      });
      continue;
    }
    addRecord(records, {
      url: clean,
      source_path: rel(filePath),
      source_line: lineForOffset(text, match.index || 0),
      field: attr,
      source_kind: sourceKind,
    });
  }

  for (const match of text.matchAll(CSS_URL_RE)) {
    const url = trimUrl(match[1]);
    if (isPlaceholder(url) || url.startsWith("data:") || url.startsWith("%") || url.includes("${")) continue;
    addRecord(records, {
      url,
      source_path: rel(filePath),
      source_line: lineForOffset(text, match.index || 0),
      field: "css-url",
      source_kind: sourceKind,
    });
  }
}

function walkFiles(dir, callback, options = {}) {
  if (!fileExists(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (options.skipDirs?.has(entry.name)) continue;
      if (rel(full) === "DEPLOY_PUBLIC/DEPLOY_PUBLIC") continue;
      walkFiles(full, callback, options);
    } else if (entry.isFile()) {
      callback(full);
    }
  }
}

function scanFiles(records) {
  walkFiles(
    ROOT,
    (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (!LINK_SCAN_EXTENSIONS.has(ext)) return;
      const relative = rel(filePath);
      if (relative.startsWith("audits/")) return;
      if (/backup/i.test(path.basename(relative))) return;
      if (relative.startsWith("Ref Docs/") && ![".md", ".csv", ".txt"].includes(ext)) return;
      const text = readTextIfExists(filePath);
      extractUrlsFromText(text, filePath, records);
    },
    { skipDirs: SKIP_DIRS_FOR_LINK_SCAN },
  );
}

function parseJsonAssignment(filePath, leftMarker) {
  const text = readTextIfExists(filePath);
  if (!text) return null;
  const markerIndex = text.indexOf(leftMarker);
  if (markerIndex === -1) return null;
  const afterMarker = text.slice(markerIndex + leftMarker.length);
  const startArray = afterMarker.indexOf("[");
  const startObject = afterMarker.indexOf("{");
  let start;
  let end;

  if (startArray !== -1 && (startObject === -1 || startArray < startObject)) {
    start = markerIndex + leftMarker.length + startArray;
    end = text.lastIndexOf("]");
  } else {
    start = markerIndex + leftMarker.length + startObject;
    end = text.lastIndexOf("}");
  }

  if (start < 0 || end < start) return null;
  return JSON.parse(text.slice(start, end + 1));
}

function extractStructuredQuests(records) {
  const filePath = path.join(ROOT, "assets", "js", "quests_data.js");
  let quests = [];
  try {
    quests = parseJsonAssignment(filePath, "window.quests =") || [];
  } catch (error) {
    records.push({
      url: "(parse error)",
      normalized_url: "(parse error)",
      classification: "parse-error",
      source_path: rel(filePath),
      source_line: null,
      page_or_modal: "Quest modal",
      item_title: "",
      field: "window.quests",
      source_kind: "structured",
      note: String(error.message || error),
    });
    return;
  }

  for (const quest of quests) {
    const title = quest.title || quest.project || quest.id || "";
    addRecord(records, {
      url: quest.url,
      source_path: rel(filePath),
      page_or_modal: "Quest card/modal",
      item_title: title,
      field: "url",
      source_kind: "quests_data",
      note: "Primary quest URL shown as the project/action link.",
    });

    for (const [key, value] of Object.entries(quest.links || {})) {
      if (isPlaceholder(value)) {
        addRecord(records, {
          url: value || "(empty)",
          source_path: rel(filePath),
          page_or_modal: "Quest data",
          item_title: title,
          field: `links.${key}`,
          source_kind: "placeholder",
          note: "Quest link field is empty or marked N/A.",
        });
        continue;
      }
      addRecord(records, {
        url: value,
        source_path: rel(filePath),
        page_or_modal: "Quest data",
        item_title: title,
        field: `links.${key}`,
        source_kind: "quests_data",
        note: key === "quest_doc" ? "Google Doc backing a quest. User said Layer3 quest links should not be changed casually." : "",
      });
    }
  }
}

function extractStructuredResources(records) {
  const filePath = path.join(ROOT, "assets", "resources_data.js");
  let db = {};
  try {
    db = parseJsonAssignment(filePath, "const RESOURCES_DB =") || {};
  } catch (error) {
    records.push({
      url: "(parse error)",
      normalized_url: "(parse error)",
      classification: "parse-error",
      source_path: rel(filePath),
      source_line: null,
      page_or_modal: "Resource modal",
      item_title: "",
      field: "RESOURCES_DB",
      source_kind: "structured",
      note: String(error.message || error),
    });
    return;
  }

  function visit(value, ctx, fieldPath = []) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, ctx, [...fieldPath, String(index)]));
      return;
    }

    if (value && typeof value === "object") {
      const nextCtx = {
        ...ctx,
        item_title: value.title || value.Resource || value.Name || value.Project || ctx.item_title,
      };
      for (const [key, child] of Object.entries(value)) visit(child, nextCtx, [...fieldPath, key]);
      return;
    }

    if (typeof value !== "string") return;
    const field = fieldPath.join(".");
    if (isPlaceholder(value)) return;

    for (const match of value.matchAll(URL_RE)) {
      addRecord(records, {
        url: trimUrl(match[0]),
        source_path: rel(filePath),
        page_or_modal: ctx.page_or_modal,
        item_title: ctx.item_title,
        field,
        source_kind: "resources_data",
      });
    }

    for (const match of value.matchAll(ATTR_RE)) {
      addRecord(records, {
        url: trimUrl(match[2]),
        source_path: rel(filePath),
        page_or_modal: ctx.page_or_modal,
        item_title: ctx.item_title,
        field: `${field}.${match[1]}`,
        source_kind: "resources_data",
      });
    }
  }

  for (const [category, resources] of Object.entries(db)) {
    visit(resources, { page_or_modal: `Resource modal: ${category}`, item_title: "" });
  }
}

function uniqueByUrl(records) {
  const map = new Map();
  for (const record of records) {
    if (["placeholder", "anchor", "script", "data-uri", "email", "phone", "empty", "parse-error"].includes(record.classification)) continue;
    const key = record.classification === "internal" ? `${record.url}|${record.source_path}` : record.normalized_url;
    if (!map.has(key)) {
      map.set(key, { ...record, occurrences: [] });
    }
    map.get(key).occurrences.push({
      source_path: record.source_path,
      source_line: record.source_line,
      page_or_modal: record.page_or_modal,
      item_title: record.item_title,
      field: record.field,
      source_kind: record.source_kind,
    });
  }
  return [...map.values()];
}

function resolveInternal(record) {
  const source = record.source_path || "";
  const raw = String(record.url || "");
  const clean = raw.split("#")[0].split("?")[0];
  if (!clean) return { status: "skipped", reason: "anchor/query-only" };

  let route;
  if (clean.startsWith("/")) {
    route = clean;
  } else {
    const sourceDir = source.startsWith("DEPLOY_PUBLIC/")
      ? path.posix.dirname(source.replace(/^DEPLOY_PUBLIC\//, ""))
      : path.posix.dirname(source);
    route = path.posix.normalize(path.posix.join("/", sourceDir, clean));
  }

  const candidates = [];
  const deployRoot = path.join(ROOT, "DEPLOY_PUBLIC");
  const routeNoSlash = route.replace(/^\/+/, "");
  candidates.push(path.join(deployRoot, routeNoSlash));
  candidates.push(path.join(deployRoot, routeNoSlash, "index.html"));
  if (route.endsWith("/")) candidates.push(path.join(deployRoot, routeNoSlash, "index.html"));
  if (routeNoSlash.endsWith(".html")) {
    candidates.push(path.join(deployRoot, routeNoSlash.replace(/\.html$/i, ""), "index.html"));
  } else if (!path.extname(routeNoSlash)) {
    candidates.push(path.join(deployRoot, `${routeNoSlash}.html`));
  }

  const found = candidates.find((candidate) => fileExists(candidate));
  return {
    status: found ? "live" : "broken",
    method: "local-file",
    route,
    target_path: found ? rel(found) : "",
    reason: found ? "Resolved in DEPLOY_PUBLIC." : "No matching file in DEPLOY_PUBLIC.",
  };
}

function googleExportUrl(url) {
  try {
    const parsed = new URL(url);
    const id = parsed.pathname.match(/\/d\/([^/]+)/)?.[1] || parsed.searchParams.get("id");
    if (!id) return url;
    if (parsed.hostname === "docs.google.com" && parsed.pathname.includes("/document/")) {
      return `https://docs.google.com/document/d/${id}/export?format=txt`;
    }
    if (parsed.hostname === "docs.google.com" && parsed.pathname.includes("/spreadsheets/")) {
      return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
    }
    if (parsed.hostname === "docs.google.com" && parsed.pathname.includes("/presentation/")) {
      return `https://docs.google.com/presentation/d/${id}/export/pdf`;
    }
    if (parsed.hostname === "drive.google.com") {
      return `https://drive.google.com/uc?export=download&id=${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

function sniffGoogleAccess(status, finalUrl, body) {
  const sample = String(body || "").slice(0, 4000).toLowerCase();
  if ([401, 403].includes(status)) return "private_or_forbidden";
  if (sample.includes("you need access") || sample.includes("request access") || sample.includes("sign in") || sample.includes("access denied")) {
    return "private_or_login_required";
  }
  if (sample.includes("sorry, unable to open the file") || sample.includes("file does not exist")) {
    return "missing_or_removed";
  }
  if (finalUrl && finalUrl.includes("accounts.google.com")) return "login_redirect";
  return "";
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function checkExternal(record) {
  const isGoogle = record.classification.startsWith("google-");
  const checkUrl = isGoogle ? googleExportUrl(record.normalized_url) : record.normalized_url;
  const headers = {
    "user-agent": "Mozilla/5.0 (compatible; PortfolioAgentLinkAudit/1.0)",
    accept: "text/html,application/xhtml+xml,application/xml,text/plain,application/json,*/*;q=0.8",
    range: "bytes=0-4095",
  };

  const attempts = [];
  const methods = isGoogle ? ["GET"] : ["HEAD", "GET"];

  for (const method of methods) {
    try {
      const response = await fetchWithTimeout(checkUrl, {
        method,
        redirect: "follow",
        headers,
      });

      let body = "";
      const contentType = response.headers.get("content-type") || "";
      if (method === "GET" && /text|html|json|csv|xml/i.test(contentType)) {
        body = await response.text();
      }

      const googleAccess = isGoogle ? sniffGoogleAccess(response.status, response.url, body) : "";
      attempts.push({
        method,
        status: response.status,
        final_url: response.url,
        content_type: contentType,
        google_access: googleAccess,
      });

      if (googleAccess) {
        return {
          status: googleAccess.includes("missing") ? "broken" : "auth_required",
          method,
          http_status: response.status,
          final_url: response.url,
          content_type: contentType,
          reason: googleAccess,
          attempts,
        };
      }

      if (response.status >= 200 && response.status < 400) {
        return {
          status: "live",
          method,
          http_status: response.status,
          final_url: response.url,
          content_type: contentType,
          reason: "HTTP success.",
          attempts,
        };
      }

      if (method === "HEAD" && [401, 403, 405, 406, 429, 503].includes(response.status)) {
        continue;
      }

      if ([401, 403].includes(response.status)) {
        return {
          status: "auth_required",
          method,
          http_status: response.status,
          final_url: response.url,
          content_type: contentType,
          reason: "HTTP auth or forbidden response.",
          attempts,
        };
      }

      if ([404, 410].includes(response.status)) {
        return {
          status: "broken",
          method,
          http_status: response.status,
          final_url: response.url,
          content_type: contentType,
          reason: "HTTP missing response.",
          attempts,
        };
      }
    } catch (error) {
      attempts.push({ method, error: error.name === "AbortError" ? "timeout" : String(error.message || error) });
      if (method === "HEAD") continue;
      return {
        status: error.name === "AbortError" ? "timeout" : "error",
        method,
        reason: error.name === "AbortError" ? "Timed out." : String(error.message || error),
        attempts,
      };
    }
  }

  const last = attempts[attempts.length - 1] || {};
  return {
    status: last.status >= 400 ? "broken" : "unknown",
    method: last.method || "",
    http_status: last.status || null,
    final_url: last.final_url || "",
    content_type: last.content_type || "",
    reason: last.error || "No conclusive response.",
    attempts,
  };
}

async function mapConcurrent(items, mapper, concurrency) {
  const results = new Array(items.length);
  let index = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await mapper(items[current], current);
    }
  });
  await Promise.all(workers);
  return results;
}

function recommend(record) {
  const status = record.check?.status || "unchecked";
  const kind = record.classification;

  if (kind === "layer3") return "Do not change automatically. Keep Layer3 quest links unless you manually approve a replacement.";
  if (kind.startsWith("google-") && ["broken", "auth_required"].includes(status)) {
    return "Replace with an accessible copy, restore/share the file, or remove the public button if the document should stay private.";
  }
  if (kind === "internal" && status === "broken") return "Fix route generation or remove the stale internal link before the next deploy.";
  if (["broken", "error"].includes(status)) return "Review for replacement or removal.";
  if (status === "timeout") return "Retry with a browser pass before deciding.";
  if (status === "auth_required") return "Decide whether this is expected gated content or a broken public resource.";
  return "No action needed from this check.";
}

function collectDirectorySizes() {
  function sizeOf(target) {
    let total = 0;
    try {
      const stat = fs.statSync(target);
      if (stat.isFile()) return stat.size;
      if (!stat.isDirectory()) return 0;
      for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
        total += sizeOf(path.join(target, entry.name));
      }
    } catch {
      return total;
    }
    return total;
  }

  const rootEntries = fs.readdirSync(ROOT, { withFileTypes: true });
  return rootEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const full = path.join(ROOT, entry.name);
      const bytes = sizeOf(full);
      return {
        name: entry.name,
        path: rel(full),
        bytes,
        mb: Number((bytes / 1024 / 1024).toFixed(2)),
      };
    })
    .sort((a, b) => b.bytes - a.bytes);
}

function collectLargestFiles(limit = 40) {
  const files = [];
  walkFiles(ROOT, (filePath) => {
    try {
      const stat = fs.statSync(filePath);
      files.push({ path: rel(filePath), bytes: stat.size, mb: Number((stat.size / 1024 / 1024).toFixed(2)) });
    } catch {
      // ignored
    }
  });
  return files.sort((a, b) => b.bytes - a.bytes).slice(0, limit);
}

function deployFindings(directorySizes) {
  const syncScript = readTextIfExists(path.join(ROOT, "deploy_sync.ps1"));
  const deployReport = readTextIfExists(path.join(ROOT, "DEPLOY_FOLDER_REPORT.md"));
  const teneoPath = path.join(ROOT, "DEPLOY_CLOUDFLARE", "teneo-protocol.ai");
  const nestedPublicPath = path.join(ROOT, "DEPLOY_PUBLIC", "DEPLOY_PUBLIC");
  const findings = [];

  function sizeFor(name) {
    return directorySizes.find((entry) => entry.name === name)?.mb || 0;
  }

  findings.push({
    severity: "high",
    area: "Duplicate deployment tree",
    finding: "DEPLOY_CLOUDFLARE exists even though project docs say DEPLOY_PUBLIC is the canonical deploy folder.",
    evidence: `DEPLOY_CLOUDFLARE size: ${sizeFor("DEPLOY_CLOUDFLARE")} MB.`,
    recommendation: "Do not delete yet. Confirm Cloudflare is not using this path, then archive or remove it in a separate cleanup commit.",
  });

  if (fileExists(teneoPath)) {
    findings.push({
      severity: "high",
      area: "Nested app copy",
      finding: "DEPLOY_CLOUDFLARE/teneo-protocol.ai is a full Next.js project copy with its own app, src, .git, .next, and node_modules.",
      evidence: "This is untracked in the current git status and accounts for most local bloat.",
      recommendation: "Human review before removal. If it is not this site's source of truth, move it outside this repo or delete after backup.",
    });
  }

  if (fileExists(nestedPublicPath)) {
    findings.push({
      severity: "medium",
      area: "Nested static deploy",
      finding: "DEPLOY_PUBLIC/DEPLOY_PUBLIC contains a nested copy of generated pages.",
      evidence: "This creates duplicate production-like routes under /DEPLOY_PUBLIC/ if deployed.",
      recommendation: "Remove from deploy output after confirming deploy_sync/build scripts no longer generate it.",
    });
  }

  if (syncScript.includes("C:\\Users\\tempv2\\Desktop\\PortfolioAgent")) {
    findings.push({
      severity: "high",
      area: "Deployment script",
      finding: "deploy_sync.ps1 uses the old Desktop path instead of the current repo path.",
      evidence: "Hardcoded SourceRoot points at C:\\Users\\tempv2\\Desktop\\PortfolioAgent.",
      recommendation: "Update the script to derive SourceRoot from $PSScriptRoot before running future syncs.",
    });
  }

  if (syncScript.includes("DEPLOY_CLOUDFLARE")) {
    findings.push({
      severity: "medium",
      area: "Deployment script",
      finding: "deploy_sync.ps1 still contains a final sync into DEPLOY_CLOUDFLARE.",
      evidence: "This conflicts with README_DEPLOY.md guidance that only DEPLOY_PUBLIC is canonical.",
      recommendation: "Remove or gate this sync once Cloudflare configuration is confirmed.",
    });
  }

  if (deployReport.includes("C:\\Users\\tempv2\\Desktop\\PortfolioAgent")) {
    findings.push({
      severity: "low",
      area: "Documentation",
      finding: "DEPLOY_FOLDER_REPORT.md records stale Desktop paths.",
      evidence: "Current workspace is C:\\Users\\tempv2\\PortfolioAgent.",
      recommendation: "Update the report after the cleanup plan is approved.",
    });
  }

  findings.push({
    severity: "info",
    area: "Rebuildable bulk",
    finding: "node_modules and .next caches are rebuildable, but should not be deleted until package/install workflow is confirmed.",
    evidence: "Largest files include Next/SWC binaries, webpack cache packs, and Git packfiles.",
    recommendation: "Clean generated caches only in a separate commit or local-only cleanup step.",
  });

  return findings;
}

function summarize(records, directorySizes, largestFiles, findings) {
  const byStatus = {};
  const byClass = {};
  for (const record of records) {
    const status = record.check?.status || (record.classification === "placeholder" ? "placeholder" : "unchecked");
    byStatus[status] = (byStatus[status] || 0) + 1;
    byClass[record.classification] = (byClass[record.classification] || 0) + 1;
  }

  return {
    generated_at: new Date().toISOString(),
    root: ROOT,
    branch: git("branch --show-current"),
    git_status_short: git("status --short --branch"),
    total_records: records.length,
    unique_checked_records: records.filter((record) => record.check).length,
    by_status: byStatus,
    by_classification: byClass,
    largest_directories: directorySizes.slice(0, 12),
    largest_files: largestFiles.slice(0, 20),
    high_priority_findings: findings.filter((finding) => ["high", "medium"].includes(finding.severity)).length,
  };
}

function uiUxSuggestions(records) {
  const brokenGoogle = records.filter((record) => record.classification.startsWith("google-") && ["broken", "auth_required"].includes(record.check?.status)).length;
  const brokenInternal = records.filter((record) => record.classification === "internal" && record.check?.status === "broken").length;
  const placeholderCount = records.filter((record) => record.classification === "placeholder").length;

  return [
    {
      priority: "high",
      area: "Resource trust",
      suggestion: "Add visible resource status labels for docs that are public, private, missing, or awaiting replacement.",
      evidence: `${brokenGoogle} Google resource links currently need replacement, re-sharing, or confirmation.`,
    },
    {
      priority: "high",
      area: "Quest/resource modals",
      suggestion: "Make modal CTAs field-aware: Quest, Website, Docs, App, Social, and Source Doc should be visibly distinct instead of one generic action.",
      evidence: "Quest data contains nested links that are not all surfaced equally in the current modal flow.",
    },
    {
      priority: "medium",
      area: "Navigation reliability",
      suggestion: "Resolve stale internal routes before visual redesign work.",
      evidence: `${brokenInternal} internal links did not resolve against DEPLOY_PUBLIC.`,
    },
    {
      priority: "medium",
      area: "Placeholders",
      suggestion: "Hide empty or placeholder social/action buttons instead of rendering disabled-looking links.",
      evidence: `${placeholderCount} empty, #, or N/A link-like values were found in source/data.`,
    },
    {
      priority: "medium",
      area: "Portfolio scanning",
      suggestion: "Add filters for Work type, proof asset type, live/dead proof, and replacement needed so reviewers can triage faster.",
      evidence: "The audit naturally segments links by source page/modal and recommended action.",
    },
  ];
}

function actionBuckets(records) {
  return [
    {
      name: "Replace or re-share Google resources",
      records: records.filter((record) => record.classification.startsWith("google-") && ["broken", "auth_required"].includes(record.check?.status)),
    },
    {
      name: "Fix internal routes",
      records: records.filter((record) => record.classification === "internal" && record.check?.status === "broken"),
    },
    {
      name: "Leave Layer3 links alone unless approved",
      records: records.filter((record) => record.classification === "layer3" && record.check?.status !== "live"),
    },
    {
      name: "Retry with browser or manual review",
      records: records.filter((record) => ["timeout", "unknown", "error"].includes(record.check?.status)),
    },
    {
      name: "No action needed",
      records: records.filter((record) => record.check?.status === "live"),
    },
  ].map((bucket) => ({
    name: bucket.name,
    count: bucket.records.length,
    sample: bucket.records.slice(0, 12).map((record) => ({
      url: record.url,
      classification: record.classification,
      status: record.check?.status || "",
      item_title: record.item_title,
      field: record.field,
      source_path: record.source_path,
    })),
  }));
}

function renderDashboard(data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portfolio Link and Cleanup Audit</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0b0f14;
      --panel: #121820;
      --panel-2: #17212c;
      --text: #edf2f7;
      --muted: #95a3b8;
      --line: #263445;
      --good: #45c486;
      --bad: #ff6b6b;
      --warn: #f6bd60;
      --info: #76a9fa;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 14px/1.45 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    header {
      position: sticky;
      top: 0;
      z-index: 5;
      border-bottom: 1px solid var(--line);
      background: rgba(11, 15, 20, 0.94);
      backdrop-filter: blur(10px);
    }
    .wrap { max-width: 1440px; margin: 0 auto; padding: 22px; }
    h1, h2, h3 { margin: 0; letter-spacing: 0; }
    h1 { font-size: 24px; }
    h2 { font-size: 18px; margin: 28px 0 12px; }
    h3 { font-size: 15px; }
    p { margin: 6px 0; color: var(--muted); }
    .grid { display: grid; gap: 12px; }
    .cards { grid-template-columns: repeat(5, minmax(0, 1fr)); margin-top: 18px; }
    .two { grid-template-columns: 1fr 1fr; }
    .card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
    }
    .metric { font-size: 24px; font-weight: 750; }
    .muted { color: var(--muted); }
    .controls {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 10px;
      margin: 14px 0;
    }
    input, select {
      width: 100%;
      border: 1px solid var(--line);
      background: var(--panel-2);
      color: var(--text);
      border-radius: 6px;
      padding: 10px;
      font: inherit;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      padding: 9px 10px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
    }
    th { color: var(--muted); font-size: 12px; font-weight: 650; background: #101720; position: sticky; top: 83px; }
    td a { color: #a8c7ff; word-break: break-all; }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid var(--line);
      color: var(--muted);
      white-space: nowrap;
      font-size: 12px;
    }
    .live { color: var(--good); border-color: rgba(69,196,134,.45); }
    .broken, .error { color: var(--bad); border-color: rgba(255,107,107,.5); }
    .auth_required, .timeout, .unknown { color: var(--warn); border-color: rgba(246,189,96,.5); }
    .placeholder, .unchecked { color: var(--info); border-color: rgba(118,169,250,.45); }
    .findings { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .finding { min-height: 136px; }
    .severity { text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--warn); }
    .list { display: grid; gap: 8px; }
    .list-item { border: 1px solid var(--line); border-radius: 8px; padding: 10px; background: var(--panel); }
    code { color: #d4e6ff; }
    @media (max-width: 980px) {
      .cards, .two, .findings, .controls { grid-template-columns: 1fr; }
      th { position: static; }
    }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <h1>Portfolio Link and Cleanup Audit</h1>
      <p id="subtitle"></p>
    </div>
  </header>
  <main class="wrap">
    <section class="grid cards" id="cards"></section>

    <section>
      <h2>Cleanup Findings</h2>
      <div class="grid findings" id="findings"></div>
    </section>

    <section>
      <h2>Action Buckets</h2>
      <div class="grid two" id="buckets"></div>
    </section>

    <section>
      <h2>Link Inventory</h2>
      <div class="controls">
        <input id="q" placeholder="Search title, URL, source, field, recommendation">
        <select id="status"></select>
        <select id="kind"></select>
        <select id="sourceKind"></select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Kind</th>
            <th>Item</th>
            <th>URL</th>
            <th>Source</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
    </section>

    <section>
      <h2>Largest Local Size Contributors</h2>
      <div class="grid two">
        <div class="card"><h3>Directories</h3><div id="dirs" class="list"></div></div>
        <div class="card"><h3>Files</h3><div id="files" class="list"></div></div>
      </div>
    </section>

    <section>
      <h2>Next UI/UX Pass</h2>
      <div class="grid findings" id="ux"></div>
    </section>
  </main>
  <script id="audit-data" type="application/json">${json}</script>
  <script>
    const data = JSON.parse(document.getElementById('audit-data').textContent);
    const records = data.records;
    const $ = (id) => document.getElementById(id);
    const statusOf = (record) => record.check?.status || record.classification;
    const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

    $('subtitle').textContent = data.summary.root + ' | branch ' + data.summary.branch + ' | generated ' + data.summary.generated_at;

    const cardData = [
      ['Records', data.summary.total_records],
      ['Checked', data.summary.unique_checked_records],
      ['Live', data.summary.by_status.live || 0],
      ['Needs review', (data.summary.by_status.broken || 0) + (data.summary.by_status.auth_required || 0) + (data.summary.by_status.error || 0) + (data.summary.by_status.timeout || 0)],
      ['Cleanup findings', data.summary.high_priority_findings],
    ];
    $('cards').innerHTML = cardData.map(([label, value]) => '<div class="card"><div class="metric">' + esc(value) + '</div><p>' + esc(label) + '</p></div>').join('');

    $('findings').innerHTML = data.cleanup_findings.map(item => '<article class="card finding"><div class="severity">' + esc(item.severity) + ' | ' + esc(item.area) + '</div><h3>' + esc(item.finding) + '</h3><p>' + esc(item.evidence) + '</p><p>' + esc(item.recommendation) + '</p></article>').join('');

    $('buckets').innerHTML = data.action_buckets.map(bucket => '<div class="card"><h3>' + esc(bucket.name) + ' (' + bucket.count + ')</h3><div class="list">' + bucket.sample.map(item => '<div class="list-item"><span class="pill ' + esc(item.status) + '">' + esc(item.status) + '</span> <span class="muted">' + esc(item.classification) + '</span><p>' + esc(item.item_title || item.field || item.source_path) + '</p><a href="' + esc(item.url) + '" target="_blank" rel="noreferrer">' + esc(item.url) + '</a></div>').join('') + '</div></div>').join('');

    const statusValues = ['all', ...new Set(records.map(statusOf).sort())];
    const kindValues = ['all', ...new Set(records.map(r => r.classification).sort())];
    const sourceValues = ['all', ...new Set(records.map(r => r.source_kind).sort())];
    $('status').innerHTML = statusValues.map(v => '<option value="' + esc(v) + '">' + esc(v) + '</option>').join('');
    $('kind').innerHTML = kindValues.map(v => '<option value="' + esc(v) + '">' + esc(v) + '</option>').join('');
    $('sourceKind').innerHTML = sourceValues.map(v => '<option value="' + esc(v) + '">' + esc(v) + '</option>').join('');

    function renderRows() {
      const q = $('q').value.trim().toLowerCase();
      const status = $('status').value;
      const kind = $('kind').value;
      const sourceKind = $('sourceKind').value;
      const filtered = records.filter(record => {
        const haystack = [record.url, record.source_path, record.item_title, record.field, record.page_or_modal, record.recommendation].join(' ').toLowerCase();
        return (!q || haystack.includes(q)) &&
          (status === 'all' || statusOf(record) === status) &&
          (kind === 'all' || record.classification === kind) &&
          (sourceKind === 'all' || record.source_kind === sourceKind);
      }).slice(0, 1200);

      $('rows').innerHTML = filtered.map(record => {
        const statusText = statusOf(record);
        const source = record.source_line ? record.source_path + ':' + record.source_line : record.source_path;
        const title = record.item_title || record.page_or_modal || '';
        const url = /^https?:/.test(record.url) ? '<a href="' + esc(record.url) + '" target="_blank" rel="noreferrer">' + esc(record.url) + '</a>' : '<code>' + esc(record.url) + '</code>';
        return '<tr><td><span class="pill ' + esc(statusText) + '">' + esc(statusText) + '</span></td><td>' + esc(record.classification) + '</td><td><strong>' + esc(title) + '</strong><p>' + esc(record.field) + '</p></td><td>' + url + '<p>' + esc(record.check?.reason || record.note || '') + '</p></td><td><code>' + esc(source) + '</code><p>' + esc(record.source_kind) + '</p></td><td>' + esc(record.recommendation || '') + '</td></tr>';
      }).join('');
    }
    ['q', 'status', 'kind', 'sourceKind'].forEach(id => $(id).addEventListener('input', renderRows));
    renderRows();

    $('dirs').innerHTML = data.summary.largest_directories.map(item => '<div class="list-item"><strong>' + esc(item.mb) + ' MB</strong><p><code>' + esc(item.path) + '</code></p></div>').join('');
    $('files').innerHTML = data.summary.largest_files.map(item => '<div class="list-item"><strong>' + esc(item.mb) + ' MB</strong><p><code>' + esc(item.path) + '</code></p></div>').join('');
    $('ux').innerHTML = data.ui_ux_suggestions.map(item => '<article class="card finding"><div class="severity">' + esc(item.priority) + ' | ' + esc(item.area) + '</div><h3>' + esc(item.suggestion) + '</h3><p>' + esc(item.evidence) + '</p></article>').join('');
  </script>
</body>
</html>
`;
}

async function main() {
  ensureOutDir();

  const rawRecords = [];
  extractStructuredQuests(rawRecords);
  extractStructuredResources(rawRecords);
  scanFiles(rawRecords);

  const records = uniqueByUrl(rawRecords);
  const placeholders = rawRecords.filter((record) => record.classification === "placeholder");
  const toCheck = records.filter((record) => !["placeholder", "anchor", "script", "data-uri", "email", "phone", "invalid", "parse-error"].includes(record.classification));
  const selected = MAX_CHECKS > 0 ? toCheck.slice(0, MAX_CHECKS) : toCheck;

  console.log(`Collected ${rawRecords.length} raw link-like records.`);
  console.log(`Deduped to ${records.length} unique check records plus ${placeholders.length} placeholder records.`);
  console.log(`Checking ${selected.length} links with concurrency ${CHECK_CONCURRENCY} and timeout ${CHECK_TIMEOUT_MS}ms.`);

  await mapConcurrent(selected, async (record, index) => {
    if (record.classification === "internal") {
      record.check = resolveInternal(record);
    } else {
      record.check = await checkExternal(record);
    }
    record.recommendation = recommend(record);
    if ((index + 1) % 25 === 0 || index + 1 === selected.length) {
      console.log(`Checked ${index + 1}/${selected.length}`);
    }
  }, CHECK_CONCURRENCY);

  for (const record of records) {
    if (!record.recommendation) record.recommendation = recommend(record);
  }

  const placeholderRecords = placeholders.map((record) => ({
    ...record,
    check: { status: "placeholder", reason: record.note || "Placeholder value." },
    recommendation: "Hide or remove placeholder UI if this is rendered.",
  }));

  const allRecords = [...records, ...placeholderRecords].sort((a, b) => {
    const priority = { broken: 0, auth_required: 1, error: 2, timeout: 3, unknown: 4, placeholder: 5, live: 9 };
    return (priority[a.check?.status] ?? 6) - (priority[b.check?.status] ?? 6) || a.classification.localeCompare(b.classification);
  });

  const directorySizes = collectDirectorySizes();
  const largestFiles = collectLargestFiles();
  const cleanupFindings = deployFindings(directorySizes);
  const data = {
    summary: summarize(allRecords, directorySizes, largestFiles, cleanupFindings),
    cleanup_findings: cleanupFindings,
    action_buckets: actionBuckets(allRecords),
    ui_ux_suggestions: uiUxSuggestions(allRecords),
    records: allRecords,
  };

  fs.writeFileSync(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  fs.writeFileSync(OUT_DASHBOARD, renderDashboard(data), "utf8");

  console.log(`Wrote ${rel(OUT_JSON)}`);
  console.log(`Wrote ${rel(OUT_DASHBOARD)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
