---
name: organize-vault
description: Maintain the V3 Second Brain — graduate inbox notes to typed nodes, upgrade vague related_to edges, and surface orphans, contradictions, and placement errors. Use periodically or when the vault feels messy.
---
# organize-vault

Interactive maintenance pass over the graph. Follows `00-system/AGENTS.md` §6 and
`edge-cases.md`.

## Steps
1. **Graduate notes:** for each `note` in `99-inbox/` (status: raw), reclassify into a proper
   type (same logic as convert-note); archive the note.
2. **Upgrade edges:** find `related_to` edges and replace each with a named relation
   (supports/derived_from/part_of/…) per edge-cases.md §B where one fits.
3. **Orphans:** list nodes with no edge fields; propose links or flag for review.
4. **Contradictions:** surface `contradicts` pairs, plus any two `active` claim-nodes that
   assert opposite things without a `contradicts` edge; propose resolution.
5. **Placement:** ensure `domain:` matches the folder path; fix mismatches.
6. **Report** changes + open issues. Append an `organize` entry to `log.md`.

## Rules
- Propose ambiguous/destructive changes (re-typing, archiving) before applying.
- Preserve history: archive, never delete.
