---
id: fct-manual-login-required
type: fact
summary: The scraping process requires manual user login for 2FA.
tags: [auth, 2fa, manual-step]
domain: pil-portfolio-agent-scraper
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
confidence: 1.0
part_of: ["[[pil-portfolio-agent]]", "[[prj-quest-portfolio]]"]
---

The `scrape_quests.py` script opens a browser window but cannot automate the login process completely. The user must manually enter credentials (Taylor@klintmarketing.com) and complete the 2FA challenge before the script proceeds to navigate and scrape data.
