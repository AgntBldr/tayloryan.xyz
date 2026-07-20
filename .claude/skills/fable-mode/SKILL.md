---
name: fable-mode
description: Make any non-Fable model - including the session model itself after Fable's 2026-07-07 sunset - think and work with Fable-grade discipline via distilled operating scaffolds. Invoke at the start of substantive sessions ("run in fable mode"), and when delegating to lesser models (qwen, GLM, DeepSeek, Codex, Haiku).
---

# Fable Mode - Fable-grade discipline for whatever model is running

A skill file cannot transplant capability, but it CAN move a model's checkpoint: verify
before answering, trace causes before fixing, finish the turn, and hand off cleanly. This
skill packages that discipline at three sizes, distilled from Anthropic's Fable prompting
guidance and the nine-skills library (verified-done, root-cause-first, minimal-diff,
delegate-and-verify, finish-the-turn, lessons-ledger, outcome-first-writing, plain-handoff,
evidence-audited-analysis).

**Fable is unavailable after 2026-07-07.** This skill is the succession plan: the same
operating discipline, carried by whichever model sits in the chair.

## The three scaffolds - size the discipline to the model

| File | Lines | Audience |
|---|---|---|
| [operating-mode.md](operating-mode.md) | ~90 | **The session model itself** (Opus/Sonnet running Claude Code). Harness-aware: tool-verified evidence, act-don't-ask, failed-approach ledger, orchestration reflex, turn-end self-check. When this skill is invoked in a session, READ that file and follow it for the rest of the session. |
| [preamble-full.md](preamble-full.md) | ~80 | Capable tool-less delegates (Codex/gpt-5.5, GLM-4.6, DeepSeek, Sonnet, Haiku) doing analysis, debugging, authoring, or multi-step work. All nine skills + precedence ladder + output contract + self-check. |
| [preamble-min.md](preamble-min.md) | ~20 | Small local models (qwen 7B), quick mechanical tasks, any model that drowns in long instructions. The highest-payoff pair (verified-done + finish-the-turn) plus anti-fabrication and output-contract rules. |

Rule of thumb: **a 7B model cannot follow a 300-line scaffold.** Below ~14B or for tasks
under ~10 lines of instructions, use `min`. Use `full` when the delegate must make judgment
calls. `operating-mode` is only for a model driving the harness with tools.

To make a project adopt the discipline automatically (no invocation needed), add one line
to its `CLAUDE.md`:

```
At session start, read .claude/skills/fable-mode/operating-mode.md and follow it for all substantive work.
```

## How to apply

**Via the orchestrate skill (preferred):** `delegate.ps1` prepends these automatically -
`-Discipline min` (default) or `-Discipline full`. See the `orchestrate` skill.

**Manually, for any prompt to any model:** paste the preamble, then a task spec in this
shape (only Goal and Output format are mandatory; skip fields that don't apply):

```
Context
- Goal: <what to produce and why it matters>
- Success criteria: <how the output will be judged / verified>
- Constraints: <scope limits, style, what NOT to do>
- Inputs provided: <files, data, excerpts that follow>
- Output format: <exact shape: JSON schema, markdown sections, diff, etc.>

Task
<the actual instructions>
```

**For Claude subagents (Agent tool / Workflow):** prepend the preamble text to the agent
prompt. It composes with any agentType.

## What the orchestrating (Fable) session must still do

The preamble raises the floor; it does not remove the need for checking. Always:
1. Give the delegate a **verifiable output contract** (schema, test to pass, exact sections) -
   discipline without a checkable target is theater.
2. **Verify against the contract**, not by vibes: run the test, validate the JSON, diff the
   files. The delegate labeling something `UNVERIFIED` is a signal to check, not to trust.
3. On failure, return the delegate's own output with a one-line diagnosis - don't rewrite
   the task from scratch (that wastes the tokens already spent).

## Tuning

Both preambles are plain markdown - edit them in place; every future delegation picks up the
change. Keep `min` under ~25 lines no matter what you add. If you add a tenth rule to
`full`, delete a weaker one: discipline dilutes as it grows.
