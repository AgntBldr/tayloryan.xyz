---
id: dec-centralize-seo-metadata-in-deploy-sync
type: decision
summary: Store page discovery metadata in one manifest and inject it into DEPLOY_PUBLIC during every canonical deploy sync.
tags: [seo, metadata, deployment, cloudflare, single-source-of-truth]
domain: deployment
status: active
created: 2026-07-14
updated: 2026-07-14
visibility: namespace
confidence: 0.98
verified_at: 2026-07-14
verified_by: local deploy sync, deterministic verifier, and desktop/mobile browser QA
decided_on: 2026-07-14
decided_by: user and codex
alternatives: [hand-edit metadata in every source and deploy copy, inject metadata at runtime with JavaScript, maintain crawler files manually]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
supports: ["[[tsk-seo-social-discovery-upgrade]]"]
---

# Centralize SEO Metadata In Deploy Sync

Use `execution/seo_metadata.json` as the source of truth for page titles, descriptions, canonical routes, and indexability. `execution/apply_seo_metadata.mjs` runs at the end of `deploy_sync.ps1`, removes prior managed blocks, injects complete discovery/share metadata, copies canonical crawler assets, and regenerates the sitemap.

This avoids drift between root sources, direct `.html` deploy copies, and slash-route `index.html` copies. The generator fails when a headed deploy page lacks configuration, while `execution/verify_seo.mjs` checks tag counts, description bounds, sitemap membership, crawler controls, and assets. Raw overview fragments remain available but receive response-level noindex headers rather than being wrapped or changed in ways that could break consumers.

## Edges

- supports [[tsk-seo-social-discovery-upgrade]] - makes future metadata changes repeatable and testable.
- part_of [[prj-taylor-ryan-site-remediation]] - protects the canonical Cloudflare deploy from copy drift.
