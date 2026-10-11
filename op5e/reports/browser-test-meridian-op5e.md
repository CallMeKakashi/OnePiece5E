# Browser test: Meridian Island + OP5E actors (bb-rehearsal)

Method: headless Edge via `dev/harness/drive.mjs` (user Automation, GM), Midi-QOL 13.0.66 workflows (`MidiQOL.completeActivityUse`, roll dialogs auto-clicked), dnd5e 5.3.3. Every actor cloned into scratch folder `zz-browser-test` with a scratch scene and two scratch targets; all scratch docs deleted afterwards (verified: 0 actors, 0 scenes, folder gone). Real actors compared before/after (uses, HP, effects): unchanged for all 43. 43 actors found (the brief said 41). Not done: Browser-pane screenshots (sheets were rendered headlessly for every actor instead: all render, broken-image check below), summon placement, transform activities (Kyle, Mikey), combat/turn expiry of effects, Hit Dice detail. Attack rolls in this harness are made with advantage (dialog click artefact), ignore the d20 mode.

## Findings

### B1 (blocks play)
1. **op5e `game.user?.isActorOwner(...)` does not exist** (Foundry v13 / dnd5e 5.3.3). 8 call sites in `op5e/scripts/feature-hooks.mjs` (lines 104, 263, 299, 358, 399, 435, 544, 589; mirrored in `dist/`). Throws `TypeError: game.user?.isActorOwner is not a function` on every saving throw (hook `dnd5e.rollSavingThrow`, Diamond Soul) and in the Flaming Duality, Flame Investure, Rage, Inner Beast, Bubble Floater, Giant's Endurance, Relentless Rage handlers. Seen on every save activity of every actor. Fix: `actor.isOwner`.
2. **Self/on-use Active Effects are not applied** by the activity in the harness (Rage and Inner Beast on Tyrell/Serica, Flaming Duality Ignited/Godspeed on Alice/Calder, Patient Defense Dodging, Slippery Devil Refuge/Taunt, Defense Roll, Chemical Cocktails, Enhanced Defenses, Propulsion Armor, Zoan Enhanced Form, Elemental Body, Carving Inspiration, Poison Strike etc.; 82 activities run, all linked effects present on the item and linked in the activity, none created on clone or target). Haki template effects and Concentrating do appear. Likely cause: the broken op5e handlers (item 1) for Rage/Duality/Inner Beast, and Midi `autoItemEffects` behaviour for the rest; needs a run in the real GM session to confirm.
3. **Fruit-power spells need a spell slot as well as a Devil Fruit Use.** With no slots the use is refused ("You have no available Nth Level spell slots"): Commander Leon (Embody Flames, Fireball, Wall of Fire), Serica (Construct Cannon), Veyl (Fly, Water Walk, Haste, Thunderwave), Irik (Mirror Image, Misty Step) have no slots at all; Dravos and Cassian, Alice, Ensign have slots 0/N as imported (a long rest fixes those, B2). With injected slots they work but spend both a slot and a fruit use. Fix: spell activities in `op5e/dev/generate-foundry-actor/` fruit-power builders should use innate/at-will method (no slot) with the fruit-use consumption.
4. **Commander Leon, Logia Elemental Domain / Elemental Body**: consumption target is the item itself, which has no uses max: "No uses on Logia Elemental Domain available to spend". Cannot be used.
5. **Alice Fireball** (Flame Investure) has no level 3 slot (slots 1st/2nd only), blocked as item 3.

### B2 (wrong or misleading, playable)
- Actors imported with 0 current spell slots (Cassian 0/4.., Dravos, Alice, Marine Ensign): need a long rest first.
- Rest: recharge features (Kyle Sandstorm Roar, Soefra Soundless Crescendo, Kanto Prismatic Breath, Sphinx Wing Buffet) stay 0/1 after short and long rest (dnd5e recharges at turn start; intended, note only).
- Goru and Kaen "Regain Second Wind" (consumption -1) still adds a use at 1/1 (no cap shown); minor.
- Typeless damage parts (no damage type, resist/immune will not apply): Ardent Smite 2d8 (Alice, Cadence), Exploding Shot 1d6 (Drez, Petty Officer, Tariq), Ken Die 1d4+@prof (Goru).
- Marine Ensign "Mechanical Improvements": `system.traits.dr.value|0|poison` uses mode CUSTOM(0), should be ADD(2).
- `@scale.brawler.unarmored-movement`: resolved on Veyl (walk 140 = 30+10 Mobile+90 Speed-Speed+10) and Tyrell (55); known Baptiste error not re-reported.
- Irik Fen sheet Dex 20 / Int 14 vs NPC-BUILDS Dex 18 / Int 13 (doc stale or build changed).
- Spell activities that have a level 0 "Guidance"/touch range require adjacency (harness placed target adjacent in the re-run; works).

