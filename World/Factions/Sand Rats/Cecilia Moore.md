---
type: actor
faction: "[[Unaffiliated]]"
status: draft
publish: true
foundry_template_json: "Foundry/actors-json/Cecilia Moore.json"
foundry_actor_id: "hfcHFK4qfzc2NwxB"
foundry_live_slug: "cecilia-moore"
---
# Cecilia Moore

Foundry actor export — no campaign biography note yet. Link from [[Rules/Stat blocks]] or faction hub when placed in-world.
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop file: `[[Foundry/actors-json/Cecilia Moore.json]]`. Regenerate: `python scripts/sync_foundry_statblocks.py`.

```statblock
name: Cecilia Moore
size: medium
type: humanoid
alignment: Neutral
ac: 10
hp: 45
speed: walk 30 ft.
stats: [10, 16, 14, 12, 13, 14]
cr: 2
traits:
- name: Shortsword
  desc: See Foundry.
- name: Sneak Attack (2d6)
  desc: Once per turn, Cecilia deals an extra 2d6 damage to one creature she hits with a finesse or ranged weapon attack if she has advantage or an ally is within 5 ft.
- name: Cunning Action
  desc: On each of her turns, Cecilia can use a bonus action to Dash, Disengage, or Hide.
```
## Live sheet (Foundry)

*Last synced: 2026-06-02 07:14 UTC*

```statblock
name: Cecilia Moore
size: medium
type: humanoid
alignment: Neutral
ac: 15
hp: 45
speed: walk 30 ft.
stats: [10, 16, 14, 12, 13, 14]
cr: 2
traits:
- name: Sneak Attack (2d6)
  desc: Once per turn, Cecilia deals an extra 2d6 damage to one creature she hits with a finesse or ranged weapon attack if she has advantage or an ally is within 5 ft.
- name: Cunning Action
  desc: On each of her turns, Cecilia can use a bonus action to Dash, Disengage, or Hide.
actions:
- name: Shortsword
  desc: "Melee Weapon Attack: +2 to hit. Hit: 1d6 +3 piercing"
```

## Foundry build (bb-rehearsal, 2026-10-10)

- **Human Marksman 5 (Bounty Hunter) / Rogue 3 (Thief)**, level 8, **CR 5**. Str 8, Dex 19, Con 15, Int 10, Wis 15, Cha 10. HP 135 (balance override). Saves Dex/Wis.
- Ricochet Rounds (no Devil Fruit), Marksman creations, Sneak Attack, Cunning Action; pistol, cutlass, dagger.
- Live folder: OP5E/Sand Rats.
- Art status: placeholder (cecilia-new), AI-modified label, does not match her description. Credit details in `docs/art-credits.md`. Rebuild steps: [op5e/docs/NPC-BUILDS.md](../../../../op5e/docs/NPC-BUILDS.md).
