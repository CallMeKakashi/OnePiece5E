---
type: actor
faction: "[[Braveheart Pirates]]"
status: draft
publish: true
foundry_actor_id: "U6j5VTZqIUKuKZF8"
foundry_live_slug: "homunculus-servant"
---
# Homunculus Servant (OHM)

## Visuals

![[Attachments/monsters/homunculus-servant.png|Portrait]]

*Exported once from Foundry actor `U6j5VTZqIUKuKZF8` (`players/homunculus-token.png`). Stats sync separately.*

## Description

**Light spider** drone body — flies like a web-spider construct. Remote chassis for **OHM**.

## Role

**[[Facade]]'s homunculus** — built by **OHM**, the AI that powers Facade's **undead cyborg** artificer shell. An **extension of OHM** for **autonomous tasks** while Facade operates elsewhere (artificer *Homunculus Servant* infusion).

## Appearances

- Fielded with **[[Facade]]** on the Braveheart crew (add `[[Sessions/…]]` when the drone fights separately).

## Related

- [[Facade]] · [[Braveheart Pirates]] · [[Malak Samum]]

## Live sheet (Foundry)

*Last synced: 2026-05-31 06:09 UTC*

```statblock
name: Homunculus Servant
size: tiny
type: construct
alignment: tiny construct
ac: 13
hp: 1
speed: walk 20 ft., fly 30 ft.
stats: [4, 15, 12, 10, 10, 7]
cr: 1
senses: darkvision 60 ft.
damage_immunities: poison
condition_immunities: exhaustion, poisoned
skills:
- Perception: +2
- Stealth: +4
actions:
- name: Evasion
  desc: "Evasion. If the homunculus is subjected to an effect that allows it to make a to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails. It can't use this trait if it's incapacitated."
- name: Force Strike
  desc: "Ranged Weapon Attack: your spell attack modifier to hit, range 30 ft., one target you can see. Hit: damage.. Ranged Weapon Attack: +-1 to hit. Hit: 1d4 force"
- name: Channel Magic
  desc: The homunculus delivers a spell you cast that has a range of touch. The homunculus must be within 120 feet of you.
```