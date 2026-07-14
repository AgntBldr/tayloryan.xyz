---
id: pat-no-hallucination-extraction
type: pattern
summary: Event fields must be null if not explicitly found in source HTML.
tags: [hard-rule, scraping, accuracy]
domain: scraping
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
confidence: 0.9
part_of: ["[[pil-event-scraper]]"]
shared: true
---

During data extraction, event facts must never be invented. If a specific field is not visibly stated in the source HTML, it must be left as `null`. A reviewer agent is responsible for flagging any hallucinations, ensuring that the extracted data remains strictly faithful to the source material.
