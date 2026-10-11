# Handoff 16: Petty Officer, Hermit Crab, Marine Warship, Alice built (2026-10-11)

Continues [handoff 14](claude-2026-10-11-music-config-handoff-14.md) and the NPC handoffs 1 to 13 (the music release note is [handoff 15](claude-2026-10-11-music-release-handoff-15.md), a different thread) (workflow and gotchas live there). **Next: Cassian Valehart**, then Dravos, then Malphas + Thunderbird Form 2 (`docs/rehearsal-migration-candidates.md`). Ask every choice with AskUserQuestion, check each option exists in the packs first; after each NPC add the `op5e/docs/NPC-BUILDS.md` entry and the vault "Foundry build" section, tick the migration list, commit, then go to the next one.

## Done this session (details are in `op5e/docs/NPC-BUILDS.md`, the build scripts and `docs/art-credits.md`; not repeated here)

- **Petty Officer Marine** (Marksman 4 Sniper), commits `7f1c4d6`, art `2491039`. Art is the user's local file `npcs/Marines/marine-elite.jpg` (copied to `petty-officer-new.jpg`).
- **SeaBeast Hermit Crab** (fully custom Gargantuan CR 5, no sea king stat block exists in the compendium or Sourcebook), `441df35`, art `1ab5558` (user's pin 1: driftwood-shelled crab).
- **Marine Warship** (Galleon hull + mixed broadside, a vehicle), `b41d0c2`, art `15f9fb8` (the user's pin, a greyscale four-view sheet).
- **Alice** (Lunarian Fighter 6 Banneret / Savant 6 Radiant Superiority, level 12), `e19074a`, art `281e89d` (a stand-in: the user's local `players/Lunarfold/alice.jpg`, pink-haired, not the white-haired brief).
- **World housekeeping in `bb-rehearsal`** (not in git): Petty Officer to `OP5E/Marines`; Marine Warship to `OP5E/Ships`; Rustwing (Keelboat) to `Dead`; Clone to `OP5E/Sharkfin Pirates` (Irik's Test Subject summon); Mechanical Cannon to `OP5E/Blackhand` (Facade's summon); the two Animated Undead (test-harness leftovers, no owner) to `System`.

## Open items

- **Remade actors still outside `OP5E`** (the user asked, then did not choose to move them): Five Families (Cedro, Nerolo, five Capones, Queen), Guisseppi (Gin, Rhum), Commodore (Greyhound, Obsidian, Obsidian Overheated), Horus (Heathcliff), Afterimage (`System`), SSR (Caravel, in `Ships`, unchecked whether remade). Ask before moving.
- Still unfiled: Daniel, Kara "Many-Eyes" Kagemi.
- Alice art is a stand-in; `Attachments/Alice.png` (white hair, dark skin, black wings) was the better Lunarian match. Her vault page keeps the legacy statblock.
- Marine Warship art is a base sketch sheet, not a navy ship with white sails.
- Pushed? No: commits from this session are not pushed (also `7a9a4e0` and the handoff 14 commit were unpushed).
- Carried over from handoffs 10 to 14: old "Morrow" actor, transform chat-card click, Veyl walk speed, Serica Dual Wielder AC, needs-code compendium items, Ensign vault file name, Leon katana vs rapier, music organization (Vocal folder, mood list, themes per actor).

## Gotchas learned

- **The commit hook parses the whole bash command**: a heredoc that contains a `## Heading` line next to `git commit` is read as the commit message and rejected. Write docs in one call, commit in a separate call. Header must be Conventional Commits and 72 chars or less.
- **Pipeline Haki starts at level 8** for class builds; for lower levels add `Color of Armament Novice` (class-features pack) by hand. Conqueror's chain items are named `Conqueror's Haki Novice` etc.
- **Savant is a paladin analogue** (Ardent Soul, smite, aura), not a fire caster. Lunarian fire comes from the race: use `lunarianFeatures` and the Fire Bolt / Elemental Armor / Fireball creations (see `build-calder-custom.ts`, `build-alice-custom.ts`).
- **Point-buy math again**: Lunarian is +2/+1 (or +1 x3); check the array is reachable (27 points, plus race, plus ASIs at each class's levels) before offering it. Two offered arrays were impossible and corrected.
- **Master at Arms role** has a starting-weapon pool that includes Cutlass; use it instead of hand-adding.
- **Monsters and vehicles**: `actor:validate` only understands class builds (race/class/weapon errors are expected for monster and ship JSON). `import-npc.mjs` crashes printing its summary for a vehicle (reads spellcasting) but the actor is created correctly. Ship build pattern: clone the pack hull from `packs-src/ships`, add `packs-src/ship-weapons` items with a `quantity`.
- **Pinterest in the in-app browser** needs the user to log in inside the pane (their Chrome login does not carry over). Then the scrape works: open the search URL, scroll, collect `a[href*="/pin/"] img` `236x` URLs, download thumbnails into a numbered sheet under `op5e/reports/imgs/`, open it with `show_pane` and Read it. Fetch the chosen pin at `736x`. Token: circle crop 400x400 RGBA, Read it to check (watermarks, cut-off heads).
- **Local art**: the user has art in `D:/foundry-pi/Foundry/foundrydata/Data/one-piece-5e/` (`npcs/Marines/`, `players/Lunarfold/`) and the vault `Attachments/`. Search there first when the user says art is local.
- `ensure-npc-folder.mjs "<Actor>" "<Folder path>"` also works for moving any actor (including vehicles and summons); `list-actors-by-folder.mjs` shows the result. Sometimes a command is moved to the background by a mid-turn message; check its output file.
- Never read `blood-and-brine`; everything here ran in `bb-rehearsal` (check `curl localhost:30000/api/status` first).

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline for the NPC queue (NOT `level-up-npc`).
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`).