### B3 (cosmetic / environment)
- Missing item icons (404): `icons/weapons/fists/gauntlet-armored-steel.webp` (Marine Ensign), `icons/commodities/biological/spikes-white.webp` (Morrow), `icons/creatures/claws/claw-pincer-crab.webp` (Hermit Crab). 198 unique images checked, all actor portraits/tokens resolve (placeholder art noted as known).
- `dice-stats` module throws in `midi-qol.RollComplete` hook on every damage roll (`reading 'length'`): not op5e.
- Deprecation warnings: `senses.darkvision` etc. moved to `senses.ranges.*` (dnd5e 6.1 removal), `renderChatMessage` hook (Foundry v14).
- Sequencer/autoanimations errors on headless canvas (null token id, stretchTo): environment.
- 15 save/consumption static identifiers like `spirit`, `bardic-inspiration`, `devil-fruit-uses` are written as identifiers in source and resolve to item ids at prepare time: working (refusal at 0 uses verified for all).

## Verified OK
- Stats computed vs NPC-BUILDS: HP, AC, prof, scores, DC match for Cadence (HP 210, AC 18, DC 17), Facade (183, 16, 17), Kyle (255, 18, DC 18, Cha 20), Kaen (318, 19), Tyrell, Veyl (146, 18, walk 140), Serica (161, 16), Chuckles, Calder, Leon (210, 18), Drez, Petty Officer, Alice, Cassian, Dravos, Ensign, Goru, Khael, Cecilia, Tariq, Saeva, Vesper, Mikey (32/13), Morrow (60/14), Hermit Crab (160/17), Marine Warship (AC 17, HP 1200, 4.5 mi). No NaN in any skill or save. Passive effects check out in derived values (Alert +5 init, Mobile, Defense, Unarmored Defense, Fast Movement).
- All attack and damage activities roll and apply damage to targets via Midi (damage applied, half on save for Cadence Absolute Imperative DC 17 Wis, Kyle Riddle 12d8). Consumption decrements and refuses at 0 on every item-uses consumer (Facade, Cadence, Calder, Tyrell, Kyle etc.). Rests: short/long rest refill the right pools (Facade Color of Armament sr, others lr) and HP.
- Cadence four fruit powers present (Fiat 3/lr, Absolute Imperative DC 17 3d8 psychic, Crushing Mandate, Lingering Order). Kanto legendary claw rolls 3d10+5 and Bite 4d12+5. Marine Warship Swivel/18/36-pounder Fire rolls (attack +0).

## Summary table

| Actor | Activities run | Throws | Blocked (no slot / uses / range artefact) | Non-transfer effects (applied on use) | Stats ok | Sheet |
|---|---|---|---|---|---|---|
| Afterimage | 0 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Alice | 26 | 0 | slot-gated spells | 8 (0 applied in harness) | yes | renders |
| Cadence | 29 | 0 |  | 4 (0 applied in harness) | yes | renders |
| Calder Voss | 22 | 0 |  | 3 (0 applied in harness) | yes | renders |
| Cassian Valehart | 24 | 0 | slot-gated spells | 0 (0 applied in harness) | yes | renders |
| Cecilia Moore | 29 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Chuckles | 15 | 0 |  | 2 (0 applied in harness) | yes | renders |
| Clone | 1 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Coast Guard | 5 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Commander Leon | 38 | 0 | slot-gated spells | 4 (0 applied in harness) | yes | renders |
| Dravos | 44 | 0 | slot-gated spells | 8 (0 applied in harness) | yes | renders |
| Drez Crown, Captain of G-45 | 14 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Facade | 16 | 0 |  | 1 (0 applied in harness) | yes | renders |
| Goru Yamashita | 19 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Irik Fen | 24 | 0 | slot-gated spells | 4 (0 applied in harness) | yes | renders |
| Jay | 28 | 0 |  | 1 (0 applied in harness) | yes | renders |
| Judith | 8 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Kaen Solaris | 28 | 0 |  | 3 (0 applied in harness) | yes | renders |
| Kanto (Fenrir) | 18 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Khael Dhamar | 13 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Kyle Sollen | 56 | 0 |  | 3 (0 applied in harness) | yes | renders |
| Lady Soefra Anthem | 27 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Marine Ensign (Armor Mk IV) | 12 | 0 |  | 2 (0 applied in harness) | yes | renders, 2 broken img |
| Marine Warship | 6 | 0 |  | 0 (0 applied in harness) | yes | renders |
| May | 19 | 0 |  | 4 (0 applied in harness) | yes | renders |
| Mechanical Cannon | 0 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Mikey | 4 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Morrow | 5 | 0 |  | 0 (0 applied in harness) | yes | renders, 1 broken img |
| Petty Officer Marine | 13 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Pirate Guard | 12 | 0 |  | 3 (0 applied in harness) | yes | renders |
| Saeva Virell | 18 | 0 |  | 0 (0 applied in harness) | yes | renders |
| SeaBeast - Hermit Crab | 7 | 0 |  | 0 (0 applied in harness) | yes | renders, 1 broken img |
| Serica Corven | 28 | 0 | slot-gated spells | 4 (0 applied in harness) | yes | renders |
| Shin | 10 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Sphinx (Kyle Sollen Full Beast Form) | 3 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Sphinx (Kyle Sollen Hybrid Form) | 1 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Tariq Solen | 21 | 0 |  | 0 (0 applied in harness) | yes | renders |
| The Gallows | 15 | 0 |  | 0 (0 applied in harness) | yes | renders |
| The Gallows (Boss) | 20 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Tyrell | 32 | 0 |  | 6 (0 applied in harness) | yes | renders |
| Vesper Grimrose | 15 | 0 |  | 1 (0 applied in harness) | yes | renders |
| Vex | 1 | 0 |  | 0 (0 applied in harness) | yes | renders |
| Veyl Corven | 38 | 0 | slot-gated spells | 6 (0 applied in harness) | yes | renders |

