import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";
import { cap } from "./creations-1.js";

// Creation automation, batch 3.
const dis = (...kinds: string[]) => kinds.map((k) => ({ key: `flags.midi-qol.disadvantage.${k}`, mode: 0, value: "1" }));
const adv = (...kinds: string[]) => kinds.map((k) => ({ key: `flags.midi-qol.advantage.${k}`, mode: 0, value: "1" }));
const FIVE = ["acid", "cold", "fire", "lightning", "thunder"];
const SIX = ["acid", "fire", "cold", "lightning", "poison", "thunder"];
const mark = (name: string, seconds = 60): EffectSpec => ({ name, onTargets: true, seconds });
const abilityTo6 = (abil: string): EffectSpec => ({ name: `Feeble ${cap(abil)}`, onTargets: true, seconds: 86400, changes: [{ key: `system.abilities.${abil}.value`, mode: 5, value: "6" }] });

const trap = (t: string, save: string, effect?: EffectSpec, dice = "3d8", note = ""): ActSpec => ({
  name: `Elemental Trap: ${cap(t)}`, type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: save, onSave: "half" }, damage: [[dice, t]],
  effects: effect ? [effect] : undefined, note: note || `The triggering creature takes 3d8 ${t} damage on a failure (half on a success) plus the effect.`,
});

const tier = (n: 1 | 2 | 3): { bonus: string; dice: string; slot: string } => ({ 1: { bonus: "1", dice: "1d4", slot: "2nd–3rd" }, 2: { bonus: "2", dice: "2d4", slot: "4th–5th" }, 3: { bonus: "3", dice: "3d4", slot: "6th or higher" } })[n];

