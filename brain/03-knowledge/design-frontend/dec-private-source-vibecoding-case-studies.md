---
id: dec-private-source-vibecoding-case-studies
type: decision
summary: Present vibecoding work through permanent, manifest-generated case studies while keeping source repositories private and removing old-account GitHub links.
tags: [vibecoding, case-studies, privacy, portfolio, content-model]
domain: design-frontend
status: active
created: 2026-07-15
updated: 2026-07-15
visibility: namespace
confidence: 0.99
verified_at: 2026-07-15
verified_by: user direction, private-repository inventory, generated-route validation, and desktop/mobile browser QA
decided_on: 2026-07-15
decided_by: user and codex
alternatives: [keep modal-only project details, publish private repositories, link to the old GitHub account, show private projects as context-free cards]
supports: ["[[tsk-vibecoding-case-study-system]]"]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
tagged_with: ["[[pil-portfolio-agent]]"]
---

# Private-Source Vibecoding Case Studies

Replace the Vibecoding page's modal-only presentation with permanent project routes generated from `execution/vibecoding_projects.json`. Each project record carries the problem, response, workflow, decisions, proof points, stack, privacy boundary, metadata, and compressed visual evidence needed for a credible portfolio page. The index links directly to those routes and retains the existing Work side menu.

Repository access is not part of the public proof model. Private `AgntBldr` repositories remain private, and old `KlintMarketing` GitHub links are removed from the legacy project dataset. A public demo may be linked when one already exists, but a repository URL is never required. Case studies show product judgment, architecture, observable interfaces, and verified aggregate metrics without publishing credentials, private datasets, source code, or inaccessible internal documents.

Future projects should be added through the manifest and generator, not by adding another modal. A new record must include a compressed local image, explicit privacy language, and SEO-safe descriptive fields. The generator rejects either private-account or old-account GitHub URLs in public project data.

## Edges

- supports [[tsk-vibecoding-case-study-system]] - defines the public/private boundary and the permanent-page content model.
