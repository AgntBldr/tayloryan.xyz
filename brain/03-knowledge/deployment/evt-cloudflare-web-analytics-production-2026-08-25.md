---
id: evt-cloudflare-web-analytics-production-2026-08-25
type: event
summary: Cloudflare Web Analytics replaced Umami on production taylorryan.xyz and was verified after the successful Pages deployment.
tags: [taylor-ryan, production, analytics, cloudflare, deployment]
domain: deployment
status: active
created: 2026-08-25
updated: 2026-08-25
visibility: namespace
occurred_at: 2026-08-25
participants: [user, codex]
derived_from: ["[[dec-replace-umami-with-cloudflare-web-analytics]]"]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
---

# Cloudflare Web Analytics Production Deployment

Cloudflare zone RUM was confirmed on, the existing `taylorryan.xyz` Web Analytics site was linked to the `tayloryan-xyz` Pages project, and PR #11 was merged after its Cloudflare preview passed. Production deployment `b5b5c918-97fa-4975-a59c-d4987be10256` completed successfully.

Production HTML was then verified to contain the Cloudflare beacon and configured token, omit the retired Umami script, and return a Content Security Policy that permits `https://static.cloudflareinsights.com`.
