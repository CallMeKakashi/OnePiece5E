---
type: monster
status: draft
publish: true
foundry_actor_id: "dxxlqQu3zsnOlp9E"
foundry_live_slug: "grinner"
foundry_template_json: "Foundry/actors-json/juniper-islands/grinner.json"
---
# Grinner

## Visuals

![[Windows-sync/Mafia Arc/token_7 (1).png|registry-image]]

**Look:** Aberrant humanoid with an **unsettling grin** and predatory posture. Smarter eyes than the feral cave-things — it *watches*, *plans*, and smiles like it already knows you’ll panic.

## Role

Juniper Islands “mine-horror” line — **same origin vibe as [[Cave Render]]**, but **more intelligent** and **in command**:

- **Commands Cave Renders** (treated as the pack’s brain/handler)
- **Moves in and out of shadows** to stalk and reposition
- **Weaponized smile** — can inflict fear by holding eye contact and grinning (table fiction support for its fear/terror effects)

Export-backed sheet uses mind-stunning screeching and rapid regeneration unless disrupted.

## Related

- [[Monster Manual|Monster Manual]]
- [[Cave Render]] — feral cave-line predecessor / pack muscle
- [[Smiling Watcher]] — another intelligent “mine-horror” entry for the same broader vibe
## Live sheet (Foundry)

*Last synced: 2026-06-02 07:52 UTC*

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
- name: Aberrant Regeneration
  desc: The Grinner regains 10 HP at the start of its turn.
actions:
- name: Claw
  desc: "Melee Weapon Attack: +5 to hit. Hit: 1d8 +3 slashing"
- name: Mind Screech (Recharge 5-6)
  desc: All creatures within 15 ft must succeed on a DC 13 Wisdom saving throw or be stunned until the end of their next turn.
- name: Unsettling Smile
  desc: Enemies within 10 ft have disadvantage on their first attack each turn (DC 13 Wisdom save negates).
```