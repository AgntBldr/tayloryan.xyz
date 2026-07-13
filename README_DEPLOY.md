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

## Deployment Protocol (Standardized)
**ALWAYS run the sync script before pushing changes.**
This ensures assets are synced and `work.html` is correctly transformed for sub-directory routing.
```powershell
./deploy_sync.ps1
```

## Contact Form
The contact form submits to the Cloudflare Pages Function at `functions/api/contact.js` and sends email through Resend.
Set these Cloudflare Pages environment variables before relying on the form in production:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL` - must be a Resend-verified sender/domain
- `CONTACT_TO_EMAIL` - private destination inbox, not exposed in frontend HTML

## Archives
Old or duplicate folders have been moved to `__ARCHIVE_NOT_USED_FOR_DEPLOY__`.
Do not mistakenly use these for deployment.

