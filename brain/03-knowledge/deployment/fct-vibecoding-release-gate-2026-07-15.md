---
id: fct-vibecoding-release-gate-2026-07-15
type: fact
summary: The reversible Vibecoding case-study branch passes project, privacy, route, SEO, accessibility, preservation, image-budget, and desktop/mobile browser gates.
tags: [vibecoding, verification, release-gate, privacy, responsive-design]
domain: deployment
status: active
created: 2026-07-15
updated: 2026-07-15
visibility: namespace
confidence: 0.99
verified_at: 2026-07-15
verified_by: deterministic verification scripts, localhost HTTP checks, secret scan, and in-app desktop/mobile browser QA
staleness: event
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
supports: ["[[tsk-vibecoding-case-study-system]]", "[[dec-private-source-vibecoding-case-studies]]"]
tagged_with: ["[[pil-portfolio-agent]]"]
---

# Vibecoding Case Study Release Gate

The `codex/vibecoding-case-studies` branch generates a 13-project index and thirteen permanent case-study pages. All 14 Vibecoding routes return HTTP 200 locally. The dedicated verifier passes 13/13 source routes, 13/13 deploy routes, 13/13 SEO records, image existence and the 300 KB budget, modal removal, category filters, Work sidebar retention, and the private-repository boundary. Neither `github.com/AgntBldr` nor the old `github.com/KlintMarketing` account appears on the new public project surfaces.

The broader release gates also pass: SEO verifies 72 HTML files and 52 sitemap URLs; static accessibility reports zero issues across 74 source files; and the existing conversion/preservation verifier passes 18/18 checks, including 542/542 protected Google URLs, 80 recovery-ledger URLs, 39/39 Layer3 URLs, both side-menu systems, the full Work archive, and both trust marquees.

Browser QA at `1440x900` and `390x844` confirms 13 index cards, five visible System results after filtering, permanent case-study navigation, loaded hero media, correct canonical metadata, no horizontal overflow, a one-line ApplicationAgent mobile title, no heading collision with the floating Work control, and a functional mobile Work drawer. This is a local branch gate; production remains unchanged until review, merge, deploy, and custom-domain verification.

## Edges

- supports [[tsk-vibecoding-case-study-system]] - records the pre-merge done criteria that already pass.
- supports [[dec-private-source-vibecoding-case-studies]] - verifies the private-source presentation boundary.
