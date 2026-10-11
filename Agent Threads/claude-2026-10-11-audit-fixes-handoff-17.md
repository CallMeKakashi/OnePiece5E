# Handoff 17: sourcebook audit fixes and the full browser test (2026-10-11)

Continues [handoff 16](claude-2026-10-11-npc-rebuild-handoff-16.md) (NPC builds up to Dravos). Music thread notes are in handoff 14 and 15 (separate). **Next:** (a) read the browser-test report (see below), (b) Malphas with Thunderbird Form 2, the last queued NPC.

## Done this session (details are in `op5e/docs/NPC-BUILDS.md` "Audit fixes (2026-10-11)", the commits and the scripts; not repeated here)

- **Cassian Valehart** (Bard 8) and **Dravos** (Gadgeteer 13) built with art, commits `a1ba99a`, `0e4a58a`, `ad4e1c7`, `123fa26`.
- **Sourcebook validation** of the Meridian and `OP5E/*` folders by a subagent: report at `op5e/reports/sourcebook-validation-meridian-op5e.md` (15 S1, 37 S2, 39 S3). Systematic fixes were done at the source, commits `b59442d` (class data, pipeline, test) and `e0d8001` (actor builds, docs):
  - Class data: Brawler and Gadgeteer d10, Gadgeteer saves Con/Int, Marksman saves Dex/Wis. Verified against `Sourcebook/Chapter 2 Classes/Class Features*.md` first (the Brawler "1d8/1d10" in the class table is the brawling die, not the hit die).
  - Pipeline: `build-from-spec.ts` drops the "No Devil Fruit (yet)" placeholder; `refresh-from-packs.ts` no longer overwrites a script's fixed numeric Devil Fruit Uses count (Paramecia +1 was being lost).
  - Additional powers for the five non-fruit class builds that lacked one: Alice Burn Baby Burn, Drez Sharp Focus, Ensign Plan B, Petty Officer Ricochet Rounds, Cassian Heart Strings.
  - Human ASI is +3 total, not +1 on all six: corrected on Drez, Leon, Petty Officer, Cassian, Dravos (keep the +1 on three key abilities).
  - Devil Fruit Uses 7 for Cadence, Serica, Veyl, 8 for Dravos; Irik gained Ocean's Scorn and the Fruit-Fruit DC feat; Kaen Str/Con and Kyle Cha capped at 20 (Kyle DC 18); Ensign scores revised (Shield Master dropped for Int +2); Petty Officer levelled to Marksman 8 (CR 4) so Armament Novice is legal.
  - Calder: the audit's "four ASI uses" was a misreading; unchanged.
- Rebuilt and re-imported into `bb-rehearsal`: Drez, Petty Officer, Alice, Cassian, Ensign, Dravos, Leon, Calder, Chuckles, Tyrell, Facade, Veyl, Serica, Irik, Cadence, Kaen, Kyle. The last four imports (Dravos, Cadence, Veyl, Serica with the Uses fix) were still running when this note was written: **verify** their Devil Fruit Uses live (7, 7, 7, 8) with a quick actor query.
- **Folder housekeeping and memory:** see handoff 16. New memory notes: `npc-art-no-ai-feedback` (Pinterest `&filter_genai=true`, human-made art only) and `npc-additional-power-feedback` (always ask the Chapter 7 power for non-fruit class builds).

## Browser test (subagent, started after this note)

The user asked for a full browser test of every character in the `Meridian Island` and `OP5E/*` folders (activities work, effects work, stats accurate). A background subagent runs it read-only against `bb-rehearsal`; its report goes to `op5e/reports/browser-test-meridian-op5e.md`. Read it before fixing anything. Do not run builds or imports while it runs (one Foundry world, one harness connection).

## Open items

- Audit S2/S3 still open: unprepared Savant/Gadgeteer creations (Alice, Cadence, Facade, Ensign), missing tricks and creations (Drez, Petty Officer, Facade, Ensign, Jay, Kyle), Medium Armor Master Dex cap, Gallows Boss Devious Strike, Permanent Haki-Imbuement as a feat, Ensign background feat, Drez AC, Calder's armour feat, Alice's second Fighting Style, Shin's Machiavellian Misfit.
- Remade actors **outside** the audited folders still have the old class data (Amareno, Bosco, Greyhound, Queen, Salvatore: Brawler; Limonte: Marksman) and sit outside `OP5E` (Five Families, Guisseppi, Commodore, Horus, Afterimage, SSR). Ask before rebuilding or moving.
- Art stand-ins: Alice (local pink-haired image, not the white-haired brief), Marine Warship (greyscale four-view sheet). Other pins were not re-screened against the no-AI rule.
- Not pushed: everything since `01e359e` on branch `future-work` (commits `7f1c4d6` to `e0d8001` plus this note). `op5e/dev/character-sheet-audit/output/audit-report.json` is a regenerated file left unstaged on purpose.
- Carried over from handoffs 10 to 16 (Morrow actor, transform chat-card click, Veyl walk speed, Serica Dual Wielder AC, needs-code compendium items, music organisation).

## Gotchas learned

- A script that sets `Devil Fruit Uses` before `refreshFromPacks` loses the value; the refresh now keeps a plain numeric `max`.
- `actor:build` writes to the name each custom script reads (`<slug>-chassis.json`, `<slug>-<class>-part.json`); Kaen reads `kaen-solaris-chassis.json`; Veyl and Serica share `build-corven-custom.ts`.
- Imports take 1 to 3 minutes each for big sheets; run batches in the background and wait with a Monitor on a log file with an `ALLDONE` line. Do not start a second harness command while one is running.
- Class "Hit Dice" and "Saving Throws" live in `Sourcebook/Chapter 2 Classes/Class Features*.md`, not in the per-class pages.

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline for Malphas (NOT `level-up-npc`); ask the Chapter 7 additional power for non-fruit builds.
- `diagnosing-bugs` for failures the browser test finds.
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`).
