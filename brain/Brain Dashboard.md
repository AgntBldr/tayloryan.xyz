---
tags: [dashboard]
created: 2026-06-29
---

# Brain Dashboard - this project

Typed-node views for this project's brain. Open this folder as its own Obsidian vault and the views scope to it. All brains are also browsable together in the BrainHub vault.

> [!info] Two ways to view this data
> - **Native Bases** (no plugin): open **`Nodes.base`** in this folder - works in Obsidian 1.9+.
> - **Dataview** (tables below): install the Dataview community plugin in THIS vault to render them
>   (Settings -> Community plugins -> Browse -> "Dataview" -> Install -> Enable).

## Decisions
```dataview
TABLE status, domain, summary, updated
FROM ""
WHERE type = "decision"
SORT updated DESC
```

## Tasks by status
```dataview
TABLE rows.file.link AS "Tasks", length(rows) AS "Count"
FROM ""
WHERE type = "task"
GROUP BY status
SORT status ASC
```

## Node counts by type
```dataview
TABLE length(rows) AS "Count"
FROM ""
WHERE type
GROUP BY type
SORT length(rows) DESC
```

## Recently updated (15)
```dataview
TABLE type, status, domain, updated
FROM ""
WHERE updated
SORT updated DESC
LIMIT 15
```

## Quality - nodes missing a summary
```dataview
TABLE type, status, domain, updated
FROM ""
WHERE type AND (!summary OR summary = "")
SORT file.mtime DESC
```