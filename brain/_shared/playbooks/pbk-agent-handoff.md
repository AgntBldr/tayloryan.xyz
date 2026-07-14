---
id: pbk-agent-handoff
type: playbook
summary: Structured handoff protocol for coding agents (Codex, Claude Code) to continue development with minimal context loss.
tags: [handoff, agent, operations, context-recovery]
domain: operations/handoff
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
part_of: ["[[pil-mxney]]"]
shared: true
---

## Procedure

1. Read these files first after compaction or a fresh agent handoff (in order):
   - `docs/CURRENT_STATE.md`
   - `docs/MEMORY_PROTOCOL.md`
   - `docs/PROJECT_STATE.md`
   - `docs/LEARNINGS.md`
   - `docs/BATCH_HISTORY.md`

2. Keep `docs/CURRENT_STATE.md` compact.

3. Update CURRENT_STATE.md after:
   - Major runs
   - Paid API experiments
   - Browser validation work
   - Field/schema changes
   - Persistence changes
   - Before final responses creating new outputs

## Rationale

Explicit recovery sequence minimizes time-to-productivity for fresh agent contexts and ensures critical context is available in priority order. Compact state files prevent information overload while comprehensive archives remain accessible.
