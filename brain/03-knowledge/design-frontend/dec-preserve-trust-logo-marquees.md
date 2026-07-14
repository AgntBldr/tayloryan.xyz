---
id: dec-preserve-trust-logo-marquees
type: decision
summary: Keep both homepage trust marquees and replace placeholder company-name text with compact, transparent, dark-compatible logo assets.
tags: [homepage, trust-signals, logos, marquee, image-optimization]
domain: design-frontend
status: active
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
confidence: 0.99
verified_at: 2026-07-14
verified_by: user direction, local asset audit, and desktop browser QA
decided_on: 2026-07-14
decided_by: user
alternatives: [replace the marquees with outcome proof, remove the marquees, keep text-only company names]
supports: ["[[tsk-conversion-ux-reversible-pass]]"]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
tagged_with: ["[[pil-portfolio-agent]]"]
---

# Preserve Trust Logo Marquees

Keep the existing company and accelerator trust-signal sections. Replace placeholder text labels with recognizable local logo assets selected from the project archive or a verified official-domain source. Normalize raster logos to transparent `256x96` PNGs, crop source padding, and scale by visible content area within fixed width and height limits. Icon-only SVGs use one smaller mark class. Most marks use a dark-background-compatible monochrome treatment with color available on hover; Maersk retains its official blue-tile color so the star does not collapse into a solid square.

The implementation is manifest-driven so sources and generated assets can be audited or regenerated. Founder Institute is pinned to a project-local source because its official icon endpoint negotiated different image formats across identical requests; generated marker replacement is line-based so repeated builds do not accumulate indentation. Logo inclusion represents an existing site trust signal; it does not independently establish the exact relationship type. Future copy should not overstate a client, employer, partner, or accelerator relationship without supporting evidence.

## Edges

- supports [[tsk-conversion-ux-reversible-pass]] - implements the user's preferred trust-signal direction while retaining the original marquee structure.
