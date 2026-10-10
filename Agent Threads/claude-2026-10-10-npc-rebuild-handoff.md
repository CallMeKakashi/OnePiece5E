# NPC rebuild handoff, 2026-10-10

Next session continues rebuilding the archived `bb-rehearsal` NPCs through the op5e pipeline. Start with **Tariq Solen**.

## What this session did

- Read the Oct 6 to 8 op5e work (see `op5e/docs/CHECKLIST.md`, `op5e/docs/NPC-BUILDS.md`) and the Oct 10 Codex handoffs in this folder, then **rebuilt from scratch** (every choice asked, none carried from the retired Codex builds): Cadence, Facade, Lady Soefra Anthem, Khael Dhamar, Cecilia Moore, Vex. Commits are on `future-work` (`git log --oneline -30`).
- Organised `bb-rehearsal` actor folders (Dead, System, OP5E/...). Never touched `blood-and-brine`.
- Surveyed all 186 actors: [docs/rehearsal-migration-candidates.md](../docs/rehearsal-migration-candidates.md) holds the pick list, the folder moves already made, and the **full remaining rebuild queue**. Read it first.
- Art is tracked in [docs/art-credits.md](../docs/art-credits.md) (sources, "AI modified" flags, pending art, permission status "Not asked" for all).

## Workflow the user wants (also in memory `npc-build-workflow-feedback`)

1. **Ask every creation choice with the AskUserQuestion tool**, 2 to 4 per call, recommended option first. Never decide silently; never carry over old builds' picks.
2. Check each option exists in the sourcebook or op5e packs before offering it. Things that did not exist: War Caster, Resilient (Wisdom), Silence, Hypnotic Pattern, Counterspell, a Gadgeteer homunculus, any monkey stat block.
3. Pipeline: write `specs/<slug>-spec.json` (and `<slug>-rogue-spec.json` for a second class), run `list-choices.ts` to get pending steps, write the user's answers into `choices[]`, `npm run actor:build`, then a custom `build-<slug>-custom.ts` (copy `build-khael-custom.ts` for two-class builds, `build-soefra-custom.ts` for casters, `build-cadence-custom.ts` for homebrew powers). Balance pass: HP to the DMG band for the CR plus one labelled bespoke bonus feature.
4. Import only into `bb-rehearsal` with `dev/harness/import-npc.mjs <json> --replace` (replaces a same-named old stub; without `--replace` it refuses), then `dev/harness/ensure-npc-folder.mjs "<Actor>" "OP5E/<Faction>"`. **Run import before the folder helper**, or the helper files the old stub instead. Verify the live actor (items, activities, images, duplicates) before saying done.
5. Art: Pinterest in the built-in browser (user is logged in), `filter_genai=true`, open each pin and check the "AI modified" label and poster. The filter lets AI pins through, and clicks often land on the wrong pin when the page shifts, so wait and re-screenshot. Save as `<name>-new.jpg`, never overwrite originals, make the token locally with PIL (circular crop plus ring). Downloads need the user's yes. The user has accepted flagged placeholders when nothing better exists.
6. Run commit commands in their own Bash call: the commit-message hook misreads heredocs in the same command. Commit headers must be Conventional Commits, 72 chars or fewer.

## Gotchas

- npm and spec identifiers: Bard subclass slug for Bewitchment is `bewitchment`; roles are slugs like `master-at-arms`; backgrounds use the display name (`Urchin`). Wildcard pools take literal ids (`skills:ste`, `tool:thief`, `tool:music:*`).
- Recharge in dnd5e 5.x is item `uses.recovery` with `period: "recharge"`; the legacy `recharge` field is ignored by `ensureFeatureActivities`.
- Item icons must exist under `D:/foundry-pi/Foundry/foundryvtt/public/icons/`; check with the verify script (`HEAD` on every `img`).
- Summon activities need `standaloneSummons()`; import the summon actor first with `--keep-id` (Facade's Mechanical Cannon is already in the world).
- Foundry is at `localhost:30000`, world `bb-rehearsal`, harness user "Automation". The user could not log in as Gamemaster at one point (a stale session was suspected; the server reported 0 users). Not resolved; ask whether it is fixed.
- Temporary harness scripts were written as `dev/harness/_tmp-*.mjs` and deleted after use. Write complex page scripts as real functions (`run.toString()`), not template strings with regexes.

## Where things stand

| Done and verified live | Notes |
|---|---|
| Cadence (L12 CR10), Facade (L10 CR8), Soefra (L11 CR9) | Soefra and Cadence art is placeholder or pending |
| Khael Dhamar (L8 CR5, Fighter 5 / Rogue 3), Cecilia Moore (L8 CR4, Marksman 5 / Rogue 3) | Art placeholders; both in `OP5E/Sand Rats` |
| Vex | 2014 SRD Baboon copied from `dnd5e.monsters`, unchanged, in `OP5E/Blackhand` |

Old stubs still in `Archived/Freefield`: "Kael Dhamar" (superseded by Khael), Irik, Saeva, Tariq. Delete or move "Kael Dhamar" when the user says.

## Remaining queue (details and decisions in the candidates doc)

1. Tariq Solen (15-year-old idealistic scout, Khael's apprentice, old stub CR 1/2 shortbow), Irik "Two-Tide" Fen, Saeva "Longcast" Virell (no backstory; the user chose class builds like Khael for all four Freefield NPCs).
2. Kaen Solaris, Vesper; Veyl and Serica Corven; Chuckles.
3. Calder Voss, Goru Yamashita, Marine Ensign (Armor Mk III), Mikey, Morrow.
4. Commander Leon, Drez Crown, Petty Officer Marine; SeaBeast Hermit Crab; **Marine Warship as a ship actor, not an NPC**.
5. Alice, Cassian Valehart, Dravos, and **Malphas as one NPC with Thunderbird Form 2 as his hybrid form** (build the way Kyle's Sphinx forms were, see `build-kyle-sollen-sphinx.ts`).
6. Vault notes for the rebuilt NPCs (Cadence, Facade have a "Foundry build" section; Soefra, Khael, Cecilia, Vex do not) and `op5e/docs/NPC-BUILDS.md` entries for Soefra, Khael, Cecilia, Vex.

## Open questions for the user

- Is the GM login fixed?
- Real art for Cadence, Facade, Soefra, Khael, Cecilia, Vex (commission brief, a named artist, or user-chosen pins).
- None of the rebuilt NPCs has been played in a real fight.
- The earlier note in `CHECKLIST.md`: migrate every PC to the new sourcebook (copy only) is still pending.

## Suggested skills

- `generate-foundry-actor` (level-up-npc was deleted as obsolete)
- `grilling` or `anthropic-skills:grill-me` (the one-question-at-a-time interview style, though the user prefers the AskUserQuestion tool)
- `ponytail` (active at session start; keeps builder scripts minimal)
- `handoff` (for the next handoff)
