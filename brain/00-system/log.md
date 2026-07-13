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
