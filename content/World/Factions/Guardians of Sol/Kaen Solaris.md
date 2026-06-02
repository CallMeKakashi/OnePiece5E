---
type: actor
faction: "[[Unaffiliated]]"
status: draft
publish: true
foundry_template_json: "Foundry/actors-json/kaen-solaris.json"
foundry_actor_id: "mPTSplmNs0NZwFbr"
foundry_live_slug: "kaen-solaris"
---
# Kaen Solaris

Foundry actor export — no campaign biography note yet. Link from [[Rules/Stat blocks]] or faction hub when placed in-world.
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop file: `[[Foundry/actors-json/kaen-solaris.json]]`. Regenerate: `python scripts/sync_foundry_statblocks.py`.

```statblock
name: Kaen Solaris
size: medium
type: humanoid
alignment: 
ac: 10
hp: 343 (10)
speed: walk 40 ft., fly 40 ft.
stats: [26, 14, 30, 16, 22, 20]
cr: 20
damage_immunities: psychic
damage_resistances: bludgeoning, force, necrotic, piercing, radiant, slashing
condition_immunities: charmed, frightened, stunned
skills:
- Acrobatics: +4
- Athletics: +10
- Insight: +8
- Intimidation: +7
- Perception: +8
- Religion: +5
traits:
- name: Fighter
  desc: DescriptionA master of martial combat, skilled with a variety of weapons and armorHit Die: d10Primary Ability: Strength or DexteritySaves: Strength &amp; ConstitutionClass FeaturesLevel 1: Hit PointsHit Dice: 1d10 per fighter levelHit Points at 1st Level: 10 + your Constitution modifierHit Points at Higher Levels: 1d10 (or 6) + your Constitution modifier per fighter level after 1stLevel 1: ProficienciesArmor: All armor, shieldsWeapons: Simple weapons, martial weaponsTools: NoneSaving Throws: Strength, ConstitutionSkills: Choose two skills from &amp;Reference[acr]{Acrobatics}, &amp;Reference[ani]{Animal Handling}, &amp;Reference[ath]{Athletics}, &amp;Reference[his]{History}, &amp;Reference[ins]{Insight}, &amp;Reference[itm]{Intimidation}, &amp;Reference[prc]{Perception}, and &amp;Reference[sur]{Survival}Level 1: EquipmentYou start with the following equipment, in addition to the equipment granted by your background:(a) chain mail or (b) leather armor, longbow, and 20 arrows(a) a martial weapon and a shield or (b) two martial weapons(a) a light crossbow and 20 bolts or (b) two handaxes(a) a dungeoneer’s pack or (b) an explorer’s pack@UUID[Compendium.world.ddb-classes.Item.QMrfJik92BnUZ9yL]{Level 1: Fighting Style}You adopt a particular style of fighting as your specialty. Choose one of the following options. You can’t take a Fighting Style option more than once, even if you later get to choose again.@UUID[Compendium.world.ddb-classes.Item.ByNdCcF7p2n14zGd]{Level 1: Second Wind}You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.@UUID[Compendium.world.ddb-classes.Item.Io5YdEto65nMzx8N]{Level 2: Action Surge}Starting at 2nd level, you can &amp;Reference[push]{push} yourself beyond your normal limits for a moment. On your turn, you can take one additional action.Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.@UUID[Compendium.world.ddb-classes.Item.2HZLPdjERSzxRCHd]{Level 3: Martial Archetype}At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques. Choose Champion, Battle Master, or Eldritch Knight, all detailed at the end of the class description. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level.Level 4: Ability Score ImprovementWhen you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can’t increase an ability score above 20 using this feature.Using the optional feats rule, you can forgo taking this feature to take a feat of your choice instead.@UUID[Compendium.world.ddb-classes.Item.eiWhaHo80fKtsbEN]{Level 5: Extra Attack}Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.@UUID[Compendium.world.ddb-classes.Item.bHQTj9sOzHYOXVV5]{Level 9: Indomitable}Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can’t use this feature again until you finish a long rest.You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.Starting EquipmentYou start with the following equipment, in addition to the equipment granted by your background:(a) chain mail or (b) leather armor, longbow, and 20 arrows(a) a martial weapon and a shield or (b) two martial weapons(a) a light crossbow and 20 bolts or (b) two handaxes(a) a dungeoneer’s pack or (b) an explorer’s pack
- name: Fighting Style
  desc: You adopt a particular style of fighting as your specialty. Choose one of the following options. You can’t take a Fighting Style option more than once, even if you later get to choose again.
Archery
You gain a +2 bonus to attack rolls you make with ranged weapons.
Blind Fighting
You have &amp;Reference[blindsight]{blindsight} with a range of 10 feet. Within that range, you can effectively see anything that isn’t behind total cover, even if you’re blinded or in darkness. Moreover, you can see an invisible creature within that range, unless the creature successfully hides from you.
Defense
While you are wearing armor, you gain a +1 bonus to AC.
Dueling
When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.
Great Weapon Fighting
When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.
Interception
When a creature you can see hits a target, other than you, within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes by 1d10 + your proficiency bonus (to a minimum of 0 damage). You must be wielding a shield or a simple or martial weapon to use this reaction.
Protection
When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.
Superior Technique
You learn one maneuver of your choice from among those available to the Battle Master archetype. If a maneuver you use requires your target to make a saving throw to resist the maneuver’s effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice).
You gain one superiority die, which is a d6 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers. A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest.
Thrown Weapon Fighting
You can draw a weapon that has the thrown property as part of the attack you make with the weapon.
In addition, when you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll.
Two-Weapon Fighting
When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.
Unarmed Fighting
Your unarmed strikes can deal bludgeoning damage equal to 1d6 + your Strength modifier on a hit. If you aren’t wielding any weapons or a shield when you make the attack roll, the d6 becomes a d8.
At the start of each of your turns, you can deal 1d4 bludgeoning damage to one creature grappled by you.
- name: Second Wind
  desc: You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.
- name: Fighting Style: Great Weapon Fighting
  desc: When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.
- name: Action Surge
  desc: Starting at 2nd level, you can &amp;Reference[push]{push} yourself beyond your normal limits for a moment. On your turn, you can take one additional action.
Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.
- name: Martial Archetype
  desc: At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques. Choose Champion, Battle Master, or Eldritch Knight, all detailed at the end of the class description. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level.
- name: Eldritch Knight
  desc: DescriptionA master of martial combat, skilled with a variety of weapons and armor
Hit Die: d10Primary Ability: Strength or DexteritySaves: Strength &amp; ConstitutionClass Features

@UUID[Compendium.world.ddb-classes.Item.FhkzxnwlPi79AkPX]{Level 3: Spellcasting}
When you reach 3rd level, you augment your martial prowess with the ability to cast spells. See Spells Rules for the general rules of spellcasting and the Spells Listing for the wizard spell list.
Cantrips
You learn two cantrips of your choice from the wizard spell list. You learn an additional wizard cantrip of your choice at 10th level.
Spell Slots
The Eldritch Knight Spellcasting table shows how many spell slots you have to cast your wizard spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell’s level or higher. You regain all expended spell slots when you finish a long rest.
For example, if you know the 1st-level spell shield and have a 1st-level and a 2nd-level spell slot available, you can cast shield using either slot.
Spells Known of 1st-Level and Higher
You know three 1st-level wizard spells of your choice, two of which you must choose from the &amp;Reference[abj]{abjuration} and &amp;Reference[evo]{evocation} spells on the wizard spell list.
The Spells Known column of the Eldritch Knight Spellcasting table shows when you learn more wizard spells of 1st level or higher. Each of these spells must be an &amp;Reference[abj]{abjuration} or &amp;Reference[evo]{evocation} spell of your choice, and must be of a level for which you have spell slots. For instance, when you reach 7th level in this class, you can learn one new spell of 1st or 2nd level.
The spells you learn at 8th, 14th, and 20th level can come from any school of magic.
Whenever you gain a level in this class, you can replace one of the wizard spells you know with another spell of your choice from the wizard spell list. The new spell must be of a level for which you have spell slots, and it must be an &amp;Reference[abj]{abjuration} or &amp;Reference[evo]{evocation} spell, unless you’re replacing the spell you gained at 3rd, 8th, 14th, or 20th level from any school of magic.
Spellcasting Ability
Intelligence is your spellcasting ability for your wizard spells, since you learn your spells through study and memorization. You use your Intelligence whenever a spell refers to your spellcasting ability. In addition, you use your Intelligence modifier when setting the saving throw DC for a wizard spell you cast and when making an attack roll with one.
Spell save DC = 8 + your proficiency bonus + your Intelligence modifier
Spell attack modifier = your proficiency bonus + your Intelligence modifier
Eldritch Knight Spellcasting


Fighter Level


Cantrips
Known


Spells
Known


— Spell Slots per Spell Level —


1st


2nd


3rd


4th


3rd


2


3


2


—


—


—


4th


2


4


3


—


—


—


5th


2


4


3


—


—


—


6th


2


4


3


—


—


—


7th


2


5


4


2


—


—


8th


2


6


4


2


—


—


9th


2


6


4


2


—


—


10th


3


7


4


3


—


—


11th


3


8


4


3


—


—


12th


3


8


4


3


—


—


13th


3


9


4


3


2


—


14th


3


10


4


3


2


—


15th


3


10


4


3


2


—


16th


3


11


4


3


3


—


17th


3


11


4


3


3


—


18th


3


11


4


3


3


—


19th


3


12


4


3


3


1


20th


3


13


4


3


3


1


@UUID[Compendium.world.ddb-classes.Item.EwdTuVA1NgNAo1p1]{Level 3: Weapon Bond}
At 3rd level, you learn a ritual that creates a magical bond between yourself and one weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond.
Once you have bonded a weapon to yourself, you can’t be disarmed of that weapon unless you are incapacitated. If it is on the same plane of existence, you can summon that weapon as a bonus action on your turn, causing it to teleport instantly to your hand.
You can have up to two bonded weapons, but can summon only one at a time with your bonus action. If you attempt to bond with a third weapon, you must break the bond with one of the other two.

@UUID[Compendium.world.ddb-classes.Item.ZIMgCKz3ra2NVeOS]{Level 7: War Magic}
Beginning at 7th level, when you use your action to cast a cantrip, you can make one weapon attack as a bonus action.

@UUID[Compendium.world.ddb-classes.Item.5Yop91C7Ius6yiie]{Level 10: Eldritch Strike}
At 10th level, you learn how to make your weapon strikes undercut a creature’s resistance to your spells. When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.

@UUID[Compendium.world.ddb-classes.Item.adWcTXVeYrEbd107]{Level 15: Arcane Charge}
At 15th level, you gain the ability to teleport up to 30 feet to an unoccupied space you can see when you use your Action Surge. You can teleport before or after the additional action.

@UUID[Compendium.world.ddb-classes.Item.PlU8gbGxC4qCBwmM]{Level 18: Improved War Magic}
Starting at 18th level, when you use your action to cast a spell, you can make one weapon attack as a bonus action.
- name: Spellcasting
  desc: When you reach 3rd level, you augment your martial prowess with the ability to cast spells. See Spells Rules for the general rules of spellcasting and the Spells Listing for the wizard spell list.
Cantrips
You learn two cantrips of your choice from the wizard spell list. You learn an additional wizard cantrip of your choice at 10th level.
Spell Slots
The Eldritch Knight Spellcasting table shows how many spell slots you have to cast your wizard spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell’s level or higher. You regain all expended spell slots when you finish a long rest.
For example, if you know the 1st-level spell shield and have a 1st-level and a 2nd-level spell slot available, you can cast shield using either slot.
Spells Known of 1st-Level and Higher
You know three 1st-level wizard spells of your choice, two of which you must choose from the &amp;Reference[abj]{abjuration} and &amp;Reference[evo]{evocation} spells on the wizard spell list.
The Spells Known column of the Eldritch Knight Spellcasting table shows when you learn more wizard spells of 1st level or higher. Each of these spells must be an &amp;Reference[abj]{abjuration} or &amp;Reference[evo]{evocation} spell of your choice, and must be of a level for which you have spell slots. For instance, when you reach 7th level in this class, you can learn one new spell of 1st or 2nd level.
The spells you learn at 8th, 14th, and 20th level can come from any school of magic.
Whenever you gain a level in this class, you can replace one of the wizard spells you know with another spell of your choice from the wizard spell list. The new spell must be of a level for which you have spell slots, and it must be an &amp;Reference[abj]{abjuration} or &amp;Reference[evo]{evocation} spell, unless you’re replacing the spell you gained at 3rd, 8th, 14th, or 20th level from any school of magic.
Spellcasting Ability
Intelligence is your spellcasting ability for your wizard spells, since you learn your spells through study and memorization. You use your Intelligence whenever a spell refers to your spellcasting ability. In addition, you use your Intelligence modifier when setting the saving throw DC for a wizard spell you cast and when making an attack roll with one.
Spell save DC = 8 + your proficiency bonus + your Intelligence modifier
Spell attack modifier = your proficiency bonus + your Intelligence modifier
Eldritch Knight Spellcasting


Fighter Level


Cantrips
Known


Spells
Known


— Spell Slots per Spell Level —


1st


2nd


3rd


4th


3rd


2


3


2


—


—


—


4th


2


4


3


—


—


—


5th


2


4


3


—


—


—


6th


2


4


3


—


—


—


7th


2


5


4


2


—


—


8th


2


6


4


2


—


—


9th


2


6


4


2


—


—


10th


3


7


4


3


—


—


11th


3


8


4


3


—


—


12th


3


8


4


3


—


—


13th


3


9


4


3


2


—


14th


3


10


4


3


2


—


15th


3


10


4


3


2


—


16th


3


11


4


3


3


—


17th


3


11


4


3


3


—


18th


3


11


4


3


3


—


19th


3


12


4


3


3


1


20th


3


13


4


3


3


1
- name: Weapon Bond
  desc: At 3rd level, you learn a ritual that creates a magical bond between yourself and one weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond.
Once you have bonded a weapon to yourself, you can’t be disarmed of that weapon unless you are incapacitated. If it is on the same plane of existence, you can summon that weapon as a bonus action on your turn, causing it to teleport instantly to your hand.
You can have up to two bonded weapons, but can summon only one at a time with your bonus action. If you attempt to bond with a third weapon, you must break the bond with one of the other two.
- name: Extra Attack
  desc: Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.
The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.Fighter: Level 11Beginning at 11th level, you can attack three times, instead of twice, whenever you take the Attack action on your turn.
The number of attacks increases to four when you reach 20th level in this class.Fighter: Level 20At 20th level, you can attack four times, instead of three, whenever you take the Attack action on your turn.
- name: War Magic
  desc: Beginning at 7th level, when you use your action to cast a cantrip, you can make one weapon attack as a bonus action.
- name: Indomitable
  desc: Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can’t use this feature again until you finish a long rest.
You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.
- name: Eldritch Strike
  desc: At 10th level, you learn how to make your weapon strikes undercut a creature’s resistance to your spells. When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.
- name: Extra Attack
  desc: Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.
The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.Fighter: Level 11Beginning at 11th level, you can attack three times, instead of twice, whenever you take the Attack action on your turn.
The number of attacks increases to four when you reach 20th level in this class.Fighter: Level 20At 20th level, you can attack four times, instead of three, whenever you take the Attack action on your turn.
- name: Arcane Charge
  desc: At 15th level, you gain the ability to teleport up to 30 feet to an unoccupied space you can see when you use your Action Surge. You can teleport before or after the additional action.
- name: Improved War Magic
  desc: Starting at 18th level, when you use your action to cast a spell, you can make one weapon attack as a bonus action.
- name: Extra Attack
  desc: Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.
The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.Fighter: Level 11Beginning at 11th level, you can attack three times, instead of twice, whenever you take the Attack action on your turn.
The number of attacks increases to four when you reach 20th level in this class.Fighter: Level 20At 20th level, you can attack four times, instead of three, whenever you take the Attack action on your turn.
- name: Astral Drifter
  desc: Background: Astral DrifterFor longer than you can remember, you have traversed the Astral Sea. There, you experienced firsthand the wonders of the Silver Void: you stopped aging and no longer felt hunger or thirst. Driven by wanderlust, you drifted from one part of the Astral Sea to another, like a mote of dust on the wind. You have lost count of the decades that have passed since you arrived here. In your travels, you have camped on the petrified hulks of dead gods and narrowly escaped the psychic winds that sweep across the Astral Sea while also avoiding prolonged contact with the plane’s most dangerous denizens.  Skill Proficiencies: &amp;Reference[ins]{Insight}, &amp;Reference[rel]{Religion} Languages: Two of your choice (Celestial or Gith recommended) Equipment: A &amp;Reference[set]{set} of traveler’s clothes, a diary, an ink pen, a bottle of ink, and a pouch containing 10 gp  Longevity You are 20d6 years older than you look, because you have spent that much time in the Astral Sea without aging.  Feature: Divine Contact You gain the Magic Initiate feat from the Player’s Handbook and must choose cleric for the feat. In the Astral Sea, you crossed paths with a wandering deity. The encounter was brief and nonviolent, yet it made a lasting impression on you. This deity saw fit to share one secret or obscure bit of cosmic lore with you. Work with your DM to determine the details of this knowledge and its impact on the campaign. Roll on the Divine Contact table to determine which deity you encountered, or work with your DM to identify a more suitable choice.  Divine Contact    d10 Wandering Deity     1 Corellon, god of art and magic   2 Tymora, god of good fortune   3 Fharlanghn, god of horizons and travel   4 Istus, god of fate and destiny   5 Nuada, god of war and warriors   6 Zivilyn, god of wisdom   7 Arawn, god of life and death   8 Hecate, god of magic and moons   9 Celestian, god of stars and wanderers   10 Ptah, god of knowledge and secrets   @UUID[Compendium.world.ddb-tables.RollTable.7UeR5YgSLWhmHEWh]{Open RollTable Background: Astral Drifter: Wandering Deity}Divine ContactYou gain the Magic Initiate feat from the Player’s Handbook and must choose cleric for the feat.In the Astral Sea, you crossed paths with a wandering deity. The encounter was brief and nonviolent, yet it made a lasting impression on you. This deity saw fit to share one secret or obscure bit of cosmic lore with you. Work with your DM to determine the details of this knowledge and its impact on the campaign. Roll on the Divine Contact table to determine which deity you encountered, or work with your DM to identify a more suitable choice.  Divine Contact    d10 Wandering Deity     1 Corellon, god of art and magic   2 Tymora, god of good fortune   3 Fharlanghn, god of horizons and travel   4 Istus, god of fate and destiny   5 Nuada, god of war and warriors   6 Zivilyn, god of wisdom   7 Arawn, god of life and death   8 Hecate, god of magic and moons   9 Celestian, god of stars and wanderers   10 Ptah, god of knowledge and secrets   @UUID[Compendium.world.ddb-tables.RollTable.7UeR5YgSLWhmHEWh]{Open RollTable Background: Astral Drifter: Wandering Deity}
- name: Magic Initiate (Cleric)
  desc: You learn two cantrips of your choice from the cleric's spell list.

In addition, choose one 1st-level spell from the cleric's spell list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again using this feat.
Wisdom is your spellcasting ability for these spells.
- name: Indomitable Might
  desc: Beginning at 18th level, if your total for a [[/check str format=long]] is less than your Strength score, you can use that score in place of the total.
- name: Icarus
  desc: Whether through demonic blessing, celestial bequeathment, crazed experiment, or skillful craft, this weapon has been enhanced to bring more bloodshed by the bearer.
You have a bonus to attack and damage rolls made with this magic weapon.
- name: Timeless Body
  desc: At 15th level, your spirit sustains you so that you suffer none of the frailty of old age, and you can’t be aged magically. You can still die of old age, however. Additionally, you no longer require food or water to survive.
- name: Multiattack
  desc: the [[lookup @name lowercase]] makes a number of attacks in one action. These attacks can be of the same type or a mixed variety of its attack actions.
- name: Shared Judgement
  desc: Once on each of your turns when you reduce an Undead to 0 Hit Points, you can deal 5d6 Radiant damage to a creature you can see within 60 feet of you.Using a Higher-Level Spell Slot. The damage increases by 1d6 for each spell slot level above 4.
- name: Counterspell
  desc: You attempt to interrupt a creature in the process of casting a spell. The creature makes a [[/save con format=long]]. On a failed save, the spell dissipates with no effect, and the action, Bonus Action, or Reaction used to cast it is wasted. If that spell was cast with a spell slot, the slot isn’t expended.
- name: Maneuver: Parry
  desc: When another creature damages you with a melee attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on your superiority die + your Dexterity modifier.
- name: Heightened Focus
  desc: Your Flurry of Blows, Patient Defense, and Step of the Wind gain the following benefits.
Flurry of Blows. You can expend 1 Focus Point to use Flurry of Blows and make three Unarmed Strikes with it instead of two.
Patient Defense. When you expend a Focus Point to use Patient Defense, you gain a number of Temporary Hit Points equal to two rolls of your Martial Arts die.
Step of the Wind. When you expend a Focus Point to use Step of the Wind, you can choose a willing creature within 5 feet of yourself that is Large or smaller. You move the creature with you until the end of your turn. The creature’s movement doesn’t provoke Opportunity Attacks.
- name: Dash
  desc: See Foundry.
- name: Command (Legacy)
  desc: You speak a one-word command to a creature you can see within range. The target must succeed on a [[/save wis format=long]] or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it.
Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can't follow your command, the spell ends.
Approach. The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.
Drop. The target drops whatever it is holding and then ends its turn.
Flee. The target spends its turn moving away from you by the fastest available means.
Grovel. The target falls prone and then ends its turn.
Halt. The target doesn't move and takes no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.
At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.
- name: Spellfire Flare
  desc: You unleash a blast of brilliant fire. Make a ranged spell attack against a target within range; a target gains no benefit from Half Cover or Three-Quarters Cover for this attack roll. On a hit, the target takes 2d10 Radiant damage.
 Using a Higher-Level Spell Slot. You create an additional blast for each spell slot level above 1. You can direct the blasts at the same target or at different ones. Make a separate attack roll for each blast.
```
## Live sheet (Foundry)

