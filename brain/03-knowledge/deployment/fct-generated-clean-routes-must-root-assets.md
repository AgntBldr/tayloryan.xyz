---
id: fct-generated-clean-routes-must-root-assets
type: fact
summary: Copying a portfolio page from page.html to page/index.html adds one path segment, so generated clean routes must root local asset references to /assets/.
tags: [deployment, clean-routes, asset-paths, cloudflare]
domain: deployment
status: active
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
confidence: 0.99
verified_at: 2026-07-14
verified_by: Cloudflare-root local browser QA and execution/verify_conversion_ux.mjs
supports: ["[[tsk-conversion-ux-reversible-pass]]"]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
tagged_with: ["[[pil-portfolio-agent]]"]
---

# Generated Clean Routes Must Root Assets

`deploy_sync.ps1` generates clean portfolio routes by copying a canonical legacy file such as `portfolio/marketing/content_creator.html` to `portfolio/marketing/content_creator/index.html`. The destination is one directory deeper, so an otherwise-correct reference such as `../../assets/js/marketing_full_data.js` resolves incorrectly from the generated route and can leave the resource archive stuck on its loading state.

During clean-route generation, normalize document-relative `src` and `href` values that target the local assets directory to root paths under `/assets/`. Keep authored source files unchanged. The conversion verifier must assert that both Content Creator clean routes load `marketing_full_data.js` from `/assets/` and contain no residual `../assets/` references.

## Edges

- supports [[tsk-conversion-ux-reversible-pass]] - preserves resource rendering on the public clean routes without changing the canonical source pages.
