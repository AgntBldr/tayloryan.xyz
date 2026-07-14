---
id: pat-gaussian-timing-over-uniform
type: pattern
summary: Replace all random.uniform() delays with Gaussian/log-normal distributions; uniform distributions create fingerprint signatures that bots use.
tags: [automation, timing, behavioral-realism, anti-detection]
domain: automation/humanization
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
confidence: 0.85
verified_at: 2026-02-27
verified_by: HUMANIZATION_PLAN.md (LSTM analysis)
part_of: ["[[pil-linkedin-outreach]]"]
shared: true
---

## Pattern

LinkedIn uses LSTM neural networks to model action timing sequences. Uniform random delays (e.g., `random.uniform(5, 15)`) produce mathematically flat distributions that LSTM models easily classify as non-human. Real human delays follow Gaussian (normal) distribution with occasional outliers.

## Implementation Examples

**Inter-action gaps:**
- Profile visits: 8min ± 3min (Gaussian, range 3-20min)
- Connection requests: 25min ± 10min (Gaussian, range 10-55min)
- Messages: 18min ± 7min (Gaussian, range 8-40min)

**Keystroke delays:**
- Normal character: log-normal with base_delay ± 25%
- Space (word boundary): 1.5x base_delay (longer pause)
- Punctuation: 3x base_delay (sentence pause)

## Rationale

- Gaussian delays cluster around center with natural variance
- Log-normal distribution matches real typing cadence
- LSTM model cannot learn pattern from naturalistic data
- Different delay types (reading, clicking, typing) use appropriate distributions

## Edges

Extends [[pat-ai-message-generation-outperforms-templates]]; critical for LinkedIn automation safety per [[dec-patchright-over-playwright]]
