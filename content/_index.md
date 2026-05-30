---
publish: true
---
# One Piece D&D Campaign

Welcome to the master index for the campaign. This file acts as the central navigation hub for all factions, rules, world lore, and references.

Agents: start with [[CONTEXT]] → [[docs/agents/CORE|docs/agents/CORE]] → this page.

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

---

## Rules

**Homebrew systems, rulings, and campaign-specific mechanics**

- [[Inspiration|Inspiration]]
- [[Rules/Devil Fruits|Devil Fruits]] · [[Rules/Inventions|Inventions]] (see [[source/source|Source]] Ch. 4–6)

```dataview
TABLE status
FROM "Rules/Devil Fruits" OR "Rules/Inventions"
SORT file.name ASC
```

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

**In-world chronology** (events, newspapers, and backstory). Full index: [[Timeline/_index|Timeline]].

---

## Newspapers

**In-fiction headlines and editions** — curated from Discord `#world-lore` and related sources. Full chronology: [[Timeline/_index|Timeline]].

```dataview
TABLE in_world_label, publication, status
FROM "Timeline"
WHERE type = "newspaper"
SORT file.name ASC
```

---

## Source

**Reference material converted from PDFs (One Piece D&D DM Guide + Player's Guide)**

```dataview
LIST
FROM "source"
WHERE file.folder = "source"
```

---

## Sessions

**List of all Sessions so far**

```dataview
LIST
FROM "Sessions"
```

---

## Transcripts

**Episode transcripts** (broadcast/recording unit). Session numbers may not match episode numbers; use titles for alignment. Browse the `Transcripts/` folder.

---

## Journals

**In-character or between-session journal entries.**

```dataview
LIST
FROM "Journals"
SORT file.name ASC
```

---

## Maintenance

- [[Templates/_index|Edit templates]] — campaign templates (`Templates/` hidden in explorer)
- [[docs/obsidian-setup|Obsidian setup]] — hidden folders, CSS snippet, bookmarks
- [[CONTEXT]] — domain glossary (Actors, Factions, Session vs Episode)
- [[docs/agents/CORE|docs/agents/CORE]] — agent operational rules (folder tiers, read-only default)
