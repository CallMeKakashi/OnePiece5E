# Blood & Brine

Obsidian vault for the **Blood & Brine** One Piece D&D campaign — sessions, world state, party, rules reference, and episode transcripts.

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

**Character**:
A player character (PC); notes in `Characters/`.
_Avoid_: Crew member, NPC

**Crew**:
A permanent NPC who travels with the party; notes in `Crew/`.
_Avoid_: Party NPC, Character

**Party NPC**:
A temporary ally, passenger, or short-term companion; notes in `Party NPC's/`.
_Avoid_: Crew, Character

**World**:
Locations, regions, factions, and lore; notes in `World/`.
_Avoid_: Source (rules text)

**Source**:
Imported One Piece D&D rules reference converted from PDFs; notes in `source/`.
_Avoid_: World (fiction), Rules (homebrew only)

**Old Notes**:
Pre-restructure campaign archive in `Old Notes/`; canon-related material to merge into active folders over time.
_Avoid_: Dead content, template cruft

## Relationships

- A **Session** and an **Episode** often describe the same play but are not always 1:1 (e.g. `Session - 24.5`, split Episode 20 parts).
- A **Session** may have an **Outline**, a **Session** note, and one or more **Transcript** files.
- **Character**, **Crew**, and **Party NPC** are disjoint people buckets.
- **World** is in-fiction; **Source** is rules reference.

## Flagged ambiguities

- "Session" in conversation may mean the table event or the file in `Sessions/` — default to the table-play unit unless context is about files.
- "Episode" in filenames always means the recording/transcript naming scheme.

## Example dialogue

**DM**: For Session 28, check the outline and the Episode 28 transcript — the session note isn't written yet.

**Assistant**: I'll read `Sessions/This session.md` if it's for the upcoming play, or `Transcripts/Episode 28 …` for what actually happened at the table/recording. I won't assume Session 28 maps to Episode 28 without checking titles.

**DM**: Is Riff Sin on the crew?

**Assistant**: Riff is in `Party NPC's/`, not `Crew/` — a temporary ally, not a permanent shipmate.
