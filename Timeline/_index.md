# Timeline

In-world chronology for Blood & Brine. Dates use the One Piece calendar (flexible precision: year, moon, sun).

**Canon status:** `draft` until reviewed. Sources link to [[Discord/exports/world-lore|world-lore export]] and other vault notes.

## Newspapers

In-fiction press (`type: newspaper`). Sorted by filename sort key.

### 1477

```dataview
TABLE in_world_label, publication, status
FROM "Timeline/1477"
WHERE type = "newspaper"
SORT file.name ASC
```

### 1478

```dataview
TABLE in_world_label, publication, status
FROM "Timeline/1478"
WHERE type = "newspaper"
SORT file.name ASC
```

### Undated

```dataview
TABLE in_world_label, publication, status
FROM "Timeline/Undated"
WHERE type = "newspaper"
SORT file.name ASC
```

## 1477

All timeline entries in 1477.

```dataview
LIST
FROM "Timeline/1477"
SORT file.name ASC
```

## 1476

All timeline entries in 1476.

```dataview
LIST
FROM "Timeline/1476"
SORT file.name ASC
```

## 1478

All timeline entries in 1478 (events, newspapers, backstory).

```dataview
LIST
FROM "Timeline/1478"
SORT file.name ASC
```

## Undated

Entries without a pinned in-world start date. **Table play order** (episode/recording order) follows `related_events` chains and [[Dates#Session ↔ Episode (Campaign 2 play order)|Session ↔ Episode]] — not filename sort alone.

### Campaign 2 play order (table)

2 → 3 → 4 → 5 → 6 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 (P1+P2) → 21 → 22 → 23 → 24 → 25 · *(no Episode 7)*

```dataview
LIST
FROM "Timeline/Undated"
SORT file.name ASC
```

## Related

- [[Discord/exports/world-lore]]
- [[Dates]] — campaign year and historical anchors (1476–1478)
