import type { EffectSpec, Spec } from "../../helpers/spec.js";

// Creation automation, batch 6.
const mark = (name: string, seconds = 60, statuses?: string[], changes?: EffectSpec["changes"]): EffectSpec => ({ name, onTargets: true, seconds, statuses, changes });
const dis = (...kinds: string[]) => kinds.map((k) => ({ key: `flags.midi-qol.disadvantage.${k}`, mode: 0, value: "1" }));

export const creationSpecs6: Record<string, Spec> = {
  "creations/Spray of Cards": { activities: [
    { name: "Blinding Cards", type: "save", area: { type: "cone", size: 15 }, targets: { type: "creature" }, save: { ability: "wis", onSave: "none" }, effects: [mark("Blinded by Cards", 12, ["blinded"])], note: "On a failure the creature is blinded until the end of its next turn." },
    { name: "Cutting Cards", type: "save", area: { type: "cone", size: 15 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["2d10", "slashing", "1d10/2"]] },
  ] },

  "creations/Staggering Smite": { activities: [
    { name: "Staggering Smite", type: "damage", activation: "bonus", damage: [["4d6", "psychic"]], note: "When you hit with a melee weapon attack: an extra 4d6 psychic damage." },
    { name: "Staggered Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, effects: [mark("Staggered", 12, undefined, dis("attack.all", "ability.check.all"))], note: "On a failure the target has disadvantage on attack rolls and ability checks, and can't take reactions, until the end of its next turn." },
  ] },

  "creations/Storm of Vengeance": { activities: [
    { name: "Storm Appears", type: "save", range: 0, area: { type: "radius", size: 360 }, targets: { type: "creature" }, save: { ability: "con", onSave: "none" }, damage: [["2d6", "thunder"]], effects: [mark("Deafened by Thunder", 300, ["deafened"])], duration: { value: 1, units: "minute", concentration: true },
      note: "A churning storm cloud with a radius of 360 feet. Each creature under it (no more than 5,000 feet beneath) when it appears. On a failure: the damage and deafened for 5 minutes." },
    { name: "Round 2: Acid Rain", type: "damage", activation: "special", area: { type: "radius", size: 360 }, damage: [["1d6", "acid"]], note: "Each creature and object under the cloud." },
    { name: "Round 3: Lightning Bolts", type: "save", activation: "special", targets: { count: 6, type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["10d6", "lightning"]], note: "Six bolts strike six creatures or objects of your choice beneath the cloud; none can be struck by more than one." },
    { name: "Round 4: Hail", type: "damage", activation: "special", area: { type: "radius", size: 360 }, damage: [["2d6", "bludgeoning"]], note: "Each creature under the cloud." },
    { name: "Rounds 5-10: Freezing Rain", type: "damage", activation: "special", area: { type: "radius", size: 360 }, damage: [["1d6", "cold"]], note: "The area becomes difficult terrain and heavily obscured; ranged weapon attacks are impossible; the wind and rain are a severe distraction for concentration. Strong winds disperse fog and mists." },
  ] },

  "creations/Stormy Sphere": { activities: [
    { name: "Whirling Air", type: "save", range: 150, area: { type: "radius", size: 20 }, targets: { type: "creature" }, save: { ability: "str", onSave: "none" }, damage: [["2d6", "bludgeoning", "1d6"]], duration: { value: 1, units: "minute", concentration: true },
      note: "Each creature in the sphere when it appears or that ends its turn there. The sphere's space is difficult terrain; creatures within 30 feet have disadvantage on Wisdom (Perception) checks to listen." },
    { name: "Lightning Leap", type: "attack", activation: "bonus", range: 60, attack: { type: "ranged" }, damage: [["4d10", "lightning", "1d10"]], note: "A bolt leaps from the center of the sphere toward a creature within 60 feet of it. Advantage on the attack roll if the target is in the sphere." },
  ] },

  "creations/Target Bullseye": { activities: [
    { name: "Target Bullseye", type: "save", range: 60, targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true }, effects: [mark("Fixated on a Target")],
      note: "On a success nothing happens. On a failure you select another creature within range; the creature that failed must use its action and movement to get as close as possible to it and attack it, repeating the save at the end of each of its turns. Slot 6th+: one additional creature per level above 5th, all within 30 feet of each other." },
  ] },

  "creations/Thunder Beat": { activities: [
    { name: "Thunder Beat", type: "damage", activation: "bonus", damage: [["2d6", "thunder", "1d6"]], note: "When you hit with a ranged weapon attack: an extra 2d6 thunder damage." },
    { name: "Debilitating Vibration", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true }, effects: [mark("Debilitated", 60)],
      note: "On a failure the target has disadvantage on all attack rolls against creatures other than you for the duration, and can remake the save at the end of each of its turns." },
  ] },

  "creations/Thunderous Smite": { activities: [
    { name: "Thunderous Smite", type: "damage", activation: "bonus", damage: [["2d6", "thunder", "1d6"]], note: "When you hit with a melee weapon attack. The ring of thunder is audible within 300 feet." },
    { name: "Thunderous Shove", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "str", onSave: "none" }, effects: [mark("Knocked Prone", 6, ["prone"])], note: "On a failure the target is pushed 10 feet away from you and knocked prone." },
  ] },

  "creations/Tornado": { activities: [
    { name: "Tornado", type: "save", range: 300, area: { type: "cylinder", size: 10 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["10d6", "bludgeoning"]], duration: { value: 1, units: "minute", concentration: true },
      note: "A 10-foot-radius, 30-foot-high cylinder. A creature saves the first time on a turn it enters the tornado or the tornado enters its space. Use your action to move it up to 30 feet along the ground; it sucks up Medium or smaller loose objects." },
    { name: "Tornado Restrain", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "str", onSave: "none" }, effects: [mark("Restrained in the Tornado", 60, ["restrained"])], note: "A Large or smaller creature that failed the first save. At the start of its turn a restrained creature is pulled 5 feet higher, and falls when the creation ends unless it can stay aloft." },
    { name: "Break Out of the Tornado", type: "utility", activation: "action", note: "A restrained creature makes a Strength or Dexterity check against your creation save DC; on a success it is freed and hurled 3d6 x 10 feet in a random direction." },
  ] },

  "creations/Transmute Rock": { activities: [
    { name: "Rock to Mud", type: "utility", range: 120, area: { type: "cube", size: 40 }, note: "Rock in the area becomes an equal volume of thick mud for the duration; each foot moved through it costs 4 feet of movement. Used on a ceiling, the mud falls." },
    { name: "Mud Sinking Save", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "str", onSave: "none" }, effects: [mark("Stuck in Mud", 600, ["restrained"])], note: "A creature on the ground when you use it, and the first time it enters the area on a turn or ends its turn there. On a failure it sinks and is restrained; it can use an action to pull itself free." },
    { name: "Falling Mud", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["4d8", "bludgeoning"]], note: "A creature under mud that falls from a ceiling." },
    { name: "Mud to Rock", type: "utility", range: 120, area: { type: "cube", size: 40 }, note: "Mud or quicksand no more than 10 feet deep becomes soft stone for the duration." },
    { name: "Entombed in Stone Save", type: "save", activation: "special", targets: { type: "creature" }, save: { ability: "dex", onSave: "none" }, effects: [mark("Entombed in Stone", 600, ["restrained"])], note: "A creature in the mud when it transforms. On a failure it is restrained by the rock (a Strength check, DC 20, or 25 damage to the rock frees it); on a success it is shunted safely to the surface." },
  ] },

  "creations/True Polymorph": { activities: [
    { name: "Creature into Creature", type: "save", range: 30, targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "hour", concentration: true },
      note: "The new form can be any creature of equal or lower challenge rating (or level). Its game statistics replace the target's, including mental scores; it keeps alignment and personality and takes the new form's hit points. Permanent if you concentrate for the full duration. An unwilling creature makes the save; it can't affect a target with 0 hit points." },
    { name: "Creature into Object", type: "save", range: 30, targets: { count: 1, type: "creature" }, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "hour", concentration: true }, note: "Transform the creature into a non-mastercraft object. Permanent if you concentrate for the full duration." },
    { name: "Object into Creature", type: "utility", range: 30, targets: { count: 1, type: "object" }, duration: { value: 1, units: "hour", concentration: true }, note: "The object must be neither worn nor carried by another creature. Permanent if you concentrate for the full duration." },
  ] },
};
