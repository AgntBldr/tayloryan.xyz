---
id: prj-writing-archive
type: project
summary: Automate archiving of a writing portfolio by verifying URLs from a CSV and capturing full-page PDFs via Playwright.
tags: [automation, playwright, csv, pdf, archiving]
domain: portfolio-agent-archiving
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
owner: agent
outcome: "Archived PDFs in Ref Docs/Archived_PDFs; CSV updated with live/PDF status"
part_of: ["[[pil-portfolio-agent]]"]
derived_from: ["[[pbk-self-annealing-loop]]"]
---

# Writing Archive Project

## Scope

Process the CSV at `Ref Docs/Writing Port Taylor - Antigravity - Writing.csv`. For each entry: verify the URL is live (HTTP 200), capture a full-page PDF via Playwright, name it using the first 7 words of the article title, and update the CSV. Testing is limited to 3 articles at a time.

## Current State

Active. The main execution script is `execution/archive_articles.py`. Directive lives at `directives/archive_portfolio.md`.

## Key Decisions and Facts

- [[dec-limit-scrape-to-three]] -- cap at 3 during test runs (applies to both archive and quest workstreams)
- [[fct-url-verification-logic]] -- skip PDF if URL returns non-200
- [[fct-pdf-naming-convention]] -- `<first-7-words> - Taylor [PDF].pdf`
- [[pat-playwright-pdf-capture]] -- scroll-to-bottom before capture to trigger lazy load
- [[tsk-archive-portfolio-csv]] -- the tracked task for this workstream

## Edges

`part_of` [[pil-portfolio-agent]] -- one of three core workstreams.
