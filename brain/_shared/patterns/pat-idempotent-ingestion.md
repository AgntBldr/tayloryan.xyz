---
id: pat-idempotent-ingestion
type: pattern
summary: Scripts refuse to overwrite data without explicit force flag.
tags: [data-ingestion, safety]
domain: pil-v2-startup-applications-data-ingestion
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
part_of: ["[[pil-v2-startup-applications]]"]
shared: true
---

Ingestion scripts like `ingest_profile.py` are designed to be idempotent. They refuse to overwrite existing files unless a `--force` flag is provided. This prevents accidental data loss during script re-runs. The `refresh-profile` command defaults to dry-run mode to show diffs before applying changes.
