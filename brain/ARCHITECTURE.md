# V3 Second Brain — Architecture Plan

> Status: **Phases 1–2 built**; restructuring into a cloneable hybrid multi-vault template (this vault = business #1). See §11.
> Last updated: 2026-06-19

A two-tier "Infinite Brain": a deliberately curated, typed knowledge graph in plain
markdown (Tier 1) over a scalable fuzzy-recall store via LightRAG (Tier 2). Built to be
read and written by AI agents (Claude Code + Codex), and to double as the operating
scaffold for starting and running projects.

---

## 1. Core idea (what we're actually building)

The one real innovation over a normal Obsidian vault is a **per-note routing layer**:
each atomic note carries a `summary` + `tags` + typed `edges` in frontmatter, so an agent
can triage *what to read before spending tokens reading it* (~50 tokens to decide vs
opening a 9,000-token document). Everything else serves that: atomic notes, a type system
that makes meaning explicit, and typed edges that say *why* two notes connect.

## 2. Two-tier memory (the LightRAG decision)

| | Tier 1 — Curated spine (markdown) | Tier 2 — Bulk library (LightRAG) |
|---|---|---|
| Built by | You + AI, deliberately, one node at a time | LLM auto-extraction at ingest (fast, lossy) |
| Holds | Decisions, strategy, playbooks, facts you reason over | Raw docs/transcripts/clippings you won't hand-curate |
| Edges | Typed & intentful (`supports`, `contradicts`) | Auto-extracted entity relations (generic) |
| Retrieval | Deterministic graph walk via explicit edges | Embedding + graph similarity (local/global/hybrid) |
| Scale | Hundreds–low thousands of curated nodes | Tens of thousands+ of raw docs |
| Owned/inspectable | Plain files, git, Obsidian graph | DB + embeddings behind a running service |

**They are complementary, not competing.** Tier 1 is the precise, owned reasoning layer
and the *index/provenance* into Tier 2. Tier 2 is scalable recall. The bridge is the
`source` node: it carries `source_ref` pointing at the LightRAG doc. The "extra" beyond
plain LightRAG is exactly this deterministic typed-graph index sitting on top of
probabilistic recall. Neo4j is **not** needed now — markdown stays source of truth; we'd
mirror into Neo4j only if we ever need Cypher analytics (paths/centrality) at scale.

## 3. Taxonomy (LOCKED)

### Node types (17)
`pillar, decision, concept, question, playbook, task, event, pattern, hypothesis, fact,
source, bookmark, note, contact, reference, custom, project`

`project` is first-class: a bounded effort that is `part_of` a **pillar**, often
`derived_from` a **playbook**, and contains `task`/`decision`/`event` nodes.

### Edge types (10) — write from current note → target; store one direction, infer inverse
`supports, contradicts, depends_on, derived_from, related_to, part_of, preceded_by,
followed_by, authored_by, tagged_with`

### Decided conventions
- **Lifecycle:** confirming a hypothesis / answering a question **spawns a new node**
  `derived_from` the original — never mutate in place. History of belief is preserved.
- **Tags model:** keep both — `tags` (flat keywords) **and** `tagged_with` (edge to a concept node).
- **Edge direction:** store once, let tooling (Breadcrumbs) infer the inverse.
- **Edge encoding:** flat per-relation frontmatter fields with wikilink values (e.g. `supports: ["[[id]]"]`) — read natively by Breadcrumbs, Dataview, and the graph. Reasons live in a `## Edges` body section.

> Full per-type field profiles → [`00-system/schema.md`](00-system/schema.md).
> Classification + edge-selection + lifecycle rulings → [`00-system/edge-cases.md`](00-system/edge-cases.md).

### Unified frontmatter (routing table + trust metadata)
```yaml
---
id: dec-no-free-tier          # stable, type-prefixed slug
type: decision
summary: We will not offer a free pricing tier; trial-only.
tags: [pricing, gtm]
domain: business/pricing
status: active                # active|draft|resolved|archived
confidence: 0.8               # claim-types only
created: 2026-04-05
updated: 2026-06-19
verified_at: 2026-06-01
verified_by: human+claude
staleness: "Revisit if a competitor launches a free tier"
visibility: namespace         # public|namespace|private|system
source_ref: null              # `source` nodes: lightrag://<doc_id> (Tier1↔Tier2 bridge)
# Edges = flat per-relation fields (Breadcrumbs / Dataview / graph-native); reasons go in the body.
supports:     ["[[pil-sustainable-margins]]"]
contradicts:  ["[[hyp-free-tier-virality]]"]
derived_from: ["[[src-stripe-pricing-analysis]]"]
tagged_with:  ["[[pil-acme]]"]   # business scope
---
```

## 4. Folder structure (domain-first, type-in-frontmatter)

```
Obsidian-V3-2ndBrain/
  00-system/          AGENTS.md (portable protocol), CLAUDE.md, schema.md, edge-cases.md, index.md, log.md
  01-pillars/         standing goals & principles
  02-projects/<name>/ execution scaffold: tasks, decisions, events per project
  03-knowledge/<domain>/   concept, fact, pattern, hypothesis, decision, question
                           e.g. research/{law,medicine,biology}, business/pricing
  04-playbooks/       reusable SOPs
  05-sources/         source, bookmark, reference   (+ raw/ , raw/processed/)
  06-people/          contact
  99-inbox/           unclassified note → graduates out via organize-vault
lightrag/             Tier 2 service + data (outside the vault)
```
Type is a frontmatter field (queried via Dataview/Bases); domain lives in the path.

## 5. LightRAG bridge (Tier 1 ↔ Tier 2)

- **Ingest:** raw doc → (a) full text into LightRAG → returns `doc_id`; (b) agent reads it,
  creates curated atomic nodes; the `source` node stores `source_ref: lightrag://<doc_id>`.
- **Query:** agent reads Tier 1 routing layer first (cheap, deterministic) → finds relevant
  curated nodes → if it needs depth, calls LightRAG (local/global/hybrid) over Tier 2,
  scoped by the `source_ref`s of those nodes.
- **Runtime:** `lightrag-server` (or SDK), reached from Claude Code via an MCP tool or CLI
  skill. Needs an extraction LLM + embeddings (e.g. bge-m3). API vs local is a Phase-4 decision.

## 6. Project execution scaffold

`pillar` → `playbook` → instantiate a `project` (`part_of` pillar, `derived_from` playbook)
→ generate ordered `task` nodes → `event`/`decision` capture during work → on completion,
extract `pattern`/`playbook` updates. Lets an agent *start and run* work, not just remember.

## 7. Portable agent protocol (Claude Code + Codex)

- `00-system/AGENTS.md` = canonical protocol both agents obey. Codex reads it natively;
  `CLAUDE.md` points Claude Code to it.
- Claude Code **skills** are the ergonomic layer; all *logic* lives in the markdown protocol
  so behavior is identical when Codex follows the documented workflow.
- A skill is executable *capability*; a `playbook` is *knowledge* a skill acts on. Mature
  playbooks can be compiled into skills (`/skillify`) — the brain→skill generation loop.

## 8. Obsidian plugins

- **Breadcrumbs** — typed frontmatter edges → real typed graph + inverse inference (key one).
- **Dataview** / **Bases** — render `index.md`, type views, orphan/stale reports.
- **Templater** — one node-creation template per type.
- Skip **Smart Connections** (in-vault embeddings) — overlaps with LightRAG.

## 9. Build roadmap (phased)

Each phase is independently shippable. Critical path to a usable system: **0 → 1 → 2**.
`3` and `4` both hang off `2` and can run in either order. `5` is the capstone.

- **Phase 0 — Lock the spec.** `schema.md`, `edge-cases.md`, this roadmap. *Done when: rulings/fields reviewed.* ← DONE (pending your markup)
- **Phase 1 — Vault skeleton + protocol.** Domain-first folders, `AGENTS.md` + `CLAUDE.md`, Templater templates (one per type), `index.md` + `log.md`, plugins (Breadcrumbs/Dataview/Templater), 5–6 seed nodes. *Done when: a template-created node shows in the Breadcrumbs typed graph.*
- **Phase 2 — Core skills (first usable brain).** `/convert-note`, `/query-vault` (routing-first), `/organize-vault`, `/vault-health`, `/init-vault`. Tier-1 only. *Done when: drop a doc → `/convert-note` → `/query-vault` answers cheaply.*
- **Phase 3 — Project scaffold.** `/start-project` (project from playbook → ordered tasks), task state flow, archival → pattern/playbook write-back. *Done when: a playbook spins up a project + linked tasks; finishing writes learnings back.*
- **Phase 4 — LightRAG Tier 2.** Stand up `lightrag-server`, choose extraction LLM + embeddings, `/ingest` (raw → LightRAG + `source` node), `/recall` bridge, two-tier query wiring. *Done when: large corpus ingested; `/query-vault` pulls Tier-2 depth when the spine is thin.*
- **Phase 5 — Portability + capability loop + polish.** Codex pass on `AGENTS.md`, `/skillify`, capability registry, scheduled `/vault-health`, graph styling. *Done when: same workflow runs in Codex + a skill is generated from a playbook.*

## 10. Open decisions

- Domain list under `03-knowledge/` (need your actual domains).
- LightRAG Phase 4: extraction LLM + embedding model, API vs local, where the service runs.
- `visibility` semantics: what `namespace` vs `private` vs `system` gate.

## 11. Multi-vault topology (hybrid)

Separates a reusable **engine** from per-business **content**:
- **`secondbrain-template/`** — the engine (00-system protocol, schema, edge-cases, `_templates`,
  `.claude/skills`, folder skeleton). Content-free. Clone per business / large project.
- **Per-business vaults** — e.g. this `Obsidian-V3-2ndBrain/` (business #1). Each is its own
  isolated graph + Claude Code project + (optional) git repo. No cross-business bleed.
- **`shared-core/`** — opt-in universal knowledge (playbooks, principles, reusable concepts)
  any vault can mount at `_shared/`. Default isolation; deliberate sharing.
- **`new-brain.ps1` / `/new-brain`** — bootstrap that clones the template to a new path, sets
  the business identity, resets history, and mounts the shared core.

```
V3-2ndBrain/
  secondbrain-template/   engine (clone source, content-free)
  shared-core/            opt-in shared knowledge (mounted as _shared/)
  Obsidian-V3-2ndBrain/   business #1 (this vault)
  <future-business>/      clone per business
  new-brain.ps1           bootstrap
```
