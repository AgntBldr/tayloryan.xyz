---
id: dec-use-resend-contact-form
type: decision
summary: TaylorRyan.xyz should use a server-side Resend contact form instead of exposing a direct Klint address in the public UI.
tags: [contact-form, resend, cloudflare-pages, privacy, ux]
domain: deployment
status: active
created: 2026-07-13
updated: 2026-07-13
visibility: namespace
part_of: ["[[pil-portfolio-agent]]"]
depends_on: ["[[dec-use-deploy-public-folder]]"]
supports: ["[[evt-contact-form-resend-2026-07-13]]"]
---

# Use Resend Contact Form

TaylorRyan.xyz should not expose the direct Klint email address in deployed HTML, shared layout scripts, or tracked public source. The contact page and shared contact modal should submit to the Cloudflare Pages Function at `functions/api/contact.js`, and that function should send through Resend using environment variables.

Required Cloudflare Pages environment variables:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL` - a Resend-verified sender or domain
- `CONTACT_TO_EMAIL` - the private destination inbox

The frontend should only collect visitor name, reply email, topic, and message. The backend should return a clear unavailable response when Resend is not configured, rather than pretending a message was sent.

## Edges

- depends_on [[dec-use-deploy-public-folder]] - the active function must remain beside canonical `DEPLOY_PUBLIC/`.
- supports [[evt-contact-form-resend-2026-07-13]] - documents the implementation pass that removed public direct-email CTAs.
