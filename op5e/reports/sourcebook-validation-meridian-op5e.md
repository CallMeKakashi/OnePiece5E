# Sourcebook validation: Meridian Island + OP5E folders (bb-rehearsal)

Read-only audit, 2026-10-11. Live data read from world `bb-rehearsal` (Foundry 13.350, dnd5e 5.3.3, confirmed via `/api/status`), compared with `Sourcebook/` and `op5e/packs-src/`. Nothing was edited, imported or committed (two throwaway dump scripts were created in `op5e/dev/harness/` and deleted again).

Severity: **S1** wrong rules, **S2** questionable or incomplete, **S3** cosmetic. Finding lines start with `- S1:` / `- S2:` / `- S3:`. "see Gn" lines point at the shared findings and are not counted again.

## Scope and method

- 41 actors in `Meridian Island` (15) and `OP5E/` (26): Blackhand, Circle of Clowns, Driftroot, Guardians of Sol, Marines, Sand Rats, Sea Beasts, Shadows/Scorpio, Sharkfin Pirates, Silenced, Sixfold, Soundless 5, Ships. `OP5E/Velencruz` (Cassian Valehart) appeared in the world during the audit (another process is touching the world); it is not in the requested list and was not audited.
- Checked per actor from the live sheet: class and subclass levels, hit dice, saves, skills, feats and their prerequisites, Haki steps, Devil Fruit uses/DC/drawback, AC arithmetic, spells vs class tables, item equip state, placeholders, images on disk under `D:/foundry-pi/Foundry/foundrydata/Data/`.
- Ability scores: brute-force search (point buy 27, race +2/+1 or +1/+1/+1, one +2 per unused ASI slot, +1 per ASI-granting feat). ASI slots are counted from the class tables (Fighter 4,6,8,12,14,16,19; Rogue 4,8,10,12,16,19; everyone else 4,8,12,16,19). Background and role each give one free feat; every other feat is assumed to cost an ASI slot. This accounting is approximate, so "not reachable" findings are S2 unless a hard cap (20) or a documented derivation is broken.
- Could not check: in-play behaviour (transform retaining proficiency, effects actually applying), the exact contents of the compendium spell lists, hull stats for ships (the Sourcebook text has none, only the pack), and whether Human is the Standard Human subrace for the Iron-Willed feat.
- Known intentional overrides (from `docs/NPC-BUILDS.md`, listed separately, not counted as errors): HP set to the DMG CR band for Kyle 255, Tyrell 240, Gallows 182 / Boss 240, Kanto 273, Cadence 210, Facade 183, Soefra 198, Khael 138, Cecilia 135, Tariq 105, Irik 123, Saeva 138, Kaen 318, Vesper 138, Serica 161, Veyl 146, Chuckles 105, Calder 210, Leon 210, Alice 210, Goru 138, Ensign 150, Drez 165 (below band on purpose), guards 36 / 105 / 133 / 148 / 148 / 180, Hermit Crab 160 (legacy, above band); Veteran's Edge, Bodyguard's Build and the other labelled balance features; guards' AC and Kyle's vest base 13; Shin's Machiavellian Misfit at Rogue 4 (user's choice, still listed below as the rule it breaks); Mikey HP below band.

## Shared findings (apply to several actors)

