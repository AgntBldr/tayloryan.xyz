---
id: dec-gate-legacy-cloudflare-sync
type: decision
summary: deploy_sync.ps1 should sync only DEPLOY_PUBLIC by default and gate legacy DEPLOY_CLOUDFLARE copying behind an explicit env var.
tags: [deployment, cleanup, cloudflare, script]
domain: deployment
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
confidence: 1.0
verified_at: 2026-07-13
verified_by: codex safe-fix pass
part_of: ["[[pil-portfolio-agent]]"]
supports: ["[[dec-use-deploy-public-folder]]"]
---

# Gate Legacy Cloudflare Sync

`deploy_sync.ps1` now derives `$SourceRoot` from `$PSScriptRoot` and writes to `DEPLOY_PUBLIC` in the current repo. The old final copy into `DEPLOY_CLOUDFLARE\tayloryan.xyz\DEPLOY_PUBLIC` is disabled by default and only runs when `PORTFOLIO_SYNC_CLOUDFLARE_COPY=1`. This prevents the old duplicate deploy tree from being recreated by routine syncs while preserving an explicit escape hatch if the user needs it.

## Edges

- supports [[dec-use-deploy-public-folder]] - normal deployment should flow through the canonical `DEPLOY_PUBLIC/` folder only.
