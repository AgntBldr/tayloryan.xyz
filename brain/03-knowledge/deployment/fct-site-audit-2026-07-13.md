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
---

# Site Audit 2026-07-13

The audit runner `execution/audit_site.mjs` generated `audits/site-audit/dashboard.html` and `audit-results.json`. It checked the canonical deployed surface plus generated quest/resource data without changing production files. Final scoped counts before the safe-fix pass: 3,263 records, 2,077 live, 597 Google resources needing replace/re-share review, 21 Layer3 links needing manual approval before any change, 159 retry/manual-review links, and 1 broken internal route. Cleanup findings identify `DEPLOY_CLOUDFLARE` as the dominant local size contributor at 843.09 MB, followed by `.git` at 449.82 MB and `Ref Docs` at 412.56 MB. The nested `DEPLOY_CLOUDFLARE/teneo-protocol.ai` copy contains a full Next.js app with `.git`, `.next`, and `node_modules`; the user clarified on 2026-07-13 that Teneo has nothing to do with the Taylor Ryan site and may simply be a copied folder, so treat it as a stray copied app pending approval to move/delete.

## Edges

- supports [[dec-use-deploy-public-folder]] - the audit confirms `DEPLOY_PUBLIC/` should remain the canonical deploy target and duplicate deploy folders need approval before removal.