- S1 G1: **Brawler hit die is d8 in the compendium, d10 in the Sourcebook** (`Chapter 2 Classes/Class Features/Class Features 3.md`: "Hit Dice: 1d10 per brawler level"; pack `op5e/packs-src/classes/c037ce09c35842ce.json`). Affects Calder, Chuckles, Leon, Tyrell, Veyl (hit dice, "real" HP formulas, short-rest healing). Fix: set the Brawler class hit die to d10 and rebuild; the stored HP overrides stay as they are.
- S1 G2: **Gadgeteer hit die is d8 in the compendium, d10 in the Sourcebook** (`Class Features 5.md`; pack `bcede8c6f270e89b.json`). Affects Facade and Ensign. Same fix.
- S1 G3: **Marksman saving throws in the pack are Str/Dex, Sourcebook says Dex/Wis** (`Class Features 6.md`; pack `2006ca03f0e1d226.json`). Cecilia and Tariq were fixed by hand; Drez and Petty Officer still have Str+Dex. Pack Gadgeteer saves (Int/Wis) also disagree with the Sourcebook (Con/Int); Facade and Ensign show Con/Int, so the builders correct it per actor. Fix the packs, then Drez/Petty.
- S2 G4: **Savant and Gadgeteer creations are all `prepared = 0`** on Alice, Cadence, Facade, Ensign (Bard/Marksman/Lunarian ones are 1 or 2). Savant, Gadgeteer, Bard and Marksman all prepare a list (`Creativity` class-feature pages), so these show as unprepared on the sheet. Fix: set prepared = 1 on the chosen list (Savant: Cha mod + half level; Gadgeteer: Int mod + half level).
- S2 G5: **Leftover placeholder item "No Devil Fruit (yet)"** (description: "delete this item when that happens") on Coast Guard, Jay, Judith, May, Pirate Guard, Shin, The Gallows, The Gallows (Boss), Tyrell. Fix: delete the item on non-fruit actors.
- S2 G6: **Medium Armor Master's +3 Dex cap is not applied** (Feats.md: add 3 instead of 2 if Dex 16+). Sheets with the feat and Dex 16+ show the capped value: Gallows, Gallows Boss, Petty Officer (each 1 AC low). Fix: add a +1 AC effect or flat bonus, or note it.
- S3 G7: **Guard-tier NPCs have few skill proficiencies** against background 2 + class + role + Human 1: Coast Guard 2 of 7, Judith 3 of 8, Jay 4 of 9, Shin 4 of 8, May 6 of 9, Pirate Guard 6 of 9. Guards came from an approved default list, so this may be intended.

## Actors

### Afterimage (Meridian Island, Gallows summon)
- S3: portrait and token are the stock icon `humanoid-silhouette-green.webp` (documented).
- Not class-checkable. Blitzkrieg Afterimage text was not compared against the summon numbers.

### Alice (OP5E/Blackhand), Lunarian Fighter 6 (Banneret) / Savant 6 (Radiant Superiority), L12, CR 10
- PASS: levels sum 12, prof +4, hit dice d10, saves Str/Con from Fighter, Banneret features (Honorable Beacon, Commander in Chief) at 3, Savant Aura of Protection at 6, Lunarian traits (Darkvision, Omni-Adapted, Flaming Duality, Empowered Godspeed L5, Improved Ignite L10, Flame Investure with Fire Bolt, Elemental Armor, Fireball) match `Lunarians/Lunarian Traits.md`, Haki 2 steps (limit 3), AC 15 = Leather 11 + Dex 4, scores reachable, slots 4/2 match Savant 6, art present.
- S2: only one Fighting Style (Dueling). Fighter 1 and Savant 2 each grant one (`Fighter.md`, `Savant.md`). Add a second.
- S2: Conqueror's Haki needs "Special" (`List of Haki Abilities.md`); she is a Master at Arms, not a Captain, so it must be a DM award. Confirm.
- S2: see G4 (Fairy Lights, Beacon, Branding Smite, Grounding unprepared).
- S3: swim speed 30 with no source (Lunarian has walk 30 + fly 30, no fruit).
- S3: skills 6 vs baseline 7.

### Cadence (OP5E/Silenced), Human Savant 12 (Thundering Resolve), Shire Shire no Mi, CR 10
- S1: Devil Fruit Uses = 6. `Devil Fruits/Shire Shire no Mi.md` is Paramecia (Special); the Paramecia table (`Chapter 6 Devil Fruits/Paramecia Type`) gives 7 uses at levels 11-12. Fix: set 7 (or record that the special fruit uses the Logia/Zoan table).
- S2: scores 8/14/16/10/12/20 are about 1-2 points over what point buy 27 + race + 3 ASI slots (two spent on feats) allows by my count. Check the derivation.
- S2: see G4 (6 creations unprepared; Savant 12 may prepare Cha 5 + 6 = 11).
- S3: no weapon equipped (Mace, Javelin, Dagger carried); Shield and longcoat equipped.
- OK: saves Wis/Cha, hit die d10, HP 12d10+36 plus Tough, slots 4/3/3, fruit DC 17 (8 + 5 + 4), Fruit-Fruit DC item, Ocean's Scorn present, Haki Observation/Armament/Conqueror's Novice (3 steps, limit 3; Conqueror via Captain role), feats legal (Inspiring Leader Cha 13, Tough, Unarmed Master, Iron-Willed needs Standard Human), Thundering Resolve features at 3 and 7 present, AC 18 = longcoat 14 + Dex 2 + shield 2.

