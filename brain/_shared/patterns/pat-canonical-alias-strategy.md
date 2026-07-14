---
id: pat-canonical-alias-strategy
type: pattern
summary: Use canonical/alias field pairs to consolidate duplicates without breaking references; semantic duplicates stay separate pending review.
tags: [data-quality, schema, design-pattern, normalization]
domain: data-quality
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
confidence: 0.88
verified_at: 2026-05-21
support_count: 3
part_of: ["[[pil-mxney]]"]
shared: true
---

## Current Aliasing Decisions

1. **`website_found_providers`** -> `website_found_provider`
   - Consolidate plural variant to singular canonical

2. **`regnskabsdata_latest_period_start`** -> `financial_report_period_start`
   - Danish-specific name -> language-neutral canonical
   - Both remain in the schema; exports prefer canonical

3. **`regnskabsdata_latest_period_end`** -> `financial_report_period_end`
   - Same rationale as period start

## Semantic Duplicates (Deferred)

Ecommerce category fields (corrected_B2C_Ecommerce, corrected_Tangible_Product, etc.) are marked for review because:
- Values may differ (e.g., one field says B2C, another says B2B)
- Meaning is distinct even if values appear identical
- Cannot safely alias without understanding the taxonomy

## Pattern: Non-Destructive Aliasing

Aliasing adds a metadata layer (canonical/alias semantics) without renaming or deleting source fields. Dashboards and exports can reference the canonical name; data integrity tools can still access the original field for validation or historical analysis.

## Next Step

Document the ecommerce category taxonomy before deciding on canonicalization order or removal.
