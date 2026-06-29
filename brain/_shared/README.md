# Shared Core

Opt-in universal knowledge shared across all your business vaults — the things you want
*everywhere*: reusable `playbook`s, operating `principle`s, and generic `concept`s.

## How it works
- This folder is the single source of truth for shared nodes.
- A business vault **mounts** it at `_shared/` (the `new-brain` bootstrap does this — copy by
  default, or symlink / git-submodule for a live link).
- Agents consult `_shared/` alongside the local graph; you may link to shared nodes
  (e.g. a project `derived_from: ["[[pbk-launch-landing-page]]"]`).
- **Sharing is deliberate:** a node is shared only if it lives here. Business-specific
  knowledge stays in its own vault.

## Layout
- `playbooks/` — reusable SOPs
- `principles/` — cross-business operating principles (pillar-like)
- `concepts/` — reusable definitions
- `_manifest.md` — index of what's shared

Use the same node schema as a business vault (`00-system/schema.md`). Mark shared nodes
`visibility: public` and `shared: true`.
