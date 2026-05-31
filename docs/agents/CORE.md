# Agent core instructions — Blood & Brine vault

Shared rules for Cursor, Claude Code, Codex, Gemini, and other agents working in this repo.

## Read order

On a cold start, read in this order:

1. [`CONTEXT.md`](../../CONTEXT.md) — domain glossary
2. This file — operational rules
3. [`_index.md`](../../_index.md) — campaign navigation hub (Dataview)

## Vault path

`d:/Documents/GitHub/blood&brine/`

## Default mode: read-only

Do **not** create, edit, delete, rename, or move any file unless the user explicitly approves that action.

## Folder tiers

### Tier 1 — campaign-primary (search/read by default)

- `Sessions/`
- `Transcripts/`
- `Timeline/`
- `World/` (includes `World/Factions/` — all actor and faction pages)
- `Journals/`
- `Rules/` (homebrew only)
- `Monster Manual/` (campaign creatures & NPC stat blocks)
- `Sourcebook/` (One Piece D&D reference)

### Tier 2 — hidden in explorer (do not read unless asked)

- `Categories/`
- `Clippings/`
- `References/`
- `Notes/`
- `Templates/`
- `Attachments/`

These folders support Obsidian workflows (templates, PKM, media). They are not primary campaign context.

## Obsidian explorer

The file explorer hides Tier 2 and tooling folders via CSS (**explorer only** — search and links unchanged). Template edits go through [[../obsidian-setup|obsidian-setup]] and [[../../Templates/_index|Templates/_index]]. Do not change `.obsidian/snippets/` or `appearance.json` without user approval and updating that doc.

## Session vs Episode

- **Session** = table-play unit → `Sessions/`
- **Episode** = broadcast/recording unit → `Transcripts/`

Do not assume session numbers and episode numbers are 1:1. Match by title and user context.

## Knowledge sources for "what happened"

When reconstructing play, consider (in order of curation):

1. Session notes in `Sessions/`
2. Outlines (e.g. `Sessions/Outlines/`, `Sessions/This session.md`)
3. Transcripts in `Transcripts/` (large; load only when needed)

For **in-world chronology** (dates, headlines, between-session world reactions), use `Timeline/` — not a substitute for session notes. Newspaper text is in-fiction; cite `Sessions/` or `Transcripts/` for what happened at the table.

Linking and organizing these is in progress — do not reorganize without approval.

## Actors and factions

All named characters (PCs, crew, NPCs, antagonists) live under their faction in `World/Factions/`. Each faction has a folder containing a faction overview page and individual actor pages.

| Faction | Path | Notes |
|---------|------|-------|
| Blackhand | `World/Factions/Blackhand/` | Parent pirate org with sub-units |
| Lunarfolds | `World/Factions/Blackhand/Lunarfolds/` | Player party crew (Blackhand unit) |
| Gentle Giant Pirates | `World/Factions/Blackhand/Gentle Giant Pirates/` | Blackhand unit |
| Sixfold | `World/Factions/Sixfold/` | Mercenary organization |
| Marines | `World/Factions/Marines/` | Naval military |
| Motley Crew | `World/Factions/Motley Crew/` | Historical founding crew |
| Decibella Revolutionary | `World/Factions/Decibella Revolutionary/` | Rebellion group |
| Spider Nest Pirates | `World/Factions/Spider Nest Pirates/` | Pirate crew |
| Soundless 5 | `World/Factions/Soundless 5/` | Decibella Kingdom enforcers |
| Mugen Industries | `World/Factions/Mugen Industries/` | Industrial faction |

Actor pages use the template: Description → Role → Personal Quests → Backstory.

## Wikilinks

Use Obsidian `[[wikilinks]]` when suggesting note titles. Prefer **Title Case** filenames consistent with existing notes.

## Deferred work (do not start without approval)

- Linking Sessions ↔ Transcripts ↔ Outlines
- Homebrew glossary terms in `CONTEXT.md`
- Changing `_index.md` beyond approved maintenance links, or Obsidian config not documented in [[../obsidian-setup|obsidian-setup]]
