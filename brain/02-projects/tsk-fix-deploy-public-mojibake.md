---
id: tsk-fix-deploy-public-mojibake
type: task
summary: Fix mojibake arrow characters in deploy output and prevent source/deploy encoding drift.
tags: [deployment, encoding, cleanup, ui]
domain: project-management
status: done
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
assignee: user
due:
effort: small
part_of: ["[[pil-portfolio-agent]]"]
depends_on: ["[[evt-review-cleanup-safety-2026-07-13]]"]
followed_by: ["[[evt-clean-deployed-material-2026-07-13]]"]
---

# Fix Deploy Public Mojibake

Review found that the live site and `DEPLOY_PUBLIC` output contained mojibake where arrow symbols were intended. `index.html` had the correct Unicode arrows, but `DEPLOY_PUBLIC/index.html:366` had a mojibake right-arrow sequence near the testimonials link and `DEPLOY_PUBLIC/index.html:469` had a mojibake prompt-arrow sequence near the terminal prompt. `DEPLOY_PUBLIC/contact/index.html:70` also had a mojibake right-arrow sequence, and the nested `DEPLOY_PUBLIC/DEPLOY_PUBLIC` copy contained the same issue.

Done: the source and deploy output now use HTML entities for those arrows, the nested deploy copy was removed, and validation found no U+00E2 mojibake arrow sequences in the active deploy output.

## Edges

- depends_on [[evt-review-cleanup-safety-2026-07-13]] - issue was discovered during the post-cleanup safety review.
- followed_by [[evt-clean-deployed-material-2026-07-13]] - cleanup completed the fix.
