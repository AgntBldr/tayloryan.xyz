---
id: pat-check-tools-first
type: pattern
summary: Always check existing execution scripts before writing new ones.
tags: [efficiency, code-reuse]
domain: portfolio-agent-operations
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]"]
---

Before writing a new script, the agent must check the `execution/` directory as defined by the directive. New scripts should only be created if no existing tool fulfills the requirement. This ensures reuse of deterministic code and maintains consistency across operations.
