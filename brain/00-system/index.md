# Index

Routing overview of the vault. Requires the **Dataview** plugin.

## Counts by type
```dataview
TABLE length(rows) AS Count
FROM ""
WHERE type
GROUP BY type
SORT length(rows) DESC
```

## Recently updated
```dataview
TABLE type, summary, updated
FROM ""
WHERE type AND file.name != "index"
SORT updated DESC
LIMIT 20
```

## Open questions
```dataview
TABLE summary, status
FROM ""
WHERE type = "question" AND status != "resolved"
```

## Low-confidence / decaying claims
```dataview
TABLE type, confidence, staleness
FROM ""
WHERE confidence AND confidence < 0.6
SORT confidence ASC
```

## Notes to graduate
```dataview
LIST summary
FROM "99-inbox"
WHERE type = "note"
```
