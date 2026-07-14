import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DEPLOY_ROOT = path.join(ROOT, "DEPLOY_PUBLIC");
const config = JSON.parse(await fs.readFile(path.join(ROOT, "execution", "seo_metadata.json"), "utf8"));
const pagesByRoute = new Map(config.pages.map((page) => [page.route, page]));
const errors = [];

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function routeForFile(filePath) {
  const relative = path.relative(DEPLOY_ROOT, filePath).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative.slice(0, -".html".length)}/`;
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function contentOf(html, attributeName, attributeValue) {
  const escaped = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+${attributeName}=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i");
  return html.match(pattern)?.[1] ?? "";
}

const indexableDescriptions = new Map();
for (const page of config.pages) {
  const length = [...page.description].length;
  if (length < 120 || length > 158) {
    errors.push(`${page.route}: description length ${length}, expected 120-158`);
  }
  if (page.index !== false) {
    if (indexableDescriptions.has(page.description)) {
      errors.push(`${page.route}: duplicate description also used by ${indexableDescriptions.get(page.description)}`);
    }
    indexableDescriptions.set(page.description, page.route);
  }
}

const htmlFiles = (await walk(DEPLOY_ROOT)).filter((file) => file.endsWith(".html"));
let pagesChecked = 0;
for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  if (!/<head[\s>]/i.test(html) || !/<\/head>/i.test(html)) continue;
  const route = routeForFile(file);
  const page = pagesByRoute.get(route);
  if (!page) {
    errors.push(`${route}: HTML page has no metadata configuration`);
    continue;
  }
  pagesChecked += 1;
  const expectedCanonical = `${config.site.baseUrl}${page.canonical ?? page.route}`;
  const checks = [
    ["description", /<meta\s+name=["']description["']/gi],
    ["robots", /<meta\s+name=["']robots["']/gi],
    ["canonical", /<link\s+rel=["']canonical["']/gi],
    ["Open Graph title", /<meta\s+property=["']og:title["']/gi],
    ["Open Graph image", /<meta\s+property=["']og:image["']/gi],
    ["Twitter card", /<meta\s+name=["']twitter:card["']/gi],
    ["favicon", /<link\s+rel=["']icon["']/gi],
    ["manifest", /<link\s+rel=["']manifest["']/gi]
  ];
  for (const [label, pattern] of checks) {
    const found = count(html, pattern);
    const expected = label === "favicon" ? 2 : 1;
    if (found !== expected) errors.push(`${route}: expected ${expected} ${label} tag(s), found ${found}`);
  }
  if (!html.includes(`href="${expectedCanonical}"`)) errors.push(`${route}: canonical URL mismatch`);
  if (!html.includes(`content="${config.site.baseUrl}${config.site.defaultImage}"`)) errors.push(`${route}: social image mismatch`);
  const description = contentOf(html, "name", "description");
  if (!description) errors.push(`${route}: description content missing`);
}

const sitemap = await fs.readFile(path.join(DEPLOY_ROOT, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
const expectedUrls = [...new Set(config.pages
  .filter((page) => page.index !== false && !page.canonical)
  .map((page) => `${config.site.baseUrl}${page.route}`))].sort();
if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls)) errors.push("sitemap.xml does not match the indexable canonical route set");

const robots = await fs.readFile(path.join(DEPLOY_ROOT, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${config.site.baseUrl}/sitemap.xml`)) errors.push("robots.txt sitemap declaration is missing");

const headers = await fs.readFile(path.join(DEPLOY_ROOT, "_headers"), "utf8");
for (const route of ["overview_blog_content", "overview_content_gen", "overview_raw", "overview_toc_gen"]) {
  if (!headers.includes(`/${route}/*`) || !headers.includes("X-Robots-Tag: noindex")) errors.push(`${route}: noindex response header is missing`);
}

for (const asset of [
  "assets/brand/favicon.svg",
  "assets/brand/favicon-32x32.png",
  "assets/brand/apple-touch-icon.png",
  "assets/images/taylor_headshot.jpg",
  "favicon.ico",
  "site.webmanifest"
]) {
  try {
    const stat = await fs.stat(path.join(DEPLOY_ROOT, asset));
    if (!stat.isFile() || stat.size === 0) errors.push(`${asset}: missing or empty`);
  } catch {
    errors.push(`${asset}: missing`);
  }
}

if (errors.length) {
  console.error(`SEO verification failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO verification passed: ${pagesChecked} HTML files, ${expectedUrls.length} sitemap URLs, complete social and favicon metadata.`);
