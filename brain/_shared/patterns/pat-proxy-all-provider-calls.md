---
id: pat-proxy-all-provider-calls
type: pattern
summary: All AI provider API calls are proxied through Next.js Route Handlers so keys never reach the browser.
tags: [architecture, security, cors, api, pattern]
domain: vidgen-architecture
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
confidence: 1.0
verified_at: 2026-06-30
verified_by: HANDOFF.md sections 3, 9
part_of: ["[[pil-vidgen]]"]
derived_from: ["[[src-handoff-md]]"]
supports: ["[[dec-api-key-security]]"]
shared: true
---

The architecture enforces a strict rule: the browser never communicates directly with any AI provider (Google, Runway, Luma, Pika, Kling). Every provider call is proxied through a Next.js Route Handler under `src/app/api/`:

- POST /api/frame - Nano Banana frame composition.
- POST /api/video - submit a Veo or provider job.
- GET /api/video/[id] - poll job status.
- GET /api/assets/[id] - stream cached MP4.

This has two benefits:
1. Security: API keys live in `.env.local` (dev) or encrypted SQLite (prod). They are injected server-side in `keys.ts` and never returned to the client in any response.
2. CORS: Third-party provider domains do not need to allowlist the user's localhost origin because the browser only talks to `localhost:3000/api/*`.

Implementation note: keys must never appear in server logs. The `keys.ts` module strips them before any logging.

## Edges

`part_of [[pil-vidgen]]` - security and CORS boundary pattern spanning the entire app.
`derived_from [[src-handoff-md]]` - specification source.
`supports [[dec-api-key-security]]` - this pattern is how the API key security decision is implemented.
`related_to [[pat-job-runner-abstraction]]` - the proxy routes delegate polling logic to the JobRunner.
