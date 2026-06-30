---
id: pbk-sync-deploy-copy
type: playbook
summary: Steps to sync the deploy copy from the V2 source.
tags: [deployment, robocopy]
domain: deployment
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]", "[[prj-teneo-website]]"]
---

To update the deployment repository from the source of truth, run `robocopy C:\Users\tempv2\Desktop\V2TeneoWebsite . /MIR /XD node_modules .next .git` from the repo root. This mirrors the directory while excluding build artifacts and git data. After copying, run `pnpm install` followed by `pnpm build` to prepare the environment.
