---
id: pat-provider-secret-safety
type: pattern
summary: Provider secret safety: Tech Stack saves write to the ignored server env file and return only key names (never values); production env-file writes are disabled unless APPLICATION_AGENT_ENABLE_PROVIDER_SECRET_WRITES=true; secret keys must not use NEXT_PUBLIC_ and env files must not be inside public/.next/out/build; hosted deployments need managed vault/platform secrets.
tags: [security, secrets, providers, deployment]
domain: providers
status: active
created: 2026-06-29
updated: 2026-07-14
visibility: public
shared: true
confidence: 0.85
related_to: ["[[fct-tech-stack-control-plane]]"]
tagged_with: ["[[pil-operator-trust]]"]
---

# Provider Secret Safety

Provider secret handling follows a strict safety pattern to prevent accidental exposure of credentials.

**Local saves:** When the Tech Stack control plane saves a provider secret locally, it writes to the server-side env file (which is git-ignored) and returns only the saved key names — never the values — to the caller.

**Production guard:** Production runtime env-file writes are disabled by default. They are only enabled when `APPLICATION_AGENT_ENABLE_PROVIDER_SECRET_WRITES=true` is explicitly set, which is appropriate only for trusted private deployments where the operator controls the runtime environment.

**Public deployments:** Hosted or public deployments must use a managed vault or platform secrets mechanism (e.g., Vercel environment variables, AWS Secrets Manager). Shared writable `.env` files are not safe for these contexts.

**Key naming constraints:** Secret keys must never use the `NEXT_PUBLIC_` prefix, which would expose them to the browser bundle. Provider env files must not be placed inside `public/`, `.next/`, `out/`, or `build/` directories, all of which may be served or published.

This pattern ensures secrets remain server-side and are never leaked through API responses, client bundles, or public static assets.

## Edges
- related_to [[fct-tech-stack-control-plane]] — the Tech Stack control plane is the component that enforces these save/read rules
- tagged_with [[pil-operator-trust]] — the production write flag is gated on operator trust level
