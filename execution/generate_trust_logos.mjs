import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "execution", "trust_logo_manifest.json");
const outputDir = path.join(root, "assets", "brand", "trust");
const reportPath = path.join(root, "audits", "site-audit", "trust-logo-assets-2026-07-14.json");
const homepagePath = path.join(root, "index.html");
const simpleIconsVersion = "16.21.0";

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
await mkdir(outputDir, { recursive: true });
await mkdir(path.dirname(reportPath), { recursive: true });

const uniqueItems = new Map();
for (const group of manifest.groups) {
  for (const item of group.items) uniqueItems.set(item.slug, item);
}

const extensionFor = (contentType, sourceUrl) => {
  if (contentType.includes("svg") || /\.svg(?:$|\?)/i.test(sourceUrl)) return "svg";
  if (contentType.includes("webp") || /\.webp(?:$|\?)/i.test(sourceUrl)) return "webp";
  if (contentType.includes("jpeg") || /\.jpe?g(?:$|\?)/i.test(sourceUrl)) return "jpg";
  if (contentType.includes("icon") || /\.ico(?:$|\?)/i.test(sourceUrl)) return "ico";
  return "png";
};

const fetchImage = async (sourceUrl) => {
  const response = await fetch(sourceUrl, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 (compatible; TaylorRyanPortfolioAssetAudit/1.0)" },
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) return null;
  const contentType = response.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.startsWith("image/")) return null;
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 100) return null;
  return { bytes, contentType, sourceUrl: response.url || sourceUrl };
};

const fetchOfficialDomainIcon = async (item) => {
  const homepageUrl = `https://${item.domain}/`;
  const candidates = [];
  try {
    const response = await fetch(homepageUrl, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (compatible; TaylorRyanPortfolioAssetAudit/1.0)" },
      signal: AbortSignal.timeout(12000)
    });
    if (response.ok) {
      const html = await response.text();
      for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
        const rel = tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] || "";
        const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
        if (!/icon/i.test(rel) || !href || href.startsWith("data:")) continue;
        const sizes = tag.match(/\bsizes\s*=\s*["'](\d+)x(\d+)["']/i);
        const size = sizes ? Number(sizes[1]) * Number(sizes[2]) : 0;
        const score = (/\.svg(?:$|\?)/i.test(href) ? 1_000_000 : 0) + Math.min(size, 512 * 512);
        candidates.push({ url: new URL(href, response.url).href, score });
      }
    }
  } catch {
    // Some historical domains block automated HTML requests; direct icon paths remain usable.
  }
  candidates.push({ url: new URL("/favicon.ico", homepageUrl).href, score: 1 });
  candidates.sort((a, b) => b.score - a.score);

  for (const candidate of candidates) {
    try {
      const image = await fetchImage(candidate.url);
      if (!image) continue;
      if (extensionFor(image.contentType, image.sourceUrl) === "ico") {
        const cachedPng = await fetchImage(`https://icon.horse/icon/${item.domain}`);
        if (cachedPng) return { ...cachedPng, sourceType: "domain-icon-cache-for-compression" };
      }
      return { ...image, sourceType: "official-domain-icon" };
    } catch {
      // Try the next icon declared by the official domain.
    }
  }

  const fallbackUrl = `https://icon.horse/icon/${item.domain}`;
  const fallback = await fetchImage(fallbackUrl);
  if (!fallback) throw new Error(`${item.name}: no usable icon from ${item.domain}`);
  return { ...fallback, sourceType: "domain-icon-cache" };
};

