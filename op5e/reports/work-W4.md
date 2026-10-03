# W4: equipment / ship / special items

tsc --noEmit: no errors in my files (pre-existing errors elsewhere). No build run.

## Files
- NEW data/src/items/_make.ts (priced loot/consumable factory)
- NEW data/src/items/ship-rooms.ts: 9 rooms (loot, cost/time/requirement/benefit)
- NEW data/src/items/ship-upgrades.ts: 23 upgrades (deck +1/+2, Adam Wood, Aerodynamics, Aquarium, Enhanced Support, Expanded Storage, Flight, Fuel Tank, Orchard, Propulsion x3, Reinforced Hull x3, Keel x3, Submarine, Turbo, Turrets bow/stern) with keyword rules inline
- NEW data/src/items/provisions.ts: Ale gallon/mug, Banquet, Bread, Cheese, Meat, Wine x2 (consumable food); Inn Stay x6, Meals x6 (loot)
- NEW data/src/items/special-gear.ts: post-processor applySpecialGear() giving named items a real base weapon/armor, magicalBonus, damage override; adds tier docs Defiance (Wakened/Exalted) and Silver Seer (Wakened/Ascendant)
- NEW data/src/automation/ship-gear.ts: specs (activities/effects) for 8 cannons (attack, splash save DC 8+dice, recoil avg), 4 cannon shots (spread/area), Distortion, Faithful One, Lucky Day, Wyvern's Wrath, Kopesh, Dead Man's Blade, Seastone weapons/armor, Defiance x3, Silver Seer x3, Mechanical Shield, Gadget Ring, Raid Suit, Bracers of Defense, Jet Dial Bracers
- EDIT items/index.ts (imports + 4 spreads), automation/index.ts (1 import + 1 spread)

## Price check (5)
Correct, no change: items store {value: raw beri, denomination "gp"}; scripts/compendium.mjs redefines CONFIG.DND5E.currencies as only gp = "Berries", conversion 1, so no x10000 inflation.

## Judgement calls
- Raid Suit and Seastone Armor: book names no base armor; Chain Mail (lowest heavy) used + magical bonus +2 / +3.
- Ocean's Mourning: Cutlass base (book says "+2 Sickle", a typo).
- Bracers of Defense AC +2 is a transfer effect with no "no armor/shield" gate; disable when armored.
- Kopesh: +3 magical bonus plus transfer effect +2 mwak damage.
- Original Defiance / Silver Seer docs are now tier 1 (Dormant / Stirring), names unchanged.

## Not done
- Black Blade / White Weapon: left as loot templates (apply to any weapon; no item-level base).
- Heat/Jet Dial "+1 weapon" attach rules left prose.
- Pre-existing duplicate names: Flame Dial (ammo and equipment), Fishing Tackle (Flame Dial shot spec deliberately omitted).
- Cannon descriptions already carried Clean/Reload/availability text; not rewritten.
- Chain Shot and Flame Dial shot have no template (line length = cannon range).

## Left for reference journal pack
Beri Exchange Rate, Lifestyle Expenses table, Treasure and Loot sale values, Crafting Time, Crafting Process (+ scrapping/helpers), Damage and Repairs, Waterborne Vehicles table, ship cannon-slot/AC/HP/DT/Clean-and-Reload table, Cannon Shot table, Mounts speeds, Tack/Harness, Dial Vehicles table, Custom Rooms optional rule, Ship Upgrades/Rooms summary tables.
