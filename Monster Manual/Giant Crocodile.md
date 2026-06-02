---
type: monster
status: draft
publish: true
foundry_actor_id: "E2L8BhFVecDOvaSB"
foundry_live_slug: "giant-crocodile"
---
# Giant Crocodile

## Visuals

![[Attachments/monsters/giant-crocodile.webp|registry-image]]

**Look:** Stock **giant crocodile** — long armored snout, plated back, powerful tail; swamp or river apex predator at full size.

*Exported once from Foundry actor `E2L8BhFVecDOvaSB` (`systems/dnd5e/tokens/beast/GiantCrocodile.webp` — stock token). Stats sync separately.*

## Role

**Generic SRD giant crocodile** (CR 5). Swamp, river, or coastal **random encounter** filler — **not used at the table yet**.

## Appearances

- **Unused** — add `[[Sessions/…]]` when first deployed.

## Related

- [[Monster Manual|Monster Manual]]
## Live sheet (Foundry)

*Last synced: 2026-06-02 07:29 UTC*

```statblock
name: Giant Crocodile
size: huge
type: beast
alignment: Unaligned
ac: 14
hp: 85
speed: walk 30 ft., swim 50 ft.
stats: [21, 9, 17, 2, 10, 7]
cr: 5
skills:
- Stealth: +3
traits:
- name: Hold Breath
  desc: The crocodile can hold its breath for 30 minutes.
- name: Multiattack
  desc: "The crocodile makes two attacks: one with its Bite{bite} and one with its Tail{tail}."
actions:
- name: Bite
  desc: "The target is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the crocodile can't bite another target. Melee Weapon Attack: +8 to hit. Hit: 3d10 piercing"
- name: Tail
  desc: "If the target is a creature, it must succeed on a STR saving throw (DC 11) or be knocked prone. Melee Weapon Attack: +8 to hit. Hit: 2d8 bludgeoning"
```
