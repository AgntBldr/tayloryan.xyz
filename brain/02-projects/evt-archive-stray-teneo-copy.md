---
id: evt-archive-stray-teneo-copy
type: event
summary: The unrelated Teneo app copy was moved out of the PortfolioAgent repo to reduce local bloat.
tags: [cleanup, duplicate-folder, teneo, archive]
domain: project-management
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
occurred_at: 2026-07-13
participants: [codex, user]
part_of: ["[[pil-portfolio-agent]]", "[[prj-teneo-website]]"]
supports: ["[[fct-teneo-folder-unrelated-to-taylor-site]]", "[[fct-site-audit-2026-07-13]]"]
---

# Archived Stray Teneo Copy

After user approval, `C:\Users\tempv2\PortfolioAgent\DEPLOY_CLOUDFLARE\teneo-protocol.ai` was moved to `C:\Users\tempv2\PortfolioAgent_ExternalArchive\20260713-stray-teneo-protocol.ai`. The move was reversible and did not delete the folder. `DEPLOY_CLOUDFLARE` dropped from about 843 MB to about 113 MB, and the refreshed audit dashboard no longer reports the Teneo copy as present.

## Edges

- supports [[fct-teneo-folder-unrelated-to-taylor-site]] - implements the approved move of the unrelated copied app.
- supports [[fct-site-audit-2026-07-13]] - resolves the largest noncanonical local bloat item found by the audit.
