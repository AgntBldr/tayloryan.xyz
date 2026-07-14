# Shared Core — Manifest

Index of nodes available to mount into business vaults.

## Playbooks
- [[pbk-launch-landing-page]] — plan, build, and ship a marketing landing page.
- [[pbk-agent-handoff]] - Structured handoff protocol for coding agents (Codex, Claude Code) to continue development with minimal context loss.

## Principles
- (none yet)

## Concepts
- (none yet)

## Patterns
- [[pat-sample-before-full-run]] - Always inspect samples and validate output before executing full-scale pipeline runs; include row counts and run reports in all outputs.
- [[pat-delegated-wave-build]] - Build a whole project with cheap-model subagents by decomposing it into slices with STRICTLY DISJOINT file ownership, running independent slices as a parallel wave, gating the integration slice on the full suite, and landing each slice as its own commit — the orchestrator (frontier model) only scopes, wires trivia, and verifies. Proven on three ApplicationAgent projects; survives session-limit kills and battery death because work lands in slices.
- [[pat-provider-secret-safety]] - Provider secret safety: Tech Stack saves write to the ignored server env file and return only key names (never values); production env-file writes are disabled unless APPLICATION_AGENT_ENABLE_PROVIDER_SECRET_WRITES=true; secret keys must not use NEXT_PUBLIC_ and env files must not be inside public/.next/out/build; hosted deployments need managed vault/platform secrets.
- [[pat-static-deploy-secret-safety-2026-07-13]] - When deploying a static site whose "public root" is the repo itself (Firebase Hosting public:"." or similar), the whole working dir ships unless excluded - and `**/.*` excludes dot-file/dir NAMES but NOT dot-directory CONTENTS, so `.git/` leaks the full private history. Always add `**/.*/**` + explicit `.git/**`, exclude secrets and internal dirs, and curl-verify post-deploy.
- [[pat-deterministic-first-paid-fallback]] - Multi-pathway enrichment: free local logic first, paid APIs only for unresolved rows, browser automation for targeted validation.
- [[pat-no-hallucination-extraction]] - Event fields must be null if not explicitly found in source HTML.
- [[pat-gaussian-timing-over-uniform]] - Replace all random.uniform() delays with Gaussian/log-normal distributions; uniform distributions create fingerprint signatures that bots use.
- [[pat-pipeline-architecture]] - Deterministic-first pipeline (normalize -> extract -> route -> synth -> canonical -> score -> export) in @summarizer/core, shared by all surfaces.
- [[pat-pure-transition-logic]] - Separate pure state transition logic from React hooks for testability and future backend migration.
- [[pat-request-scoped-automation-limbo]] - Running long scrape/enrich/browser automation synchronously inside a single HTTP request (no queue/worker/watchdog) causes gateway timeouts and rows stuck forever in RUNNING/QUEUED.
- [[pat-idempotent-ingestion]] - Scripts refuse to overwrite data without explicit force flag.
- [[pat-canonical-alias-strategy]] - Use canonical/alias field pairs to consolidate duplicates without breaking references; semantic duplicates stay separate pending review.
- [[pat-tiered-batch-generation]] - The cheap, cost-reported way to generate bulk content - adapt scripts/gen/lengthen-batch.cjs (GLM draft -> Sonnet review -> GLM revise on metered .env keys, off the Claude Code weekly limit; emits cost-report.json). NEVER use the Workflow tool (Anthropic-only subagents) for bulk. Ollama provider is a known gap.
- [[pat-loopback-local-model-canary]] - Exercise all built-in Prompt schemas with synthetic title-only evidence against a loopback model provider before spending hosted model credits.
- [[pat-proxy-all-provider-calls]] - All AI provider API calls are proxied through Next.js Route Handlers so keys never reach the browser.
- [[pat-error-handling-and-logging]] - Specific practices for exceptions and logging.
- [[pat-qa-findings-traceable-to-errors]] - QA findings are only actionable when each recommended fix is traceable to a concrete, observed error with row examples.
