import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";
import { cap } from "./creations-1.js";

// Creation automation, batch 5.
const mark = (name: string, seconds = 60, statuses?: string[], changes?: EffectSpec["changes"]): EffectSpec => ({ name, onTargets: true, seconds, statuses, changes });
const L = "@details.level";
const T = (n: number) => `min(1, floor(${L} / ${n}))`;
const CANTRIP_DICE = `(${T(5)} + ${T(11)} + ${T(17)})`;
const COLORS: [string, string, string][] = [["Red", "fire", "25 cold damage"], ["Orange", "acid", "a strong wind"], ["Yellow", "lightning", "60 force damage"], ["Green", "poison", "a Secret Passage creation or equal-level portal"], ["Blue", "cold", "25 fire damage"]];

const sprayRay = (n: number, color: string, type: string): ActSpec => ({
  name: `Prismatic Spray ${n}: ${color}`, type: "save", activation: "special", area: { type: "cone", size: 60 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["12d6", type]],
  note: `Rolled d8 = ${n} (${color}): 12d6 ${type} damage on a failed save, half on a success.`,
});
const wallLayer = (color: string, type: string, destroyed: string): ActSpec => ({
  name: `Prismatic Wall: ${color} Layer`, type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["10d10", type]],
  note: `10d10 ${type} damage on a failed save, half on a success.${color === "Red" || color === "Orange" ? " While this layer is in place, unimbued ranged attacks can't pass through." : ""} Destroyed by ${destroyed}.`,
});

