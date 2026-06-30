---
id: cpt-agent-orchestration-role
type: concept
summary: The agent acts as the glue between human intent and deterministic execution.
tags: [agent, orchestration, routing]
domain: portfolio-agent-roles
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]"]
---

The agent operates in the Orchestration layer, sitting between human intent (directives) and deterministic execution (Python scripts). Its job is intelligent routing: reading directives, calling execution tools in the correct order, handling errors, asking for clarification, and updating directives with learnings. It focuses on decision-making rather than manual execution.
