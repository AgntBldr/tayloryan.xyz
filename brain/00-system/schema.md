# Node Schema - V3 Second Brain

> Canonical spec for the 17 typed nodes. Agents (Claude Code + Codex) read this to create
> and validate nodes. Edit the field profiles freely - this file is the source of truth.
> **This file = what each node *is*. Its companion [`edge-cases.md`](edge-cases.md) = how to tell two apart when you're torn.**
> Status: canonical. Last updated: 2026-06-29

## What each type is

> Plain-English definitions, grouped by the 5 categories. The category line says what the
> whole group is *for*; see **Per-type anatomy** below for the fields each type carries.

**Strategic / structural** - *the scaffolding of intent: what you pursue, decide, and how you operate.*
- **pillar** - a standing goal/principle/area you perpetually uphold (no end state)
- **project** - a bounded effort with an outcome and an end state
- **decision** - a specific choice made at a point in time, with rationale + alternatives
- **playbook** - a reusable, ordered procedure for a recurring situation

**Knowledge / analytical** - *what you know and how sure you are (these carry trust metadata).*
- **concept** - the neutral definition/meaning of a thing
- **question** - an open unknown you want resolved
- **hypothesis** - a belief you hold but haven't confirmed (testable)
- **pattern** - a regularity observed across many instances
- **fact** - a single, checkable, atomic claim or value

**Operational / temporal** - *things that happen or need doing, anchored in time.*
- **task** - a future action with a done-criterion
- **event** - something that occurred at a specific time (append-only)

**Inputs / provenance** - *where knowledge comes from.*
- **source** - material you ingested + extracted from (also lives in Tier-2)
- **bookmark** - saved-for-later, not yet ingested
- **reference** - an authoritative standard you cite but didn't extract
- **contact** - a person

**Utility** - *holding pens until something earns a real type.*
- **note** - freeform, temporary capture; graduate it as soon as it can be sharpened
- **custom** - a recurring shape that doesn't fit the 16 yet; promote when frequent

## Shared base (every node)

```yaml
id: <prefix>-<slug>      # stable, type-prefixed (see prefixes below)
type: <one of 17>
summary: <= 1 sentence   # the routing layer - read this before opening the body
tags: [flat, keywords]   # search/filter
domain: area/subarea     # mirrors folder path under 03-knowledge/
status: active           # active|draft|resolved|archived (type-dependent values)
created: YYYY-MM-DD
updated: YYYY-MM-DD
visibility: namespace    # public|namespace|private|system
# Edges = flat, per-relation frontmatter fields; values are wikilink lists. Store one direction.
supports:     ["[[id]]"]   # use any of the 10 edge types; omit unused ones
derived_from: ["[[id]]"]
# Per-edge reasons (optional) go in a `## Edges` body section, not in frontmatter.
```

## Two rules that shape the schema

1. **Trust metadata** (`confidence` 0.0-1.0, `verified_at`, `verified_by`, `staleness`)
   applies **only to claim-types**: `fact, hypothesis, pattern, decision`.
   Definitional/structural/input types do not carry confidence.
2. **ID prefixes** keep edges human-readable, so an agent can route on an edge target
   (`derived_from: src-stripe-fees`) without opening the file.

## Per-type anatomy

### Strategic / structural
| Type | id | Type-specific fields | Body shape | Typical edges |
|---|---|---|---|---|
| pillar | `pil-` | - | goal/principle, success criteria, why it matters | <- `part_of` (projects), `related_to` pillars |
| project | `prj-` | `owner, start, target, outcome`; status: planning/active/blocked/done/archived | scope, current state | `part_of` pillar, `derived_from` playbook |
| decision | `dec-` | `decided_on, decided_by, alternatives[]`; status: active/superseded | the choice, rationale, tradeoffs | `derived_from` question/source, `contradicts` |
| playbook | `pbk-` | `steps[], inputs, outputs, when_to_use` | ordered procedure | steps `preceded_by`; <- `derived_from` (projects) |

### Knowledge / analytical  (claim-types carry trust metadata)
| Type | id | Type-specific fields | Body shape | Typical edges |
|---|---|---|---|---|
| concept | `con-` | `aliases` | definition, how we use it, examples | `related_to`, `part_of` broader concept |
| question | `qst-` | `resolved_by`; status: open/resolved | the question, what would resolve it | <- `derived_from` (its answer node) |
| hypothesis | `hyp-` | **`confidence`**, `test`; status: proposed/testing/confirmed/refuted | the belief, rationale, how to test | `supports`/`contradicts`; spawns fact/pattern |
| pattern | `pat-` | **`confidence`**, `support_count`, `verified_at` | the regularity + instances | `derived_from` events/facts, `supports` hyp |
| fact | `fct-` | **`confidence`**, `verified_at`, `verified_by` | the atomic claim / value | `derived_from` source, `supports`/`contradicts` |

### Operational / temporal
| Type | id | Type-specific fields | Body shape | Typical edges |
|---|---|---|---|---|
| task | `tsk-` | `assignee, due, effort`; status: todo/doing/done/blocked | the action + done-criteria | `part_of` project, `depends_on`/`preceded_by` |
| event | `evt-` | **`occurred_at`** (required), `participants` | what happened, observations | `part_of` project, `related_to` (append-only) |

### Inputs / provenance
| Type | id | Type-specific fields | Body shape | Typical edges |
|---|---|---|---|---|
| source | `src-` | **`source_ref: lightrag://<doc_id>`** (required), `source_type, url, ingested_at` | takeaways -> pointers to extracted facts | `authored_by` contact; <- `derived_from` (facts) |
| bookmark | `bkm-` | **`url`** (required), `saved_at`; status: unread/processed | why saved, what to extract | -> `source` once ingested, `related_to` |
| reference | `ref-` | `citation, locator, authority` | what it's authoritative for | `related_to`, `tagged_with` |
| contact | `cnt-` | `role, org, channels, last_contact` | context, relationship | <- `authored_by` (sources) |

### Utility
| Type | id | Type-specific fields | Body shape | Typical edges |
|---|---|---|---|---|
| note | `not-` | status: `raw` (flag to graduate) | freeform - *temporary* | minimal; should not accrue trust meta |
| custom | `cst-` | **`custom_type`** (the real name) | as needed | as needed - promote when frequent |

## What this drives

- **Templater:** one template per type, pre-filled with that type's fields.
- **`/convert-note`:** knows which fields to extract per chosen type.
- **`/vault-health`:** confidence-decay + re-verify run on claim-types only.

## Open field decisions (flag your own)

- `project`: keep `owner`/`target`, or simplify?
- `task`: keep `effort`/`assignee` for a solo vault?
- `visibility`: precise meaning of `namespace` vs `private` vs `system`.
