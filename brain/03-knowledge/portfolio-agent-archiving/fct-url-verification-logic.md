---
id: fct-url-verification-logic
type: fact
summary: Verify URL status and update CSV before PDF generation.
tags: [http, validation]
domain: portfolio-agent-archiving
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]"]
---

The script verifies if a URL is live by checking for a 200 OK status or similar successful response. If the status is 404 or verification fails, the 'Live?' column in the CSV is marked as 'Dead' or 'No', and the PDF generation step is skipped. This ensures resources are only spent on accessible content.
