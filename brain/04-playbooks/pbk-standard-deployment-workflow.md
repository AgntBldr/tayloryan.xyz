---
id: pbk-standard-deployment-workflow
type: playbook
summary: Steps to deploy changes to Cloudflare Pages.
tags: [workflow]
domain: deployment
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]"]
---

The deployment workflow involves four main steps. First, make changes to source files. Second, run build scripts if applicable to update the `DEPLOY_PUBLIC` folder. Third, commit and push the changes to the GitHub repository. Finally, Cloudflare Pages detects the push and automatically deploys the content from `DEPLOY_PUBLIC`.
