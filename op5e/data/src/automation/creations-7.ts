import type { EffectSpec, Spec } from "../../helpers/spec.js";

// Creation automation, batch 7.
const mark = (name: string, seconds = 60, statuses?: string[]): EffectSpec => ({ name, onTargets: true, seconds, statuses });
const WALL = { range: 120, duration: { value: 10, units: "minute", concentration: true } } as const;

export const creationSpecs7: Record<string, Spec> = {
  "creations/Upper Brass": { activities: [
    { name: "Imbue Instrument", type: "utility", activation: "bonus", duration: { value: 1, units: "minute" }, note: "An instrument you hold becomes a weapon using your creative ability for attack and damage rolls. Brass: once per turn a hit forces a Strength save or the target falls prone. String: reach. Woodwind: ranged piercing (60/180), ignores half and three-quarters cover. Keyboard: roll damage twice, take the highest. Percussion: once per turn on a hit, deal your creativity modifier damage to each other creature within 5 ft of the target. Electric: once per turn on a hit, a Strength save or pushed 10 ft." },
    { name: "Instrument Attack", type: "attack", activation: "special", attack: { type: "melee" }, damage: [["1d6", "bludgeoning"]], note: "Damage die: 1d8 at 5th, 1d10 at 11th, 1d12 at 17th level." },
    { name: "Brass Knockdown", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", onSave: "none" }, effects: [mark("Knocked Prone", 6, ["prone"])] },
    { name: "Electric Push", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", onSave: "none" }, note: "On a failure the target is pushed 10 ft away from you." },
  ] },

  "creations/Volley": { activities: [
    { name: "Volley", type: "save", range: 150, area: { type: "cylinder", size: 40 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["10d8", ""]], note: "The damage type is that of the ammunition or weapon used." },
  ] },

  "creations/Wall of Ice": { activities: [
    { name: "Wall of Ice", type: "save", ...WALL, area: { type: "radius", size: 10 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["10d6", "cold", "2d6"]], note: "Only creatures whose space the wall cuts through. The wall is 1 ft thick, AC 12, 30 hit points per 10-foot section." },
    { name: "Frigid Air", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "con", onSave: "half" }, damage: [["5d6", "cold", "1d6"]], note: "A creature moving through the frigid air left by a destroyed section for the first time on a turn." },
  ] },

  "creations/Wall of Light": { activities: [
    { name: "Wall of Light", type: "save", ...WALL, area: { type: "line", size: 60 }, targets: { type: "creature" }, save: { ability: "con", onSave: "half" }, damage: [["6d8", "radiant"]], effects: [mark("Blinded by Light", 60, ["blinded"])], note: "On a failure the creature is also blinded for 1 minute and repeats the save at the end of each of its turns. On a success it isn't blinded. Bright light out to 120 feet, dim light for another 120." },
    { name: "Wall Burn", type: "damage", activation: "special", damage: [["4d8", "radiant"]], note: "A creature that ends its turn in the wall's area." },
    { name: "Radiant Beam", type: "attack", activation: "action", range: 60, attack: { type: "ranged" }, damage: [["6d8", "radiant", "1d8"]] },
  ] },

  "creations/Wall of Stone": { activities: [
    { name: "Wall of Stone", type: "utility", ...WALL, note: "Ten 10x10 ft panels, 6 inches thick (or 10x20 ft panels, 3 inches thick). Each panel AC 15, 30 hit points per inch of thickness. Maintained for the full duration, it becomes permanent." },
    { name: "Escape Enclosure", type: "save", activation: "reaction", targets: { count: 1, type: "creature" }, save: { ability: "dex", onSave: "none" }, note: "A creature surrounded on all sides by the wall. On a success it can use its reaction to move up to its speed so it is no longer enclosed." },
  ] },

  "creations/Wall of Venom": { activities: [
    { name: "Venom Wall Contact", type: "save", ...WALL, area: { type: "line", size: 30 }, targets: { type: "creature" }, save: { ability: "con", onSave: "half" }, damage: [["4d10", "poison"]], effects: [mark("Poisoned by Venom Wall", 600, ["poisoned"])],
      note: "When a creature enters the wall for the first time on a turn or starts its turn there. On a success it is shunted to the opposite end of the wall from you. The wall's space is difficult terrain." },
    { name: "Poison Repeat", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "con", onSave: "none" }, damage: [["4d10", "poison"]], note: "At the end of each of a poisoned creature's turns: on a success the effect ends, on a failure it takes the damage again." },
  ] },

  "creations/Wall of Water": { activities: [
    { name: "Wall of Water", type: "save", range: 60, duration: { value: 10, units: "minute", concentration: true }, area: { type: "line", size: 30 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["2d8", "bludgeoning", "1d8"]], note: "Each creature in the area when it appears. On a success it is shunted to the opposite end of the wall. Ranged weapon attacks through it have disadvantage and fire damage is halved. Frozen 5-ft sections: AC 5, 15 hit points." },
  ] },

  "creations/Wrath of Nature": { activities: [
    { name: "Wrath of Nature", type: "utility", range: 120, area: { type: "cube", size: 60 }, duration: { value: 1, units: "minute", concentration: true }, note: "Grass and undergrowth are difficult terrain for your enemies." },
    { name: "Whipping Branches", type: "save", activation: "special", targets: { type: "enemy" }, save: { ability: "dex", onSave: "none" }, damage: [["4d8", "slashing"]], note: "At the start of each of your turns, each enemy within 10 feet of a tree in the cube." },
    { name: "Roots and Vines", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", onSave: "none" }, effects: [mark("Restrained by Roots", 60, ["restrained"])], note: "At the end of each of your turns, one creature of your choice on the ground. It can use an action for a Strength (Athletics) check against your creation save DC to end the effect." },
    { name: "Hurl Rock", type: "attack", activation: "bonus", range: 120, attack: { type: "ranged" }, damage: [["4d8", "bludgeoning"]], note: "On a hit the target must also succeed on a Strength saving throw or fall prone." },
  ] },

  "creations/Wrathful Smite": { activities: [
    { name: "Wrathful Smite", type: "damage", activation: "bonus", damage: [["1d8", "psychic", "1d8"]], note: "When you hit with a melee weapon attack." },
    { name: "Wrathful Fear", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute" }, effects: [mark("Frightened by Wrathful Smite", 60, ["frightened"])], note: "The target repeats the save at the end of each of its turns against your creation save DC." },
  ] },
};
