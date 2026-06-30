# AGENTS.md

This is the **V3 Second Brain** vault. **Any** agent (Codex, Claude Code, etc.) must read the
canonical protocol first: [`00-system/AGENTS.md`](00-system/AGENTS.md).

Companion specs you must follow:
- [`00-system/schema.md`](00-system/schema.md) - the 17 node types and their fields.
- [`00-system/edge-cases.md`](00-system/edge-cases.md) - how to classify nodes and choose edges.
- [`00-system/skills-index.md`](00-system/skills-index.md) - the operations this brain supports.

Each operation's full procedure lives in `.claude/skills/<name>/SKILL.md` - read that file to
execute the operation. It is the agent-agnostic spec (Claude Code also exposes it as a slash command).

Core rules: route before reading (frontmatter first) * one atomic idea per node * classify per
`edge-cases.md` * spawn-don't-mutate on lifecycle changes * log to `00-system/log.md`.
