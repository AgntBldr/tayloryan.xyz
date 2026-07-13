import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AUDIT_JSON = path.join(ROOT, "audits", "site-audit", "audit-results.json");
const OUT_DIR = path.join(ROOT, "audits", "site-audit");
const OUT_JSON = path.join(OUT_DIR, "google-links-review.json");
const OUT_CSV = path.join(OUT_DIR, "google-links-review.csv");
const OUT_HTML = path.join(OUT_DIR, "google-links-review.html");

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decisionFor(status) {
  if (status === "live") return "keep";
  if (status === "auth_required") return "re-share, replace, or hide";
  if (status === "broken") return "replace or hide";
  return "manual retry";
}

function publicState(status) {
  if (status === "live") return "working_public";
  if (status === "auth_required") return "not_public_auth_required";
  if (status === "broken") return "not_working_broken";
  return "needs_manual_review";
}

function summarize(rows) {
  const out = {
    total_google_urls: rows.length,
    working_public: 0,
    not_public_auth_required: 0,
    not_working_broken: 0,
    needs_manual_review: 0,
    by_type: {},
    by_source_path: {},
  };

  for (const row of rows) {
    out[row.public_state] += 1;
    out.by_type[row.type] ||= {};
    out.by_type[row.type][row.status] = (out.by_type[row.type][row.status] || 0) + 1;
    out.by_source_path[row.primary_source] ||= {};
    out.by_source_path[row.primary_source][row.public_state] = (out.by_source_path[row.primary_source][row.public_state] || 0) + 1;
  }

  out.not_public_working = out.not_public_auth_required + out.not_working_broken + out.needs_manual_review;
  return out;
}

const audit = JSON.parse(fs.readFileSync(AUDIT_JSON, "utf8"));
const rows = audit.records
  .filter((record) => record.classification?.startsWith("google-"))
  .map((record) => {
    const status = record.check?.status || "unchecked";
    const occurrences = record.occurrences || [];
    const sourcePaths = [...new Set([record.source_path, ...occurrences.map((item) => item.source_path)].filter(Boolean))];
    const fields = [...new Set([record.field, ...occurrences.map((item) => item.field)].filter(Boolean))];
    const titles = [...new Set([record.item_title, ...occurrences.map((item) => item.item_title)].filter(Boolean))];
    return {
      public_state: publicState(status),
      recommended_action: decisionFor(status),
      status,
      type: record.classification,
      http_status: record.check?.http_status || "",
      google_access: record.check?.google_access || "",
      reason: record.check?.reason || record.check?.attempts?.map((item) => item.error || item.status).filter(Boolean).join("; ") || "",
      url: record.url,
      final_url: record.check?.final_url || "",
      primary_source: record.source_path || "",
      source_line: record.source_line || "",
      all_sources: sourcePaths.join(" | "),
      fields: fields.join(" | "),
      item_titles: titles.join(" | "),
      occurrence_count: Math.max(1, occurrences.length),
    };
  })
  .sort((a, b) => {
    const order = {
      not_working_broken: 0,
      not_public_auth_required: 1,
      needs_manual_review: 2,
      working_public: 3,
    };
    return (
      order[a.public_state] - order[b.public_state] ||
      a.type.localeCompare(b.type) ||
      a.primary_source.localeCompare(b.primary_source) ||
      a.url.localeCompare(b.url)
    );
  });

const summary = summarize(rows);
fs.writeFileSync(OUT_JSON, `${JSON.stringify({ generated_at: new Date().toISOString(), summary, rows }, null, 2)}\n`, "utf8");

const columns = [
  "public_state",
  "recommended_action",
  "status",
  "type",
  "http_status",
  "google_access",
  "reason",
  "url",
  "final_url",
  "primary_source",
  "source_line",
  "all_sources",
  "fields",
  "item_titles",
  "occurrence_count",
];
fs.writeFileSync(
  OUT_CSV,
  `${columns.join(",")}\n${rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")).join("\n")}\n`,
  "utf8",
);

