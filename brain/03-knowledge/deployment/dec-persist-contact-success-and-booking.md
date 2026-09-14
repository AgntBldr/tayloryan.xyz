---
id: dec-persist-contact-success-and-booking
type: decision
summary: Keep green contact success feedback visible and offer Taylor's booking calendar after submission.
tags: [contact-form, conversion, booking, ux]
domain: deployment
status: active
created: 2026-09-14
updated: 2026-09-14
visibility: namespace
decided_on: 2026-09-14
decided_by: user
alternatives: [Automatically clear feedback and close the modal after 1.8 seconds]
derived_from: ["[[tsk-contact-form-sender-repair]]"]
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
---

The user explicitly requested that the green sent message remain and encourage a calendar booking. The shared handler retains success feedback and adds: "Want to talk sooner? Book a meeting with me via my calendar." The booking link points to `https://bookme.name/TaylorRyan`.

Reset fields immediately after success; restore the send button after 1.8 seconds, but do not clear the confirmation or automatically close the modal. A new submission resets status. This gives visitors time to read confirmation and follow the calendar link. Keep source and `DEPLOY_PUBLIC` script copies aligned.

Commit `b5a4128` passed JavaScript syntax validation, deployed successfully through Cloudflare Pages, and the custom domain served the updated handler. Delivery itself was independently confirmed before this presentation-only change.
