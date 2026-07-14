---
id: pat-loopback-local-model-canary
type: pattern
summary: Exercise all built-in Prompt schemas with synthetic title-only evidence against a loopback model provider before spending hosted model credits.
tags: [testing, local-models, ollama, prompt-quality, cost]
domain: testing/quality
status: active
confidence: 1.0
verified_at: 2026-07-14
verified_by: Codex uninterrupted eleven-Prompt run with qwen2.5:7b-instruct through Ollama
created: 2026-07-14
updated: 2026-07-14
visibility: public
part_of: ['[[pil-summarizer-ores]]']
supports: ['[[prj-v1-core-pipeline]]']
derived_from: ['[[cpt-enrichment-routes]]']
shared: true
---

# Loopback Local Model Canary

Run `pnpm local:canary` while the local Resource Summarizer API and one Ollama, LM Studio, or vLLM
runtime are available. The canary refuses non-loopback API and provider URLs, discovers a local
generation model, builds the real schema package, and sends synthetic title-only evidence through
all eleven built-in Prompts on Low. `LOCAL_CANARY_PROMPTS` accepts comma-separated built-in IDs for
faster targeted checks.

`pnpm local:canary:schema` is the provider-free companion gate used by CI after build. It verifies a
one-to-one mapping between built-in Prompt IDs and synthetic canary cases, rejects duplicate/stale
cases, and requires custom columns on every non-default Prompt. It never starts an API or model;
the full command remains a deliberate local quality run.

Title-only synthetic inputs avoid web crawling and hosted research costs. The canary rejects
invented URLs, incomplete configured columns, and missing Prompt-specific fields, and it never prints
optional local API or provider secrets. This is a real provider-quality gate, not a deterministic CI
replacement: keep CI fixtures provider-free and run the local canary before any paid live-provider
canary.

On 2026-07-14, one uninterrupted run passed Default resource table, Job Description, Movies
Collection, Events - Portfolio Speaker, Event Collection, Product Comparison, Book Library, Podcast
Episodes, Recipe Collection, Travel Research, and Research Paper Library against the current v0.1.51
API source. The run used `qwen2.5:7b-instruct` through Ollama and made no hosted-provider requests.
