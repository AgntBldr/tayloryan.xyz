---
id: fct-path-alias-configuration
type: fact
summary: The project uses a specific path alias for imports.
tags: [typescript, configuration]
domain: configuration
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]", "[[prj-teneo-website]]"]
---

The project uses the path alias `@/*`, which maps to the project root. This allows imports such as `@/src/components/...` or `@/app/...`, simplifying module resolution and avoiding relative path complexity.
