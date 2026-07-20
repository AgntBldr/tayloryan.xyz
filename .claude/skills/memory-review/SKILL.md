---
name: memory-review
description: Token-lean end-of-project memory maintenance - a $0 script audits the auto-memory (index consistency, dead links, stale/oversized/duplicate entries) and the model fixes only what got flagged. Use at the end of a project/session ("review memory", "clean up memory") or on a weekly cadence.
---

# Memory Review - keep memory accurate without re-reading it

Memory only compounds if it stays clean, and re-reading every memory file to check it is the
expensive way. This skill inverts that: [scripts/memory-health.ps1](scripts/memory-health.ps1)
does ALL the reading for $0 and prints a compact report; the model reads the report, opens
ONLY flagged files, and fixes them.

## Procedure

1. Run the audit (derives the memory dir from the current project; `-MemoryDir` to override):

```powershell
& .claude\skills\memory-review\scripts\memory-health.ps1
```

2. Act ONLY on flags - open nothing that isn't flagged:
   - `NOT-IN-INDEX` -> add a one-line pointer to MEMORY.md (or delete the file if obsolete).
   - `INDEX-POINTS-TO-MISSING` -> remove the dead index line.
   - `DEAD-LINK` -> fix the `[[name]]` or write the missing memory if it's worth having.
   - `STALE(nd)` -> skim the DESCRIPTION only; if the fact may have drifted, verify against
     the repo/state before trusting it; delete if superseded. Stale is a smell, not a verdict.
   - `BIG(nKB)` -> split into atomic one-fact files or prune dead detail.
   - The `name | description` listing -> eyeball for two files covering one fact; merge into
     the older file, delete the newer, update links.
3. The report header shows `indexKB (~N tokens loaded EVERY session)` - keep MEMORY.md lines
   tight; the index is the only part that costs tokens every single session.

## Rules

- Never bulk re-read memory files "to check them" - that is what the script is for.
- Update-don't-duplicate; delete what proved wrong (wrong memory is worse than no memory).
- One fact per file, absolute dates, exact identifiers (commit shas, paths, flags).
- End-of-project writeback (fable-mode discipline #8) happens BEFORE this review, so the
  review sees the new entries too.
