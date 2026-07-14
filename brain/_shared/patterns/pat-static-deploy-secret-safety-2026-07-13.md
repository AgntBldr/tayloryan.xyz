---
id: pat-static-deploy-secret-safety-2026-07-13
type: pattern
summary: When deploying a static site whose "public root" is the repo itself (Firebase Hosting public:"." or similar), the whole working dir ships unless excluded - and `**/.*` excludes dot-file/dir NAMES but NOT dot-directory CONTENTS, so `.git/` leaks the full private history. Always add `**/.*/**` + explicit `.git/**`, exclude secrets and internal dirs, and curl-verify post-deploy.
tags: [infra, deploy, firebase-hosting, security, secrets, cloudflare-pages, gotcha]
domain: infra
status: active
created: 2026-07-13
updated: 2026-07-14
visibility: public
part_of: ["[[prj-crypto-data-pipeline]]"]
related_to: ["[[tsk-decommission-legacy-serving-2026-07-13]]", "[[fct-live-serving-chain-2026-07-12]]"]
shared: true
---

# Static-deploy secret-safety pattern

Deploying with the repo root as the public directory (Firebase Hosting `"public": "."`,
and the same risk for any tool that uploads a folder) ships **everything not ignored** to the
public web. Two footguns bit us on 2026-07-13:

1. **`service-account.json` (a private key) would have been published** - the default ignore list
   (`firebase.json`, `**/.*`, `**/node_modules/**`) does not cover it. It's 404 today only because
   the prior deploy was stale.
2. **`**/.*` matched the `.git` dir NAME but not its nested files**, so the first deploy published
   the entire `.git/` (71,607 files - `/.git/config`, `/.git/HEAD`, `/.git/objects/**` all 200).
   That exposes the full private repo + history. (No credential leaked here only because history
   was clean - verified `service-account.json`/`.env`/`credentials`/`token` had 0 commits ever.)

## The rule
- Prefer a **dedicated build/public subdir** over `"public": "."` when you can.
- If you must ship the repo root, the ignore list MUST include, at minimum:
  `**/.*`, **`**/.*/**`**, **`.git/**`**, `.firebase/**`, the secret files
  (`service-account.json`, `*Access key*.json`, `*-firebase-adminsdk-*.json`), and every internal
  dir (`brain/**`, `docs/**`, `scripts/**`, `execution/**`, `workers/**`, backups, `*.zip`, …).
- **Verify with a real request after every deploy**, not just the config:
  `curl -s -o /dev/null -w "%{http_code}" https://<site>/.git/config` (and `/service-account.json`)
  MUST return **404**.
- Cloudflare Pages avoids this by design: you point `wrangler pages deploy <dir>` at a clean staging
  dir, so only what you copy in ships (we staged 29 files, 248KB - 4 HTMLs + assets/**).

Cross-agent note: if a deploy's file count is wildly higher than the site's real file count, STOP -
something unignored is shipping.
