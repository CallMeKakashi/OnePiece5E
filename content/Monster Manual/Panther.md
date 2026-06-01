---
type: monster
status: draft
publish: true
foundry_actor_id: "iPHfCPpyeUGmR1VG"
foundry_live_slug: "panther"
---
# Panther

## Visuals

![[Attachments/monsters/panther.webp|registry-image]]

**Look:** Stock **black panther** — sleek muscular big cat, low stalking pose, Forgotten Adventures token art; generic grassland/jungle ambush predator (not Lunafang-mutated).

*Exported once from Foundry actor `iPHfCPpyeUGmR1VG` (`systems/dnd5e/tokens/beast/Panther.webp` — stock dnd5e bestiary token). Stats sync separately.*

## Role

**Generic SRD panther** (CR 1/4) — stock **grassland** predator from the dnd5e bestiary (Forgotten Adventures token art in Foundry). Drop-in jungle or plains ambush; **not used at the table yet**. For campaign-mutated big-cat threats, use **[[Saber-Toothed Tiger]]** (Lunafang / Nikolai line on Driftroot).

## Appearances

- **Unused** — add `[[Sessions/…]]` when first deployed.

## Related

- [[Saber-Toothed Tiger]] — experimental big-cat counterpart in campaign lore
- [[Monster Manual|Monster Manual]]
## Live sheet (Foundry)

*Last synced: 2026-05-31 06:18 UTC*

```statblock
name: Panther
size: medium
type: beast
alignment: Unaligned
ac: 12
hp: 13
speed: walk 50 ft., climb 40 ft.
stats: [14, 15, 10, 3, 14, 7]
cr: 0.25
skills:
- Perception: +4
- Stealth: +6
traits:
- name: Keen Smell
  desc: The panther has advantage on Wisdom (Perception) checks that rely on smell.
actions:
- name: Pounce
  desc: If the panther moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a STR saving throw (DC 12) or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action.
- name: Bite
  desc: "Melee Weapon Attack: +4 to hit. Hit: 1d6 piercing"
- name: Claw
  desc: "Melee Weapon Attack: +4 to hit. Hit: 1d4 slashing"
```