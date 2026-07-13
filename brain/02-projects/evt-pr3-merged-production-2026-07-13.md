---
id: evt-pr3-merged-production-2026-07-13
type: event
summary: PR #3 merged the selective Google-link cleanup to main, Cloudflare deployed it successfully, and production preserved every protected link category.
tags: [deployment, cloudflare, google-drive, production-verification]
domain: project-management
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
occurred_at: 2026-07-13
participants: [user, codex]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
derived_from: ["[[evt-broken-google-link-cleanup-2026-07-13]]"]
supports: ["[[tsk-clean-broken-google-links]]", "[[fct-cloudflare-custom-domain-propagation-lag-2026-07-13]]"]
---

# PR #3 Production Merge

GitHub PR #3, `Selective cleanup of confirmed broken Google links`, merged into `main` as commit `cdb5075f0f834804dcacd5c23ec6896ba59b97b2`. Cloudflare Pages production deployment `76b2fd8f-c3be-44cd-8dcf-fc3445ccfbce` completed successfully.

Custom-domain verification returned HTTP 200 for six representative routes and confirmed zero retired URLs. The touched source datasets still contain all 395 expected private/auth-required URLs and all 39 Layer3 URLs. The About CTA points to `/skills/`, unavailable case-study actions are guarded, and the retained case-study record identifies its offline copy.

The immutable Cloudflare deployment URL updated before the custom domain's marketing data asset. The custom domain converged without a committed workaround and passed the same content checks afterward.

## Edges

- derived_from [[evt-broken-google-link-cleanup-2026-07-13]] - this event publishes the completed cleanup.
- supports [[tsk-clean-broken-google-links]] - confirms its final production done criteria.
- supports [[fct-cloudflare-custom-domain-propagation-lag-2026-07-13]] - records the observed deployment behavior.
