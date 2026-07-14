---
id: prj-taylor-ryan-site-remediation
type: project
summary: Audit, preserve, and safely remediate the Taylor Ryan portfolio website and its linked work artifacts without losing recoverable documentation.
tags: [taylor-ryan, portfolio-site, cloudflare, link-audit, preservation]
domain: project-management
status: active
created: 2026-07-13
updated: 2026-07-14
visibility: namespace
owner: agent
start: 2026-07-13
target:
outcome: A lean canonical Cloudflare deploy, a reviewed resource inventory, and reversible link/UI improvements on taylorryan.xyz.
part_of: ["[[pil-portfolio-agent]]"]
derived_from: ["[[fct-site-audit-2026-07-13]]", "[[fct-teneo-folder-unrelated-to-taylor-site]]"]
---

# Taylor Ryan Site Remediation

## Scope

Maintain `taylorryan.xyz` from this repository and its canonical `DEPLOY_PUBLIC/` output. The project covers duplicate cleanup, public route validation, Google resource preservation and remediation, contact-form privacy, and later UI/UX improvements.

Teneo is outside this project. Layer3 quest links and Google URLs that merely require authentication stay unchanged unless the user explicitly approves a later change.

## Current State

The preservation manifest reviewed 622 Google URLs: 25 public-working, 517 auth-required/private, and 80 confirmed broken/missing. The selective cleanup of those 80 broken URLs is live and retains its preservation ledger, private resources, and Layer3 links.

The discovery release [[tsk-seo-social-discovery-upgrade]] is live: centralized share/search metadata, corrected crawler files, branded favicons, compressed high-use images, and an ICE-ranked product review. PR #6 and Cloudflare production were verified on the custom domain.

The reversible conversion pass [[tsk-conversion-ux-reversible-pass]] is prepared on an isolated branch. It preserves the side menus, Work archive, vibecoding, Google recovery records, and Layer3 links while improving contact fit cues, navigation, accessibility, clean-route consistency, local runtime assets, and trust-logo marquees. Homepage positioning and proof-card copy remain approval-gated examples rather than live claims.

## Edges

- derived_from [[fct-site-audit-2026-07-13]] - the audit established the cleanup and link-remediation scope.
- derived_from [[fct-teneo-folder-unrelated-to-taylor-site]] - separates Taylor Ryan work from obsolete Teneo routing.
