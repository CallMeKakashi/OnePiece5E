# Blood & Brine

Obsidian vault for the **Blood & Brine** One Piece D&D campaign — sessions, world state, factions, rules reference, and episode transcripts.

## Language

**Campaign vault**:
This repository; all material serves the live tabletop campaign.
_Avoid_: PKM vault, general notes repo

**Session**:
A table-play unit; curated notes live in `Sessions/`.
_Avoid_: Episode (when you mean the table session)

**Episode**:
A broadcast or recording unit; raw transcripts live in `Transcripts/` as `Episode N - …` files.
_Avoid_: Session (when you mean the stream/recording)

**Transcript**:
Raw episode text (`.txt` or `.srt`) in `Transcripts/`; a campaign knowledge source alongside session notes and outlines.
_Avoid_: Session note

**Outline**:
Pre-session prep document (e.g. `Sessions/This session.md`).
_Avoid_: Recap, session note

**Actor**:
Any named character in the campaign — PC, permanent crew, temporary ally, antagonist, or faction officer. Actor pages live under their faction in `World/Factions/`.
_Avoid_: Character, NPC, Crew member (as folder-based categories)

**Faction**:
A pirate crew, military branch, organization, or named group. Each faction has a folder under `World/Factions/` containing a faction overview page and actor pages for its members. Sub-units (e.g. Lunarfolds under Blackhand) nest as subfolders.
_Avoid_: Treating actors as separate from factions

**World**:
Locations, regions, factions, and lore; notes in `World/`.
_Avoid_: Source (rules text)

**Timeline**:
In-world chronology on the One Piece calendar; notes in `Timeline/` (year subfolders, sort key in filename). Hub: [[Timeline]].
_Avoid_: Session order, episode order

**Timeline entry**:
A dated or sortable note in `Timeline/` with frontmatter `type: event | newspaper | backstory` and `status: draft | canon`. Evidence for table play stays in `Sessions/` and `Transcripts/`; Discord exports are quarries cited in `sources` (channel registry: [[Discord/_index]]; historical paths may reference the retired `Old Notes/` tree).
_Avoid_: Treating timeline text as session canon without checking sources

**Newspaper**:
An in-fiction press article (`type: newspaper` in `Timeline/`); headlines from the campaign world, often extracted from [[Discord/exports/world-lore]]. Listed on [[Timeline]] and the campaign hub.
_Avoid_: Session note, transcript, rules text

**Source**:
Imported One Piece D&D rules reference (DM Guide + Player's Guide) converted from PDFs; notes in `Sourcebook/`.
_Avoid_: World (fiction), Rules (homebrew only)

**Rules**:
Homebrew rules, homebrew items, and campaign-specific mechanics in `Rules/`. Not source-book content.
_Avoid_: Source (imported reference material)

**Devil Fruits**:
Campaign devil fruit registry (image, power, current owner) in `Devil Fruits/`; hub [[Devil Fruits]]. System reference: `Sourcebook/Chapter 6 Devil Fruits/`.
_Avoid_: Rules (folder is homebrew mechanics; fruits are their own registry)

## Factions

All named characters live under their faction in `World/Factions/`. Current factions:

| Faction | Location | Notes |
|---------|----------|-------|
| [[Blackhand]] | `World/Factions/Blackhand/` | Parent pirate organization; contains sub-units |
| [[Lunarfolds]] | `World/Factions/Blackhand/Lunarfolds/` | Player party crew; Blackhand unit |
| [[Gentle Giant Pirates]] | `World/Factions/Blackhand/Gentle Giant Pirates/` | Blackhand unit |
| [[Sixfold]] | `World/Factions/Sixfold/` | Mercenary organization |
| [[Marines]] | `World/Factions/Marines/` | Naval military |
| [[Motley Crew]] | `World/Factions/Motley Crew/` | Historical founding crew |
| [[Decibella Revolutionary]] | `World/Factions/Decibella Revolutionary/` | Rebellion group |
| [[Spider Nest Pirates]] | `World/Factions/Spider Nest Pirates/` | Pirate crew |
| [[Soundless 5]] | `World/Factions/Soundless 5/` | Decibella Kingdom enforcers |
| [[Mugen Industries]] | `World/Factions/Mugen Industries/` | Industrial faction |
| [[High Roost Pirates]] | `World/Factions/High Roost Pirates/` | Pirate crew (Jack S. Parrow) |
| [[Braveheart Pirates]] | `World/Factions/Blackhand/Braveheart Pirates/` | Blackhand 4th Fleet sub-crew (Mira) |
| [[Guiseppi Family]] | `World/Factions/Guiseppi Family/` | Crime family / syndicate |
| Unaffiliated | `World/Factions/Unaffiliated/` | Former PCs and unknown-affiliation actors |

**Folder policy (2026-05-31):** Actors live under `World/Factions/` only — do not populate legacy `Characters/`, `Party NPC's/`, or `Crew/` folders.

## Relationships

- A **Session** and an **Episode** often describe the same play but are not always 1:1 (e.g. `Session - 24.5`, split Episode 20 parts).
- A **Session** may have an **Outline**, a **Session** note, and one or more **Transcript** files.
- **Actors** belong to **Factions**; some actors have historical ties to multiple factions (e.g. Motley Crew founding members who joined Sixfold or Marines).
- **World** is in-fiction; **Source** is rules reference; **Rules** is homebrew.
- **Timeline** orders by in-world date (flexible precision), not session or episode number.
- **Newspaper** notes live on the **Timeline**; promote `status` to `canon` after review.

## Flagged ambiguities

- "Session" in conversation may mean the table event or the file in `Sessions/` — default to the table-play unit unless context is about files.
- "Episode" in filenames always means the recording/transcript naming scheme.

## Example dialogue

**DM**: For Session 28, check the outline and the Episode 28 transcript — the session note isn't written yet.

**Assistant**: I'll read `Sessions/This session.md` if it's for the upcoming play, or `Transcripts/Episode 28 …` for what actually happened at the table/recording. I won't assume Session 28 maps to Episode 28 without checking titles.

**DM**: Where is Riff Sin's page?

**Assistant**: Riff Sin is under `World/Factions/Decibella Revolutionary/Riff Sin.md` — he's a member of the Decibella Revolutionary faction.

**DM**: What did the Tribune say about G-55?

**Assistant**: I'll read the `type: newspaper` note in `Timeline/` for that date. For what the party did at the table, I'll check `Sessions/` or `Transcripts/` — I won't treat the Herald as session evidence without a link.
