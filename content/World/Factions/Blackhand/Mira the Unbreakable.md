---
type: actor
faction: "[[Blackhand]]"
status: draft
publish: true
sources:
foundry_template_json: "Foundry/actors-json/mira.json"
foundry_actor_id: "GY6drGHh7ZF3PwOl"
foundry_live_slug: "mira"
---
## Visuals

![[Attachments/mira-portrait.png|Portrait]]
![[Attachments/mira-bounty.png|Bounty poster]]


## Description

- **Height:** 8 feet tall
- **Build:** Muscular but lean, exuding effortless power
- **Eyes:** Emerald green, sharp and commanding
- **Hair:** Wild, curly, deep red
- **Skin:** Deep tan
- **Clothing:** A striking robe in pink and green, flowing yet battle-ready
- **Weapons:** None — she doesn't need them. Her hands alone are more than enough.

Carries a kind, almost motherly smile, especially toward her family and crew — a warmth she perhaps learned from [[Blackhand Cane]] himself. To them, she is an unshakable pillar and a nurturing protector. In stark contrast, she is utterly ruthless toward her enemies. Most marines tremble upon hearing that "Mira the Unbreakable" is coming for them.

## Role

**4th Fleet Commander** of the [[Blackhand]]; captain of the [[Braveheart Pirates]]. Commands immense respect both within and beyond the crew.

**Current Bounty:** 125,000,000 berries

Devil Fruit: [[Kaze Kaze no Mi]].

## Personal Quests

- Protecting the Blackhand crew and her inner circle — "the Fleet": **Tray**, **Thompson**, **Celine**, and **Katherine**
- Crushing any threat to her family with absolute force

## Backstory

Mira was rescued at the age of **10** by [[Blackhand Cane]] from a slave ship en route to Mariejois. Even as a child, her spirit was unyielding — she was a fighter through and through.

She sailed alongside Blackhand for **20 years**, learning the true essence of **Haki** directly from him and mastering **Fishman Karate** under [[Renzo]], the 3rd Fleet Commander. Over time, her unwavering spirit and raw power earned her the epithet **"Mira the Unbreakable."**

It is said she once withstood **two weeks of torture at the hands of CP0**, yet never revealed a single word that would endanger Blackhand or her crew. She eventually broke out on her own, aided by her closest allies — the "Fleet": **[[Tray]]**, **Thompson**, **Celine**, and **Katherine**.

To them — and to many others — Mira is nothing short of a god, the one who showed them a better life, far away from the slums of an unnamed island deep within the New World.

## Abilities

- Mastery of **Fishman Karate** (learned from [[Renzo]])
- All **Six Styles (Rokushiki)** techniques of CP agents (taught by [[Blackhand Cane]] himself)
- Advanced Haki user — both Observation and Armament

## Legacy

Feared by enemies, revered by her allies — her legend stretches across seas.

> "I will hold my family in my arms and crush my enemies under my fists. That's what it means to be unbreakable."
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop JSON (import/build): `[[Foundry/actors-json/mira.json]]`.
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Mira
size: medium
type: humanoid
alignment: chaotic neutral
ac: 19
hp: 475 (310)
speed: walk 40 ft., fly 60 ft., swim 40 ft.
stats: [20, 20, 20, 12, 20, 18]
cr: 16
senses: darkvision 60 ft.
damage_immunities: bludgeoning, piercing, slashing
damage_resistances: thunder, lightning
condition_immunities: prone
skills:
- Acrobatics: +9
- Athletics: +9
- Insight: +9
- Perception: +7
traits:
- name: Fishman Karate - Brick Fists
  desc: Mira makes four unarmed strikes or three strikes and one grapple.
- name: Air-Infused Strike
  desc: (See Foundry for activity details.)
- name: "Fishman Karate: Ocean Impact (Recharge 5-6)"
  desc: 30 ft cone. DC 18 Dex save. 10d10 bludgeoning and knocked prone.
- name: "Fishman KungFu: Eight Forms"
  desc: "Mira has mastered 8 forms of Fishman Kung Fu. Once per turn, he can apply one of the following effects on hit: push 15 ft, knock prone, or deal an extra 1d8 damage."
