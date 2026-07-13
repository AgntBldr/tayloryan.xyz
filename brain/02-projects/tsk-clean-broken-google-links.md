---
id: tsk-clean-broken-google-links
type: task
summary: Neutralize only the 80 confirmed-broken Google resource URLs while preserving a ledger and leaving private/auth-required and Layer3 links unchanged.
tags: [google-drive, broken-links, preservation, deploy, compact-handoff]
domain: project-management
status: done
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
assignee: codex
due:
effort: high
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
depends_on: ["[[evt-resource-preservation-manifest-2026-07-13]]", "[[dec-tiered-model-routing-site-maintenance]]"]
followed_by: ["[[evt-broken-google-link-cleanup-2026-07-13]]"]
---

# Clean Broken Google Links

## Done Criteria

- Rendering behavior is inspected before data fields are changed.
- Only the 80 `not_working_broken` URLs from the preservation manifest are retired from public actions.
- The 517 `not_public_auth_required` URLs and all Layer3 quest links remain unchanged.
- A dated cleanup ledger retains each retired URL, source location, label, and preservation status.
- `DEPLOY_PUBLIC/` and audit outputs are regenerated and route/link checks pass.
- Changes are committed and pushed on a review branch before production merge.

## Resume State

- Branch: `codex/broken-google-link-cleanup`
- Working tree at recovery: clean; selective cleanup and validation are now implemented
- Preservation report: merged to `main` in PR #2, merge commit `56cea79`
- Broken queue: 79 URLs in `assets/js/some_work_data.js`; 1 URL in `assets/js/marketing_full_data.js`
- Background goal: restored after the computer lost power on 2026-07-13
- Validation: 542 current Google URLs = 25 public-working + 517 private/auth-required + 0 broken; 359 internal routes live + 0 broken
- Browser QA: unavailable actions hidden, valid neighboring actions preserved, social fallback correct, About `/skills/` route correct
- Publication: implementation commit `fa27c38` pushed to `codex/broken-google-link-cleanup`; review PR https://github.com/AgntBldr/tayloryan.xyz/pull/3
- Preview: Cloudflare Pages passed for PR head `c4f4ae9`; the final follow-up commit changes memory only.
- Next step: review PR #3 and either merge it to trigger the normal Cloudflare deployment or request changes. Production is unchanged until merge.

## Guardrails

Do not infer that an authentication wall means a dead document. Do not replace a broken Google URL with a local filesystem path. Do not expose secrets, Resend configuration values, or inaccessible Drive metadata in memory. Public status and post-change safety must be verified by deterministic scripts and browser checks.
