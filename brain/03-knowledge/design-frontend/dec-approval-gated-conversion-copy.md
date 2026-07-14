---
id: dec-approval-gated-conversion-copy
type: decision
summary: Show homepage positioning and case-study proof examples in the review report before changing live copy or asserting unsupported outcomes.
tags: [homepage, positioning, case-studies, approval, evidence]
domain: design-frontend
status: active
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
confidence: 0.99
verified_at: 2026-07-14
verified_by: user direction and product review artifact
decided_on: 2026-07-14
decided_by: user and codex
alternatives: [apply the suggested copy immediately, leave placeholder proof indefinitely, invent outcome metrics to complete proof cards]
supports: ["[[tsk-conversion-ux-reversible-pass]]"]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
tagged_with: ["[[pil-portfolio-agent]]"]
---

# Approval-Gated Conversion Copy

Treat homepage positioning and richer case-study proof as approval-gated content changes. The product review shows current and proposed wording for seven directly linked homepage sections, but the live site keeps its existing text until the user selects a direction. Proof examples must separate the problem, work performed, available evidence, and current evidence availability; they must not invent business outcomes. The example links to the corresponding Content Creator portfolio section for inspection.

The eleven hidden modal defaults now use neutral guidance instead of placeholder text. Real resource metadata and the existing documentation URL still replace the fallback when a card opens; Speaker Topics retains its booking action. This cleanup does not remove or replace Google, Layer3, booking, testimonial, or portfolio destinations.

## Edges

- supports [[tsk-conversion-ux-reversible-pass]] - keeps judgment-heavy positioning and evidence claims behind explicit review.
