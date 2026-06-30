---
id: fct-nextjs-app-router-structure
type: fact
summary: Routes are organized under the app directory with specific conventions.
tags: [nextjs, routing]
domain: routing
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]", "[[prj-teneo-website]]"]
---

All routes reside under the `app/` directory using Next.js App Router. Blog posts are dynamically routed under `app/blog/<slug>/`, with each post having its own route folder. API routes are located at `app/api/`, handling endpoints like search and CMS interactions.
