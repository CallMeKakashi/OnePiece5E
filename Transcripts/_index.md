---
publish: true
type: index
---

# Episode transcripts

Broadcast/recording units. Session numbers may not match episode numbers — align by title.

```dataview
LIST
FROM "Transcripts"
WHERE file.name != "_index"
SORT file.name ASC
```
