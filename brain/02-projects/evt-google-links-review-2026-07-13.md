---
id: evt-google-links-review-2026-07-13
type: event
summary: A Google-only link review report separated public-working resources from private and broken Google URLs.
tags: [audit, google-drive, links, triage]
domain: project-management
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
occurred_at: 2026-07-13
participants: [codex]
part_of: ["[[pil-portfolio-agent]]"]
supports: ["[[fct-site-audit-2026-07-13]]", "[[tsk-review-site-audit-dashboard]]"]
---

# Google Links Review

Generated a focused Google links review from `audits/site-audit/audit-results.json` using `execution/google_links_report.mjs`. Outputs:

- `audits/site-audit/google-links-review.html`
- `audits/site-audit/google-links-review.csv`
- `audits/site-audit/google-links-review.json`

The refreshed audit contains 622 unique Google URLs. Public-working/live links: 25. Non-public or not-working links: 597 total, split into 517 auth-required/private resources and 80 broken/missing resources. There were no Google links in the manual-retry bucket.

Do not remove all Google links. Keep the 25 public-working links unless the content itself should be retired. Triage the 80 broken links first as replace-or-hide, then work through the 517 private/auth-required links as re-share, replace, or hide depending on whether the artifact is still useful and recoverable.

## Edges

- supports [[fct-site-audit-2026-07-13]] - refines the Google-resource action bucket from the full audit.
- supports [[tsk-review-site-audit-dashboard]] - gives the user a reviewable artifact before link removal decisions.
