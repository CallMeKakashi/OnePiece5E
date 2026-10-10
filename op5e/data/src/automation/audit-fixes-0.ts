import type { Spec } from "../../helpers/spec.js";

// Verified fixes from the 2026-10-10 compendium audit, chunk 0 (class features). Imported after the original specs, so these replace them.
const MIN = (n = 1) => ({ value: n, units: "minute" as const });
const CDC = "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod, @abilities.con.mod, @abilities.int.mod, @abilities.wis.mod, @abilities.cha.mod)";
const WIS_DC = "8 + @prof + @abilities.wis.mod";
const MEDIC = "@classes.medic.levels";
const BPS = ["bludgeoning", "piercing", "slashing"];

export const auditFixSpecs0: Record<string, Spec> = {
  "class-features/Savage Slam": { activities: [
    { name: "Savage Slam", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: WIS_DC, onSave: "none" },
      effects: [{ name: "Knocked Prone", onTargets: true, statuses: ["prone"] }],
      note: "Once per turn when you hit with an unarmed strike you deal twice the number of damage dice; the target makes a Strength save or is knocked prone." },
    { name: "Savage Slam: you fall prone", type: "utility", activation: "special", effects: [{ name: "Prone (Savage Slam)", statuses: ["prone"] }], note: "You knock yourself prone after the attack." },
  ] },

  "class-features/Blastback": { activities: [
    { name: "Blastback", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: "8 + @prof + @abilities.str.mod", onSave: "none" },
      damage: [["floor(@classes.barbarian.levels / 2)", ""]],
      note: "Once per turn, while raging, when you hit with a heavy weapon. On a failed save the creature is pushed up to 15 feet away and takes extra damage equal to half your Barbarian level (rounded down)." },
  ] },

  "class-features/Diamond Soul": {
    activities: [{ name: "Diamond Soul: reroll", type: "utility", activation: "special", reactionWhen: "you fail a saving throw", consumeUse: true, consumeTarget: "spirit", note: "Spend 1 spirit point to reroll the failed save and take the second result." }],
    extraEffects: [{ name: "Diamond Soul (Strength and Dexterity saves)", transfer: true, changes: [{ key: "system.abilities.str.proficient", mode: 2, value: "1" }, { key: "system.abilities.dex.proficient", mode: 2, value: "1" }] }],
  },

  "class-features/Warding Master": { activities: [
    { name: "Warding Master", type: "utility", activation: "reaction", reactionWhen: "you or a creature you can see within 5 feet is hit by an attack", roll: { formula: "1d8", name: "Add to the target's AC against that attack" },
      note: "You must wield a melee weapon or a shield. Add the roll to the target's AC; if the attack still hits, the target has resistance to its damage." },
  ] },

  "class-features/Infection Radius": { activities: [
    { name: "Infection Radius", type: "save", activation: "special", area: { type: "radius", size: 10 }, targets: { type: "creature" }, save: { ability: "con", dc: CDC, onSave: "none" },
      damage: [[`1d(6 + 2 * (min(1, floor(${MEDIC} / 6)) + min(1, floor(${MEDIC} / 10)) + min(1, floor(${MEDIC} / 14))))`, "necrotic"]],
      note: "When a creature you can see moves within 10 feet of you or starts its turn there. Damage is 1d6, 1d8 at 6th, 1d10 at 10th, 1d12 at 14th level." },
  ] },

  "class-features/The Open Hand": { activities: [
    { name: "The Open Hand: start vibrations", type: "utility", activation: "special", consumeUse: true, consumeTarget: "spirit", consumeAmount: "3", targets: { count: 1, type: "creature" },
      note: "When you hit with an unarmed strike. The vibrations last a number of days equal to your brawler level; only one creature at a time." },
    { name: "The Open Hand: end vibrations", type: "save", activation: "action", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: WIS_DC, onSave: "none" },
      note: "On a failed save the creature is reduced to 0 hit points. On a success it takes 10d10 necrotic damage (use the next button)." },
    { name: "The Open Hand: damage on a successful save", type: "damage", activation: "special", damage: [["10d10", "necrotic"]] },
  ] },

  "class-features/Ardent Smite": { activities: [
    { name: "Ardent Smite", type: "damage", activation: "special", damage: [["2d8", ""]],
      note: "When you hit with a melee weapon attack, expend a creation slot: 2d8 for a 1st-level slot, plus 1d8 for each level higher than 1st (maximum 6d8). Damage type depends on your Ardent Soul. Add the extra dice by hand." },
  ] },

  "class-features/Rapid Action": {
    uses: { max: "max(1, 1 + @abilities.con.mod)", per: "lr" },
    activities: [
      { name: "Rapid Action: extra attack", type: "utility", activation: "special", consumeUse: true, note: "Whenever you take the Attack action, make one additional melee attack from the Afterimage's position." },
      { name: "Rapid Action: Afterimage intercepts", type: "utility", activation: "reaction", reactionWhen: "a creature attacks another creature you can see", note: "Before the attack roll, teleport the Afterimage to an unoccupied space within 5 feet of the target; the attack is made against the Afterimage." },
    ],
  },

  "class-features/Raging Charge": { activities: [
    { name: "Raging Charge", type: "damage", activation: "special", consumeUse: true, damage: [["2d8", ""]], note: "After moving 10 feet straight toward the target and hitting it. Damage is of the melee weapon's type." },
    { name: "Raging Charge: Strength save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod)", onSave: "none" },
      effects: [{ name: "Knocked Prone (Raging Charge)", onTargets: true, statuses: ["prone"] }], note: "On a failure the creature is pushed up to 10 feet away and knocked prone." },
  ] },

  "class-features/Ascendant Aspect": { activities: [
    { name: "Ascendant Aspect", type: "utility", activation: "bonus", consumeUse: true, consumeTarget: "spirit", consumeAmount: "4", duration: MIN(10),
      effects: [{ name: "Ascendant Aspect", seconds: 600, changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "1" }] }],
      note: "For 10 minutes (or until incapacitated): all Spirit Fist elements, a third attack with Extra Attack, larger Spirit Unleashed shapes." },
  ] },

  "class-features/Hand of Healing": { activities: [
    { name: "Hand of Healing", type: "heal", activation: "action", consumeUse: true, rangeUnits: "touch", targets: { count: 1, type: "creature" }, healing: { formula: "@scale.brawler.brawling-die + @abilities.wis.mod", type: "healing" },
      note: "If you have no uses left you can spend 1 spirit point instead." },
  ] },

  "class-features/Enrage": { activities: [
    { name: "Enrage", type: "utility", activation: "special", reactionWhen: "your bestial companion is reduced to 0 hit points", consumeUse: true, duration: MIN(),
      effects: [{ name: "Enrage", seconds: 60, changes: [
        ...BPS.map((v) => ({ key: "system.traits.dr.value", mode: 2, value: v })),
        ...["charmed", "frightened", "paralyzed"].map((v) => ({ key: "system.traits.ci.value", mode: 2, value: v })),
      ] }],
      note: "For 1 minute: resistance to bludgeoning, piercing and slashing; immune to charmed, frightened and paralyzed; speed cannot be reduced; one additional weapon attack when you take the Attack action. If you are reduced to 0 hit points your companion gains these instead (apply this to its sheet)." },
  ] },

  "class-features/Dark One": {
    activities: [],
    extraEffects: [{ name: "Dark One: darkvision 60 ft", transfer: true, changes: [{ key: "system.attributes.senses.ranges.darkvision", mode: 4, value: "60" }] }],
  },

  "class-features/Reactive Spirit": { activities: [
    { name: "Reactive Spirit", type: "utility", activation: "reaction", reactionWhen: "you have already taken your reaction (once per turn)", consumeUse: true, consumeTarget: "spirit", note: "Spend 1 spirit point to take an additional reaction. Only one reaction per triggering effect." },
  ] },

  "class-features/Explosive Cannon": { activities: [
    { name: "Explosive Cannon: detonate", type: "save", activation: "action", range: 60, area: { type: "radius", size: 20 }, targets: { type: "creature" }, save: { ability: "dex", dc: CDC, onSave: "half" }, damage: [["3d8", "force"]],
      note: "Detonate your Mechanical Cannon while within 60 feet of it. This destroys the cannon." },
  ] },

  "class-features/Commander in Chief": {
    uses: { max: "max(1, 1 + @abilities.cha.mod)", per: "sr" },
    activities: [{ name: "Commander in Chief", type: "utility", activation: "bonus", range: 30, targets: { count: 1, type: "ally" }, consumeUse: true,
      note: "Choose one: Ready, Aim, Fire! (add your Cha modifier to its next attack roll, until the end of its next turn); On Your Feet, Soldier! (add your Cha modifier to its next saving throw, until the start of your next turn); Duck! (the next attack roll against it is reduced by your Cha modifier); This Way! (it can use its reaction to move 5 x your Cha modifier feet, with opportunity attacks against it made at disadvantage)." }],
  },

  "class-features/Fighting Style: Thrown Weapon Fighting": {
    activities: [],
    extraEffects: [{ name: "Thrown Weapon Fighting: +2 damage with thrown weapons", transfer: true, disabled: true, changes: [{ key: "system.bonuses.rwak.damage", mode: 2, value: "+2" }] }],
  },

  "class-features/Immortal Will": { activities: [
    { name: "Immortal Will", type: "utility", activation: "action", consumeUse: true, consumeTarget: "spirit", consumeAmount: "4", duration: MIN(),
      effects: [{ name: "Immortal Will", seconds: 60, changes: [
        ...["acid", "bludgeoning", "cold", "fire", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"].map((v) => ({ key: "system.traits.dr.value", mode: 2, value: v })),
        { key: "flags.midi-qol.advantage.attack.all", mode: 5, value: "1" },
      ] }],
      note: "For 1 minute: resistance to all damage except force, and advantage on all attack rolls." },
  ] },

  "class-features/Numbed Nerves": {
    activities: [{ name: "Numbed Nerves", type: "utility", activation: "reaction", reactionWhen: "you take fire damage", consumeUse: true, note: "Instead of taking the fire damage, gain temporary hit points equal to the fire damage from the triggering source, not counting your resistance." }],
    extraEffects: [{ name: "Numbed Nerves: fire resistance", transfer: true, changes: [{ key: "system.traits.dr.value", mode: 2, value: "fire" }] }],
  },

  "class-features/Rage": { activities: [
    { name: "Rage", type: "utility", activation: "bonus", consumeUse: true, duration: MIN(),
      effects: [{ name: "Rage", seconds: 60, changes: [
        { key: "system.abilities.str.check.roll.mode", mode: 4, value: "1" }, { key: "system.abilities.str.save.roll.mode", mode: 4, value: "1" },
        { key: "system.bonuses.mwak.damage", mode: 2, value: "+@prof" },
        ...BPS.map((v) => ({ key: "system.traits.dr.value", mode: 2, value: v })),
      ] }],
      note: "Only if you are not wearing heavy armor. The damage bonus applies to melee weapon attacks using Strength and to unarmed strikes only. Ends early if incapacitated or you don heavy armor. You regain one expended use on a short rest and all on a long rest." },
  ] },

  "class-features/Endemic Surge": { activities: [
    { name: "Endemic Surge", type: "heal", activation: "action", consumeUse: true, consumeTarget: "experimental-medicine", duration: { value: 1, units: "hour" }, healing: { formula: `5 * ${MEDIC}`, type: "temp" },
      effects: [{ name: "Endemic Surge", seconds: 3600, changes: [{ key: "system.traits.dr.value", mode: 2, value: "necrotic" }, { key: "system.traits.dr.value", mode: 2, value: "poison" }, ...["mwak", "rwak", "msak", "rsak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: "+1d6[necrotic]" }))] }],
      note: "Expend a use of Experimental Medicine instead of transforming. Infection Radius damage dice are rolled twice. Lasts as long as an Experimental Medicine transformation." },
  ] },

  "class-features/Surgical Precision": { activities: [
    { name: "Surgical Precision", type: "utility", activation: "action", range: 30, targets: { count: 1, type: "creature" }, consumeUse: true, consumeTarget: "experimental-medicine",
      note: "Expend a use of Experimental Medicine to expose a creature until the end of your next turn. The next attack by you or an ally that hits it deals vulnerable damage, and the creature is then no longer exposed." },
  ] },

  "class-features/Healer's Touch": { activities: [
    { name: "Healer's Touch", type: "heal", activation: "bonus", rangeUnits: "touch", targets: { count: 1, type: "creature" }, consumeUse: true, consumeAmount: "max(1, @abilities.wis.mod)",
      healing: { formula: "(max(1, @abilities.wis.mod))d6", type: "healing" },
      note: "Touch a creature within 5 feet and spend up to your Wisdom modifier (minimum 1) healing dice. Alternatively add dice to a medic creation's healing, up to the creation's level." },
  ] },

  "class-features/Deflect Missiles": { activities: [
    { name: "Deflect Missiles", type: "utility", activation: "reaction", reactionWhen: "you are hit by a ranged attack", roll: { formula: "1d10 + @abilities.dex.mod + @classes.brawler.levels", name: "Damage reduced by" },
      note: "If you reduce the damage to 0 and have a free hand you can catch the missile." },
    { name: "Deflect Missiles: catch and throw", type: "utility", activation: "reaction", consumeUse: true, consumeTarget: "spirit",
      note: "Spend 1 spirit point to make a ranged attack with the caught weapon or ammunition (proficient, normal range 20 ft, long range 60 ft, no close range disadvantage)." },
  ] },

  "class-features/Exploding Shot": { activities: [
    { name: "Exploding Shot", type: "damage", activation: "special", damage: [["1d6", ""]], note: "Once per turn when you hit with a ranged weapon attack: extra 1d6 of the weapon's type, fire or thunder." },
    { name: "Exploding Shot: blast", type: "save", activation: "special", area: { type: "radius", size: 5 }, targets: { type: "creature" }, save: { ability: "dex", dc: CDC, onSave: "half" },
      note: "All creatures within 5 feet of the attack take the damage from the attack on a failure, or half on a success." },
  ] },
};
