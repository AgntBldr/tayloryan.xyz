---
id: pbk-run-sync-script-before-push
type: playbook
summary: Execute deploy_sync.ps1 before pushing changes.
tags: [workflow, powershell]
domain: deployment
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]", "[[prj-teneo-website]]"]
---

Before pushing changes to GitHub, developers must run the sync script `./deploy_sync.ps1`. This ensures that assets are correctly synced and that `work.html` is transformed to support sub-directory routing. This step is mandatory for the standard deployment protocol.
