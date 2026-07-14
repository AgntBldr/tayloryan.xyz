---
id: dec-preserve-trust-logo-marquees
type: decision
summary: Keep both homepage trust marquees, preserve complete wordmarks, and pair symbol-only marks with the company name in normalized dark-compatible lockups.
tags: [homepage, trust-signals, logos, marquee, image-optimization]
domain: design-frontend
status: active
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
confidence: 0.99
verified_at: 2026-07-14
verified_by: user direction and acceptance, local asset audit, deterministic asset verification, and desktop browser QA
decided_on: 2026-07-14
decided_by: user
alternatives: [replace the marquees with outcome proof, remove the marquees, keep text-only company names, source exact official combined wordmark assets]
supports: ["[[tsk-conversion-ux-reversible-pass]]"]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
tagged_with: ["[[pil-portfolio-agent]]"]
---

# Preserve Trust Logo Marquees

Keep the existing company and accelerator trust-signal sections. Preserve complete horizontal wordmarks when available. When the available local asset is only a symbol, render it beside the company name as a single recognition lockup instead of leaving an unexplained icon. Twelve brands use this additive lockup treatment, including Maersk, Nordea, NEAR Protocol, and six accelerator brands.

Normalize full raster wordmarks to transparent `256x96` canvases with visible content capped at `220x68`. Normalize symbol assets used in lockups to transparent `88x88` canvases with visible content capped at `72x72`; the rendered icon and adjacent name use stable dimensions and spacing. Most marks use a dark-background-compatible monochrome treatment with color available on hover. Maersk retains its blue-tile color beside the Maersk name so the star does not collapse into a solid square.

The implementation is manifest-driven so sources, display mode, color treatment, and generated assets can be audited or regenerated. Founder Institute is pinned to a project-local source because its official icon endpoint negotiated different image formats across identical requests; generated marker replacement is line-based so repeated builds do not accumulate indentation. The text beside a symbol is a site-rendered recognition label, not a claim that the asset is an exact official combined wordmark. Logo inclusion represents an existing site trust signal; it does not independently establish the exact relationship type. Future copy should not overstate a client, employer, partner, or accelerator relationship without supporting evidence.

The user accepted the current normalized lockups as sufficient for this pass on 2026-07-14. A future refinement may replace individual site-rendered symbol-and-name pairs with exact official combined wordmark assets when authoritative, dark-compatible files can be sourced. That refinement is optional and should preserve the current manifest, dimensions, and reversible asset history.

## Edges

- supports [[tsk-conversion-ux-reversible-pass]] - implements the user's preferred trust-signal direction while retaining the original marquee structure.
