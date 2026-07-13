import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AUDIT_DIR = path.join(ROOT, "audits", "site-audit");
const GOOGLE_REVIEW_JSON = path.join(AUDIT_DIR, "google-links-review.json");
const AUDIT_JSON = path.join(AUDIT_DIR, "audit-results.json");
const REF_DOCS_DIR = path.join(ROOT, "Ref Docs");
const OUT_JSON = path.join(AUDIT_DIR, "resource-preservation-manifest.json");
const OUT_CSV = path.join(AUDIT_DIR, "resource-preservation-manifest.csv");
const OUT_HTML = path.join(AUDIT_DIR, "resource-preservation-manifest.html");

const STRUCTURED_SOURCE_FILES = [
  "assets/js/some_work_data.js",
  "assets/js/marketing_full_data.js",
  "assets/js/email_outreach_data.js",
  "assets/js/quests_data.js",
  "assets/resources_data.js",
];

const GOOGLE_URL_RE = /https:\/\/(?:docs|drive|forms)\.google\.com\/[^\s"'<>\\)]+/g;
const STOP_WORDS = new Set([
  "about",
  "access",
  "active",
  "all",
  "and",
  "are",
  "asset",
  "assets",
  "blog",
  "case",
  "content",
  "copy",
  "data",
  "doc",
  "docs",
  "drive",
  "edit",
  "file",
  "for",
  "from",
  "google",
  "internal",
  "klint",
  "link",
  "links",
  "marketing",
  "new",
  "pdf",
  "portfolio",
  "project",
  "projects",
  "resources",
  "sheet",
  "shared",
  "source",
  "template",
  "templates",
  "that",
  "the",
  "this",
  "taylor",
  "taylorryanportfolio",
  "url",
  "with",
  "work",
  "workflow",
]);

const TYPE_EXTENSIONS = {
  "google-doc": new Set([".docx", ".pdf", ".txt", ".md"]),
  "google-sheet": new Set([".xlsx", ".csv"]),
  "google-slide": new Set([".pptx", ".pdf"]),
  "google-drive": new Set([".png", ".jpg", ".jpeg", ".jfif", ".pdf", ".docx", ".xlsx", ".csv", ".txt", ".md", ".pptx"]),
  "google-form": new Set([]),
};

function normalizeSlash(value) {
  return String(value ?? "").replace(/\\/g, "/");
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function jsData(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function stripHtml(value) {
  return String(value ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function snippet(value, maxLength = 220) {
  const text = stripHtml(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trim()}...`;
}

function compactWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function plain(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  const out = new Set();
  for (const token of plain(value).split(" ")) {
    if (!token || token.length < 3 || STOP_WORDS.has(token)) continue;
    out.add(token.endsWith("s") && token.length > 4 ? token.slice(0, -1) : token);
  }
  return out;
}

function tokenCount(value) {
  return plain(value).split(" ").filter(Boolean).length;
}

function firstValue(object, keys) {
  for (const key of keys) {
    const value = object?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function splitPipe(value) {
  return String(value ?? "")
    .split("|")
    .map((item) => compactWhitespace(item))
    .filter(Boolean);
}

function trimUrl(value) {
  return String(value ?? "").trim().replace(/[),.;]+$/g, "");
}

function extractGoogleFileId(url) {
  const text = trimUrl(url);
  const patterns = [
    /\/(?:document|spreadsheets|presentation)\/d\/([^/?#]+)/i,
    /\/forms\/d\/e\/([^/?#]+)/i,
    /\/forms\/d\/([^/?#]+)/i,
    /\/file\/d\/([^/?#]+)/i,
    /\/drive\/folders\/([^/?#]+)/i,
    /[?&]id=([^&#]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }

  return "";
}

function classifyFamily(row, context) {
  const source = row.primary_source || row.all_sources || "";
  const text = `${source} ${context.section || ""} ${context.category || ""} ${context.project || ""}`.toLowerCase();
  if (text.includes("quest")) return "Quests";
  if (text.includes("email")) return "Email Outreach";
  if (text.includes("speaker") || text.includes("testimonial")) return "Public Speaking";
  if (text.includes("overview_blog") || text.includes("writing")) return "Writing";
  if (text.includes("social") || text.includes("some_work") || text.includes("some work")) return "Social / Some Work";
  if (text.includes("marketing") || text.includes("affiliate") || text.includes("creator")) return "Marketing Resources";
  if (text.includes("resource")) return "Resources";
  return "General Portfolio";
}

function publicAction(row) {
  if (row.public_state === "working_public") return "keep public link";
  if (row.public_state === "not_public_auth_required") return "re-share from an accessible account, replace, or hide";
  if (row.public_state === "not_working_broken") return "replace or hide public button";
  return "retry manually before deciding";
}

function parseJsonLiteral(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const firstArray = text.indexOf("[");
  const firstObject = text.indexOf("{");
  const starts = [firstArray, firstObject].filter((item) => item >= 0).sort((a, b) => a - b);
  if (!starts.length) return null;

  const start = starts[0];
  const open = text[start];
  const close = open === "[" ? "]" : "}";
  const end = text.lastIndexOf(close);
  if (end <= start) return null;

  return JSON.parse(text.slice(start, end + 1));
}

function objectContext(object) {
  if (!object || typeof object !== "object" || Array.isArray(object)) return {};

  return {
    title: firstValue(object, ["title", "Title", "resource", "Resource", "name", "Name", "Project Name"]),
    id: firstValue(object, ["id", "slug"]),
    label: firstValue(object, ["label", "Label"]),
    description: snippet(firstValue(object, ["description", "Description", "summary", "Summary", "post_text", "Post Text", "excerpt", "Excerpt"])),
    project: firstValue(object, ["project", "Project", "client", "Client"]),
    category: firstValue(object, ["category", "Category", "theme", "Theme", "industry", "Industry"]),
    section: firstValue(object, ["section", "Section", "sheet_name", "Sheet", "sheet"]),
    type: firstValue(object, ["type", "Type", "format_inferred", "Format"]),
    status: firstValue(object, ["status", "Status", "isLive"]),
    owner: firstValue(object, ["owner", "Owner"]),
    source_file: firstValue(object, ["source_file", "filename", "Filename", "file", "workbook"]),
  };
}

function mergeContexts(contexts) {
  const merged = {};
  const fields = ["title", "id", "label", "description", "project", "category", "section", "type", "status", "owner", "source_file"];
  for (const field of fields) {
    const values = [];
    for (const context of contexts) {
      const value = context?.[field];
      if (value && !values.includes(value)) values.push(value);
    }
    merged[field] = values.join(" | ");
  }
  return merged;
}

function addContext(map, fileId, context) {
  if (!fileId) return;
  const list = map.get(fileId) || [];
  const key = ["source_path", "title", "label", "source_file", "section", "category"].map((field) => context[field] || "").join("|");
  if (!list.some((item) => ["source_path", "title", "label", "source_file", "section", "category"].map((field) => item[field] || "").join("|") === key)) {
    list.push(context);
  }
  map.set(fileId, list);
}

function walkStructured(value, sourcePath, contextByFileId, ancestors = [], keyPath = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStructured(item, sourcePath, contextByFileId, ancestors, [...keyPath, String(index)]));
    return;
  }

  if (value && typeof value === "object") {
    const context = objectContext(value);
    const hasContext = Object.values(context).some(Boolean);
    const nextAncestors = hasContext ? [context, ...ancestors] : ancestors;
    for (const [key, child] of Object.entries(value)) {
      walkStructured(child, sourcePath, contextByFileId, nextAncestors, [...keyPath, key]);
    }
    return;
  }

  if (typeof value !== "string" || !value.includes("google.com")) return;

  const urls = value.match(GOOGLE_URL_RE) || [];
  for (const url of urls) {
    const fileId = extractGoogleFileId(url);
    const merged = mergeContexts(ancestors);
    addContext(contextByFileId, fileId, {
      ...merged,
      source_path: sourcePath,
      field_path: keyPath.join("."),
      raw_url: trimUrl(url),
    });
  }
}

function loadStructuredContexts() {
  const contextByFileId = new Map();
  const parse_errors = [];

  for (const relativePath of STRUCTURED_SOURCE_FILES) {
    const absolutePath = path.join(ROOT, relativePath);
    if (!fs.existsSync(absolutePath)) continue;
    try {
      const data = parseJsonLiteral(absolutePath);
      walkStructured(data, relativePath, contextByFileId);
    } catch (error) {
      parse_errors.push({ source_path: relativePath, error: error.message });
    }
  }

  return { contextByFileId, parse_errors };
}

function resolveSourcePath(sourcePath) {
  const normalized = normalizeSlash(sourcePath);
  const candidates = [
    normalized,
    normalized.replace(/^DEPLOY_PUBLIC\//, ""),
    normalized.replace(/^DEPLOY_PUBLIC\//, "assets/"),
  ];

  for (const candidate of candidates) {
    const absolutePath = path.join(ROOT, candidate);
    if (fs.existsSync(absolutePath)) return absolutePath;
  }

  return "";
}

function lineContext(row) {
  const line = Number(row.source_line);
  if (!Number.isFinite(line) || line <= 0) return {};
  const absolutePath = resolveSourcePath(row.primary_source);
  if (!absolutePath) return {};

  const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
  const start = Math.max(0, line - 35);
  const end = Math.min(lines.length, line + 35);
  const windowText = lines.slice(start, end).join("\n");
  const pairRe = /["']?([A-Za-z0-9_ #%./-]{2,60})["']?\s*:\s*["']([^"'\n]{1,260})["']/g;
  const found = {};

  for (const match of windowText.matchAll(pairRe)) {
    const key = plain(match[1]).replace(/\s+/g, "_");
    const value = compactWhitespace(match[2]);
    if (!value || found[key]) continue;
    found[key] = value;
  }

  return {
    title: found.title || found.resource || found.name || found.project_name || found.id || "",
    label: found.label || "",
    description: snippet(found.description || found.summary || found.post_text || ""),
    project: found.project || "",
    category: found.category || found.theme || found.industry || "",
    section: found.section || found.sheet_name || "",
    type: found.type || found.format_inferred || "",
    status: found.status || "",
    owner: found.owner || "",
    source_file: found.source_file || found.filename || "",
  };
}

function loadAuditByFileId() {
  if (!fs.existsSync(AUDIT_JSON)) return new Map();
  const audit = JSON.parse(fs.readFileSync(AUDIT_JSON, "utf8"));
  const out = new Map();

  for (const record of audit.records || []) {
    if (!record.classification?.startsWith("google-")) continue;
    const fileId = extractGoogleFileId(record.url);
    if (fileId && !out.has(fileId)) out.set(fileId, record);
  }

  return out;
}

function hashFile(absolutePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(absolutePath));
  return hash.digest("hex");
}

function inventoryRefDocs() {
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }
      if (!entry.isFile()) continue;

      const stats = fs.statSync(absolutePath);
      const ext = path.extname(entry.name).toLowerCase();
      const stem = path.basename(entry.name, ext);
      const relative_path = normalizeSlash(path.relative(ROOT, absolutePath));
      const ref_relative_path = normalizeSlash(path.relative(REF_DOCS_DIR, absolutePath));
      const searchText = `${relative_path} ${stem}`;
      files.push({
        relative_path,
        ref_relative_path,
        filename: entry.name,
        stem,
        ext,
        size_bytes: stats.size,
        modified_at: stats.mtime.toISOString(),
        sha256: hashFile(absolutePath),
        plain_stem: plain(stem),
        plain_path: plain(relative_path),
        tokens: [...tokens(searchText)],
      });
    }
  }

  if (fs.existsSync(REF_DOCS_DIR)) walk(REF_DOCS_DIR);
  return files.sort((a, b) => a.relative_path.localeCompare(b.relative_path));
}

function expectedExtensions(rowType, context, row) {
  if (rowType !== "google-drive") return TYPE_EXTENSIONS[rowType] || new Set();

  const rawHint = [context.title, context.label, context.type, row.fields].join(" ").toLowerCase();
  const hint = plain(rawHint);
  if (/\bfolder\b/.test(hint)) return new Set();
  if (/\b(pdf|ebook)\b/.test(hint)) return new Set([".pdf"]);
  if (/\b(doc|document|brief|prompt|guide)\b/.test(hint) || /\[(doc|document)\]/i.test(rawHint)) return new Set([".docx", ".pdf", ".txt", ".md"]);
  if (/\b(spreadsheet|workbook|csv|table)\b/.test(hint) || /\[(sheet|spreadsheet)\]/i.test(rawHint)) return new Set([".xlsx", ".csv"]);
  if (/\b(slide|slides|deck|presentation|ppt)\b/.test(hint)) return new Set([".pptx", ".pdf"]);
  if (/\b(image|photo|graphic|visual|landscape|square|vertical|banner|logo|headshot)\b/.test(hint)) {
    return new Set([".png", ".jpg", ".jpeg", ".jfif"]);
  }

  return new Set([".png", ".jpg", ".jpeg", ".jfif", ".pdf", ".docx", ".pptx", ".txt", ".md"]);
}

function compatibleArtifact(rowType, file, context, row) {
  return expectedExtensions(rowType, context, row).has(file.ext);
}

function sourcePathsInRefDocs(row) {
  return splitPipe(row.all_sources)
    .filter((source) => normalizeSlash(source).startsWith("Ref Docs/"))
    .filter((source) => fs.existsSync(path.join(ROOT, source)))
    .map(normalizeSlash);
}

function sourceFileCandidates(context) {
  const out = [];
  for (const source of splitPipe(context.source_file)) {
    if (source) out.push(source);
  }
  return [...new Set(out)];
}

function domainHint(row, context) {
  const family = classifyFamily(row, context).toLowerCase();
  if (family.includes("quest")) return "quest";
  if (family.includes("email")) return "email";
  if (family.includes("speaking")) return "speaker";
  if (family.includes("writing")) return "writing";
  if (family.includes("social")) return "social";
  if (family.includes("marketing")) return "marketing";
  return "";
}

function scoreCandidate(row, context, localSourcePaths, file) {
  let score = 0;
  let artifactEvidence = false;
  const signals = [];
  const compatible = compatibleArtifact(row.type, file, context, row);
  const listedLocalSource = localSourcePaths.includes(file.relative_path);
  const filePlain = `${file.plain_stem} ${file.plain_path}`;
  const titlePlain = plain(context.title || row.item_titles);
  const labelPlain = plain(context.label);
  const domain = domainHint(row, context);

  if (listedLocalSource) {
    score += 62;
    signals.push("listed local source/index path");
  }

  for (const sourceFile of sourceFileCandidates(context)) {
    const sourceExt = path.extname(sourceFile).toLowerCase();
    const sourceStem = plain(path.basename(sourceFile, sourceExt));
    if (!sourceStem) continue;
    if (file.plain_stem === sourceStem) {
      score += compatible ? 86 : 50;
      if (compatible) artifactEvidence = true;
      signals.push(compatible ? "exact source filename match" : "exact source index filename match");
    } else if (file.plain_stem.includes(sourceStem) || sourceStem.includes(file.plain_stem)) {
      score += compatible ? 60 : 32;
      if (compatible) artifactEvidence = true;
      signals.push(compatible ? "near source filename match" : "near source index filename match");
    }
  }

  if (titlePlain) {
    if (file.plain_stem === titlePlain) {
      score += compatible ? 82 : 42;
      if (compatible) artifactEvidence = true;
      signals.push("exact title filename match");
    } else if (
      (file.plain_stem.includes(titlePlain) || titlePlain.includes(file.plain_stem)) &&
      Math.min(file.plain_stem.length, titlePlain.length) >= 16 &&
      Math.min(tokenCount(file.plain_stem), tokenCount(titlePlain)) >= 2
    ) {
      score += compatible ? 58 : 28;
      if (compatible) artifactEvidence = true;
      signals.push("near title filename match");
    }
  }

  if (labelPlain && file.plain_stem.includes(labelPlain)) {
    score += compatible ? 18 : 8;
    signals.push("link label appears in filename");
  }

  const rowTokenText = [
    context.title,
    context.label,
    context.description,
    context.project,
    context.category,
    context.section,
    context.type,
    context.source_file,
    row.item_titles,
    row.fields,
  ].join(" ");
  const rowTokens = tokens(rowTokenText);
  const common = [...rowTokens].filter((token) => file.tokens.includes(token));
  if (common.length) {
    const overlapScore = Math.min(34, common.length * 5 + (common.length / Math.max(1, rowTokens.size)) * 16);
    score += compatible ? overlapScore : overlapScore * 0.55;
    if (compatible && common.length >= 3) artifactEvidence = true;
    signals.push(`token overlap: ${common.slice(0, 5).join(", ")}`);
  }

  if (domain && filePlain.includes(domain)) {
    score += 10;
    signals.push(`domain path hint: ${domain}`);
  }

  if (compatible) {
    score += 8;
    signals.push("compatible file type");
  }

  const role = compatible && (!listedLocalSource || artifactEvidence) ? "artifact_candidate" : "source_index_candidate";
  return {
    ...file,
    score: Math.min(100, Math.round(score)),
    role,
    signals: signals.slice(0, 5),
  };
}

function matchOffline(row, context, files) {
  const localSourcePaths = sourcePathsInRefDocs(row);
  const candidates = files
    .map((file) => scoreCandidate(row, context, localSourcePaths, file))
    .filter((candidate) => candidate.score >= 24)
    .sort((a, b) => b.score - a.score || a.relative_path.localeCompare(b.relative_path))
    .slice(0, 5);

  const artifact = candidates.find((candidate) => candidate.role === "artifact_candidate");
  const sourceIndex = candidates.find((candidate) => candidate.role === "source_index_candidate");
  let status = "missing_artifact";

  if (artifact?.score >= 70) {
    status = "matched_artifact";
  } else if (artifact?.score >= 38) {
    status = "possible_artifact";
  } else if (sourceIndex?.score >= 45 || localSourcePaths.length) {
    status = "source_index_only";
  }

  return {
    offline_match_status: status,
    local_source_paths: localSourcePaths,
    best_candidate: candidates[0] || null,
    candidates,
  };
}

function preservationAction(row, offline) {
  if (row.public_state === "working_public") {
    if (offline.offline_match_status === "matched_artifact") return "keep link; local archive appears available";
    return "keep link; optional future local archive";
  }

  if (offline.offline_match_status === "matched_artifact") {
    return "review local artifact, then replace or re-share";
  }

  if (offline.offline_match_status === "possible_artifact") {
    return "review candidate offline file before changing link";
  }

  if (offline.offline_match_status === "source_index_only") {
    return "preserve source index; recover/export actual artifact";
  }

  return "preserve manifest row; decide hide vs recreate";
}

function futureSyncAction(row, offline) {
  if (row.public_state === "working_public") return "Export a local copy later if this artifact should be preserved offline.";
  if (offline.offline_match_status === "matched_artifact") return "Use the local artifact as the replacement source after manual approval.";
  if (offline.offline_match_status === "possible_artifact") return "Open the candidate file and confirm it is the same artifact before replacing the URL.";
  if (offline.offline_match_status === "source_index_only") return "The local file preserves the row/source list, not necessarily the artifact content; recover or recreate before deleting.";
  return "No likely offline artifact found; keep the manifest record and decide whether to hide the public link or rebuild the resource.";
}

function bestContextForRow(row, contextByFileId) {
  const fileId = extractGoogleFileId(row.url);
  const structured = contextByFileId.get(fileId) || [];
  const sourceHints = splitPipe(row.all_sources);
  const preferred =
    structured.find((context) => sourceHints.some((source) => normalizeSlash(source).endsWith(normalizeSlash(context.source_path)))) ||
    structured[0] ||
    {};
  const fallback = lineContext(row);
  const auditTitle = splitPipe(row.item_titles).join(" | ");
  const merged = mergeContexts([
    { title: auditTitle },
    preferred,
    fallback,
  ]);

  if (!merged.title) merged.title = fileId ? `Google resource ${fileId}` : row.url;
  return { fileId, context: merged };
}

function countBy(rows, getter) {
  const out = {};
  for (const row of rows) {
    const key = typeof getter === "function" ? getter(row) : row[getter];
    out[key || "unknown"] = (out[key || "unknown"] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(out).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function nestedSourceSummary(rows) {
  const out = {};
  for (const row of rows) {
    const key = row.primary_source || "unknown";
    out[key] ||= { total: 0, public_state: {}, offline_match_status: {} };
    out[key].total += 1;
    out[key].public_state[row.public_state] = (out[key].public_state[row.public_state] || 0) + 1;
    out[key].offline_match_status[row.offline_match_status] = (out[key].offline_match_status[row.offline_match_status] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(out).sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0])));
}

function inventorySummary(files) {
  const by_extension = {};
  let total_size_bytes = 0;
  for (const file of files) {
    by_extension[file.ext || "(none)"] ||= { count: 0, size_bytes: 0 };
    by_extension[file.ext || "(none)"].count += 1;
    by_extension[file.ext || "(none)"].size_bytes += file.size_bytes;
    total_size_bytes += file.size_bytes;
  }

  return {
    total_files: files.length,
    total_size_bytes,
    by_extension: Object.fromEntries(Object.entries(by_extension).sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))),
    largest_files: [...files]
      .sort((a, b) => b.size_bytes - a.size_bytes)
      .slice(0, 20)
      .map(({ relative_path, size_bytes, ext, modified_at, sha256 }) => ({ relative_path, size_bytes, ext, modified_at, sha256 })),
  };
}

function buildRows(googleRows, contextByFileId, auditByFileId, offlineFiles) {
  return googleRows.map((row, index) => {
    const { fileId, context } = bestContextForRow(row, contextByFileId);
    const auditRecord = auditByFileId.get(fileId) || {};
    const offline = matchOffline(row, context, offlineFiles);
    const best = offline.best_candidate;
    const family = classifyFamily(row, context);
    const preservation_action = preservationAction(row, offline);
    const future_sync_action = futureSyncAction(row, offline);

    return {
      resource_id: `rpm-${String(index + 1).padStart(4, "0")}`,
      family,
      project_title: context.title,
      resource_label: context.label || splitPipe(row.fields).slice(-1)[0] || "",
      description: context.description,
      source_page_or_modal: auditRecord.page_or_modal || "",
      primary_source: row.primary_source,
      source_line: row.source_line,
      all_sources: row.all_sources,
      local_source_paths: offline.local_source_paths.join(" | "),
      fields: row.fields,
      context_source_file: context.source_file,
      context_section: context.section,
      context_category: context.category,
      context_project: context.project,
      google_type: row.type,
      google_file_id: fileId,
      url_status: row.status,
      public_state: row.public_state,
      http_status: row.http_status,
      google_access: row.google_access,
      reason: row.reason,
      url: row.url,
      final_url: row.final_url,
      recommended_public_action: publicAction(row),
      preservation_action,
      future_sync_action,
      offline_match_status: offline.offline_match_status,
      offline_best_path: best?.relative_path || "",
      offline_best_role: best?.role || "",
      offline_best_score: best?.score || "",
      offline_best_ext: best?.ext || "",
      offline_best_size_bytes: best?.size_bytes || "",
      offline_best_modified_at: best?.modified_at || "",
      offline_best_sha256: best?.sha256 || "",
      offline_best_signals: best?.signals?.join(" | ") || "",
      offline_candidate_paths: offline.candidates.map((candidate) => `${candidate.relative_path} (${candidate.score}, ${candidate.role})`).join(" | "),
      occurrence_count: row.occurrence_count,
      notes:
        offline.offline_match_status === "source_index_only"
          ? "Local source/index file exists, but the actual artifact still needs recovery or export."
          : "",
    };
  });
}

function buildSummary(rows, offlineFiles, googleSummary, parseErrors) {
  const not_public = rows.filter((row) => row.public_state !== "working_public");
  return {
    generated_at: new Date().toISOString(),
    google: googleSummary,
    resource_rows: rows.length,
    non_public_or_broken: not_public.length,
    by_public_state: countBy(rows, "public_state"),
    by_google_type: countBy(rows, "google_type"),
    by_family: countBy(rows, "family"),
    by_offline_match_status: countBy(rows, "offline_match_status"),
    by_preservation_action: countBy(rows, "preservation_action"),
    by_source_path: nestedSourceSummary(rows),
    decision_queues: {
      broken_with_matched_or_possible_artifact: rows.filter(
        (row) => row.public_state === "not_working_broken" && ["matched_artifact", "possible_artifact"].includes(row.offline_match_status),
      ).length,
      broken_missing_artifact: rows.filter((row) => row.public_state === "not_working_broken" && row.offline_match_status === "missing_artifact").length,
      private_with_matched_or_possible_artifact: rows.filter(
        (row) => row.public_state === "not_public_auth_required" && ["matched_artifact", "possible_artifact"].includes(row.offline_match_status),
      ).length,
      private_source_index_only: rows.filter((row) => row.public_state === "not_public_auth_required" && row.offline_match_status === "source_index_only").length,
      working_public_keep: rows.filter((row) => row.public_state === "working_public").length,
    },
    offline_inventory: inventorySummary(offlineFiles),
    parse_errors: parseErrors,
  };
}

function writeCsv(rows) {
  const columns = [
    "resource_id",
    "family",
    "project_title",
    "resource_label",
    "google_type",
    "public_state",
    "url_status",
    "http_status",
    "recommended_public_action",
    "preservation_action",
    "offline_match_status",
    "offline_best_path",
    "offline_best_role",
    "offline_best_score",
    "offline_best_ext",
    "offline_best_size_bytes",
    "offline_best_sha256",
    "local_source_paths",
    "context_source_file",
    "primary_source",
    "source_line",
    "fields",
    "url",
    "final_url",
    "google_file_id",
    "future_sync_action",
    "offline_candidate_paths",
    "notes",
  ];
  const csv = `${columns.join(",")}\n${rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")).join("\n")}\n`;
  fs.writeFileSync(OUT_CSV, csv, "utf8");
}

function formatBytes(value) {
  const number = Number(value) || 0;
  if (number >= 1024 ** 3) return `${(number / 1024 ** 3).toFixed(2)} GB`;
  if (number >= 1024 ** 2) return `${(number / 1024 ** 2).toFixed(1)} MB`;
  if (number >= 1024) return `${(number / 1024).toFixed(1)} KB`;
  return `${number} B`;
}

function statusCards(summary) {
  return [
    ["Google URLs", summary.resource_rows, "Unique Google resources in the site audit"],
    ["Public working", summary.by_public_state.working_public || 0, "Keep unless the content should be retired"],
    ["Needs public fix", summary.non_public_or_broken, "Private/auth-required or broken URLs"],
    ["Matched artifacts", summary.by_offline_match_status.matched_artifact || 0, "Likely local replacement files"],
    ["Possible artifacts", summary.by_offline_match_status.possible_artifact || 0, "Needs manual confirmation"],
    ["Source index only", summary.by_offline_match_status.source_index_only || 0, "Metadata exists, content may not"],
    ["Missing artifacts", summary.by_offline_match_status.missing_artifact || 0, "Do not delete blindly"],
    ["Offline files", summary.offline_inventory.total_files, formatBytes(summary.offline_inventory.total_size_bytes)],
  ];
}

function barRows(counts, total) {
  return Object.entries(counts)
    .map(([label, count]) => {
      const width = total ? Math.max(3, Math.round((count / total) * 100)) : 0;
      return `<div class="bar-row"><span>${esc(label)}</span><div class="bar"><i style="width:${width}%"></i></div><strong>${count}</strong></div>`;
    })
    .join("");
}

function buildHtml(rows, summary) {
  const sourceOptions = Object.keys(summary.by_source_path).sort();
  const familyOptions = Object.keys(summary.by_family).sort();
  const generatedAt = new Date(summary.generated_at).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resource Preservation Manifest</title>
  <style>
    :root { color-scheme: dark; --bg:#0c0f13; --panel:#151a21; --panel2:#10151c; --line:#2a3442; --text:#eef3f7; --muted:#9ba9b9; --good:#58d68d; --warn:#f4c95d; --bad:#ff7a85; --info:#8bc5ff; --purple:#c7a6ff; }
    * { box-sizing:border-box; }
    body { margin:0; font:14px/1.45 system-ui, -apple-system, Segoe UI, sans-serif; background:var(--bg); color:var(--text); }
    header { padding:22px 26px 18px; border-bottom:1px solid var(--line); background:rgba(12,15,19,.96); position:sticky; top:0; z-index:3; }
    h1 { margin:0 0 8px; font-size:24px; letter-spacing:0; }
    h2 { margin:26px 0 12px; font-size:16px; }
    p { color:var(--muted); margin:4px 0; }
    main { padding:20px 26px 44px; }
    a { color:var(--info); word-break:break-all; }
    code { color:#c5d3e3; word-break:break-all; }
    .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px; margin:16px 0 20px; }
    .card { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:14px; min-height:104px; }
    .card span { color:var(--muted); display:block; min-height:36px; }
    .num { font-size:28px; line-height:1.05; font-weight:800; margin:4px 0 8px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:14px; }
    .panel { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:14px; }
    .bar-row { display:grid; grid-template-columns:minmax(130px,1fr) minmax(80px,2fr) 48px; gap:10px; align-items:center; margin:9px 0; }
    .bar-row span { color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .bar { height:9px; background:#0a0d11; border:1px solid var(--line); border-radius:99px; overflow:hidden; }
    .bar i { display:block; height:100%; background:linear-gradient(90deg, var(--info), var(--purple)); }
    .filters { display:grid; grid-template-columns:repeat(5,minmax(130px,1fr)); gap:10px; margin:18px 0 12px; }
    input, select { width:100%; background:var(--panel2); border:1px solid var(--line); color:var(--text); border-radius:6px; padding:9px 10px; }
    #q { grid-column:span 2; }
    .table-wrap { overflow:auto; border:1px solid var(--line); border-radius:8px; background:var(--panel); }
    table { width:100%; border-collapse:collapse; min-width:1240px; }
    th, td { padding:10px; border-bottom:1px solid var(--line); vertical-align:top; text-align:left; }
    th { position:sticky; top:104px; background:#101720; color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.04em; z-index:2; }
    small { color:var(--muted); display:block; margin-top:3px; }
    .pill { display:inline-block; border:1px solid currentColor; border-radius:999px; padding:2px 7px; font-size:12px; font-weight:700; white-space:nowrap; }
    .working_public, .matched_artifact { color:var(--good); }
    .not_public_auth_required, .possible_artifact, .source_index_only { color:var(--warn); }
    .not_working_broken, .missing_artifact { color:var(--bad); }
    .needs_manual_review { color:var(--info); }
    .artifact_candidate { color:var(--good); }
    .source_index_candidate { color:var(--warn); }
    details { margin-top:5px; }
    summary { color:var(--info); cursor:pointer; }
    .note { border-left:3px solid var(--warn); padding:10px 12px; background:#17140c; border-radius:6px; }
    .count { color:var(--muted); margin:0 0 8px; }
    @media (max-width: 840px) {
      header { position:static; }
      th { position:static; }
      .filters { grid-template-columns:1fr 1fr; }
      #q { grid-column:span 2; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Resource Preservation Manifest</h1>
    <p>Generated ${esc(generatedAt)} from <code>google-links-review.json</code> plus the local <code>Ref Docs</code> inventory. This is a review surface only; it does not change or remove public links.</p>
  </header>
  <main>
    <section class="cards">
      ${statusCards(summary).map(([label, value, detail]) => `<div class="card"><span>${esc(label)}</span><div class="num">${esc(value)}</div><p>${esc(detail)}</p></div>`).join("")}
    </section>

    <section class="grid">
      <div class="panel">
        <h2>Public Link State</h2>
        ${barRows(summary.by_public_state, summary.resource_rows)}
      </div>
      <div class="panel">
        <h2>Offline Preservation State</h2>
        ${barRows(summary.by_offline_match_status, summary.resource_rows)}
      </div>
      <div class="panel">
        <h2>Decision Queues</h2>
        ${barRows(summary.decision_queues, summary.resource_rows)}
      </div>
    </section>

    <section class="panel" style="margin-top:14px">
      <h2>How to Read This</h2>
      <p class="note"><strong>Matched artifact</strong> means a likely offline replacement exists. <strong>Source index only</strong> means a local workbook/CSV/source row exists, but it may not contain the actual Google Doc/Sheet/Drive artifact content. Those rows should be preserved, not deleted blindly.</p>
    </section>

    <section>
      <div class="filters">
        <select id="state">
          <option value="all">All public states</option>
          <option value="working_public">Working/public</option>
          <option value="not_public_auth_required">Private/auth required</option>
          <option value="not_working_broken">Broken/missing</option>
          <option value="needs_manual_review">Manual review</option>
        </select>
        <select id="offline">
          <option value="all">All offline states</option>
          <option value="matched_artifact">Matched artifact</option>
          <option value="possible_artifact">Possible artifact</option>
          <option value="source_index_only">Source index only</option>
          <option value="missing_artifact">Missing artifact</option>
        </select>
        <select id="family">
          <option value="all">All families</option>
          ${familyOptions.map((family) => `<option value="${esc(family)}">${esc(family)}</option>`).join("")}
        </select>
        <select id="source">
          <option value="all">All sources</option>
          ${sourceOptions.map((source) => `<option value="${esc(source)}">${esc(source)}</option>`).join("")}
        </select>
        <input id="q" placeholder="Search title, URL, source, local file, action...">
      </div>
      <p class="count" id="count"></p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>State</th><th>Resource</th><th>Public Action</th><th>Preservation</th><th>Offline Match</th><th>Source</th></tr></thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
    </section>
  </main>
  <script>
    const rows = ${jsData(rows)};
    const els = {
      state: document.getElementById('state'),
      offline: document.getElementById('offline'),
      family: document.getElementById('family'),
      source: document.getElementById('source'),
      q: document.getElementById('q'),
      count: document.getElementById('count'),
      rows: document.getElementById('rows')
    };
    function escJs(value) {
      return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    }
    function link(url, label) {
      return url ? '<a href="' + escJs(url) + '" target="_blank" rel="noreferrer">' + escJs(label || url) + '</a>' : '';
    }
    function renderCandidates(row) {
      if (!row.offline_candidate_paths) return '';
      return '<details><summary>Candidates</summary><small>' + escJs(row.offline_candidate_paths) + '</small></details>';
    }
    function rowHtml(row) {
      return '<tr>' +
        '<td><span class="pill ' + escJs(row.public_state) + '">' + escJs(row.public_state) + '</span><small>' + escJs(row.google_type) + ' ' + escJs(row.http_status || '') + '</small><small>' + escJs(row.reason || '') + '</small></td>' +
        '<td><strong>' + escJs(row.project_title) + '</strong><small>' + escJs([row.family, row.resource_label, row.context_section].filter(Boolean).join(' / ')) + '</small>' + link(row.url, row.url) + '</td>' +
        '<td>' + escJs(row.recommended_public_action) + '<small>' + escJs(row.url_status) + '</small></td>' +
        '<td>' + escJs(row.preservation_action) + '<small>' + escJs(row.future_sync_action) + '</small></td>' +
        '<td><span class="pill ' + escJs(row.offline_match_status) + '">' + escJs(row.offline_match_status) + '</span><small>' + escJs(row.offline_best_path || 'No likely offline artifact') + '</small><small>' + escJs(row.offline_best_score ? ('score ' + row.offline_best_score + ' / ' + row.offline_best_role) : '') + '</small>' + renderCandidates(row) + '</td>' +
        '<td><code>' + escJs(row.primary_source + (row.source_line ? ':' + row.source_line : '')) + '</code><small>' + escJs(row.local_source_paths || row.context_source_file || row.all_sources) + '</small></td>' +
      '</tr>';
    }
    function render() {
      const needle = els.q.value.trim().toLowerCase();
      const visible = rows.filter(row =>
        (els.state.value === 'all' || row.public_state === els.state.value) &&
        (els.offline.value === 'all' || row.offline_match_status === els.offline.value) &&
        (els.family.value === 'all' || row.family === els.family.value) &&
        (els.source.value === 'all' || row.primary_source === els.source.value) &&
        (!needle || JSON.stringify(row).toLowerCase().includes(needle))
      );
      els.count.textContent = visible.length + ' of ' + rows.length + ' resources shown';
      els.rows.innerHTML = visible.map(rowHtml).join('');
    }
    for (const el of [els.state, els.offline, els.family, els.source, els.q]) el.addEventListener('input', render);
    render();
  </script>
</body>
</html>
`;

  fs.writeFileSync(OUT_HTML, html, "utf8");
}

function main() {
  const googleReview = JSON.parse(fs.readFileSync(GOOGLE_REVIEW_JSON, "utf8"));
  const { contextByFileId, parse_errors } = loadStructuredContexts();
  const auditByFileId = loadAuditByFileId();
  const offlineFiles = inventoryRefDocs();
  const rows = buildRows(googleReview.rows, contextByFileId, auditByFileId, offlineFiles);
  const summary = buildSummary(rows, offlineFiles, googleReview.summary, parse_errors);

  fs.writeFileSync(
    OUT_JSON,
    `${JSON.stringify(
      {
        generated_at: summary.generated_at,
        inputs: {
          google_links_review: normalizeSlash(path.relative(ROOT, GOOGLE_REVIEW_JSON)),
          audit_results: normalizeSlash(path.relative(ROOT, AUDIT_JSON)),
          ref_docs_root: normalizeSlash(path.relative(ROOT, REF_DOCS_DIR)),
          structured_source_files: STRUCTURED_SOURCE_FILES,
          note: "This manifest is preservation-first and does not remove or change public site links.",
        },
        summary,
        rows,
        offline_inventory: offlineFiles.map(({ tokens: _tokens, plain_stem: _plain_stem, plain_path: _plain_path, ...file }) => file),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  writeCsv(rows);
  buildHtml(rows, summary);

  console.log(
    JSON.stringify(
      {
        out_json: normalizeSlash(path.relative(ROOT, OUT_JSON)),
        out_csv: normalizeSlash(path.relative(ROOT, OUT_CSV)),
        out_html: normalizeSlash(path.relative(ROOT, OUT_HTML)),
        summary: {
          resource_rows: summary.resource_rows,
          public_state: summary.by_public_state,
          offline_match_status: summary.by_offline_match_status,
          decision_queues: summary.decision_queues,
          offline_files: summary.offline_inventory.total_files,
          offline_size_bytes: summary.offline_inventory.total_size_bytes,
        },
      },
      null,
      2,
    ),
  );
}

main();
