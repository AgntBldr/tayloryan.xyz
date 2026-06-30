---
name: new-brain
description: Stamp a fresh, fully isolated Second Brain vault from secondbrain-template for a new business or large project. Use when starting a new venture that should not share context with existing vaults.
---
# new-brain

Create a new isolated vault from the engine template. Other businesses' content never bleeds in.

## Preferred: run the bootstrap
From the workspace root (parent of this vault):
```
./new-brain.ps1 -Name "<business-or-project>"
```
Options: `-Path <dir>` (where to create it), `-SymlinkShared` (live-link shared-core instead of
copying; needs Windows dev-mode/admin), `-Git` (git init the new vault).

The script clones `secondbrain-template/`, resets the log, creates a root `pil-<name>` pillar,
and mounts `shared-core/` at `_shared/`.

## Manual fallback (no script / Codex)
1. Copy `secondbrain-template/` to `../<name>/`.
2. Reset `00-system/log.md` to a fresh header.
3. Create `01-pillars/pil-<name>.md` (the root business pillar).
4. Copy `shared-core/` to `<name>/_shared/` (or symlink).
5. Open the new folder as its own Obsidian vault + Claude Code project.

## Rules
- Never create the new vault inside an existing vault.
- The template is content-free - never add business content to `secondbrain-template/`.
