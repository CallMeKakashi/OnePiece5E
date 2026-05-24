---
publish: true
---
# 🏴‍☠️ One Piece D&D Campaign

Welcome to the master index for the campaign. This file acts as the central navigation hub for all characters, rules, world lore, and references.

---

## 📁 Characters

**Player Characters and their personal arcs**

```dataview
LIST
FROM "Characters"
```

---

## 🧭 Crew

**Permanent NPCs who travel with the party**

```dataview
LIST
FROM "Crew"
```

---

## 🤝 Party NPCs

**Temporary allies, passengers, and short-term companions**

```dataview
LIST
FROM "Party NPC's"
```

---

## 📜 Rules

**Homebrew systems, rulings, and One Piece–specific mechanics**

- [[Inspiration|Inspiration]]
- [[Rules/Equipment|Equipment]] — shop tables, ships, gear (see also [[source/source|Source]] Chapter 4)

```dataview
TABLE status
FROM "Rules/Equipment"
WHERE file.name != "Equipment"
SORT file.name ASC
```

---

## 🌍 World

**Islands, regions, factions, and rumors**

```dataview
LIST
FROM "World"
WHERE file.folder = "World"
```

---

## 📰 Newspapers

**In-fiction headlines and editions** — curated from Discord `#world-lore` and related sources. Full chronology: [[Timeline/_index|Timeline]].

```dataview
TABLE in_world_label, publication, status
FROM "Timeline"
WHERE type = "newspaper"
SORT file.name ASC
```

---

## 📚 Source

**Reference material converted from PDFs**

```dataview
LIST
FROM "source"
WHERE file.folder = "source"
```

---

# 📖 Sessions

**List of all Sessions so far**

```dataview
LIST
FROM "Sessions"
```