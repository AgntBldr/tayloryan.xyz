---
id: pat-qa-findings-traceable-to-errors
type: pattern
summary: QA findings are only actionable when each recommended fix is traceable to a concrete, observed error with row examples.
tags: [qa, findings, traceability, data-ops]
domain: validation
status: active
confidence: 0.9
support_count: 1
verified_at: 2026-06-30
created: 2026-06-30
updated: 2026-07-14
visibility: public
part_of: ["[[pil-mxney]]"]
derived_from: ["[[src-qa-reviewer-agent-prompt]]"]
supports: ["[[dec-no-rule-change-without-record]]"]
shared: true
---

# Pattern: QA Findings Must Be Traceable to Observed Errors

The QA Reviewer acceptance criteria specify two interlinked requirements:

1. **Findings include concrete row examples** - abstract observations without specific rows are not valid findings.
2. **Recommended fixes are traceable to observed errors** - a fix cannot be recommended unless there is a documented error instance that motivates it.

This forms a pattern: the review loop is evidence-in -> finding-with-example -> traceable-fix. Any QA output that breaks this chain (e.g., a rule change motivated by intuition rather than observed rows) is inadmissible.

**Operational implication:** QA Reviewer output reports should be structured as: error class -> example rows -> root cause -> recommended rule change. This structure makes findings reviewable and reversible.

## Edges

`supports` [[dec-no-rule-change-without-record]] - traceability of fixes is the mechanism that makes the no-silent-change decision enforceable.
