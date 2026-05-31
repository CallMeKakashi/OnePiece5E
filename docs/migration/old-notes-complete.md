# Old Notes migration — complete

**Date:** 2026-05-24  
**Branch:** `planning`  
**Outcome:** `Old Notes/` removed from the vault. Historical provenance remains in `sources:` frontmatter on migrated notes.

## Policy (grill decisions)

- **Exit:** Canon moved to Tier 1; cruft deleted with `sources:` on keepers.
- **Phase order:** Low ambiguity first → Party/PC collisions last.
- **Equipment:** `Rules/Equipment/` (prior commit `bf1349f`).
- **Devil Fruits / inventions:** `Devil Fruits/`, `Rules/Inventions/`.
- **Sessions prep:** Dedupe then `Sessions/Sidequests/`, `Sessions/Outlines/`; Campaign 1 → `Sessions/Archive/Campaign 1/`.
- **Images:** `Attachments/`; stale canvas deleted.
- **People:** Active PCs in `Characters/`; Party 2 → `Party NPC's/`; Campaign 1 → `Characters/Archive/Campaign 1/`; Malphas Alice chapter merged into `Characters/Malphas.md`.
- **Discards:** `NPC Names.md`, empty `Prologue.md`, Sixfold Prologue Draft 1, Facade sidequest duplicate (canonical: `Sessions/Freefield Sidequest.md`).

## Folder map (final)

| Old Notes area | Destination |
|----------------|-------------|
| `Campaign 2/Items/` | `Rules/Equipment/` (earlier commit) |
| `Devil Fruits/*.md` | `Devil Fruits/` |
| `Devil Fruits/Inventions/` | `Rules/Inventions/` |
| `Untitled 1.md` | `Rules/Stat blocks/Wind-Taker Scout.md` |
| Lumafang stat blocks | `Rules/Stat blocks/Blood and Lumafang Stat blocks.md` |
| `Rustwing (Ship Stat Block).md` | `Rules/Equipment/` |
| Sidequests, Spider's Nest, Circus | `Sessions/Sidequests/` |
| `Untitled.md` | `Sessions/Sidequests/Whistling Isle — Storm-Teller's Debt.md` |
| Planned Episodes, `Session This` | `Sessions/Outlines/` |
| `Loot log party 3` | `Sessions/Loot log party 3.md` |
| Campaign 1 sessions | `Sessions/Archive/Campaign 1/` |
| `Party 1/Roma`, `Malphas` | `Characters/Roma.md`, `Characters/Malphas.md` |
| `Party 2/Players/*` | `Party NPC's/` |
| Campaign 1 PCs | `Characters/Archive/Campaign 1/` |
| `*.png`, canvas | `Attachments/` (images); canvas deleted |
| Facade planned (duplicate) | Deleted — see `Sessions/Freefield Sidequest.md` |

## Earlier migrations (before this pass)

Timeline (`Dates.md`, newspapers, backstories), World (`Islands.md`, factions, Spirit Cliff ledger), Items → `Rules/Equipment/`.

## Agent doc updates

- `CONTEXT.md` — removed **Old Notes** glossary entry; Timeline quarry wording updated.
- `docs/agents/CORE.md` — removed Tier 2 `Old Notes/`; renumbered Tier 3 → Tier 2.

## Do not rewrite `sources:` paths

Strings like `Old Notes/One Piece DND - Blood and Brine/...` are **historical** provenance, not live paths.
