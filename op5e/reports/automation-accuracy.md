# Automation vs sourcebook text

Heuristic read-only comparison of each item's activities against its description. Findings are leads to review, not confirmed bugs.

| pack | docs | with activities | flagged |
|---|---|---|---|
| class-features | 839 | 310 | 5 |
| racial-features | 86 | 22 | 1 |
| feats | 228 | 114 | 1 |
| items | 421 | 129 | 14 |
| creations | 426 | 426 | 19 |
| backgrounds | 56 | 0 | 0 |

By kind: described-damage-missing 21, save-missing 6, dice-not-in-text 15, healing-missing 5, text-save-not-automated 11

## class-features/Advanced Arsenal
- described-damage-missing: text: 2d8 force; no activity deals force
- described-damage-missing: text: 2d6 psychic; no activity deals psychic
- described-damage-missing: text: 4d6 psychic; no activity deals psychic
- described-damage-missing: text: 2d6 necrotic; no activity deals necrotic
- described-damage-missing: text: 2d6 piercing; no activity deals piercing
- described-damage-missing: text: 2d6 slashing; no activity deals slashing
- described-damage-missing: text: 1d6 piercing; no activity deals piercing
- described-damage-missing: text: 1d6 force; no activity deals force
- described-damage-missing: text: 2d6 force; no activity deals force
- described-damage-missing: text: 2d6 psychic; no activity deals psychic
- described-damage-missing: text: 4d6 psychic; no activity deals psychic

## class-features/Experimental Medicine
- save-missing: text has con save; no save activity

## class-features/Experimental Ooze
- described-damage-missing: text: 1d8 fire; no activity deals fire

## class-features/Area Strike
- described-damage-missing: text: 2d6 slashing; no activity deals slashing

## class-features/Risky Gambit
- described-damage-missing: text: 1d6 necrotic; no activity deals necrotic
- described-damage-missing: text: 1d10 fire; no activity deals fire
- described-damage-missing: text: 2d10 psychic; no activity deals psychic
- described-damage-missing: text: 2d10 thunder; no activity deals thunder

## racial-features/Minor Haki
- dice-not-in-text: activities roll 1d4; text has no dice

## feats/Boon of One Thousand Blows
- dice-not-in-text: activities roll 1d4; text has no dice

## items/12-pounder
- dice-not-in-text: activities roll 3d10; text has no dice

## items/Swivel Gun
- dice-not-in-text: activities roll 2d8; text has no dice

## items/Defiance of the Red World
- healing-missing: text grants hit points but no heal activity

## items/18-pounder
- dice-not-in-text: activities roll 4d10; text has no dice

## items/The Silver Seer (Wakened)
- described-damage-missing: text: 3d10 psychic; no activity deals psychic

## items/The Silver Seer (Ascendant)
- described-damage-missing: text: 3d10 psychic; no activity deals psychic

## items/42-pounder
- dice-not-in-text: activities roll 10d10; text has no dice

## items/64-pounder
- dice-not-in-text: activities roll 15d10; text has no dice

## items/Burn Bazooka
- dice-not-in-text: activities roll 3d6; text has no dice

## items/24-pounder
- dice-not-in-text: activities roll 6d10; text has no dice

## items/Thunder Dial
- dice-not-in-text: activities roll 1d8; text has no dice

## items/8-pounder
- dice-not-in-text: activities roll 2d10; text has no dice

## items/36-pounder
- dice-not-in-text: activities roll 8d10; text has no dice

## items/Flame Dial
- dice-not-in-text: activities roll 1d10; text has no dice

## creations/Battle Transformation
- save-missing: text has con save; no save activity

## creations/Plant Transformation
- healing-missing: text grants hit points but no heal activity
- save-missing: text has con save; no save activity

## creations/Banishing Smite
- save-missing: text has wis save; no save activity

## creations/Transmute Rock
- text-save-not-automated: text mentions wis save; activities save str, dex

## creations/Enlarge/Reduce
- text-save-not-automated: text mentions str save; activities save con

## creations/Karma
- healing-missing: text grants hit points but no heal activity

## creations/Concoct Ooze
- described-damage-missing: text: 1d10 fire; no activity deals fire

## creations/Chilling Necrosis
- healing-missing: text grants hit points but no heal activity

## creations/Slow
- text-save-not-automated: text mentions dex save; activities save wis

## creations/Spawn Plant
- described-damage-missing: text: 1d8 piercing; no activity deals piercing

## creations/Prismatic Spray
- text-save-not-automated: text mentions con save; activities save dex
- text-save-not-automated: text mentions wis save; activities save dex

## creations/Prismatic Wall
- text-save-not-automated: text mentions wis save; activities save con, dex

## creations/Gadget Armor
- dice-not-in-text: activities roll 3d10; text has no dice

## creations/Irresistible Dance
- text-save-not-automated: text mentions wis save; activities save dex

## creations/Toxic Trigger
- save-missing: text has con save; no save activity

## creations/Contagion
- text-save-not-automated: text mentions wis save; activities save con
- text-save-not-automated: text mentions str save; activities save con
- text-save-not-automated: text mentions int save; activities save con
- text-save-not-automated: text mentions dex save; activities save con

## creations/Frigid Bullet
- save-missing: text has con save; no save activity

## creations/Life Steal
- healing-missing: text grants hit points but no heal activity

## creations/Elemental Trap
- dice-not-in-text: activities roll 3d10; text has 3d8, 1d8
