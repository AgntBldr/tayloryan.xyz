---
id: tsk-seo-social-discovery-upgrade
type: task
summary: Add durable social preview, search metadata, branded favicon, crawler controls, image compression, and a prioritized product review without disturbing preserved resource links.
tags: [seo, social-preview, favicon, sitemap, robots, image-compression, product-review]
domain: project-management
status: done
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
assignee: codex
due:
effort: high
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
depends_on: ["[[dec-use-deploy-public-folder]]", "[[dec-tiered-model-routing-site-maintenance]]"]
supports: ["[[dec-centralize-seo-metadata-in-deploy-sync]]", "[[fct-seo-social-local-verification-2026-07-14]]"]
---

# SEO And Social Discovery Upgrade

## Done Criteria

- Canonical public pages have unique titles, descriptions, canonical URLs, Open Graph tags, Twitter cards, favicon links, and robots directives.
- `robots.txt` and the XML sitemap expose only intentional canonical pages.
- Social and favicon assets are branded, present, and served from the canonical deploy folder.
- High-use image payload is reduced without changing dimensions or removing originals.
- Desktop/mobile browser QA and deterministic route, metadata, preservation, and privacy checks pass.
- Changes are committed, reviewed through Cloudflare preview, merged, and verified on the custom domain.

## Outcome

- Merged PR: `https://github.com/AgntBldr/tayloryan.xyz/pull/6`; merge commit `ec160337e4197eb1bc715a6e6d672ee1fa8a41aa`
- Cloudflare: preview `cd558c9f-fe18-4332-ba6d-4fbcbea297f6`; production `ce446fff-2435-4b74-92c2-02d665cd6783`
- Metadata source: `execution/seo_metadata.json`; descriptions were drafted with local `qwen2.5:7b-instruct` and `gpt-5.4-mini`, not 5.6 or 5.6 SOL
- Generator: `execution/apply_seo_metadata.mjs`, called by `deploy_sync.ps1`
- Verification: 59 deployed HTML documents complete, 39/39 production sitemap routes live, four raw fragments omitted and noindexed, zero metadata/asset/redirect failures
- Images: 22 optimized variants reduced 15.09 MB to 2.98 MB while originals remain available for rollback
- Preservation: 395/395 protected private links and 39/39 Layer3 links remain; five deployed resource-data files match the release exactly, with zero retired links and zero public Klint email matches
- Product report: `audits/site-audit/product-review-2026-07-14.html`
- Next step: use the ICE-ranked report to scope a separate conversion pass, beginning with unfinished case-study proof and homepage positioning
