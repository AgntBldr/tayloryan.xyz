---
id: pat-content-driven-pages
type: pattern
summary: Page metadata and structure are defined in structured data files.
tags: [content, data]
domain: data-management
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]"]
---

Structured data for content is stored in `src/content/`. This includes `navigation.ts` for defining navigation links and `pages.ts` for page metadata and section definitions. A `page-factory.tsx` utility in `src/lib/` provides `metadataFor()` and `renderPage()` functions to generate pages from this data.
