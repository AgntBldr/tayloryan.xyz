import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deployRoot = path.join(root, "DEPLOY_PUBLIC");
const metadata = JSON.parse(await readFile(path.join(root, "execution", "seo_metadata.json"), "utf8"));
const reportPath = path.join(root, "audits", "site-audit", "clean-route-normalization-2026-07-14.json");

const routeMap = new Map(metadata.pages.map((page) => [page.route, page.canonical || page.route]));

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}

const routeForFile = (file) => {
  const relative = path.relative(deployRoot, file).replaceAll("\\", "/");
  return relative.endsWith("/index.html")
    ? `/${relative.slice(0, -"index.html".length)}`
    : relative === "index.html" ? "/" : `/${relative}`;
};

const normalizePath = (pathname) => {
  if (!/\.html$/i.test(pathname)) return null;
  const clean = pathname.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "/");
  return clean.startsWith("/") ? clean : `/${clean}`;
};

const deployHtmlFiles = await walk(deployRoot);
const deployHtmlFileSet = new Set(deployHtmlFiles.map((file) => path.normalize(file)));
const baseRouteForFile = (file) => {
  const relative = path.relative(deployRoot, file).replaceAll("\\", "/");
  if (relative.endsWith("/index.html")) {
    const siblingLegacy = path.join(deployRoot, `${relative.slice(0, -"/index.html".length)}.html`);
    if (deployHtmlFileSet.has(path.normalize(siblingLegacy))) return routeForFile(siblingLegacy);
  }
  return routeForFile(file);
};

const changes = [];
const unresolved = [];
for (const file of deployHtmlFiles) {
  let content = await readFile(file, "utf8");
  const original = content;
  const currentRoute = baseRouteForFile(file);
  const baseUrl = new URL(currentRoute, "https://taylorryan.xyz");

  content = content.replace(/\bhref\s*=\s*(["'])([^"']+)\1/gi, (whole, quote, href) => {
    if (/^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) return whole;
    let resolved;
    try {
      resolved = new URL(href, baseUrl);
    } catch {
      return whole;
    }
    if (resolved.hostname !== "taylorryan.xyz") return whole;
    const normalizedRoute = normalizePath(resolved.pathname);
    if (!normalizedRoute) return whole;
    const canonicalRoute = routeMap.get(normalizedRoute);
    if (!canonicalRoute) {
      unresolved.push({ file: path.relative(root, file).replaceAll("\\", "/"), href, resolved: normalizedRoute });
      return whole;
    }
    const replacement = `${canonicalRoute}${resolved.search}${resolved.hash}`;
    changes.push({ file: path.relative(root, file).replaceAll("\\", "/"), from: href, to: replacement });
    return `href=${quote}${replacement}${quote}`;
  });

  if (content !== original) await writeFile(file, content, "utf8");
}

const remaining = [];
for (const file of deployHtmlFiles) {
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(/\bhref\s*=\s*["']([^"']+\.html(?:[?#][^"']*)?)["']/gi)) {
    if (!/^https?:\/\//i.test(match[1]) || new URL(match[1]).hostname === "taylorryan.xyz") {
      remaining.push({ file: path.relative(root, file).replaceAll("\\", "/"), href: match[1] });
    }
  }
}

const report = {
  generated_at: new Date().toISOString(),
  normalized_count: changes.length,
  unresolved_count: unresolved.length,
  remaining_internal_html_links: remaining.length,
  changes,
  unresolved,
  remaining
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Normalized ${changes.length} public links; ${remaining.length} internal .html link(s) remain.`);
if (unresolved.length || remaining.length) process.exitCode = 1;
