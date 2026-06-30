# Sources

External material as `source` (`src-`) nodes - docs, transcripts, datasets you want recallable. Each
indexes into the LightRAG Tier-2 bulk store via `source_ref: lightrag://<workspace>/<doc_id>` (`/ingest`).
Curated typed nodes are `derived_from` their source; `reference` (`ref-`) nodes hold lighter pointers.
