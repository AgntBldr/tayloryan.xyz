---
id: pat-delegated-wave-build
type: pattern
summary: Build a whole project with cheap-model subagents by decomposing it into slices with STRICTLY DISJOINT file ownership, running independent slices as a parallel wave, gating the integration slice on the full suite, and landing each slice as its own commit — the orchestrator (frontier model) only scopes, wires trivia, and verifies. Proven on three ApplicationAgent projects; survives session-limit kills and battery death because work lands in slices.
tags: [orchestration, subagents, multi-agent, model-tiering, cost, delegation, worktree]
domain: process
status: active
created: 2026-07-13
updated: 2026-07-14
visibility: public
shared: true
confidence: 0.9
related_to: ["[[pil-cross-project-learning]]", "[[prj-answer-drafting]]", "[[tsk-ux-uplift-backlog]]", "[[fct-directory-field-coverage-profiling]]"]
---

# Delegated Wave Build (disjoint-ownership subagent waves)

The repeatable method used to ship the UX uplift backlog, the directory field-coverage
profiling engine, and Project 12 (answer drafting) — each a multi-file feature built almost
entirely by Sonnet/Haiku subagents while a frontier orchestrator stayed cheap.

## The method

1. **Scout first (read-only).** One Sonnet agent maps the foundation: schema, reusable
   patterns to copy, landmines, and a proposed slice list with per-slice file ownership and a
   haiku-vs-sonnet complexity tag. No writes. (P12: the scout found `AnswerVersion` versioning +
   review states already existed → v1 needed zero migrations.)
2. **Decompose into slices with STRICTLY DISJOINT file ownership.** Each slice owns a named set
   of files no other concurrent slice touches. Interfaces between slices are defined up front so
   parallel agents don't import each other's not-yet-existent code (define your own local input
   types; the integration slice adapts them). This is the load-bearing constraint — it is what
   makes parallelism safe in a shared worktree.
3. **Run independent slices as a parallel wave; sequence only true dependencies.** Wave A =
   leaf slices (context builder / generator / memory) in parallel. Wave B = the integration
   slice that wires them. Wave C = UI. Wave D = cross-cutting (cascade/guidance).
4. **Land each slice as its own commit** with explicit-path staging (`git add <paths>`, never
   `git add -A` in a shared worktree). This is why session-limit kills and a battery death cost
   zero committed work across these sessions — finished slices were already durable.
5. **Gate the integration slice on the FULL suite**; leaf slices gate on their own dir +
   eslint + tsc. The orchestrator runs a final full-suite pass on the merge-target tree before
   integrating.
6. **Orchestrator (frontier model) does only:** scoping/prompts, trivial wiring the agents
   can't coordinate, verification, git, and vault/memory. It writes almost no feature code.
   Model-tier rule: Haiku for mechanical pattern-copy slices, Sonnet for genuine design
   (context assembly, prompts, state machines, UI a11y), frontier orchestrates. (Operator
   feedback that forced this discipline: frontier credits burn too fast when the orchestrator
   writes code.)

## Why it holds

- Disjoint ownership → no merge conflicts between concurrent agents in one worktree.
- Slice-sized commits → crash-safe; resume killed agents via SendMessage (transcript intact)
  or just re-dispatch the unfinished slice.
- Copy-existing-patterns instruction → agents reproduce house idioms (draft-generator factory,
  MemoryRecord cube, structural DB doubles, adjust-during-render) instead of inventing.
- The best slices improve on the pattern they copy: P12's orchestrator slice fixed a latent
  status-restore gap in the `run-form-recon` pattern it was told to copy verbatim.

## Costs / caveats

- Live browser verification needs a dev server bound to the branch's worktree; the session
  Browser pane binds ONE worktree, so a second feature branch needs its own launch config
  (`npm --prefix <worktree> run dev -- --port 3001`) and a `.env` copy.
- Slice prompts must carry the current lint/dev landmines (react-hooks/set-state-in-effect →
  adjust-during-render; useToast-in-Suspense dev hang; Gemini flat-schema constraint) or agents
  reintroduce fixed bugs.

## Edges
- related_to [[pil-cross-project-learning]] — this is a generalizable build method
- related_to [[prj-answer-drafting]], [[tsk-ux-uplift-backlog]], [[fct-directory-field-coverage-profiling]] — the three proofs
