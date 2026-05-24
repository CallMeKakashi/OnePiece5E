---
publish: true
---
# 🏴‍☠️ One Piece D&D Campaign

Welcome to the master index for the campaign. This file acts as the central navigation hub for all characters, rules, world lore, and references.

Agents: start with [[CONTEXT]] → [[docs/agents/CORE|docs/agents/CORE]] → this page.

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
- [[Rules/Equipment|Equipment]] — shop tables, ships, gear
- [[Rules/Devil Fruits|Devil Fruits]] · [[Rules/Inventions|Inventions]] (see [[source/source|Source]] Ch. 4–6)

```dataview
TABLE status
FROM "Rules/Equipment" OR "Rules/Devil Fruits" OR "Rules/Inventions"
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

## 🗓️ Timeline

**In-world chronology** (events, newspapers, and backstory). Full index: [[Timeline/_index|Timeline]].

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

## 📖 Sessions

**List of all Sessions so far**

```dataview
LIST
FROM "Sessions"
```

---

## 🧾 Transcripts

**Episode transcripts** (broadcast/recording unit). Session numbers may not match episode numbers; use titles for alignment. Browse the `Transcripts/` folder.

---

## ✍️ Journals

**In-character or between-session journal entries.**

```dataview
LIST
FROM "Journals"
SORT file.name ASC
```

---

## 🔧 Maintenance

- [[Templates/_index|Edit templates]] — campaign templates (`Templates/` hidden in explorer)
- [[docs/obsidian-setup|Obsidian setup]] — hidden folders, CSS snippet, bookmarks
- [[CONTEXT]] — domain glossary (Session vs Episode, people buckets)
- [[docs/agents/CORE|docs/agents/CORE]] — agent operational rules (folder tiers, read-only default)