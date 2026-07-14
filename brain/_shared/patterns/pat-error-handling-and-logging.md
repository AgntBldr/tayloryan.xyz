---
id: pat-error-handling-and-logging
type: pattern
summary: Specific practices for exceptions and logging.
tags: [error-handling, logging]
domain: code-quality
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
part_of: ["[[pil-ace-musicgen]]"]
shared: true
---

Avoid bare `except:` clauses; catch specific exceptions. Use custom exceptions for domain errors. Log errors with `loguru.logger` instead of `print()`. Let exceptions propagate for truly exceptional conditions. Logs should be actionable and debug-level for development. Avoid `print()` in committed code except for specific CLI output.
