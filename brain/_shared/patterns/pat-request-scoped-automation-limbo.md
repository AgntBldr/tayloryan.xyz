---
id: pat-request-scoped-automation-limbo
type: pattern
summary: Running long scrape/enrich/browser automation synchronously inside a single HTTP request (no queue/worker/watchdog) causes gateway timeouts and rows stuck forever in RUNNING/QUEUED.
tags: [automation, architecture, reliability, jobs, anti-pattern]
domain: discovery
shared: true
confidence: 0.9
verified_by: claude
verified_at: 2026-07-04
created: 2026-07-04
updated: 2026-07-14
visibility: public
related_to: ["[[prj-app-flow-stabilization]]"]
---

# Pattern — Request-scoped automation ends in limbo

ApplicationAgent runs every "run" — discovery search-plan execute, target enrichment, outreach
form-fill — synchronously inside one Next.js route handler (`export const dynamic="force-dynamic"`).
There is no job queue, cron, or background worker anywhere in `src`. Observed consequences:

- **Timeouts:** deep runs (search `maxResults` up to 500, per-source detail fetches up to 25 at
  `enrichmentDepth=deep`) execute in a single request behind per-call 20–30s fetch timeouts, risking
  HTTP/gateway timeout on the whole POST.
- **Stuck RUNNING:** if the process dies mid-run, `DiscoveryRun`/`ResearchRun` stay `RUNNING`
  (`execute-search-plan.ts:108`, `run-enrichment.ts:160`) — no watchdog resets them.
- **Stuck QUEUED:** `search-plan/route.ts:101` creates `DiscoveryRun(QUEUED)` that only advances on a
  separate `/execute` POST; forgotten plans sit QUEUED forever.
- **Leaked browsers:** in-request Playwright sessions are stored in a global `Map` and never closed.
- **False success:** a failed batch still returns HTTP 200 (`run-discovery.ts` catches per-source and
  continues), so a totally-failed run looks like a success to the caller.

**Reusable fix direction:** move long automation to a durable job model — a queued run record + a
worker/poller that claims it, executes with a heartbeat, and a watchdog that reaps stale `RUNNING`
rows after a timeout; reconcile on startup. Even a lightweight in-process queue + status heartbeat +
startup-reconcile beats request-scoped execution. Marked `shared: true`: applies to any scraping,
enrichment, or browser-automation project — promote to the shared layer deliberately, do not auto-sync.
