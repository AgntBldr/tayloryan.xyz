---
id: pat-deterministic-first-paid-fallback
type: pattern
summary: Multi-pathway enrichment: free local logic first, paid APIs only for unresolved rows, browser automation for targeted validation.
tags: [architecture, cost-control, pathway, sequencing]
domain: strategy/enrichment
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
confidence: 0.8
verified_at: 2026-05-18
part_of: ["[[pil-mxney]]"]
shared: true
---

The enrichment pipeline uses a cost-escalating architecture with clear stage gates:

**Pathway A (Deterministic Base)**
- Email-domain extraction, company-name domain generation, DNS checks, HTTP liveness, bounded crawl, rule-based ecommerce scoring.
- Pros: cheapest, testable, clear failure counts.
- Cons: misses non-obvious domains, needs false-positive QA.
- Recommendation: make this the default; MVP on 500 rows found meaningful signals without paid APIs.

**Pathway B (Paid SERP Fallback)**
- Search-only after deterministic inference leaves a row unresolved.
- Candidates: DataForSEO (pay-as-you-go SERP, broad coverage), HasData (Google SERP, simple auth), Scrapingdog (credit-based, parameter variance), ZenRows (SERP + crawler fallback).
- Recommendation: bake-off DataForSEO, HasData, Scrapingdog first; evaluate on cost-per-correct-homepage, not request price alone.

**Pathway C (Browser Automation)**
- Playwright only for known websites where raw HTTP/HTML insufficient (JS-heavy ecommerce, cart verification).
- Not for bulk search; too fragile and slow.

**Pathway D (AI Review)**
- Structured agents for ambiguity classification, identity mismatch review, rule improvement, QA samples.
- Use OpenAI Structured Outputs for typed classification; Batch API for bulk review.

This pattern avoids expensive row-by-row processing by reserving APIs and agents for high-value, high-uncertainty cases.