- name: Tempest Throw
  desc: Throw grappled target 40 ft. 4d10 damage and prone. Collisions damage both targets.
- name: Aerial Domination
  desc: Hover. No opportunity attacks while flying. Can move through creatures.
- name: Wind Step
  desc: Bonus action Dash. Gain advantage on next attack.
- name: Haki Infusion (Armament)
  desc: Attacks are magical and deal +2 damage. Ignore non-magical resistance.
- name: Haki Awareness (Observation)
  desc: Advantage on Perception. Cannot be surprised.
- name: "Conqueror's Pressure (Recharge 6)"
  desc: CR 5 or lower creatures within 60 ft fall unconscious on failed DC 16 Wisdom save.
- name: "Logia Body: Air Form"
  desc: Immune to non-Haki physical damage. Magical/Haki attacks affect normally.
- name: Brawler
  desc: The BrawlerLevelProficiency BonusBrawlingSpirit PointsUnarmored MovementFeatures1st+21d6--Brawling, Unarmored Defense2nd+21d62+10 ft.Spirit, Unarmored Movement3rd+21d63+10 ft.Brawling Style, Deflect Missiles4th+21d64+10 ft.Ability Score Improvement, Brace for Impact5th+31d65+10 ft.Extra Attack, Stunning Strike6th+31d86+15 ft.Style Feature7th+31d87+15 ft.Evasion, Shake it Off8th+31d88+15 ft.Ability Score Improvement9th+41d89+15 ft.Unarmored Movement Improvement10th+41d810+2...
- name: Unarmored Defense
  desc: Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.
- name: Brawling
  desc: "At 1st Level, your experience in street fighting gives you mastery of combat styles that use unarmed strikes and brawler weapons, which are improvised weapons and any simple melee weapons⁠ that lacks the two-handed or heavy property.You gain the following benefits while you are unarmed or wielding only brawler weapons and you aren't wearing armor or wielding a shield:You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and brawl..."
- name: Unarmored Movement
  desc: Starting at 2nd Level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain brawler levels, as shown in the Brawler table. Additionally, as a bonus action, you can take the Disengage or Dash action, and your jump distance is doubled for the turn. At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.
- name: Spirit
  desc: "Starting at 2nd Level, your training allows you to draw upon an inner energy of willpower and grit. Your access to this energy is represented by a number of spirit points. Your brawler level determines the number of points you have, as shown in the Spirit Points column of the Brawler table.You can spend these points to fuel various spirit features. You start knowing three such features: Flurry of Blows, Patient Defense, and Deft Escape. You learn more spirit features as yo..."
- name: Patient Defense
  desc: You can spend 1 spirit point to take the Dodge action as a bonus action on your turn.
- name: Flurry of Blows
  desc: Immediately after you take the Attack action on your turn, you can spend 1 spirit point to make two unarmed strikes as a bonus action.
- name: Deft escape
  desc: While you are grappled, you can spend 1 spirit point to attempt to escape a grapple or restraints as a bonus action.
- name: Brawling Style
  desc: "At 3rd level, you settle on a specific brawling style to define your brawling: Daredevil, Fishman Karate, Ninja, Six Powers Master, Okama Kenpo, Sword Sage, Sumo Wrestler, Open Hand, Way of Mercy, Drunken Master, Chromatic Commandment, Private Eye, and Expressionist, all detailed at the end of the class description.Your fighting style grants you features at 3rd level and then again at 6th, 11th, and 17th level."
- name: Deflect Missiles
  desc: Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by any ranged attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your brawler level. If you reduce the damage to 0, you can catch it if you have a free hand. If you catch it in this way, you can spend 1 spirit point to make a ranged attack with the weapon or ammunition you caught, as part of the same reaction. You make th...
- name: Warrior of the Elements
  desc: "DescriptionA Martial Artist of Supernatural Focus Monks focus their internal reservoirs of power to create extraordinary, even supernatural, effects. Primary Abilities: Dexterity & WisdomHit Point Die: D8Saves: Strength & DexterityClass Features Level 3: Elemental Attunement At the start of your turn, you can expend 1 Focus Point to imbue yourself with elemental energy. The energy lasts for 10 minutes or until you have the Incapacitated condition. You gain the following be..."
