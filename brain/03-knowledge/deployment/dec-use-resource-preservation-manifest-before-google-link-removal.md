---
id: dec-use-resource-preservation-manifest-before-google-link-removal
type: decision
summary: Use the resource preservation manifest as the approval gate before removing or replacing Google resource links.
tags: [audit, google-drive, preservation, cleanup]
domain: deployment
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
confidence: 0.95
verified_at: 2026-07-13
verified_by: codex generated manifest and user requirement
decided_on: 2026-07-13
decided_by: codex
alternatives: [remove all inaccessible links, leave all inaccessible links unchanged, replace only broken links without offline mapping]
part_of: ["[[pil-portfolio-agent]]"]
derived_from: ["[[evt-google-links-review-2026-07-13]]"]
supports: ["[[fct-site-audit-2026-07-13]]"]
---

# Use Resource Preservation Manifest Before Google Link Removal

Before changing public Google resource links, use `audits/site-audit/resource-preservation-manifest.html` as the review gate. The manifest preserves each Google URL, public status, source file, local source/index path, likely offline artifact candidate, and recommended next action.

This prevents accidental loss of documentation. A `matched_artifact` row may be suitable for replacement or re-sharing after manual approval. A `source_index_only` row means the local project has preserved metadata or a source list, but not necessarily the linked artifact content. A `missing_artifact` row should remain in the manifest until the user decides whether to hide the public link, recreate the resource, or accept the loss.

## Edges

- derived_from [[evt-google-links-review-2026-07-13]] - the Google link checker established which resources are public-working, private, or broken.
- supports [[fct-site-audit-2026-07-13]] - keeps cleanup tied to the audited Google remediation bucket.
