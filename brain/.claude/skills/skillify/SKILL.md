---
name: skillify
description: Compile a mature playbook (or recurring pattern) into a dedicated Claude Code skill, so a proven procedure becomes an executable capability. Use when a playbook is stable and run often enough to be worth automating.
---
# skillify

The brain->skill loop: turn knowledge (a `playbook`) into capability (a skill).

## When to use
A `playbook` is stable, well-tested, and run often enough that a one-command skill beats
re-reading it each time.

## Steps
1. Read the source `playbook` (local or `_shared/`): steps, inputs, outputs, when_to_use.
2. Create `.claude/skills/<name>/SKILL.md` with frontmatter `name` + `description` (when to use,
   from the playbook) and a procedure mirroring the playbook's steps as agent instructions.
3. Register it in `00-system/skills-index.md` (capability registry), linking the source playbook.
4. Keep the playbook as source of truth; the skill is its executable form. If the playbook changes
   materially, re-run `skillify` to regenerate.
5. Append a `skillify` entry to `log.md`.

## Rules
- Don't hand-fork logic: the skill should mirror the playbook so they don't drift.
- Skills are capability, not knowledge - the reasoning stays in the playbook node.
