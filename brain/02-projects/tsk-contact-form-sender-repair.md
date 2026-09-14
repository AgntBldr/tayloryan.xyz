---
id: tsk-contact-form-sender-repair
type: task
summary: Repair the contact form's rejected Resend sender and verify production delivery.
tags: [contact-form, resend, dns, cloudflare]
domain: project-management
status: doing
created: 2026-09-14
updated: 2026-09-14
visibility: namespace
assignee: codex
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
depends_on: ["[[dec-use-resend-contact-form]]"]
---

The user's production test returned the generic send failure. Resend log `6c65f2c7-95d7-458f-8e9a-fc3d6dd03851` proves the API request reached Resend and failed with HTTP 403 because the configured sender used an unverified public mailbox domain. The account had no verified domains. The function and visitor reply-to handling are already correct; this is a provider configuration failure.

Created the dedicated sending domain `contact.taylorryan.xyz` in Resend's Ireland region. Added only its DKIM TXT and the `send.contact` SPF TXT and feedback MX records in Cloudflare; existing four DNS records remain. Receiving is disabled. Public DNS resolves the new records. Updated only the production `CONTACT_FROM_EMAIL` secret with Wrangler; the recipient and API key are preserved, and preview remains unconfigured.

Pending: Resend domain verification, redeploy to activate the new sender, one labeled live form test, and provider delivery confirmation. Do not record private recipient addresses, secret values or message content in the repository.
