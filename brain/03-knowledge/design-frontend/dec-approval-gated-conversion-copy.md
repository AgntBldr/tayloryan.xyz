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

Treat homepage positioning and richer case-study proof as approval-gated content changes. The product review may show concrete examples, but the live site keeps its existing homepage headline until the user selects a direction. Proof examples must separate the problem, work performed, available evidence, and current evidence availability; they must not invent business outcomes.

The hidden modal defaults `Resource Title` and `Description goes here` are implementation fallbacks, not currently visible public copy. They appear in eleven clean routes and are replaced with real resource metadata when a card opens. Keep the modals and verify other resource families before deciding whether any fallback text should change.

## Edges

- supports [[tsk-conversion-ux-reversible-pass]] - keeps judgment-heavy positioning and evidence claims behind explicit review.
