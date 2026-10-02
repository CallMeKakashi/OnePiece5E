---
type: actor
faction: "[[Soundless 5]]"
status: draft
publish: true
sources:
  - "Sessions/Session 17 - Howling Thunder.md"
foundry_template_json: "Foundry/actors-json/rythm.json"
foundry_actor_id: "g5UyfkUvh0KP4wUT"
foundry_live_slug: "rhythm-echo"
---
## Description

**Rhythm Echo** — No. 3 of the [[Soundless 5]]. Dual-wields daggers per the prep; in play he shifts a room's axis around one target and fights with sonic hammer blades (see [[Session 015 — Animal Within]]).

## Role

Soundless Five enforcer. Devil Fruit: [[Fura Fura no Mi]] (Float-Float).
## Episode 16

- Fights [[B.O.B]] on floor 2. His ability shifts the room's axis around one target (gravity flips); he uses sonic hammer blades, Shatter and a slowing hum. Injects a 6/6 serum and becomes a beast. [[Facade]] kills him ([[Session 016 — Broken Promises|Episode 16]]).

## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop JSON (import/build): `[[Foundry/actors-json/rythm.json]]`.
## Live sheet (Foundry)

*Last synced: 2026-06-01 07:19 UTC*

```statblock
name: Rhythm Echo
size: medium
type: humanoid
alignment: Lawful Evil
ac: 17
hp: 136
speed: walk 30 ft.
stats: [14, 16, 18, 12, 14, 10]
cr: 8
senses: darkvision 60 ft.
damage_resistances: thunder
skills:
- Intimidation: +5
- Persuasion: +5
traits:
- name: Vertigo Field
  desc: "Aura (20 ft). Creatures of Rhythm's choice must succeed on a DC 16 Constitution save or be affected by slow for 1 minute. The inner ear loses sync with reality. Muscles obey commands too late."
- name: Temporal Deflection
  desc: When Rhythm is hit by an attack, he imposes disadvantage on that attack roll.
- name: Mutation Trigger
  desc: When Rhythm is reduced below 40 HP, he automatically mutates into his next form.
actions:
- name: Sonic Hammer
  desc: "A heavy resonant hammer that releases concussive sound on impact. Melee Weapon Attack: +5 to hit. Hit: 2d6 thunder"
- name: Pulse Slam
  desc: "A concussive ground impact. On a failed save, the target is knocked prone and stunned until the end of its next turn. Half damage on a success, no stun. DC 13. CON save. Damage: 4d8 thunder"
```