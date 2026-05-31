---
publish: true
type: index
---

# Journals

In-character or between-session journal entries. Template: [[Journal Template]].

### By crew

- [[Gentle Giant Pirates/_index|Gentle Giant Pirates]]

```dataview
LIST
FROM "Journals"
WHERE file.name != "_index"
SORT file.folder ASC, file.name ASC
```
