---
name: orchestrate
description: Token-lean build orchestration - Fable plans and verifies, cheap/$0 lanes execute (Codex CLI on the ChatGPT subscription, local qwen via Ollama, GLM/DeepSeek via HTTP router, Haiku/Sonnet subagents). Use when the user asks to build/populate/migrate something "cheaply", "token-lean", "via codex/qwen/glm", or invokes /orchestrate.
---

# Orchestrate - Fable architects, cheap lanes execute

The expensive failure mode is Fable typing out bulk work token-by-token. The fix: **Fable's
output is decisions** - specs, routing, diffs-review, verdicts - while execution goes to
lanes that cost nothing marginal. This encodes the proven population-pipeline policy
(cheap models GENERATE, top model VERIFIES) as a general build discipline.

"Fable" throughout means *the orchestrating session's model*: Fable itself until its
2026-07-07 sunset, thereafter Opus/Sonnet running the fable-mode operating discipline -
read [../fable-mode/operating-mode.md](../fable-mode/operating-mode.md) at the start of any
orchestrated build. The doctrine does not change when the top model does.

## The lanes

| Lane | What it is | Cost | Route here |
|---|---|---|---|
| `codex` | Codex CLI headless (`codex exec`), gpt-5.5. A real agent: edits files, runs commands, iterates inside `-WorkDir`. | $0 (ChatGPT subscription quota) | Multi-file implementation, refactors, test writing, debugging with reproduction - anything "agentic coding in a repo" |
| `qwen` | qwen2.5:7b-instruct on local Ollama | $0, offline | Triage, classification, summarization, mechanical transforms, boilerplate JSON - high volume, low judgment |
| `glm` / `openrouter` / `deepseek` | HTTP chat completions via bundled router (ordered fallback) | ~$0 (z.ai/OpenRouter/DeepSeek keys) | Bulk text/JSON generation, extraction, doc drafting - too hard for qwen, no repo access needed |
| `sonnet` | Anthropic API via router | paid | Escalation tier when the free lanes fail validation twice |
| Haiku/Sonnet **subagents** | Agent tool with `model: haiku`/`sonnet` (or Workflow `model`/`effort` opts) | session billing | Work needing harness tools (Read/Grep/Edit here), parallel fan-out, or context from this session |
| **Fable (this window)** | the session model (Fable -> Opus/Sonnet after 2026-07-07) in fable-mode | premium | Decompose, write specs, route, review diffs/samples, adjudicate, integrate. **Never bulk execution.** |

Check availability first: `& .claude\skills\orchestrate\scripts\delegate.ps1 -Health`

## The loop

0. **Set the bar (Fable, before anything is written).** Name the thing the finished work has to
   beat: a real artifact *we did not make*, which a critic can fetch and stand side by side with
   ours. The acceptance test in step 1 is necessary and never sufficient - it is a bar we grade
   ourselves, so a green one proves the code does what we predicted, not what the work needed to
   do. Skip step 0 only where there is no outside referent (a rename, a codemod, a type fix).
   [`../gauntlet-loop/SKILL.md`](../gauntlet-loop/SKILL.md) has the three tests a bar must pass -
   **named, fetchable, comparable** - and the prompt that runs the loop.

1. **Plan (Fable).** Decompose into work units. For each: lane, spec, and a *checkable*
   acceptance test (schema, test command, exact sections). A unit without a checkable
   contract is not ready to delegate.
2. **Execute (lanes).** Fire independent units in parallel (background Bash calls for
   codex/router lanes; one message of Agent calls for subagents). Codex runs >2 min are
   normal - use `run_in_background`.
3. **Verify (cheap first, Fable last).**
   - Deterministic: run the tests, validate the JSON, build the project. Free and brutal.
   - Fable reviews the *diff or a sample*, never the whole artifact, against the spec.
   - For critical or fabrication-prone output, add one adversarial second lens (another
     lane, or a fresh subagent told to refute) - this caught real GLM fabrications in the
     population runs.
   - **Against the bar, blind.** A critic with *fresh context* fetches the reference itself,
     puts it next to ours with the labels stripped, and answers one binary question: which is
     better, and what is the single biggest remaining gap. Never a score out of ten - scores
     drift upward every round. The critic must not have seen the build, or it grades effort.
