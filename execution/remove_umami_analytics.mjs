import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const excludedDirectories = new Set([
  ".git",
  ".tmp",
  "audits",
  "backups",
  "brain",
  "node_modules",
  "Ref Docs",
]);
const umamiBlock = /[ \t]*<!-- Umami Analytics -->\r?\n[ \t]*<script defer src="https:\/\/cloud\.umami\.is\/script\.js" data-website-id="[^"]+"><\/script>\r?\n?/g;

let changed = 0;

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(absolutePath);
      continue;
    }
    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".html") continue;

    const original = fs.readFileSync(absolutePath, "utf8");
    const updated = original.replace(umamiBlock, "");
    if (updated === original) continue;

    fs.writeFileSync(absolutePath, updated, "utf8");
    changed += 1;
  }
}

visit(root);
console.log(`Removed Umami Analytics from ${changed} HTML files.`);
