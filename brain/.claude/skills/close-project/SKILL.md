---
name: close-project
description: Close out a finished project — mark it archived and extract durable learnings into pattern nodes and playbook updates so the brain gets smarter. Use when a project is done.
---
# close-project

Capture what a project taught, then archive it. Follows AGENTS.md lifecycle (spawn-not-mutate).

## Steps
1. Verify outstanding `task` nodes are `done` or explicitly dropped (note why).
2. Extract learnings:
   - Durable observed regularities → new `pattern` nodes (`derived_from` the project's events/facts).
   - Procedure improvements → update the source `playbook` (or create one if the project had none),
     so the next instance benefits.
3. Record outcome on the `project` node (results vs target); set `status: archived`.
4. Keep history — never delete the project or its nodes.
5. Append a `close-project` entry to `log.md`.

## Rules
- The point of closing is the write-back: a finished project should leave behind reusable
  patterns/playbook improvements, not just an archived folder.
