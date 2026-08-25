# Operation Log

Append-only. One entry per operation: `## [YYYY-MM-DD] <op> | <title>`.

## [2026-06-29] init | vault created
Created 'brain' from secondbrain-template.

## [2026-06-30] populate | portfolio-agent: 56 nodes (GLM extract + Sonnet author)
Created root pillar pil-portfolio-agent. Created 3 project nodes (prj-writing-archive, prj-quest-portfolio, prj-teneo-website). Merged cpt-agent-orchestration-role into cpt-three-layer-architecture. Deleted 5 redundant/duplicate nodes (fct-static-first-nextjs-site, fct-duplicate-folders-identified, fct-outdated-headers-file, cpt-agent-orchestration-role, dec-test-limit-three-articles). Re-typed pbk-onboarding-flow as fact (Teneo website content). Wired all nodes to pillar and project anchors. Rewrote index.md as home-page MOC.

## [2026-06-30] qa | portfolio-agent: strategic + faithfulness quality gate
Reviewed all 61 nodes under 01-05. Verified frontmatter, prefixes, edges, summaries. Faithfulness spot-checked 8 nodes against directives/ and teneo-homepage-cursor-brief.md (hero, stats, 9 investors, copy rules, FAQ count, Get Started flow) -- all faithful, no hallucinations, no deletions for cause. Fixes: (1) pbk-onboarding-flow (prefix/type mismatch: id pbk- but type fact) renamed to fct-onboarding-flow and moved playbooks->content-homepage; (2) fct-data-output + fct-ui-dashboard-grid: restored truncated path 'quests.' -> 'quests.json'; (3) evt-archive-duplicate-folders: added required occurred_at 2026-01-27. Zero real dangling edges (pil-<business> exists only in README template prose). Pillar mission valid; portfolio_pillar 'apps' fits; index MOC reaches key nodes in <=2 clicks.

## [2026-07-13] audit | site link and cleanup dashboard
Created `execution/audit_site.mjs` and generated `audits/site-audit/dashboard.html` plus JSON results. Recorded `fct-site-audit-2026-07-13`, added approval task `tsk-review-site-audit-dashboard`, and corrected the canonical deploy path fact from the stale Desktop path to the current repo path.

## [2026-07-13] clarify | teneo folder and old drive access
User clarified that `DEPLOY_CLOUDFLARE/teneo-protocol.ai` is unrelated to the Taylor Ryan site and may be a copied folder. User also clarified the connected Google Drive account is not the old resource account, and inaccessible old-account files should be replaced, hidden, or re-shared from accessible copies rather than recovered.

## [2026-07-13] decision | use project brain not memtrace
User clarified they do not want Memtrace used for this project. Created `dec-use-project-brain-not-memtrace`; future project memory and continuity should use the repo-local `./brain` vault.

## [2026-07-13] fix | safe deploy and link pass
Fixed the Bless LinkedIn URL in source/deploy quest data, updated `deploy_sync.ps1` to derive paths from `$PSScriptRoot`, gated legacy `DEPLOY_CLOUDFLARE` sync behind `PORTFOLIO_SYNC_CLOUDFLARE_COPY=1`, refreshed the audit dashboard, and recorded canonical repo/deploy-sync/Teneo-folder facts.

## [2026-07-13] cleanup | archived stray Teneo copy
Moved `DEPLOY_CLOUDFLARE/teneo-protocol.ai` to `C:\Users\tempv2\PortfolioAgent_ExternalArchive\20260713-stray-teneo-protocol.ai` after user approval. Refreshed the audit dashboard; `DEPLOY_CLOUDFLARE` dropped from about 843 MB to about 113 MB.

## [2026-07-13] review | cleanup safety and memory readiness
Reviewed the archive cleanup and current deploy state. Live homepage/work/quest/resource routes returned 200, local deploy/script checks passed, the branch remained clean before memory writes, and reviewed memory wikilinks resolved. Added follow-up tasks for deploy-output mojibake and stale Teneo memory anchors before calling the brain fully tidy.

## [2026-07-13] cleanup | deployed material dedupe
Removed duplicate deployed material from `DEPLOY_CLOUDFLARE/` and `DEPLOY_PUBLIC/DEPLOY_PUBLIC/`, kept canonical `DEPLOY_PUBLIC/` plus root `functions/api/contact.js`, added canonical `/DEPLOY_PUBLIC/*` redirects, fixed deploy-output mojibake arrows, refreshed the audit dashboard, and recorded `evt-clean-deployed-material-2026-07-13`.

## [2026-07-13] report | Google links working vs not working
Generated `audits/site-audit/google-links-review.html`, `.csv`, and `.json` plus `execution/google_links_report.mjs`. Counts: 622 Google URLs total, 25 public-working/live, 517 auth-required/private, and 80 broken/missing.

## [2026-07-13] fix | Resend contact form and email privacy
Converted the contact page to a form-first flow, replaced public Klint email CTAs with `/contact/`, wired `functions/api/contact.js` for Resend via Cloudflare env vars, fixed missing Lucide LinkedIn icons, synced `DEPLOY_PUBLIC`, and recorded `dec-use-resend-contact-form`.