const statusCards = [
  ["Working/public", summary.working_public, "keep"],
  ["Private/auth required", summary.not_public_auth_required, "re-share, replace, or hide"],
  ["Broken/missing", summary.not_working_broken, "replace or hide"],
  ["Manual retry", summary.needs_manual_review, "retry before deciding"],
];

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Google Links Review</title>
  <style>
    :root { color-scheme: dark; --bg:#0b0f14; --panel:#141b24; --line:#273445; --text:#eef3f8; --muted:#9fb0c2; --good:#4ade80; --warn:#fbbf24; --bad:#fb7185; --info:#93c5fd; }
    body { margin:0; font:14px/1.45 system-ui, -apple-system, Segoe UI, sans-serif; background:var(--bg); color:var(--text); }
    header { position:sticky; top:0; z-index:2; padding:20px 24px; background:rgba(11,15,20,.94); border-bottom:1px solid var(--line); }
    h1 { margin:0 0 8px; font-size:22px; }
    p { color:var(--muted); margin:4px 0; }
    main { padding:20px 24px 40px; }
    .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin:16px 0; }
    .card { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:14px; }
    .num { font-size:28px; font-weight:800; margin:4px 0; }
    .filters { display:flex; gap:10px; flex-wrap:wrap; margin:16px 0; }
    input, select { background:#0f151d; border:1px solid var(--line); color:var(--text); border-radius:6px; padding:8px 10px; }
    input { min-width:min(520px, 100%); flex:1; }
    table { width:100%; border-collapse:collapse; background:var(--panel); border:1px solid var(--line); border-radius:8px; overflow:hidden; }
    th, td { padding:9px 10px; border-bottom:1px solid var(--line); vertical-align:top; text-align:left; }
    th { position:sticky; top:87px; background:#101720; color:var(--muted); font-size:12px; text-transform:uppercase; }
    a { color:var(--info); word-break:break-all; }
    code { color:var(--muted); word-break:break-all; }
    .pill { display:inline-block; border:1px solid currentColor; border-radius:999px; padding:2px 7px; font-size:12px; font-weight:700; white-space:nowrap; }
    .working_public { color:var(--good); }
    .not_public_auth_required { color:var(--warn); }
    .not_working_broken { color:var(--bad); }
    .needs_manual_review { color:var(--info); }
  </style>
</head>
<body>
  <header>
    <h1>Google Links Review</h1>
    <p>${summary.total_google_urls} unique Google URLs checked from the refreshed site audit. Do not remove all links: keep the public-working links and triage the private/broken ones.</p>
  </header>
  <main>
    <section class="cards">
      ${statusCards.map(([label, value, action]) => `<div class="card"><div>${esc(label)}</div><div class="num">${value}</div><p>${esc(action)}</p></div>`).join("")}
    </section>
    <div class="filters">
      <select id="state">
        <option value="all">All states</option>
        <option value="working_public">Working/public</option>
        <option value="not_public_auth_required">Private/auth required</option>
        <option value="not_working_broken">Broken/missing</option>
        <option value="needs_manual_review">Manual retry</option>
      </select>
      <select id="type">
        <option value="all">All types</option>
        ${[...new Set(rows.map((row) => row.type))].sort().map((type) => `<option value="${esc(type)}">${esc(type)}</option>`).join("")}
      </select>
      <input id="q" placeholder="Search URL, source file, title, status...">
    </div>
    <table>
      <thead><tr><th>State</th><th>Action</th><th>Type</th><th>HTTP</th><th>URL</th><th>Source</th><th>Title / Field</th></tr></thead>
      <tbody id="rows"></tbody>
    </table>
  </main>
  <script>
    const rows = ${JSON.stringify(rows)};
    const tbody = document.getElementById('rows');
    const state = document.getElementById('state');
    const type = document.getElementById('type');
    const q = document.getElementById('q');
    function esc(s){return String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
    function render(){
      const needle = q.value.toLowerCase();
      const visible = rows.filter(row =>
        (state.value === 'all' || row.public_state === state.value) &&
        (type.value === 'all' || row.type === type.value) &&
        (!needle || JSON.stringify(row).toLowerCase().includes(needle))
      );
      tbody.innerHTML = visible.map(row => '<tr>' +
        '<td><span class="pill '+esc(row.public_state)+'">'+esc(row.public_state)+'</span><br><small>'+esc(row.status)+' '+esc(row.reason)+'</small></td>' +
        '<td>'+esc(row.recommended_action)+'</td>' +
        '<td>'+esc(row.type)+'</td>' +
        '<td>'+esc(row.http_status || '')+'</td>' +
        '<td><a href="'+esc(row.url)+'" target="_blank" rel="noreferrer">'+esc(row.url)+'</a></td>' +
        '<td><code>'+esc(row.all_sources || row.primary_source)+'</code></td>' +
        '<td>'+esc(row.item_titles || '')+'<br><small>'+esc(row.fields || '')+'</small></td>' +
      '</tr>').join('');
    }
    state.addEventListener('input', render);
    type.addEventListener('input', render);
    q.addEventListener('input', render);
    render();
  </script>
</body>
</html>
`;

fs.writeFileSync(OUT_HTML, html, "utf8");

console.log(JSON.stringify({ out_json: path.relative(ROOT, OUT_JSON), out_csv: path.relative(ROOT, OUT_CSV), out_html: path.relative(ROOT, OUT_HTML), summary }, null, 2));
