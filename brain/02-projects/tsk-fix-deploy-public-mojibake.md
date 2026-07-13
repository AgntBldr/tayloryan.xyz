---
id: tsk-fix-deploy-public-mojibake
type: task
summary: Fix mojibake arrow characters in deploy output and prevent source/deploy encoding drift.
tags: [deployment, encoding, cleanup, ui]
domain: project-management
status: todo
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
assignee: user
due:
effort: small
part_of: ["[[pil-portfolio-agent]]"]
depends_on: ["[[evt-review-cleanup-safety-2026-07-13]]"]
---

# Fix Deploy Public Mojibake

Review found that the live site and `DEPLOY_PUBLIC` output contain mojibake where arrow symbols were intended. `index.html` has the correct Unicode arrows, but `DEPLOY_PUBLIC/index.html:366` has a mojibake right-arrow sequence near the testimonials link and `DEPLOY_PUBLIC/index.html:469` has a mojibake prompt-arrow sequence near the terminal prompt. `DEPLOY_PUBLIC/contact/index.html:70` also has a mojibake right-arrow sequence, and the nested `DEPLOY_PUBLIC/DEPLOY_PUBLIC` copy contains the same issue.

Done means the deploy output no longer contains U+00E2 mojibake arrow sequences, the live homepage/contact page render the intended symbols or icon replacements, and the sync path cannot reintroduce the mojibake from stale deploy artifacts.

## Edges

- depends_on [[evt-review-cleanup-safety-2026-07-13]] - issue was discovered during the post-cleanup safety review.
