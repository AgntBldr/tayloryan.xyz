import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deployRoot = path.join(root, "DEPLOY_PUBLIC");
const reportPath = path.join(root, "audits", "site-audit", "local-frontend-assets-2026-07-14.json");

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}

const counts = { tailwind: 0, lucide: 0, outfit: 0, inter: 0 };
for (const file of await walk(deployRoot)) {
  let content = await readFile(file, "utf8");
  const original = content;

  content = content.replace(/<script\s+src=["']https:\/\/cdn\.tailwindcss\.com["']><\/script>/gi, () => {
    counts.tailwind += 1;
    return '<link rel="stylesheet" href="/assets/css/tailwind.generated.css">';
  });
  content = content.replace(/<script\s+src=["']https:\/\/unpkg\.com\/lucide@latest["']><\/script>/gi, () => {
    counts.lucide += 1;
    return '<script src="/assets/vendor/lucide-1.24.0.min.js"></script>';
  });
  content = content.replace(/<link\b[^>]*href=["']https:\/\/fonts\.googleapis\.com\/css2\?family=Outfit:[^"']+["'][^>]*>/gi, () => {
    counts.outfit += 1;
    return '<link rel="stylesheet" href="/assets/fonts/outfit.css">';
  });
  content = content.replace(/<link\b[^>]*href=["']https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:[^"']+["'][^>]*>/gi, () => {
    counts.inter += 1;
    return '<link rel="stylesheet" href="/assets/fonts/inter.css">';
  });
  content = content.replace(/@import\s+url\(["']https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:[^"']+["']\);?/gi, () => {
    counts.inter += 1;
    return '@import url("/assets/fonts/inter.css");';
  });

  if (content !== original) await writeFile(file, content, "utf8");
}

const requiredAssets = [
  "assets/css/tailwind.generated.css",
  "assets/vendor/lucide-1.24.0.min.js",
  "assets/fonts/outfit.css",
  "assets/fonts/outfit-latin-wght-normal.woff2",
  "assets/fonts/inter.css",
  "assets/fonts/inter-latin-wght-normal.woff2"
];
const missing = [];
for (const relativePath of requiredAssets) {
  try {
    await readFile(path.join(deployRoot, relativePath));
  } catch {
    missing.push(relativePath);
  }
}

const externalRuntimeReferences = [];
for (const file of await walk(deployRoot)) {
  const content = await readFile(file, "utf8");
  for (const pattern of ["cdn.tailwindcss.com", "unpkg.com/lucide", "fonts.googleapis.com"]) {
    if (content.includes(pattern)) externalRuntimeReferences.push({ file: path.relative(root, file).replaceAll("\\", "/"), pattern });
  }
}

const report = {
  generated_at: new Date().toISOString(),
  replacements: counts,
  missing_assets: missing,
  external_runtime_references: externalRuntimeReferences
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Localized runtime assets in ${counts.tailwind} Tailwind and ${counts.lucide} Lucide page references.`);
if (missing.length || externalRuntimeReferences.length) process.exitCode = 1;
