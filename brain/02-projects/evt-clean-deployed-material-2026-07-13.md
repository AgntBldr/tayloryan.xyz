---
id: evt-clean-deployed-material-2026-07-13
type: event
summary: Duplicate deployed material was removed while preserving the canonical DEPLOY_PUBLIC site and root functions architecture.
tags: [cleanup, deployment, deploy-public, validation]
domain: project-management
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
occurred_at: 2026-07-13
participants: [codex]
part_of: ["[[pil-portfolio-agent]]"]
supports: ["[[tsk-fix-deploy-public-mojibake]]", "[[fct-site-audit-2026-07-13]]", "[[dec-gate-legacy-cloudflare-sync]]"]
---

# Cleaned Deployed Material

The cleanup removed tracked duplicate deploy material from `DEPLOY_CLOUDFLARE/` and the nested `DEPLOY_PUBLIC/DEPLOY_PUBLIC/` copy. The physical ignored `DEPLOY_CLOUDFLARE` residue was also deleted after verifying the resolved path stayed inside `C:\Users\tempv2\PortfolioAgent`. The active root `functions/api/contact.js` remained present, so Pages Functions architecture was preserved.

The deployed output kept the canonical `DEPLOY_PUBLIC/` folder, route files, assets, `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, and `functions/`. Old `/DEPLOY_PUBLIC/*` URLs now redirect to canonical root paths through `_redirects` instead of being served as duplicate content. The deploy-output mojibake arrows were replaced with HTML entities in both source and deploy output.

Validation after cleanup: `DEPLOY_PUBLIC/DEPLOY_PUBLIC` absent, `DEPLOY_CLOUDFLARE` absent, `DEPLOY_PUBLIC` has 213 files and measures about 43.48 MB, `functions/api/contact.js` exists, deploy/audit scripts parse, sitemap routes resolve to files, local canonical routes/assets returned 200, and the refreshed audit reported 0 broken internal routes.

## Edges

- supports [[tsk-fix-deploy-public-mojibake]] - the encoded arrow output issue is fixed.
- supports [[fct-site-audit-2026-07-13]] - refreshes the cleanup state after removing duplicate deploy output.
- supports [[dec-gate-legacy-cloudflare-sync]] - routine sync remains limited to canonical `DEPLOY_PUBLIC`.
