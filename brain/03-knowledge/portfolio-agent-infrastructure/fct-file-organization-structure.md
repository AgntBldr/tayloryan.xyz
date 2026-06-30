---
id: fct-file-organization-structure
type: fact
summary: Defines directory structure for deliverables, intermediates, and code.
tags: [filesystem, structure]
domain: portfolio-agent-infrastructure
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]"]
---

The project separates files into specific categories. `.tmp/` holds all intermediate files (dossiers, scraped data) which are never committed. `execution/` contains deterministic Python scripts. `directives/` holds SOPs in Markdown. `.env` stores environment variables. Deliverables (Google Sheets, Slides) live in the cloud, while local files are strictly for processing.