## Retest after fixes (2026-10-11)

Method as above (headless Edge, Midi-QOL workflows, scratch clones in `zz-browser-test` with a scratch scene, all removed afterwards: 0 actors, scenes and folders left). Clones now use linked tokens so the harness reads the same actor it acts on (the first retest read a stale unlinked token copy). Attack rolls use d20 mode normal (`autoFastForward: all`, no dialog click): 4 of 4 Tyrell unarmed attacks were "normal", hits and misses follow the roll against AC. Unit tests 174 pass, `npm run validate` passes. Real actors compared: only the intended rebuilds changed (listed in `docs/NPC-BUILDS.md`, "Browser-test fixes").

| Finding | Result |
|---|---|
| B1-1 `isActorOwner` | Fixed and verified: 8 call sites use `actor.isOwner`; saves on a Tyrell clone roll with no TypeError; test `test/v13-api.test.mjs` forbids the call. |
| B1-2 effects not applied | Two causes, both fixed or explained. (a) op5e handlers (Rage, Inner Beast, Flaming Duality, Flame Investure, Bubble Floater, Giant's Endurance) never fired on real actors because they matched the compendium item id, which embedded copies do not keep, then (after matching) spent uses through the ignored `uses.value` and used non-existent advantage flag keys. Fixed in `scripts/feature-hooks*.mjs`; verified Rage, Inner Beast, Inner Beast Sulong (own effect), Flaming Duality Ignited/Godspeed (Alice, Calder; speed 30 to 40) create their effects and spend uses. (b) Every other self and on-use effect (Dodging, Slippery Devil, Chemical Cocktails, Enhanced Defenses, Propulsion Armor, Zoan Enhanced Form, Elemental Body, Carving Inspiration, Poison Strike, Seastone, Haki...) was linked correctly; the world's Midi-QOL setting `autoItemEffects` is `off`, which defers to the chat card's "Apply to selected tokens" button (clicked in the harness: works). With `applyLeave` all linked effects are created on the self or target (18 actors checked; only effects behind a failed save did not land, as intended). Setting restored to `off` after the test. Decision for the GM: set Midi "Auto apply item effects" to apply-and-leave-button for automatic effects. |
| B1-3 fruit creations need a slot | Fixed and verified: Leon (Embody Flames, Fireball, Wall of Fire, Fire Bolt), Serica, Veyl, Irik, Dravos fire with no slots and spend exactly one Devil Fruit Use; Alice's Fireball, Fire Bolt, Elemental Armor spend no slot; Cassian (Bard) spends a real slot (4th 2 to 1). Slots are filled to max on import/sync (Dravos 4/3/3/1, Cassian 4/3/3/2, Alice 4/2). Rule: Sourcebook ch. 6 and the Flame Investure trait text. |
| B1-4 Leon Elemental Body | Fixed and verified (Logia Elemental Domain now 2 uses per long rest, Sourcebook; 2 to 1 on use). The other `spend()` scripts had no such defect, but they all used a raw item id for the Devil Fruit Uses pool, which breaks on duplication; now the identifier `devil-fruit-uses`. |
| B2 typeless damage | Fixed in the compendium source (Ardent Smite, Exploding Shot, Ken Die) and in the rebuilt Alice, Cadence, Drez, Petty Officer, Tariq, Goru. Verified in the build output; the compendium pack on the server needs a restart to serve it (see below). |
| B2 Ensign poison resistance mode | Fixed (ADD) for all five racial features that used CUSTOM. |
| B3 missing icons | Fixed: Ensign gauntlet, Morrow spikes, Hermit Crab pincer use existing core icons (verified to exist on the server). |
| B3 dice-stats error | Not op5e: the third-party module throws in its own `midi-qol.RollComplete` hook on every damage roll. Documented, no change. |
| Prepared Savant/Gadgeteer creations | Fixed (Alice, Cadence, Facade, Ensign). |
| Medium Armor Master Dex cap | Fixed (Gallows 17, Gallows Boss 17, Petty Officer 17). |
| Gallows Boss Devious Strike | Fixed. |
| Irik sheet Dex/Int | Doc was stale; sheet (Dex 20, Int 14) is right, doc corrected. |
| Goru/Kaen Regain Second Wind, recharge features at 0/1 after rests | Unchanged (known, minor / by design). |

Previously untested, now tested:

| Area | Result |
|---|---|
| Kyle Hybrid and Full Beast, Mikey to Morrow | Found and fixed: Kyle's and Malphas' transform activities opened a compendium browser on every use (`transform.mode "cr"`); now fixed profiles. Verified: use spends a Devil Fruit Use (8 to 7), the chat card carries the target; Hybrid keeps Kyle's stats and adds 60 temp HP; Full Beast gives HP 108, AC 17, Large, Str 20, speed 50, 56 items; Mikey to Morrow HP 60, AC 14, Large, token swaps to the Morrow art; revert restores actor, HP, AC, token image and size in all three. (The use only posts the card; the transform itself is the card's button, driven here with `transformInto`.) |
| Summon placement | Cannon (Facade), Clone (Irik) and Afterimage (Veyl): tokens are created next to the summoner with the right actor, HP and AC, no new actors. The click-to-place crosshair cannot be driven headlessly, so placement was answered with a fixed spot. Irik's Amalgamation and Flora failed ("Actor cannot be found"): the actors were never imported; now imported (OP5E/Sharkfin Pirates, ids kept). |
| Effect expiry in combat | Tyrell clone in a 2-combatant combat: Dodging (1 round) is gone at the start of the next round's turn; Rage (60 s, 10 rounds) is still present at round 3 and gone at round 13. |
| Hit dice and short rest | Rolling a d12 Hit Die heals and reduces the pool; a short rest with auto Hit Dice raised HP 47 to 221 of 240. NPC hit dice come from the HP formula (Tyrell 23d12). |
| Cassian Heart Strings | The power was only intro text; its feature Song of Life and Death was missing: added (text and reaction chat card, not automated). |
| Hermit Crab Pincer and Crush | Pincer hit now applies Grappled and Restrained (it applied nothing); Crush save and damage roll. Claw prone-on-failed-save and Crush's pull are still text only. |
| Alice | Flaming Duality Ignited and Godspeed (speed 40) work and spend a use; Flame Investure chooser spends the Fireball use and opens the creation's cast dialog; Fire Bolt 3 and Fireball 30 damage with no slot. Omni-Adapted and Empowered Godspeed are passive (no activity). |
| Veteran's Edge (Coast Guard, Pirate Guard) | The +1d8 is a transfer effect on weapon damage and shows in the roll formula ("1 + 1d8", "1d8 + 1d8 + 3"); the item's own activity only posts the rule text. |

Not fixed or needs the user:
- The compendium packs in `Data/modules/op5e/packs` are locked by the running Foundry server, so only scripts, lang and generated data were deployed (backup of the previous 0.2.18 install: `D:/foundry-pi/Foundry/backups/op5e-module-20261011-1531`, LOCK files excluded). Reload the browser to pick up the scripts; a Foundry restart plus `npm run deploy:foundry` (or a re-copy of `packs/`) is needed for the compendium data fixes to reach newly dragged items. The rebuilt actors already carry the fixes.
- A Flame Investure Fireball cast straight from its own item is not limited to once per long rest (the trait chooser enforces it).
- Still open from the audit: missing tricks and creations on Drez, Petty Officer, Facade, Ensign, Jay and Kyle; Permanent Haki-Imbuement as a feat; Ensign background feat; Drez AC; Calder armour feat; Alice's second Fighting Style; Shin's Machiavellian Misfit.
