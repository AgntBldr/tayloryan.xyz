---
id: fct-teneo-folder-unrelated-to-taylor-site
type: fact
summary: The Teneo copied folder under DEPLOY_CLOUDFLARE is unrelated to the Taylor Ryan website cleanup.
tags: [cleanup, duplicate-folder, teneo]
domain: deployment
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
confidence: 1.0
verified_at: 2026-07-13
verified_by: user clarification
part_of: ["[[pil-portfolio-agent]]"]
supports: ["[[fct-site-audit-2026-07-13]]"]
---

# Teneo Folder Unrelated

The user clarified that Teneo has nothing to do with the Taylor Ryan website and that `DEPLOY_CLOUDFLARE/teneo-protocol.ai` may simply be a copied folder. For this cleanup, treat that folder as a stray copied app, not as source-of-truth for the Taylor Ryan website. It should still be moved/deleted only after explicit approval because it is large and contains its own `.git`, `.next`, `node_modules`, and source folders.

## Edges

- supports [[fct-site-audit-2026-07-13]] - explains why the audit categorizes the folder as a stray copied app.
