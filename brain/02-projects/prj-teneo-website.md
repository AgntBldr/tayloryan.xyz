---
id: prj-teneo-website
type: project
summary: Build and maintain the teneo-protocol.ai marketing site as a static Next.js 15 app deployed via Cloudflare Pages, using the existing codebase visual identity.
tags: [nextjs, cloudflare, teneo, marketing-site, static-site]
domain: pil-portfolio-agent-frontend
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
owner: agent
outcome: "Deployed site at teneo-protocol.ai via Cloudflare Pages from DEPLOY_PUBLIC/"
part_of: ["[[pil-portfolio-agent]]"]
---

# Teneo Website Project

## Scope

Rebuild and extend the `teneo-protocol.ai` marketing site. Source of truth lives at `C:\Users\tempv2\Desktop\V2TeneoWebsite`. Deployment repo contains `DEPLOY_PUBLIC/` which Cloudflare Pages builds from. Changes are synced via `deploy_sync.ps1` (robocopy mirror excluding node_modules, .next, .git).

## Tech Stack

Next.js 15 (App Router) / React 19 / TypeScript / Tailwind CSS v4 / Framer Motion / Lenis / Lottie-web / pnpm. See [[fct-project-tech-stack]].

## Architecture and Conventions

- [[cpt-three-layer-architecture]] -- overall agent operating model
- [[pat-page-component-structure]] -- each route has a dedicated `src/components/pages/<name>/` component
- [[pat-atomic-design-primitives]] -- primitives live in `src/components/atoms/`
- [[fct-shared-layout-components]] -- SiteHeader, SiteFooter, NavDropdown in `src/components/layout/`
- [[pat-content-driven-pages]] -- content defined in `src/content/navigation.ts` and `pages.ts`
- [[fct-path-alias-configuration]] -- `@/*` maps to project root
- [[fct-nextjs-app-router-structure]] -- all routes under `app/`; dynamic blog under `app/blog/<slug>/`
- [[fct-tailwind-v4-design-tokens]] -- tokens in `app/globals.css` via `@theme`
- [[fct-animation-libraries]] -- Framer Motion + Lottie-web + Lenis

## Deployment

- [[dec-use-deploy-public-folder]] -- canonical deploy target is `DEPLOY_PUBLIC/`; no other folders
- [[fct-deployment-validation-success]] -- validation confirmed single deploy folder, `_headers` 800B, functions present
- [[pbk-standard-deployment-workflow]] -- make changes, build, commit/push, Cloudflare auto-deploys
- [[pbk-run-sync-script-before-push]] -- run `./deploy_sync.ps1` before pushing
- [[pbk-sync-deploy-copy]] -- robocopy sync command from source of truth

## Design Rules

- [[dec-use-existing-codebase-styles]] -- no new styles invented; pull from existing codebase only
- [[dec-use-placeholder-assets]] -- all images/icons are placeholders; real assets dropped in separately
- [[dec-global-copy-rules]] -- sentence case headings; no em dashes; x402 lowercase; CLI/SDK uppercase
- [[dec-build-section-by-section]] -- build one section at a time, confirm before proceeding

## Open Items (pre-launch)

- [[tsk-resolve-placeholder-flags]] -- 8 flags to resolve before go-live

## Edges

`part_of` [[pil-portfolio-agent]] -- one of three core workstreams.
`related_to` [[evt-archive-duplicate-folders]] -- cleanup event that stabilized deployment config.
