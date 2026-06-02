---
type: actor
faction: "[[Unaffiliated]]"
status: draft
publish: true
foundry_template_json: "Foundry/actors-json/petty-marine.json"
foundry_actor_id: "YGKNs1hybASHJMLX"
foundry_live_slug: "petty-officer-marine"
---
# Petty Officer Marine

Foundry actor export — no campaign biography note yet. Link from [[Rules/Stat blocks]] or faction hub when placed in-world.
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop file: `[[Foundry/actors-json/petty-marine.json]]`. Regenerate: `python scripts/sync_foundry_statblocks.py`.

```statblock
name: Petty Officer Marine
size: medium
type: humanoid
alignment: lawful neutral
ac: 15
hp: 45
speed: walk 30 ft.
stats: [14, 14, 12, 10, 12, 10]
cr: 2
traits:
- name: Multiattack
  desc: The marine makes two attacks with its cutlass or rifle.
- name: Formation Fighting
  desc: The marine gains +1 AC while within 5 ft of an allied marine.
- name: Basic Haki Training
  desc: Once per turn, the marine can deal an extra 1d4 force damage on a hit.
- name: Steady Aim
  desc: If the marine does not move this turn, it gains advantage on its next ranged attack.
actions:
- name: Marine Cutlass
  desc: _Attack:_ +4
  _Damage:_ 1d6 + 2 slashing
- name: Marine Rifle
  desc: _Attack:_ +4
  _Damage:_ 1d10 + 2 piercing
```
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Petty Officer Marine
size: medium
type: humanoid
alignment: lawful neutral
ac: 15
hp: 45
speed: walk 30 ft.
stats: [14, 14, 12, 10, 12, 10]
cr: 2
traits:
- name: Marine Cutlass
  desc: (See Foundry for activity details.)
- name: Marine Rifle
  desc: (See Foundry for activity details.)
- name: Multiattack
  desc: The marine makes two attacks with its cutlass or rifle.
- name: Formation Fighting
  desc: The marine gains +1 AC while within 5 ft of an allied marine.
- name: Basic Haki Training
  desc: Once per turn, the marine can deal an extra 1d4 force damage on a hit.
- name: Steady Aim
  desc: If the marine does not move this turn, it gains advantage on its next ranged attack.
```
