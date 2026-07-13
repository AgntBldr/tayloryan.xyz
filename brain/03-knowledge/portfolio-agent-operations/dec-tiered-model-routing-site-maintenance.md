---
id: dec-tiered-model-routing-site-maintenance
type: decision
summary: Route site-maintenance work by complexity, reserving 5.6 SOL for judgment-heavy synthesis and using cheaper frontier, local, and deterministic tools for bounded work.
tags: [agent-routing, cost-control, ollama, quality-gates, site-maintenance]
domain: portfolio-agent-operations
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
confidence: 0.95
verified_at: 2026-07-13
verified_by: user direction and local Ollama inventory
decided_on: 2026-07-13
decided_by: user and codex
alternatives: [use the highest-tier model for every step, use local models for all decisions, perform all review manually]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
supports: ["[[tsk-clean-broken-google-links]]"]
---

# Tiered Model Routing For Site Maintenance

Use the least expensive reliable worker for each bounded job, with explicit escalation and deterministic quality gates.

1. **5.6 SOL, lead/reviewer:** architecture, ambiguous remediation rules, preservation decisions, cross-file impact, UI/UX judgment, final diff review, and merge recommendation. It receives summaries and exceptions instead of raw repetitive link-check output.
2. **Lower-tier frontier models, bounded reviewers:** independently classify uncertain rows, review one file or report slice, compare generated diffs against written rules, and summarize anomalies. They do not merge, deploy, or make broad destructive edits.
3. **Local `qwen2.5:7b-instruct`, bulk assistant:** normalize titles, suggest groupings, deduplicate labels, and triage low-risk text records. Its output is advisory and must pass deterministic checks before use.
4. **Local `bge-m3`, retrieval helper:** match document titles and descriptions to offline artifact names when lexical matching is weak. Similarity is evidence for a review queue, never proof that two artifacts are identical.
5. **Deterministic scripts and headless browsers, execution layer:** extract URLs, probe HTTP/browser states with rate limits, generate manifests, apply exact approved transformations, and run regression checks. These tools are the source of record for counts and pass/fail status.

## Escalation Rules

Escalate to 5.6 SOL when workers disagree, a row could represent recoverable documentation, a proposed edit changes navigation or component behavior, or validation reveals a regression. Batch low-risk work and send only exceptions upward. Every destructive action remains isolated on a branch with a preservation ledger and reviewable commit.

## Local Capacity

At decision time Ollama was running with `qwen2.5:7b-instruct` and `bge-m3:latest` installed. Tier-2 LightRAG remains off; this project uses the markdown vault at `./brain` for durable memory.
