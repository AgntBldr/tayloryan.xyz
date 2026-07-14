---
id: fct-seo-social-local-verification-2026-07-14
type: fact
summary: The 2026-07-14 local deploy has complete metadata on 59 HTML documents, 40 canonical sitemap URLs, and an 80.3% reduction across 22 optimized image variants.
tags: [seo, social-preview, sitemap, favicon, performance, verification]
domain: deployment
status: active
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
confidence: 1.0
verified_at: 2026-07-14
verified_by: execution/verify_seo.mjs, local HTTP route probes, preservation assertions, and browser QA
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
derived_from: ["[[tsk-seo-social-discovery-upgrade]]"]
supports: ["[[dec-centralize-seo-metadata-in-deploy-sync]]"]
---

# SEO And Social Local Verification

Before this pass, the 45 routed index pages had zero meta descriptions, Open Graph images, Twitter cards, or favicon links; canonical coverage was partial and sitemap dates/routes were stale. The generated local deploy now passes complete metadata checks across 59 headed HTML files and contains exactly 40 intentional canonical URLs in `sitemap.xml`. Four raw overview fragments are omitted from the sitemap and noindexed by response header.

Twenty-two high-use PNGs received dimension-preserving JPEG variants, reducing their combined referenced payload from 15.09 MB to 2.98 MB. All 40 sitemap routes and crawler/favicon assets returned HTTP 200 locally. Browser QA found no horizontal overflow at desktop or mobile widths and verified the mobile menu, accessible labels, canonical metadata, social image URL, and favicon links. Resource regression checks retained 395/395 protected private links and 39/39 Layer3 links, with zero retired links and zero public Klint email matches.
