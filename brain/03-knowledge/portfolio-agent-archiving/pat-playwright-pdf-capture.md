---
id: pat-playwright-pdf-capture
type: pattern
summary: Use Playwright to capture full-page PDFs with lazy load handling.
tags: [playwright, scraping, pdf]
domain: portfolio-agent-archiving
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]", "[[prj-writing-archive]]"]
---

To capture PDFs, the script uses Playwright in a headless browser mode. It attempts to handle cookie popups using try/except blocks for common selectors. Crucially, it scrolls to the bottom of the page to trigger lazy-loaded content before capturing the full-page screenshot or PDF. This ensures the archived document is complete.
