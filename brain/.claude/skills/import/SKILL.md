---
name: import
description: Import a downloaded Google Drive or Notion export into the framework — convert to markdown, rewrite internal/asset URLs to vault links, bulk-load into LightRAG Tier-2 with source nodes, and curate high-value pages into typed nodes. Use when ingesting an external knowledge base.
---
# import

Bring an external export (Google Drive / Notion) into the two-tier brain. Full procedure:
[`00-system/imports.md`](../../../00-system/imports.md). Follows AGENTS.md + schema.md.

## Steps
1. Stage the raw export in `05-sources/raw/<import>/` (immutable) + copy docs to `lightrag/inputs/<import>/`.
2. Build the ID→node `_link-map.json` FIRST (Notion 32-hex page ids / Google doc ids → `src-<slug>`/node ids).
3. Convert each doc to clean markdown (docx/html/notion-md).
4. Rewrite links via the map: imported → `[[id]]`; external/unmapped → `reference` node or inline ref;
   assets → `06-attachments/<import>/` with rewritten paths. Leave NO dead notion/gdoc URLs.
5. `/ingest` every doc into LightRAG Tier-2 → a `source` node each (`source_ref: lightrag://<workspace>/<doc_id>`).
6. Triage high-value docs → `/convert-note` into typed atomic nodes (`derived_from` their source).

## Rules
- Build the full link map BEFORE rewriting (so cross-references resolve in one pass).
- Bulk → Tier-2; hand-curate only what you'll reason over. Don't atomize everything.
- Keep originals; never edit the raw export in place.
