---
type: actor
faction: "[[Blackhand]]"
status: draft
publish: true
sources:
  - "Discord/exports/character-art"
  - "Discord/exports/bounty-posters"
  - "Discord/exports/world-lore"
foundry_template_json: "Foundry/actors-json/alice.json"
foundry_actor_id: "wmawnHY2xzb4D5TV"
foundry_live_slug: "alice"
---
## Visuals

![[Attachments/Alice.png|Portrait (Wonderland construct)]]

*Bounty: [[Discord/exports/bounty-posters]] (`Alice.png`)*

## Description

**Alice** — [[Malphas]]'s sister; rescued from a Marine enclosure by [[Droven Calligos]] (see [[Discord/exports/world-lore]] fiction).

## Lore

**Project Wonderland** was a nightmare scenario conjured by the ring for this character (Discord character-art note: nightmare version conjured by Malphas psyche). Distinct from the living Alice rescued in lore posts. It appeared in the crew's shared nightmare in [[Session 010 — Sea of Nightmares|Episode 10]]: a winged G-45 armour under [[Calder Voss|Voss]]'s command which, when [[Roma]] tore its helmet off, wore Alice's face with the eyes and mouth stitched shut.

## Leads

- **G-45** ([[Episode 06 - Hallow's End]], ~00:51): when [[Malphas]] asks about his sister, the answer points to G-45, the Marine base at [[Spirit Cliff]] under [[Commodore Briggs]]. She was held at, or passed through, G-45 (DM, 2026-09-26).

- **White-haired, red-eyed flyer** ([[Session 009 — The Lunarfold Tournament Part 2|Episode 9]]): [[Zim]] reports that when [[Droven Calligos]] attacked a North Blue Marine post, someone saw another flying devil fruit user with white hair and red eyes. [[Malphas]] believes it was Alice (a lead, not confirmed).

## Related

- [[Malphas]]
- [[Commodore Briggs]]
- [[Droven Calligos]]
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop JSON (import/build): `[[Foundry/actors-json/alice.json]]`.
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Alice
size: medium
type: humanoid
alignment: lawful neutral
ac: 17
hp: 170
speed: walk 30 ft., fly 30 ft.
stats: [14, 18, 18, 12, 16, 18]
cr: 10
damage_resistances: fire
traits:
- name: Flaming Duality
  desc: "Alice enters one of two forms for 1 minute: Ignited: Resistance to bludgeoning, piercing, and slashing. Godspeed: +10 movement, opportunity attacks against her have disadvantage."
- name: Fire Bolt
  desc: (See Foundry for activity details.)
- name: Fireball (5th Level)
  desc: 20 ft radius explosion of flame. Half damage on success.
- name: Lunarian Blade
  desc: (See Foundry for activity details.)
- name: Multiattack
  desc: Alice makes two attacks with her blade or casts one spell and makes one attack.
- name: Omni-Adapted
  desc: Alice suffers no penalties from extreme environments and has resistance to fire damage.
- name: "Conqueror's Haki (Unstable)"
  desc: All creatures in 30 ft must make a DC xx Wisdom save.
```
