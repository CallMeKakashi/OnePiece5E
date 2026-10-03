import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";
import { cap } from "./creations-1.js";

// Creation automation, batch 4.
const mark = (name: string, seconds = 60, statuses?: string[]): EffectSpec => ({ name, onTargets: true, seconds, statuses });
const weaponBonus = (name: string, expr: string, seconds = 3600): EffectSpec => ({ name, seconds, onTargets: true, changes: ["mwak", "rwak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: expr })) });
const ALL_BUT_PSYCHIC = ["acid", "bludgeoning", "cold", "fire", "lightning", "piercing", "poison", "slashing", "thunder"];

export const creationSpecs4: Record<string, Spec> = {
  "creations/Gamma Knife": { activities: [
    ...(["radiant", "necrotic"] as const).map((t): ActSpec => ({ name: `Imbue Weapon: ${cap(t)}`, type: "utility", range: 5, rangeUnits: "touch", duration: { value: 1, units: "hour", concentration: true }, targets: { count: 1, type: "object" },
      effects: [weaponBonus(`Gamma Knife (${t})`, `+2d8[${t}]`)], note: "The weapon emits bright light in a 30-foot radius and dim light for another 30 feet, and its attacks deal an extra 2d8 damage of the chosen type on a hit." })),
    { name: "Deadly Burst", type: "save", activation: "bonus", area: { type: "radius", size: 30 }, targets: { type: "creature" }, save: { ability: "con", onSave: "half" }, damage: [["6d8", ["radiant", "necrotic"]]],
      effects: [mark("Blinded by Gamma Knife", 60, ["blinded"])], note: "Dismiss the creation as a bonus action. Creatures of your choice you can see within 30 feet of the weapon. On a failure they are also blinded for 1 minute (Constitution save at the end of each of its turns to end it); on a success they aren't blinded." },
  ] },

  "creations/Greater Floating Shield": { activities: [
    { name: "Floating Shield", type: "utility", range: 60, targets: { count: 1, type: "creature" }, duration: { value: 1, units: "minute", concentration: true },
      effects: [{ name: "Floating Shield", onTargets: true, seconds: 60, changes: [
        { key: "system.attributes.ac.cover", mode: 2, value: "2" },
        ...ALL_BUT_PSYCHIC.map((t) => ({ key: "system.traits.dr.value", mode: 2, value: t })),
        { key: "flags.dnd5e.evasion", mode: 5, value: "1" },
      ] }],
      note: "Half cover, resistance to all damage except psychic, force, radiant and necrotic, and evasion. As a bonus action on later turns you can move the field to another creature within 60 feet of it." },
  ] },

  "creations/Hidden Trigger": { activities: [
    { name: "Set Trigger", type: "utility", activation: "hour", range: 5, rangeUnits: "touch", note: "Set a trigger on a surface (area up to 10 feet across) or inside a closable object. It is nearly invisible: finding it takes an Intelligence (Investigation) check against your creation save DC. You decide what triggers it and any creatures that don't. Choose an Explosive or Creative Trigger when you place it." },
    { name: "Explosive Trigger", type: "save", activation: "special", area: { type: "radius", size: 20 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["5d8", ["acid", "cold", "fire", "lightning", "thunder"], "1d8"]], note: "The sphere spreads around corners. The damage type is chosen when you create the trigger." },
    { name: "Creative Trigger", type: "utility", activation: "special", note: "Store a prepared creation of 3rd level or lower (or up to the slot level you used, if higher). It has no immediate effect; when the trigger activates it is used, targeting the creature that activated it, or centered on that creature if it affects an area. Hostile summons or harmful objects appear as close as possible to the intruder. A creation requiring concentration lasts its full duration." },
  ] },

  "creations/Hunter's Mark": { activities: [
    { name: "Mark Target", type: "utility", range: 90, targets: { count: 1, type: "creature" }, duration: { value: 1, units: "hour", concentration: true }, effects: [mark("Hunter's Mark", 3600)],
      note: "You have advantage on Wisdom (Perception) and Wisdom (Survival) checks to find it. If it drops to 0 hit points you can use a bonus action later to mark a new creature. Slot 3rd–4th: concentration up to 8 hours. Slot 5th+: no concentration, 24 hours." },
    { name: "Hunter's Mark Damage", type: "damage", activation: "special", damage: [["1d6", ""]], note: "Whenever you hit the marked target with a weapon attack." },
  ] },

  "creations/Ice Dagger": { activities: [
    { name: "Ice Dagger", type: "attack", range: 60, attack: { type: "ranged" }, damage: [["1d10", "piercing"]], note: "Hit or miss, the shard then explodes (see Ice Shard Explosion)." },
    { name: "Ice Shard Explosion", type: "save", activation: "special", area: { type: "radius", size: 5 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, damage: [["2d6", "cold", "2d6"]], note: "The target and each creature within 5 feet of the point where the ice exploded." },
  ] },

  "creations/Illusionary Monster": { activities: [
    { name: "Create Monster", type: "utility", range: 120, duration: { value: 1, units: "minute", concentration: true }, note: "A Huge illusion of a monster in an unoccupied space. It is tangible but attacks miss it automatically; it succeeds on all saving throws and is immune to all damage and conditions. As a bonus action you can move it up to 60 feet. A creature can use an action to examine it and realize it is an illusion." },
    { name: "Monster Fear", type: "save", area: { type: "radius", size: 120 }, targets: { type: "enemy" }, save: { ability: "wis", onSave: "none" }, effects: [mark("Frightened by Illusion", 60, ["frightened"])], note: "Each of your enemies that can see it when it appears. A frightened creature that ends its turn without line of sight to the illusion repeats the save." },
    { name: "Monster Breath", type: "save", activation: "bonus", area: { type: "cone", size: 60 }, targets: { type: "creature" }, save: { ability: "int", onSave: "half" }, damage: [["6d6", ["acid", "cold", "fire", "lightning", "necrotic", "poison", "thunder"]]], note: "Choose the damage type when you create the illusion. The blast originates from the illusion's space at any point during its movement." },
  ] },

  "creations/Infectious Ray": { activities: [
    { name: "Infectious Ray", type: "attack", range: 60, attack: { type: "ranged" }, damage: [["2d8", "poison", "1d8"]] },
    { name: "Ray Poison Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true }, effects: [mark("Poisoned by Infectious Ray", 60, ["poisoned"])], note: "On a hit the target also makes this save. On a failure it is poisoned for up to 1 minute (with concentration), and can remake the save at the end of each of its turns." },
  ] },

  "creations/Instill Madness": { activities: [
    { name: "Instill Madness", type: "save", range: 120, targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true }, effects: [mark("Charmed by Madness", 60, ["charmed"])],
      note: "One humanoid you can see. The charmed target must use its action before moving to make a melee attack against a creature other than itself that you mentally choose. It repeats the save at the end of each of its turns. Slot 3rd+: one additional creature per slot level above 2nd, all within 30 feet of each other." },
  ] },

  "creations/Lightning Arrow": { activities: [
    { name: "Lightning Arrow (hit)", type: "damage", activation: "bonus", damage: [["2d8", "lightning", "1d8"]], note: "After hitting with a ranged weapon attack: an extra 2d8 lightning damage instead of the weapon's normal damage." },
    { name: "Lightning Arrow (miss)", type: "damage", activation: "bonus", damage: [["floor(2d8 / 2)", "lightning"]], note: "On a miss the target takes half as much." },
    { name: "Lightning Burst", type: "save", activation: "special", area: { type: "radius", size: 10 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["2d8", "lightning", "1d8"]], note: "Each creature within 10 feet of the target." },
  ] },

  "creations/Mass Disguise": { activities: [
    { name: "Mass Disguise", type: "utility", range: 30, duration: { value: 8, units: "hour" }, targets: { type: "creature" }, note: "Change the appearance of any number of creatures you can see (clothing, armor, weapons and equipment too): 1 foot shorter or taller, thin or fat, but the same basic arrangement of limbs. Dismiss it as an action. A creature can use its action to inspect a target with an Intelligence (Investigation) check against your creation save DC." },
    { name: "Resist Disguise", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "cha", onSave: "none" }, note: "An unwilling target; on a success it is unaffected." },
  ] },

  "creations/Mental Prison": { activities: [
    { name: "Mental Prison", type: "save", range: 60, targets: { count: 1, type: "creature" }, save: { ability: "int", onSave: "full" }, damage: [["5d10", "psychic"]], duration: { value: 1, units: "minute", concentration: true },
      effects: [mark("Imprisoned", 60, ["restrained"])], note: "Succeeds automatically if immune to being charmed. On a success the target takes the damage and the creation ends. On a failure it takes the damage and is restrained inside an illusory cell that only it perceives; it can't see or hear anything beyond it." },
    { name: "Break the Illusion", type: "damage", activation: "special", damage: [["10d10", "psychic"]], note: "If the target is moved out of the illusion, makes a melee attack through it, or reaches any part of its body through it, it takes this damage and the creation ends." },
  ] },
};
void ({} as Spec);
