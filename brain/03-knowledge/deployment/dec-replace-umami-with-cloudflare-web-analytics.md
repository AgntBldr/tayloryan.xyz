---
id: dec-replace-umami-with-cloudflare-web-analytics
type: decision
summary: Retire the mismatched Umami embed and use Cloudflare Pages Web Analytics with automatic beacon injection for taylorryan.xyz.
tags: [taylor-ryan, analytics, umami, cloudflare, cloudflare-pages]
domain: deployment
status: active
created: 2026-08-25
updated: 2026-08-25
visibility: namespace
confidence: 1.0
verified_at: 2026-08-25
verified_by: User dashboard evidence and production/source inspection
decided_on: 2026-08-25
decided_by: user
alternatives: [correct the Umami website ID, run both providers]
contradicts: ["[[fct-production-crawlability-and-umami-analytics-2026-08-25]]"]
supports: ["[[prj-taylor-ryan-site-remediation]]"]
---

# Replace Umami With Cloudflare Web Analytics

The deployed Umami embed used website ID `d1945245-8106-4e31-90a5-3af43160122d`, while the user's active Umami dashboard was for property `d6874db0-3e79-442c-9511-fbfa7f3518d8` and reported zero sessions. Remove Umami from source and deploy HTML and prevent the deploy sync from restoring it.

Use Cloudflare Pages Web Analytics through the dashboard's automatic injection. The site Content Security Policy must allow `https://static.cloudflareinsights.com`. Activation is complete only after the Cloudflare Pages setting is enabled, a new deployment finishes, and production HTML contains the Cloudflare beacon.

## Edges

- contradicts [[fct-production-crawlability-and-umami-analytics-2026-08-25]] - an accessible script was not evidence that sessions reached the user's intended analytics property.
- supports [[prj-taylor-ryan-site-remediation]] - restores a measurable production surface with the hosting provider's native analytics.
