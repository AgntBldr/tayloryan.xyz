---
id: fct-data-output
type: fact
summary: Scraped quest data is saved to `quest_portfolio/data/quests.`.
tags: [storage, data-schema]
domain: pil-portfolio-agent-data
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]"]
---

The extracted information, including quest metadata (title, description) and quest steps (cards, content, links, images), is serialized and stored in a JSON file located at `quest_portfolio/data/quests.` to be consumed by the frontend application.
