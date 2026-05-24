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
- `World/`
- `Characters/`
- `Crew/`
- `Party NPC's/`
- `Journals/`
- `Rules/`
- `source/`
- `Attachments/`

### Tier 2 — Obsidian infrastructure (do not read unless asked)

- `Categories/`
- `Clippings/`
- `References/`
- `Notes/`
- `Templates/`

These folders support Obsidian workflows (templates, PKM). They are not primary campaign context.

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

## People buckets

| Folder | Who |
|--------|-----|
| `Characters/` | Player characters |
| `Crew/` | Permanent ship NPCs |
| `Party NPC's/` | Temporary allies |

## Wikilinks

Use Obsidian `[[wikilinks]]` when suggesting note titles. Prefer **Title Case** filenames consistent with existing notes.

## Deferred work (do not start without approval)

- Linking Sessions ↔ Transcripts ↔ Outlines
- Homebrew glossary terms in `CONTEXT.md`
- Changing `_index.md` or Obsidian config