### Calder Voss (OP5E/Marines), Lunarian Brawler 12 (Six Powers Master), CR 10
- see G1 (d8).
- S1: ability scores need four ASI-slot uses but Brawler 12 has three (4, 8, 12). Build uses Dex +2, Dex +2, Wis +2 and Flying Strikes (`NPC-BUILDS.md`, Calder). Drop one, or lower Wis/Dex.
- S2: Marine/Soldier "Military Training" feat is Medium Armor Master, which requires proficiency with medium armor; Brawler has "Armor: None" and Lunarian grants none (`Feats.md`, `Class Features 3.md`). Light Armor Master has the same problem. Replace or accept as a story exception.
- S2: skills 5 vs baseline 7 (bg 2 + Brawler 2 + Captain 3, Persuasion is on the Captain list).
- OK: saves Str/Dex, Six Techniques L3, Enhanced Technique L11, Spirit 15 (12 + Free Spirit Wis 3), Unarmored Movement +20 (walk 50), AC 18 = 10 + Dex 5 + Wis 3, Haki 3 steps (limit 3), Flowing Mind prerequisite (Brawler 10) met, Lunarian traits as Alice, Tough HP bonus, spell DC 14 (Con).

### Cecilia Moore (OP5E/Sand Rats), Human Marksman 5 (Bounty Hunter) / Rogue 3 (Thief), CR 5
- PASS: saves Dex/Wis (Sourcebook), tricks 3 and slots 4/2 match Marksman 5, prepared count 4 = Wis 2 + 2, Bounty Hunter Creations / Additional Fighting Style / Huntsmen's Tactics present, Thief Fast Hands + Second-story Work, Rogue 3 kit, scores reachable, AC 15, feats legal (Skulker Dex 13).
- S3: skills 10 proficient vs baseline 9 (+1 for multiclass Rogue), fine; HP is a labelled override.

### Chuckles (OP5E/Circle of Clowns), Human Brawler 5 (Sumo Wrestler), CR 3
- see G1.
- OK: Brawler 5 features (Extra Attack, Stunning Strike, Spirit 5), Sumo Stance/Mountain Stance L3, custom Unarmored Defense Str + Wis (Sumo Wrestler text) AC 15 + Duck and Dodge 1 = 16, Armorless Guardian prerequisite (unarmored) met, feats Performer (Entertainer) and Underdog (Deckhand), scores reachable, art exists.
- S3: token and portrait are the same file.

### Clone (OP5E/Sharkfin Pirates, Irik's Test Subject)
- S3: stock icon portrait and token. Static AC 12 / HP 6 / ability scores 10 (not "equal to yours"); the Sourcebook Clone (`Clone/Clone.md`) scales with the owner's level and is a medic feature, so this is a reflavour. No stat scaling is applied.

### Coast Guard (Meridian Island), Human Fighter 3 (Champion), CR 1/2
- see G5, G7.
- S3: Shield carried, not equipped (AC 13 = Longcoat 12 + Dex 1; with shield 15).
- S3: stock icon art although `coast-guard.jpg` and `coast-guard-token.png` exist on disk.
- OK: Fighting Style, Second Wind (2 uses), Action Surge, Champion Combat Expert + Physical Superiority, HP override at band low end, feats legal (Medium Armor Master from Marine/Soldier, Perceptive), no Haki (L3).

