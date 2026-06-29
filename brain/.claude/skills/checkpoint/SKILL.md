---
name: checkpoint
description: Capture a labeled rollback point of BOTH tiers — annotated-tag Tier-1 (`checkpoint/<id>`) and snapshot the LightRAG `rag_storage/` store under `backups/<id>/` — so a risky operation can be undone. Use before any bulk import, re-ingest, rename, or destructive sweep.
---
# checkpoint

Capture a two-tier rollback point. Tier-1 (the markdown vault) is pinned by an annotated git tag plus
a standalone bundle; Tier-2 (LightRAG `rag_storage/`) is snapshotted by a read-only copy. A flat
`manifest.json` welds them with `binding_sha256`, and a `COMPLETE` marker is written last so the
checkpoint is atomic.

## Prereqs
- Runs from `scripts/checkpoint.ps1`. Docker may be down — Tier-2 is a plain folder, so no container
  is needed to capture it (the live store is only ever READ).
- `.env` is never copied (excluded by scope + robocopy `/XF` + a pre-flight scan).

## Steps
1. **Pick a label** describing what you are about to do, e.g. `before-gdrive-import`.
2. **Run the checkpoint** (PowerShell 5.1):
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\tempv2\V3-2ndBrain\scripts\checkpoint.ps1" -Label before-gdrive-import
   ```
   Add `-WithInputs` to also snapshot `lightrag/inputs/`. Use `-DryRun` to narrate without writing.
3. **Verify it published.** A new dir `backups/<id>/` appears containing `manifest.json`,
   `manifest.json.sha256`, `COMPLETE`, `git/bundle.gitbundle`, and `tier2/rag_storage/`. List all
   checkpoints with `scripts/list-checkpoints.ps1`.
4. **Note the id + tag.** The annotated tag is `checkpoint/<id>`; the Tier-2 snapshot lives under
   `backups/<id>/tier2/`. Both are referenced by `restore -Id <id>`.
5. The script appends a `checkpoint` entry to `00-system/log.md` automatically.

## Rules
- Local commit + tag only — never push.
- Never copy `.env` into the checkpoint (scope + `/XF` + pre-flight scan enforce this).
- A checkpoint without a `COMPLETE` marker is partial; `list`/`restore` ignore it.
- Capturing the live Tier-2 store is READ-only; it does not require docker to be up.
