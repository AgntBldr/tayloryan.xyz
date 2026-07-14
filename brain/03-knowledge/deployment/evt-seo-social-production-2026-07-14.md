---
id: evt-seo-social-production-2026-07-14
type: event
summary: PR #6 deployed the SEO and social discovery upgrade to taylorryan.xyz and passed custom-domain production verification.
tags: [deployment, cloudflare, seo, social-preview, production-verification]
domain: deployment
status: active
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
occurred_at: 2026-07-14T10:24:00+02:00
participants: [codex, cloudflare-pages]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
related_to: ["[[tsk-seo-social-discovery-upgrade]]", "[[fct-seo-social-local-verification-2026-07-14]]", "[[dec-centralize-seo-metadata-in-deploy-sync]]"]
---

# SEO And Social Discovery Production Release

PR `https://github.com/AgntBldr/tayloryan.xyz/pull/6` merged to `main` as `ec160337e4197eb1bc715a6e6d672ee1fa8a41aa`. Cloudflare preview `cd558c9f-fe18-4332-ba6d-4fbcbea297f6` and production deployment `ce446fff-2435-4b74-92c2-02d665cd6783` completed successfully.

The custom domain served 39/39 sitemap routes with complete metadata and zero route, asset, redirect, or crawler-policy failures. Four raw overview fragments were absent from the sitemap and returned noindex headers. Five resource-data payloads matched the committed deploy exactly after BOM normalization, and the public deploy contained no `Taylor@klintmarketing.com` match. The custom domain briefly served the prior artifact after the production check turned green, then converged without intervention.
