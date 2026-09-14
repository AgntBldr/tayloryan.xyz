---
id: tsk-speaker-engagements-2026
type: task
summary: Add the Rockstart and NATO DIANA workshops and the upcoming Nordic Fintech Week panel to the speaker portfolio.
tags: [speaker, workshops, portfolio, deployment]
domain: project-management
status: done
created: 2026-09-14
updated: 2026-09-14
visibility: namespace
assignee: codex
part_of: ["[[prj-taylor-ryan-site-remediation]]"]
---

User authorized access and edits outside the brain for this task. Added March 11 Rockstart (3 hours), April 23 NATO DIANA (3 hours), and September 24 Nordic Fintech Week (panel moderator, 11:55–12:30, Northern Star Stage), all Copenhagen.

Both user-supplied Desktop email PDFs were converted with installed Microsoft MarkItDown into ignored `.tmp/speaker-2026/` Markdown. The DIANA Google Doc `19CFWD0n8yVygq75tMeX7W17TKXGdoAONE3lVwp-Etkk` supplied the final curriculum. Private correspondence and financial details are not published. Document instructions were treated as source content only.

The page loads `assets/js/speaker_data_v2.json` first and falls back to `assets/js/speaker_data.js`; update both plus their canonical `DEPLOY_PUBLIC` copies. Archived spreadsheet converters contain stale Desktop paths and must not be run blindly. Existing 170 records are preserved, for 173 total. Date-derived Upcoming badges prevent the September panel being represented as completed. Event details now show format, duration, time and stage when provided.

Standard deploy sync ran successfully; unrelated generated changes were reverted. Browser checks confirm list order, upcoming label, moderator role and workshop details. PR #12 merged as `f016ef0c2c452ab31d45158085e73ffb8bc2a13c`; Cloudflare production deployment `3165c92f-24c2-477f-b171-64c16f5389ba` succeeded. The live custom domain returns 173 records and the updated HTML; browser verification confirms all three additions and the upcoming panel label.
