# Final report

## Sourcebook coverage (name-level)
- MISSING: 199
- NOT_APPLICABLE: 99
- AMBIGUOUS: 2
- EXACT: 460
- NEEDS_AUTOMATION: 13

## Foundry validation (static)
- Documents: 2056, internal links checked: 2986
- Errors: 0, warnings: 180 (mostly attack activities without an explicit attack block, and same-name features across classes)

## Automation (executed in the Foundry test world, dnd5e 5.1.10)
- Baseline activity-bearing items executed: 836 (870 activities); 13 first timed out on measured-template placement (harness limitation); all re-ran PASS once the harness skipped templates
- Monsters: 29/29 pass (HP/AC/CR vs stat block, attack roll bonus, damage)
- Ships and cannons: 16/16 pass
- Stable activity ids after embed: 844/844
- Limits: baseline activities are smoke-tested (they run without error). Value assertions exist for monsters, ships, cannons, feats, weapons, armor and passive effects

## End-to-end character tests (built packs, real dnd5e advancement flow)
- Classes levelled 1-20: 9/9 clean; subclasses levelled 1-20: 89/89 clean
- Races applied: 9/9; backgrounds and roles applied: 56/56
- Feats with advancement/effects, value-asserted: 132/132
- Active Effects changing derived data: 57/58
- Weapons and armor (AC and damage dice asserted): 87/87

## Midi-QOL workflows (real attack, damage, save and heal flows with damage applied to a target token)
- ok Warhammer: D20Roll:1d20 + 3 + 0=15 | DamageRoll:1d8 + 3=6 (target HP 200 -> 194)
- ok Battleaxe: D20Roll:1d20 + 3 + 0=21 | DamageRoll:1d8 + 3=11 (target HP 200 -> 189)
- ok Rapier: D20Roll:1d20 + 3 + 0=15 | DamageRoll:1d8 + 3=4 (target HP 200 -> 196)
- ok Longbow: D20Roll:1d20 + 3 + 0=14 | DamageRoll:1d8 + 3=5 (target HP 200 -> 195)
- ok Fire Bolt: D20Roll:1d20 + 0 + 1=19 | DamageRoll:1d10=1 (target HP 200 -> 199)
- ok Fireball: DamageRoll:8d6=30 (target HP 200 -> 185)
- ok Second Wind: DamageRoll:1d10 + 10=14 (target HP 200 -> 200)
- ok Sneak Attack: DamageRoll:6d6=22 (target HP 200 -> 178)

## Every document added to an actor and used (built packs)
- class-features: 749/749 work (231 activities used)
- racial-features: 84/84 work (22 activities used)
- feats: 201/201 work (87 activities used)
- items: 364/364 work (153 activities used)
- creations: 426/426 work (433 activities used)
- backgrounds: 56/56 work (0 activities used)
- devil-fruits: 28/28 work (0 activities used)
- ship-weapons: 8/8 work (16 activities used)
- Class and subclass features were used on a persisted level-20 actor of their class so @scale values resolve; creations on a level-20 Medic with slots; ship weapons on a Galleon

## Regression vs baseline
- Baseline documents: 1973; preserved identical: 1971; changed: 2 (Manipulate Earth, Flaming Duality); regressed: 0; added: 83

## Remaining issues (17)
- **28 items** (devil-fruits): source gives prose powers with no dice/DCs/durations; no mechanics invented [blocked]
- **8 items** (ships): AC/HP/slots aligned to ship by table row order (source table has no row names) [blocked]
- **5 items** (spell-lists): extracted from scrambled two-column PDF text by name matching; [blocked]
- **Ship stat rows** (ships): AC/HP/slots table in Cannons.md has no row names; aligned to ship table by order (8 rows = 8 ships, values plausible) [generated, needs confirmation]
- **Cannon availability rows** (ship-weapons): Clean and Reload / Ship Availability table has no row names; aligned to cannon table by order [generated, needs confirmation]
- **Ship speed units** (ships): Speeds are mph; stored as movement.swim with units mi. Foundry has no native mph unit [generated]
- **Lute** (items): Named in Bard starting equipment but absent from the Tools table; price/weight taken from 5e SRD (35 gp x10000) [generated, needs confirmation]
- **Ship Rooms / Upgrades** (-): Source text is column-scrambled (PDF extraction); room effects cannot be reconstructed reliably [blocked]
- **Creation creature sheets (Appendix A Actions)** (-): Stat lines scale with the creator's level and creation attack/save DC; need a scaling design decision [not generated]
- **Creations missing from the compendium** (creations): Vitriolic Sphere (Medic, Gadgeteer lists) and Mind Prison (Bard, Gadgeteer lists) have no description anywhere in the sourcebook text, so they could not be built [missing]
- **Backgrounds: unmapped tools / feats** (backgrounds): Fisherman (Fishing Tackle), Scientist and Slave (generic tool phrases) tool proficiencies, and Swordsman/Sniper "weapon mastery feat" choices are left as text [partial]
- **Feats: conditional or choice-heavy wording** (feats): Only unconditional sentences are wired (ability increase, named skill/tool/save proficiency, +5 initiative, Tough HP, passive bonuses). Expertise-if-already-proficient, speed/AC/resistance with conditions, and weapon/firearm proficiencies stay manual [partial]
- **Multi-option class features** (class-features): 30 features (Channel Conviction options, Area Strike, Six King Gun, ...) describe several conditional options that one activity cannot represent [manual]
- **Creations without single damage roll** (creations): 64 of 82 flagged creations are summons, buffs or multi-effect spells; only 18 have an unambiguous save or attack with one damage expression [partial]
- **Racial traits: choice-heavy wording** (racial-features): Resourcefulness (one skill or weapon) and Aircraft Expertise (dial kits, expertise with sky vehicles) stay text; named skill proficiencies in the other traits are wired [partial]
- **Armor stats** (items): Sourcebook gives no armor table; armor values follow 5e SRD and could not be checked against the book [unverified]
- **Midi-QOL coverage** (-): Midi-QOL 13.0.28 and Chris Premades 1.3.151 run on dnd5e 5.1.10; 8 representative workflows pass (weapons, spell attack, save spell, heal, class feature). Not every document was run through Midi, and CPR needs four Midi options enabled (set in the test world only) [partially tested]
