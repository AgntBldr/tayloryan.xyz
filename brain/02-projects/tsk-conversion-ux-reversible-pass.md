---
id: tsk-conversion-ux-reversible-pass
type: task
summary: Prepare a reversible conversion and usability pass that preserves the portfolio archive, side menus, vibecoding, and recoverable resource records.
tags: [conversion, ui-ux, accessibility, performance, trust-logos, preservation]
domain: project-management
status: doing
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
assignee: codex
due:
effort: high
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
depends_on: ["[[dec-approval-gated-conversion-copy]]", "[[dec-preserve-trust-logo-marquees]]", "[[dec-use-resource-preservation-manifest-before-google-link-removal]]"]
tagged_with: ["[[pil-portfolio-agent]]"]
---

# Reversible Conversion UX Pass

## Done Criteria

- Work and Marketing side menus remain functional on desktop and mobile.
- Vibecoding remains prominent, and the full Work archive remains available.
- Existing Google and Layer3 resource records remain recoverable through the preservation ledger.
- Trust marquees use compressed, dark-compatible logo assets instead of placeholder company text.
- Clean routes, local frontend assets, contact fit cues, and accessibility improvements pass deterministic and browser checks.
- Homepage positioning and proof-card copy remain examples until the user explicitly approves them.
- The branch is reviewed through a Cloudflare preview, merged, deployed, and verified before this task is marked done.

## Current State

The implementation is isolated on `codex/conversion-ux-pass` from base commit `8127110`. Git history is split into implementation, QA/report evidence, and Second Brain memory commits so each layer can be reviewed or reverted independently. The follow-up normalizes visible logo area, replaces eleven hidden modal placeholders with neutral linked fallbacks, and adds direct report links to seven homepage copy sections and the buyer-proof example. The 17-check preservation gate, SEO verifier, static accessibility audit, and browser QA pass. Production and `main` remain unchanged pending review.
