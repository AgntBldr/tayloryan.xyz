---
name: vault-health
description: Run a trust-maintenance sweep on the V3 Second Brain - decay confidence on stale claim-nodes, flag triggered staleness conditions, and queue items for re-verification. Claim-types only. Use on a schedule or before relying on the vault.
---
# vault-health

Trust-maintenance sweep. Operates on **claim-types only** (fact, hypothesis, pattern, decision).

## Steps
1. **Staleness triggers:** for each claim-node with a `staleness` condition, judge whether it
   has plausibly triggered (time elapsed or the described condition); flag for re-verify.
2. **Confidence decay:** for claim-nodes not `verified_at` recently (e.g. > ~90 days), suggest
   stepping `confidence` down. Never auto-zero.
3. **Re-verify queue:** list flagged nodes with current `confidence`, `verified_at`, and reason.
4. **Summary:** counts by type, lowest-confidence claims, oldest verifications.
5. Append a `health` entry to `log.md`.

## Rules
- Do not touch non-claim types (concept/source/contact/etc).
- Decay is a prompt for human re-verification, not silent truth-editing.
