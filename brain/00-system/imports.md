# Importing external knowledge bases (Google Drive, Notion)

Bring large exports into the two-tier Infinite Brain **without breaking links**, using the
EXISTING machinery (no schema changes). Bulk → Tier-2 (LightRAG); high-value → curated Tier-1 nodes.

## Pipeline (per export)
1. **Stage** the raw export under `05-sources/raw/<import-name>/` (immutable) and copy the docs to
   `lightrag/inputs/<import-name>/` for Tier-2.
2. **Inventory + build the link map FIRST.** Walk the export; map every external id → vault target,
   save as `05-sources/raw/<import-name>/_link-map.json`:
   - Notion: page file `Title <32hex>.md` / `notion.so/...-<32hex>` → `src-<slug>` (or curated node id).
   - GDrive: `docs.google.com/(document|spreadsheets|presentation)/d/<id>` → `src-<slug>` (or node id).
   Deterministic slugs from titles.
3. **Convert format → clean markdown** (docx/html/notion-md → md; strip export cruft, fix headings).
4. **Rewrite links** using the map, in one pass:
   - Internal (target was imported) → `[[<vault-id>]]`.
   - External/unmapped URL → a `reference` node (or inline ref). **Never leave a dead notion/gdoc URL.**
   - Assets (images/files) → `06-attachments/<import-name>/`, rewrite paths (or push to Tier-2).
5. **Bulk-ingest to Tier-2:** each doc → `/ingest` → a `source` node with
   `source_ref: lightrag://<workspace>/<doc_id>`. Everything becomes recallable via `/recall`.
6. **Triage → curate:** pick high-value docs (decisions, strategy, ICP, playbooks, SOPs) and
   `/convert-note` them into typed atomic nodes, `derived_from` their `source`.

## URL-rewriting specifics
- **Notion (Markdown+CSV export):** internal links are URL-encoded relative paths
  `Some%20Page%20<32hex>.md` and/or `notion.so/<ws>/<Page>-<32hex>`. Key off the 32-hex page id.
  Databases export as CSV + a page folder; rows → `source`/typed nodes, relation columns → edges.
- **Google Drive (Takeout/download):** Docs → .docx/.html; internal refs are `docs.google.com/.../d/<id>`.
  Key off `<id>`. Sheets → .xlsx/.csv (data → `fact`/`source`); Slides → .pptx.
- Always build the FULL map before rewriting so cross-references resolve in a single pass.

## Reused vs new
- **Reused:** two-tier model, `source` nodes + `source_ref` bridge, `/ingest`, `/convert-note`, `/recall`.
- **New:** `/import` skill (orchestration), per-import `_link-map.json`, `06-attachments/`.
- **No schema changes** — content maps onto existing node types; cross-links onto edges/`reference` nodes.
