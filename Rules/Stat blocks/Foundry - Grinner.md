---
type: actor
faction: "[[Unaffiliated]]"
status: draft
publish: true
foundry_template_json: "Foundry/actors-json/juniper-islands/grinner.json"
foundry_actor_id: "dxxlqQu3zsnOlp9E"
foundry_live_slug: "grinner"
---
# Grinner

Foundry actor export — no campaign biography note yet. Link from [[Rules/Stat blocks]] or faction hub when placed in-world.
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop file: `[[Foundry/actors-json/juniper-islands/grinner.json]]`. Regenerate: `python scripts/sync_foundry_statblocks.py`.

```statblock
name: Grinner
size: medium
type: aberration
alignment: Chaotic Evil
ac: 10
hp: 70
speed: walk 30 ft.
stats: [12, 14, 14, 8, 12, 14]
cr: 3
traits:
- name: Claw
  desc: See Foundry.
- name: Mind Screech (Recharge 5-6)
  desc: All creatures within 15 ft must succeed on a DC 13 Wisdom saving throw or be stunned until the end of their next turn.
- name: Aberrant Regeneration
  desc: The Grinner regains 10 HP at the start of its turn. If it took damage from a Haki-infused attack since its last turn, this trait does not function.
- name: Unsettling Smile
  desc: Enemies within 10 ft have disadvantage on their first attack each turn (DC 13 Wisdom save negates).
```
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Grinner
size: medium
type: aberration
alignment: Chaotic Evil
ac: 13
hp: 70
speed: walk 30 ft.
stats: [12, 16, 14, 8, 12, 14]
cr: 3
traits:
- name: Claw
  desc: (See Foundry for activity details.)
- name: Mind Screech (Recharge 5-6)
  desc: All creatures within 15 ft must succeed on a DC 13 Wisdom saving throw or be stunned until the end of their next turn.
- name: Aberrant Regeneration
  desc: The Grinner regains 10 HP at the start of its turn.
- name: Unsettling Smile
  desc: Enemies within 10 ft have disadvantage on their first attack each turn (DC 13 Wisdom save negates).
```
