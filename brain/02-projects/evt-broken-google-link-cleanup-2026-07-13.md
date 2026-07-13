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

Implementation commit `fa27c38` was pushed to `codex/broken-google-link-cleanup` and opened as GitHub PR #3: https://github.com/AgntBldr/tayloryan.xyz/pull/3. The PR was merged to `main` as `cdb5075f0f834804dcacd5c23ec6896ba59b97b2`, and Cloudflare production deployment `76b2fd8f-c3be-44cd-8dcf-fc3445ccfbce` passed.

Production verification on the custom domain confirmed HTTP 200 for `/`, `/about/`, `/skills/`, `/work_some/`, `/portfolio/`, and `/marketing/case_studies/`; zero retired URLs; all 395 private URLs in the touched source datasets; all 39 Layer3 URLs; the corrected About CTA; the missing-link modal guard; and the `Offline copy preserved` case-study metadata.

The Cloudflare Pages preview check passed for PR head `c4f4ae9`. Immediately after the production deployment, the immutable deployment URL served the new marketing asset before the custom domain did. The custom domain converged without a code workaround, after which its marketing asset returned the expected content and ETag. See [[fct-cloudflare-custom-domain-propagation-lag-2026-07-13]].

## Edges

- derived_from [[evt-resource-preservation-manifest-2026-07-13]] - cleanup scope came only from the approved 80-row broken queue.
- supports [[tsk-clean-broken-google-links]] - implementation, local validation, and GitHub publication are complete.
- supports [[fct-site-audit-2026-07-13]] - records the verified post-cleanup counts.
- supports [[fct-cloudflare-custom-domain-propagation-lag-2026-07-13]] - provides the deployment observation from which the propagation fact was recorded.
