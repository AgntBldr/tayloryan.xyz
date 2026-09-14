---
id: tsk-contact-form-sender-repair
type: task
summary: Repair the contact form's rejected Resend sender and verify production delivery.
tags: [contact-form, resend, dns, cloudflare]
domain: project-management
status: done
created: 2026-09-14
updated: 2026-09-14
visibility: namespace
assignee: codex
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
depends_on: ["[[dec-use-resend-contact-form]]"]
---

The user's production test returned the generic send failure. Resend log `6c65f2c7-95d7-458f-8e9a-fc3d6dd03851` proves the API request reached Resend and failed with HTTP 403 because the configured sender used an unverified public mailbox domain. The account had no verified domains. The function and visitor reply-to handling are already correct; this is a provider configuration failure.

Created the dedicated sending domain `contact.taylorryan.xyz` in Resend's Ireland region. Added only its DKIM TXT and the `send.contact` SPF TXT and feedback MX records in Cloudflare; existing four DNS records remain. Receiving is disabled. Public DNS resolves the new records. Updated only the production `CONTACT_FROM_EMAIL` secret with Wrangler; the recipient and API key are preserved, and preview remains unconfigured.

Completed: Resend reports the domain verified. Production deployment for commit `1f888fa` succeeded and activated the corrected sender. A labeled test submitted through the live contact page succeeded (form reset); Resend email `9cdf908c-9744-4921-a5af-99ce3f484112` reports **delivered**. No application-code change was needed. Do not record private recipient addresses, secret values or message content in the repository.


Follow-up: the user requested a persistent green confirmation with a calendar invitation. The shared contact handler now retains the success message and a booking link to `https://bookme.name/TaylorRyan`, resets fields immediately, and leaves the modal open so visitors can read the confirmation. The button returns to its normal state after 1.8 seconds. Source and deployed script copies match; JavaScript syntax checked.
