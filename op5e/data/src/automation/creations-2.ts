import type { ActSpec, EffectSpec, Spec } from "../../helpers/spec.js";
import { cap } from "./creations-1.js";

// Creation automation, batch 2. Disadvantage/advantage use Midi-QOL flags (inert without Midi; the text in each note always applies).
const dis = (...kinds: string[]) => kinds.map((k) => ({ key: `flags.midi-qol.disadvantage.${k}`, mode: 0, value: "1" }));
const BREATH6 = ["acid", "cold", "fire", "poison", "thunder", "lightning"];
const L = "@details.level";
const T = (n: number) => `min(1, floor(${L} / ${n}))`;
const CANTRIP_DICE = `(${T(5)} + ${T(11)} + ${T(17)})`;

const disease = (name: string, changes: EffectSpec["changes"], statuses: string[] = []): ActSpec => ({
  name: `Contagion: ${name}`, type: "utility", activation: "special", targets: { count: 1, type: "creature" },
  effects: [{ name, onTargets: true, changes, statuses, seconds: 7 * 86400 }],
  note: "Chosen when the target fails three saves. It lasts for the creation's duration (7 days).",
});

export const creationSpecs2: Record<string, Spec> = {
  "creations/Burning Blade": { activities: [
    { name: "Burning Blade Extra Damage", type: "damage", activation: "special", damage: [[`${CANTRIP_DICE}d8`, "fire"]], note: "From 5th level the melee attack deals this extra fire damage to the target on a hit (1d8 at 5th, 2d8 at 11th, 3d8 at 17th)." },
    { name: "Burning Blade Blast", type: "damage", activation: "special", range: 5, targets: { count: 1, type: "creature" }, damage: [[`${CANTRIP_DICE}d8 + @mod`, "fire"]], note: "On a hit, blast fire from the target to a different creature you can see within 5 feet of it. It takes fire damage equal to your creativity modifier, plus 1d8 at 5th level, 2d8 at 11th and 3d8 at 17th." },
  ] },

  "creations/Cause Strife": { activities: [
    { name: "Cause Strife", type: "save", targets: { count: 1, type: "creature" }, range: 60, save: { ability: "wis", onSave: "none" }, duration: { value: 1, units: "minute", concentration: true },
      effects: [{ name: "Bickering", onTargets: true, seconds: 60, changes: dis("attack.all", "ability.check.all") }],
      note: "On a failure the target bickers and argues: it cannot meaningfully communicate and has disadvantage on attack rolls and ability checks. It repeats the save at the end of each of its turns. Slot 2nd+: one additional target per slot level above 1st." },
  ] },

  "creations/Contagion": { activities: [
    { name: "Contagion Touch", type: "attack", activation: "action", range: 5, attack: { type: "melee" }, effects: [{ name: "Poisoned by Contagion", statuses: ["poisoned"], onTargets: true, seconds: 7 * 86400 }], note: "On a hit the target is poisoned." },
    { name: "Contagion Save", type: "save", activation: "special", targets: { count: 1, type: "creature" }, save: { ability: "con", onSave: "none" }, note: "At the end of each of the poisoned target's turns. Three successes end the creation; three failures end the poisoning and subject the target to a disease of your choice." },
    disease("Blinding Sickness", dis("ability.check.wis", "ability.save.wis"), ["blinded"]),
    disease("Filth Fever", dis("ability.check.str", "ability.save.str")),
    disease("Flesh Rot", dis("ability.check.cha")),
    disease("Mindfire", dis("ability.check.int", "ability.save.int")),
    disease("Seizure", dis("ability.check.dex", "ability.save.dex")),
    disease("Slimy Doom", dis("ability.check.con", "ability.save.con")),
  ] },

  "creations/Control Machine": { activities: [
    { name: "Control Machine", type: "save", targets: { count: 1, type: "creature" }, range: 90, save: { ability: "int", onSave: "none" }, duration: { value: 10, units: "minute", concentration: true },
      note: "An unoccupied machine is put under your control automatically. An autonomous machine makes the Intelligence save now and at the end of each of its turns; a machine controlled by another creature forces that creature to make the save to keep control. Doesn't work on cyborgs. Slot 3rd+: one additional machine per slot level above 2nd, all within 30 feet of each other." },
  ] },

  "creations/Control Winds (R)": { activities: [
    { name: "Gusts", type: "utility", area: { type: "cube", size: 100 }, note: "Choose the wind direction and intensity (calm, moderate, strong). Moderate or strong: ranged weapon attacks through the cube or against targets in it have disadvantage. Strong: a creature moving against the wind spends 1 extra foot of movement per foot moved." },
    { name: "Downdraft", type: "save", area: { type: "cube", size: 100 }, targets: { type: "creature" }, save: { ability: "str", onSave: "none" }, effects: [{ name: "Prone", statuses: ["prone"], onTargets: true, rounds: 1 }],
      note: "Ranged weapon attacks through the cube or against targets in it have disadvantage. A creature that flies into the cube for the first time on a turn or starts its turn there flying makes this save; on a failure it is knocked prone." },
    { name: "Updraft", type: "utility", area: { type: "cube", size: 100 }, note: "Creatures that end a fall in the cube take only half damage. A creature in the cube that makes a vertical jump can jump up to 10 feet higher than normal." },
  ] },

  "creations/Crusader's Aura": { activities: [
    { name: "Crusader's Aura", type: "utility", area: { type: "radius", size: 30 }, targets: { type: "ally" }, duration: { value: 1, units: "minute", concentration: true },
      effects: [{ name: "Crusader's Aura", onTargets: true, seconds: 60, changes: ["mwak", "rwak"].map((k) => ({ key: `system.bonuses.${k}.damage`, mode: 2, value: "+1d6" })) }],
      note: "The aura moves with you. Each friendly creature in it (including you) deals an extra 1d6 damage with weapon attacks, of the weapon's damage type." },
  ] },

  "creations/Deactivate Creation": { activities: [
    { name: "Deactivate Creation", type: "utility", range: 60, targets: { count: 1, type: "creature" }, note: "A creature, object or creation effect within range. Creations of 3rd level or lower on the target end. For each creation of 4th level or higher, make an ability check with your creative ability against DC 10 + the creation's level; on a success it ends. Slot 4th+: automatically ends creations whose level is at most the slot level." },
  ] },

  "creations/Draconic Transformation": { activities: [
    ...BREATH6.map((t): ActSpec => ({
      name: `Draconic Transformation: ${cap(t)}`, type: "heal", activation: "bonus", healing: { formula: "60", type: "temp" }, duration: { value: 10, units: "minute", concentration: true },
      effects: [{ name: `Draconic Form (${t})`, seconds: 600, changes: [
        { key: "system.attributes.senses.blindsight", mode: 4, value: "30" }, { key: "system.attributes.movement.fly", mode: 4, value: "60" },
        { key: "system.attributes.ac.bonus", mode: 2, value: "1" }, { key: "system.traits.di.value", mode: 2, value: t },
      ] }],
      note: `Blindsight 30 ft, flying speed 60 ft, +1 AC and immunity to ${t} damage.`,
    })),
    { name: "Dragon's Breath", type: "save", activation: "bonus", area: { type: "cone", size: 60 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["6d8", BREATH6]], note: "When you use this creation and as a bonus action on later turns. Damage of the type you chose." },
  ] },

  "creations/Dragon's Breath": { activities: [
    { name: "Grant Breath", type: "utility", activation: "bonus", range: 5, rangeUnits: "touch", targets: { count: 1, type: "creature" }, duration: { value: 1, units: "minute", concentration: true }, note: "Touch a willing creature with a mouth. Choose acid, cold, fire, lightning or poison." },
    { name: "Exhale", type: "save", activation: "action", area: { type: "cone", size: 15 }, targets: { type: "creature" }, save: { ability: "dex", onSave: "half" }, damage: [["3d8", ["acid", "cold", "fire", "lightning", "poison"], "1d8"]], note: "The creature exhales energy of the chosen type." },
  ] },
};
