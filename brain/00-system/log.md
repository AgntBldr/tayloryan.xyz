# Operation Log

Append-only. One entry per operation: `## [YYYY-MM-DD] <op> | <title>`.

## [2026-06-29] init | vault created
Created 'brain' from secondbrain-template.

## [2026-06-30] populate | portfolio-agent: 56 nodes (GLM extract + Sonnet author)
Created root pillar pil-portfolio-agent. Created 3 project nodes (prj-writing-archive, prj-quest-portfolio, prj-teneo-website). Merged cpt-agent-orchestration-role into cpt-three-layer-architecture. Deleted 5 redundant/duplicate nodes (fct-static-first-nextjs-site, fct-duplicate-folders-identified, fct-outdated-headers-file, cpt-agent-orchestration-role, dec-test-limit-three-articles). Re-typed pbk-onboarding-flow as fact (Teneo website content). Wired all nodes to pillar and project anchors. Rewrote index.md as home-page MOC.

## [2026-06-30] qa | portfolio-agent: strategic + faithfulness quality gate
Reviewed all 61 nodes under 01-05. Verified frontmatter, prefixes, edges, summaries. Faithfulness spot-checked 8 nodes against directives/ and teneo-homepage-cursor-brief.md (hero, stats, 9 investors, copy rules, FAQ count, Get Started flow) -- all faithful, no hallucinations, no deletions for cause. Fixes: (1) pbk-onboarding-flow (prefix/type mismatch: id pbk- but type fact) renamed to fct-onboarding-flow and moved playbooks->content-homepage; (2) fct-data-output + fct-ui-dashboard-grid: restored truncated path 'quests.' -> 'quests.json'; (3) evt-archive-duplicate-folders: added required occurred_at 2026-01-27. Zero real dangling edges (pil-<business> exists only in README template prose). Pillar mission valid; portfolio_pillar 'apps' fits; index MOC reaches key nodes in <=2 clicks.
