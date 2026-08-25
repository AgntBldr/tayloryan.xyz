---
id: fct-production-crawlability-and-umami-analytics-2026-08-25
type: fact
summary: Production taylorryan.xyz is crawlable across all 39 sitemap URLs and uses Umami Cloud analytics with complete coverage of the public indexable HTML surface.
tags: [taylor-ryan, production, seo, crawlability, analytics, umami]
domain: deployment
status: archived
created: 2026-08-25
updated: 2026-08-25
visibility: namespace
confidence: 1.0
verified_at: 2026-08-25
verified_by: Codex production HTTP checks and execution/verify_seo.mjs
supports: ["[[prj-taylor-ryan-site-remediation]]", "[[tsk-seo-social-discovery-upgrade]]"]
---

# Production Crawlability And Analytics Verification

> Archived correction: the embed was present and reachable, but the configured
> Umami website ID did not match the user's dashboard property and therefore did
> not provide usable session reporting. See [[dec-replace-umami-with-cloudflare-web-analytics]].

Production checks confirmed that the homepage, `robots.txt`, and `sitemap.xml` return HTTP 200. All 39 sitemap URLs return HTTP 200, include canonical tags, and have no `noindex` conflicts. The local SEO verifier also passes for 59 intended HTML documents and 39 sitemap URLs.

The public site uses Umami Cloud via `https://cloud.umami.is/script.js` and website ID `d1945245-8106-4e31-90a5-3af43160122d`; the script endpoint and production embed both return successfully. Four deployed generator fragments omit analytics, but they are intentionally excluded from the sitemap and noindexed, so the public indexable surface has complete analytics coverage.

## Edges

- supports [[prj-taylor-ryan-site-remediation]] - confirms the production discovery and measurement surface remains healthy.
- supports [[tsk-seo-social-discovery-upgrade]] - re-verifies the completed release against production.
