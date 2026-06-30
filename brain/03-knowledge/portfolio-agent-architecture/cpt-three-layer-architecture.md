---
id: cpt-three-layer-architecture
type: concept
summary: Separates directive, orchestration, and execution to fix the mismatch between probabilistic LLMs and deterministic business logic.
tags: [architecture, llm, deterministic, orchestration, agent]
domain: portfolio-agent-architecture
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]"]
---

The system uses a 3-layer architecture to separate concerns and prevent error compounding.

**Layer 1 - Directive:** SOPs written in Markdown, living in `directives/`. Define goals, inputs, tools, outputs, and edge cases in plain language.

**Layer 2 - Orchestration (the agent):** Intelligent routing between intent and execution. The agent reads directives, calls execution scripts in the right order, handles errors, asks for clarification when needed, and updates directives with learnings. It does NOT perform manual execution itself -- it delegates to Layer 3.

**Layer 3 - Execution:** Deterministic Python scripts in `execution/`. Handle API calls, data processing, file operations. Reliable, testable, commented. Environment variables and secrets stored in `.env`.

**Why it works:** 90% accuracy per step compounds to 59% success over 5 steps. Pushing complexity into deterministic code breaks that cascade. The AI focuses exclusively on decision-making.

## Edges

`part_of` [[pil-portfolio-agent]] -- the founding architectural concept of this system.
`supports` [[pat-check-tools-first]] -- execution-first discipline follows from this architecture.
`supports` [[pat-directive-maintenance]] -- directives must stay current for this to work.
`supports` [[pbk-self-annealing-loop]] -- the error-recovery loop operationalizes Layer 2 behavior.
