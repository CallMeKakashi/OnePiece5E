# Ship check: run this whole plan before every release to the real campaign

Sign-off rule: every box ticked, no S1 open, every S2 has a written workaround. The automated runner writes `reports/ship-check.json`;
paste its result and your manual ticks into the release note.

Severity: **S1** blocks play, **S2** needs a workaround, **S3** cosmetic. Every issue found goes into one list with its severity.
Fix S1 and S2, re-run the matching automated stage, then re-check by hand.

## Phase 0: Safety
- [ ] Back up the module (copy `Data/modules/op5e` to `backups/op5e-module-<date>-<time>`) and note the module version.
- [ ] Snapshot the test world and the campaign world folder. Never write to `blood-and-brine` while testing.
- [ ] Foundry runs on the **test** world only (`curl localhost:30000/api/status` shows `"world":"test"`; the harness refuses any other).
- [ ] Automation users exist in the test world: `Automation`, `Automation 2` to `Automation 5` (Gamemaster role, no password).
- [ ] A written rollback: restore the module backup and the world snapshot.

## Phase 1: Automated stages, `node scripts/ship-check.mjs`
Pause, stop or resume the sweep at any time: `node scripts/control.mjs pause|resume|stop` (the sweep checkpoints every 5 documents; continue a stopped one with `node scripts/ship-check.mjs --from sweep --resume`). Live view: `node scripts/status-page.mjs`, then open `reports/status.html`.

Runs in order and stops at the first failure (`--from "<stage>"` resumes; `--small` samples the sweep, but a real ship run uses the full sweep).

| Stage | Pass means |
|---|---|
| build | 18 packs, 0 errors |
| validate + regression + unit | 0 problems, all unit tests pass (audit warnings at or below the ratchet, 45) |
| images | 0 broken images |
| source checks | armor, class tables, items, races match the sourcebook; no new automation-accuracy gaps |
| sync to live world | every pack synced into the running test world (restart Foundry first only if `module.json` changed) |
| prerequisites | all cases pass (47 at last count) |
| wizard | all cases pass (32) |
| level-up | all class/subclass runs pass (80) |
| optional rules | 9/10 or better; the one known failure is a Chris Premades error |
| sweep | every doc used: 0 failures (parallel, 5 shards, about an hour) |
| rebuild PCs | the 10 campaign PCs rebuild without errors |
| transformations | Hybrid Form, Full Beast Form and Sulong checks pass on Roma, Hybrid, Sulong, Malphas (31 checks) |

## Phase 2: Character creation by hand (Create OPC and Foundry's native flow)
- [ ] One character per class (9), across at least 5 different species and 5 different backgrounds.
- [ ] A level-1 character, a level-8 character (Haki appears) and a level-20 character.
- [ ] A rebuilt campaign PC, compared with its old sheet.
- [ ] Check: Role choice; Devil Fruit template choice including "No Devil Fruit (yet)"; skills with overlaps (Proficiency Reclaim);
      Haki offers only valid tiers; a feat with a prerequisite refuses (including Zoan feats for a non-Zoan); Dream; the hybrid option.
- **Pass:** nothing blocks, and the sheet matches the sourcebook.

## Phase 3: Level-up by hand (Foundry's Level Up button)
- [ ] Level 3 characters up to 8, 12 and 20 on every class.
- [ ] At each level check: hit points, new features, feature uses scaling, ASI or feat choices.
- [ ] Note any step that needs a manual fix.

## Phase 4: Play it like a session (GM plus 2 to 4 players, real tokens on a scene; the main event, 2 to 3 hours)
1. **Combat:** weapon attacks including shotgun and firearms, saves, a creation or spell, a bonus-action feature, a reaction, crits
   (max damage plus one die). Check Midi chat cards, damage application and effect expiry.
2. **Class features:** at least one multi-option feature per class (a maneuver, a Channel Conviction, a Hew, an Experimental Medicine form).
3. **Summons:** cast Animate Dead and Call Beast, use Mechanical Cannon. The summon imports and appears correctly.
4. **Ships:** one naval fight with cannons, shot types, recoil and a repair; the cannon fires from the ship sheet.
5. **Items:** equip armor and a shield; use a dial, a medkit, a ranked weapon, a cursed item; toggle the Bracers.
6. **Devil Fruit and Haki:** a fruit filled in from its template; Armament and Observation tiers in use.
   Zoan users: Hybrid Form spends a Devil Fruit use, temp HP = level x2 (x3 ancient, x4 mythical), +proficiency damage, duration by level;
   Full Beast Form spends a use and rolls its HP formula. Minks: Inner Beast and the Sulong variant (+4 Str/Dex).
7. **Downtime:** crafting from the reference tables, shopping from Shop Catalogues in Berries, Campaign Items listed, a roll table rolls.
8. **GM tools:** open the reference journals, roll a random table, grant an Additional Power by drag and drop.
9. **Multi-user:** players on separate browsers with their own characters. Can a player use Create OPC (defaults to PC)? Can they open
   GM characters, see GM whispers or edit the world (they must not)? Can they read the compendium (they must)? Shared combat and initiative,
   rolls in shared chat, GM whisper private, summon ownership correct, Midi and DAE effects across clients.

## Phase 5: Campaign characters
- [ ] Open each of the 10 rebuilt PCs: sheet opens, no console errors, portrait and token show, Berries and size correct.
- [ ] Differences from the old sheets are only the agreed ones (Matthew keeps the Marksman build, Paladin becomes Savant, no Gunslinger class).
- [ ] The old features without an equivalent are listed in each biography.

## Phase 6: Upgrade rehearsal and install (only with explicit approval; the campaign is never the test subject)
- [ ] Phase 0 backups done and a rollback written down.
- [ ] Confirm op5e is enabled for the campaign world without opening its database.
- [ ] Deploy with Foundry stopped (`npm run deploy:foundry`), start Foundry, open the existing characters, check the console for errors,
      load time, and that Midi, Chris Premades and the other modules still agree.
- [ ] Clean up scratch actors and scenes from the test world; regenerate reports (`node scripts/finalize.mjs`).

## Exit criteria: ready for the campaign
- No S1 open; every S2 has a known workaround.
- One full session in the test world finishes without a stop.
- Phases 2 and 3 pass for all 9 classes.
- The rebuilt campaign characters open cleanly.
- The real campaign is backed up and the rollback agreed.
