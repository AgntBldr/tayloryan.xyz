---
name: restore
description: Roll BOTH tiers back to a labeled checkpoint - overlay the tagged Tier-1 tree as a new forward commit and atomically swap the LightRAG store - after auto-creating a mandatory pre-restore safety checkpoint. Use when an operation went bad and you want a known-good point.
---
# restore

Roll both tiers back to a checkpoint. A mandatory pre-restore safety checkpoint is created FIRST, so
the restore is itself reversible. Tier-1 is restored FORWARD-ONLY (the tagged tree is committed as a
new commit - history is preserved, never `reset --hard`). Tier-2 is swapped copy-to-temp-then-rename,
keeping the previous store as an undo.

## Prereqs
- Runs from `scripts/restore.ps1`. Find the target id with `scripts/list-checkpoints.ps1`.
- If `sb-lightrag` is running, the script stops it for the swap window and restarts it after.

## Steps
1. **Find the checkpoint id** with `scripts/list-checkpoints.ps1`.
2. **Run the restore** (PowerShell 5.1):
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\tempv2\V3-2ndBrain\scripts\restore.ps1" -Id 20260622-143005-before-gdrive-import
   ```
   Use `-DryRun` to narrate every action (including the safety net) without writing. `-Force` only
   relaxes the dirty-worktree refusal - it never skips the safety net.
3. **Safety net (automatic).** Before touching anything, a pre-restore checkpoint
   `prerestore-<id>` of the current live state (both tiers) is created and must report `COMPLETE`,
   else the restore aborts.
4. **Consistency check (automatic).** `manifest.json.sha256` and `binding_sha256` are verified; a
   mismatch aborts before any destructive action.
5. **Tier-1.** The tagged tree (`checkpoint/<id>`) is overlaid onto index + worktree and committed
   forward (`restore: roll back to checkpoint <id>`). Verified: new HEAD tree == tag tree.
6. **Tier-2.** Stop `sb-lightrag` if running -> stage replacement in `rag_storage.new` -> verify ->
   rename live store to `rag_storage.old-<stamp>` (KEPT) -> rename `.new` to live -> verify tree hash +
   12 files per workspace + non-empty `.graphml` -> restart container.
7. The script appends a `restore` entry to `00-system/log.md`. To confirm recall once the stack is up:
   `POST http://localhost:9621/query {"query":"...","mode":"hybrid"}`.

## Rules
- Never `reset --hard`, never force-update a ref, never detached HEAD - Tier-1 is forward-only.
- Never skip the pre-restore safety net (no flag disables it).
- Never partial-copy Tier-2 - copy-to-temp-then-rename only; the old store is retained as undo.
- Never push; never copy `.env`.
- Abort if `binding_sha256` or `manifest.json.sha256` fails to verify.
