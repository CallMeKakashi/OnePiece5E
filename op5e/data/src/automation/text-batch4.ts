import type { Spec, EffectSpec } from "../../helpers/spec.js";

// Text-only features the DM approved to become usable (issue #26, per-feature review in reports/text-only/output-*.json).
// Riders that depend on situations (once per turn, reactions, a specific weapon) stay in the description text.
const ch = (key: string, value: string, mode = 2) => ({ key, mode, value });
const passive = (name: string, ...changes: ReturnType<typeof ch>[]): EffectSpec => ({ name, transfer: true, changes });
const POISONED = (name: string, seconds = 60): EffectSpec => ({ name, statuses: ["poisoned"], seconds, onTargets: true });
const CON_DC = "8 + @prof + @abilities.con.mod";

export const batch4Specs: Record<string, Spec> = {
  // Gadgeteer (Alchemist): one cocktail per long rest, two at 6th, three at 15th; each cocktail is one use
  "class-features/Chemical Cocktail": {
    uses: { max: "1 + min(1, floor(@classes.gadgeteer.levels / 6)) + min(1, floor(@classes.gadgeteer.levels / 15))", per: "lr" },
    activities: [
      { name: "Healing Cocktail", type: "heal", activation: "bonus", consumeUse: true, targets: { count: 1, type: "creature" }, healing: { formula: "4d4 + @abilities.int.mod" } },
      { name: "Swiftness Cocktail", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "hour" }, effects: [{ name: "Swiftness Cocktail", seconds: 3600, changes: [ch("system.attributes.movement.walk", "10")] }] },
      { name: "Resilience Cocktail", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 10, units: "minute" }, effects: [{ name: "Resilience Cocktail", seconds: 600, changes: [ch("system.attributes.ac.bonus", "1")] }] },
      { name: "Boldness Cocktail", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
        effects: [{ name: "Boldness Cocktail", seconds: 60, changes: [ch("system.bonuses.mwak.attack", "+1d4"), ch("system.bonuses.rwak.attack", "+1d4"), ch("system.bonuses.msak.attack", "+1d4"), ch("system.bonuses.rsak.attack", "+1d4"), ch("system.bonuses.abilities.save", "+1d4")] }] },
      { name: "Strength Cocktail", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" }, note: "Extra melee damage equal to the alchemist's Intelligence modifier; the effect uses the drinker's Intelligence modifier, so edit it when someone else drinks.",
        effects: [{ name: "Strength Cocktail", seconds: 60, changes: [ch("system.bonuses.mwak.damage", "+@abilities.int.mod")] }] },
      { name: "Transformation Cocktail", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 10, units: "minute" }, note: "The drinker is transformed as if by the Alter Self creation: cast it on the drinker." },
    ],
  },
  "feats/Drunkard": {
    uses: { max: "2", per: "lr" },
    activities: [{ name: "Drink", type: "heal", activation: "special", consumeUse: true, healing: { formula: "2d6 + @details.level" }, note: "Use when you drink an alcoholic drink." }],
    extraEffects: [passive("Drunkard", ch("system.traits.dr.value", "poison"))],
  },
  "feats/Ominous Toxin": {
    activities: [
      { name: "Poisoned Strike", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: CON_DC, onSave: "half" }, damage: [["2d4", "poison"]], note: "Once per turn, as part of a weapon attack." },
      { name: "Toxic Skin", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: CON_DC, onSave: "none" }, effects: [POISONED("Poisoned by Toxic Skin")], note: "A creature that starts its turn in direct contact with your skin; it repeats the save at the end of each of its turns, and a creature that succeeds is immune for an hour." },
    ],
    extraEffects: [passive("Ominous Toxin", ch("system.traits.dr.value", "poison"))],
  },
  // Blitzkrieg: the Afterimage is a premade actor in the summons pack (same AC, 1 hit point, immune to conditions)
  "class-features/Afterimage": {
    activities: [{ name: "Create Afterimage", type: "summon", activation: "bonus", range: 30, rangeUnits: "ft", summon: { profiles: ["Afterimage"], ac: "@attributes.ac.value", hp: "1" },
      note: "Lasts until destroyed, dismissed, replaced or you are incapacitated. Swap places for 15 feet of movement; attacks can come from its space; opportunity attack as a reaction." }],
  },
  "class-features/Bullet Time": {
    uses: { max: "@prof", per: "lr" },
    activities: [{ name: "Enter Bullet Time", type: "utility", activation: "bonus", consumeUse: true, duration: { value: 1, units: "minute" },
      effects: [{ name: "Bullet Time", seconds: 60 }], note: "30 ft Focus radius: reaction firearm attack against a hostile creature moving 10 ft away from an ally; attacks against you from the radius lose advantage; a Dexterity save for half takes none on success and half on failure." }],
    extraEffects: [passive("Bullet Time initiative", ch("system.attributes.init.bonus", "+@prof"))],
  },
  "feats/Caring": {
    uses: { max: "3", per: "sr" },
    activities: [
      { name: "Care Die: add to healing", type: "utility", activation: "special", consumeUse: true, roll: { formula: "1d6", name: "Care die" }, note: "Add to hit points you restore. One care die per turn." },
      { name: "Care Die: temporary hit points", type: "heal", activation: "special", consumeUse: true, healing: { formula: "@details.level", type: "temp" }, note: "When you restore hit points to a creature. One care die per turn." },
      { name: "Care Die: Persuasion", type: "utility", activation: "special", consumeUse: true, roll: { formula: "1d6", name: "Care die" }, note: "Add to a Charisma (Persuasion) check." },
    ],
  },
  "class-features/Drunken Arts": {
    activities: [{ name: "Drunken Arts", type: "heal", activation: "special", healing: { formula: "max(0, @abilities.wis.mod) * (1 + min(1, floor(@classes.brawler.levels / 6)))", type: "temp" }, note: "Use at the start of each of your turns while you have at least 1 hit point." }],
  },
  "class-features/Ferocious Charger": {
    activities: [
      { name: "Ferocious Charge", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: "8 + @prof + @abilities.str.mod", onSave: "none" }, effects: [{ name: "Knocked prone", statuses: ["prone"], onTargets: true }], note: "After moving 10 ft in a straight line and hitting. Once per turn." },
      { name: "Mounted Charge Damage", type: "utility", activation: "special", roll: { formula: "@details.level", name: "Extra damage while mounted" }, note: "If you are mounted when you use the charge." },
    ],
  },
  "feats/Inspiring Leader": {
    activities: [{ name: "Inspire", type: "heal", activation: "minute", range: 30, rangeUnits: "ft", targets: { count: 6, type: "ally" }, healing: { formula: "2 * @details.level + @abilities.cha.mod", type: "temp" }, note: "Up to six friendly creatures who can see or hear you. A creature can't gain this again until it finishes a short or long rest." }],
  },
  "feats/Mammal of Action": {
    activities: [{ name: "Envenom", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", dc: CON_DC, onSave: "none" }, effects: [POISONED("Envenomed")], note: "Once per turn when you hit with your natural weapon. The target repeats the save at the end of each of its turns." }],
    extraEffects: [passive("Mammal of Action", ch("system.attributes.senses.blindsight", "10"), ch("system.attributes.movement.swim", "@attributes.movement.walk", 4))],
  },
  // passive features
  "class-features/Herculean Strength": { activities: [], extraEffects: [passive("Herculean Strength", ch("system.attributes.movement.walk", "10"), ch("system.skills.ath.value", "1"))] },
  "feats/Master Navigator": { activities: [], extraEffects: [passive("Master Navigator", ch("system.tools.navg.value", "1"))] },
  "feats/Master Weaver": { activities: [], extraEffects: [passive("Master Weaver", ch("system.tools.weaver.value", "1"))] },
  "feats/Master Woodcarver": { activities: [], extraEffects: [passive("Master Woodcarver", ch("system.tools.woodcarver.value", "1"))] },
  "class-features/Medical Expertise": { activities: [], extraEffects: [passive("Medical Expertise", ch("system.skills.med.value", "2", 4))] },
  "feats/Medium Armor Master": { activities: [], extraEffects: [passive("Medium Armor Master", ch("flags.dnd5e.mediumArmorMaster", "1", 5))] },
  "class-features/Pack Mule": { activities: [], extraEffects: [passive("Pack Mule", ch("system.attributes.encumbrance.multipliers.overall", "2", 1), ch("system.abilities.con.save.roll.mode", "1", 4))] },
};
