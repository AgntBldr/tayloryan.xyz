---
id: evt-resource-preservation-manifest-2026-07-13
type: event
summary: A preservation-first manifest paired Google resource URLs with local Ref Docs inventory before any link removal.
tags: [audit, google-drive, preservation, offline-archive]
domain: project-management
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
occurred_at: 2026-07-13
participants: [codex]
part_of: ["[[pil-portfolio-agent]]"]
derived_from: ["[[evt-google-links-review-2026-07-13]]"]
supports: ["[[dec-use-resource-preservation-manifest-before-google-link-removal]]", "[[fct-site-audit-2026-07-13]]"]
---

# Resource Preservation Manifest

Generated `execution/resource_preservation_manifest.mjs` and the outputs:

- `audits/site-audit/resource-preservation-manifest.html`
- `audits/site-audit/resource-preservation-manifest.csv`
- `audits/site-audit/resource-preservation-manifest.json`

The manifest keeps the 622 Google resource URLs from the Google review visible while pairing them against 456 local files under `Ref Docs`. It separates likely offline artifact matches from source/index-only files, because a workbook, CSV, or text source that contains a link is not automatically the same thing as the linked artifact content.

Final preservation buckets: 25 public-working links, 517 private/auth-required links, 80 broken links, 89 likely matched offline artifacts, 10 possible offline artifacts, 152 source/index-only rows, and 371 rows with no likely offline artifact.

## Edges

- derived_from [[evt-google-links-review-2026-07-13]] - extends the Google working-vs-not-working report into an offline preservation review surface.
- supports [[dec-use-resource-preservation-manifest-before-google-link-removal]] - gives an approval artifact before public link deletion or replacement.
- supports [[fct-site-audit-2026-07-13]] - refines the Google remediation bucket from the site audit.
