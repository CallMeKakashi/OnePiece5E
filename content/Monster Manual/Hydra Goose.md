---
type: monster
status: draft
publish: true
foundry_actor_id: "DbtEaQsj7oUpJO4x"
foundry_live_slug: "hydra-goose"
aliases:
  - Chicken
  - White Maw Hydra-Goose
---
# Hydra Goose

## Visuals

![[Attachments/monsters/hydra-goose.png|registry-image]]

**Look:** **White Maw Hydra-Goose** — three long feathered goose necks from one body; beaks split open to show **rows of teeth**; raw pink **flesh tears** on the necks where Lunafang mutation burst the skin. Farmyard bird turned shrieking multi-head horror.

*Exported once from Foundry actor `DbtEaQsj7oUpJO4x` (`Windows-sync/Mafia Arc/token_1 (4).png`). Foundry actor name may still read "Chicken"; vault title is **Hydra Goose**. Stats sync separately.*

## Role

**Lunafang-mutated farm beast** — one of the animals on a **West Town** farm (**Juniper Islands** archipelago: **West Town**, **York Town**, **Brook Town**) that transformed after a child dumped **faulty fertilizer** (laced with **[[LunaFang Serum|Lunafang]]**, part of **[[Dr Nikolai Tesla]]**'s Blue-wide distribution) into the feed.

The family fled to the **barn basement**; **[[Simon The One Armed Tyrant|Simon]]** and **[[Zara Tideborn]]** killed the parents to **cover up** the drug. The **children survived** and were rescued once the crew slew the **[[FarmBull]]**, **[[FarmPig]]**, and this creature together.

Multi-headed goose horror (session outline: "White Maw Hydra-Goose"). CR 5 controller with fear shriek and reactive heads.

## Appearances

- **West Town farm** — **Slain** by [[Matthew -The Jack- Burgess|Jack]], [[Tray]], and [[Midori]]. Session note and transcript **not yet filed**.
- **[[Sessions/Session 27]]** — outline references **White Maw Hydra-Goose** (swamp encounter variant possible).

## Related

- [[Dr Nikolai Tesla]] · [[LunaFang Serum]]
- [[Simon The One Armed Tyrant]] · [[Zara Tideborn]] — cover-up killings
- [[Midori]] · [[Matthew -The Jack- Burgess]] · [[Tray]]
- [[FarmBull]] · [[FarmPig]] — same West Town fight
- [[Ashscale Basilisk]] · [[Carrion Vulture]] · [[Cave Render]] — other Juniper threats
- [[Sessions/Session 25 - Juniper Islands]]
- [[Monster Manual|Monster Manual]]
## Live sheet (Foundry)

*Last synced: 2026-06-02 07:50 UTC*

```statblock
name: Chicken
size: large
type: humanoid
alignment: unaligned
ac: 15
hp: 92
speed: walk 40 ft., swim 20 ft.
stats: [18, 14, 17, 3, 12, 7]
cr: 5
traits:
- name: Multiattack
  desc: The hydra-goose makes three Bite attacks, each from a different head.
- name: Shrieking Chorus (Recharge 5-6)
  desc: Creatures within 30 ft must make a DC 15 WIS save or become frightened until the end of their next turn.
- name: Reactive Heads
  desc: The hydra-goose gains advantage on opportunity attacks and cannot be flanked.
actions:
- name: Bite
  desc: "Reach 10 ft. If two bites hit the same target in one turn, the target must succeed on a DC 15 STR save or be knocked prone. Melee Weapon Attack: +7 to hit. Hit: 2d8+4 piercing"
```