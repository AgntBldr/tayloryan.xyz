---
id: evt-broken-google-link-cleanup-2026-07-13
type: event
summary: Selective cleanup retired 80 confirmed-broken Google URLs, preserved their history and offline mappings, and left all private and Layer3 links unchanged.
tags: [google-drive, broken-links, preservation, browser-qa, cloudflare]
domain: project-management
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
occurred_at: 2026-07-13
participants: [codex]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
derived_from: ["[[evt-resource-preservation-manifest-2026-07-13]]"]
supports: ["[[tsk-clean-broken-google-links]]", "[[fct-site-audit-2026-07-13]]"]
---

# Broken Google Link Cleanup

The deterministic cleanup used the approved preservation manifest as its exact allowlist. It retired 79 broken Drive URLs from social-work actions and one broken Sheet URL from a case-study modal. Forty-seven social entries were affected: 36 retained at least one other action, while 11 now display `No public link available`. The case-study card remains visible, its dead action is hidden, and its metadata says `Offline copy preserved` because `Ref Docs/Work/Marketing/Case Study Creation/Case Study Creation Resources.xlsx` is a matched local artifact.

The cleanup ledger at `audits/site-audit/broken-google-cleanup-ledger.{html,csv,json}` preserves all 80 original URLs, prior statuses, source locations, affected titles, and offline candidates. The baseline resource preservation manifest remains unchanged as the pre-cleanup record.

Post-change audit: 542 current Google URLs, 25 public-working, 517 auth-required/private, zero broken, and zero manual-review. All 39 Layer3 Google URLs remain present. The broader internal-route audit reports 359 live and zero broken after correcting the About-page skills link to `/skills/`.

Browser QA confirmed the unavailable case-study action is absent, a neighboring working resource action remains visible, the social no-link fallback renders, mixed social entries retain valid article buttons, and the About CTA resolves correctly.

## Edges

- derived_from [[evt-resource-preservation-manifest-2026-07-13]] - cleanup scope came only from the approved 80-row broken queue.
- supports [[tsk-clean-broken-google-links]] - implementation and local validation are complete; GitHub publication is the remaining task step.
- supports [[fct-site-audit-2026-07-13]] - records the verified post-cleanup counts.