4. **Fix loop.** Return failures to the SAME lane with the delegate's own output plus a
   one-line diagnosis. Two failures on the same unit -> escalate one tier
   (qwen -> glm -> codex/sonnet -> Fable does it). Never retry a failed prompt verbatim.
5. **Integrate + report (Fable).** State what was built, what was verified and how, what
   remains `UNVERIFIED`, and tokens/quota spent by lane.

**Exit condition.** The loop ends when the blind comparison picks ours, or when the operator
stops it. Not when the suite goes green - a suite is our own prediction of the work, and it
passes hardest on the surface that was never broken. Never after a fixed round count.

## Driving the lanes

All lanes go through [scripts/delegate.ps1](scripts/delegate.ps1). It prepends fable-mode
discipline (`-Discipline min` default | `full` | `none`), feeds prompts via stdin/temp file
(no quoting or length limits), and prints the final message between `===DELEGATE-RESULT===`
markers. Write specs >10 lines to a file and use `-TaskFile`.

```powershell
# agentic coding in a repo (writes files!) - background it if large
& .claude\skills\orchestrate\scripts\delegate.ps1 -Lane codex -TaskFile spec.md `
    -WorkDir C:\SomeProject -Sandbox workspace-write -Effort high -OutFile report.md

# read-only analysis/review of a repo by codex
& .claude\skills\orchestrate\scripts\delegate.ps1 -Lane codex -Task 'Map the auth flow; cite files.' -WorkDir C:\SomeProject

# bulk JSON from the free HTTP tier, validated shape
& .claude\skills\orchestrate\scripts\delegate.ps1 -Lane glm -TaskFile extract.md -Json -MaxTokens 12000 -Discipline full

# high-volume mechanical work, local + free
& .claude\skills\orchestrate\scripts\delegate.ps1 -Lane qwen -Task 'Classify each line as A/B/C: ...' -Json
```

**Never let a build lane run the full test suite.** It is the single biggest consumer of a
lane's wall clock, and it is wasted: the orchestrator re-runs `tsc` and the full suite itself
before merging, because a lane can never be its own final gate (see
`../fable-mode/operating-mode.md`). Every build spec should say *"run ONLY the test files you
touched; the orchestrator owns tsc + the full suite."* A W62 lane burned its entire 30-minute
window mostly on a suite run whose result was discarded, and was killed before it could report.

Codex notes: `-Sandbox read-only` is the default - pass `workspace-write` deliberately, and
prefer pointing it at a branch/worktree so its diff is reviewable with `git diff`.
`-Effort low` for mechanical tasks saves subscription quota; `xhigh` only for genuinely hard
debugging. `--output-schema` support: pass `-SchemaFile shape.json` to force a JSON shape.

## Token economics (Fable-side rules)

- **Specs, not implementations.** A 30-line spec that a lane turns into 500 lines of code is
  the whole point. If you catch yourself writing the artifact, stop and write the spec.
- **Review diffs and samples, not files.** `git diff` after a codex run; spot-check 2-3 items
  per 50 from bulk lanes (the population QA sampling pattern).
- **Batch small items** into one delegated call (classify 100 lines in one qwen call, not 100 calls).
- **Don't re-read what you wrote.** You have the spec; verify against it, don't re-derive it.
- Route by judgment density, not difficulty: high-volume/low-judgment -> qwen/glm;
  low-volume/high-judgment -> Fable; agentic-in-a-repo -> codex.

## Portability

Self-contained: this folder + `../fable-mode` (discipline preambles; embedded fallback if
absent). Install into any project with the repo-root installer:

```powershell
& C:\Users\tempv2\V3-2ndBrain\install-skills.ps1 -Target C:\SomeProject
```

Provider keys/endpoints live in [scripts/model-router.ps1](scripts/model-router.ps1)
(bundled copy; canonical source `population/model-router.ps1` - update both). Keys are read
from local .env files at call time, never logged.
