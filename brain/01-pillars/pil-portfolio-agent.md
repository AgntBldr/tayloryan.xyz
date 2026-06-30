---
id: pil-portfolio-agent
type: pillar
summary: An AI agent operating under a 3-layer architecture (directive/orchestration/execution) to build and maintain portfolio deliverables including writing archives, quest simulations, and web properties.
tags: [agent, portfolio, automation, orchestration, three-layer]
domain: portfolio-agent-architecture
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
---

# Portfolio Agent

## Goal / Reason to Exist

Portfolio Agent is a personal AI-driven workflow system whose standing purpose is to build, maintain, and present portfolio deliverables across multiple workstreams. It is not a one-shot tool; it is a continuously improved system that uses structured SOPs (directives) and deterministic Python scripts (execution layer) to prevent the error compounding that occurs when a probabilistic LLM does everything manually.

The three workstreams currently served are:

1. **Writing Archive** -- crawling a CSV of published articles, verifying URLs, and capturing full-page PDFs as durable evidence of published work.
2. **Quest Portfolio** -- scraping Layer3.xyz quest data and re-presenting it in a polished Next.js simulation for portfolio demonstration.
3. **Teneo Website** -- building and maintaining the `teneo-protocol.ai` marketing site (static Next.js, deployed via Cloudflare Pages).

## Why This Architecture Works

LLMs are probabilistic. Most business logic is deterministic. Mixing the two inline compounds errors: 90% accuracy per step yields 59% success over 5 steps. The fix is to push complexity into deterministic code and reserve the AI layer for routing and decision-making only. Directives are living SOPs; execution scripts are the reliable, testable tools; the agent is the glue.

## Success Criteria

- All directive workstreams can be re-run by any AI agent that reads `GEMINI.md` and the relevant `directives/` file.
- Errors are self-annealed: the agent fixes, tests, and updates the directive before moving on.
- Portfolio deliverables (PDFs, quest app, website) exist in accessible, durable locations.
- No local intermediate files are treated as final deliverables; cloud or deployed outputs are the record.

## Edges

Pillar anchor for this brain. All project and knowledge nodes ultimately `part_of` this node.