### Commander Leon (OP5E/Marines), Human Fighter 6 (Samurai) / Brawler 6 (Six Powers Master), Mera Mera no Mi, CR 10
- see G1.
- S1: the build derivation uses "Human +1 all" (+6 total). The Human trait allows +2/+1 or +1/+1/+1 (`Human/Human Traits.md`), +3 total. Scores 11/20/14/11/16/13 are not reachable legally; also over by one even crediting every feat.
- S2: "Permanent Haki-Imbuement" is listed as a feat. It is a story/crafting item (`Appendix B Running The Game/Crafting/Experience.md`), not in `Feats.md`. Affinity requirement is met (Armament first). Treat it as a story item and do not charge an ASI.
- S3: Logia Improved Elemental Domain is one item for the level 5 and 10 effects; the level 10 passive immunity cannot be checked from the sheet.
- OK: Logia uses 6 at L11-12, DC 17 (Dex 5 + 4 + 8), Ocean's Scorn, Elemental Domain, Fighter 6 (Fighting Style, Second Wind 4, Action Surge, Extra Attack), Brawler 6 (Spirit 6, Stunning Strike, Unarmored Defense AC 18 = 10 + Dex 5 + Wis 3), Haki 3 steps with prerequisites met, skills 8.

### Drez Crown, Captain of G-45 (OP5E/Marines), Human Marksman 10 (Sniper), CR 10
- see G3: S1 saves are Str/Dex, should be Dex/Wis.
- S1: the build derivation uses "Human +1 all" (+6); legal is +3. Scores 9/20/15/13/15/11 are not reachable (about 3 over).
- S2: no tricks or creations on the sheet at all. Marksman 10 knows 4 tricks and has slots 4/3/2 (slots exist); Sniper Creations feature has no spell items.
- S2: AC 17 = Longcoat 14 + 3, but the Longcoat is medium armour (cap +2, = 16) and he lacks Medium Armor Master. Source of the extra 1 is unexplained.
- S3: Light Armor Master taken but he wears the medium Longcoat (no benefit). Skills 6 vs 9 baseline.
- Known: HP 165, below the CR 10 band (206-220) on purpose.
- OK: Deft Explorer x3 (L1, 6, 10), Land's Stride, Volley, Eagle Eyes, Crackshot (L7), Favored Mark, Archery, Haki Observation Novice + Apprentice (2 steps), feats legal.

### Facade (OP5E/Blackhand), Augmented Gadgeteer 10 (Artillerist), CR 8
- see G2, G4.
- S2: no tricks (Gadgeteer 10 knows 4); only 6 leveled creations (prepared allowed Int 5 + 5 = 10).
- S2: no weapon equipped (Shotgun and Dagger carried).
- S3: 3 mods listed (Extended Barrel, Heavy Artillery, Enhanced Defenses) vs 8 mods known at L10 (active 4, matches the 4-use pool).
- S2: summon Mechanical Cannon has stored HP 5; the Sourcebook says 5 x gadgeteer level (50). Check the summon activity applies it.
- OK: saves Con/Int (Sourcebook), Mastercraft Adept at 10, Tool Expertise, Flash of Genius, Artillerist features L3/5/9 present, Haki Armament Novice + Apprentice (2, limit 2 at L10), scores reachable, AC 16 = shell 14 + Dex 2, art paths exist.

### Goru Yamashita (OP5E/Driftroot), Human Fighter 10 (Samurai), CR 5
- S2: scores 14/18/14/12/14/13 are the "live-sheet" values with no ASIs; they are about 3 over what the rules allow (documented in `NPC-BUILDS.md`).
- S2: "Permanent Haki-Imbuement" listed among feats (see Leon); it is not a feat.
- S3: Samurai "Bonus Proficiency" (L3) is missing; the Samurai Fighting Stances/Elegant Courtier/Tireless Spirit are present.
- S3: Katana and Odachi both equipped (spare Katana is carried); skills 6 vs 8.
- OK: Fighter 10 features incl. Indomitable L9, Tireless Spirit L10, Second Wind 4, AC 16 = Longcoat 14 + Dex 2, Haki 2 steps, feats Diplomat/Observant legal.

