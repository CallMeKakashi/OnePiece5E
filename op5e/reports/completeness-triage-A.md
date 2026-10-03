# Completeness triage A: Chapter 1 Races + Chapter 3 Character Origins

Summary: 373 unmatched entries. P=257, R=103, M=13 (plus ~10 doubtful sub-gaps listed under "Wiring gaps", mostly text-only traits that are present but not automated).
Ch1 (57): P 22, R 34, M 1. Ch3 (316): P 235, R 69, M 12.
Verified by grepping packs-src (races, racial-features, backgrounds) and data/src/backgrounds/*.ts.

## Why most entries are P / R
- P: lore headings, DM's notes, "Flying Races" note; Ch3 "Suggested Characteristics / Personality Traits / Ideals / Bonds / Flaws" (5 x 46 = 230 headings). The d8/d6 roleplay tables are NOT in any background doc (only role Dream tables are), pure flavor, low priority.
- R: every "X Traits" heading = the race item (9 races exist). Every sub-race heading is an ItemGrant advancement on the race, titled e.g. cyborg/chimera/artificial-human/revived (Augmented), sharptooth/stronghide/multipod (Fishman), standard-giant/ancient-giant/wotan/ice-giant, standard-human/kuja/long-arm/snakeneck/long-leg/three-eye, diurnal/nocturnal (Mink), birkan/shandian/skypiean. Every trait inside them exists as a racial-feature doc. Each "Feature: X" heading is an `<h4>` in the background description. Each Dream table is in the role description.
- Race base data all verified OK: ASI (3 pts cap 2; Giant 4 pts cap 2), sizes, speeds (Dwarf climb 30, Merfolk 10/swim 40, Lunarian fly 30, Mink/Sky 35, Giant 40), darkvision effects, no Languages line exists in the source.
- Backgrounds: skills pool/count, tools, feat pair, beri (flags.op5e.startingBeri), item quantities (grantQuantities) all match the source for the backgrounds checked, with exceptions below. Roles: skills, tools, beri, kit match.

## M: missing mechanical content

### Chapter 1 Races
- Giants, `Sourcebook/Chapter 1 Races/Giants/Giant Traits.md`
  - Wotan: size Huge, walk 35 ft, swim 35 ft are not encoded. The Giant race is walk 40/swim 0 and sizes huge+grg are both allowed, with no Wotan speed/size feature or effect.
  - Ice Giant: "movement speed of 60 ft" is not encoded (no feature or effect; base is 40).
  - "Optional Rule: Damage Spread" (giant fist/weapon splash, DC like cannons) has no doc or rule text in the giant race or features.

### Chapter 3 Character Origins
- `Roles/*.md` (all 10 roles: Captain, Cook, Deckhand, Doctor, Helmsman, Master at Arms, Musician, Navigator, Scholar, Shipwright): "Feature: Bonus Feat" is text only. The role docs have no ItemChoice and no feat pool. Source: "gain a bonus feat of your choice", with 6 suggested feats listed per role. The origin advancement parser only reads the first `<h4>` (`data/src/backgrounds/origin-advancement.ts`), so the bonus feat is never granted or offered. Needs an ItemChoice (any feat, or the 6 suggestions) per role.
- `Backgrounds/Wanderer.md`: "You gain a feat of your choice" has no ItemChoice (the only background with no feat advancement besides Blacksmith).
- `Backgrounds/Blacksmith.md`: Mastercrafter, "choice of" (a) long-rest +1 mastercraft touch or (b) the Master Smith feat. No feat grant or choice is wired (the Master Smith feat does exist in the feats pack, 7634b9cb4fac5d17).

## Wiring gaps (R but doubtful: present as text, not automated)
- Weapon proficiencies are text only (no Trait weapon grant): Lumberjack (Battleaxes, Handaxes, Greataxes), Miner (Warpicks), Sniper (2 simple/martial ranged), Swordsman (2 simple/martial melee piercing/slashing). `backgrounds.ts` has the "Weapon Proficiencies:" line; `origin-advancement.ts` parses none.
- Chimera "Beast Body" (choice of fly 30 | swim 30 + water breathing | climb 30 + burrow 10): text only, no movement effect. Augmented race movement is walk 30 only.
- Sky Islander subraces: Ancient/Battle/Artisan Dials (trick at L1, 1st-level creation at L3, 2nd at L5, school-restricted, prof-bonus uses) are text only, with no creation grants. Bonus Proficiencies grants the skill and a tool choice (OK). Aircraft Expertise (Dial kits proficiency, Vehicles (Sky) expertise) has no advancement.
- Kuja Amazonian Bond (Animal Friend at will vs snakes) and Merfolk Call for Aid (Call Beast) are text only. By contrast, Lunarian Flame Investure is wired (Fire Bolt, Elemental Armor L3, Fireball L5 granted).
- Human Standard "Resourcefulness" (1 skill or 1 weapon of choice): no choice advancement.
- Fishman Multipod Ambidextrous and Sharptooth Natural Weapons (1d8): text only. Mink Natural Weapons, Inner Beast (Sulong form) and Electro: text only. Ancient Giant Titanic Strength and Thick Skin (AC 14+Con): text only (no AC calc effect).
- Role Helmsman "Ocean Tamer": the swim speed equal to walking speed is text only. Role Master at Arms: the weapon choice is limited to 5 hard-coded weapons (source says any simple or martial weapon).
- Equipment simplifications (minor): Librarian gets a generic Book where the source says Devil Fruit Encyclopedia; Artist's "1 artwork" and Jeweler's "jewelry worth 150,000" are not granted; Navigator's "map of area" is not granted; Helmsman has Blanket where the source says warm coat plus lucky charm; Detective and Revolutionary receive both kits where the source says "X or Y".
