---
name: init-vault
description: Scaffold or repair the V3 Second Brain structure (folders, system docs, templates, skills). Idempotent and non-destructive. Use to set up a new vault or restore missing structure.
---
# init-vault

Create or repair the vault skeleton. Idempotent: never overwrite existing content.

## Steps
1. Ensure folders exist: `00-system`, `01-pillars`, `02-projects`, `03-knowledge/<domains>`,
   `04-playbooks`, `05-sources/raw/processed`, `06-people`, `99-inbox`, `_templates`, `.claude/skills`.
2. Ensure system docs exist (`AGENTS.md`, `CLAUDE.md`, `schema.md`, `edge-cases.md`, `SETUP.md`,
   `index.md`, `log.md`) — create from canonical versions only if missing.
3. Ensure one node template per type exists in `_templates/`.
4. Report created-vs-existing. Append an `init` entry to `log.md`.

## Rules
- Never clobber an existing file; only create what's missing.
