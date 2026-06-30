---
id: fct-duplicate-folders-identified
type: fact
summary: Duplicate deployment folders were identified within DEPLOY_CLOUDFLARE.
tags: [deployment, cleanup]
domain: infra-deployment
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]"]
---

Several folders were identified as potential duplicates or incorrect deploy targets, including `DEPLOY_CLOUDFLARE`, `DEPLOY_CLOUDFLARE\DEPLOY_PUBLIC`, and `DEPLOY_CLOUDFLARE\tayloryan.xyz\DEPLOY_PUBLIC`. These were flagged for comparison against the canonical folder to determine relevance.
