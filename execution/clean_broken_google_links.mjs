import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "audits", "site-audit", "resource-preservation-manifest.json");
const somePath = path.join(root, "assets", "js", "some_work_data.js");
const marketingPath = path.join(root, "assets", "js", "marketing_full_data.js");
const outputBase = path.join(root, "audits", "site-audit", "broken-google-cleanup-ledger");
const applyChanges = process.argv.includes("--apply");

function readAssignedRecords(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const start = source.indexOf("[");
  const end = source.lastIndexOf("]");
  if (start < 0 || end < start) {
    throw new Error(`Could not find an assigned array in ${path.relative(root, filePath)}`);
  }

  const records = [];
  let objectStart = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start + 1; index < end; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "{") {
      if (depth === 0) objectStart = index;
      depth += 1;
      continue;
    }
    if (char === "}") {
      depth -= 1;
      if (depth === 0 && objectStart >= 0) {
        records.push({
          start: objectStart,
          end: index + 1,
          value: JSON.parse(source.slice(objectStart, index + 1)),
          changed: false,
        });
        objectStart = -1;
      }
    }
  }

  return { source, records };
}

function stringifyAscii(value) {
  return JSON.stringify(value, null, 2).replace(/[\u007f-\uffff]/g, (char) => {
    return `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
  });
}

function writeChangedRecords(filePath, parsed) {
  let output = parsed.source;
  for (const record of [...parsed.records].reverse()) {
    if (!record.changed) continue;
    const lineStart = output.lastIndexOf("\n", record.start - 1) + 1;
    const indentation = output.slice(lineStart, record.start);
    const replacement = stringifyAscii(record.value).replaceAll("\n", `\n${indentation}`);
    output = output.slice(0, record.start) + replacement + output.slice(record.end);
  }
  fs.writeFileSync(filePath, output, "utf8");
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const brokenRows = manifest.rows.filter((row) => row.public_state === "not_working_broken");
const brokenUrls = new Set(brokenRows.map((row) => row.url));

if (brokenRows.length !== 80 || brokenUrls.size !== 80) {
  throw new Error(`Expected the approved baseline of 80 unique broken URLs; found ${brokenRows.length} rows and ${brokenUrls.size} URLs.`);
}

const someFile = readAssignedRecords(somePath);
const marketingFile = readAssignedRecords(marketingPath);
const someData = someFile.records.map((record) => record.value);
const marketingData = marketingFile.records.map((record) => record.value);
const impactsByUrl = new Map([...brokenUrls].map((url) => [url, []]));
const affectedItems = [];

function addImpact(url, impact) {
  impactsByUrl.get(url)?.push(impact);
}

for (const [index, item] of someData.entries()) {
  const originalLinks = Array.isArray(item.links) ? item.links : [];
  const removedLinks = originalLinks.filter((link) => brokenUrls.has(link.url));
  const primaryWasBroken = brokenUrls.has(item.url);
  const removedUrls = unique([
    ...(primaryWasBroken ? [item.url] : []),
    ...removedLinks.map((link) => link.url),
  ]);

  if (removedUrls.length === 0) continue;

  const remainingLinks = originalLinks.filter((link) => !brokenUrls.has(link.url));
  const nextPrimaryUrl = primaryWasBroken ? (remainingLinks[0]?.url || "") : item.url;
  item.links = remainingLinks;
  item.url = nextPrimaryUrl;
  someFile.records[index].changed = true;

  const impact = {
    source_file: "assets/js/some_work_data.js",
    item_index: index,
    item_id: "",
    item_title: item.title,
    removed_labels: unique(removedLinks.map((link) => link.label)),
    primary_url_removed: primaryWasBroken,
    remaining_action_count: remainingLinks.length,
    primary_url_after: nextPrimaryUrl,
    public_result: remainingLinks.length > 0 ? "remaining links preserved" : "no public link available",
  };
  affectedItems.push(impact);

  for (const url of removedUrls) {
    addImpact(url, {
      ...impact,
      removed_labels: unique(removedLinks.filter((link) => link.url === url).map((link) => link.label)),
      primary_url_removed: primaryWasBroken && item.url !== url,
    });
  }
}

for (const [index, item] of marketingData.entries()) {
  if (!brokenUrls.has(item.url)) continue;

  const url = item.url;
  item.url = "";
  item.status = "Link unavailable";
  item.access = "Offline copy preserved";
  marketingFile.records[index].changed = true;

  const impact = {
    source_file: "assets/js/marketing_full_data.js",
    item_index: index,
    item_id: item.id,
    item_title: item.title,
    removed_labels: ["Open Resource"],
    primary_url_removed: true,
    remaining_action_count: 0,
    primary_url_after: "",
    public_result: "dead action hidden; card and offline record preserved",
  };
  affectedItems.push(impact);
  addImpact(url, impact);
}

const seenBrokenUrls = new Set(
  [...impactsByUrl.entries()].filter(([, impacts]) => impacts.length > 0).map(([url]) => url),
);
const existingLedger = fs.existsSync(`${outputBase}.json`);

if (seenBrokenUrls.size === 0 && existingLedger) {
  console.log("Broken-link cleanup is already applied; the existing preservation ledger was left unchanged.");
  process.exit(0);
}

if (seenBrokenUrls.size !== brokenUrls.size) {
  const missing = [...brokenUrls].filter((url) => !seenBrokenUrls.has(url));
  throw new Error(`Cleanup source coverage mismatch: found ${seenBrokenUrls.size} of ${brokenUrls.size} approved URLs. Missing sample: ${missing.slice(0, 3).join(", ")}`);
}

const leftoverUrls = new Set();
for (const item of someData) {
  if (brokenUrls.has(item.url)) leftoverUrls.add(item.url);
  for (const link of item.links || []) {
    if (brokenUrls.has(link.url)) leftoverUrls.add(link.url);
  }
}
for (const item of marketingData) {
  if (brokenUrls.has(item.url)) leftoverUrls.add(item.url);
}
if (leftoverUrls.size > 0) {
  throw new Error(`Transformation left ${leftoverUrls.size} approved broken URLs in public data.`);
}

const ledgerRows = brokenRows.map((row) => {
  const impacts = impactsByUrl.get(row.url) || [];
  return {
    resource_id: row.resource_id,
    url: row.url,
    google_type: row.google_type,
    prior_http_status: row.http_status,
    prior_reason: row.reason,
    source_file: row.primary_source,
    source_line_before_cleanup: row.source_line,
    project_title: row.project_title,
    resource_label: row.resource_label,
    offline_match_status: row.offline_match_status,
    offline_best_path: row.offline_best_path,
    offline_best_sha256: row.offline_best_sha256,
    future_sync_action: row.future_sync_action,
    affected_items: unique(impacts.map((impact) => impact.item_title)),
    removed_labels: unique(impacts.flatMap((impact) => impact.removed_labels)),
    public_results: unique(impacts.map((impact) => impact.public_result)),
    source_occurrence_count: impacts.length,
  };
});

const summary = {
  approved_broken_urls_retired: ledgerRows.length,
  affected_items: affectedItems.length,
  social_items_affected: affectedItems.filter((item) => item.source_file.endsWith("some_work_data.js")).length,
  social_items_with_remaining_actions: affectedItems.filter((item) => item.source_file.endsWith("some_work_data.js") && item.remaining_action_count > 0).length,
  social_items_without_public_actions: affectedItems.filter((item) => item.source_file.endsWith("some_work_data.js") && item.remaining_action_count === 0).length,
  marketing_items_with_hidden_action: affectedItems.filter((item) => item.source_file.endsWith("marketing_full_data.js")).length,
  auth_required_urls_changed: 0,
  layer3_urls_changed: 0,
};

const ledger = {
  generated_at: new Date().toISOString(),
  source_manifest: path.relative(root, manifestPath).replaceAll("\\", "/"),
  policy: "Retire only the 80 URLs classified not_working_broken in the approved preservation manifest. Preserve private/auth-required and Layer3 links.",
  summary,
  rows: ledgerRows,
};

const csvColumns = [
  "resource_id", "url", "google_type", "prior_http_status", "prior_reason", "source_file",
  "source_line_before_cleanup", "project_title", "resource_label", "offline_match_status",
  "offline_best_path", "offline_best_sha256", "future_sync_action", "affected_items",
  "removed_labels", "public_results", "source_occurrence_count",
];
const csv = [
  csvColumns.join(","),
  ...ledgerRows.map((row) => csvColumns.map((column) => csvCell(row[column])).join(",")),
].join("\n") + "\n";

const tableRows = ledgerRows.map((row) => `
  <tr>
    <td><code>${escapeHtml(row.resource_id)}</code></td>
    <td><strong>${escapeHtml(row.affected_items.join(" | ") || row.project_title)}</strong><br><span>${escapeHtml(row.removed_labels.join(" | "))}</span></td>
    <td><span class="state">Retired</span><br><span>HTTP ${escapeHtml(row.prior_http_status)}</span></td>
    <td><strong>${escapeHtml(row.offline_match_status)}</strong><br><span>${escapeHtml(row.offline_best_path || "No likely artifact")}</span></td>
    <td>${escapeHtml(row.public_results.join(" | "))}</td>
    <td><a href="${escapeHtml(row.url)}" target="_blank" rel="noreferrer">Preserved URL</a></td>
  </tr>`).join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Broken Google Link Cleanup Ledger</title>
  <style>
    :root { color-scheme: dark; --bg: #0c0d10; --panel: #15171c; --line: #30343d; --muted: #a4a9b3; --text: #f4f5f7; --accent: #f5b942; --ok: #70d7a5; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.5 system-ui, sans-serif; }
    main { max-width: 1500px; margin: 0 auto; padding: 32px 24px 64px; }
    h1 { margin: 0 0 8px; font-size: 30px; letter-spacing: 0; }
    p { color: var(--muted); margin: 0 0 24px; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-bottom: 24px; }
    .metric { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 14px; }
    .metric strong { display: block; font-size: 24px; }
    .metric span, td span { color: var(--muted); }
    .toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 12px; }
    input { width: min(520px, 100%); background: var(--panel); color: var(--text); border: 1px solid var(--line); border-radius: 6px; padding: 11px 12px; }
    .table-wrap { overflow: auto; border: 1px solid var(--line); border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; min-width: 1100px; }
    th, td { padding: 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
    th { position: sticky; top: 0; background: #1c1f25; color: var(--muted); font-size: 11px; text-transform: uppercase; }
    tr:last-child td { border-bottom: 0; }
    code { color: var(--accent); }
    a { color: var(--accent); }
    .state { color: var(--ok); font-weight: 700; }
  </style>
</head>
<body>
<main>
  <h1>Broken Google Link Cleanup Ledger</h1>
  <p>Historical record of the approved broken links removed from public actions. Private/auth-required and Layer3 links were not changed. Generated ${escapeHtml(ledger.generated_at)}.</p>
  <section class="metrics">
    <div class="metric"><strong>${summary.approved_broken_urls_retired}</strong><span>broken URLs retired</span></div>
    <div class="metric"><strong>${summary.affected_items}</strong><span>items affected</span></div>
    <div class="metric"><strong>${summary.social_items_with_remaining_actions}</strong><span>items kept other actions</span></div>
    <div class="metric"><strong>${summary.social_items_without_public_actions}</strong><span>items now show no public link</span></div>
    <div class="metric"><strong>${summary.auth_required_urls_changed}</strong><span>private links changed</span></div>
    <div class="metric"><strong>${summary.layer3_urls_changed}</strong><span>Layer3 links changed</span></div>
  </section>
  <div class="toolbar"><input id="filter" type="search" placeholder="Filter title, artifact, label, or URL"></div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>ID</th><th>Affected item</th><th>Prior state</th><th>Offline preservation</th><th>Public result</th><th>Historical URL</th></tr></thead>
      <tbody id="rows">${tableRows}</tbody>
    </table>
  </div>
</main>
<script>
  const input = document.getElementById('filter');
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    for (const row of document.querySelectorAll('#rows tr')) {
      row.hidden = !row.textContent.toLowerCase().includes(query);
    }
  });
</script>
</body>
</html>\n`;

console.log(JSON.stringify(summary, null, 2));
if (!applyChanges) {
  console.log("Dry run only. Re-run with --apply to update data files and write the cleanup ledger.");
  process.exit(0);
}

writeChangedRecords(somePath, someFile);
writeChangedRecords(marketingPath, marketingFile);
fs.writeFileSync(`${outputBase}.json`, JSON.stringify(ledger, null, 2) + "\n", "utf8");
fs.writeFileSync(`${outputBase}.csv`, csv, "utf8");
fs.writeFileSync(`${outputBase}.html`, html, "utf8");
console.log(`Applied cleanup and wrote ${path.relative(root, outputBase)}.{json,csv,html}`);