## [2026-07-13] deploy | merged PR #1 to main
Merged GitHub PR #1 into `main` with merge commit `f84dd13bbf0b25b78da0ce98eec0fbc279ff9403`. Recorded non-sensitive deployment memory for the Resend contact form and Cloudflare env-var configuration; secret values are intentionally not stored.

## [2026-07-13] report | resource preservation manifest
Generated `audits/site-audit/resource-preservation-manifest.html`, `.csv`, and `.json` plus `execution/resource_preservation_manifest.mjs`. Recorded the decision to use the manifest as the gate before removing or replacing Google resource links.

## [2026-07-13] resume | restored broken-link cleanup after power loss
Restored the background goal on `codex/broken-google-link-cleanup`, recorded an exact compact-ready task state, and confirmed Ollama is running with `qwen2.5:7b-instruct` and `bge-m3:latest`.

## [2026-07-13] decision | tiered model routing for site maintenance
Reserved 5.6 SOL for judgment-heavy work, assigned bounded review to cheaper frontier models, assigned bulk advisory work to local Ollama models, and kept deterministic scripts and browsers as the verification layer. Added the correct Taylor Ryan project anchor and archived stale Teneo routing.

## [2026-07-13] cleanup | selective broken Google link remediation
Retired only the 80 manifest-approved broken Google URLs, preserved all retired details in a cleanup ledger, kept 517 private/auth-required and all 39 Layer3 Google links, fixed one stale About skills route, and verified 0 broken Google plus 0 broken internal routes with browser QA.

## [2026-07-13] publish | broken Google cleanup PR #3
Committed the selective cleanup as `fa27c38`, pushed `codex/broken-google-link-cleanup`, opened https://github.com/AgntBldr/tayloryan.xyz/pull/3, and marked [[tsk-clean-broken-google-links]] done. Production remains unchanged pending merge.

## [2026-07-13] validate | Cloudflare preview passed for PR #3
Cloudflare Pages completed successfully for PR head `c4f4ae9`. The final follow-up commit changes only Second Brain memory, so deploy output remains the validated version.

## [2026-07-13] deploy | merged PR #3 and verified production
Merged PR #3 to `main` as `cdb5075f0f834804dcacd5c23ec6896ba59b97b2`; Cloudflare production passed and the custom domain retained 395/395 private URLs plus 39/39 Layer3 URLs with zero retired URLs. Recorded the brief custom-domain static-asset propagation lag, which resolved without a workaround.

## [2026-07-13] correct | fixed production route names in deployment memory
Replaced two shorthand 404 paths in the PR #3 deployment note with the verified `/contact/` and `/portfolio/marketing/case_studies/` routes. This corrected memory only; the application routes were already healthy.

## [2026-07-14] build | SEO, social preview, favicon, and product review
Centralized metadata generation in the canonical deploy sync, added social/favicons/crawler controls, reduced 22 high-use images by 80.3%, and produced an ICE-ranked product review. Local metadata, route, browser, privacy, and resource-preservation checks pass; [[tsk-seo-social-discovery-upgrade]] remains doing until production verification.
## [2026-07-14] verify | Removed noindex fragment from SEO sitemap
The Cloudflare preview crawl caught `/overview_blog_content/` in both the sitemap and noindex policy; removed it from the sitemap and added a verifier assertion against future overlap.

## [2026-07-14] deploy | SEO and social discovery release verified in production
Merged PR #6 as `ec160337`, passed Cloudflare deployment `ce446fff`, and verified 39/39 custom-domain routes, crawler assets, noindex headers, redirects, resource payloads, and contact-email privacy.

## [2026-08-06] update | refreshed Now page workflow and Teneo role
Updated the Now page to describe the current Claude Code and Codex workflow and made the Teneo Protocol role unambiguously historical. Recorded the current workflow and past-employment constraint as verified facts.

## [2026-08-06] update | corrected Telegram and GitHub profiles
Updated personal contact links across the homepage, About page, Now page, and deploy output. Recorded @AgntBld and github.com/agntBldr as user-verified canonical profiles.

## [2026-08-25] verify | production crawlability and Umami analytics
Verified all 39 sitemap URLs return 200 with canonical tags and no noindex conflicts; confirmed Umami Cloud loads on the production indexable surface and recorded the result in [[fct-production-crawlability-and-umami-analytics-2026-08-25]].

## [2026-08-25] decision | replace mismatched Umami with Cloudflare Web Analytics
Archived the earlier Umami coverage claim after the user showed the active dashboard property had zero sessions, removed the mismatched embed, allowed Cloudflare's beacon in CSP, and recorded [[dec-replace-umami-with-cloudflare-web-analytics]]. Dashboard activation and production deployment remain pending.

## [2026-08-25] deploy | Cloudflare Web Analytics verified in production
Linked the existing analytics site to the Pages project, merged PR #11 after preview verification, and confirmed production serves the Cloudflare beacon with no Umami embed. Recorded [[evt-cloudflare-web-analytics-production-2026-08-25]].
