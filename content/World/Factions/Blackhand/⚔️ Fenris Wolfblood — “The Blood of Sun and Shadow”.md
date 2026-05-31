---
type:
  - NPC
publish: true
sources:
foundry_actor_id: "aqpa7CiZ0ehMYdEl"
foundry_live_slug: "fenris-wolfblood"
---
## Visuals

![[Attachments/fenris_wolfblood-portrait.png|Portrait]]


## 🩸 Character Overview

- **Build:** Broad-shouldered, muscular frame hardened by training and mutation.
    
- **Hair:** Long brown braid; often tied with a strip of his mother’s old scarf.
    
- **Beard:** Trimmed and well-kept.
    
- **Eyes:** Steel-grey with faint crimson rings when agitated or channeling hemocraft.
    
- **Skin:** Pale with alchemical scars that glow faintly in moonlight.
    
- **Markings:**
    
    - **Left Arm — Nika**: radiant sunburst tattoo, symbol of freedom.
        
    - **Right Arm — Imu**: shrouded eye, symbol of order and secrecy.
        
    - **Chest Scar:** Jagged diagonal slash from poacher encounter.
        
- **Attire:** Rough leather coat reinforced with surgical stitching; belts of vials and bandages.
    
- **Signature Gear:**
    
    - **Hemocraft Serum (Unused):** Sealed vial worn around neck.
        
    - **Sigrid’s Sigil Charm:** Small metal pendant etched with her riddle mark.
        
    - **Runic Gauntlets:** Channel blood magic safely through inscriptions.
        

---

## 🧬 Abilities & Combat Style

- **Class Mix:** Life Cleric / Blood Hunter (Order of the Mutant)
    
- **Style:** Switches from calm medic to berserker precision fighter.
    
- **Tactics:** Uses his own blood as catalyst for battle alchemy; heals allies by sacrificing vitality.
    
- **Mutation Traits:** Heightened endurance, reflexes, and slight regenerative factor.
    
- **Weakness:** Prolonged hemocraft use drains life and sanity.
    

---

## 🐒 Companion — _Vex, the Snow Monkey_

- **Species:** White mountain macaque
    
- **Appearance:** Frost-grey fur, blue eyes, gold-tinted claws.
    
- **Personality:** Mischievous, loyal, eerily intelligent.
    
- **Role:** Scout / Distraction / Emotional anchor for Fenris.
    
- **Notable Trait:** Mimics Fenris’s gestures; sometimes imitates his blood sigils in dust or snow.
    

---

## 🩸 Backstory — _“Child of the Brig”_

Fenris was born aboard the **Bat-Eyed Brig**, flagship of the mercenary outfit **Shadow Gallery**, who lived by one creed:

> “Honor the deal. Protect your own.”

His mother, **Sigrid the Riddlemaster**, served as the ship’s medic and cook—secretly a scholar of forbidden lore.  
She filled Fenris’s youth with tales of **Nika**, the Sun God of freedom, and **Imu**, the hidden shadow atop the world.  
No one knew how she learned such names, yet all respected her silence.

When pirates raided the Brig, **Sigrid was killed** defending her son.  
The crew’s captain, **Einar the Wolf-Slayer**, took the boy in and trained him in the **hemocraft**, the ancient art of blood manipulation.  
He gave him the surname **Wolfblood** and forged him into both healer and weapon.

At sixteen, Fenris sought mutation to amplify his power.  
Einar delayed the ritual, worried it would ruin his spirit.  
Before it could finish, Fenris was sent north on a supply run.

---

## ❄️ The Island & the Monkey

On a frozen East Blue isle, he found a wounded snow monkey trapped by poachers.  
He freed and nursed it back to health—naming it **Vex**.  
When he later destroyed the poachers’ camp alone, he was left stranded, half-frozen, until a pirate ship under **Commander Goro** arrived.

Goro had come hunting those same poachers and found Fenris amid their corpses.  
Impressed, he offered him a place aboard.  
Fenris refused until he could ask his captain’s leave—so Goro issued a **Davy Back Fight** to claim him honorably.  
Einar lost and surrendered Fenris, gifting him one last vial of **Hemocraft Serum** with the warning:

