import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";

// Creation (spell) automation, batch 1. Casting time, range, duration and slot use come from the spell itself.
export const TYPES8 = ["acid", "radiant", "cold", "fire", "lightning", "necrotic", "poison", "thunder"];
export const ATK = ["mwak", "rwak", "msak", "rsak"];
export const extraDmg = (name: string, expr: string): EffectSpec => ({ name, changes: ATK.map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: expr })) });
export const resist = (name: string, type: string, seconds = 600): EffectSpec => ({ name, changes: [{ key: "system.traits.dr.value", mode: 2, value: type }], seconds });
export const cap = (t: string) => t[0].toUpperCase() + t.slice(1);

export const creationSpecs1: Record<string, Spec> = {
  "creations/Absorption": { activities: [
    { name: "Absorb", type: "utility", activation: "reaction", reactionWhen: "You take damage", note: "You have resistance to the triggering damage type until the start of your next turn." },
    { name: "Stored Strike", type: "damage", activation: "special", damage: [["1d8", "", "1d8"]], note: "The first time you hit with a melee attack on your next turn: an extra 1d8 damage of the triggering type, then the creation ends." },
  ] },

  "creations/Advanced Weapon": { activities: ["acid", "cold", "fire", "lightning", "poison", "thunder"].map((t): ActSpec => ({
    name: `Advanced Weapon: ${cap(t)}`, type: "utility", activation: "bonus", duration: { value: 1, units: "hour", concentration: true },
    effects: [extraDmg(`Advanced Weapon (${t})`, `+1d6[${t}]`)],
    note: `Channel energy into a simple or martial weapon you hold: an extra 1d6 ${t} damage to any target you hit. As a bonus action you can change the damage type. Slot 3rd+: concentration up to 8 hours. Slot 5th+: no concentration, 24 hours.`,
  })) },

  "creations/Alter Self": { activities: [
    { name: "Aquatic Adaptation", type: "utility", activation: "bonus", duration: { value: 1, units: "hour", concentration: true }, effects: [{ name: "Aquatic Adaptation", changes: [{ key: "system.attributes.movement.swim", mode: 4, value: "@attributes.movement.walk" }], seconds: 3600 }], note: "Gills and webbing: you can breathe underwater and gain a swimming speed equal to your walking speed." },
    { name: "Change Appearance", type: "utility", activation: "bonus", duration: { value: 1, units: "hour", concentration: true }, note: "Decide your height, weight, features, voice and coloration; you can appear as another race but your statistics and size do not change." },
    { name: "Natural Weapons", type: "utility", activation: "bonus", duration: { value: 1, units: "hour", concentration: true }, note: "Grow claws, fangs, spines or horns. Your unarmed strikes deal 1d6 bludgeoning, piercing or slashing damage, you are proficient with them, and they have a +1 bonus to attack and damage rolls." },
  ] },

  "creations/Ardent Blade": { activities: [
    { name: "Evoke Blade", type: "utility", activation: "bonus", duration: { value: 10, units: "minute", concentration: true }, note: "A scimitar-sized blade of an element in your free hand: finesse, light, thrown (range 20/60). It sheds bright light in 10 feet and dim light 10 feet further. Re-evoke it as a bonus action if you let go." },
    { name: "Ardent Blade Strike", type: "attack", activation: "special", range: 5, attack: { type: "melee", ability: "dex", bonus: "@prof" }, damage: [["3d6 + @abilities.dex.mod", TYPES8, "1d6/2"]], note: "Choose the damage type when you cast. Simple melee weapon you are proficient with." },
    { name: "Ardent Blade Throw", type: "attack", activation: "special", range: 20, attack: { type: "ranged", ability: "dex", bonus: "@prof" }, damage: [["3d6 + @abilities.dex.mod", TYPES8, "1d6/2"]], note: "Range 20/60." },
  ] },

  "creations/Ardent Shield": { activities: [
    ...TYPES8.map((t): ActSpec => ({ name: `Ardent Shield: ${cap(t)}`, type: "utility", activation: "action", duration: { value: 10, units: "minute" }, effects: [resist(`Ardent Shield (${t})`, t)], note: `Resistance to ${t} damage. You can end it early as a free action.` })),
    { name: "Elemental Retaliation", type: "damage", activation: "special", damage: [["2d8", TYPES8]], note: "Whenever a creature hits you with a melee attack, it takes this damage of the chosen type." },
  ] },

  "creations/Barrage": { activities: [
    { name: "Barrage", type: "save", area: { type: "cone", size: 60 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["4d10", ["bludgeoning", "piercing", "slashing"]]], note: "The damage type is the same as that of the weapon or ammunition used as a component." },
  ] },

  "creations/Battle Transformation": { activities: [
    { name: "Battle Transformation", type: "heal", activation: "bonus", healing: { formula: "50", type: "temp" }, duration: { value: 10, units: "minute", concentration: true },
      effects: [{ name: "Battle Transformation", seconds: 600, changes: [
        ...["mwak", "rwak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: "+1d12" })),
        { key: "flags.midi-qol.advantage.attack.mwak", mode: 0, value: "1" }, { key: "flags.midi-qol.advantage.attack.rwak", mode: 0, value: "1" },
        { key: "flags.midi-qol.advantage.ability.save.str", mode: 0, value: "1" }, { key: "flags.midi-qol.advantage.ability.save.con", mode: 0, value: "1" },
      ] }],
      note: "Savage Strikes: once per turn, when you attack with the Attack action, make one additional attack. Power Strike: extra 1d12 of the weapon's damage type. Absolute Aim: advantage on weapon attacks. Enhanced Endurance: advantage on Strength and Constitution saves." },
  ] },

  "creations/Blazing Bullet": { activities: [
    { name: "Blazing Bullet", type: "damage", activation: "bonus", damage: [["1d6", "fire", "1d6"]], note: "When you hit with a ranged weapon attack: extra fire damage, and the target ignites." },
    { name: "Burning Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, damage: [["1d6", "fire"]], note: "At the start of each of its turns the ignited target makes this save. On a failure it takes the damage; on a success the creation ends. It also ends if the flames are put out." },
  ] },

  "creations/Blinding Smite": { activities: [
    { name: "Blinding Smite", type: "damage", activation: "bonus", duration: { value: 1, units: "minute" }, damage: [["3d8", "radiant"]], note: "When you hit with a melee weapon attack. Your weapon flares with bright light." },
    { name: "Blinded Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, effects: [{ name: "Blinded by Smite", statuses: ["blinded"], onTargets: true, seconds: 60 }], note: "The target repeats the save at the end of each of its turns, ending the blindness on a success." },
  ] },

  "creations/Blindness/Deafness": { activities: [
    { name: "Blind", type: "save", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, effects: [{ name: "Blinded", statuses: ["blinded"], onTargets: true, seconds: 60 }], note: "At the end of each of its turns the target can make a Constitution saving throw, ending the creation on a success. Slot 3rd+: one additional target per slot level above 2nd." },
    { name: "Deafen", type: "save", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, effects: [{ name: "Deafened", statuses: ["deafened"], onTargets: true, seconds: 60 }], note: "At the end of each of its turns the target can make a Constitution saving throw, ending the creation on a success. Slot 3rd+: one additional target per slot level above 2nd." },
  ] },
};
