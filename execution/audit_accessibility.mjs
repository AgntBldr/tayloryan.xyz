import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = path.join(root, "audits", "site-audit", "accessibility-static-2026-07-14.json");
const sourceExtensions = new Set([".html", ".js"]);

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

const stripMarkup = (value) => value
  .replace(/<i\b[^>]*>[\s\S]*?<\/i>/gi, "")
  .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&(?:nbsp|rarr|larr|times);|&#\d+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

const deploySync = await readFile(path.join(root, "deploy_sync.ps1"), "utf8");
const topLevelFiles = new Set(["index.html"]);
for (const match of deploySync.matchAll(/Sync-StaticPage\s+-FileName\s+"([^"]+)"/g)) topLevelFiles.add(match[1]);
for (const match of deploySync.matchAll(/\$\w+Source\s*=\s*"\$SourceRoot\\([^"]+\.html)"/g)) topLevelFiles.add(match[1]);

const sourceFiles = [];
for (const fileName of topLevelFiles) sourceFiles.push(path.join(root, fileName));
sourceFiles.push(...await walk(path.join(root, "portfolio")));
sourceFiles.push(...await walk(path.join(root, "assets", "js")));

const lineAt = (content, index) => content.slice(0, index).split(/\r?\n/).length;
const issues = [];
for (const file of sourceFiles) {
  const content = await readFile(file, "utf8");
  const relativeFile = path.relative(root, file).replaceAll("\\", "/");

  for (const match of content.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attrs = match[1];
    const text = stripMarkup(match[2]);
    const hasName = /\baria-label(?:ledby)?\s*=|\btitle\s*=/i.test(attrs) || text.length > 0;
    if (!hasName) issues.push({ type: "button-name", file: relativeFile, line: lineAt(content, match.index), excerpt: match[0].slice(0, 180) });
  }

  if (path.extname(file) !== ".html") continue;
  const labelTargets = new Set([...content.matchAll(/<label\b[^>]*\bfor=["']([^"']+)["']/gi)].map((match) => match[1]));
  for (const match of content.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)) {
    const attrs = match[2];
    if (/\btype=["']hidden["']/i.test(attrs) || /\bname=["']honeycomb["']/i.test(attrs)) continue;
    const id = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    const hasName = /\baria-label(?:ledby)?\s*=|\btitle\s*=/i.test(attrs) || (id && labelTargets.has(id));
    if (!hasName) issues.push({ type: "form-control-name", file: relativeFile, line: lineAt(content, match.index), excerpt: match[0].slice(0, 180) });
  }
}

const report = {
  generated_at: new Date().toISOString(),
  files_scanned: sourceFiles.length,
  issue_count: issues.length,
  issues
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Static accessibility audit: ${report.issue_count} issue(s) across ${report.files_scanned} source files.`);
for (const issue of issues) console.log(`${issue.type}: ${issue.file}:${issue.line}`);
if (issues.length) process.exitCode = 1;
