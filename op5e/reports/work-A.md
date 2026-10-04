# Work A: class / race / item mechanics

tsc --noEmit: no errors in my files. No build, harness or commit.

## Files
- NEW data/src/automation/work-a.ts (registered with one line in automation/index.ts)
- NEW scripts/summon-clone.mjs, scripts/effect-groups.mjs (both added to module.json esmodules)
- EDIT data/src/class-features/class-content.ts, data/src/items/special-gear.ts, data/src/items/gear.ts, data/src/automation/ship-gear.ts, data/helpers/spec.ts (area.width), data/src/summons/group-d.ts (comment)

## Done
1. Multipod Ambidextrous: "Off-Hand Damage Modifier" bonus-action damage activity (max of Str/Dex mod); dnd5e has no off-hand hook, rule text kept.
2. Gadgeteer mods: Defs now carry native `system.identifier` + `system.prerequisites {level, items:[subclass id], repeatable}` (Replicate Mastercraft Item repeatable). Pools split in code: coreMods (7, Mods.md), mastercraftMods (11, Actions.md), specialisations (5: Wrought Warden, Omega Operative, Chemistry Menagerie, Versatile Elements, Airborne Aegis; level 6 + subclass). The Mods ItemChoice (modUuids = all three) is filtered by those prerequisites, so a level-2 pick cannot offer 6th-level or other-subclass mods. The specialisations already had stat/effect activities.
3. Clone ability scores: hook `dnd5e.preSummonToken` copies the summoner's six scores into the token delta for profile "Clone" (dnd5e effect values cannot see the summoner).
4. Hews: the book has no "known" count (choose per attack), so all four stay granted, now with activities (cleave 5/10 ft, raging bonus, savage, crushing, sprinting). Storm Herald: Raging Storm / Stormy Soul / Fury of the Storm option features each get a "Choose X" utility applying a marker (Stormy Soul also the resistance) with `flags.op5e.effectGroup`; effect-groups.mjs removes the previous one of the group. Fury and aura damage/saves are real activities. Spirit Speaker: book lists no options, nothing to do.
5. Black Blade (weapon, Longsword chassis, not magical, +2 damage part), White Weapon (+2 attack bonus), Heat Javelin (+1 Lance), Eisen Whip (+1 Whip, 60 ft), Flash Gun (+1 Pistol), Heat/Jet Dial attach activities (+1 weapon effect, group "weapon-plus-one" so they don't stack), Jet Dial Gust of Wind. Chain Shot line template (5 ft wide, 200 ft) and Flame Dial shot (10 ft wide); ammo renamed "Flame Dial (Cannon Shot)" to stop the name clash with the dial item.
6. Seastone armor/weapons and the rest of the triage (M) list were already done by W4; the Chapter 4 tables are covered by the reference journal.

## Could not express
- Heat Dial "fire damage instead", Jet Dial "+1 die size", Resistant Armor choices: noted in the activity text, applied by hand.
- Chain Shot / Flame Dial line length equals the firing cannon's range (120-250 ft): template fixed at 200 ft.
- Clone "proficient in 3 skills you are": not copied.
- Black Blade/White Weapon base weapon is my choice (book: any); Longsword.
