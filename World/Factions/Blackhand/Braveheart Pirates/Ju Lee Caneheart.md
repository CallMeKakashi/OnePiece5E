---
type: actor
faction: "[[Braveheart Pirates]]"
status: draft
publish: true
sources:
  - "Discord/exports/character-art"
  - "Discord/exports/devil-fruit-dex"
foundry_template_json: "Foundry/actors-json/julee.json"
foundry_actor_id: "goSlhSCMTFmdv4ZV"
foundry_live_slug: "ju-lee"
---
## Visuals

*Portrait pending re-download — [[Discord/exports/character-art]]*

## Description

Mascot of the [[Braveheart Pirates]].

## Role

Mascot. Devil Fruit: [[Peto Peto no Mi]].
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop JSON (import/build): `[[Foundry/actors-json/julee.json]]`.

### Crunch (sea beast pet)

> **Live Foundry sheet** — synced from world DB `blood-and-brine`. Not the workshop build template. Re-sync: `python scripts/sync_foundry_live_markdown.py`.

Actor id: `cvKipsTFuy0OeDYf` · synced 2026-05-31 03:45 UTC

```statblock
name: Crunch
size: huge
type: monstrosity
alignment: unaligned
ac: 19
hp: 285
speed: walk 20 ft., burrow 30 ft., swim 60 ft.
stats: [26, 12, 24, 5, 14, 10]
cr: 16
senses: darkvision 120 ft.
damage_immunities: poison
damage_resistances: bludgeoning, piercing, slashing
condition_immunities: frightened
skills:
- Acrobatics: +5
- Athletics: +12
- Intimidation: +4
- Perception: +6
traits:
- name: Multiattack
  desc: The Leviathan makes three attacks: one Bite and two Claw attacks.
- name: Bite
  desc: A crushing bite. If the target is Large or smaller, it must succeed on a DC 18 Strength save or be grappled.
- name: Claw
  desc: Massive digging claws tear into enemies.
- name: Rolling Rampage (Recharge 5-6)
  desc: The Leviathan curls into a ball and rolls in a 60 ft line. Creatures in the path must make a DC 19 Dex save, taking 10d10 bludgeoning damage on failure, half on success. On failure, creatures are also knocked prone.
- name: Tidal Slam
  desc: The Leviathan slams its body into water or ground, creating a shockwave. All creatures within 20 ft must succeed on a DC 19 Strength save or take 6d10 bludgeoning damage and be pushed 20 ft.
- name: Burrow Ambush
  desc: If the Leviathan emerges from burrow beneath a creature, that creature must make a DC 19 Dex save or take 8d10 damage and be knocked prone.
- name: Armored Shell
  desc: The Leviathan has resistance to all non-magical damage. Additionally, as a reaction, it can curl up, gaining +4 AC until the start of its next turn but reducing its speed to 0.
- name: Sea King Presence
  desc: Creatures of CR 3 or lower within 60 ft must succeed on a DC 16 Wisdom save or become frightened for 1 minute.
```
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Ju Lee
size: small
type: humanoid
alignment: chaotic good
ac: 16
hp: 121 (110)
speed: walk 40 ft., climb 30 ft.
stats: [8, 20, 12, 11, 16, 18]
cr: 7
condition_immunities: frightened
skills:
- Acrobatics: +9
- Animal Handling: +9
- Athletics: +7
- Insight: +7
- Intimidation: +7
- Perception: +7
- Persuasion: +9
- Stealth: +9
- Survival: +7
traits:
- name: "Pet-Pet Fruit: Tame"
  desc: If Ju Lee pets a Beast (melee range), it must succeed on a DC 16 Wisdom save or be charmed indefinitely. Hostile creatures have advantage unless restrained or subdued.
- name: Dagger (Gifted Treasure)
  desc: (See Foundry for activity details.)
- name: Call My Friends (1/Day)
  desc: Summons 1d4 friendly beasts within 300 ft.
- name: Nimble Escape
  desc: "the [[lookup @name lowercase]] can take the Disengage or Hide action as a bonus action on each of its turns."
- name: Animal Affinity
  desc: Advantage on Animal Handling checks. Non-hostile beasts do not attack her.
- name: Quick Step
  desc: "Can move through larger creatures and avoids opportunity attacks if she hasn't attacked."
- name: Brawler
  desc: The BrawlerLevelProficiency BonusBrawlingSpirit PointsUnarmored MovementFeatures1st+21d6--Brawling, Unarmored Defense2nd+21d62+10 ft.Spirit, Unarmored Movement3rd+21d63+10 ft.Brawling Style, Deflect Missiles4th+21d64+10 ft.Ability Score Improvement, Brace for Impact5th+31d65+10 ft.Extra Attack, Stunning Strike6th+31d86+15 ft.Style Feature7th+31d87+15 ft.Evasion, Shake it Off8th+31d88+15 ft.Ability Score Improvement9th+41d89+15 ft.Unarmored Movement Improvement10th+41d810+2...
- name: Unarmored Defense
  desc: Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.
- name: Brawling
  desc: "At 1st Level, your experience in street fighting gives you mastery of combat styles that use unarmed strikes and brawler weapons, which are improvised weapons and any simple melee weapons⁠ that lacks the two-handed or heavy property.You gain the following benefits while you are unarmed or wielding only brawler weapons and you aren't wearing armor or wielding a shield:You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and brawl..."
- name: Unarmed Strike
  desc: Instead of using a weapon to make a melee attack, you can use a punch, kick, head-butt, or similar forceful blow. In game terms, this is an Unarmed Strike-a melee attack that involves you using your body to damage, grapple, or shove a target within 5 feet of you.Whenever you use your Unarmed Strike, choose one of the following options for its effect.Damage. You make an attack roll against the target. Your bonus to the roll equals your Strength modifier plus your Proficienc...
```
