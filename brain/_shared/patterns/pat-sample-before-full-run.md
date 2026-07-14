---
id: pat-sample-before-full-run
type: pattern
summary: Always inspect samples and validate output before executing full-scale pipeline runs; include row counts and run reports in all outputs.
tags: [qa, validation, automation, data-quality, discipline]
domain: operations/data-pipeline
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
confidence: 0.9
support_count: 1
verified_at: 2026-06-30
part_of: ["[[pil-mxney]]"]
shared: true
---

When running any pipeline script or bulk operation, start with a sample (e.g., 100 rows or a single batch). Inspect the output manually, verify schema correctness, and confirm row counts match expectations before running the operation at full scale.

Every output artifact must include:
- Row count at each pipeline stage
- Run report with timestamps, input/output counts, errors, and warnings
- Human review checkpoint before promotion to production

This pattern catches bugs early, prevents wasted compute on broken logic, and creates an audit trail. It scales to arbitrarily large datasets without extra overhead.

Instances: CVR data ingestion, search enrichment batches, schema validation runs.
