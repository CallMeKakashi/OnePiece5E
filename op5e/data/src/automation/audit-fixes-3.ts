import type { Spec } from "../../helpers/spec.js";

// Fixes from the 2026-10-10 compendium audit, chunk 3 (feats, racial features, creations), verified against the rules text.
const BPS = ["bludgeoning", "piercing", "slashing"];
const ch = (key: string, value: string, mode = 2) => ({ key, mode, value });
const P = (name: string, changes: ReturnType<typeof ch>[], disabled = false) => ({ name, transfer: true, disabled, changes });
const UNARMORED = (name: string, formula: string) => P(name, [ch("system.attributes.ac.calc", "custom", 5), ch("system.attributes.ac.formula", formula, 5)], true);

export const auditFixSpecs3: Record<string, Spec> = {
  "feats/Buck-Toothed": { activities: [
    { name: "Tail Slam", type: "damage", activation: "special", consumeUse: true, damage: [["1d6", "bludgeoning"]],
      note: "When you successfully shove a creature, slam it with your tail: choose 1d6 bludgeoning damage, a 10 ft shove instead of 5 ft, or the target's speed reduced by 10 ft until the end of its next turn." },
  ] },

  "feats/Heavy Armor Master": {
    activities: [{ name: "Heavy Armor Master", type: "utility", activation: "reaction", reactionWhen: "you are knocked prone or moved against your will", note: "Choose to not be knocked prone or moved." }],
    extraEffects: [P("Heavy Armor Master: -3 B/P/S from attacks (heavy armor)", BPS.map((t) => ch(`system.traits.dm.amount.${t}`, "-3")), true)],
  },

  "feats/Strong Arms": { activities: [
    { name: "First-turn strike", type: "damage", activation: "special", consumeUse: true, damage: [["2d6", ""]],
      note: "When you hit with an attack on your first turn in combat, it deals an extra 2d6 damage. Once per combat." },
  ] },

  "feats/Charger": { activities: [
    { name: "Charge: bonus damage", type: "damage", activation: "special", damage: [["1d8", ""]],
      note: "After moving at least 10 feet in a straight line towards your target before hitting with an attack as part of the Attack action: add 1d8 to the damage roll, or push the target up to 10 feet (no more than one size larger than you). Once on each of your turns." },
  ] },

  "feats/Pragmatic Vanity": {
    uses: { max: "floor(@prof / 2)", per: "lr" },
    activities: [{ name: "Charm Person (free)", type: "utility", activation: "action", consumeUse: true, note: "Use the Charm Person creation. Charisma or Intelligence is your creativity modifier for it." }],
  },

  "feats/Voracity": { activities: [
    { name: "Sour", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "hour" }, note: "You gain a 1d4 bonus to one skill of your choice in which you are proficient for 1 hour." },
    { name: "Sweet", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
      effects: [{ name: "Voracity: Sweet", seconds: 60, changes: [ch("system.attributes.movement.walk", "10")] }], note: "+10 bonus to your movement speed for 1 minute." },
    { name: "Salty", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
      effects: [{ name: "Voracity: Salty", seconds: 60, changes: [ch("system.bonuses.abilities.save", "+1d4")] }], note: "1d4 bonus to all saving throws for 1 minute." },
    { name: "Bitter", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
      effects: [{ name: "Voracity: Bitter", seconds: 60, changes: [ch("system.bonuses.mwak.damage", "+2"), ch("system.bonuses.rwak.damage", "+2")] }], note: "+2 bonus to all damage rolls made with weapon attacks for 1 minute." },
    { name: "Savory", type: "heal", activation: "bonus", consumeUse: true, healing: { formula: "1d12 + @details.level" }, note: "You regain hit points equal to 1d12 + your level." },
  ] },

  "feats/Vehicle Master": {
    uses: { max: "1", per: "lr" },
    activities: [{ name: "Spontaneous Repair", type: "heal", activation: "action", consumeUse: true, healing: { formula: "10 * @prof" }, note: "Repair your vehicle for 10 x your proficiency bonus hit points. Once per long rest." }],
  },

  "feats/Knack Of The Nurse": {
    uses: { max: "@prof", per: "sr" },
    activities: [{ name: "Knack of the Nurse: d4", type: "utility", activation: "special", consumeUse: true, roll: { formula: "1d4", name: "Bonus" },
      note: "Add a d4 to a Wisdom (Medicine) or Intelligence (Religion) check, or to the hit points restored by a creation. Uses equal to your proficiency bonus per short or long rest. Cure Wounds without a slot: once per long rest." }],
  },

  "feats/Holey Moley": { activities: [], extraEffects: [P("Holey Moley", [ch("system.attributes.senses.tremorsense", "20", 4), ch("system.attributes.movement.burrow", "floor(@attributes.movement.walk / 10) * 5", 4)])] },

  "feats/Gliding Skin": { activities: [
    { name: "Glide", type: "utility", activation: "reaction", reactionWhen: "you fall at least 10 feet above the ground", note: "Glide horizontally a number of feet equal to your walking speed and take 0 damage from the fall." },
  ] },

  "feats/Rapier Mastery": { activities: [
    { name: "Parrying Stance", type: "utility", activation: "bonus", duration: { value: 1, units: "round" },
      effects: [{ name: "Parrying Stance", rounds: 1, changes: [ch("system.attributes.ac.bonus", "1")] }], note: "+1 bonus to your AC until the start of your next turn." },
  ] },

  "class-features/Fighting Style: Thrown Weapon Fighting": { activities: [
    { name: "Thrown weapon hit", type: "damage", activation: "special", damage: [["2", ""]], note: "When you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll." },
  ] },

  "feats/Enhanced Circuitry": {
    uses: { max: "@prof", per: "lr" },
    activities: [{ name: "Countershock (free)", type: "utility", activation: "special", consumeUse: true, note: "Use the Countershock creation without expending a creation slot." }],
  },

  "feats/Dueling Master": { activities: [
    { name: "Precision Strike (-5 / +10)", type: "damage", activation: "special", damage: [["10", ""]], note: "Before a melee attack with a one-handed weapon you are proficient with, take a -5 penalty to the attack roll. If it hits, add +10 to the damage." },
    { name: "Opportunity Attack", type: "utility", activation: "reaction", reactionWhen: "a creature misses you with a melee attack", note: "Make an opportunity attack against that creature." },
    { name: "Parry", type: "utility", activation: "reaction", reactionWhen: "you are hit with an attack roll while wielding a melee weapon you are proficient with", duration: { value: 1, units: "round" },
      effects: [{ name: "Dueling Master: Parry", rounds: 1, changes: [ch("system.attributes.ac.bonus", "@prof")] }], note: "Add your proficiency bonus to your AC for that attack, potentially causing it to miss." },
  ] },

  "feats/Survivalist": {
    activities: [{ name: "Animal Friend (free)", type: "utility", activation: "", consumeUse: true, note: "Cast Animal Friend without expending a creation slot." }],
    extraEffects: [UNARMORED("Survivalist: Unarmored AC", "10 + @abilities.wis.mod + @abilities.dex.mod")],
  },

  "feats/Barbarian Adept": { activities: [
    { name: "Fighting Frenzy", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "round" },
      effects: [{ name: "Barbarian Adept: Frenzy", rounds: 1, changes: [ch("system.bonuses.mwak.damage", "+2"), ch("system.abilities.str.bonuses.check", "+2"), ch("system.abilities.str.bonuses.save", "+2")] }],
      note: "Until the start of your next turn, your weapon attacks made with Strength deal an additional 2 damage and you gain a +2 bonus to Strength checks and saving throws." },
  ] },

  "feats/Great Weapon Master": { activities: [
    { name: "Bonus Attack", type: "utility", activation: "bonus", consumeUse: true, note: "On your turn, make one melee weapon attack as a bonus action with a two-handed weapon you are wielding." },
    { name: "Power Attack (-5 / +10)", type: "damage", activation: "special", damage: [["10", ""]], note: "Before a melee attack with a heavy weapon you are proficient with, take a -5 penalty to the attack roll. If it hits, add +10 to the damage." },
    { name: "Reach Reaction", type: "utility", activation: "reaction", reactionWhen: "a creature enters the reach of the two-handed weapon you are wielding", note: "Make a weapon attack." },
  ] },

  "racial-features/Flaming Duality": { activities: [
    { name: "Ignited Form", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
      effects: [{ name: "Flaming Duality: Ignited", seconds: 60, changes: BPS.map((t) => ch("system.traits.dr.value", t)) }], note: "Flames erupt from your back and you gain resistance to bludgeoning, piercing, and slashing damage." },
    { name: "Godspeed Form", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
      effects: [{ name: "Flaming Duality: Godspeed", seconds: 60, changes: [ch("system.attributes.movement.walk", "10")] }], note: "Your movement speed increases by 10." },
  ] },

  "feats/Inky Depths": {
    uses: { max: "1", per: "sr" },
    activities: [
      { name: "Ink: Blindness (blindness only) or Grease", type: "utility", activation: "action", consumeUse: true, note: "Once per short or long rest, use the Blindness/Deafness creation (Blindness only) or the Grease creation, using Constitution as the creative ability." },
      { name: "Dash", type: "utility", activation: "bonus", note: "As a bonus action, you can dash." },
    ],
  },

  "feats/Religious": {
    uses: { max: "@prof", per: "lr" },
    activities: [
      { name: "Twist Fate (free)", type: "utility", activation: "reaction", consumeUse: true, note: "Use Twist Fate without expending a creation slot." },
      { name: "Holy Water", type: "heal", activation: "special", healing: { formula: "2d4 + 2" }, note: "A creature that drinks the holy water regains 2d4+2 hit points, after which the liquid becomes mundane." },
    ],
  },

  "feats/Master Carpenter": {
    uses: { max: "2", per: "lr" },
    activities: [
      { name: "Construct Hut (free)", type: "utility", activation: "action", consumeUse: true, note: "Use Construct Hut without a creation slot, once per long rest." },
      { name: "Construct Boat (free)", type: "utility", activation: "action", consumeUse: true, note: "Use Construct Boat without a creation slot, once per long rest." },
      { name: "Reinforce", type: "utility", activation: "action", duration: { value: 8, units: "hour" }, note: "Reinforce a 10 x 10 door, window, or wall, increasing the DC to break it by 5, to a maximum of 30. Lasts 8 hours." },
    ],
  },

  "feats/Bioluminescence": {
    uses: { max: "1", per: "sr" },
    activities: [
      { name: "Radiant Bolt: Blinding Light", type: "save", activation: "special", consumeUse: true, targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "8 + @prof + @abilities.con.mod", onSave: "none" },
        duration: { value: 1, units: "minute" }, effects: [{ name: "Blinded by Bioluminescence", onTargets: true, seconds: 60, statuses: ["blinded"] }],
        note: "Once per short or long rest, when you use Radiant Bolt, a creature hit makes a Constitution save or is blinded for 1 minute, repeating the save at the end of each of its turns." },
    ],
  },

  "feats/All-Consuming Maw": { activities: [
    { name: "Grapple", type: "utility", activation: "bonus", note: "When you hit with your natural weapon, make a grapple attempt." },
    { name: "Maw Damage", type: "damage", activation: "special", damage: [["1d4", "piercing"]], note: "A creature grappled this way takes 1d4 piercing damage at the start of each of your turns." },
  ] },

  "feats/Dark Wing Hunter": { activities: [], extraEffects: [P("Dark Wing Hunter", [ch("system.attributes.senses.blindsight", "10", 4), ch("system.attributes.movement.fly", "@attributes.movement.walk", 4)])] },

  "feats/Steadfast Scales": { activities: [
    { name: "Steadfast Scales", type: "heal", activation: "special", healing: { formula: "max(1, 1d@attributes.hd.largestFace + @abilities.con.mod)" }, note: "When you take the Dodge action, spend one Hit Die: roll it, add your Constitution modifier, and regain that many hit points (minimum 1). Remember to spend the Hit Die." },
  ] },

  "feats/Sling Master": { activities: [
    { name: "Critical Hit: Stun", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: "8 + @prof + @abilities.dex.mod", onSave: "none" },
      effects: [{ name: "Stunned by Sling Master", onTargets: true, rounds: 1, statuses: ["stunned"] }], note: "On a critical hit with a sling the target must succeed on the save or be stunned until the end of its next turn." },
    { name: "Critical Hit: Extra Damage", type: "damage", activation: "special", damage: [["@prof", ""]], note: "When you score a critical hit with a sling, you deal extra damage equal to your proficiency bonus." },
  ] },

  "feats/First Aid": { activities: [
    { name: "First Aid", type: "heal", activation: "action", healing: { formula: "1d6 + 4" }, note: "Spend one use of a healer's kit to restore 1d6 + 4 hit points plus additional hit points equal to the creature's maximum number of Hit Dice (add that manually). The creature can't regain hit points from this feat again until it finishes a short or long rest." },
  ] },

  "feats/Elemental Attack": { activities: [
    { name: "Elemental Attack", type: "utility", activation: "bonus", note: "The next weapon attack you make before the end of your turn deals additional damage of your chosen type." },
    { name: "Elemental Attack: damage", type: "damage", activation: "special", damage: [["1d8 + @prof", ["acid", "cold", "fire", "lightning", "poison"]]], note: "Extra damage of the type you chose when you gained this feat." },
  ] },

  "feats/Knack Of The Warrior": {
    uses: { max: "1", per: "lr" },
    activities: [
      { name: "Swap Places", type: "utility", activation: "reaction", reactionWhen: "a creature you can see within 5 ft of you is hit with an attack roll", note: "Swap places with the creature, and you are hit by the attack instead." },
      { name: "Shield (free)", type: "utility", activation: "reaction", consumeUse: true, note: "Cast Shield without expending a creation slot, once per long rest." },
    ],
  },

  "feats/Renegade Rodent": { activities: [
    { name: "Disengage or Hide", type: "utility", activation: "bonus", note: "Take the Disengage or Hide action as a bonus action." },
  ] },

  "racial-features/Bubble Floater": { activities: [
    { name: "Bubble Floater", type: "utility", activation: "action", duration: { value: 8, units: "hour" },
      effects: [{ name: "Bubble Floater", seconds: 28800, changes: [ch("system.attributes.movement.walk", "20")] }], note: "When near a body of water, create a bubble floater around your midsection: +20 walking speed for 8 hours." },
  ] },

  "racial-features/Sprint": { activities: [
    { name: "Sprint", type: "utility", activation: "special", duration: { value: 1, units: "round" },
      effects: [{ name: "Sprint", rounds: 1, changes: [ch("system.attributes.movement.walk", "2", 1)] }], note: "When you move on your turn, double your speed until the end of your turn. You can't use this again until you move 0 feet on one of your turns." },
  ] },

  "feats/Expressionist": {
    uses: { max: "1", per: "lr" },
    activities: [{ name: "Charm Person (free)", type: "utility", activation: "action", consumeUse: true, note: "Use Charm Person once without spending a creation slot. Uses your Charisma modifier." }],
    extraEffects: [UNARMORED("Expressionist: Unarmored AC", "10 + @abilities.cha.mod + @abilities.dex.mod")],
  },

  "feats/Cruel": {
    uses: { max: "3", per: "sr" },
    activities: [
      { name: "Cruelty Die: extra damage", type: "damage", activation: "special", consumeUse: true, damage: [["1d6", ""]], note: "When you deal damage to a creature, spend one cruelty die to deal extra damage equal to the roll. Only one cruelty die per turn; a critical hit regains 1 die." },
      { name: "Cruelty Die: temporary hit points", type: "heal", activation: "special", consumeUse: true, healing: { formula: "@details.level", type: "temp" }, note: "When you deal damage to a creature, spend one cruelty die to gain temporary hit points equal to your level." },
      { name: "Cruelty Die: Intimidation", type: "utility", activation: "special", consumeUse: true, roll: { formula: "1d6", name: "Intimidation bonus" }, note: "Add the roll to a Charisma (Intimidation) check." },
    ],
  },

  "creations/Banishing Smite": { activities: [
    { name: "Banishing Smite: damage", type: "damage", activation: "bonus", damage: [["5d10", "force"]], duration: { value: 1, units: "minute", concentration: true }, note: "When you hit with a melee weapon attack, the attack deals an extra 5d10 force damage." },
    { name: "Banishing Smite: banish", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute" },
      effects: [{ name: "Banished", onTargets: true, seconds: 60, statuses: ["incapacitated"] }], note: "On a failure the target vanishes into a harmless demiplane and is incapacitated for 1 minute." },
  ] },

  "creations/Tough Skin": { activities: [
    { name: "Tough Skin", type: "utility", activation: "action", rangeUnits: "touch", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "hour" },
      effects: [{ name: "Tough Skin", onTargets: true, seconds: 3600, changes: [ch("system.attributes.ac.min", "16", 4)] }],
      note: "The target's AC can't be less than 16. At higher levels: 17 with a 4th-level slot, 18 at 6th, 19 at 8th (edit the effect)." },
  ] },

  "creations/Shield": { activities: [
    { name: "Shield", type: "utility", activation: "reaction", reactionWhen: "you are hit by an attack or targeted by the missiles creation", duration: { value: 1, units: "round" },
      effects: [{ name: "Shield", rounds: 1, changes: [ch("system.attributes.ac.bonus", "5")] }], note: "+5 bonus to AC until the start of your next turn, including against the triggering attack, and you take no damage from the missiles creation." },
  ] },

  "creations/Stoneskin": { activities: [
    { name: "Stoneskin", type: "utility", activation: "action", rangeUnits: "touch", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "hour" },
      effects: [{ name: "Stoneskin", onTargets: true, seconds: 3600, changes: BPS.map((t) => ch("system.traits.dr.value", t)) }], note: "The target has resistance to bludgeoning, piercing, and slashing damage." },
  ] },

  "creations/Cure Wounds": { activities: [
    { name: "Cure Wounds", type: "heal", activation: "action", rangeUnits: "touch", targets: { count: 1, type: "creature" }, healing: { formula: "2d10 + @mod" },
      note: "No effect on undead or constructs. At higher levels the healing increases by 2d10 for each slot level above 1st (add manually)." },
  ] },

  "creations/Twist Fate": { activities: [
    { name: "Twist Fate", type: "utility", activation: "reaction", reactionWhen: "a creature you can see within 60 feet succeeds on an attack roll, an ability check, or a saving throw",
      note: "The triggering creature must reroll the d20 and use the lower roll. Then choose a creature you can see within range (possibly yourself): it has advantage on the next attack roll, ability check, or saving throw it makes within 1 minute." },
  ] },

  "creations/Hero's Feast": { activities: [
    { name: "Hero's Feast", type: "utility", activation: "minute", targets: { count: 12, type: "creature" }, duration: { value: 24, units: "hour" },
      effects: [{ name: "Hero's Feast", onTargets: true, seconds: 86400, changes: [ch("system.traits.di.value", "poison"), ch("system.traits.ci.value", "frightened"), ch("system.abilities.wis.save.roll.mode", "1", 4)] }],
      note: "Takes 1 hour to consume. Partakers are cured of all diseases and poison, become immune to poison and being frightened, and make Wisdom saves with advantage. Their hit point maximum also increases by 2d10 + your creativity modifier, and they gain the same number of hit points (apply manually)." },
  ] },

  "creations/Incidental Chorus": { activities: [
    { name: "Incidental Chorus", type: "utility", activation: "action", duration: { value: 10, units: "minute" }, note: "Music fills a 30-foot radius around you. You make Charisma (Performance) checks with advantage." },
    { name: "Beguile", type: "save", activation: "bonus", targets: { count: 1, type: "creature" }, save: { ability: "cha", onSave: "none" },
      note: "Beguile one creature within 30 feet that can see you and hear the music. If you or your companions are attacking it, it automatically succeeds. On a failure it becomes friendly to you while it can hear the music and for 1 hour after." },
  ] },

  "creations/Compulsion": { activities: [
    { name: "Compulsion", type: "save", activation: "action", save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true }, note: "A target automatically succeeds if it can't be charmed." },
    { name: "Designate Direction", type: "utility", activation: "bonus", note: "Designate a horizontal direction. Each affected target must use as much of its movement as possible to move that way on its next turn, then can repeat the Wisdom save to end the effect." },
  ] },

  "creations/Warding Wind": { activities: [
    { name: "Warding Wind", type: "utility", activation: "action", duration: { value: 10, units: "minute" }, note: "A strong wind blows in a 10-foot radius around you and moves with you. It deafens you and creatures in the area, extinguishes small flames, makes the area difficult terrain for others, and gives ranged weapon attacks passing in or out disadvantage." },
  ] },

  "creations/Alacrity": { activities: [
    { name: "Alacrity", type: "utility", activation: "minute", rangeUnits: "touch", targets: { count: 1, type: "creature" }, duration: { value: 8, units: "hour" },
      effects: [{ name: "Alacrity", onTargets: true, seconds: 28800, changes: [ch("system.attributes.init.bonus", "+1d8")] }], note: "The target adds 1d8 to its initiative rolls." },
  ] },

  "creations/Elemental Armor": { activities: [
    { name: "Elemental Armor", type: "heal", activation: "action", healing: { formula: "10", type: "temp" }, duration: { value: 1, units: "hour" },
      note: "Gain 10 temporary hit points (20 with a 3rd-level slot, 30 at 5th, 40 at 7th, 50 at 9th; adjust manually). A creature that hits you with a melee attack takes damage equal to the temporary hit points gained, of your chosen type: acid, fire, cold, lightning, poison, or thunder." },
  ] },

  "creations/Freedom of Movement": { activities: [
    { name: "Freedom of Movement", type: "utility", activation: "action", rangeUnits: "touch", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "hour" },
      effects: [{ name: "Freedom of Movement", onTargets: true, seconds: 3600, changes: [ch("system.attributes.movement.walk", "10"), ...["stunned", "paralyzed", "restrained"].map((v) => ch("system.traits.ci.value", v))] }],
      note: "The target's movement is unaffected by difficult terrain and is increased by 10 ft; creations and other effects can neither reduce its speed nor cause it to be stunned, paralyzed, or restrained." },
  ] },
};
