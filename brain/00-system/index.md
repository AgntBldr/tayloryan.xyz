---
display_name: Portfolio Agent
slug: portfolio-agent
portfolio_pillar: web-properties
status: active
repo: local-only
folder: PortfolioAgent
updated: 2026-06-30
---

# Portfolio Agent

An AI agent framework that builds and maintains portfolio deliverables across three workstreams: writing archive, Layer3 quest simulation, and the Teneo marketing website. It operates under a strict three-layer separation of directive/orchestration/execution to prevent error compounding.

## Status and Links

- **Status:** active
- **Portfolio pillar:** apps
- **Folder:** `C:\Users\tempv2\PortfolioAgent`
- **Agent instructions:** `GEMINI.md` (mirrored to `CLAUDE.md` and `AGENTS.md`)
- **Directives:** `directives/archive_portfolio.md`, `directives/quest_portfolio.md`
- **Execution scripts:** `execution/archive_articles.py`, `execution/scrape_quests.py`
- **Last updated:** 2026-06-30

## Mission

See [[pil-portfolio-agent]] -- the root pillar.

The system exists to make portfolio work reproducible and improvable. Any AI agent that reads `GEMINI.md` and the relevant directive can pick up a workstream cold. Errors strengthen the system via the self-annealing loop rather than silently degrading it.

## Active Projects

| Project | Status | Output |
|---|---|---|
| [[prj-writing-archive]] | active | PDFs in `Ref Docs/Archived_PDFs/` |
| [[prj-quest-portfolio]] | active | Next.js app at `quest_portfolio/` |
| [[prj-teneo-website]] | active | teneo-protocol.ai via Cloudflare Pages |

## Key Knowledge

### System-wide (the agent itself)

- [[cpt-three-layer-architecture]] -- the founding concept: directive/orchestration/execution separation
- [[fct-file-organization-structure]] -- `.tmp/` intermediates, `execution/` scripts, `directives/` SOPs
- [[pat-check-tools-first]] -- always inspect `execution/` before writing a new script
- [[pat-directive-maintenance]] -- directives are living documents; update them, do not discard
- [[pbk-self-annealing-loop]] -- fix / update tool / test / update directive

### Writing Archive

- [[fct-url-verification-logic]] -- skip PDF if non-200; mark CSV 'Dead'
- [[pat-playwright-pdf-capture]] -- scroll-to-bottom before capture; handle cookie popups
- [[fct-pdf-naming-convention]] -- first 7 words of title + " - Taylor [PDF].pdf"

### Quest Portfolio

- [[fct-scraper-playwright]] -- `execution/scrape_quests.py` extracts Layer3 quest data
- [[fct-manual-login-required]] -- user must complete 2FA; script cannot automate it
- [[dec-disable-verification]] -- verification logic is disabled; app simulates success only

### Teneo Website

- [[fct-project-tech-stack]] -- Next.js 15 / React 19 / TypeScript / Tailwind v4 / pnpm
- [[dec-use-deploy-public-folder]] -- canonical deploy target is `DEPLOY_PUBLIC/`; no other folders
- [[dec-use-existing-codebase-styles]] -- no new styles; pull design from existing codebase only
- [[dec-global-copy-rules]] -- sentence case; no em dashes; x402 lowercase; CLI/SDK uppercase
- [[pbk-standard-deployment-workflow]] -- make changes, build, commit/push, Cloudflare auto-deploys

## Sources

No formal `src-` nodes exist yet (no Tier-2 ingestion completed). Primary source material is:

- `GEMINI.md` -- master agent instructions
- `directives/archive_portfolio.md` -- writing archive SOP
- `directives/quest_portfolio.md` -- quest portfolio SOP
- `DEPLOY_FOLDER_REPORT.md` / `README_DEPLOY.md` -- deployment cleanup history

## Open Questions

1. Is the quest portfolio app scaffold complete? `quest_portfolio/data/quests.json` needs verification.
2. Are the 8 pre-launch flags in [[tsk-resolve-placeholder-flags]] resolved?
3. Should the writing archive be expanded beyond the 3-article test limit?
4. Does `execution/scrape_quests.py` need updating after Layer3 UI changes?