> “Don’t take it unless you’re sure. It changes more than your body.”

---

## ⚓ Two Years Later

Now nineteen and seasoned, **Fenris serves under Goro** within **Blackhand Cane’s Fleet**.  
He treats the wounded, keeps morale steady, and fights like a storm when cornered.  
He has met **Blackhand Cane** only briefly—earning the captain’s respect after saving his life.  
The vial still hangs untouched around his neck.

---

## 🩶 Personality & Motivations

|Trait|Description|
|---|---|
|**Core Drive**|To find balance between Sigrid’s compassion and Einar’s brutality.|
|**Temperament**|Stoic until provoked; warmth buried under discipline.|
|**Belief**|Every wound can teach if you survive it.|
|**Fear**|Losing control to his mutation.|
|**Bond**|Vex; the last living link to mercy.|
|**Ideal**|“Sun and Shadow keep the world alive.”|
|**Flaw**|Self-sacrificing to a fault; refuses to heal himself before others.|

---

## 🧠 Mechanics & Notes

- **Starting Level:** 3
    
- **Domains / Orders:** Life Domain Cleric / Order of the Mutant Blood Hunter
    
- **Mutation Serum:** Single-use narrative artifact; grants permanent hybrid trait when consumed.
    
- **Tattoo Marks:** Act as divine foci for channeling both holy magic and hemocraft.
    
- **Companion Statblock:** Treat as _Beast of the Land_ with custom “Frost Pelt” reaction (resists cold).
    

---

## 🪞 Character Art References

_(attach in Foundry / Obsidian as media links)_

- **Fenris Concept:** the 3rd design from pinned set (leather coat, braid, red runes).
    
- **Vex Concept:** final design chosen July 9 — white-furred monkey with blue eyes and gold claws.
    
- **Item Art:** Hemocraft Serum Vial (small crimson tube bound with wolf-etched clasp).
    

---

## 🧩 Narrative Hooks

- **Unused Serum** — Will he embrace mutation or resist it?
    
- **Shadow Gallery Legacy** — Rumors that Einar still lives, leading a new crew.
    
- **Mother’s Secrets** — Sigrid’s tales of Nika and Imu may tie into greater world truths.
    
- **Goro’s Test** — Loyalty or independence when Blackhand Cane’s fleet fractures.

### Vex (companion monkey)

> **Live Foundry sheet** — synced from world DB `blood-and-brine`. Not the workshop build template. Re-sync: `python scripts/sync_foundry_live_markdown.py`.

Actor id: `00uXu6jVvtmkK1z7` · synced 2026-05-31 03:45 UTC

```statblock
name: Vex
size: tiny
type: beast
alignment: Unaligned
ac: {'flat': None, 'calc': 'default'}
hp: 3
speed: walk 30 ft., climb 30 ft.
stats: [8, 14, 11, 4, 12, 6]
cr: 0
traits:
- name: Pack Tactics
  desc: The [[lookup @name lowercase]] has Advantage on an attack roll against a creature if at least one of the [[lookup @name lowercase]]'s allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition.
- name: Bite
  desc: [[/attack extended]]. [[/damage average extended]].
```
## Live sheet (Foundry)

*Last synced: 2026-05-31 05:10 UTC*

