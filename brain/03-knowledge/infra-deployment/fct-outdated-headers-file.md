---
id: fct-outdated-headers-file
type: fact
summary: Duplicate folder contained an outdated _headers file.
tags: [deployment, files]
domain: infra-deployment
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]"]
---

A comparison between the canonical folder and `DEPLOY_CLOUDFLARE\DEPLOY_PUBLIC` revealed a difference in the `_headers` file size. The duplicate contained a 639-byte version, while the canonical folder contained the more recent 800-byte version.
