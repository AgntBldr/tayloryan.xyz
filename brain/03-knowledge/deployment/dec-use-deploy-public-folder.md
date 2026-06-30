---
id: dec-use-deploy-public-folder
type: decision
summary: Cloudflare Pages builds exclusively from DEPLOY_PUBLIC.
tags: [cloudflare, configuration]
domain: deployment
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]"]
---

The project uses `DEPLOY_PUBLIC/` as the canonical deployment folder. Cloudflare Pages is specifically configured to build from this directory. Creating other deployment folders like `DEPLOY_CLOUDFLARE` or `tayloryan.xyz` is prohibited as they will be ignored or cause confusion.
