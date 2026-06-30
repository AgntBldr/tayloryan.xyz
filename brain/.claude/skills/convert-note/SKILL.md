---
name: convert-note
description: Decompose raw material (a doc, transcript, note, or pasted text) into typed atomic nodes in the V3 Second Brain, following schema.md and edge-cases.md. Use when ingesting or structuring new information into the vault.
---
# convert-note

Turn raw material into atomic, typed, linked nodes. Follows `00-system/AGENTS.md` §3-4.

## Input
A file in `05-sources/raw/`, a `note` in `99-inbox/`, or pasted text.

## Steps
1. **Create/confirm a `source` node** in `05-sources/` for the material (summary, source_type,
   url). When Tier-2 exists, ingest it and set `source_ref`.
2. **Extract atomic ideas** - one-idea units, ~50-300 words each.
3. **Classify each** using `00-system/schema.md` (17 types). When torn, apply
   `00-system/edge-cases.md` §A. Common: claims->`fact`, beliefs->`hypothesis`, choices->
   `decision`, definitions->`concept`, regularities->`pattern`, occurrences->`event`.
4. **Write each node**: type-prefixed `id`, full base frontmatter, type-specific fields
   (schema.md), trust metadata on claim-types, `domain:` matching its folder.
5. **Link edges** - flat per-relation fields with wikilink values (edge-cases.md §B for which
   relation). At minimum `derived_from` the source; add `supports`/`contradicts`/`depends_on`/
   `part_of` where real. Reasons go in a `## Edges` body section. Avoid `related_to` if a
   named edge fits.
6. **Scope** each node: `tagged_with: ["[[pil-<business>]]"]`.
7. **Place** files in the right domain folder (create the sub-folder lazily if needed).
8. If converting a `note`, set it `status: archived` after graduation (keep history).
9. Move the raw file to `05-sources/raw/processed/`. Append a `convert` entry to `log.md`.

## Rules
- One idea per node. Past ~300 words, split into part 1/2/3 linked by `preceded_by`/`followed_by`.
- Never link to a node that doesn't exist - create the target or omit the edge.