const results = [];
const fileBySlug = new Map();
for (const item of uniqueItems.values()) {
  let image;
  if (item.local_source) {
    const localPath = path.resolve(root, item.local_source);
    if (localPath !== root && !localPath.startsWith(`${root}${path.sep}`)) {
      throw new Error(`${item.name}: local source must stay inside the project`);
    }
    const extension = path.extname(localPath).toLowerCase();
    const contentTypes = new Map([
      [".jpg", "image/jpeg"],
      [".jpeg", "image/jpeg"],
      [".png", "image/png"],
      [".svg", "image/svg+xml"],
      [".webp", "image/webp"]
    ]);
    const contentType = contentTypes.get(extension);
    if (!contentType) throw new Error(`${item.name}: unsupported local logo format ${extension}`);
    image = {
      bytes: await readFile(localPath),
      contentType,
      sourceType: "project-archive-logo",
      sourceUrl: item.local_source.replaceAll("\\", "/")
    };
  } else if (item.simple_icon) {
    const sourceUrl = `https://cdn.jsdelivr.net/npm/simple-icons@${simpleIconsVersion}/icons/${item.simple_icon}.svg`;
    image = await fetchImage(sourceUrl);
    if (!image) throw new Error(`${item.name}: no usable Simple Icons asset`);
    let svg = image.bytes.toString("utf8");
    if (!svg.includes("<svg")) throw new Error(`${item.name}: invalid SVG response`);
    svg = svg.replace("<svg ", '<svg fill="#ffffff" ');
    image.bytes = Buffer.from(svg, "utf8");
    image.contentType = "image/svg+xml";
    image.sourceType = "simple-icons";
  } else {
    image = await fetchOfficialDomainIcon(item);
  }

  const extension = extensionFor(image.contentType, image.sourceUrl);
  const fileName = `${item.slug}.${extension}`;
  fileBySlug.set(item.slug, fileName);
  const outputBytes = extension === "svg"
    ? Buffer.from(`${image.bytes.toString("utf8").trim()}\n`, "utf8")
    : image.bytes;
  await writeFile(path.join(outputDir, fileName), outputBytes);
  results.push({
    name: item.name,
    domain: item.domain,
    display: item.display || "wordmark",
    preserve_color: item.preserve_color === true,
    file: `assets/brand/trust/${fileName}`,
    bytes: image.bytes.length,
    sha256: createHash("sha256").update(image.bytes).digest("hex"),
    source_type: image.sourceType,
    source_url: image.sourceUrl
  });
}

const expectedFiles = new Set(results.map((result) => path.basename(result.file)));
for (const fileName of await readdir(outputDir)) {
  if (!expectedFiles.has(fileName)) await unlink(path.join(outputDir, fileName));
}

const escapeHtml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const renderTrack = (group) => {
  const copies = [0, 1, 2].map((copy) => {
    const attrs = copy === 0 ? "" : ' aria-hidden="true" data-logo-copy';
    return group.items.map((item) => {
      const name = escapeHtml(item.name);
      const classes = ["trust-logo"];
      if (item.display === "mark") classes.push("trust-logo--mark");
      if (item.display === "lockup") classes.push("trust-logo--lockup");
      if (item.preserve_color) classes.push("trust-logo--color");
      const isLockup = item.display === "lockup";
      const dimensions = isLockup ? 'width="40" height="40"' : 'width="128" height="48"';
      const label = isLockup ? `<span class="trust-logo__name" aria-hidden="true">${name}</span>` : "";
      return `                <span class="${classes.join(" ")}" role="img" aria-label="${name}"${attrs}><img src="/assets/brand/trust/${fileBySlug.get(item.slug)}" alt="" ${dimensions} decoding="async">${label}</span>`;
    }).join("\n");
  });

  return [
    "            <!-- GENERATED TRUST LOGOS: edit execution/trust_logo_manifest.json, then run execution/build_trust_logos.ps1 -->",
    `            <div class="trust-logo-track flex animate-scroll whitespace-nowrap items-center" data-trust-logo-group="${group.id}">`,
    ...copies,
    "            </div>"
  ].join("\n");
};

let homepage = await readFile(homepagePath, "utf8");
for (const group of manifest.groups) {
  const sectionStart = homepage.indexOf(`<!-- ${group.section_marker} -->`);
  if (sectionStart < 0) throw new Error(`Missing homepage section: ${group.section_marker}`);
  const sectionEnd = homepage.indexOf("</section>", sectionStart);
  const generatedStart = homepage.indexOf("<!-- GENERATED TRUST LOGOS:", sectionStart);
  const originalStart = homepage.indexOf('<div\n                class="flex animate-scroll', sectionStart);
  const rawTrackStart = generatedStart >= 0 && generatedStart < sectionEnd ? generatedStart : originalStart;
  if (rawTrackStart < 0 || rawTrackStart > sectionEnd) throw new Error(`Missing marquee track in ${group.section_marker}`);
  const trackStart = homepage.lastIndexOf("\n", rawTrackStart) + 1;
  const trackEnd = homepage.indexOf("</div>", trackStart) + "</div>".length;
  homepage = homepage.slice(0, trackStart) + renderTrack(group) + homepage.slice(trackEnd);
}
await writeFile(homepagePath, homepage, "utf8");

await writeFile(reportPath, `${JSON.stringify({
  generated_at: new Date().toISOString(),
  manifest_version: manifest.version,
  simple_icons_version: simpleIconsVersion,
  asset_count: results.length,
  total_bytes: results.reduce((sum, result) => sum + result.bytes, 0),
  assets: results
}, null, 2)}\n`, "utf8");

console.log(`Generated ${results.length} local trust-logo assets and updated index.html. Run execution/build_trust_logos.ps1 for the optimized release assets.`);
