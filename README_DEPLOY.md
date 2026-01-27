# Deployment Instructions

**Canonical Deploy Folder**: `DEPLOY_PUBLIC/`
**Functions Folder**: `functions/`

> [!IMPORTANT]
> **Do not create any other deployment folders.**
> Cloudflare Pages is configured to build specificially from `DEPLOY_PUBLIC`.
> Any other folders (e.g. `DEPLOY_CLOUDFLARE`, `tayloryan.xyz`) will be ignored or cause confusion.

## Workflow
1. Make changes to source files.
2. Run build scripts (if applicable) to update `DEPLOY_PUBLIC`.
3. Commit and push changes to GitHub.
4. Cloudflare Pages detects the push and deploys from `DEPLOY_PUBLIC`.

## Archives
Old or duplicate folders have been moved to `__ARCHIVE_NOT_USED_FOR_DEPLOY__`.
Do not mistakenly use these for deployment.