### Irik Fen (OP5E/Sharkfin Pirates), Human Rogue 8 (Fencer), Dabu Dabu no Mi, CR 4
- S1: **Ocean's Scorn is missing** (drawback applies on consuming any fruit; present on every other fruit user).
- S2: "Devil Fruit Ability Check, Fruit-Fruit DC and Attack" item missing (Creating A Devil Fruit: DC 8 + highest mod 5 + prof 3 = 16). The sheet's spell DC shows 13 (Int).
- S3: portrait/token path uses `Sharkfin Pirates/` but the on-disk folder is `SharkFin Pirates` (works on Windows only; Saeva uses the right case).
- S3: skills 7 vs baseline 9.
- OK: Devil Fruit Uses 5 (Paramecia L7 value, Rogue 8), Fencer features L3 + L6, Rogue 8 kit (Devious Strike, Uncanny Dodge, Evasion, 2 Expertise), saves Dex/Int, AC 17 = 10 + Int 2 + Dex 5 (Dueling Defense, leather unequipped on purpose), Haki Observation Novice, feats Master Navigator + Keen Mind, scores reachable.

### Jay (Meridian Island), Human Bard 9 (College of Swords), CR 6
- see G5, G7.
- S2: 3 tricks; Bard 9 knows 4 (`Bard.md` table).
- S3: only 9 leveled creations vs 14 prepared allowed (Cha 5 + 9).
- OK: saves Dex/Cha, College of Swords features at 3 and 6, Font of Inspiration, Countercharm, Haki Observation Novice, slots 4/3/3/3/1, AC 15 = coat 13 + Dex 2, Heart Strings (Bard prerequisite met), HP in band.

### Judith (Meridian Island), Human Fighter 8 (Champion), CR 5
- see G5, G7.
- S3: Shield carried, not equipped.
- OK: Signature Fighting Style L7, Second Wind 3, AC 15 = Longcoat 14 + Dex 1, Fearsome Fortitude (Wis save), Armament Novice, feats legal, HP 133 in band, scores reachable.

### Kaen Solaris (OP5E/Guardians of Sol), Human Fighter 20 (Samurai), CR 20
- S1: Str 21 and Con 21 exceed the cap of 20 that every feat in `Feats.md` states ("to a maximum of 20"); total 99 is about 16 above the legal maximum even counting every +1 feat.
- S2: Conqueror's Haki (3 steps) is not from the Captain role; assumed DM award. Prerequisite levels met (Journeyman needs 12).
- S3: Samurai Bonus Proficiency missing; skills 6 vs 8.
- S3: Conqueror's Haki DC is the formula 8 + 6 + 5 = 19; `NPC-BUILDS.md` says 17.
- OK: Fighter 20 features, all 7 ASIs as feats with legal prerequisites (Heavy Armor Master needs heavy armor, Inspiring Leader Cha 13), saves Str/Con/Wis/Cha, Action Surge 3 and Indomitable 4 (incl. Active Combatant), Haki 5 steps (limit 7), AC 19 = 16 + shield 2 + Defense style 1, HP 318 is a labelled override.

### Kanto (Fenrir) (Meridian Island), monster, CR 14
- No class checks. HP 273 and AC 18 in the CR 14 band, prof +5, saves Dex/Con/Wis/Cha. Dragon stat block is custom (no Sourcebook monster). Art is placeholder (documented). PASS within what can be checked.

### Khael Dhamar (OP5E/Sand Rats), Human Fighter 5 (Champion) / Rogue 3 (Thief), CR 5
- S2: scores 15/17/15/10/12/10 are about 6 point-buy points over 27 (and no free stat ASI).
- S3: HP formula text `5d10+3d8+16` gives about 65; the stored 138 is a silent override.
- OK: saves Str/Con, Physical Superiority Strength, Two-Weapon Fighting + Multiple Weapon Style + Additional Strike (prerequisite met), Thief features, Haki Armament Novice, AC 14 (leather 11 + 3).

