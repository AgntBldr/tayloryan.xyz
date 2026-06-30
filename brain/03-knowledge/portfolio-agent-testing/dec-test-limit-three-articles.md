---
id: dec-test-limit-three-articles
type: decision
summary: Limit processing to 3 articles during testing phases.
tags: [testing, constraints]
domain: portfolio-agent-testing
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]"]
---

To prevent excessive resource usage or errors during development and testing, the script is configured to process a maximum of 3 articles. This limit allows for validation of the crawling and PDF generation logic without running the full dataset immediately.
