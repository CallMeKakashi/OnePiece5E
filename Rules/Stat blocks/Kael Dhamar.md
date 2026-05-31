---
type: actor
faction: "[[Unaffiliated]]"
status: draft
publish: true
foundry_template_json: "Foundry/actors-json/Kael Dhamar.json"
foundry_actor_id: "sjBWp7mvJG4gI3LZ"
foundry_live_slug: "kael"
---
# Kael Dhamar

Foundry actor export — no campaign biography note yet. Link from [[Rules/Stat blocks]] or faction hub when placed in-world.
## Build template (Foundry)

> **Build template only** — not the live Foundry sheet. Running stats live in the Pi world `blood-and-brine` → `data/actors/`.

Workshop file: `[[Foundry/actors-json/Kael Dhamar.json]]`. Regenerate: `python scripts/sync_foundry_statblocks.py`.

```statblock
name: Kael Dhamar
size: medium
type: humanoid
alignment: Neutral
ac: 10
hp: 90
speed: walk 30 ft.
stats: [14, 18, 16, 12, 13, 14]
cr: 5
traits:
- name: Duelist Rapier
  desc: See Foundry.
- name: Offhand Dagger
  desc: See Foundry.
- name: Sneak Attack (2d6)
  desc: Once per turn, Kael deals an extra 2d6 damage to one creature he hits with a finesse or ranged weapon attack if he has advantage or an ally is within 5 ft.
- name: Action Surge (1/Short Rest)
  desc: Kael takes one additional Action on his turn.
- name: Extra Attack
  desc: Kael can attack twice whenever he takes the Attack action.
```
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Kael
size: medium
type: humanoid
alignment: 
ac: 18
hp: 95 (32)
speed: walk 30 ft., swim 40 ft.
stats: [20, 13, 19, 10, 12, 11]
cr: 5
senses: darkvision 60 ft.
skills:
- Animal Handling: +3
- Athletics: +7
- Intimidation: +2
- Nature: +2
- Perception: +3
- Survival: +3
traits:
- name: Splint Armor
  desc: This armor is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding. Flexible chain mail protects the joints.
- name: Fishman
  desc: Ten times stronger than the common man and undisputed monarchs of the sea, the fishmen of the world oceans were for the longest time the boogeymen of sailors everywhere. Tall and proud warriors of the deep, the fishmen share a troubled history of racial discrimination and slavery at the hands of humans, scars that even centuries of peace with the surface world has yet to completely mend.A lot of the prejudice against them stems from how they differ from humans, looking mon...
- name: Aquatic Adaption
  desc: You can breathe air and water. You have advantage on all Strength (Athletic) ability checks made while in water. In addition, you gain resistance to cold damage.
- name: Speech of the Sea
  desc: You can communicate simple ideas and words to creatures with a natural swimming speed that are of large size or smaller. Most sealife cannot form or understand complicated messages, but can communicate simple expressions and desires such as fear, hunger or joy.
- name: Darkvision (60 ft)
  desc: "You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet.DAE: Uses ATL to setup darkvision of 60 feet."
- name: Powerful Build
  desc: You have Advantage on any ability check you make to end the condition. You also count as one size larger when determining your carrying capacity.Foundry NoteThis feature includes an Active Effect which automatically upgrades your size when determining carrying capacity.
- name: Strong Body
  desc: Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.
- name: Amphibious
  desc: "the [[lookup @name lowercase]] can breathe air and water."
- name: Blood Frenzy
  desc: "the [[lookup @name lowercase]] has advantage on melee attack rolls against any creature that doesn't have all its hit points."
- name: Multiattack
  desc: "the [[lookup @name lowercase]] makes a number of attacks in one action. These attacks can be of the same type or a mixed variety of its attack actions."
- name: Bite
  desc: . .
- name: Harpoon-Flail
  desc: "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) bludgeoning damage. If the target is a Medium or smaller creature, it is grappled (escape DC 16). Until this grapple ends, the target is restrained, and Kael can't use his Harpoon-Flail on another target."
- name: Mercenary
  desc: As a mercenary, your services were for hire to anyone who could afford them. What drove you to be a soldier of fortune? Was it to escape poverty? Was it the thrill of battle? Or was it simply that fighting was all you knew growing up? Who was your mercenary company, or did you work alone? What made you give it up, or are you still for hire? Did you make any allies or enemies along the way? What wars or battles were involved in? What were the consequences? Lost allies? War ...
- name: Fighting Initiate
  desc: "Prerequisite: Proficiency with a martial weaponYour martial training has helped you develop a particular style of fighting. As a result, you gain the following benefits:Increase your Strength, Dexterity, or Constitution by 1, to a maximum of 20.You learn one Fighting Style option of your choice from any class. If you already have a style, the one you choose must be different. Whenever you reach a level that grants the Ability Score Improvement feature, you can replace this..."
- name: Barbarian
  desc: "DescriptionA fierce warrior who can enter a battle rageHit Die: d12Primary Ability: StrengthSaves: Strength & Constitution Class FeaturesLevel 1: Hit PointsHit Dice: 1d12 per barbarian levelHit Points at 1st Level: 12 + your Constitution modifierHit Points at Higher Levels: 1d12 (or 7) + your Constitution modifier per barbarian level after 1stLevel 1: ProficienciesArmor: Light armor, medium armor, shieldsWeapons: Simple weapons, martial weaponsTools: NoneSaving Throws: Str..."
- name: Rage
  desc: "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain the following benefits if you aren't wearing heavy armor: You have advantage on Strength checks and Strength saving throws. When you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian, as shown in the Rage Damage column of the Barbarian table. You have resistance to bludgeoning, ..."
- name: Unarmored Defense
  desc: While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.
- name: Reckless Attack
  desc: Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.
- name: Danger Sense
  desc: "At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated."
- name: Primal Path
  desc: At 3rd level, you choose a path that shapes the of your rage. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels.
- name: Path of the Berserker
  desc: "DescriptionA fierce warrior who can enter a battle rageHit Die: d12Primary Ability: StrengthSaves: Strength & Constitution Class FeaturesStarting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.Beginning at 6th level, you can't be charmed or frigh..."
- name: Frenzy
  desc: Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.
- name: Extra Attack
  desc: Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.
- name: Fast Movement
  desc: "Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor."
```
