---
id: dec-use-project-brain-not-memtrace
type: decision
summary: Use this repo's ./brain vault, not Memtrace, for PortfolioAgent memory and continuity.
tags: [memory, second-brain, operations]
domain: portfolio-agent-operations
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
confidence: 1.0
verified_at: 2026-07-13
verified_by: user clarification
part_of: ["[[pil-portfolio-agent]]"]
supports: ["[[pat-directive-maintenance]]"]
---

# Use Project Brain Not Memtrace

For this project, agents should use the local V3 Second Brain vault at `./brain` for durable memory, routing, decisions, facts, tasks, and continuity. Do not use Memtrace for this repo unless the user explicitly reverses this decision. Deterministic local scripts and ordinary bounded file reads remain fine for implementation and validation; durable learned context should be recorded in `./brain`.

## Edges

- supports [[pat-directive-maintenance]] - project memory stays in the portable markdown vault shared by agents.
