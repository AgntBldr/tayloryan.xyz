---
id: pat-tiered-batch-generation
type: pattern
summary: The cheap, cost-reported way to generate bulk content - adapt scripts/gen/lengthen-batch.cjs (GLM draft -> Sonnet review -> GLM revise on metered .env keys, off the Claude Code weekly limit; emits cost-report.json). NEVER use the Workflow tool (Anthropic-only subagents) for bulk. Ollama provider is a known gap.
tags: [generation, tiered, cost, glm, ollama, openrouter, batch, runbook, cost-report]
domain: hypnoapp/infra
status: active
created: 2026-06-30
updated: 2026-07-14
confidence: 0.95
verified_at: 2026-06-30
verified_by: read scripts/gen/lengthen-batch.cjs + tiers.cjs (this repo); used in prod for the 50-journey x4-tier lengthening
part_of: ["[[pil-hypnoapp]]"]
relates_to: ["[[ref-gen-harness]]", "[[dec-model-cost-routing]]"]
visibility: public
shared: true
---

# Tiered batch generation (the cost-reported rail)

The correct rail for bulk content generation in this repo. Use/adapt it for any new generative
project instead of the Workflow tool (whose agents are Anthropic-only and bill the weekly limit).

## What exists
- `scripts/gen/lengthen-batch.cjs` - the working batch driver. Flow per (item, tier):
  **draft = GLM-4.6** (`providers/glm.cjs`) -> **review = Claude Sonnet** (`providers/anthropic.cjs`,
  metered ANTHROPIC_API_KEY) -> **revise = GLM** (up to MAX_REVISE). Runs entirely on `.env` keys
  (`GLM_API_KEY` + `ANTHROPIC_API_KEY`) via `loadEnv.cjs`, so it NEVER touches the Claude Code
  weekly subscription limit. Concurrency 2 (GLM has a low concurrent cap). Resume via per-task
  `.ok` files. A deterministic `localIssues()` gate runs ALONGSIDE the LLM review (the LLM misses
  things) - reuse this idea: the real safety gate is deterministic, the LLM is one drafter.
- **Cost reporting is built in.** It records `prompt_tokens`/`completion_tokens` per model and writes
  `<outDir>/cost-report.json` + prints a `=== COST (estimate) ===` table: per-model tokens, ~USD, and
  wall-clock minutes. Pricing comes from `scripts/gen/tiers.cjs` (planning estimates; GLM 0.6/2.2,
  Sonnet 3/15, Opus 15/75, Haiku 1/5, local $0 per Mtok in/out).
- Providers: `providers/glm.cjs` (z.ai, OpenAI-compatible), `providers/anthropic.cjs`,
  `providers/openrouter.cjs`. Each `call*` returns `{ text, model, usage }`.

## Known gap (fill before "use Ollama")
There is **no `providers/ollama.cjs`** yet. To use the installed local Ollama models (truly $0,
no weekly limit, no API cost), add `scripts/gen/providers/ollama.cjs` (POST to
`http://localhost:11434/api/chat`, return `{text, model, usage}` with token counts from the
response's `prompt_eval_count`/`eval_count`) and an `ollama` tier in `tiers.cjs` (in/out USD 0).
Then route drafting Ollama-first, GLM as the paid fallback, Anthropic for sparing review only.

## How to adapt for a NEW generative project
1. Copy lengthen-batch.cjs to a project-specific driver (or generalize it): swap the seed loader,
   the TIERS, the draft/review/revise prompts, and the deterministic gate to the new content's
   rules. Keep the provider calls, the `record()/usage` accounting, the cost-report writer, the
   `.ok` resume, and `mapLimit` concurrency.
2. Drafting tier order: Ollama (once the provider exists) -> GLM -> OpenRouter. Review = Sonnet,
   sparingly. Opus only for a final high-stakes pass.
3. The deterministic apply step (validate gate -> upsert JSON) stays a separate $0 node script
   (e.g. apply-shorts.cjs for shorts).

## Reporting (REQUIRED - see [[dec-model-cost-routing]])
After each batch, report to the user: per-provider tokens + estimated USD (from cost-report.json),
the Claude Code subscription vs metered-API split, and local (Ollama = $0, report tokens + wall-clock
time). Lead with the headline total and the wall-clock.

## Anti-pattern (what went wrong 2026-06-30)
Daily Shorts (52 concepts) were generated with the **Workflow tool + Anthropic Sonnet/Opus
subagents** (~3M tokens on the subscription/weekly limit). That bypassed this rail entirely - no GLM,
no metered keys, no cost report, Opus for review. Don't repeat it. See [[dec-model-cost-routing]].

## Edges
- part_of [[pil-hypnoapp]]; implements [[dec-model-cost-routing]]; extends [[ref-gen-harness]]