export const creationSpecs3: Record<string, Spec> = {
  "creations/Earthquake": { activities: [
    { name: "Earthquake: Break Concentration", type: "save", area: { type: "radius", size: 100 }, targets: { type: "creature" }, save: { ability: "con", onSave: "none" }, note: "Each creature on the ground that is concentrating. On a failure its concentration is broken." },
    { name: "Earthquake: Knock Prone", type: "save", activation: "special", area: { type: "radius", size: 100 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, effects: [{ name: "Prone", statuses: ["prone"], onTargets: true, rounds: 1 }], note: "When you use the creation and at the end of each turn you spend concentrating on it. Each creature on the ground in the area." },
    { name: "Earthquake: Fissure", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, note: "A creature standing where a fissure opens falls in on a failure; on a success it moves with the fissure's edge. Fissures are 10 feet wide and 1d10 x 10 feet deep." },
    { name: "Earthquake: Structures", type: "damage", activation: "special", damage: [["50", "bludgeoning"]], note: "The tremor deals this damage to each structure in contact with the ground in the area; a structure reduced to 0 hit points collapses." },
  ] },

  "creations/Elemental Bane": { activities: [
    ...FIVE.map((t): ActSpec => ({ name: `Elemental Bane: ${cap(t)}`, type: "save", targets: { count: 1, type: "creature" }, range: 90, save: { ability: "con", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true },
      effects: [mark(`Bane (${t})`)], note: `On a failure the target loses resistance to ${t} damage for the duration. Slot 5th+: one additional target per slot level above 4th, all within 30 feet of each other.` })),
    { name: "Bane Extra Damage", type: "damage", activation: "special", damage: [["2d8", FIVE]], note: "The first time each turn the affected target takes damage of the chosen type." },
  ] },

  "creations/Elemental Blast": { activities: [
    { name: "Elemental Blast", type: "save", area: { type: "cone", size: 15 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["3d8", SIX, "1d8"]], note: "The elements also scatter unattended, unworn objects in the area." },
  ] },

  "creations/Elemental Trap": { activities: [
    trap("acid", "con", { name: "Corroded", onTargets: true, rounds: 2, changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "-2" }] }, "3d8", "On a failure the target's AC is reduced by 2 until the end of its next turn."),
    trap("cold", "str", { name: "Frozen Stiff", onTargets: true, rounds: 2, changes: [{ key: "system.attributes.movement.walk", mode: 5, value: "0" }] }, "3d8", "On a failure the target's movement speed becomes 0 until the end of its next turn."),
    trap("fire", "dex", undefined, "3d10", "The d8s of the damage are d10s instead."),
    trap("lightning", "dex", undefined, "3d8", "An additional creature within 30 feet of the target must also make the saving throw, against the damage only."),
    trap("poison", "con", { name: "Poisoned by Trap", statuses: ["poisoned"], onTargets: true, rounds: 2 }, "3d8", "On a failure the target is poisoned until the end of its next turn."),
    trap("thunder", "str", { name: "Knocked Prone", statuses: ["prone"], onTargets: true, rounds: 1 }, "3d8", "On a failure the target is knocked prone."),
    { name: "Find the Trap", type: "utility", activation: "special", note: "Finding the trap requires an Intelligence (Investigation) check against your creative save DC." },
  ] },

  "creations/Elemental Weapon": { activities: ([1, 2, 3] as const).flatMap((n) => FIVE.map((t): ActSpec => {
    const { bonus, dice, slot } = tier(n);
    return { name: `Elemental Weapon: ${cap(t)} (slot ${slot})`, type: "utility", range: 5, rangeUnits: "touch", duration: { value: 1, units: "hour", concentration: true }, targets: { count: 1, type: "object" },
      effects: [{ name: `Elemental Weapon (${t}, +${bonus})`, seconds: 3600, onTargets: true, changes: [
        ...["mwak", "rwak"].flatMap((k) => [{ key: `system.bonuses.${k}.attack`, mode: 2, value: `+${bonus}` }, { key: `system.bonuses.${k}.damage`, mode: 2, value: `+${dice}[${t}]` }]) ] }],
      note: `A weapon you touch becomes a mastercraft weapon: +${bonus} to attack rolls and an extra ${dice} ${t} damage when it hits.` };
  })) },

  "creations/Embody Winds": { activities: [
    { name: "Embody Winds", type: "utility", activation: "action", duration: { value: 10, units: "minute" }, effects: [{ name: "Embody Winds", seconds: 600, changes: [{ key: "system.attributes.movement.fly", mode: 4, value: "60" }, { key: "flags.midi-qol.grants.disadvantage.attack.rwak", mode: 0, value: "1" }] }], note: "Wind whirls around you: ranged weapon attacks against you have disadvantage and you have a flying speed of 60 feet." },
    { name: "Wind Cube", type: "save", activation: "bonus", range: 60, area: { type: "cube", size: 20 }, targets: { type: "creature" }, save: { ability: "con", onSave: "half" }, damage: [["3d10", "bludgeoning"]], note: "A 20-foot cube of swirling wind centered on a point you can see. A Large or smaller creature that fails is also pushed up to 10 feet from the center." },
  ] },

  "creations/Enemies": { activities: [
    { name: "Enemies", type: "save", targets: { count: 1, type: "creature" }, range: 120, save: { ability: "int", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true }, effects: [mark("Confused Allegiance")],
      note: "The target regards all creatures it can see as enemies and chooses targets at random. It repeats the save each time it takes damage. Succeeds automatically if immune to being frightened. Slot 3rd+: one additional creature per slot level above 2nd, all within 30 feet of each other." },
  ] },

  "creations/Enfeeblement": { activities: [
    { name: "Enfeeblement: Strength", type: "attack", range: 60, attack: { type: "ranged" }, effects: [mark("Enfeebled (Strength)")], note: "On a hit the target deals only half damage with weapon attacks that use Strength. Slot 3rd+: one additional creature per slot level above 2nd, all within 30 feet of each other." },
    { name: "Enfeeblement: Dexterity", type: "attack", range: 60, attack: { type: "ranged" }, effects: [mark("Enfeebled (Dexterity)")], note: "On a hit the target deals only half damage with weapon attacks that use Dexterity." },
    { name: "Enfeeblement Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, note: "At the end of each of its turns; on a success the creation ends." },
  ] },

  "creations/Enlarge/Reduce": { activities: [
    { name: "Enlarge", type: "utility", range: 30, targets: { count: 1, type: "creature" }, duration: { value: 1, units: "minute", concentration: true },
      effects: [{ name: "Enlarged", onTargets: true, seconds: 60, changes: [...adv("ability.check.str", "ability.save.str"), ...["mwak", "rwak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: "+1d6" }))] }],
      note: "Size doubles (one category larger), weight x8. Advantage on Strength checks and saves; weapons grow with it and deal 1d6 extra damage." },
    { name: "Reduce", type: "utility", range: 30, targets: { count: 1, type: "creature" }, duration: { value: 1, units: "minute", concentration: true },
      effects: [{ name: "Reduced", onTargets: true, seconds: 60, changes: [...dis("ability.check.str", "ability.save.str"), ...["mwak", "rwak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: "-1d4" }))] }],
      note: "Size halves (one category smaller), weight /8. Disadvantage on Strength checks and saves; weapons shrink and deal 1d4 less damage (minimum 1)." },
    { name: "Resist Resizing", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, note: "An unwilling creature makes this save; on a success the creation has no effect on it." },
  ] },

  "creations/Ensnaring Smite": { activities: [
    { name: "Ensnaring Smite", type: "utility", activation: "bonus", note: "When you hit a creature with a melee weapon attack." },
    { name: "Tendril Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", onSave: "none" }, effects: [{ name: "Restrained by Tendrils", statuses: ["restrained"], onTargets: true, seconds: 60 }], note: "A Large or larger creature has advantage on this save (slot 2nd+: no advantage). On a success the tendrils break away." },
    { name: "Tendril Damage", type: "damage", activation: "special", damage: [["1d6", "piercing", "1d6"]], note: "The restrained target takes this at the start of each of its turns." },
    { name: "Break Free", type: "utility", activation: "action", note: "The restrained creature, or one that can touch it, makes a Strength check against your creation save DC; on a success the target is freed." },
  ] },

  "creations/Feeble Body": { activities: ["str", "dex", "con"].map((a): ActSpec => ({
    name: `Feeble Body: ${a === "str" ? "Strength" : a === "dex" ? "Dexterity" : "Constitution"}`, type: "save", range: 120, targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "full" }, damage: [["4d12", "necrotic", "1d12"]],
    effects: [abilityTo6(a)],
    note: a === "str" ? "On a failure Strength becomes 6 for the duration and the creature attacks with disadvantage with all melee weapon attacks." : a === "dex" ? "On a failure Dexterity becomes 6; its movement speeds become 10 (if not already lower) and it cannot Dash or Disengage." : "On a failure Constitution becomes 6; it cannot maintain concentration and resistances to bludgeoning, piercing and slashing are suppressed. At the end of every hour the creature repeats the save. Ended by Greater Restoration, Heal or Ultimate Heal.",
  })) },

  "creations/Force Cage": { activities: [
    { name: "Force Cage: Cage", type: "utility", range: 100, area: { type: "cube", size: 20 }, note: "A cage up to 20 feet on a side, bars 1/2 inch apart. Creatures completely inside are trapped; others are pushed out. Can't be ended by Deactivate Creation." },
    { name: "Force Cage: Box", type: "utility", range: 100, area: { type: "cube", size: 10 }, note: "A solid box up to 10 feet on a side that blocks all matter and creations used inside or outside it." },
    { name: "Teleport Escape Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "cha", onSave: "none" }, note: "A trapped creature that tries to teleport or travel between planes out of the cage makes this save; on a failure it wastes the use." },
  ] },
};
void ({} as Spec);
