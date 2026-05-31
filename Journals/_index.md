---
publish: true
type: index
---

# Journals

In-character or between-session journal entries.

Only notes with `publish: true` appear on the public wiki.

```dataview
LIST
FROM "Journals"
WHERE file.name != "_index"
SORT file.name ASC
```