```statblock
name: Fenris Wolfblood
size: medium
type: humanoid
alignment: 
ac: 14
hp: 26 (None)
speed: 30 ft.
stats: [13, 19, 15, 12, 10, 14]
skills:
- Acrobatics: +6
- Animal Handling: +2
- Arcana: +3
- Athletics: +3
- Insight: +2
- Intimidation: +4
- Investigation: +3
- Medicine: +4
- Persuasion: +4
traits:
- name: Human
  desc: By far the most numerous of all races are humans. Inhabiting the entire world from the hundred and seventy kingdoms to the halls of Marie Geoise upon the Red Line, the humans have spread all across the four seas to stake claim to the title of masters of the world.Few humans are defined by their race, however. A varied kind from every echelon of society, one would find it difficult to place a blanket term on humans as a whole. They can be fearless heroes, intrepid adventure...
- name: Human Determination
  desc: "Once when you're reduced to 0 hit points but not killed outright, you can choose to fall to 1 hit point instead. You must finish a long rest before you can use this trait again."
- name: Strong Will
  desc: "When you fail a saving throw, you can roll a d4 and add it to the roll, possibly changing the outcome. You can do this a number of times equal to your proficiency bonus, and regain all uses when you finish a long rest. Roll: d4"
- name: Doctor
  desc: As the world is full of deadly diseases, there are doctors ready to combat such ailments. These doctors are better known for their additional social aspect of communicating with patients as well as often treating their ailments through an accessible and nonmagical procedure.Doctors also perform invasive procedures to save lives, like conducting surgeries or helping induce birth. For the most part, doctors are expected to be paragons of good. They are beholden to a code tha...
- name: First Aid
  desc: "You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight. You gain the following benefits:Increase your Wisdom score by 1, to a maximum of 20.You gain proficiency in Wisdom (Medicine) checks. If you were already proficient, you instead gain expertise.When you use a healer's kit to stabilize a dying creature, that creature also regains 1 hit point.As an action. you can spend one use of a healer's kit to tend to a creature and rest..."
- name: Blood Hunter
  desc: "DescriptionWilling to suffer whatever it takes to achieve victory, these adept warriors have forged themselves into a potent force dedicated to protecting the innocent.Hit Die: d10Primary Ability: Strength or Dexterity, & Intelligence or WisdomSaves: Dexterity & IntelligenceClass FeaturesLevel 1: Hit PointsHit Dice: 1d10 per blood hunter levelHit Points at 1st Level: 10 + your Constitution modifierHit Points at Higher Levels: 1d10 (or 6) + your Constitution modifier per bl..."
- name: Blood Maledict
  desc: Also at 1st level, you gain the ability to channel-or sometimes sacrifice-a part of your vital essence to curse and manipulate creatures through hemocraft magic. You know one blood curse of your choice, detailed in the “Blood Curses” section at the end of the class description. You learn one additional blood curse of your choice at 6th, 10th, 14th, and 18th level. Each time you learn a new blood curse, you can also choose one of the blood curses you know and replace it wit...
- name: Blood Curses
  desc: As a blood hunter, you have access to a range of blood curses that can tax the resilience of any foe. Blood Curse of the Anxious As a bonus action, you harry the body or mind of a creature within 30 feet of you, making them susceptible to forceful influence. Until the end of your next turn, Charisma checks made against the cursed creature have advantage. Amplify. The next the cursed creature makes before this curse ends has disadvantage. Blood Curse of Binding As a bonus a...
- name: "Blood Curses: Blood Curse of the Marked"
  desc: As a bonus action, you mark a creature that you can see within 30 feet of you. Until the end of your turn, whenever you hit the cursed creature with a weapon for which you have an active crimson rite, you roll an additional hemocraft die when determining the extra damage from the rite. Amplify. The next attack roll you make against the target before the end of your turn has advantage.
- name: "Crimson Rite: Rite of the Frozen"
  desc: The extra damage dealt by your rite is cold damage.
- name: Fighting Style
  desc: "At 2nd level, you adopt a style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again. Archery You gain a +2 bonus to attack rolls you make with ranged weapons. Dueling When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon. Great Weapon Fighting When you roll a 1 or 2 on a damage die for an attack y..."
- name: Crimson Rite
  desc: "Also at 2nd level, you learn to invoke a rite of hemocraft that infuses your weapon strikes with elemental energy. As a bonus action, you can activate any rite you know on one weapon you're holding. The effect of the rite lasts until you finish a short or long rest. When you activate a rite, you take necrotic damage equal to one roll of your hemocraft die. This damage can't be reduced in any way. While the rite is in effect, attacks you make with this weapon are magical, a..."
- name: "Fighting Style: Archery"
  desc: You gain a +2 bonus to attack rolls you make with ranged weapons.
- name: Blood Hunter Order
  desc: "At 3rd level, you commit to an order of blood hunters whose philosophy will guide you throughout your life: the Order of the Ghostslayer, the Order of the Lycan, the Order of the Mutant, or the Order of the Profane Soul, each of which is detailed at the end of the class description. Your choice grants you features at 7th level and again at 11th, 15th, and 18th level."
- name: Order of the Mutant
  desc: "DescriptionWilling to suffer whatever it takes to achieve victory, these adept warriors have forged themselves into a potent force dedicated to protecting the innocent. Hit Die: d10Primary Ability: Strength or Dexterity, & Intelligence or WisdomSaves: Dexterity & IntelligenceClass Features Level 3: Mutagencraft When you choose this archetype at 3rd level, you learn to master forbidden alchemical formulas-known as mutagens-that can temporarily alter your mental and physical..."
- name: Formulas
  desc: The number of mutagens you can concoct when you finish a rest, and the number of formulas you know, increases as you gain levels in the blood hunter class, as shown on the Mutagencraft table above. Additionally, when you learn a new mutagen formula, you can replace one formula you already know with a new mutagen formula. You choose four mutagen formulas to learn from the options detailed at the end of this subclass description, and you can concoct one mutagen when you fini...
- name: Mutagens
  desc: "The mutagens that are part of your hemocraft are presented in alphabetical order. You can learn a mutagen at the same time you meet its prerequisites. Aether Prerequisite: 11th level You have a flying speed of 20 feet for 1 hour. However, you have disadvantage on Strength checks and Dexterity checks during this time. Alluring Your skin and voice become malleable, allowing you to enhance your appearance and presence. You have advantage on Charisma checks. However, you have ..."
- name: "Formulas: Mobility"
  desc: You have immunity to the grappled and restrained conditions. However, you have disadvantage on Strength checks. At 11th level, you are also immune to the paralyzed condition.
- name: "Formulas: Unbreakable"
  desc: You have resistance to bludgeoning damage, and you have vulnerability to piercing damage.
- name: "Formulas: Precision"
  desc: Your weapon attacks score a critical hit on a roll of 19 or 20. However, you have disadvantage on Strength saving throws.
- name: "Formulas: Reconstruction"
  desc: For 1 hour, at the start of each of your turns when you have at least 1 hit point but fewer hit points than half your hit point maximum, you regain hit points equal to your proficiency bonus. However, your speed is reduced by 10 feet during this time.
- name: Brawler
  desc: The BrawlerLevelProficiency BonusBrawlingSpirit PointsUnarmored MovementFeatures1st+21d6--Brawling, Unarmored Defense2nd+21d62+10 ft.Spirit, Unarmored Movement3rd+21d63+10 ft.Brawling Style, Deflect Missiles4th+21d64+10 ft.Ability Score Improvement, Brace for Impact5th+31d65+10 ft.Extra Attack, Stunning Strike6th+31d86+15 ft.Style Feature7th+31d87+15 ft.Evasion, Shake it Off8th+31d88+15 ft.Ability Score Improvement9th+41d89+15 ft.Unarmored Movement Improvement10th+41d810+2...
- name: Unarmored Defense
  desc: Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.
- name: Brawling
  desc: "At 1st Level, your experience in street fighting gives you mastery of combat styles that use unarmed strikes and brawler weapons, which are improvised weapons and any simple melee weapons⁠ that lacks the two-handed or heavy property.You gain the following benefits while you are unarmed or wielding only brawler weapons and you aren't wearing armor or wielding a shield:You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and brawl..."
- name: Unarmed Strike
  desc: Instead of using a weapon to make a melee attack, you can use a punch, kick, head-butt, or similar forceful blow. In game terms, this is an Unarmed Strike-a melee attack that involves you using your body to damage, grapple, or shove a target within 5 feet of you.Whenever you use your Unarmed Strike, choose one of the following options for its effect.Damage. You make an attack roll against the target. Your bonus to the roll equals your Strength modifier plus your Proficienc...
- name: Small Medkit
  desc: This potion is a magic item. As a Bonus Action, you can drink it or administer it to another creature within 5 feet of yourself. The creature that drinks the magical red fluid in this vial regains 2d4 + 2 Hit Points.
- name: Rations
  desc: Rations consist of travel-ready food, including jerky, dried fruit, hardtack, and nuts. See “Malnutrition” for the risks of not eating.
- name: "Healer's Kit"
  desc: "A Healer's Kit has ten uses. As a Utilize action, you can expend one of its uses to stabilize an Unconscious creature that has 0 Hit Points without needing to make a Wisdom check."
- name: Captain
  desc: "Perhaps the most important role to fill on a ship is the captain. As a captain, you set the course of the ship you're sailing and spearhead your crew into the adventure ahead.Your most valuable power isn't your strength in combat, though it's typically above average, but rather your ability to inspire and lead others. As a captain, the lives of your entire crew rest upon your shoulders, and your duty towards them comes second to none.Skill Proficiencies: Persuasion choose ..."
- name: Force of Personality
  desc: "You have an unmistakable presence that is felt by all those around you.People and creatures that you meet with are more likely to be amenable and forthcoming, even if they don't understand why, the common folk are more willing to lend you their ear and even aid as long as you do not show yourself openly hostile to them. When you make a Charisma (Persuasion) check, the check cannot have disadvantage, nor be reduced in any way.Lastly, you have the potential to unlock the myt..."
- name: "Captain's Supplies"
  desc: (See Foundry for activity details.)
- name: Unarmed Master
  desc: "You are a master of using unarmed combat, you gain the following benefits:You gain a +1 bonus to attack rolls you make with unarmed strikes.Before you make an unarmed strike, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.Additionally the size of your unarmed strike becomes one die size larger (d4 => d6, etc.). If you do not already have a roll for the damage of your unarmed strikes, it becomes a d4. The maxim..."
- name: Spyglass
  desc: Objects viewed through a Spyglass are magnified to twice their size.
- name: Common Clothes
  desc: Clothes worn by most commoners.
- name: Pouch Of Berries (100K)
  desc: A pouch filled with 100,000 berries
- name: Pirate Flag
  desc: A Jolly Roger
- name: Dart
  desc: A small thrown implement crafted with a short wooden shaft and crossed feathres with a sharp wooden or metal tip. Darts can be thrown with sufficient force to puncture the skin.
- name: "Alchemist's Supplies"
  desc: "These special tools include the items needed to pursue a craft or trade in alchemy. Proficiency with a set of artisan's tools lets you add your proficiency bonus to any ability checks you make using the tools in your craft. Each type of artisan's tools requires a separate proficiency."
- name: Crossbow Bolt
  desc: This ammunition is used for all varieties of crossbow and is typically a short metal shaft with a narrow piercing tip.
- name: Studded Leather Armor
  desc: Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.
- name: Hand Crossbow
  desc: "A lightweight crossbow designed to be held in one hand or strapped to one's wrist to fire light bolts."
- name: "Explorer's Pack"
  desc: A backpack can hold one cubic foot or 30 pounds of gear. You can also strap items, such as a bedroll or a coil of rope, to the outside of a backpack.
- name: Tinderbox
  desc: This small container holds flint, fire steel, and tinder (usually dry cloth soaked in light oil) used to kindle a fire. Using it to light a torch - or anything else with abundant, exposed fuel - takes an action. Lighting any other fire takes 1 minute.
- name: Torch
  desc: A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet. If you make a melee attack with a burning torch and hit, it deals 1 fire damage.
- name: Bedroll
  desc: Roll of cloth used by traveller to sleep in.
- name: Rations
  desc: Rations consist of dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts.
- name: Hempen Rope (50 ft.)
  desc: Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.
- name: Waterskin
  desc: A leather hide sewn into an enclosed skin which can contain up to 4 pints of liquid. It weighs 5 pounds when full; a pint of water is approximately 1 pound.
- name: Mess Kit
  desc: This tin box contains a cup and simple cutlery. The box clamps together, and one side can be used as a cooking pan and the other as a plate or shallow bowl.
- name: "Crimson Rite: Hemostasis"
  desc: Fenris can put a creature in a cocoon of blood that restores the creature to max health.The process takes up to 60 seconds and the creature cannot be disturbed throughout this process.
- name: Transformation
  desc: (See Foundry for activity details.)
```