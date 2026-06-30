---
id: pat-page-component-structure
type: pattern
summary: Routes use dedicated page components composing shared layouts.
tags: [nextjs, components]
domain: architecture
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]", "[[prj-teneo-website]]"]
---

Each route utilizes a dedicated page component located in `src/components/pages/<page-name>/`. These components compose shared layout elements like `SiteHeader` and `SiteFooter` with page-specific sections. This structure separates page-specific logic from global layout concerns.