*Last synced: 2026-06-02 06:59 UTC*

```statblock
name: Kaen Solaris
size: medium
type: humanoid
alignment: 
ac: 12
hp: 343 (10)
speed: walk 40 ft., fly 40 ft.
stats: [26, 14, 30, 16, 22, 20]
cr: 20
damage_immunities: psychic
damage_resistances: bludgeoning, force, necrotic, piercing, radiant, slashing
condition_immunities: charmed, frightened, stunned
skills:
- Acrobatics: +4
- Athletics: +10
- Insight: +8
- Intimidation: +7
- Perception: +8
- Religion: +5
traits:
- name: Fighter
  desc: "DescriptionA master of martial combat, skilled with a variety of weapons and armor. Hit Die: d10 Primary Ability: Strength or Dexterity Saves: Strength & ConstitutionClass FeaturesLevel 1: Hit Points. Hit Dice: 1d10 per fighter level Hit Points at 1st Level: 10 + your Constitution modifier Hit Points at Higher Levels: 1d10 (or 6) + your Constitution modifier per fighter level after 1st. Level 1: Proficiencies. Armor: All armor, shields Weapons: Simple weapons, martial weap..."
- name: Second Wind
  desc: You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.
- name: "Fighting Style: Great Weapon Fighting"
  desc: When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.
- name: Action Surge
  desc: Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.
- name: Martial Archetype
  desc: At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques. Choose Champion, Battle Master, or Eldritch Knight, all detailed at the end of the class description. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level.
- name: Eldritch Knight
  desc: "DescriptionA master of martial combat, skilled with a variety of weapons and armor Hit Die: d10 Primary Ability: Strength or Dexterity Saves: Strength & ConstitutionClass Features When you reach 3rd level, you augment your martial prowess with the ability to cast spells. See Spells Rules for the general rules of spellcasting and the Spells Listing for the wizard spell list. Cantrips You learn two cantrips of your choice from the wizard spell list. You learn an additional w..."
- name: Spellcasting
  desc: When you reach 3rd level, you augment your martial prowess with the ability to cast spells. See Spells Rules for the general rules of spellcasting and the Spells Listing for the wizard spell list. Cantrips You learn two cantrips of your choice from the wizard spell list. You learn an additional wizard cantrip of your choice at 10th level. Spell Slots The Eldritch Knight Spellcasting table shows how many spell slots you have to cast your wizard spells of 1st level and highe...
- name: Weapon Bond
  desc: "At 3rd level, you learn a ritual that creates a magical bond between yourself and one weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond. Once you have bonded a weapon to yourself, you can't be disarmed of that weapon unless you are incapacitated. If it is on the same plane of existence, you can summon ..."
- name: Extra Attack
  desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.Fighter: Level 11Beginning at 11th level, you can attack three times, instead of twice, whenever you take the Attack action on your turn. The number of attacks increases to four when you reach 20th level in this class.Fighter: Leve..."
- name: War Magic
  desc: Beginning at 7th level, when you use your action to cast a cantrip, you can make one weapon attack as a bonus action.
- name: Indomitable
  desc: "Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a long rest. You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level."
- name: Eldritch Strike
  desc: "At 10th level, you learn how to make your weapon strikes undercut a creature's resistance to your spells. When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn."
- name: Extra Attack
  desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.Fighter: Level 11Beginning at 11th level, you can attack three times, instead of twice, whenever you take the Attack action on your turn. The number of attacks increases to four when you reach 20th level in this class.Fighter: Leve..."
- name: Arcane Charge
  desc: At 15th level, you gain the ability to teleport up to 30 feet to an unoccupied space you can see when you use your Action Surge. You can teleport before or after the additional action.
- name: Improved War Magic
  desc: Starting at 18th level, when you use your action to cast a spell, you can make one weapon attack as a bonus action.
- name: Extra Attack
  desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.Fighter: Level 11Beginning at 11th level, you can attack three times, instead of twice, whenever you take the Attack action on your turn. The number of attacks increases to four when you reach 20th level in this class.Fighter: Leve..."
- name: Astral Drifter
  desc: "Background: Astral Drifter. For longer than you can remember, you have traversed the Astral Sea. There, you experienced firsthand the wonders of the Silver Void: you stopped aging and no longer felt hunger or thirst. Driven by wanderlust, you drifted from one part of the Astral Sea to another, like a mote of dust on the wind. You have lost count of the decades that have passed since you arrived here. In your travels, you have camped on the petrified hulks of dead gods and ..."
- name: Magic Initiate (Cleric)
  desc: "You learn two cantrips of your choice from the cleric's spell list. In addition, choose one 1st-level spell from the cleric's spell list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again using this feat. Wisdom is your spellcasting ability for these spells."
- name: Indomitable Might
  desc: Beginning at 18th level, if your total for a is less than your Strength score, you can use that score in place of the total.
- name: Timeless Body
  desc: "At 15th level, your spirit sustains you so that you suffer none of the frailty of old age, and you can't be aged magically. You can still die of old age, however. Additionally, you no longer require food or water to survive."
- name: Multiattack
  desc: the it makes a number of attacks in one action. These attacks can be of the same type or a mixed variety of its attack actions.
- name: "Maneuver: Parry"
  desc: When another creature damages you with a melee attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on your superiority die + your Dexterity modifier.
- name: Heightened Focus
  desc: Your Flurry of Blows, Patient Defense, and Step of the Wind gain the following benefits. Flurry of Blows. You can expend 1 Focus Point to use Flurry of Blows and make three Unarmed Strikes with it instead of two. Patient Defense. When you expend a Focus Point to use Patient Defense, you gain a number of Temporary Hit Points equal to two rolls of your Martial Arts die. Step of the Wind. When you expend a Focus Point to use Step of the Wind, you can choose a willing creature...
- name: Dash
  desc: (See Foundry for activity details.)
actions:
- name: Fighting Style
  desc: "You adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again. Archery. You gain a +2 bonus to attack rolls you make with ranged weapons. Blind Fighting. You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an inv..."
- name: Icarus
  desc: "Whether through demonic blessing, celestial bequeathment, crazed experiment, or skillful craft, this weapon has been enhanced to bring more bloodshed by the bearer. You have a bonus to attack and damage rolls made with this magic weapon. Melee Weapon Attack: +14 to hit. Hit: 3d8 radiant"
- name: Shared Judgement
  desc: "Once on each of your turns when you reduce an Undead to 0 Hit Points, you can deal 5d6 Radiant damage to a creature you can see within 60 feet of you. Using a Higher-Level Spell Slot. The damage increases by 1d6 for each spell slot level above 4. Damage: 5d6 radiant"
- name: Counterspell
  desc: "You attempt to interrupt a creature in the process of casting a spell. The creature makes a CON saving throw (DC 20). On a failed save, the spell dissipates with no effect, and the action, Bonus Action, or Reaction used to cast it is wasted. If that spell was cast with a spell slot, the slot isn't expended."
- name: Command (Legacy)
  desc: "You speak a one-word command to a creature you can see within range. The target must succeed on a or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it. Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can't follow your command, th..."
- name: Spellfire Flare
  desc: "You unleash a blast of brilliant fire. Make a ranged spell attack against a target within range; a target gains no benefit from Half Cover or Three-Quarters Cover for this attack roll. On a hit, the target takes 2d10 Radiant damage. Using a Higher-Level Spell Slot. You create an additional blast for each spell slot level above 1. You can direct the blasts at the same target or at different ones. Make a separate attack roll for each blast. Ranged Weapon Attack: +6 to hit. H..."
```