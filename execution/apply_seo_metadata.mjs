import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DEPLOY_ROOT = path.join(ROOT, "DEPLOY_PUBLIC");
const CONFIG_PATH = path.join(ROOT, "execution", "seo_metadata.json");
const SEO_BLOCK = /\n?\s*<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->\s*\n?/gi;

const config = JSON.parse(await fs.readFile(CONFIG_PATH, "utf8"));
const pagesByRoute = new Map(config.pages.map((page) => [page.route, page]));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXml(value) {
  return escapeHtml(value).replaceAll("'", "&apos;");
}

function routeForFile(filePath) {
  const relative = path.relative(DEPLOY_ROOT, filePath).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) {
    return `/${relative.slice(0, -"index.html".length)}`;
  }
  return `/${relative.slice(0, -".html".length)}/`;
}

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

function buildStructuredData(page, canonicalUrl) {
  if (page.route !== "/") return "";
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${config.site.baseUrl}/#person`,
        name: "Taylor Ryan",
        url: `${config.site.baseUrl}/`,
        image: `${config.site.baseUrl}${config.site.defaultImage}`,
        jobTitle: "GTM and Growth Expert",
        sameAs: [
          "https://www.linkedin.com/in/taylorryan/",
          "https://x.com/TaylorRyanTweet",
          "https://www.youtube.com/c/TaylorRyanPLUS"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${config.site.baseUrl}/#website`,
        url: `${config.site.baseUrl}/`,
        name: config.site.siteName,
        publisher: { "@id": `${config.site.baseUrl}/#person` }
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": `${config.site.baseUrl}/#website` },
        about: { "@id": `${config.site.baseUrl}/#person` }
      }
    ]
  };
  return `\n    <script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

function buildSeoBlock(page) {
  const canonicalRoute = page.canonical ?? page.route;
  const canonicalUrl = `${config.site.baseUrl}${canonicalRoute === "/" ? "/" : canonicalRoute}`;
  const imageUrl = `${config.site.baseUrl}${page.image ?? config.site.defaultImage}`;
  const imageAlt = page.imageAlt ?? config.site.defaultImageAlt;
  const imageWidth = page.imageWidth ?? 1536;
  const imageHeight = page.imageHeight ?? 2048;
  const robots = page.index === false
    ? "noindex,follow,noarchive"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  return `
    <!-- SEO:START -->
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="${robots}">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/assets/brand/favicon-32x32.png" type="image/png" sizes="32x32">
    <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png" sizes="180x180">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#050505">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escapeHtml(config.site.siteName)}">
    <meta property="og:locale" content="en_US">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta property="og:image" content="${escapeHtml(imageUrl)}">
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
    <meta property="og:image:width" content="${escapeHtml(imageWidth)}">
    <meta property="og:image:height" content="${escapeHtml(imageHeight)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(page.title)}">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}">${buildStructuredData(page, canonicalUrl)}
    <!-- SEO:END -->`;
}

const htmlFiles = (await walk(DEPLOY_ROOT)).filter((file) => file.endsWith(".html"));
const updated = [];
const skippedFragments = [];
const missingMetadata = [];

for (const file of htmlFiles) {
  const original = await fs.readFile(file, "utf8");
  if (!/<head[\s>]/i.test(original) || !/<\/head>/i.test(original)) {
    skippedFragments.push(path.relative(DEPLOY_ROOT, file).split(path.sep).join("/"));
    continue;
  }

  const route = routeForFile(file);
  const page = pagesByRoute.get(route);
  if (!page) {
    missingMetadata.push(`${route} (${path.relative(DEPLOY_ROOT, file)})`);
    continue;
  }

  let html = original.replace(SEO_BLOCK, "\n");
  html = html.replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, "\n");
  html = html.replace(/\s*<meta\s+property=["']og:url["'][^>]*>\s*/gi, "\n");

  const title = `<title>${escapeHtml(page.title)}</title>`;
  if (/<title[\s>][\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(/<title[\s>][\s\S]*?<\/title>/i, title);
  } else {
    html = html.replace(/<head([^>]*)>/i, `<head$1>\n    ${title}`);
  }

  html = html.replace(/<\/head>/i, `${buildSeoBlock(page)}\n</head>`);
  if (html !== original) {
    await fs.writeFile(file, html, "utf8");
    updated.push(path.relative(DEPLOY_ROOT, file).split(path.sep).join("/"));
  }
}

if (missingMetadata.length) {
  throw new Error(`Missing SEO metadata for:\n${missingMetadata.join("\n")}`);
}

await fs.copyFile(path.join(ROOT, "robots.txt"), path.join(DEPLOY_ROOT, "robots.txt"));
await fs.copyFile(path.join(ROOT, "site.webmanifest"), path.join(DEPLOY_ROOT, "site.webmanifest"));
await fs.copyFile(path.join(ROOT, "favicon.ico"), path.join(DEPLOY_ROOT, "favicon.ico"));

const indexableRoutes = [...new Set(config.pages
  .filter((page) => page.index !== false && !page.canonical)
  .map((page) => page.route))]
  .sort((a, b) => a.localeCompare(b));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexableRoutes.map((route) => `  <url>
    <loc>${escapeXml(`${config.site.baseUrl}${route === "/" ? "/" : route}`)}</loc>
    <lastmod>${config.site.lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>
`;
await fs.writeFile(path.join(DEPLOY_ROOT, "sitemap.xml"), sitemap, "utf8");

console.log(`SEO metadata applied to ${updated.length} HTML files.`);
console.log(`Sitemap generated with ${indexableRoutes.length} canonical URLs.`);
console.log(`Skipped ${skippedFragments.length} HTML fragments without a head element.`);
