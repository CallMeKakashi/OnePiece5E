import type { Spec } from "../../helpers/spec.js";

// Second compendium-audit pass (chunk 2), verified against the corrected pack output. A Spec replaces all generated activities of an item.
const MIN = (n = 1) => ({ value: n, units: "minute" as const });
const WIS_DC = "8 + @prof + @abilities.wis.mod";
const STR_DEX_DC = "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod)";
const BPS = ["bludgeoning", "piercing", "slashing"];
const DIE = "1d@scale.brawler.brawling-die.faces";

export const auditFixSpecs2: Record<string, Spec> = {
  "class-features/Paralysis Jutsu": { activities: [
    { name: "Paralysis Jutsu", type: "save", activation: "special", consumeUse: true, consumeTarget: "spirit", consumeAmount: "3", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: WIS_DC, onSave: "none" },
      effects: [{ name: "Paralyzed by Paralysis Jutsu", statuses: ["paralyzed"], onTargets: true, rounds: 1 }],
      note: "When you hit with a melee weapon attack, spend 3 spirit points. The target is paralyzed until the end of your next turn on a failed save." },
  ] },

  "class-features/Gigantic Might": { activities: [
    { name: "Gigantic Might: shockwave", type: "damage", activation: "special", damage: [["@details.level", "thunder"]],
      note: "While raging, when you score a critical hit with a weapon attack, all creatures of your choice within 5 ft of the target take thunder damage equal to your level." },
  ] },

  "class-features/Experimental Application": { activities: [
    { name: "Experimental Application", type: "heal", activation: "action", consumeUse: true, consumeTarget: "experimental-medicine", range: 30, targets: { type: "creature" }, healing: { formula: "5 * @classes.medic.levels", type: "healing" },
      note: "Divide these hit points among creatures within 30 feet. Not usable on Undead or Constructs." },
  ] },

  "class-features/Second-story Work": { activities: [],
    extraEffects: [{ name: "Second-story Work: climb speed", transfer: true, changes: [{ key: "system.attributes.movement.climb", mode: 4, value: "@attributes.movement.walk" }] }] },

  "class-features/Make Your Mark": { activities: [
    { name: "Mark", type: "utility", activation: "special", duration: { value: 1, units: "round" }, targets: { count: 1, type: "enemy" }, effects: [{ name: "Marked", onTargets: true, rounds: 2 }],
      note: "Mark a creature you hit with a melee weapon attack until the end of your next turn. While it is within your reach it has disadvantage on attack rolls that don't target you." },
    { name: "Punish the marked creature", type: "attack", activation: "bonus", attack: { type: "melee", ability: "str" }, includeBase: true, damage: [["floor(@classes.fighter.levels / 2)", ""]],
      note: "If the marked creature deals damage to anyone other than you, make this melee weapon attack against it as a bonus action on your next turn with advantage; on a hit it takes extra damage equal to half your fighter level." },
  ] },

  "class-features/Relentless Rage": {
    uses: { max: "20", per: "sr" },
    activities: [
      { name: "Relentless Rage", type: "save", activation: "special", reactionWhen: "You drop to 0 hit points while raging and don't die outright", consumeUse: true, save: { ability: "con", dc: "10 + 5 * @item.uses.spent", onSave: "none" },
        note: "DC 10, +5 each time you use this feature after the first; the DC resets when you finish a short or long rest. On a success you drop to 1 hit point instead." },
    ] },

  "class-features/Defense Roll": { activities: [
    { name: "Defense Roll", type: "utility", activation: "reaction", reactionWhen: "Hit by an attack", targets: { type: "self" },
      effects: [{ name: "Defense Roll", rounds: 1, changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "@prof" }] }],
      note: "Add your proficiency bonus to your AC for that attack and move half your movement in a direction you can see." },
  ] },

  "class-features/Water Shot": { activities: [
    { name: "Water Shot", type: "attack", activation: "action", range: 60, attack: { type: "ranged", ability: "dex" },
      damage: [[`${DIE} + max(@abilities.dex.mod, @abilities.wis.mod)`, BPS]],
      note: "In place of an unarmed strike. Use Dexterity or Wisdom (your choice) for the attack and damage rolls; damage is your choice of bludgeoning, piercing or slashing." },
  ] },

  "class-features/Agile Reflexes": { activities: [
    { name: "Read the Attacker", type: "utility", activation: "reaction", reactionWhen: "A creature hits you with an attack",
      effects: [{ name: "Agile Reflexes", rounds: 1, changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "@abilities.wis.mod" }] }],
      note: "Gain a bonus to AC equal to your Wisdom modifier against all subsequent attacks by that creature for the rest of the turn." },
  ] },

  "class-features/Opening Act": { activities: [
    { name: "Opening Act", type: "utility", activation: "bonus", range: 60, targets: { count: 1, type: "ally" },
      note: "Forgo your sneak attack this turn to highlight an ally that can hear you. When the ally hits, they add your sneak attack damage plus one chosen effect (19-20 crit range; target's next attack roll, check or save reduced by 1d6; or swap places if within 30 ft). Lasts until they hit or the end of their next turn." },
  ] },

  "class-features/Hostile Charge": { activities: [
    { name: "Hostile Charge", type: "damage", activation: "special", damage: [["@details.level", ""]],
      note: "Once per turn, when you move 20 ft toward a target and hit it with a melee attack: extra damage equal to your level, of the type chosen for your Forgemaster's Armor." },
  ] },

  "class-features/Skirmisher": {
    activities: [{ name: "Skirmisher", type: "utility", activation: "reaction", reactionWhen: "An enemy ends its turn within 5 ft of you", note: "Move up to half your speed; this movement doesn't provoke opportunity attacks. Climbing and swimming speeds you have also gain the +10 ft bonus." }],
    extraEffects: [{ name: "Skirmisher: +10 ft speed", transfer: true, changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "10" }] }],
  },

  "class-features/Surface Pressure": { activities: [
    { name: "Shove Damage", type: "damage", activation: "special", damage: [[DIE, "bludgeoning"]], note: "When you successfully shove a creature, it takes bludgeoning damage equal to your Martial Arts Die." },
    { name: "Grapple Damage (start of turn)", type: "damage", activation: "special", damage: [[DIE, "bludgeoning"]], note: "At the start of each of your turns, each creature you have grappled takes bludgeoning damage equal to your Martial Arts Die." },
  ] },

  "class-features/Survivor": { activities: [
    { name: "Survivor", type: "heal", activation: "special", healing: { formula: "5 + @abilities.con.mod", type: "healing" },
      note: "At the start of your turn, if you have no more than half your hit points (and more than 0), regain these hit points." },
  ] },

  "class-features/Honed Senses": { activities: [],
    extraEffects: [{ name: "Honed Senses: blindsight", transfer: true, changes: [{ key: "system.attributes.senses.blindsight", mode: 4, value: "10" }] }] },

  "class-features/True Mind": { activities: [],
    extraEffects: [{ name: "True Mind: Intelligence +2", transfer: true, changes: [{ key: "system.abilities.int.value", mode: 2, value: "2" }, { key: "system.abilities.int.max", mode: 4, value: "30" }] }] },

  "class-features/Palm Strikes": { activities: [
    { name: "Palm Strike: Knock Prone", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "dex", dc: WIS_DC, onSave: "none" },
      effects: [{ name: "Knocked Prone", statuses: ["prone"], onTargets: true }], note: "After hitting with an attack from Flurry of Blows: the target must succeed on a Dexterity save or be knocked prone." },
    { name: "Palm Strike: Push", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: WIS_DC, onSave: "none" },
      note: "After hitting with an attack from Flurry of Blows: on a failed Strength save you can push the target up to 15 feet away." },
    { name: "Palm Strike: No Reactions", type: "utility", activation: "special", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "round" },
      effects: [{ name: "Palm Strike: can't take reactions", onTargets: true, rounds: 2 }], note: "The target can't take reactions until the end of your next turn." },
  ] },

  "class-features/Tireless Spirit": { activities: [
    { name: "Regain Second Wind", type: "utility", activation: "special", consumeUse: true, consumeTarget: "second-wind", consumeAmount: "-1", note: "When you roll initiative with no uses of Second Wind remaining, regain one use." },
    { name: "Second Wind bonus", type: "heal", activation: "special", healing: { formula: "max(1, @abilities.wis.mod)", type: "healing" }, note: "Add this to the hit points restored whenever you use Second Wind." },
  ] },

  "class-features/Fighting Style: Thrown Weapon Fighting": { activities: [],
    extraEffects: [{ name: "Thrown Weapon Fighting: +2 damage (thrown weapon hit)", transfer: true, disabled: true, changes: [{ key: "system.bonuses.rwak.damage", mode: 2, value: "+2" }] }] },

  "class-features/Color of Observation Master": { activities: [
    { name: "Sense Future", type: "utility", activation: "special", duration: { value: 1, units: "round" }, targets: { type: "self" },
      effects: [{ name: "Sense Future", rounds: 1, changes: [
        { key: "flags.midi-qol.advantage.attack.all", mode: 5, value: "1" }, { key: "flags.midi-qol.advantage.ability.check.all", mode: 5, value: "1" },
        { key: "flags.midi-qol.advantage.ability.save.all", mode: 5, value: "1" }, { key: "flags.midi-qol.grants.disadvantage.attack.all", mode: 5, value: "1" },
      ] }],
      note: "At the start of your turn, spend two Observation Points (track manually). Until the start of your next turn you have advantage on attack rolls, ability checks and saving throws, and other creatures have disadvantage on attack rolls against you." },
  ] },

  "feats/Slasher": { activities: [
    { name: "Slasher: slow", type: "utility", activation: "special", duration: { value: 1, units: "round" }, targets: { count: 1, type: "enemy" },
      effects: [{ name: "Slashed: speed -10 ft", onTargets: true, rounds: 1, changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "-10" }] }],
      note: "Once per turn when you hit with slashing damage: reduce the target's speed by 10 feet until the start of your next turn." },
    { name: "Slasher: grievous wound", type: "utility", activation: "special", duration: { value: 1, units: "round" }, targets: { count: 1, type: "enemy" },
      effects: [{ name: "Grievously wounded: disadvantage on attacks", onTargets: true, rounds: 1, changes: [{ key: "flags.midi-qol.disadvantage.attack.all", mode: 5, value: "1" }] }],
      note: "On a critical hit with slashing damage: the target has disadvantage on all attack rolls until the start of your next turn." },
  ] },

  "class-features/Carving Inspiration": { activities: [
    { name: "Carving Inspiration", type: "utility", activation: "special", duration: { value: 1, units: "round" }, targets: { type: "self" },
      effects: [{ name: "Carving Inspiration", rounds: 1, changes: [{ key: "flags.midi-qol.advantage.attack.mwak", mode: 5, value: "1" }] }],
      note: "When you use your bonus action to give a creature a Bardic Inspiration die, you have advantage on melee weapon attacks until the end of your turn." },
  ] },

  "feats/Crusher": { activities: [
    { name: "Crusher: push", type: "utility", activation: "special", note: "Once per turn when you hit with bludgeoning damage: move the target 5 feet to an unoccupied space (no more than one size larger than you)." },
    { name: "Crusher: critical hit", type: "utility", activation: "special", duration: { value: 1, units: "round" }, targets: { count: 1, type: "enemy" },
      effects: [{ name: "Crushed: attacks against you have advantage", onTargets: true, rounds: 1, changes: [{ key: "flags.midi-qol.grants.advantage.attack.all", mode: 5, value: "1" }] }],
      note: "On a critical hit with bludgeoning damage: attack rolls against the target have advantage until the start of your next turn." },
  ] },

  "class-features/Transmutating Anodyne": { activities: [
    { name: "Transmutating Anodyne", type: "heal", activation: "bonus", consumeUse: true, targets: { type: "creature" }, healing: { formula: "2d10 + max(1, @abilities.cha.mod)", type: "temp" },
      note: "Creatures of your choice within the aura gain these temporary hit points. You lose the benefits of your Toxic Aura until it reforms at the end of your next turn." },
  ] },

  "class-features/Rallying Presence": { activities: [
    { name: "Restore 5 hit points", type: "heal", activation: "action", rangeUnits: "touch", targets: { count: 1, type: "creature" }, consumeUse: true, consumeAmount: "5", healing: { formula: "5", type: "healing" },
      note: "Each use draws 5 hit points from your pool (5 x savant level); use it once per 5 hit points you want to restore." },
    { name: "Cure disease or neutralize poison", type: "utility", activation: "action", rangeUnits: "touch", targets: { count: 1, type: "creature" }, consumeUse: true, consumeAmount: "5",
      note: "Expend 5 hit points from the pool to cure one disease or neutralize one poison affecting the target." },
  ] },

  "class-features/Observation Obliteration": { activities: [
    { name: "Observation Obliteration", type: "save", activation: "special", duration: MIN(), targets: { type: "creature" },
      save: { ability: "wis", dc: "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod, @abilities.con.mod, @abilities.int.mod, @abilities.wis.mod, @abilities.cha.mod)", onSave: "none" },
      effects: [{ name: "Observation Haki suppressed", onTargets: true, seconds: 60 }],
      note: "Additional Wisdom save after Overwhelming Presence. On a failure the creature loses all benefits of its observation haki for 1 minute, repeating the save at the end of each of its turns." },
  ] },

  "class-features/Doctor Death": {
    activities: [
      { name: "Doctor Death", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "wis", dc: WIS_DC, onSave: "none" },
        effects: [{ name: "Frightened by Doctor Death", statuses: ["frightened"], onTargets: true, rounds: 1 }],
        note: "Once per turn when you target a creature with Surgical Precision or Anatomical Study: on a failure it is frightened of you until the end of your next turn." },
    ],
    extraEffects: [{ name: "Doctor Death: frightened immunity", transfer: true, changes: [{ key: "system.traits.ci.value", mode: 2, value: "frightened" }] }],
  },

  "class-features/Swarming Cluster": { activities: [
    { name: "Swarm Damage", type: "damage", activation: "special", damage: [["1d6", "piercing"]], note: "Once on each of your turns, immediately after you hit a creature with an attack: the target takes 1d6 piercing damage." },
    { name: "Swarm Push", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: WIS_DC, onSave: "none" },
      note: "Once on each of your turns, after you hit: the target must succeed on a Strength save or be moved up to 15 feet in a direction of your choice." },
  ] },

  "class-features/Chemical Mastery": {
    activities: [{ name: "Chemical Mastery", type: "utility", activation: "special", consumeUse: true, note: "Cast Greater Restoration or Heal without a slot, preparation or material component, using alchemist's supplies as the creation focus. Three casts per long rest." }],
    extraEffects: [{ name: "Chemical Mastery", transfer: true, changes: [
      { key: "system.traits.dr.value", mode: 2, value: "acid" }, { key: "system.traits.dr.value", mode: 2, value: "poison" }, { key: "system.traits.ci.value", mode: 2, value: "poisoned" },
    ] }],
  },

  "feats/Naturalist": { activities: [],
    extraEffects: [{ name: "Naturalist: unarmored AC", transfer: true, disabled: true, changes: [{ key: "system.attributes.ac.calc", mode: 5, value: "custom" }, { key: "system.attributes.ac.formula", mode: 5, value: "13 + @abilities.dex.mod" }] }] },

  "feats/Tough Outer Shell": {
    activities: [{ name: "Tough Outer Shell", type: "utility", activation: "reaction", reactionWhen: "You take damage", consumeUse: true, roll: { formula: "1d6 + @prof", name: "Damage reduction" },
      note: "Reduce the damage you take by the total (minimum of 0 damage)." }],
    extraEffects: [{ name: "Tough Outer Shell: natural armor", transfer: true, disabled: true, changes: [{ key: "system.attributes.ac.calc", mode: 5, value: "custom" }, { key: "system.attributes.ac.formula", mode: 5, value: "13 + @abilities.dex.mod" }] }],
  },

  "feats/Katana Master": {
    uses: { max: "@prof", per: "sr" },
    activities: [
      { name: "Ken Die: extra damage", type: "damage", activation: "special", consumeUse: true, damage: [["1d4 + @prof", ""]], note: "When you hit with a Katana or Odachi, expend a Ken Die for extra damage." },
      { name: "Ken Die: AC bonus", type: "utility", activation: "reaction", reactionWhen: "A creature hits you", consumeUse: true, roll: { formula: "1d4 + @prof", name: "AC bonus" }, note: "Increase your AC by the result against that attack." },
    ],
  },

  "feats/Lucky": {
    uses: { max: "3", per: "lr" },
    activities: [{ name: "Spend a luck point", type: "utility", activation: "special", consumeUse: true, note: "Roll an additional d20 on an attack roll, ability check or saving throw, or when an attack is made against you, and choose which d20 is used." }],
  },

  "feats/Joyful": {
    uses: { max: "3", per: "sr" },
    activities: [
      { name: "Positivity die: raise AC", type: "utility", activation: "reaction", reactionWhen: "A friendly creature within 30 ft is hit by an attack", consumeUse: true, roll: { formula: "1d6", name: "AC bonus" }, note: "Add the roll to the creature's AC for that attack." },
      { name: "Positivity die: cheer on", type: "utility", activation: "bonus", range: 30, targets: { count: 1, type: "ally" }, consumeUse: true, roll: { formula: "1d6", name: "Bonus to next skill check or save" }, note: "Add the roll to the creature's next skill check or saving throw. A creature benefits from only one positivity die at a time." },
      { name: "Positivity die: initiative", type: "utility", activation: "special", consumeUse: true, roll: { formula: "1d6", name: "Initiative bonus" }, note: "When you roll initiative, spend a positivity die and add the roll." },
    ],
  },

  "feats/Beary Blue": {
    uses: { max: "3", per: "sr" },
    activities: [{ name: "Negativity die", type: "utility", activation: "special", consumeUse: true, roll: { formula: "1d6", name: "Add to the total" }, note: "Add to a failed saving throw, a death save (20 or higher returns you to 1 hit point), or a skill or tool check. Only one negativity die per turn." }],
  },

  "feats/Nimble Legs": { activities: [
    { name: "Nimble Legs: shove", type: "save", activation: "bonus", range: 5, targets: { count: 1, type: "creature" }, save: { ability: "str", dc: STR_DEX_DC, onSave: "none" },
      note: "After hitting with an attack: shove a target within 5 ft (no more than one size larger). On a failure you push it up to 10 feet away." },
  ] },

  "feats/Spear Mastery": { activities: [
    { name: "Wide Stance", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: STR_DEX_DC, onSave: "none" },
      note: "On your turn, expend half your movement. The next creature you hit with a melee spear, javelin, pike, trident or glaive must save; on a failure it is knocked prone or disarmed of an object it holds (your choice)." },
  ] },

  "feats/Logia Elemental Domain": { activities: [
    { name: "Produce Element", type: "utility", activation: "action", note: "Produce a near-infinite amount of your element and manipulate it as part of the same action." },
    { name: "Elemental Body", type: "utility", activation: "bonus", consumeUse: true, duration: MIN(), targets: { type: "self" },
      effects: [{ name: "Elemental Body", seconds: 60, changes: BPS.map((v) => ({ key: "system.traits.dr.value", mode: 2, value: v })) }],
      note: "Twice per long rest, transform for 1 minute: resistance to unimbued bludgeoning, piercing and slashing damage plus element-specific benefits." },
    { name: "Elemental Attack (2d8)", type: "damage", activation: "action", damage: [["(2 + floor((@details.level + 1) / 6))d8", ""]], note: "Damage of your element's type." },
    { name: "Elemental Attack (2d10)", type: "damage", activation: "action", damage: [["(2 + floor((@details.level + 1) / 6))d10", ""]], note: "Damage of your element's type." },
    { name: "Potent Use of Fruit", type: "utility", activation: "special", consumeUse: true, consumeTarget: "devil-fruit-uses", note: "Spend a fruit use to make more potent use of your fruit; lasting effects last 1 minute." },
  ] },

  "feats/Logia Improved Elemental Domain": { activities: [
    { name: "Elemental Resistance (15th)", type: "utility", activation: "reaction", reactionWhen: "You take imbued damage", consumeUse: true, consumeTarget: "devil-fruit-uses", note: "Expend a fruit use to gain resistance to one source of imbued damage." },
    { name: "Elemental Immunity (20th)", type: "utility", activation: "reaction", reactionWhen: "You take imbued damage", note: "No cost: gain immunity to one source of imbued damage instead." },
  ] },

  "feats/Diminutive Dudgeon": { activities: [
    { name: "Diminutive Dudgeon", type: "damage", activation: "special", consumeUse: true, damage: [["@details.level", ""]], note: "When you damage a creature larger than you with an attack or creation: extra damage equal to your level." },
  ] },

  "feats/Gourmand": {
    uses: { max: "@prof", per: "sr" },
    activities: [{ name: "Eat a treat", type: "heal", activation: "bonus", consumeUse: true, healing: { formula: "@details.level + @abilities.wis.mod", type: "temp" }, note: "A creature eats one of your special treats (you can cook a number equal to your proficiency bonus)." }],
  },

  "class-features/Undying Devotion": {
    uses: { max: "max(1, @abilities.con.mod)", per: "lr" },
    activities: [{ name: "Undying Devotion", type: "utility", activation: "special", reactionWhen: "You are reduced to 0 hit points but not killed outright", consumeUse: true, note: "Fall to 1 hit point instead. Uses equal your Constitution modifier per long rest, or expend a use of your Fighting Stance." }],
  },
};
