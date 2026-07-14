---
id: pat-pipeline-architecture
type: pattern
summary: Deterministic-first pipeline (normalize -> extract -> route -> synth -> canonical -> score -> export) in @summarizer/core, shared by all surfaces.
tags: [pipeline, architecture, core, deterministic]
domain: architecture
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
confidence: 1.0
part_of: ["[[pil-summarizer-ores]]"]
related_to: ["[[prj-v1-core-pipeline]]", "[[cpt-enrichment-routes]]"]
shared: true
---

# Pipeline Architecture

The `@summarizer/core` package implements the full enrichment pipeline as pure business logic shared by all surfaces (desktop, extension, MCP).

## Stage order

```
RawInput
  -> normalize        (fan-out by MIME type; URL classification)
  -> deterministicEnrich  (page fetch, HTML meta extraction, provider-id parse)
  -> routeModel       (Low/Medium/High/Auto; see cpt-enrichment-routes)
  -> synthesize       (LLM fills only what deterministic steps left blank)
  -> applyCanonical   (override-wins: user edits lock the field)
  -> scoreConfidence  (3-tier badge: high/med/low + lock)
  -> export           (TSV or Markdown; confidence stripped from output)
  -> ResourceRow
```

## Key design rule

Deterministic steps run first and populate as many fields as possible. The model only sees fields that could not be resolved deterministically. This bounds hallucination surface and keeps output consistent.

## Pipeline entry points

- Top-level normalize: `packages/core/src/normalize/index.ts`
- Extraction contract: `packages/core/src/extract/index.ts`
- URL classification: `packages/core/src/extract/classifyUrl.ts`
- Routing: `packages/core/src/route/index.ts`
- Synthesis + override-wins merge: `packages/core/src/synth/index.ts`
- Canonical store: `packages/core/src/canonical/index.ts`
- TSV exporter: `packages/core/src/export/tsv.ts`
- Grouping: `packages/core/src/grouping/index.ts`
