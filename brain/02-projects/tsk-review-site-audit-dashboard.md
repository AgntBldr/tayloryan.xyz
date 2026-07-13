---
id: tsk-review-site-audit-dashboard
type: task
summary: Review the generated site audit dashboard and approve cleanup/link remediation slices before any destructive changes.
tags: [audit, cleanup, approval, links]
domain: project-management
status: todo
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
assignee: user
due:
effort: medium
part_of: ["[[pil-portfolio-agent]]", "[[prj-teneo-website]]"]
depends_on: ["[[fct-site-audit-2026-07-13]]"]
---

# Review Site Audit Dashboard

Review `audits/site-audit/dashboard.html` and approve the next cleanup slices. Recommended order: first confirm whether `DEPLOY_CLOUDFLARE/teneo-protocol.ai` can be moved or deleted, then update `deploy_sync.ps1` to derive paths from `$PSScriptRoot`, then fix the one internal route data issue, then work through Google resources by replacement/re-share priority. Do not change Layer3 quest links without explicit approval.
