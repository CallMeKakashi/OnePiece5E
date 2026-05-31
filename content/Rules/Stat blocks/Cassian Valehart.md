---
type: actor
faction: "[[Unaffiliated]]"
status: draft
publish: true
foundry_template_json: "Foundry/actors-json/Cassian_Valehart.json"
foundry_actor_id: "MqilDzEChn3Ipwjb"
foundry_live_slug: "cassian-valehart"
---
# Cassian Valehart

Foundry actor export — no campaign biography note yet. Link from [[Rules/Stat blocks]] or faction hub when placed in-world.
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop file: `[[Foundry/actors-json/Cassian_Valehart.json]]`. Regenerate: `python scripts/sync_foundry_statblocks.py`.

```statblock
name: Cassian Valehart
size: medium
type: Humanoid (Human)
alignment: Lawful Neutral
ac: 10
hp: 91
speed: walk 30 ft.
stats: [12, 16, 14, 18, 16, 17]
cr: 0
traits:
- name: Haki (Kenbunshoku/Observation)
  desc: Cassian has awakened the basic form of Observation Haki. He cannot be surprised while conscious, and he has advantage on Wisdom (Insight) checks to determine if a creature is lying.
- name: The Cross-Examiner
  desc: Cassian can analyze a creature he interacts with for at least 1 minute. He learns the creature's Alignment, current emotional state, and if they are under any magical compulsion.
- name: Legal Immunity
  desc: As a Sanctioned Defense Advocate, Cassian has advantage on Charisma checks when dealing with Marines below the rank of Captain or government officials, provided he has not openly committed a violent crime in their presence.
- name: Acoustic Resonance
  desc: Cassian's "spells" are non-magical effects produced by the precise frequencies of his flute and psychological manipulation. They function exactly like spells but cannot be Counterspelled (though they can be silenced by a Silence spell or deafening the target).
- name: Multiattack
  desc: Cassian makes two attacks with Requiem of Clause (Quarterstaff form).
- name: Requiem of Clause (Staff Form)
  desc: Melee Weapon Attack, +6 to hit, reach 5 ft., one target. Hit 7 (1d8 + 3) bludgeoning damage plus 4 (1d8) thunder damage. On a hit, the target must succeed on a DC 14 Constitution saving throw or have their movement speed reduced by 10 feet until the start of Cassian's next turn due to vibrating muscles.
- name: Dissonant Verdict (Recharge 5-6)
  desc: Cassian plays a jarring, high-frequency note that disrupts the equilibrium of his enemies. Each creature in a 15-foot cone originating from him must make a DC 15 Constitution saving throw. On a failure, a creature takes 22 (5d8) thunder damage and is pushed 10 feet away. On a success, they take half damage and are not pushed.
- name: Cease and Desist (3/Day)
  desc: Cassian targets one humanoid he can see within 60 feet. The target must succeed on a DC 15 Wisdom saving throw or be Paralyzed for 1 minute as they are overwhelmed by a combination of hypnotic sound and authoritative command. The target can repeat the saving throw at the end of each of its turns, ending the effect on a success.
- name: Shift Form
  desc: Cassian collapses or extends 'Clause' between Flute mode and Quarterstaff mode.
- name: Closing Argument
  desc: Cassian targets one ally within 30 feet who can hear him. That ally gains a d8 Inspiration die. Once within the next 10 minutes, the ally can roll the die and add the number rolled to one ability check, attack roll, or saving throw.
- name: Objection!
  desc: When a creature Cassian can see within 60 feet makes an attack roll or a damage roll, Cassian shouts a logical fallacy or plays a sharp, distracting note. The creature must subtract 1d6 from that roll.
```
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Cassian Valehart
size: medium
type: Humanoid (Human)
alignment: Lawful Neutral
ac: 15
hp: 91
speed: walk 30 ft.
stats: [12, 16, 14, 18, 16, 17]
cr: 0
traits:
- name: Haki (Kenbunshoku/Observation)
  desc: Cassian has awakened the basic form of Observation Haki. He cannot be surprised while conscious, and he has advantage on Wisdom (Insight) checks to determine if a creature is lying.
- name: The Cross-Examiner
  desc: "Cassian can analyze a creature he interacts with for at least 1 minute. He learns the creature's Alignment, current emotional state, and if they are under any magical compulsion."
- name: Legal Immunity
  desc: As a Sanctioned Defense Advocate, Cassian has advantage on Charisma checks when dealing with Marines below the rank of Captain or government officials, provided he has not openly committed a violent crime in their presence.
- name: Acoustic Resonance
  desc: "Cassian's \"spells\" are non-magical effects produced by the precise frequencies of his flute and psychological manipulation. They function exactly like spells but cannot be Counterspelled (though they can be silenced by a Silence spell or deafening the target)."
- name: Multiattack
  desc: Cassian makes two attacks with Requiem of Clause (Quarterstaff form).
- name: Requiem of Clause (Staff Form)
  desc: "Melee Weapon Attack, +6 to hit, reach 5 ft., one target. Hit 7 (1d8 + 3) bludgeoning damage plus 4 (1d8) thunder damage. On a hit, the target must succeed on a DC 14 Constitution saving throw or have their movement speed reduced by 10 feet until the start of Cassian's next turn due to vibrating muscles."
- name: Dissonant Verdict (Recharge 5-6)
  desc: Cassian plays a jarring, high-frequency note that disrupts the equilibrium of his enemies. Each creature in a 15-foot cone originating from him must make a DC 15 Constitution saving throw. On a failure, a creature takes 22 (5d8) thunder damage and is pushed 10 feet away. On a success, they take half damage and are not pushed.
- name: Cease and Desist (3/Day)
  desc: Cassian targets one humanoid he can see within 60 feet. The target must succeed on a DC 15 Wisdom saving throw or be Paralyzed for 1 minute as they are overwhelmed by a combination of hypnotic sound and authoritative command. The target can repeat the saving throw at the end of each of its turns, ending the effect on a success.
- name: Shift Form
  desc: "Cassian collapses or extends 'Clause' between Flute mode and Quarterstaff mode."
- name: Closing Argument
  desc: Cassian targets one ally within 30 feet who can hear him. That ally gains a d8 Inspiration die. Once within the next 10 minutes, the ally can roll the die and add the number rolled to one ability check, attack roll, or saving throw.
- name: "Objection!"
  desc: When a creature Cassian can see within 60 feet makes an attack roll or a damage roll, Cassian shouts a logical fallacy or plays a sharp, distracting note. The creature must subtract 1d6 from that roll.
```