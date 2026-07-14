---
id: pat-pure-transition-logic
type: pattern
summary: Separate pure state transition logic from React hooks for testability and future backend migration.
tags: [testing, state-transitions, react-hooks, functional-programming, reducers]
domain: architecture
status: active
created: 2026-06-30
updated: 2026-07-14
visibility: public
part_of: ["[[pil-outreach-machine]]"]
supports: ["[[prj-approval-audit-spine]]"]
shared: true
---

# Pure State Transition Pattern

State transitions for approving, rejecting, and resetting jobs are implemented as pure functions. These functions take the current state and action parameters, then return a new state object without mutating the original. This pattern facilitates testing and predictability.

Key functions: `approveJobGateInState` and `rejectJobInState` handle logic and generate corresponding audit events.

Pure transition logic lives in a domain module (`src/domain/operatorState.ts`). The React hook (`useOperatorState`) wraps these functions. Pure functions accept `now` and `actor` options, allowing tests to assert specific audit event generation without relying on real-time system clocks or current user contexts. This separation also facilitates future backend migration.

## Edges

- supports: [[prj-approval-audit-spine]] -- the pure function pattern is the testable backbone of the audit spine
