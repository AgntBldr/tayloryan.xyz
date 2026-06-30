---
id: fct-source-of-truth-location
type: fact
summary: The source of truth for the Teneo website is a specific local path.
tags: [development, file-system]
domain: project-setup
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]"]
---

The active development happens in `C:\Users\tempv2\Desktop\V2TeneoWebsite`. This folder is treated as the source of truth. The repository might be a mirror (e.g., for Cloudflare deployment). Parent folders are unrelated to the app. Next.js configuration sets `outputFileTracingRoot` and `turbopack.root` to ensure the app uses its own root, ignoring ancestor lockfiles.