### Kyle Sollen (Meridian Island), Human Bard 11 (Lore) / Rogue 4 (Inquisitive), Sphinx-Sphinx Fruit (mythical zoan), CR 13
- S1: Cha 22 exceeds the cap of 20 and the total 89 is about 7 above what is reachable.
- S2: 3 tricks; Bard 11 knows 5 (table).
- S3: AC 18 vs vest 13 + Dex 4 = 17; the extra 1 is not documented.
- OK: Zoan uses 8 at L15, DC 19, Hybrid/Full Beast/Enhanced (L10) forms, Ocean's Scorn, Lore features at 3 and 6, Bard 10 features (Expertise, Musical Secrets, Font of Vitality), slots 4/3/3/3/2/1, Haki 2 steps, feats legal (Tough, Skill Expert, Lucky), saves Dex/Cha.

### Lady Soefra Anthem (OP5E/Soundless 5), Human Bard 11 (Bewitchment), CR 9
- S2: Cha 20 with one ASI spent on Lucky and +1/+1/+1 racial elsewhere (Con, Dex, Wis) is not reachable by my count (about 2 short of slots).
- S3: 6 leveled creations vs 16 prepared allowed.
- OK: 5 tricks (matches), slots 4/3/3/3/2/1, Bewitchment L3 + L6 features, Heart Strings, Haki 2 steps (limit 2 at 11), DC 17, AC 16.

### Marine Ensign (Armor Mk IV) (OP5E/Marines), Augmented Gadgeteer 9 (Armorer), CR 7
- see G2, G4.
- S1: Int 20 is not reachable. Both Gadgeteer ASIs are spent on feats (Heavy Armor Master L4, Shield Master L8), so no stat ASI is left; pb 15 + at most +2 race.
- S2: Marine/Soldier "Military Training" feat (Light/Medium Armor Master) missing ("no background feat" in `NPC-BUILDS.md`).
- S2: no tricks (Gadgeteer 9 knows 3).
- S3: Heavy Armor Master needs heavy armor proficiency; Armorer grants it (`Armorer.md`), ok.
- OK: saves Con/Int, Armorer L3/5/9 features, Mods 3 active (L9), Armorer HP/AC (suit plate 18 + 1 + Cyborg 1 = 20), no Haki (documented).

### Marine Warship (OP5E/Ships), Galleon
- OK: speed 4.5 mph, 60 crew, 90 passengers, 300 tn match the Galleon row (`Mounts and Vehicles/Ships and Waterborne Vessels.md`); guns 2d8 swivel, 4d10 18-pounder, 8d10 36-pounder match the cannon table. AC 17, HP 1200, threshold 30 match the pack Galleon; the Sourcebook has no hull stats to compare. PASS.
- S3: mixed broadside counts (4/4/2) are the user's pick; no Sourcebook limit read.

### May (Meridian Island), Human Rogue 9 (Assassin), CR 6
- see G5, G7.
- S3: "Floral Silk Coat" is AC 11 here and AC 13 on Jay (same item name).
- OK: Assassin L3/6/9 (Opportunist), Devious Strike, Uncanny Dodge, Evasion, 2 Expertise, saves Dex/Int, Dodge Roll prerequisite (Dex 16) met, Haki Observation Novice, AC 16 = 11 + Dex 5, HP in band.

### Mechanical Cannon (OP5E/Blackhand, Facade summon)
- S2: stored HP 5 vs 5 x gadgeteer level (50 for Facade) in `Artillerist.md`; AC 18 correct. Only an "Activation" item (no cannon-type features). Check the summon activity's HP override.
- S3: stock icon art.

### Mikey (OP5E/Driftroot), CR 1 beast / Morrow (OP5E/Driftroot), CR 3
- No Sourcebook stat block exists (documented, homebrew). Numbers match `NPC-BUILDS.md` (Mikey HP 32, AC 13; Morrow HP 60 = 8d10+16, AC 14, Large). Transform link present. PASS within what can be checked. (An older `Morrow` also sits in `Archived`, out of scope.)

