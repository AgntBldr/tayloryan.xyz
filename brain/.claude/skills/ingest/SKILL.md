---
name: ingest
description: Ingest a raw document into the LightRAG Tier-2 bulk store and create a linked `source` node in the vault. Use when adding a large document/transcript/dataset you want recallable but won't fully hand-curate.
---
# ingest

Bridge raw material into Tier-2 (LightRAG) and register it in Tier-1.

## Prereqs
LightRAG server running (see `lightrag/README.md`), reachable at `LIGHTRAG_URL`
(default http://localhost:9621). Each business vault uses its own LightRAG **workspace
namespace** so bulk recall stays isolated. Verify endpoints against the LightRAG server API.

## Steps
1. Send the document to LightRAG: `POST {LIGHTRAG_URL}/documents/text` (or `/documents/file`),
   scoped to this vault's workspace namespace. Capture the returned document/track id.
2. Create a `source` node in `05-sources/` (per `00-system/schema.md`): summary, source_type,
   url, and `source_ref: lightrag://<doc_id>` — the Tier1↔Tier2 bridge.
3. If the document warrants curated knowledge, run `convert-note` to extract `fact`/`concept`/…
   nodes `derived_from` this source.
4. Move the raw file to `05-sources/raw/processed/`. Append an `ingest` entry to `log.md`.

## Rules
- Tier-2 holds the bulk text; Tier-1 holds the curated spine + the `source_ref` index into it.
- Never paste large raw text into a vault node body — that's what Tier-2 is for.
