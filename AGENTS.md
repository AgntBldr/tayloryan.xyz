<!-- BEGIN second-brain-working-memory (managed by add-brain-to-project.ps1; edit inside, keep the markers) -->
# Working Memory (Second Brain)

This project has a persistent working memory: a typed markdown knowledge graph (a "V3 Second Brain"
vault) at ./brain. Use it to REMEMBER decisions, architecture, constraints, gotchas, and task
state across sessions, and to RECALL them before acting. If you learned something worth not
re-deriving, write it down; before you decide something, check if it is already decided.

## The protocol lives in the vault - follow it, do not reinvent it
Agents merge nested AGENTS.md files, so when you work inside ./brain the vault's own
./brain/00-system/AGENTS.md protocol applies automatically. Canonical specs:
- ./brain/00-system/AGENTS.md       - operating protocol (route-before-read, node creation, edges, lifecycle, logging).
- ./brain/00-system/schema.md       - the 17 node types, their fields, and id prefixes.
- ./brain/00-system/edge-cases.md   - how to classify a node and choose the right edge.
- ./brain/00-system/skills-index.md - the operations this brain supports.
Each operation's full procedure is in ./brain/.claude/skills/<name>/SKILL.md. These are not
auto-registered as project slash commands, so to "run" an operation you READ that SKILL.md and follow
its steps. The Tier-1 skills (convert-note, query-vault, organize-vault, vault-health, start-project,
close-project) operate purely on markdown and work as-is here.

## HARD ISOLATION GUARDRAILS - never violate
This memory belongs to THIS PROJECT ONLY. The engine that created it is shared and lives elsewhere.
- DO: read and write ONLY under ./brain/.
- NEVER read, write, or reference C:\Users\tempv2\V3-2ndBrain\Obsidian-V3-2ndBrain\ - that is the
  separate "POD" business brain. Off-limits.
- NEVER write to the shared engine: C:\Users\tempv2\V3-2ndBrain\secondbrain-template\, ...\shared-core\,
  ...\scripts\, ...\lightrag\. You may read them for reference; never modify them.
- NEVER run ...\V3-2ndBrain\scripts\checkpoint.ps1 or restore.ps1 - they are hardcoded to the POD repo
  and would roll back the WRONG vault. This project's rollback is its own git history.
- NEVER touch ...\V3-2ndBrain\lightrag\.env (WORKSPACE=pod serves POD). Tier-2 here is optional and
  isolated (see bottom).
- If a task seems to require touching anything outside ./brain/, STOP and ask the user first.

## Agent portability & handoff (Claude Code <-> Codex)
This project may be driven by either Claude Code or Codex; they share this memory via files + git.
- AGENTS.md is the single source of truth; CLAUDE.md only imports it (@AGENTS.md). Never duplicate
  instructions into CLAUDE.md - edit AGENTS.md only, so the two agents never drift.
- Operate ONE agent at a time on this repo. Before you stop, or when switching agents (e.g. credits
  run out), COMMIT your work and make the resumption state current: update the active task node's
  status and append a "## [YYYY-MM-DD] <op> | <title>" line to ./brain/00-system/log.md.
- When you START a session, first read the latest ./brain/00-system/log.md entries and the active
  project/task nodes (the recall loop) to pick up exactly where the other agent left off.
- Keep the core on portable mechanisms only: files, git, plain SKILL.md procedures, and HTTP for
  Tier-2. Never depend on agent-specific features (slash commands, hooks, or an MCP server configured
  in only one agent).

## WRITE loop - what to record (and what not to)
As you build, capture durable, non-obvious knowledge as atomic typed nodes (one idea each, ~50-300
words). Pick the type and id-prefix from schema.md; common ones:
- decision (dec-...) - every chosen approach/library/schema/tradeoff. Record why + alternatives. If it
  supersedes an earlier decision, add contradicts: ["[[dec-old]]"] and set the old one status: archived.
- fact (fct-...) - a confirmed constraint (API limit, perf number, hard requirement). Set confidence,
  verified_at, verified_by.
- hypothesis (hyp-...) - an unproven assumption. When proven, spawn a fact derived_from it and set the
  hypothesis status: resolved.
- concept (cpt-...) - a stable definition of a domain/architecture idea.
- pattern (pat-...) - a reusable technique we settled on.
- project / task (prj-... / tsk-...) - the work and its live state; tasks part_of the project.
- source (src-...) - an important external spec/doc relied on.
Connect nodes with typed edges (derived_from, depends_on, supports, part_of, preceded_by, ...);
related_to is the last resort. Make project nodes part_of the root pillar pil-brain. After each
write, append one line to ./brain/00-system/log.md: ## [YYYY-MM-DD] <op> | <title>.
DO NOT record: transient chatter, anything obvious from the code, or secrets/keys.

## READ loop - recall before acting (route, do not grep)
Before designing a feature, picking a library, or reversing a prior call:
1. Read node frontmatter only (summary, tags, edges) - use ./brain/00-system/index.md and the
   relevant 03-knowledge/<domain> folder.
2. Follow edges to neighbours' frontmatter; open a node body only when its summary earns it.
3. Check for an existing decision/fact/hypothesis before re-deciding; if you contradict one, do it
   explicitly via the lifecycle rules - never silently.

## Folder map
00-system protocol | 01-pillars the project pillar (pil-brain) | 02-projects efforts+tasks |
03-knowledge/<domain> facts/concepts/decisions | 04-playbooks SOPs | 05-sources sources/refs |
06-people contacts | 99-inbox quick notes to graduate later.

## Tier-2 (LightRAG bulk recall) - OPTIONAL, off by default
Tier-1 above IS the working memory. Only if this project accumulates large documents worth fuzzy-recall
should you enable Tier-2 - and only with its OWN isolated workspace, NEVER pod. Ask the user first;
procedure in ./brain/.claude/skills/ingest/SKILL.md. Until then, ignore Tier-2.
<!-- END second-brain-working-memory -->
