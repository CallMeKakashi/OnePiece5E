---
publish: true
---
# Blood & Brine — Campaign Wiki

One Piece D&D campaign encyclopedia: factions, world, timeline, sessions, rules, and reference material.

---

## Factions

**All named characters live under their faction in `World/Factions/`.**

### Lunarfolds (Player Party)

**The player crew — a unit of the Blackhand pirates.**

```dataview
LIST
FROM "World/Factions/Blackhand/Lunarfolds"
```

### Blackhand

**Pirate organization and associated fleet units.**

```dataview
LIST
FROM "World/Factions/Blackhand"
WHERE file.folder = "World/Factions/Blackhand"
```

#### Gentle Giant Pirates

```dataview
LIST
FROM "World/Factions/Blackhand/Gentle Giant Pirates"
```

### Sixfold

**Mercenary organization led by Liz.**

```dataview
LIST
FROM "World/Factions/Sixfold"
```

### Marines

```dataview
LIST
FROM "World/Factions/Marines"
```

### Motley Crew

**Historical founding crew — members splintered into other factions.**

```dataview
LIST
FROM "World/Factions/Motley Crew"
```

### Decibella Revolutionary

```dataview
LIST
FROM "World/Factions/Decibella Revolutionary"
```

### Spider Nest Pirates

```dataview
LIST
FROM "World/Factions/Spider Nest Pirates"
```

### Soundless 5

**Decibella Kingdom enforcers.**

```dataview
LIST
FROM "World/Factions/Soundless 5"
```

### Mugen Industries

```dataview
LIST
FROM "World/Factions/Mugen Industries"
```

### High Roost Pirates

```dataview
LIST
FROM "World/Factions/High Roost Pirates"
```

### Braveheart Pirates

```dataview
LIST
FROM "World/Factions/Blackhand/Braveheart Pirates"
```

### Guiseppi Family

```dataview
LIST
FROM "World/Factions/Guiseppi Family"
```

### Unaffiliated

```dataview
LIST
FROM "World/Factions/Unaffiliated"
```

---

## Monster Manual

**Campaign creatures and NPC stat blocks** — live Foundry sheets via [[Monster Manual|Monster Manual index]].

```dataview
LIST
FROM "Monster Manual"
WHERE file.name != "Home"
SORT file.name ASC
```

---

## Devil Fruits

**Campaign devil fruit registry** — image, power, and current owner. Index: [[Devil Fruits|Devil Fruits]].

```dataview
TABLE owner, status
FROM "Devil Fruits"
WHERE file.name != "Devil Fruits"
SORT file.name ASC
```

---

## Rules

**Homebrew systems, rulings, and campaign-specific mechanics**

- [[Inspiration|Inspiration]]
- [[Rules/Inventions|Inventions]] (see [[Sourcebook/Sourcebook|Sourcebook]] Ch. 4–6)

---

## World

**Islands, regions, and locations**

```dataview
LIST
FROM "World"
WHERE file.folder = "World"
```

---

## Timeline

**In-world chronology** (events, newspapers, and backstory). Full index: [[Timeline|Timeline]].

---

## Newspapers

**In-fiction headlines and editions.** Full chronology: [[Timeline|Timeline]].

```dataview
TABLE in_world_label, publication, status
FROM "Timeline"
WHERE type = "newspaper"
SORT file.name ASC
```

---

## Sourcebook

**One Piece D&D reference** (DM Guide + Player's Guide, converted from PDFs)

```dataview
LIST
FROM "Sourcebook"
WHERE file.folder = "Sourcebook"
```

---

## Sessions

**Table-play session notes**

```dataview
LIST
FROM "Sessions"
```

---

## Transcripts

**Episode transcripts** (broadcast/recording unit). Index: [[Transcripts|Transcripts]].

---

## Journals

**In-character or between-session journal entries.** Index: [[Journals|Journals]].
