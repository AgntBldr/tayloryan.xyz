# Edge Cases — V3 Second Brain

> Disambiguation rules agents follow when classifying nodes and choosing edges.
> Edit any ruling to your own definition; the edited version stays canonical.
> `/convert-note` and `/organize-vault` read this file.
> **This file = how to tell two types/edges apart when you're torn. Its companion [`schema.md`](schema.md) = what each node *is*.**
> Status: canonical. Last updated: 2026-06-29

## A. Classification edge cases — which node type?

*If torn, ask the question → file as the ruling.*

### Strategic / structural
| Torn between | Ask yourself | Ruling |
|---|---|---|
| pillar vs decision | Ongoing stance, or one-time choice? | Ongoing → **pillar**; dated choice → **decision**. A standing policy = pillar. |
| pillar vs project | Does it have an end state? | Perpetual → **pillar**; bounded → **project**. |
| pillar vs concept | Pursuing/upholding, or neutrally defining? | Goal/principle → **pillar**; neutral meaning → **concept**. |
| project vs task | One action, or many toward an outcome? | Single actionable → **task**; multi-step → **project**. |
| decision vs playbook | One moment, or reusable for many? | One choice → **decision**; reusable steps → **playbook**. |

### Knowledge / analytical
| Torn between | Ask yourself | Ruling |
|---|---|---|
| concept vs fact | Defining a meaning, or asserting something checkable? | Meaning → **concept**; verifiable claim → **fact**. |
| concept vs pattern | Definitional, or observed across instances? | Definition → **concept**; regularity → **pattern**. |
| fact vs pattern | One truth, or a recurring trend? | Single → **fact**; recurs across cases → **pattern**. |
| fact vs event | Standing truth, or a thing that happened at a time? | Standing (incl. dated metric) → **fact**; occurrence → **event**. |
| hypothesis vs question | Have a candidate answer you believe? | Belief → **hypothesis**; open unknown → **question**. |
| hypothesis vs decision | Testing a belief, or committing to act? | Belief → **hypothesis**; committed → **decision**. |
| hypothesis vs fact | Confirmed yet? | Unconfirmed → **hypothesis**; verified → spawn new **fact**. |
| pattern vs playbook | Describing what happens, or prescribing what to do? | Descriptive → **pattern**; prescriptive → **playbook**. |

### Operational / temporal
| Torn between | Ask yourself | Ruling |
|---|---|---|
| task vs event | Future to-do, or past occurrence? | Future → **task**; happened → **event**. |
| task vs decision | An action to perform, or a choice made? | Action → **task**; choice → **decision**. |

### Inputs / provenance
| Torn between | Ask yourself | Ruling |
|---|---|---|
| source vs bookmark | Actually ingested it? | Ingested → **source**; saved-for-later → **bookmark**. |
| source vs reference | Extracted content, or just cite it? | Extracted → **source**; cite-only authority → **reference**. |
| bookmark vs reference | Casual save, or authoritative standard? | Casual → **bookmark**; authority → **reference**. |
| source vs contact | The material, or the person? | Material → **source** (`authored_by`) **contact** = person. |
| fact vs source | The claim, or the document? | Claim → **fact** (`derived_from`) the **source** = document. |

### Utility
| Torn between | Ask yourself | Ruling |
|---|---|---|
| note vs a real type | Can it be sharpened *now*? | If yes, use that type. **note** is only a holding pen. |
| custom vs note | Recurring/structured, or freeform? | Recurring → **custom** (promote later); freeform → **note**. |

## B. Edge-selection edge cases — which relationship?

| Torn between | Use the first when… | Use the second when… |
|---|---|---|
| **supports** vs **related_to** | A is evidence/argument *for* B | link is real but unnameable (last resort) |
| **supports** vs **derived_from** | A backs up B's *truth* | B was *created out of* A (provenance) |
| **derived_from** vs **depends_on** | historical: A *came out of* B | logical: A *needs* B true/done first |
| **depends_on** vs **preceded_by** | A genuinely *requires* B | only *sequence order*, no dependency |
| **part_of** vs **depends_on** | A is a *component* of whole B | A *requires* B but isn't part of it |
| **contradicts** vs **related_to** | real *tension/conflict* | neutral relation |
| **tagged_with** vs **related_to** | A is *categorized under* topic B | A is a *peer* loosely associated |
| **authored_by** vs **derived_from** | B *created* A (authorship) | A's *content* was concluded from B |

**Rule of thumb:** `related_to` is the "smell" edge — try once to upgrade it to a named edge.
`/organize-vault` keeps nagging until you do.

## C. Lifecycle transitions  (spawn-not-mutate — preserve belief history)

| When this happens | Do this |
|---|---|
| Hypothesis confirmed | Create **fact**/**pattern** `derived_from` the hypothesis; hypothesis `status: resolved`. |
| Question answered | Create **decision**/**fact**/**hypothesis** `derived_from` the question; question `status: resolved`. |
| Note graduates | Create the proper typed node from its refined content; archive/delete the note. |
| Bookmark ingested | Create a **source** (+ push to LightRAG); bookmark → `archived`, `related_to` the source. |
| Decision reversed/superseded | New **decision** that `contradicts` the old; old → `status: archived`. |
| Fact/pattern invalidated | Keep it (history), `status: archived`, link new contradicting fact via `contradicts`. |
| Confidence decay (vault-health) | Lower `confidence` as `staleness` triggers; flag for re-verify — never silently delete. |

## Confirmed boundary rulings (highlights)

1. Standing policy → **pillar**, not a dated decision.
2. Dated metric ("MRR was $10k in April") → **fact**, not event.
3. Long-running, no-end initiative → **pillar**, not project.
4. Lessons from a finished project → **pattern** (+ **playbook** update).
5. Article you read & extracted from → **source** (not reference).
