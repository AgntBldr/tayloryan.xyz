---
id: cpt-three-layer-architecture
type: concept
summary: Separates directive, orchestration, and execution to maximize reliability.
tags: [architecture, llm, deterministic]
domain: portfolio-agent-architecture
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]"]
---

The system uses a 3-layer architecture to separate concerns. Layer 1 is the Directive (SOPs in Markdown defining goals and inputs). Layer 2 is Orchestration (the AI agent handling routing and decision-making). Layer 3 is Execution (deterministic Python scripts for API calls and data processing). This structure fixes the mismatch between probabilistic LLMs and deterministic business logic, preventing error compounding by pushing complexity into code.