### Petty Officer Marine (OP5E/Marines), Human Marksman 4 (Sniper), CR 2
- see G3: S1 saves are Str/Dex, should be Dex/Wis.
- S1: Color of Armament Novice at level 4. It needs level 8 (`List of Haki Abilities.md`, "Prerequisites: 8th level"); the doc says it was added by hand.
- S2: no tricks (Marksman 4 knows 3) and no Sniper creations as items although slots (3 first-level) exist.
- S2: the derivation uses "Human +1 all" (+6); legal is +3 (final scores are still reachable another way).
- S2: see G6 (Medium Armor Master, Dex 17 should give AC 17, sheet 16).
- OK: HP 36 computed (4d10 + 8), Sniper features L3, Archery, Deft Explorer, Lucky (role), feats legal, art exists.

### Pirate Guard (Meridian Island), Human Rogue 6 (Swashbuckler), CR 3
- see G5, G7.
- S3: stock icon art.
- OK: Swashbuckler L3 + L6 features, 2 Expertise, Devious Strike, Uncanny Dodge, feats Alert + Mobile, AC 14, HP 105 (heavy for a mook, documented).

### Saeva Virell (OP5E/Sharkfin Pirates), Human Fighter 5 (Champion) / Barbarian 3 (Blade Master), CR 5
- S2: Str 18 / Con 18 vs documented 17 / 17, and the total is 1 above what is reachable (no free stat ASI, two +1 feats).
- S3: Barbarian multiclass is missing Unarmored Defense (level 1 Barbarian feature).
- S3: HP formula `5d10+3d12+32` gives about 85; stored 138 is a silent override.
- OK: saves Str/Con, Rage 3 uses, Reckless Attack, Danger Sense, Primal Knowledge, Blade Master Masterful Hew + hews + Versatile Fighting style, three Fighting Styles, Haki Armament Novice, AC 16 = leather 11 + Dex 2 + shield 2 + Defense 1, feats legal (Scimitar Master needs scimitar proficiency).

### SeaBeast - Hermit Crab (OP5E/Sea Beasts), custom CR 5 beast
- No Sourcebook stat block (documented). Known: HP 160 above the CR 5 band (131-145), documented as legacy.
- S3: HP formula `17d20 - 17` with Con 17 (+3 would be +51); the stored 160 is not derived from the formula.

### Serica Corven (OP5E/Sixfold), Human Barbarian 8 (Cannoneer) / Rogue 4 (Swashbuckler), Buki Buki no Mi, CR 7
- S1: Devil Fruit Uses = 6; Paramecia table gives 7 at levels 11-12 (and `NPC-BUILDS.md` itself says "of 7").
- S2: scores 19/16/16/8/12/10 not reachable by my count (1 stat ASI left).
- S3: "Paramecia Improved Usage" is a single item though levels 5 and 10 both grant it; skills 10 vs 8 baseline.
- OK: Barbarian 8 kit (Rage 4 uses, Danger Sense, Extra Attack, Fast Movement, Feral Instinct), Cannoneer L3 + L6, Rogue 4 kit, saves Str/Con, DC 16 (Str 4 + 4 + 8), Ocean's Scorn, Haki 3 steps, AC 16 = 10 + Dex 3 + Con 3, Cannon Master prerequisite (Dex 13) met.

### Shin (Meridian Island), Human Fighter 8 (Brute) / Rogue 4 (Thief), CR 8
- see G5, G7.
- S1: Machiavellian Misfit requires 10th level minimum and Rogue class (`Chapter 7 Additional Powers/Machiavellian Misfit`); he is Rogue 4. Known and user-approved; flagged as the rule it breaks.
- OK: Brute Force + Unstoppable Durability (L7), Second Wind 4, Thief features, Haki Armament Novice, feats Alert + Tough, AC 17 = 11 + Dex 4 + shield 2, scores reachable (4 ASI slots), HP 180 override.

### Sphinx (Kyle Sollen Full Beast Form) / Sphinx (Hybrid Form) (Meridian Island)
- OK: full-beast HP 108 = 7 x 15 + Con 3 (mythical zoan rule, `Zoan Type.md`).
- S2: both actors are CR 0 with proficiency +2; the zoan rules say the form keeps the owner's proficiency (+5). Cannot confirm the transform activity merges it.
- S3: Hybrid portrait path `Kyle-hybrid.jpg` is `kyle-hybrid.jpg` on disk (case differs).

