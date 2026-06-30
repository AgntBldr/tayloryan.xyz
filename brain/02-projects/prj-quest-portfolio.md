---
id: prj-quest-portfolio
type: project
summary: Scrape Layer3.xyz quest content and display it in a Next.js simulation app as a portfolio piece demonstrating web development capability.
tags: [nextjs, scraping, playwright, portfolio, layer3]
domain: pil-portfolio-agent
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
owner: agent
outcome: "Next.js app at quest_portfolio/ with quests.json database and downloaded assets"
part_of: ["[[pil-portfolio-agent]]"]
---

# Quest Portfolio Project

## Scope

Build a web-based portfolio item that simulates the Layer3.xyz quest experience. The project has three steps: scrape quest content (limit 3), build the Next.js app with a dashboard grid and step-by-step simulation, verify UX and content match.

## Current State

Active. Directive at `directives/quest_portfolio.md`. Execution script at `execution/scrape_quests.py`. App scaffold and data not yet confirmed complete.

## Key Decisions and Facts

- [[fct-scraper-playwright]] -- Python/Playwright script navigates Layer3 and extracts quest data
- [[fct-manual-login-required]] -- user must manually complete 2FA; script cannot automate it
- [[dec-limit-scrape-to-three]] -- scrape only first 3 CSV entries
- [[fct-data-output]] -- extracted data saved to `quest_portfolio/data/quests.json`
- [[dec-use-nextjs]] -- Next.js chosen as the web framework
- [[fct-ui-dashboard-grid]] -- main view is a grid of quests populated from CSV + JSON
- [[dec-disable-verification]] -- actual Layer3 verification logic disabled; app simulates success
- [[tsk-build-quest-portfolio]] -- the tracked task for this workstream

## Input

CSV: `Ref Docs/Quest/Quests - Taylor - Antigravity - Quests.csv`
Layer3 credentials: Taylor@klintmarketing.com (2FA required)

## Edges

`part_of` [[pil-portfolio-agent]] -- one of three core workstreams.