export const creationSpecs5: Record<string, Spec> = {
  "creations/Polar Blade": { activities: [
    { name: "Polar Blade Extra Damage", type: "damage", activation: "special", damage: [[`${CANTRIP_DICE}d8`, "cold"]], note: "From 5th level the melee attack deals this extra cold damage on a hit (1d8 at 5th, 2d8 at 11th, 3d8 at 17th)." },
    { name: "Frost Damage Reduction", type: "damage", activation: "special", targets: { count: 1, type: "creature" }, damage: [[`(1 + ${CANTRIP_DICE})d8`, ""]], note: "On a hit the target is covered in piercing frost until the start of your next turn. If it makes a successful melee attack first, that attack's damage is reduced by this amount and the creation ends." },
  ] },

  "creations/Propel": { activities: [
    { name: "Propel", type: "utility", range: 60, note: "Fling a tiny item in your possession (5 lbs or less; 10 lbs at 5th level, 20 lbs at 11th, 40 lbs at 17th) to a point you can see." },
    { name: "Propel Attack", type: "attack", range: 60, attack: { type: "ranged" }, damage: [[`(1 + ${CANTRIP_DICE})d8`, ""]], note: "If the point is on a creature, make a creation attack against it. The damage is of the most appropriate type for the item." },
  ] },

  "creations/Prismatic Spray": { activities: [
    ...COLORS.map(([c, t], i) => sprayRay(i + 1, c, t)),
    { name: "Prismatic Spray 6: Indigo", type: "save", activation: "special", area: { type: "cone", size: 60 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, effects: [mark("Restrained by Indigo Ray", 600, ["restrained"])], note: "On a failure the target is restrained. It makes a Constitution saving throw at the end of each of its turns; three successes end the creation, three failures turn it permanently to stone (petrified)." },
    { name: "Prismatic Spray 7: Violet", type: "save", activation: "special", area: { type: "cone", size: 60 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, effects: [mark("Blinded by Violet Ray", 600, ["blinded"])], note: "On a failure the target is blinded and makes a Wisdom saving throw at the start of your next turn; success ends the blindness, failure blinds it for 24 hours." },
    { name: "Prismatic Spray 8: Special", type: "utility", activation: "special", note: "The target is struck twice. Roll twice more, rerolling any 8." },
  ] },

  "creations/Prismatic Wall": { activities: [
    { name: "Create Wall", type: "utility", range: 60, area: { type: "line", size: 90 }, duration: { value: 10, units: "minute" }, note: "A vertical opaque wall up to 90 feet long, 30 feet high and 1 inch thick, or a sphere up to 30 feet across. It sheds bright light 100 feet and dim light 100 feet more. You and creatures you designate can pass through harmlessly. If it passes through an occupied space the creation fails and the slot is wasted." },
    { name: "Wall Blinding Gaze", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "con", onSave: "none" }, effects: [mark("Blinded by the Wall", 60, ["blinded"])], note: "Another creature that can see the wall moves within 20 feet of it or starts its turn there." },
    ...COLORS.map(([c, t, d]) => wallLayer(c, t, d)),
    { name: "Prismatic Wall: Indigo Layer", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, effects: [mark("Restrained by Indigo Layer", 600, ["restrained"])], note: "On a failure the creature is restrained and saves with Constitution at the end of each turn: three successes end it, three failures turn it permanently to stone (petrified). Creations can't be activated through the wall while this layer is in place. Destroyed by bright light from a creation of 5th level or higher." },
    { name: "Prismatic Wall: Violet Layer", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, effects: [mark("Blinded by Violet Layer", 600, ["blinded"])], note: "On a failure the creature is blinded and makes a Wisdom saving throw at the start of your next turn; success ends it, failure blinds it until Greater Restoration is used on it at 9th level. Destroyed by Deactivate Creation or a similar creation of equal or higher level." },
  ] },

  "creations/Puppet": { activities: [
    { name: "Puppet", type: "save", range: 120, targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, note: "One humanoid you can see (no effect on one immune to being charmed). On a failure it must move up to its speed in a direction you choose, and you can make it drop whatever it is holding. Slot 2nd+: one additional humanoid per slot level above 1st." },
  ] },

  "creations/Reverse Gravity": { activities: [
    { name: "Reverse Gravity", type: "utility", range: 100, area: { type: "cylinder", size: 50 }, duration: { value: 1, units: "minute", concentration: true }, note: "A 50-foot-radius, 100-foot-high cylinder. Everything not anchored falls upward and remains at the top, oscillating slightly, until the creation ends; then it all falls back down." },
    { name: "Grab a Fixed Object", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, note: "A creature can grab a fixed object it can reach to avoid the fall." },
  ] },

  "creations/Rotting Shot": { activities: [
    { name: "Rotting Shot", type: "damage", activation: "bonus", damage: [["2d8", "necrotic", "1d8"]], note: "When you hit with a ranged weapon attack: an extra 2d8 necrotic damage." },
    { name: "Rotting Shot: Strength", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, effects: [mark("Sapped Strength", 60)], note: "On a failure the target deals only half damage with weapon attacks that use Strength until the creation ends; it repeats the save at the end of each of its turns." },
    { name: "Rotting Shot: Dexterity", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, effects: [mark("Sapped Dexterity", 60)], note: "On a failure the target deals only half damage with weapon attacks that use Dexterity until the creation ends; it repeats the save at the end of each of its turns." },
  ] },

  "creations/Sanctuary": { activities: [
    { name: "Sanctuary", type: "utility", range: 30, targets: { count: 1, type: "creature" }, duration: { value: 1, units: "minute" }, effects: [mark("Sanctuary", 60)], note: "Slot 2nd+: one additional creature per slot level above 1st. Ends if the protected creature attacks or uses a creation or effect on an enemy. Doesn't protect against area effects." },
    { name: "Sanctuary Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, note: "A creature that targets the protected creature with an attack, harmful creation or effect makes this save first. On a failure it must choose a new target or lose the attack, creation or effect." },
  ] },

  "creations/Searing Smite": { activities: [
    { name: "Searing Smite", type: "damage", activation: "bonus", damage: [["1d6", "fire", "1d6"]], note: "When you hit with a melee weapon attack: an extra 1d6 fire damage and the target ignites." },
    { name: "Burning Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, damage: [["1d6", "fire"]], note: "At the start of each of its turns. On a failure it takes the damage; on a success the creation ends." },
    { name: "Put Out the Flames", type: "utility", activation: "action", note: "The target, or a creature within 5 feet of it, uses an action to put out the flames; submerging it in water also ends the creation." },
  ] },

  "creations/Shrapnel Shot": { activities: [
    { name: "Shrapnel Shot", type: "save", activation: "bonus", area: { type: "radius", size: 5 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["2d6", "piercing", "2d6"]], note: "When you hit a creature with a ranged weapon attack. The target and each creature within 5 feet of it." },
  ] },

  "creations/Sinister Shot": { activities: [
    { name: "Sinister Shot", type: "damage", activation: "bonus", damage: [["4d10", "psychic", "1d10"]], note: "When you hit with a ranged weapon attack: an extra 4d10 psychic damage." },
    { name: "Frightened Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true },
      effects: [mark("Frightened by Sinister Shot", 60, ["frightened"], [{ key: "system.attributes.movement.walk", mode: 5, value: "0" }])], note: "On a failure the target is frightened and its movement speed is 0 for the duration; it repeats the save at the end of each of its turns." },
  ] },

  "creations/Spirit Fury": { activities: [
    ...(["radiant", "necrotic", "cold"] as const).map((t): ActSpec => ({ name: `Spirit Fury: ${cap(t)}`, type: "utility", activation: "bonus", duration: { value: 1, units: "minute", concentration: true },
      effects: [{ name: `Spirit Fury (${t})`, seconds: 60, changes: ["mwak", "rwak", "msak", "rsak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: `+1d8[${t}]` })) }],
      note: `Any attack you make deals 1d8 extra ${t} damage when you hit. A creature that takes this damage can't regain hit points until the start of your next turn. Slot 4th+: +1d8 per slot level above 3rd.` })),
    { name: "Spirit Fury Slow", type: "utility", activation: "special", area: { type: "radius", size: 30 }, targets: { type: "enemy" }, effects: [mark("Slowed by Spirit Fury", 6, undefined, [{ key: "system.attributes.movement.walk", mode: 2, value: "-10" }])], note: "Any creature of your choice you can see that starts its turn within 30 feet of you has its speed reduced by 10 feet until the start of your next turn." },
  ] },
};
