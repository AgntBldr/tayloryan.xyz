---
name: start-project
description: Instantiate a new project in the vault from a playbook - create the project node (part_of a pillar, derived_from the playbook), scaffold its folder, and generate ordered task nodes. Use when kicking off a new bounded initiative.
---
# start-project

Turn a playbook into a running project. Follows `00-system/schema.md` (project/task) and AGENTS.md.

## Inputs
- A goal/name for the project.
- The `pillar` it belongs to (its standing goal/area; in a single-business vault, the root pillar).
- Optionally a `playbook` to instantiate (`04-playbooks/` or `_shared/playbooks/`). If none fits, proceed without one.

## Steps
1. Create the project folder: `02-projects/<project-slug>/`.
2. Create the `project` node (`prj-<slug>`) there: summary, owner, start, target, status `planning`.
   Edges: `part_of: ["[[pil-<pillar>]]"]`; if from a playbook, `derived_from: ["[[pbk-...]]"]`.
3. If a playbook is used, read its `## Steps` and generate one `task` node per step in the project
   folder (`tsk-<slug>-NN`): summary, status `todo`, `part_of: ["[[prj-<slug>]]"]`, ordered with
   `preceded_by` (step N `preceded_by` step N-1).
4. Pull context: traverse the pillar's edges + recent decisions/facts in the project's domain so it
   starts informed; note them in the project body.
5. Set project status `active`. Append a `start-project` entry to `log.md`.

## Rules
- One project = one folder. Tasks live inside it and are `part_of` the project.
- Don't copy playbook content into the project - link via `derived_from`.
