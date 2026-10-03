# W1 summary (races / origins wiring)

Files changed: data/src/backgrounds/{origin-advancement,equipment-grants,roles}.ts; data/src/items/{index,origin-gear(new)}.ts; data/src/racial-features/{giant,augmented,human,merfolk,sky-islander}.ts; data/src/races/giant.ts. tsc: no errors in these files (pre-existing errors elsewhere untouched). Nothing built.

Done
- Giant: Wotan "Size and Speed" feature (size huge, walk 35, swim 35 effect), Ice Giant "Speed" (walk 60), Ancient Thick Skin (AC calc custom 14+Con), Titanic Strength (str check roll min 10); Damage Spread text added to Giant description.
- Origin parser: every role Bonus Feat is an ItemChoice (book's 6 suggestions, allowDrops so any feat); Wanderer any-feat ItemChoice (whole feats pack + drops); Blacksmith Master Smith ItemChoice; weapon Trait advancement for Lumberjack, Miner, Sniper (2 ranged), Swordsman (2 melee piercing/slashing).
- Chimera Beast Body: 3 disabled transfer effects (fly 30 / swim 30 / climb 30 + burrow 10), enable one.
- Sky Islander: Aircraft Expertise Trait (Dial kit prof, Vehicles (Sky) prof + expertise); Ancient/Battle/Artisan Dials ItemChoice advancements (trick L0, 1st-level L3, 2nd-level L5, school-restricted).
- Kuja Amazonian Bond grants Animal Friend; Merfolk Call for Aid grants Call Beast; Standard Human Resourcefulness skill-or-weapon choice; Helmsman Ocean Tamer swim = walk effect (role now takes effects).
- Master at Arms: choice of all 45 simple/martial weapons (no ship guns/unarmed).
- Equipment: new items Devil Fruit Encyclopedia, Artwork, Jewelry (150,000), Map of Area, Warm Coat, Lucky Charm; granted by Librarian, Artist, Jeweler, Navigator, Helmsman. "X or Y" kits now ItemChoice for Detective, Revolutionary, Librarian, Navigator, Archaeologist, Gambler.

Not done / caveats
- Multipod Ambidextrous: dnd5e has no hook for off-hand damage modifier; left as text. Mink Natural Weapons/Inner Beast/Electro untouched. Sharptooth 1d8 already present.
- Weapon Trait keys only cover weapons with a baseItem; cutlass, katana, odachi and all firearms cannot be keyed (Sniper/Swordsman pools omit them).
- Dials levels 3/5 and Blacksmith/Wanderer choices rely on dnd5e honouring non-zero advancement levels on feat/race items (same as existing Lunarian L3/L5 grants); creative ability choice and per-long-rest uses remain on the feature text/uses. Blacksmith's Master Smith ItemChoice cannot be skipped to pick the +1 mastercraft option (text-only).
- Bonus feat "any feat" is via drops, not a full pool.
