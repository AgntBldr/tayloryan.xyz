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

Keep the existing company and accelerator trust-signal sections. Replace placeholder text labels with recognizable local logo assets selected from the project archive or a verified official-domain source. Normalize raster logos to transparent `256x96` PNGs, preserve wide wordmarks, and render the set in a dark-background-compatible monochrome treatment with color available on hover.

The implementation is manifest-driven so sources and generated assets can be audited or regenerated. Logo inclusion represents an existing site trust signal; it does not independently establish the exact relationship type. Future copy should not overstate a client, employer, partner, or accelerator relationship without supporting evidence.

## Edges

- supports [[tsk-conversion-ux-reversible-pass]] - implements the user's preferred trust-signal direction while retaining the original marquee structure.
