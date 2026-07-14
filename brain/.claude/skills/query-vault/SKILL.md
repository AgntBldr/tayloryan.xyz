---
name: query-vault
description: Answer a question from the V3 Second Brain using routing-first retrieval — read node frontmatter (summary/edges) before bodies to minimize tokens. Use when asked anything the vault might know.
---
# query-vault

Routing-first retrieval over the Tier-1 graph. Goal: answer with the fewest tokens by reading
the routing layer before any bodies. Follows `00-system/AGENTS.md` §2.

## Steps
1. **Locate entry nodes.** Infer the domain(s) and likely node types from the question.
   Use `00-system/index.md` Dataview views or search frontmatter `summary`/`tags`/`domain`.
   Do NOT open bodies yet.
2. **Route.** For each candidate, read ONLY its frontmatter: `summary`, `tags`, and edge
   fields. Build a shortlist of nodes worth opening.
3. **Traverse edges** for context: `derived_from` for provenance, `supports`/`contradicts`
   for evidence, `depends_on`/`part_of` for structure. Read neighbours' frontmatter the same
   way; open a body only when its summary says it's needed.
4. **Open bodies** for the final shortlist only.
5. **Tier-2 fallback (Phase 4):** if the curated spine is thin, call `recall` over LightRAG
   scoped by relevant `source` nodes' `source_ref`.
6. **Answer** with citations to node ids. Surface `contradicts` tensions and flag
   low-`confidence` or stale claims.
7. Append `## [YYYY-MM-DD] query | <question>` to `00-system/log.md`.

## Rules
- Respect `status: archived` (historical context only).
- Prefer high-`confidence`, recently-`verified_at` claims.