- name: Manipulate Elements
  desc: You know the Elementalism spell. Wisdom is your spellcasting ability for it.
- name: Aerial Expert
  desc: "This is Partnered Content This content is available in your campaign with your DM's permission and is published by Hit Point Press. To use this content, enable Humblewood in the character builder. Years of practice or an innate talent have made you adept at gliding. You gain the following benefits: You no longer need to move at least 10 feet to perform long and high jumps. You may choose whether the jump uses your Strength or Dexterity score for determining height or dista..."
- name: Brace for Impact
  desc: Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your brawler level.
- name: Extra Attack
  desc: Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.
- name: Stunning Strike
  desc: Starting at 5th level, when you hit another creature with a melee weapon attack, you can spend 1 spirit point to attempt a stunning strike. The target must succeed on a Constitution saving throw against your Spirit DC or be stunned until the end of your next turn.
- name: Unarmored Movement
  desc: Starting at 2nd Level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain brawler levels, as shown in the Brawler table. Additionally, as a bonus action, you can take the Disengage or Dash action, and your jump distance is doubled for the turn. At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.
- name: Elemental Burst
  desc: "As a Magic action, you can expend 2 Focus Points to cause elemental energy to burst in a 20-foot-radius Sphere centered on a point within 120 feet of yourself. Choose a damage type: Acid, Cold, Fire, Lightning, or Thunder. Each creature in the Sphere must make a . On a failed save, a creature takes damage of the chosen type equal to three rolls of your Martial Arts die. On a successful save, a creature takes half as much damage."
- name: Shake it Off
  desc: At 7th level, you can use your action to regain hit points equal to three times your brawler level. You must finish a long rest before you can use this feature again.
- name: Alert
  desc: "Always on the lookout for danger, you gain the following benefits:Increase your Dexterity or Wisdom score by 1, to a maximum of 20.You gain a +5 bonus to initiative.You can't be surprised while you are conscious.Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you."
- name: Unarmored Movement Improvement
  desc: At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during your move.
- name: Brutal Grip
  desc: "General Feat (Prerequisite: Level 4+, Strength 13+) You gain the following benefits. Ability Score Increase. Increase your Strength score by 1, to a maximum of 20. Heavy Duelist. You can wield a Melee weapon with the Two-Handed property in one hand. Versatile Dual Wielder. While wielding a Melee weapon with the Versatile property in one hand, the weapon has the Light property for you."
- name: Stride of the Elements
  desc: While your Elemental Attunement is active, you also have a Fly Speed and a Swim Speed equal to your Speed. Stride of the Elements While your Elemental Attunement is active, you also have a Fly Speed and a Swim Speed equal to your Speed.
- name: Animal Spirit
  desc: Starting at 13th level, your inner spirit burns with a passion that even wild animals can understand. You can speak with all beasts and monstrosities, and understand what they say as well. Additionally, you have advantage on Charisma (Intimidation) ability checks you make towards beasts and monstrosities.
- name: Diamond Soul
  desc: Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws.Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.Beginning at 14th level, your hardened spirit grants you proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 spirit point to reroll it and take the second result.
- name: Unarmored Movement
  desc: Starting at 2nd Level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain brawler levels, as shown in the Brawler table. Additionally, as a bonus action, you can take the Disengage or Dash action, and your jump distance is doubled for the turn. At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.
- name: Timeless Body
  desc: "At 15th level, your spirit sustains you so that you suffer none of the frailty of old age, and you can't be aged magically. You can still die of old age, however. Additionally, you no longer require food or water to survive."
- name: Crusher
  desc: "You are practiced in the art of crushing your enemies, granting you the following benefits: Increase your Strength or Constitution by 1, to a maximum of 20. Once per turn, when you hit a creature with an attack that deals bludgeoning damage, you can move it 5 feet to an unoccupied space, provided the target is no more than one size larger than you. When you score a critical hit that deals bludgeoning damage to a creature, attack rolls against that creature are made with ad..."
```