### Tariq Solen (OP5E/Sand Rats), Human Marksman 5 (Sniper), CR 3
- S3: no Role (not a ship crew member); default sheet art (documented).
- OK: saves Dex/Wis, tricks 3, slots 4/2, prepared 3 + 4 always-prepared Sniper creations, Archery, Alert (Wanderer), Fearsome Fortitude, scores reachable, AC 15.

### The Gallows (Meridian Island), Human Fighter 7 (Blitzkrieg) / Rogue 3 (Bruiser), CR 8
- see G5, G6 (AC 16, rules give 17 with Medium Armor Master and Dex 18).
- OK: Blitzkrieg Afterimage, Rapid Action, Blink of an Eye (L7); Bruiser Hired Thug + Armed and Dangerous; Multiple Weapon Style prerequisite (Two-Weapon Fighting) met; Brave + Medium Armor Master + Dual Wielder; Second Wind 4; scores reachable; HP override.

### The Gallows (Boss) (Meridian Island), Fighter 10 / Rogue 5, CR 12
- see G5, G6.
- S2: Rogue 5 should have **Devious Strike** (Rogue table, level 5); only Uncanny Dodge is present.
- OK: Supersonic (L10), Indomitable, Haki Armament Novice + Apprentice, Second Wind 5, legendary resistance/actions present, HP 240 override.

### Tyrell (Meridian Island), Mink Barbarian 8 (Pugilist) / Brawler 7 (Sumo Wrestler), CR 12
- see G1, G5.
- S2: scores 20/14/18/8/12/10 not reachable by my count (stat ASIs plus Charger +1; Mink gives +2/+1 only).
- S3: Brawler Unarmed Strike not equipped.
- OK: Barbarian 8 kit, Pugilist L3 + L6, Brawler 7 (Spirit 7, Evasion, Shake it Off, Sumo/Mountain Stance), Mink traits present, Armorless Guardian prerequisite met, AC 17 = 10 + Dex 2 + Con 4 + 1, Haki Armament Novice, feats Tough, Sentinel, Charger, Rage 4.

### Vesper Grimrose (OP5E/Shadows/Scorpio), Human Rogue 8 (Assassin), CR 5
- S2: scores 10/18/15/13/12/10 have no free stat ASI (Poisoner and Mobile took both) and are about 1 over by my count.
- S3: skills 7 vs 9 baseline (documented duplicate Stealth pick).
- OK: Assassin L3 + L6, Rogue 8 kit, saves Dex/Int, Cheater Cheater prerequisite (Deception) met, no Haki (documented), AC 15, Skill Expert + Poisoner + Mobile at 4/8.

### Vex (OP5E/Blackhand)
- S3: 2014 SRD Baboon copy, CR 0, unchanged, placeholder art (documented). Not an OP5e build.

### Veyl Corven (OP5E/Sixfold), Human Rogue 8 (Swashbuckler) / Brawler 4 (Six Powers Master), Soku Soku no Mi, CR 6
- see G1.
- S1: Devil Fruit Uses = 6; Paramecia table gives 7 at levels 11-12.
- S2: scores 10/20/14/10/16/12 not reachable by my count (1 stat ASI left, Alert and Mobile both feats).
- S3: "Paramecia Improved Usage" single item; Brawler Unarmed Strike unequipped.
- OK: Swashbuckler L3 + L6, Rogue 8 kit, Brawler 4 (Spirit 4, Six Techniques, Deflect Missiles), DC 17, Ocean's Scorn, Haki 3 steps, AC 18 = 10 + Dex 5 + Wis 3, feats legal, saves Dex/Int.

## Clean actors

No finding at all: **Marine Warship** (S3 only, none real), **Mikey/Morrow**, **Kanto** (limited to what the Sourcebook covers). Of the class builds, none is fully clean; the lightest are Chuckles (G1 only plus art), Cecilia, Judith, Pirate Guard, May and Jay (placeholders, G7 and one trick/caster count each).
