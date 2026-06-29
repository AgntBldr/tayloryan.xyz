---
name: recall
description: Query the LightRAG Tier-2 bulk store for passages the curated Tier-1 spine doesn't cover. Use as a fallback within query-vault when the typed graph is thin on a topic.
---
# recall

Tier-2 fallback retrieval over LightRAG.

## Prereqs
LightRAG server running (see `lightrag/README.md`), scoped to this vault's workspace namespace.

## Steps
1. Try Tier-1 first (`query-vault`). Only call Tier-2 when the curated spine is thin.
2. Query LightRAG: `POST {LIGHTRAG_URL}/query` with `{ query, mode }`, where mode is
   `mix` (default), `local`, `global`, or `hybrid`.
3. Optionally scope by the `source_ref`s of relevant Tier-1 `source` nodes.
4. Return passages with their source. If a passage proves durable/important, promote it into a
   curated Tier-1 node via `convert-note` (so next time it's in the spine).
5. Append a `recall` entry to `log.md`.

## Rules
- Tier-2 answers are probabilistic — cite sources, and prefer Tier-1 facts when they conflict.
