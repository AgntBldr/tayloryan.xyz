---
id: pat-directive-maintenance
type: pattern
summary: Directives are living documents updated with learnings, not discarded.
tags: [documentation, sops]
domain: portfolio-agent-operations
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]"]
---

Directives must be updated when discovering API constraints, better approaches, or common errors. They are living documents that serve as the instruction set. However, agents should not create or overwrite directives without asking unless explicitly told to. The goal is to preserve and improve them over time rather than using them extemporaneously.
