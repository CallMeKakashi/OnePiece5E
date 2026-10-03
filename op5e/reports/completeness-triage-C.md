# Completeness triage C: Chapter 4 Equipment and Items, Chapter 8 Special Items

Summary: 68 unmatched titles = P 18 / R 31 (6 of them doubtful, listed below) / M 13. Item audit: 0 field mismatches in weapons (cost, damage, weight), armor/shield (cost, AC, type), ~150 gear/tool/instrument/snail/mount/tack/dial-vehicle/cannon-shot prices and weights, ship stats (AC, HP, DT, speed, crew, passengers, cargo), ship-weapon cost/range. Gaps are rules/tables and structured mechanics, not stat typos.

Sourcebook root: `Sourcebook/Chapter 4 Equipment and Items/` and `Sourcebook/Chapter 8 Special Items/` (C:\bb\Sourcebook).

## (M) MISSING

1. Ship Rooms (9 rooms), `Ship Building and Repair/Ship Rooms.md` + `Upgrading your Ship.md` ("Ship Rooms" table): Bedroom (Individual) 2M/30d, Kitchen 3M/40d, Dining Room 2M/30d, Stage 2M/30d, Navigator's Room 3M/40d, Sick Bay 5M/50d, Library 3M/40d, Training Room 5M/60d, Workshop 5M/60d (+5M and 60 days per extra tool). Each has a benefit (1d4 bonuses, full hit dice on long rest, etc.). Nothing in packs-src or data/src (grep for sick bay, navigator's room, workshop found nothing). Also Optional Rule: Custom Rooms (prose).
2. Ship Upgrades table, `Upgrading your Ship.md` (about 20 rows plus the keyword rules Activation, Burst of Speed, Dive, Everlasting, Fish Tank, Fuel Supply, Gardening, Lift Off, Lightweight, Reverse): Additional deck level (+1: 5M/60d/prof 2; +2: 10M/60d/prof 3), Adam Wood 200M, Aerodynamics 500k/20d, Aquarium 750k/7d, Enhanced support 750k/7d, Expanded storage 500k/7d, Flight 30M/60d, Fuel tank (gallon, 100) 2M/30d, Orchard 300k/7d, Propulsion apprentice/journeyman/masterwork (20/30/40M, +2/+4/+6 mph), Reinforced hull (5/10/20M, +1/+2/+3 AC), Reinforced keel (10/20/30M, +100/+200/+300 HP max), Submarine 30M, Turbo engine 5M, Turrets bow/stern 7M each. None exist in packs.
3. Crafting Time table (`Building a Ship.md`): Rowboat 10d, Keelboat 90, Sloop 180, Longship 360, Caravel 440, Carrack/Galley/Galleon 720. Not in compendium (ship pack descriptions only carry cost and speed).
4. Crafting Process table (`Building a Ship.md`): check 5 or lower double time/cost; 10 normal; 15 cost -25%; 20 time and cost -25%; 25 time and cost -50%. Plus scrapping, progress-loss and helper rules (+1 per proficient helper). Not present.
5. Damage and Repairs (`Damage and Repairs.md`): max HP reduced by half damage taken; 1-8 hour repair checks (DC 10 tool / DC 15 Engineering or Athletics, +5 HP, x2 for shipwright, restores max HP); 0 HP sinking timer (10 + half DT minutes); leak-patch DC 15/20; new hole per hit below 0 HP. Not present as rule entry.
6. Lifestyle Expenses table (`Expenses/Expenses.md`): Wretched -, Squalid 500, Poor 1 000, Modest 10 000, Comfortable 20 000, Wealthy 40 000, Aristocratic 100 000+ beri/day. Not present. The book's own worked example (7 days, Modest, 5 crew = 350 000) is prose.
7. Food, Drink, and Lodging items/table (`Expenses/Food, Drink, and Lodging.md`): Ale (gallon 1 000 / mug 40), Banquet 100 000, Bread 100, Cheese 500, Meat chunk 1 500, Wine (common pitcher 1 000, fine bottle 100 000), Inn Stay per day (Squalid 350 ... Aristocratic 40 000), Meals per day (Squalid 150 ... Aristocratic 20 000). No items exist (Rations and Waterskin only).
8. Beri Exchange Rate (`Wealth/Wealth.md`): cp 1, sp 100, gp 10 000 beri. Not present as a rule/journal. All item prices are stored as raw beri in a field labelled `gp` (e.g. Woodcarver's Tools price 10000 denomination gp), so unless the system or module converts this, dnd5e shows them 10000x too high. Verify the denomination handling in the build (not a book gap, but a likely correctness risk).
9. Treasure and Loot (`Wealth/Treasure and Loot.md`): sale-value rules (weapons/armor sell at half, gems/art/trade goods/maps at full). Prose only, no roll table in the source.
10. Cannon firing rules (`Mounts and Vehicles/Cannons.md`): Clean and Reload per cannon (1 bonus action ... 3 actions), per-ship availability, off-design recoil damage, Cannon Save DC = 8 + damage dice, ranged attack formula. Ship rows carry slots only in description text; reload/availability and cannon-shot spreads (round 5 ft sphere, grapeshot 30 ft cone piercing, chain 5 ft line, exploding 20 ft fire sphere, flame dial 10 ft line fire) are not mechanised. Round Shot/Grapeshot/Chain Shot/Exploding Shell items exist with correct prices, but have no damage type/spread (empty description), and ship-weapon entries only describe round shot.
11. Structured mechanics for ranked/special weapons. These items exist with correct prose but have no base weapon type, no magical bonus, no damage override, no effects (every `effects` array empty): Arched Horn (+1 sickle), Orange Mile (+1 glaive), Distortion (+2 rapier, cursed), Ocean's Mourning (+2, seastone), Mountain Mist (+3 katana, 3d4), The Faithful One (+3 dagger), Lucky Day (+3 longsword), Wyvern's Wrath (+3 greatsword 2d8), Kopesh (+3 scimitar, +2 dmg, 2d6), Dead Man's Blade, Defiance of the Red World (three tiers 2d8/2d10/2d12 + necrotic, +1/+2/+3), Seastone Weapon Tipped/Full, Seastone Armor (+3), Raid Suit (+2 AC, +10 ft), Serpent Armor (no `armor` block), Bracers of Defense (no AC effect), Jet Dial Bracers, Black Blade (+2 dmg), White Weapon (+2 attack), Silver Seer (three tiers +1/+2/+3), Heat Dial, Jet Dial (+1 weapon). Descriptions are accurate; only mechanical fields are absent.
12. Mechanical Shield (Animated Shield), `Chapter 8 Special Items/Armor/Mechanical Shield (Animated Shield).md`: pack text says "Use the item text at the table for exact activation timing"; the real rule is missing (command word as bonus action, hovers for 1 minute, ends on bonus action or incapacitated/dead, falls to ground or into a free hand). Also no shield AC.
13. Gadget Ring (Ring of Spell Storing), `Rings/Gadget Ring (Ring of Spell Storing).md`: pack text says "configure per the table"; book rules missing: stores up to 5 levels of creations; any creature adds a 1st-5th level creation by touching the ring as it is used; uses original activator's slot level, DC, attack bonus and ability; stored creation is freed after use.

Minor stat gaps found while checking (low priority): Shortbow/Longbow "Strong" and firearm Reload values (Musket/Flintlock 1, Rifle/Pistol 4, Revolver 6, Shotgun 2) exist only if text carries them; a check of descriptions found them present. Ammo DC text is shortened on Shrapnel/Incendiary etc. but values match. Ocean's Mourning is called a Skillful Grade cutlass in the book yet "+2 Sickle" (book typo, copied faithfully). Bandages and Lamp items have empty descriptions and no book entry.

## Doubtful (R)

- Dormant / Wakened / Exalted (`Defiance Of The Red World.md`): represented only as three paragraphs inside the single Defiance of the Red World item; no tier items, no tier activities, mark-use tracking (prof bonus uses, long rest) not structured.
- Stirring / Wakened / Ascendant (`The Silver Seer.md`): same, all in the single The Silver Seer item; the Ascendant paragraph is shortened but covers the +3, free ability choice, allies within 10 ft.
- Dial headings (16 plural titles) map to singular items (Ball Dial ... Thunder Dial). Checked present with matching prose: Axe, Ball, Breath, Flame (equipment), Flash, Flavor, Heat, Impact, Reject, Jet, Lamp, Milky, Eisen, Tone, Vision, Water, Thunder. Per-dial charges (Flash/Jet/Eisen/Water 3) are in prose only; Heat and Jet "+1 weapon" not structured; Flame Dial duplicates (cannon-shot consumable plus equipment).
- Smiles -> SMILE Fruit (roll 1d10, effects in prose only; no per-animal rolls table in the source either).
- Surfers (Tools/Sky Vehicles): item exists priced 0, no stats in the book table either.

## Item audit coverage (verified present)

Weapons: all 45 table weapons (simple and martial, melee and ranged, Net, Manacles, Odachi, Katana, Cutlass, firearms) match cost, damage, weight; properties and ranges match; Adaptable, versatile and Reload text verified in descriptions.
Armor: Leather, Navy Uniform, Studded Leather, Light Longcoat, Hide, Chain Shirt, Scale Mail, Heavy Longcoat, Breastplate, Chain Mail, Splint, Plate, Shield match.
Gear/tools: full Adventuring Gear list, artisan tools, kits, gaming sets, instruments (all 11), 6 transponder snails, 9 mounts (prices; speeds are not stored), tack items, 6 dial vehicles.
Ships: all 8 ships (AC, HP, DT, speed, crew/passengers, cargo, cost); 8 ship weapons (2d8 to 15d10, cost, range).
Chapter 8: 13 special ammo types, medkits (4 tiers: 2d4+2, 4d4+4, 8d4+8, 10d4+20), Adrenaline Injection, 5 attack cuisines (Mighty Bull Roast table in prose), Energy Steroids, wondrous items (Boots of Speed, Bracers, Goggles, Prosthetic Limb), Rocket Ring, Force Gun, Defender Field, Pocket Hospital, Raging Drum, Bubble Coral, Vivre Card, Wapometal, Devil Fruit Object, Special Book, 12 named ranked/cursed weapons, Seastone (weapon x2, armor, handcuffs).

## Tables that should become RollTables / journal pages

Price / reference tables:
- Beri Exchange Rate: `Wealth/Wealth.md`
- Lifestyle Expenses: `Expenses/Expenses.md`
- Food, Drink, and Lodging (incl. inn/meal tiers): `Expenses/Food, Drink, and Lodging.md`
- Treasure and Loot (sale values by category; no dice table): `Wealth/Treasure and Loot.md`
- Waterborne Vehicles (ship cost/speed/crew table): `Mounts and Vehicles/Ships and Waterborne Vessels.md`
- Cannons table (damage, cost, range, siege) and ship cannon-slot/AC/HP/DT table with Clean and Reload / Ship Availability: `Mounts and Vehicles/Ships and Waterborne Vessels.md`, `Mounts and Vehicles/Cannons.md`
- Cannon Shot (cost, type, spread): `Mounts and Vehicles/Cannons.md`
- Mounts and Animals, Tack Harness and Drawn Vehicles, Dial Vehicles (Sky): `Mounts and Vehicles/Cannons.md`
- Crafting Time and Crafting Process (d20-check outcome table): `Ship Building and Repair/Building a Ship.md`
- Ship Upgrades (cost, time, proficiency, requirement, properties): `Ship Building and Repair/Upgrading your Ship.md`
- Ship Rooms (cost, time, requirement, effect): `Ship Building and Repair/Upgrading your Ship.md`, `Ship Building and Repair/Ship Rooms.md`
- Armor, Simple Weapons, Martial Weapons, Adventuring gear, Tools, Transponder Snails price tables: `Armor and Shields/`, `Ship Building and Repair/Ship Rooms.md` (armor table), `Weapons/Weapons.md`, `Weapons/Additional Melee Weapons.md` (gear table), `Tools/Tools.md`, `Tools/Transponder Snails.md` (already items)
- Chapter 8: Medkits table (rarity to HP) and Mighty Bull Roast potency table (STR score, cost, min level): `Consumables/Medkits (Potions of Healing).md`, `Attack Cuisine.md`; Crafting Materials Guide rarity cost table exists as an item.

Random/roll tables: the book has none in these chapters. Closest are the Smile roll (1d10, 10% success; `Smiles.md`), Energy Steroid stacking, and the d20 destruction check on Impact/Reject dials, Force Gun, and Defender Field (roll 1 destroys). Each is a single-line check, not a RollTable candidate except Smiles (1d10).
