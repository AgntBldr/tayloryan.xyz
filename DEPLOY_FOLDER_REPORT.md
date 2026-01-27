# Deployment Folder Report

## 1. Resolved Configuration
* **Git Repo Root**: `C:\Users\tempv2\Desktop\PortfolioAgent`
* **Canonical Deploy Folder**: `C:\Users\tempv2\Desktop\PortfolioAgent\DEPLOY_PUBLIC`
* **Functions Folder**: `C:\Users\tempv2\Desktop\PortfolioAgent\functions`

## 2. Duplicate Candidates Found
The following folders were identified as potential duplicates or incorrect deploy targets:
1. `C:\Users\tempv2\Desktop\PortfolioAgent\DEPLOY_CLOUDFLARE`
2. `C:\Users\tempv2\Desktop\PortfolioAgent\DEPLOY_CLOUDFLARE\DEPLOY_PUBLIC`
3. `C:\Users\tempv2\Desktop\PortfolioAgent\DEPLOY_CLOUDFLARE\tayloryan.xyz\DEPLOY_PUBLIC`

## 3. Comparison Findings
I compared the contents of the duplicates against the Canonical Deploy Folder.

### Comparison: `DEPLOY_CLOUDFLARE\DEPLOY_PUBLIC` vs Canonical
* **Difference Found**: `_headers` file size.
    * Canonical: 800 bytes
    * Duplicate: 639 bytes
* **Conclusion**: The duplicate contains an outdated version of the `_headers` file. The canonical folder is more recent.

### Comparison: `DEPLOY_CLOUDFLARE\tayloryan.xyz\DEPLOY_PUBLIC` vs Canonical
* **Difference Found**: None observed in critical file sizes.
    * `_headers`: 800 bytes (Matches Canonical)
* **Conclusion**: This appears to be a redundant copy, likely a nested clone or backup.

## 4. Action Plan Executed
1. **Archived**: `C:\Users\tempv2\Desktop\PortfolioAgent\DEPLOY_CLOUDFLARE` has been moved to `C:\Users\tempv2\Desktop\PortfolioAgent\__ARCHIVE_NOT_USED_FOR_DEPLOY__`.
2. **Backups Created**: A timestamped copy was saved to `C:\Users\tempv2\Desktop\PortfolioAgent\__BACKUP_DUPLICATES__\20260127_0955`.
3. **Guardrails**: `README_DEPLOY.md` created; `.gitignore` updated.

## 5. Final Validation
* [x] **Single Deploy Folder**: Only `DEPLOY_PUBLIC` exists in the repo root.
* [x] **Functions**: `functions/api/contact.js` confirmed present.
* [x] **Critical Files**: `DEPLOY_PUBLIC/_headers` (800 bytes) and `_redirects` confirmed present.
* [x] **Git Cleanliness**: Archive and Backup folders are git-ignored.

