---
id: fct-contact-delivery-verified-2026-09-14
type: fact
summary: Production contact delivery was restored by verifying a dedicated Resend sender domain and deploying the corrected sender secret.
tags: [contact-form, resend, dns, verification]
domain: deployment
status: active
created: 2026-09-14
updated: 2026-09-14
visibility: namespace
confidence: 1.0
verified_at: 2026-09-14
verified_by: live form submission and Resend delivered status
derived_from: ["[[tsk-contact-form-sender-repair]]"]
supports: ["[[dec-use-resend-contact-form]]"]
---

Resend rejected the original sender with HTTP 403 because its domain was not verified. The presence of all three environment variables did not establish a working mail configuration. The fix verified `contact.taylorryan.xyz` using DKIM TXT, SPF TXT and feedback MX records, updated only the production sender secret, and redeployed.

Public DNS resolving correctly preceded Resend verification; an immediate test during that interval still returned 403. Wait for provider verification before concluding the repair failed. The subsequent live form test produced Resend email `9cdf908c-9744-4921-a5af-99ce3f484112` with status **delivered**.

Learning: diagnose generic frontend failures through provider logs; distinguish configured secrets, verified sender, successful API acceptance, and confirmed delivery. Preserve the visitor as reply-to. Never commit credentials or private recipient addresses.
