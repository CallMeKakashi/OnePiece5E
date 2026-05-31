---
type: actor
faction: "[[Unaffiliated]]"
status: draft
publish: true
foundry_template_json: "Foundry/actors-json/marine-ensign.json"
foundry_actor_id: "7U39mf5uIeW36pBi"
foundry_live_slug: "marine-ensign-armor-mk-iii"
---
# Marine Ensign (Armor Mk III)

Foundry actor export — no campaign biography note yet. Link from [[Rules/Stat blocks]] or faction hub when placed in-world.
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop file: `[[Foundry/actors-json/marine-ensign.json]]`. Regenerate: `python scripts/sync_foundry_statblocks.py`.

```statblock
name: Marine Ensign (Armor Mk III)
size: medium
type: humanoid
alignment: lawful neutral
ac: 20
hp: 145
speed: walk 30 ft., fly 40 ft.
stats: [18, 14, 18, 12, 14, 10]
cr: 7
damage_resistances: bludgeoning, piercing, slashing
skills:
- Athletics: +4
- Perception: +4
traits:
- name: Powered Combat Frame
  desc: The armor enhances the user's physical power. The Enforcer has advantage on Strength checks and Strength saving throws.
- name: Flight Thrusters
  desc: The Enforcer gains a flying speed of 40 ft and can hover. If the Enforcer falls below 50 HP the flight systems shut down.
- name: Integrated Targeting System
  desc: Advanced targeting optics grant advantage on ranged attacks against flying creatures.
- name: Multiattack
  desc: The Enforcer makes two Palm Laser attacks or two Power Gauntlet attacks.
- name: Overcharge Beam
  desc: Recharge 5–6. The Enforcer releases a powerful beam in a 150 ft line. Creatures in the line must make a DC 15 Dexterity save, taking 6d10 radiant damage on a failed save or half as much on a success.
  _Damage:_ 6d10 radiant
  _Save:_ DEX DC 15
- name: Legendary Actions
  desc: The Marine Enforcer can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn.
- name: Legendary Action: Thruster Burst
  desc: The Enforcer moves up to 20 ft without provoking opportunity attacks.
- name: Legendary Action: Laser Shot
  desc: The Enforcer makes one Palm Laser attack.
- name: Legendary Action: Stabilized Barrage (Costs 2)
  desc: The Enforcer makes two Palm Laser attacks.
- name: Legendary Action: Shockwave Slam (Costs 2)
  desc: Creatures within 10 ft must make a DC 15 Strength save or take 2d8 bludgeoning damage and fall prone.
actions:
- name: Palm Laser Cannon
  desc: A high-energy laser emitter built into the Enforcer's gauntlet.
  _Attack:_ +7
  _Damage:_ 3d10 radiant
- name: Power Gauntlet
  desc: A powered strike from the armor's reinforced combat gauntlet.
  _Attack:_ +7
  _Damage:_ 2d8 + 4 bludgeoning
```
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Marine Ensign (Armor Mk III)
size: medium
type: humanoid
alignment: lawful neutral
ac: 20
hp: 145
speed: walk 30 ft., fly 40 ft.
stats: [18, 14, 18, 12, 14, 10]
cr: 7
damage_resistances: bludgeoning, piercing, slashing
skills:
- Athletics: +4
- Perception: +4
traits:
- name: Powered Combat Frame
  desc: "The armor enhances the user's physical power. The Enforcer has advantage on Strength checks and Strength saving throws."
- name: Flight Thrusters
  desc: The Enforcer gains a flying speed of 40 ft and can hover. If the Enforcer falls below 50 HP the flight systems shut down.
- name: Integrated Targeting System
  desc: Advanced targeting optics grant advantage on ranged attacks against flying creatures.
- name: Multiattack
  desc: The Enforcer makes two Palm Laser attacks or two Power Gauntlet attacks.
- name: Palm Laser Cannon
  desc: "A high-energy laser emitter built into the Enforcer's gauntlet."
- name: Power Gauntlet
  desc: "A powered strike from the armor's reinforced combat gauntlet."
- name: Overcharge Beam
  desc: Recharge 5–6. The Enforcer releases a powerful beam in a 150 ft line. Creatures in the line must make a DC 15 Dexterity save, taking 6d10 radiant damage on a failed save or half as much on a success.
- name: Legendary Actions
  desc: "The Marine Enforcer can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn."
- name: "Legendary Action: Thruster Burst"
  desc: The Enforcer moves up to 20 ft without provoking opportunity attacks.
- name: "Legendary Action: Laser Shot"
  desc: The Enforcer makes one Palm Laser attack.
- name: "Legendary Action: Stabilized Barrage (Costs 2)"
  desc: The Enforcer makes two Palm Laser attacks.
- name: "Legendary Action: Shockwave Slam (Costs 2)"
  desc: Creatures within 10 ft must make a DC 15 Strength save or take 2d8 bludgeoning damage and fall prone.
```