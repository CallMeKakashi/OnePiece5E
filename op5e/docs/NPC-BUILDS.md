# NPC builds (Meridian Island arc)

How the arc's NPCs were built, so any of them can be rebuilt or changed. Everything is standalone JSON (no `Compendium.op5e` references, no DAE flags) written to `Foundry/actors-json/` (gitignored, regenerable). All of them live in the world folder **Meridian Island**.

**Method.** Every class-based NPC uses the real pipeline (`npm run actor:build -- --spec @<spec> --out <file>`), so classes, subclasses, features, kit and Haki are real compendium data. A second spec builds the second class of a multiclass and the custom script merges it. The custom script then adds the homebrew, the Chapter 7 additional power, spells, and a CR balance pass. `refresh-from-packs.ts` copies the automation (activities, effects, uses) from the built packs onto the embedded features, because the pipeline embeds raw class data that has none; `standaloneSummons()` exports a summon actor and rewrites the profile to a world id.

Rules used for every build: every creation choice comes from the user (or an approved default list for the guards); non-fruit characters get one Chapter 7 additional power; the CR balance pass is automatic (a straight class build lands well under its CR, so HP is overridden to the DMG band and a labelled bespoke feature adds damage).

| NPC | Build | CR | Script | Specs |
|---|---|---|---|---|
| Kyle Sollen | Human Bard 11 (Lore) / Rogue 4 (Inquisitive), Sphinx-Sphinx Fruit (mythical zoan) | 13 | `build-kyle-sollen-custom.ts`, `build-kyle-sollen-sphinx.ts` | `kyle-sollen-spec.json`, `kyle-sollen-rogue-spec.json` |
| Sphinx (Full Beast / Hybrid) | Transform targets for Kyle (fixed ids, Kyle's profiles point at them) | n/a | `build-kyle-sollen-sphinx.ts` | n/a |
| Tyrell | Moose Mink Barbarian 8 (Pugilist) / Brawler 7 (Sumo Wrestler), Armorless Guardian | 12 | `build-tyrell-custom.ts` | `tyrell-spec.json`, `tyrell-brawler-spec.json` |
| The Gallows (ally) | Human Fighter 7 (Blitzkrieg) / Rogue 3 (Bruiser), Multiple Weapon Style | 8 | `build-gallows-custom.ts ally` | `gallows-spec.json`, `gallows-rogue-spec.json` |
| The Gallows (Boss) | Fighter 10 / Rogue 5, legendary actions + lair | 12 | `build-gallows-custom.ts boss` | `gallows-boss-spec.json`, `gallows-boss-rogue-spec.json` |
| Coast Guard, Pirate Guard, Judith, May, Jay, Shin | Guards of the island (see `prep-guards.mjs` for every pick) | 1/2, 3, 5, 6, 6, 8 | `prep-guards.mjs` then `build-guards-custom.ts` | written by `prep-guards.mjs` |
| Kanto (Fenrir) | Monster-style young multichromatic dragon, possessed oni | 14 | `build-kanto.ts` | none |

**Rebuild one NPC** (from `op5e/`): `npm run actor:build -- --spec @dev/generate-foundry-actor/specs/<slug>-spec.json --out ../Foundry/actors-json/<slug>-chassis.json` (and the rogue/brawler half the same way, `-rogue-part.json`), then `node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/build-<slug>-custom.ts`. The guards: `node dev/generate-foundry-actor/prep-guards.mjs` then `build-guards-custom.ts [slug]`.

**Tools.** `dev/harness/import-npc.mjs <json> [--folder name] [--keep-id]` imports a new actor and prints the numbers Foundry computes; `dev/harness/sync-npc.mjs <json>` re-applies a rebuilt JSON onto the existing actor in place and keeps the portrait, token and folder; `dev/harness/fight-sim.mjs` is a rough Monte Carlo of Kyle + Tyrell against a party (not a real combat).

**Balance overrides (all labelled on the sheets).** Kyle: HP 255, vest base AC 13, Khopesh 4d8 + Sunbrand Verdict 4d6, bespoke Multiattack, Riddle 12d8, Sandstorm 10d8. Tyrell: HP 240, Bodyguard's Build +2d8. Gallows: HP 182 / 240, batons 2d6 / 3d6. Guards: HP at the low end of their CR band plus Veteran's Edge (+1d8 to +3d8 weapon damage). Kanto: HP 273, AC 18, DC 18.

**Known gaps.** The Machiavellian Misfit power (Shin) asks for 10 Rogue levels and he has 4 (the user's choice). Armor Class of Judith and the Coast Guard (17) is above their CR band. Pirate Guard HP (105) is heavy for a mook. Rough Monte Carlo only: none of the new NPCs has been played in a real fight. Placeholder art on Kanto; the Afterimage summon uses a stock icon.

**Moving them to another world.** `Foundry/actors-json/meridian-island-bundle.json` plus `meridian-island-import-macro.js` recreate the folder and all 14 actors with ids kept (the transforms and the Afterimage summon point at actors by id). The bundle is exported from the rehearsal world, so it carries the portraits and tokens set there.

## Validation and world cleanup (2026-10-08)
- `dev/harness/npc-validate.mjs` checks every Meridian Island NPC (and `--world` the whole world, read-only): HP and AC against the DMG band for the CR (HP bands: CR 1/2 36-49, 3 101-115, 5 131-145, 6 146-160, 8 176-190, 12 236-250, 13 251-265, 14 266-280), every damage formula and uses value, effects that really apply (Veteran's Edge, Bodyguard's Build), spells and slots, boss resources, transform and summon targets, one body armour equipped, and every image. All 14 pass.
- Fixes from it: HP of Kyle (255), Tyrell (240), the boss Gallows (240) and the Pirate Guard (105) moved to their real band; Coast Guard, Judith and Jay have the uniform armour (white coats, floral coats) and AC in band; the stale encumbered effect is gone and the encumbrance rule is off in the rehearsal world.
- `dev/harness/fix-images.mjs` repaired 954 broken or default image references in the rehearsal world (old Windows-sync and one-piece-5e paths matched to files that exist, the D&D Beyond importer icons replaced by the system's school icons and stock icons, stock creature icons for monsters whose art is gone, stock icons for items on the grey default). Every change is listed in `reports/image-fixes.json`.
- A harness bug deleted the real Baptiste from the rehearsal copy on Oct 7 (a name-based cleanup in `shop-approval.mjs`). He was restored from the blood-and-brine database files (copied first, not opened in place). The cleanups now delete only their own `[SA]`/`[DEMO]` scratch actors, and `import-npc.mjs` never deletes without `--replace`.
- Emulated fight: `dev/harness/fight-players.mjs` (one headless browser per player user, through the public site) plus the GM session in the Browser pane.

## Decibella and Braveheart NPCs (2026-10-10)

Cadence and Facade were rebuilt from scratch (every choice asked, none carried from the retired Oct 10 Codex builds) and live in the rehearsal world folders `OP5E/Silenced` and `OP5E/Blackhand`. Same method as above: `npm run actor:build -- --spec @dev/generate-foundry-actor/specs/<slug>-spec.json --out ../Foundry/actors-json/<slug>-chassis.json`, then `node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/build-<slug>-custom.ts`, then `dev/harness/import-npc.mjs ../Foundry/actors-json/<slug>.json --replace` and `ensure-<slug>-folder.mjs`.

| NPC | Build | CR | Script | Specs |
|---|---|---|---|---|
| Cadence | Human Savant 12 (Thundering Resolve), Revolutionary, Captain, Shire Shire no Mi | 10 | `build-cadence-custom.ts` | `cadence-spec.json` |
| Facade | Artificial Human (Augmented) Gadgeteer 10 (Artillerist), Smuggler, Scholar, Ricochet Rounds | 8 | `build-facade-custom.ts` | `facade-spec.json` |

- **Cadence:** the four fruit powers come from `Devil Fruits/Shire Shire no Mi.md` (Fiat bonus action 3/long rest; Absolute Imperative action, DC 17 Wisdom, 3d8 psychic and frightened, 3/long rest; Crushing Mandate and Lingering Order passive). Feats Inspiring Leader, Tough, Unarmed Master, Iron-Willed (War Caster and Resilient do not exist in this sourcebook). HP 210, AC 18, DC 17. Balance feature Voice of the Silenced (+2d8 thunder on melee). Conqueror's Haki is present but uncontrolled (flavour).
- **Facade:** mods Extended Barrel, Heavy Artillery, Enhanced Defenses (applied by its Apply activity to a targeted token: AC 16, or 18 once applied). HP 183, DC 17. Balance features: Reinforced Cyborg Shell (light armour, base AC 14) and OHM Targeting Suite (+2d6 ranged). The Mechanical Cannon summon is exported as `facade-summon-mechanical-cannon.json` and must be imported first with `--keep-id`. No homunculus: the Gadgeteer has none (it was a D&D artificer infusion).
- **Validation (live, bb-rehearsal):** folders nested, images load, no duplicate role or Haki, Haki tiers present (Cadence Observation, Armament, Conqueror's Novice; Facade Armament Novice and Apprentice), class and fruit activities present. Passive class features and Ricochet Rounds are text-only, per `automation-status.md`.
- **Not played in a real fight.** Art credit status is in `docs/art-credits.md`.

## Sand Rats, Sharkfin Pirates and Soundless 5 NPCs (2026-10-10)

Issues 52 and 53. Built with the same method as above (`actor:build` spec, then `build-<slug>-custom.ts`, then `import-npc.mjs --replace`). Ability scores below include the Human +1/+1/+1.

| NPC | Build | CR | Script | Specs |
|---|---|---|---|---|
| Lady Soefra Anthem | Human Bard 11 (Bewitchment), Entertainer, Musician, Heart Strings | 9 | `build-soefra-custom.ts` | `soefra-spec.json` |
| Khael Dhamar | Human Fighter 5 (Champion) / Rogue 3 (Thief), L8 | 5 | `build-khael-custom.ts` | `khael-spec.json`, `khael-rogue-spec.json` |
| Cecilia Moore | Human Marksman 5 (Bounty Hunter) / Rogue 3 (Thief), L8 | 5 | `build-cecilia-custom.ts` | `cecilia-spec.json`, `cecilia-rogue-spec.json` |
| Tariq Solen | Human Marksman 5 (Sniper) | 3 | `build-tariq-custom.ts` | `tariq-spec.json` |
| Irik Fen | Human Rogue 8 (Fencer), Navigator, Dabu Dabu no Mi | 4 | `build-irik-custom.ts` | `irik-spec.json` |
| Saeva Virell | Human Fighter 5 (Champion) / Barbarian 3 (Blade Master), Sailor, Deckhand | 5 | `build-saeva-custom.ts` | `saeva-spec.json`, `saeva-barbarian-spec.json` |
| Vex | 2014 SRD Baboon copy | 0 | none | unchanged |

- **Lady Soefra Anthem:** scores Str 8, Dex 15, Con 15, Int 10, Wis 13, Cha 20 (Con, Dex, Wis +1 being applied). HP 198 (override to the CR 9 band), DC 17, gown base AC 14. Balance features: Potent Creativity (+5 trick damage) and Soundless Crescendo (6d8 thunder, DC 17). Bard saves Dex/Cha. Placeholder art.
- **Khael Dhamar:** Str 15, Dex 17, Con 15, Int 10, Wis 12, Cha 10. HP 138 (`5d10 + 3d8 + 16`). Dual Wielder, Two-Weapon Fighting, Multiple Weapon Style, Additional Strike, Armament Novice. Fighter saves Str/Con. Placeholder art.
- **Cecilia Moore:** Str 8, Dex 19, Con 15, Int 10, Wis 15, Cha 10. HP 135 (balance override over real dice, DMG CR 5 band 131-145), Marksman saves Dex/Wis. Ricochet Rounds, Bounty Hunter creations, pistol, cutlass and dagger. Placeholder art.
- **Tariq Solen:** Str 8, Dex 19, Con 13, Int 10, Wis 15, Cha 10. HP 105 (override, DMG CR 3 band 101-115; skills include Acrobatics), Marksman saves Dex/Wis, Archery style, Sniper creations (Advanced Weapon, Retreat, Grounding, Cloud of Daggers). No new art; default sheet image.
- **Irik Fen:** Str 10, Dex 18, Con 15, Int 13, Wis 13, Cha 10. HP 123 (kept override, CR 4 band 116-130; Leather Armor unequipped because Dueling Defense applies only unarmored; art path SharkFin Pirates). Compendium Dabu Dabu no Mi with the Test Subject Clone summon (his Double), plus Bait and Switch. Mirror Image, Misty Step and Bait and Switch each spend a Devil Fruit Use. Uses = floor((8+1)/2) = 4, Paramecia +1 = 5 max, long rest.
- **Saeva Virell:** male. Str 17, Dex 15, Con 17, Int 8, Wis 12, Cha 10. HP 138 (`5d10 + 3d12 + 32`). Styles Dueling, Versatile Fighting and Defense (Fighting Initiate); Scimitar Master. Rage damage bonus equals proficiency bonus, Strength-only by name (the mwak bonus cannot filter by ability). The Javelin stands in for the harpoon. Deckhand tool: Cook's Utensils.
- **Vex:** 2014 SRD Baboon copy, CR 0, unchanged; placeholder art only.
- **Sourcebook-strict rules used:** proficiency bonus from the table (not a fixed value), Marksman saves Dex/Wis, and the Devil Fruit Uses rule (+1 use every odd level, Paramecia +1). Art status in `docs/art-credits.md`. None played in a real fight.

## Kaen Solaris and Vesper Grimrose (2026-10-10)

Same method (`actor:build` spec, `build-<slug>-custom.ts`, `import-npc.mjs --replace`, `ensure-npc-folder.mjs`). Ability scores include the Human +1/+1/+1.

| NPC | Build | CR | Script | Specs |
|---|---|---|---|---|
| Kaen Solaris | Human Fighter 20 (Samurai), Knight, Master at Arms, Tough Customer. Sourcebook has no Paladin, so no homebrew powers. Relics Icarus, Aegis of Sol, Bulwark of Sol | 20 | `build-kaen-custom.ts` | `kaen-spec.json` |
| Vesper Grimrose | Human Rogue 8 (Assassin), Bounty Hunter, Scholar, Cheater Cheater, no Haki | 5 | `build-vesper-custom.ts` | `vesper-spec.json` |

- **Kaen:** HP 318 (override, real 224), AC 19. Icarus is a +3 longsword (3d8 + 8 slashing + 2d8 radiant, about 126 a round, +15 to hit against a +10 band) with a Shed Light bonus action; Aegis of Sol is chain mail with radiant resistance; Bulwark of Sol is a +2 shield with a Guardian's Interposition reaction (1d10 + proficiency). Conqueror's Haki DC 17 against 19 (not raised). Haki: Conqueror's Novice, Apprentice, Journeyman, Armament Novice, Observation Novice. All seven ASIs were feats.
- **Vesper:** HP 138 (override, real 52), AC 15, rapier bumped to 3d8 + 4. Feats Poisoner (level 4) and Mobile (level 8), Skill Expert from Scholar (+1 Dex, Investigation, Perception expertise). Expertise Stealth, Sleight of Hand, Acrobatics, Investigation. The Scholar role's Stealth pick duplicated a Rogue skill. Her spec leaves the Haki step unresolved on purpose.
- **Additional powers added the same day** (every non-fruit NPC needs one): Tariq and Saeva got Fearsome Fortitude, Kaen Tough Customer, Vesper Cheater Cheater. Chosen options must meet the prerequisites in `data/src/class-features/additional/*.ts` (Iron Fury needs Barbarian 10, Sharp Focus Marksman 10, Plan B Gadgeteer, Full Body Armament level 14 and Armament Adept).
- **Campaign items:** the relics plus Facade's Reinforced Cyborg Shell and Soefra's Stained-Glass Gown are in `data/src/campaign-items/npc-items.json`.

## Serica and Veyl Corven (2026-10-10)

Same method; one script builds both (`build-corven-custom.ts`), specs `serica-spec.json`, `serica-rogue-spec.json`, `veyl-spec.json`, `veyl-brawler-spec.json`. Both are level 12 Humans with a Paramecia fruit, so no additional power. The builder empties legacy `damage.parts` that hold `@scale` (Brawler Unarmed Strike was refused on import until it did).

| NPC | Build | CR | HP | AC |
|---|---|---|---|---|
| Serica Corven | Barbarian 8 Cannoneer / Rogue 4 Swashbuckler, Mercenary, Master at Arms, Buki Buki no Mi | 7 | 161 (override, real 117) | 16 |
| Veyl Corven | Rogue 8 Swashbuckler / Brawler 4 Six Powers Master, Acrobat, Helmsman, Soku Soku no Mi | 6 | 146 (override, real 87) | 18 |

- **Fruit powers** map to compendium creations and features (Barrage, Construct Cannon, Burning Blade, Pistol; Water Walk, Fly, Haste, Thunderwave, Afterimage) spending one Devil Fruit Use of 7; Pon Pon Pon and Play with Fire are at will. Homebrew: Snatch, Freight Train, Call and Response, Speed-Speed (effect adds 90 ft, so live walk speed is 140 with Mobile and Unarmored Movement).
- No Dual Wielder +1 AC is applied automatically (Serica shows 16, 17 while holding two weapons).
- Veyl's Insight (Helmsman) duplicated his Brawler pick, so Brawler took Intimidation. Not played in a real fight.


## Chuckles (2026-10-10)

`build-chuckles-custom.ts`, spec `chuckles-spec.json`. Human Brawler 5 (Sumo Wrestler), Entertainer, Deckhand, no fruit, additional power Armorless Guardian. Scores 19/10/16/8/12/14 (16/10/15/8/12/13 base, Human +1 Str/Con/Cha, level 4 +2 Str). Skills: Acrobatics, Performance, Athletics (expertise from Sumo Stance), Survival, Animal Handling, Perception. Greatclub, Painter's Supplies, Disguise Kit; Performer and Underdog feats.

| NPC | CR | HP | AC |
|---|---|---|---|
| Chuckles | 3 | 105 (override, real 43, DMG CR 3 band 101-115) | 16 (Sumo Stance: 10 + Str + Wis, +1 Duck and Dodge) |

- Live in `OP5E/Circle of Clowns` with the existing `Circus Ring/Chuckles-d-clown.png` token; the old CR 1 stub was replaced. The pipeline embedded the Deckhand role twice; the builder dedupes it.
- The Unarmored Defense effect is rewritten to a custom AC formula so Strength replaces Dexterity. Not played in a real fight.

## Calder Voss (2026-10-10)

`build-calder-custom.ts`, spec `calder-spec.json`. Lunarian Brawler 12 (Six Powers Master), Marine/Soldier, Captain role, no fruit, additional power Flowing Mind. Scores 11/20/14/10/17/12 (10/16/14/10/14/12 base, Lunarian +2 Dex +1 Wis, level 4 and 8 +2 Dex then +2 Wis, level 12 feat Flying Strikes +1 Str). Haki: Color of Armament Novice, Apprentice, and Color of Observation Novice. Enhanced Technique specialties: Shave and Tempest Kick. Feats: Medium Armor Master, Tough, Flying Strikes. Skills: Athletics, Acrobatics, Intimidation, Insight, Persuasion.

| NPC | CR | HP | AC |
|---|---|---|---|
| Calder Voss | 10 | 210 (override, real 87, 111 with Tough, DMG CR 10 band 206-220) | 18 (10 + Dex + Wis) |

- CR pass: attack +10 and about 46 damage a round (Extra Attack plus Flurry of Blows) are CR 10; defenses were about CR 6 to 7, so HP is overridden to the CR 10 band as a solo boss. Spirit DC 16 matches CR 10.
- The Sourcebook has no legendary-action rules, so he has none (the old CR 10 sheet's legendary actions were dropped on the user's say-so).
- Lunarian traits are embedded by hand (the pipeline does not grant them): Flaming Duality and its upgrades, Flame Investure with Fire Bolt, Elemental Armor and Fireball (Con creative ability). Ultimate Duality is level 15.
- Live in `OP5E/Marines`. Art is the user's pin (`Marines/calder-new.jpg`, logged in `docs/art-credits.md`). Not played in a real fight.

## Review fixes (2026-10-10, before release 0.2.13)

- **HP bands corrected.** Earlier overrides used wrong DMG bands. The right ones: CR 3 is 101-115, CR 4 is 116-130, CR 5 is 131-145, CR 10 is 206-220. Chuckles 105, Tariq 105, Cecilia 135, Calder 210 (Chuckles was approved at 78 on the wrong band; change it back in `build-chuckles-custom.ts` if wanted).
- **Kaen:** Active Combatant gives Action Surge and Indomitable one extra use each. **Khael:** Physical Superiority is Strength (Athletics expertise). **Tariq:** third Marksman skill Acrobatics. **Serica:** Martial Adept has 2 d8 superiority dice (short rest) and the maneuvers Precision Attack and Menacing Attack (both spend those dice). **Irik:** art folder case `SharkFin Pirates`, Leather Armor unequipped. **Shin:** the Rogue half's skills and expertise are now merged (Athletics, Deception and Intimidation expertise, Persuasion). **Bards (Jay, Kyle, Soefra):** Bardic Inspiration and Harmonic Vitality regain on a short rest once Font of Inspiration and Font of Vitality apply.
- Judith's Wisdom save is legitimate: Fearsome Fortitude grants proficiency in one saving throw.

## Goru Yamashita (2026-10-10)

`build-goru-custom.ts`, spec `goru-spec.json`. Human Fighter 10 (Samurai), Noble, Master at Arms, no fruit, additional power Tough Customer. Live in `OP5E/Driftroot`. The custom class The Fang, MistFrame, the air-elemental summon and the five Forms are dropped (compendium only, user's choice). Scores are the live-sheet 14/18/14/12/14/13 (no ASIs; all feats). Gear: Odachi, two Katanas (one spare), Light Crossbow, Heavy Longcoat. Feats: Diplomat (Noble), Observant (Master at Arms), Katana Master, Great Weapon Master, Permanent Haki-Imbuement. Fighting Style Great Weapon Fighting. Haki: Armament Novice, Observation Novice. Skills: Persuasion, Insight, Acrobatics, Athletics, History, Intimidation.

- HP 138 (override, real about 75) for the CR 5 band 131-145; AC 16, prof +4, initiative +4. Not played in a real fight; no CR damage bump added.
- Art is the user's pin (`Driftroot Isle/goru-new.jpg`, logged in `docs/art-credits.md`); it only loosely matches the brief.

## Mikey / Morrow (2026-10-10)

`build-mikey-custom.ts` (monster-style, no class build, same pattern as Kanto) writes two actors, imported with `--keep-id` into `OP5E/Driftroot`. **Mikey**: Medium beast, CR 1, AC 13, HP 32, speed 40, scores 14/16/14/6/12/10 (live sheet); Keen Hearing and Smell, Loyal Companion, Bite (2d6 + 2). **Transformation: Morrow** (bonus action, 1 minute, once per short rest) is a real dnd5e transform activity pointing at **Morrow (Mikey transformed)**: Large, CR 3, AC 14, HP 60, STR 18, with Feral Frenzy, Morrow Claw (1d8 + 4), Morrow Bite (2d6 + 4), Rend (extra 2d6) and Spiked Hide (1d4). Verified headless: the polymorph form has Morrow's sheet, Large size, 2x2 Morrow token and 60 HP, and revert restores Mikey.

- The monsters pack has no dog; the traits are hand-authored homebrew feats (no Panther copy). Mikey's HP is below the CR 1 band on purpose (a pet). Not played in a real fight.
- Art: Mikey pin for portrait and token; Morrow pin for his portrait and a head crop as his token (logged in `docs/art-credits.md`).

## Marine Ensign (Armor Mk IV) (2026-10-10)

`build-ensign-custom.ts`, spec `marine-ensign-spec.json`. Augmented (Cyborg) Gadgeteer 9 (Armorer, Guardian model), Marine/Soldier, Role: Deckhand, no fruit, no Haki. Renamed Mk III to Mk IV on the user's say-so. Scores 10/15/18/20/12/8 (Int 20 Con 16 Dex 14 Str 10 Wis 12 Cha 8, Augmented +2 Con +1 Dex). Mods: Propulsion Armor (level 2, applied to the suit), Armor of Mechanical Strength (level 6, swap in on a long rest). Feats: Heavy Armor Master (level 4), Shield Master (level 8), Mobile (Deckhand). Skills: Athletics, Acrobatics, Arcana, Medicine (Deckhand skills left unchosen: the suit pilots can't take them). Tools: Smith's, Tinker's. No background feat.

| NPC | CR | HP | AC |
|---|---|---|---|
| Marine Ensign (Armor Mk IV) | 7 | 150 (override, real about 81, DMG CR 7 band 146-160) | 20 (Plate 18 + suit +1 + Cyborg +1) |

- The suit is an equippable Plate Armor item (heavy, magical +1 from Propulsion Armor). Cyborg traits embedded by hand. Propulsion Gauntlets (1d8 force, thrown 20/60, Int) and the Palm Laser (a reflavored Flintlock).
- CR pass: bespoke Suit Overcharge feature adds 2d6 weapon damage. Legacy flight, the four legendary actions and Overcharge Beam were dropped (user's choice; the compendium Propulsion Armor gives no flight).
- Live in `OP5E/Marines`. Art is the user's pin (`Marines/marine-ensign-new.jpg`, logged in `docs/art-credits.md`), hand-painted concept, amber glow instead of cyan. Not played in a real fight.
