---
id: fct-site-audit-2026-07-13
type: fact
summary: The July 13 site audit found DEPLOY_CLOUDFLARE as the main local bloat source and Google resources as the main link remediation bucket.
tags: [audit, cleanup, links, cloudflare, google-drive]
domain: deployment
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
confidence: 0.95
verified_at: 2026-07-13
verified_by: codex audit_site.mjs
part_of: ["[[pil-portfolio-agent]]", "[[prj-teneo-website]]"]
supports: ["[[dec-use-deploy-public-folder]]"]
followed_by: ["[[evt-archive-stray-teneo-copy]]", "[[evt-clean-deployed-material-2026-07-13]]"]
---

# Site Audit 2026-07-13

The audit runner `execution/audit_site.mjs` generated `audits/site-audit/dashboard.html` and `audit-results.json`. It checked the canonical deployed surface plus generated quest/resource data without changing production files. Final scoped counts before the safe-fix pass: 3,263 records, 2,077 live, 597 Google resources needing replace/re-share review, 21 Layer3 links needing manual approval before any change, 159 retry/manual-review links, and 1 broken internal route. Cleanup findings identified `DEPLOY_CLOUDFLARE` as the dominant local size contributor at 843.09 MB, followed by `.git` at 449.82 MB and `Ref Docs` at 412.56 MB. The nested `DEPLOY_CLOUDFLARE/teneo-protocol.ai` copy contained a full Next.js app with `.git`, `.next`, and `node_modules`; the user clarified on 2026-07-13 that Teneo has nothing to do with the Taylor Ryan site. It was moved outside the repo in [[evt-archive-stray-teneo-copy]], after which `DEPLOY_CLOUDFLARE` measured about 113 MB.

On the deployed-material cleanup branch, duplicate deploy output was removed: `DEPLOY_CLOUDFLARE` and `DEPLOY_PUBLIC/DEPLOY_PUBLIC` are absent, canonical `DEPLOY_PUBLIC` remains about 43.48 MB with 213 files, and root `functions/api/contact.js` remains present. The refreshed audit still has 3,263 records and 0 broken internal routes; action buckets are 597 Google resources to replace/re-share, 2 Layer3 links to leave unless approved, 159 manual/browser retry links, and 2,101 live links.

## Edges

- followed_by [[evt-clean-deployed-material-2026-07-13]] - duplicate deploy material was removed after this audit's first cleanup pass.

## Edges

- supports [[dec-use-deploy-public-folder]] - the audit confirms `DEPLOY_PUBLIC/` should remain the canonical deploy target and duplicate deploy folders need approval before removal.
