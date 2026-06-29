# Agent Protocol — V3 Second Brain

> Read this first. This is the canonical operating protocol for the vault, obeyed by **both
> Claude Code and Codex**. Skills/slash commands are a thin ergonomic layer; the rules live
> here so behaviour is identical across agents.
> Companion specs: [`schema.md`](schema.md) (node anatomy), [`edge-cases.md`](edge-cases.md) (classification).

## 1. What this is
A two-tier "Infinite Brain":
- **Tier 1 (this vault, markdown):** a curated, typed knowledge graph you reason over.
- **Tier 2 (LightRAG, Phase 4):** bulk fuzzy recall. A `source` node bridges via `source_ref: lightrag://<doc_id>`.

The structure exists for a **routing layer**: every node's frontmatter carries `summary` +
`tags` + edges, so you can decide what to open *before* spending tokens on bodies.

## 2. Reading the brain (retrieval) — ALWAYS route before reading
1. Read the target node's **frontmatter only** (summary, tags, edge fields).
2. Decide which edges to follow; read neighbours' frontmatter the same way.
3. Open a node **body** only when its summary says it's worth it.
4. Prefer the curated spine; drop to Tier-2 (`recall`) only when the spine is thin.
Use [`index.md`](index.md) (Dataview) for type / recency / orphan / stale overviews.

## 3. Writing the brain (node creation)
- **Atomic:** one idea per node, ~50–300 words. Past that, split into part 1/2/3.
- **Type:** pick from the 17 in `schema.md`. When torn, apply `edge-cases.md`.
- **id:** type-prefixed slug (`dec-`, `hyp-`, `src-`, …). Stable — don't rename.
- **Frontmatter:** shared base + that type's fields. Trust metadata (`confidence`,
  `verified_at/by`, `staleness`) on **claim-types only** (fact / hypothesis / pattern / decision).
- **Placement:** domain-first folder; `domain:` mirrors the path.

## 4. Edges (typed links)
- Encoded as **flat, per-relation frontmatter fields** with wikilink-list values:
  ```yaml
  supports:     ["[[pil-sustainable-margins]]"]
  derived_from: ["[[src-stripe-pricing-analysis]]"]
  contradicts:  ["[[hyp-free-tier-virality]]"]
  ```
  (Read by Breadcrumbs, Dataview, and the native graph at once.)
- The 10 edge types: `supports, contradicts, depends_on, derived_from, related_to,
  part_of, preceded_by, followed_by, authored_by, tagged_with`.
- **Direction:** write the edge on ONE node (current → target); Breadcrumbs infers the inverse.
- **Reasons** go in a `## Edges` body section when they matter, e.g.
  `- supports [[pil-sustainable-margins]] — protects unit economics`.
- `related_to` is the last resort — upgrade to a named edge whenever you can.

## 5. Business scoping
Each business is a `pillar` (`pil-<business>`). Scope any node to a business with
`tagged_with: ["[[pil-<business>]]"]`. Knowledge is shared; the tag filters to one business.
Projects are also `part_of` their business pillar.

## 6. Lifecycle (spawn, don't mutate — preserve history)
- Hypothesis confirmed → new `fact`/`pattern` `derived_from` it; hypothesis `status: resolved`.
- Question answered → new `decision`/`fact`/`hypothesis` `derived_from` it; question `status: resolved`.
- `note` graduates → create the proper typed node; archive the note.
- Decision superseded → new decision `contradicts` old; old `status: archived`.
- Never silently delete; archive and keep history. Full table in `edge-cases.md` §C.

## 7. Logging
Append one entry per operation to [`log.md`](log.md): `## [YYYY-MM-DD] <op> | <title>` + a short note.

## 8. Operations (skills) — Phase 2+
In Claude Code these are slash commands; in Codex, follow the same described procedure.
- `convert-note` — decompose raw material in `05-sources/raw/` into typed atomic nodes.
- `query-vault` — routing-first retrieval (§2).
- `organize-vault` — graduate notes, upgrade `related_to`, find orphans / contradictions / stale.
- `vault-health` — confidence decay + staleness sweep (claim-types only).
- `ingest` / `recall` — Tier-2 bridge (Phase 4).
- `start-project` / `close-project` — project lifecycle: playbook → project → tasks → learnings.
- `new-brain` — clone a fresh isolated vault from the template.
- `skillify` — compile a mature playbook into a new skill (brain→skill loop).

Full capability list: `00-system/skills-index.md`. Each operation's full procedure lives in
`.claude/skills/<name>/SKILL.md` — any agent (Claude Code or Codex) reads that file to run the
operation; it is the agent-agnostic spec.

## 9. Folder map
`00-system` protocol/specs · `01-pillars` goals + businesses · `02-projects` efforts ·
`03-knowledge/<domain>` facts/concepts/decisions/etc · `04-playbooks` SOPs ·
`05-sources` sources/bookmarks/refs (+ `raw/`) · `06-people` contacts · `99-inbox` unclassified notes.

## 10. Multi-vault & shared core
This vault is ONE business/project in a hybrid topology. Each business is its own isolated
vault (cloned from `secondbrain-template`), so other businesses never bleed in.
- **Isolation:** everything here belongs to this business. Never reference another business's vault.
- **Shared core:** universal `playbook`/`principle`/`concept` nodes live in a separate
  `shared-core/`, mountable at `_shared/` (the bootstrap copies or symlinks it). When `_shared/`
  is present, consult it for reusable nodes and you may link to them
  (e.g. a project `derived_from: ["[[pbk-launch-landing-page]]"]`). Sharing is opt-in — a node
  is shared only if it lives in `shared-core/`.
- **New business:** run the `new-brain` skill / `new-brain.ps1` to stamp a fresh isolated vault
  from the template and mount the shared core.
