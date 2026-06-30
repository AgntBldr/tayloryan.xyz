# Setup - Plugins & Agent Wiring

## Obsidian plugins
Settings -> Community plugins -> Browse, then install + enable:

1. **Templater** - set "Template folder location" to `_templates/`.
2. **Dataview** - enable; turn ON "Enable JavaScript Queries" (used by `index.md`).
3. **Breadcrumbs** - builds the typed graph from our edge fields (configure below).

### Breadcrumbs edge fields
Register each of the 10 edge types as a Breadcrumbs field that reads frontmatter:
`supports, contradicts, depends_on, derived_from, related_to, part_of, preceded_by,
followed_by, authored_by, tagged_with`

Set implied (inverse) relations so writing one direction shows both ways:
- `part_of` <-> `has_part`
- `preceded_by` <-> `followed_by`
- `depends_on` <-> `required_by`
- `derived_from` <-> `basis_for`
- `authored_by` <-> `authored`

(`supports`, `contradicts`, `related_to`, `tagged_with`: leave one-way or self-inverse.)

## Agent wiring
- **Claude Code:** open this vault folder as the project. `CLAUDE.md` points to the protocol.
- **Codex:** `00-system/AGENTS.md` is read natively. Same rules, no slash commands.

## Verify Phase 1
Open the **graph view** and a seed node (e.g. `dec-no-free-tier`): you should see it linked to
`pil-sustainable-margins`, `hyp-free-tier-virality`, and `src-stripe-pricing-analysis`, with
Breadcrumbs showing the typed relations and their inverses.
