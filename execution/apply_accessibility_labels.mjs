import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deploySync = await readFile(path.join(root, "deploy_sync.ps1"), "utf8");
const topLevelFiles = new Set(["index.html"]);
for (const match of deploySync.matchAll(/Sync-StaticPage\s+-FileName\s+"([^"]+)"/g)) topLevelFiles.add(match[1]);
for (const match of deploySync.matchAll(/\$\w+Source\s*=\s*"\$SourceRoot\\([^"]+\.html)"/g)) topLevelFiles.add(match[1]);

const { readdir } = await import("node:fs/promises");
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if ([".html", ".js"].includes(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

const sourceFiles = [...topLevelFiles].map((fileName) => path.join(root, fileName));
sourceFiles.push(...await walk(path.join(root, "portfolio")));
sourceFiles.push(...await walk(path.join(root, "assets", "js")));

const stripMarkup = (value) => value
  .replace(/<i\b[^>]*>[\s\S]*?<\/i>/gi, "")
  .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&(?:nbsp|rarr|larr|times);|&#\d+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

const escapeAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
const addAttributes = (attrs, label) => {
  const type = /\btype\s*=/i.test(attrs) ? "" : ' type="button"';
  return `${attrs}${type} aria-label="${escapeAttribute(label)}"`;
};

const buttonLabel = (attrs, body) => {
  if (/closeMapModal/i.test(attrs)) return "Close speaker map";
  if (/closeContactModal/i.test(attrs)) return "Close contact form";
  if (/closeModal/i.test(attrs)) return "Close details";
  if (/switchView\('list'\)/i.test(attrs)) return "Show list view";
  if (/switchView\('grid'\)/i.test(attrs)) return "Show grid view";
  if (/openMapModal/i.test(attrs)) return "Open speaker map";
  if (/toggleView\('card'\)/i.test(attrs)) return "Show card view";
  if (/toggleView\('row'\)/i.test(attrs)) return "Show row view";
  if (/querySelector\('aside'\)/i.test(attrs)) return "Open marketing navigation";
  if (/chevron-right/i.test(body)) return "Open details";
  return null;
};

const controlLabel = (attrs, tagName) => {
  const placeholder = attrs.match(/\bplaceholder\s*=\s*["']([^"']+)["']/i)?.[1];
  if (placeholder) return placeholder.replace(/\.{3}$/, "");
  const id = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1] || "";
  const labels = {
    "project-search": "Search projects",
    "search-input": "Search results",
    "topic-search": "Search topics",
    "year-filter": "Filter by year",
    "type-filter": "Filter by type",
    "industry-filter": "Filter by industry",
    "category-filter": "Filter by category",
    "status-filter": "Filter by status",
    "theme-filter": "Filter by theme",
    "niche-filter": "Filter by niche"
  };
  if (labels[id]) return labels[id];
  if (/sectionFilter/i.test(attrs)) return "Filter resources by section";
  if (tagName === "select") return "Filter results";
  return null;
};

let updatedFiles = 0;
for (const file of sourceFiles) {
  let content = await readFile(file, "utf8");
  const original = content;

  content = content.replace(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi, (whole, attrs, body) => {
    if (/\baria-label(?:ledby)?\s*=|\btitle\s*=/i.test(attrs) || stripMarkup(body)) return whole;
    const label = buttonLabel(attrs, body);
    if (!label) return whole;
    let nextAttrs = attrs;
    if (/querySelector\('aside'\)/i.test(attrs)) {
      nextAttrs = attrs.replace(/\bonclick\s*=\s*"[^"]*"/i, 'onclick="toggleSidebar()"');
    }
    return `<button${addAttributes(nextAttrs, label)}>${body}</button>`;
  });

  const labelTargets = new Set([...content.matchAll(/<label\b[^>]*\bfor=["']([^"']+)["']/gi)].map((match) => match[1]));
  content = content.replace(/<(input|select|textarea)\b([^>]*)>/gi, (whole, tagName, attrs) => {
    if (/\btype=["']hidden["']/i.test(attrs) || /\bname=["']honeycomb["']/i.test(attrs)) return whole;
    const id = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    if (/\baria-label(?:ledby)?\s*=|\btitle\s*=/i.test(attrs) || (id && labelTargets.has(id))) return whole;
    const label = controlLabel(attrs, tagName.toLowerCase());
    return label ? `<${tagName}${attrs} aria-label="${escapeAttribute(label)}">` : whole;
  });

  if (content !== original) {
    await writeFile(file, content, "utf8");
    updatedFiles += 1;
  }
}

console.log(`Applied accessible names in ${updatedFiles} canonical source files.`);
