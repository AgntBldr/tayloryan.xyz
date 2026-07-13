---
id: fct-cloudflare-custom-domain-propagation-lag-2026-07-13
type: fact
summary: A successful Cloudflare Pages deployment can reach its immutable preview before the custom domain serves every updated static asset.
tags: [cloudflare, deployment, cache, verification]
domain: deployment
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
confidence: 1.0
verified_at: 2026-07-13
verified_by: Codex production HTTP probes and immutable-deployment comparison
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
derived_from: ["[[evt-pr3-merged-production-2026-07-13]]"]
---

# Cloudflare Custom-Domain Propagation Lag

After PR #3 deployed successfully, Cloudflare's immutable deployment URL served the current `marketing_full_data.js` while `taylorryan.xyz` briefly served the previous version. The custom domain converged without a code or cache-busting workaround; a later request returned the expected content and ETag.

For future production checks, compare the immutable deployment URL with the custom domain when a newly deployed static asset appears stale. Recheck the custom domain after propagation before changing application code or adding cache workarounds. Use content assertions and ETags rather than relying only on the deployment check's success state.

## Edges

- derived_from [[evt-pr3-merged-production-2026-07-13]] - observed during the production verification for the merged cleanup.
- part_of [[prj-taylor-ryan-site-remediation]] - applies to this site's Cloudflare release process.
