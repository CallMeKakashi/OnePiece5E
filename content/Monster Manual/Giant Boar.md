---
type: monster
status: draft
publish: true
foundry_actor_id: "E10F2cpzhllbb5zm"
foundry_live_slug: "giant-boar"
---
# Giant Boar

## Visuals

![[Attachments/monsters/giant-boar.webp|Token]]

*Exported once from Foundry actor `E10F2cpzhllbb5zm` (`systems/dnd5e/tokens/beast/GiantBoar.webp` — stock token). Stats sync separately.*

## Role

**Generic SRD-style giant boar** (CR 2 kit in Foundry at higher tuning). Drop-in wilderness / road encounter — **not used at the table yet** and not tied to the West Town Lunafang farm line (**[[FarmPig]]** is the farm boar mutate).

## Appearances

- **Unused** — add `[[Sessions/…]]` when first deployed.

## Related

- [[Monster Manual/_index|Monster Manual]]
## Live sheet (Foundry)

*Last synced: 2026-05-31 06:02 UTC*

```statblock
name: Giant Boar
size: large
type: beast
alignment: Unaligned
ac: 10
hp: 42
speed: walk 40 ft.
stats: [17, 10, 16, 2, 7, 5]
cr: 2
traits:
- name: Bloodied Fury
  desc: "While , the [[lookup @name lowercase]] has Advantage on attack rolls."
- name: Gore
  desc: "If the target is a [[lookup @target.affects.special activity=iBenqFiBu40bUxkH]] creature and the [[lookup @name lowercase]] moved 20+ feet straight toward it immediately before the hit, the target takes an extra damage and has the condition.. Melee Weapon Attack: +5 to hit. Melee Weapon Attack: +5 to hit. Hit: 2d6 piercing"
```