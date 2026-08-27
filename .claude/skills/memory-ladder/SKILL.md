---
name: memory-ladder
description: Organize agent memory as a four-layer ladder (router MEMORY.md, craft/domain sub-indexes, topic files, in-repo brain) with byte/line budgets and a failing gate - fixes the stale-single-file memory failure. Use when writing/recalling memory, when a memory file has grown stale or oversized, or to migrate a flat memory ("install the memory ladder", "migrate memory").
---

# The Memory Ladder - how persistent memory is organized

Fleet notes (V3-2ndBrain): Layer 3 below = the project's `brain/` (NAMING.md prefixes -
`dec-`/`pat-`/`ref-`/`fct-` etc. already match). The gate = the memory-review skill's
`memory-health.ps1` (extended 2026-08-27 with the ladder checks; exit 1 on gate
violations) - run that instead of writing a new script. In a non-fleet project, create
`scripts/memory-check` per the MAINTENANCE spec. Reference implementation: HypnoApp
(`scripts/maint/memory-check.cjs`, router + 11 sub-indexes + 427 topic files).

Your memory is NOT one file. It is a four-layer ladder. One long file meant to hold
everything fails in four ways, all proven: it blows the context budget every session, recall
degrades (you stop actually reading it), detail forks from its source file, and shipped
history masquerades as active work. The ladder fixes all four. Follow it for every capture
and every recall.

## The four layers

**Layer 0 - `MEMORY.md`, the ROUTER.** The only file loaded every session. It carries
exactly three kinds of line, and nothing else:
1. **Hard rules** - things that must fire BEFORE you know what the work is ("NEVER push to
   X", "always run Y first"). Never trimmed, never routed away.
2. **Active work** - one line per genuinely in-flight project, each a link to its topic
   file plus a hook.
3. **Routing tables** - one line per sub-index, phrased as a trigger:
   "OPEN BEFORE doing <activity>" / "OPEN when work touches <domain>".

Budget: warn at 12KB, act at 16KB; no line over ~600 characters. Acting means MOVING
detail down a layer - never deleting a hook, never trimming a link.

**Layer 1 - sub-indexes, on TWO AXES.** No size limit. One line per memory: a hook, the
trigger, and a link to the topic file.
- `INDEX-craft-<activity>.md` - lessons about HOW to work, grouped by activity (e.g.
  verification, git/sessions, writing specs, gates/tests, tooling, docs). These fire when
  you START a kind of work.
- `INDEX-<domain>.md` - facts about WHAT is true, grouped by domain (e.g. infra, design,
  billing, deployment). These fire when work TOUCHES a domain.
- `ARCHIVE.md` - fully-shipped history. Real, linkable, never loaded by default.

**Layer 2 - topic files.** One fact or lesson per file, kebab-case name, frontmatter:

```markdown
---
name: <short-kebab-slug>
description: <one-line summary used to decide relevance during recall>
metadata:
  type: user | feedback | project | reference
---

<the fact. For lessons: what happened, then **Why:** and **How to apply:** lines.
Link related memories with [[their-name]]. Use absolute dates, never "yesterday".>
```

**Layer 3 - the repo knowledge vault** (a `brain/` or `docs/decisions/` directory INSIDE
the project repo, committed to git). Knowledge that belongs to the project rather than to
you: decisions (`dec-`), playbooks/patterns (`pat-`), references (`ref-`), durable facts
(`fct-`). Anything a different agent or a human contributor should also see goes here, not
in your private memory.

## CAPTURE - the routing rule (the router does NOT grow by default)

When you learn something worth keeping, route it BEFORE writing:

- A lesson about HOW to work -> the matching `INDEX-craft-*.md` gets the pointer line; the
  body goes in a topic file.
- A fact about a DOMAIN -> the matching `INDEX-<domain>.md` + topic file.
- `MEMORY.md` gains a line ONLY for a new HARD RULE or a new ACTIVE-WORK item.
- When active work ships, MOVE its router line into a sub-index; fully-shipped history
  moves to `ARCHIVE.md`.
- Project-level knowledge a teammate needs -> Layer 3, in the repo, committed.

Discipline that keeps it healthy:
- **Update, don't duplicate.** Before writing, check for an existing file that covers it;
  extend that file. Delete memories that prove wrong - a wrong memory is worse than none.
- **Capture at the moment of learning**, not batched at session end (end-of-session
  batching loses exactly the sessions that crash or compact).
- **Don't store what the repo already records** (code structure, git history, README
  facts). Memory is for what is NOT derivable.
- A `[[wikilink]]` that resolves nowhere is allowed: it marks a lesson worth writing later.

## RECALL - triggers, not rereading

- The router is always in context; its hard rules apply before anything.
- At the start of a task, CLASSIFY the work (which activity? which domain?) and OPEN the
  matching sub-indexes BEFORE acting. That is what the "OPEN BEFORE X" phrasing is for.
- Scan index lines; open a topic file only when its hook fires. Never bulk-load topic files.
- Treat every memory as a point-in-time observation, not live state: if it names a file,
  flag, or number, verify against the current system before asserting it as fact.

## WRITING RULES - hooks, not summaries

- A router/index line is a TRIGGER plus a HOOK: enough to know WHEN to open the file and
  what it will save you - never the full story. The detail lives in the topic file.
- When a router line grows past ~600 chars, the fix is: patch the topic FILE so it carries
  every fact the line carries (the line may have drifted ahead of the file - this happens
  constantly), THEN cut the line back to its hook. File first, trim second, or you lose
  facts.
- Convert relative dates to absolute at write time.

## MAINTENANCE - the check that keeps it honest

Prose rules regress within days; only a gate holds. The gate script FAILS on:
1. router file over the byte budget (warn 12KB / fail 16KB),
2. router lines over ~600 chars,
3. index pointer links that resolve to no file (orphans),
4. two topic files with the same `name:`,
and WARNS on wikilinks that resolve nowhere. Run it before writing memory each session and
at every session close. Keep the memory directory as its own git repo (init one if needed)
and commit after each session's changes - git history IS the backup and the audit trail.
(In this fleet: `& .claude\skills\memory-review\scripts\memory-health.ps1` is the gate.)

## MIGRATING an existing oversized memory file

If a project currently has one long memory file:
1. Classify every line: hard rule / active work / how-to-work lesson / domain fact /
   shipped history.
2. Git-init the memory dir and commit the PRE-migration state first - zero fact-loss
   backstop.
3. Create the skeleton: `MEMORY.md` (router), 2-4 `INDEX-craft-*.md` by activity, 1-4
   `INDEX-<domain>.md` by domain, `ARCHIVE.md`. Don't over-split: start with few indexes
   and split one only when it outgrows a screen.
4. Move each line's DETAIL into a topic file (one fact per file), leave a one-line pointer
   in the right index, and keep only hard rules + active work + the routing tables in the
   router. Extract by content, never by line number.
5. Verify nothing was lost: every fact in the old file must be reachable from the new
   router by following at most two links. Count facts before and after; diff, don't trust.
6. Run the gate green, commit.

## The delivery ritual

Every delivery ends with: memory updated (via the routing rule) + lessons written + the
project's roadmap/plan file touched. Say that you did it. A session close additionally
re-runs the gate and commits the memory repo.
