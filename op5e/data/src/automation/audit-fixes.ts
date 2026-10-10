import type { Spec } from "../../helpers/spec.js";

// Fixes from the 2026-10-10 compendium audit (docs/compendium-audit-2026-10-10.md), high-severity items verified against the pack output.
// Imported last in index.ts, so these replace any earlier spec for the same key.
const MIN = (n = 1) => ({ value: n, units: "minute" as const });
const BPS = ["bludgeoning", "piercing", "slashing"];

export const auditFixSpecs: Record<string, Spec> = {
  "class-features/Advanced Armory": { activities: [
    { name: "Advanced Armory", type: "utility", activation: "reaction", reactionWhen: "a creature hits you with an attack roll", roll: { formula: "1d6", name: "On a 4 or higher the attack misses" },
      note: "Roll a d6. On a 4 or higher, the attack instead misses you, regardless of its roll." },
  ] },

  "class-features/Finishing Blow": { activities: [
    { name: "Finishing Blow: spirit point die", type: "damage", activation: "special", consumeUse: true, consumeTarget: "spirit", damage: [["1d@scale.brawler.brawling-die.faces", ""]],
      note: "When you hit with an unarmed strike, spend up to your brawler level in spirit points. Each spirit point adds one brawler die to the damage: use this button once for each point spent." },
    { name: "Finishing Blow: 5 or more spirit points", type: "damage", activation: "special", damage: [["@classes.brawler.levels", ""]],
      note: "If you spent five or more spirit points on Finishing Blow, also add your brawler level to the damage (no further cost)." },
  ] },

  "class-features/Creature of Scorn": { activities: [
    { name: "Creature of Scorn", type: "utility", activation: "bonus", consumeUse: true, duration: MIN(),
      effects: [{ name: "Creature of Scorn", seconds: 60, changes: [{ key: "flags.dnd5e.weaponCriticalThreshold", mode: 4, value: "19" }] }],
      note: "For 1 minute: attack rolls crit on 19 or 20; advantage on weapon attacks against creatures missing any hit points; once per turn when you deal necrotic damage, gain the same temporary hit points until the start of your next turn. After one use you can use it again only after a long rest, unless you expend a 5th-level creation slot." },
  ] },

  "class-features/Icon of Strength": { activities: [
    { name: "Icon of Strength", type: "utility", activation: "bonus", consumeUse: true, duration: MIN(),
      effects: [{ name: "Icon of Strength", seconds: 60, changes: [
        ...BPS.map((v) => ({ key: "system.traits.dr.value", mode: 2, value: v })),
        { key: "system.traits.di.value", mode: 2, value: "thunder" },
        ...["blinded", "deafened", "paralyzed", "petrified", "poisoned", "stunned", "prone"].map((v) => ({ key: "system.traits.ci.value", mode: 2, value: v })),
      ] }],
      note: "For 1 minute you also cannot be moved against your will, and the ground within 15 feet of you is difficult terrain for creatures of your choice. After one use you can use it again only after a long rest, unless you expend a 5th-level creation slot." },
  ] },

  "class-features/Full Body Armor": { activities: [
    { name: "Full Body Armor", type: "utility", activation: "action", consumeUse: true, consumeTarget: "color-of-armament-novice", consumeAmount: "@details.level", duration: MIN(),
      effects: [{ name: "Full Body Armor", seconds: 60, changes: [{ key: "system.traits.dm.amount.all", mode: 2, value: "-@details.level" }] }],
      note: "Spend Armament Points equal to your level. For 1 minute you reduce all incoming damage by your level and may reroll each saving throw once, taking the highest. Attacks and creations that deal force or psychic damage ignore this." },
  ] },

  "class-features/Fire Fiend": {
    activities: [],
    extraEffects: [{ name: "Fire Fiend: +1d6 attack vs ignited target", transfer: true, disabled: true, changes: [{ key: "system.bonuses.mwak.attack", mode: 2, value: "+1d6" }, { key: "system.bonuses.rwak.attack", mode: 2, value: "+1d6" }] }],
  },

  "creations/Beastial Transformation": { activities: [
    { name: "Beastial Transformation", type: "heal", activation: "bonus", healing: { formula: "20", type: "temp" }, duration: { value: 10, units: "minute", concentration: true },
      note: "Gain 20 temporary hit points and two abilities of your choice from the list (Natural Weapons, Thick Hide, Amphibious, Hoofed, Climbing, Flight, Sharp Eyes, Camouflage, Venom). Each slot level above 3rd adds 10 temporary hit points and one more ability." },
    { name: "Venom", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, damage: [["1d12", "poison"]],
      note: "When you hit a creature with a weapon attack, you can lace it with venom. On a failed save the creature takes 1d12 poison damage and is poisoned until the end of its next turn." },
  ] },

  "creations/Charged Fireball": { activities: [
    { name: "Charged Fireball", type: "save", activation: "action", range: 150, area: { type: "sphere", size: 20 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" },
      damage: [["14d6", "fire"]], duration: { value: 1, units: "minute", concentration: true },
      note: "Base damage 14d6. If the bead has not detonated at the end of your turn, the damage increases by 1d6. A creature that touches the bead makes a Dexterity save; on a failure the creation ends and the bead erupts." },
  ] },

  "creations/Faithful Conviction": { activities: [
    { name: "Faithful Conviction", type: "save", activation: "action", range: 60, targets: { type: "enemy" }, save: { ability: "con", onSave: "half" }, damage: [["20", "radiant"]],
      duration: { value: 8, units: "hour" },
      note: "A hostile creature that moves within 10 feet of the guardian for the first time on a turn must save. The guardian vanishes when it has dealt a total of 60 damage (80 at 5th level, +20 per slot level above 4th)." },
  ] },

  "creations/Gadget Armor": { activities: [
    { name: "Gadget Armor", type: "utility", activation: "action", rangeUnits: "touch", targets: { count: 1, type: "creature" }, duration: { value: 24, units: "hour" },
      effects: [{ name: "Gadget Armor", onTargets: true, seconds: 86400, changes: [
        { key: "system.attributes.ac.calc", mode: 5, value: "custom" }, { key: "system.attributes.ac.formula", mode: 5, value: "13 + @abilities.dex.mod" },
      ] }],
      note: "Touch a willing creature that is not wearing armor: its base AC becomes 13 + its Dexterity modifier. The creation ends if the target dons armor or you dismiss it." },
  ] },
};
