# Handoff: Marine Ensign Mk IV built (2026-10-10)

Continues [handoff 10](claude-2026-10-10-npc-rebuild-handoff-10.md); read handoffs 1 to 10 for workflow and gotchas. **Next: Commander Leon** (ask every choice with AskUserQuestion; check each option exists in the packs first; after each NPC add the `op5e/docs/NPC-BUILDS.md` entry and the vault "Foundry build" section, tick `docs/rehearsal-migration-candidates.md`, commit, then go to the next one).

## Done this session

- **Marine Ensign (Armor Mk IV)** is live in `bb-rehearsal`, folder `OP5E/Marines`. Commit `0b03d6d`, pushed to `future-work`. Details are in `op5e/docs/NPC-BUILDS.md` and `op5e/dev/generate-foundry-actor/build-ensign-custom.ts` (spec `specs/marine-ensign-spec.json`); not repeated here.
- The user renamed the suit Mk III to Mk IV mid-build. The vault page is still the file `World/Factions/Marines/Marine Ensign (Armor Mk III).md` (a "Foundry build" section was appended); renaming it was not done.
- Validated every `Foundry/actors-json/*.json` with `npm run actor:validate`. All class-based NPCs pass. Monster-style builds (Kanto, Mikey, Morrow, Sphinx forms, Capone coin, Vex) fail "No weapons" / "No class item" by design. `facade.json` and `marine-ensign.json` print a "WARNINGS:" header with no text; not investigated.

## Queue and open items

- Queue: Commander Leon, Drez Crown, Petty Officer Marine, SeaBeast Hermit Crab, Marine Warship (ship actor), Alice, Cassian Valehart, Dravos, Malphas + Thunderbird Form 2 (`docs/rehearsal-migration-candidates.md`).
- Carried over from handoff 10: the old "Morrow" actor in the rehearsal world (maybe stale), the transform chat-card click, Veyl's walk speed, Serica's Dual Wielder AC, 24 needs-code compendium items, `package-lock.json` still says 0.2.11.
- Ensign: the compendium Propulsion Armor gives no flight; the user chose no homebrew flight. Gauntlet Int-for-attack was set on the activity but not rolled in the UI. Not played in a fight.

## Gotchas learned

- **User wants no AI art.** Turn on Pinterest's "Less AI" (`&filter_genai=true` in the search URL), but it only reduces AI; show a contact sheet (script idea: download the 474x thumbnails, tile with PIL, send with SendUserFile) and let the user pick or paste a pin. Image `originals` URL from the 736x closeup path: `i.pinimg.com/originals/<same path>.jpg`.
- AskUserQuestion "Other" answers can come back with no text; ask a follow-up instead of guessing.
- Mod choices (Propulsion Armor, Armor of Mechanical Strength, Haki) live in the `class-features` pack, not `items`. A wrong pack prefix in the spec silently drops the item.
- Armor `magicalBonus` only counts if the item has the `mgc` property (AC was 19 until set).
- The pipeline leaves duplicate `Role:` items and loot placeholders; dedupe in the custom builder.
- A heredoc containing apostrophes in a Bash call broke parsing; use the Write tool for scripts. Commit headers must be 72 chars or less. `import-npc.mjs --replace --folder X` resets the folder, so re-run `ensure-npc-folder.mjs` after each re-import.

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline (NOT `level-up-npc`)
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`)
