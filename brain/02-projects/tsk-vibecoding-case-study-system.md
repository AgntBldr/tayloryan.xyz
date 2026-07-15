---
id: tsk-vibecoding-case-study-system
type: task
summary: Replace Vibecoding project modals with a private-source-safe index and permanent generated case-study pages for current and recent builds.
tags: [vibecoding, case-studies, generator, seo, responsive-design]
domain: project-management
status: doing
created: 2026-07-15
updated: 2026-07-15
visibility: namespace
assignee: codex
due:
effort: high
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
depends_on: ["[[dec-private-source-vibecoding-case-studies]]", "[[tsk-conversion-ux-reversible-pass]]"]
tagged_with: ["[[pil-portfolio-agent]]"]
---

# Vibecoding Case Study System

## Done Criteria

- The Vibecoding index contains no project modal and links every build to a permanent clean route.
- All eight existing projects receive case-study pages without losing their public demos.
- ApplicationAgent, HypnoApp, Resource Summarizer, Ecommerce Lead Intelligence, and Project Second Brain are added with portfolio-safe evidence.
- Private repositories remain private, and neither the private GitHub account nor the old account is exposed on public project surfaces.
- The existing Work side menu remains available on desktop and mobile.
- Project images stay compressed and all generated routes receive canonical, social, favicon, and sitemap metadata.
- Preservation, SEO, accessibility, route, desktop, and mobile checks pass before merge and production verification.

## Current State

The implementation is isolated on `codex/vibecoding-case-studies`, based on the accepted conversion branch. A validated 13-project manifest generates the filterable index plus thirteen source and deploy case-study routes. It also synchronizes per-project SEO records. Seven old `KlintMarketing` repository links were removed from the shared legacy project data; no private `AgntBldr` URL is rendered.

Actual interface screenshots for the four newest product builds and compressed covers for the existing projects are stored under `assets/images/vibecoding/`. Browser QA at `1440x900` and `390x844` confirms the filters, permanent navigation, loaded hero media, canonical route, responsive title fit, zero horizontal overflow, and preserved mobile Work drawer. The task remains doing until the branch is reviewed, merged, deployed, and verified on the production domain.

The final local gate is recorded in [[fct-vibecoding-release-gate-2026-07-15]]: 14/14 HTTP routes, 13/13 generated case studies, SEO across 72 HTML files and 52 sitemap URLs, zero accessibility issues across 74 source files, and the existing 18/18 conversion and preservation checks all pass.
