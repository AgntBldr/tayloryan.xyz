---
id: tsk-archive-portfolio-csv
type: task
summary: Automate portfolio archiving via CSV crawling and PDF generation.
tags: [automation, playwright, csv]
domain: portfolio-agent-archiving
status: active
created: 2026-06-30
updated: 2026-06-30
visibility: namespace
part_of: ["[[pil-portfolio-agent]]", "[[prj-writing-archive]]"]
---

The goal is to archive a writing portfolio by crawling URLs listed in a CSV file. The process involves verifying if the URLs are live and capturing full-page screenshots as compressed PDFs. The input file is located at 'Ref Docs/Writing Port Taylor - Antigravity - Writing.csv', and the outputs are saved to 'Ref Docs/Archived_PDFs'. The main script used for this execution is 'execution/archive_articles.py'.
