import type { Spec, EffectSpec, ActSpec } from "../../helpers/spec.js";

// Last group of text-only features turned usable (issue #26, DM-approved list). Toggles are passive effects that start switched off, buttons are activities.
// Choices the player makes at the table (a totem animal, a style, Canny skills) stay with the player: the matching toggle or button is only used if they chose it.
const ch = (key: string, value: string, mode = 2) => ({ key, mode, value });
const toggle = (name: string, ...changes: ReturnType<typeof ch>[]): EffectSpec => ({ name, transfer: true, disabled: true, changes });
const always = (name: string, ...changes: ReturnType<typeof ch>[]): EffectSpec => ({ name, transfer: true, changes });
const MIDI = (what: string, value = "1") => ch(`flags.midi-qol.${what}`, value, 5);
const skillAdv = (...skills: string[]) => skills.map((s) => ch(`system.skills.${s}.roll.mode`, "1", 4));
const DAMAGE = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "radiant", "slashing", "thunder", "psychic"];
const DIE = "@scale.bard.bardic-inspiration";
const BI = { consumeUse: true as const, consumeTarget: "bardic-inspiration" };

const achilles: ActSpec[] = DAMAGE.map((t) => ({
  name: `Achilles Heel: ${t}`, type: "utility", activation: "special", targets: { count: 1, type: "enemy" }, duration: { value: 1, units: "hour" },
  note: `Spend 3 spirit points when you hit with an unarmed strike. The creature is vulnerable to ${t} until it takes that damage (remove the effect then). If it resists ${t}, the resistance is suppressed for 1 minute instead; if it is immune, nothing happens. It can't be affected again for 24 hours.`,
  effects: [{ name: `Achilles Heel: vulnerable to ${t}`, seconds: 3600, onTargets: true, changes: [ch("system.traits.dv.value", t)] }],
}));

export const batch7Specs: Record<string, Spec> = {
  "class-features/Cloak-and-Dagger": { activities: [{ name: "Hide in plain sight", type: "utility", activation: "action", note: "When you attempt to hide you can hide in plain sight. Moving more than half your movement speed while hidden this way reveals your position." }] },
  "class-features/Rational Mind": { activities: [], extraEffects: [toggle("Rational Mind: moved at most half your speed (advantage on History and Investigation)", ...skillAdv("his", "inv"))] },
  "class-features/Superior Hunter": { activities: [], extraEffects: [toggle("Superior Hunter: moved at most half your speed (advantage on Perception and Survival)", ...skillAdv("prc", "sur"))] },
  "class-features/Supreme Sneak": { activities: [], extraEffects: [toggle("Supreme Sneak: moved at most half your speed (advantage on Stealth and Sleight of Hand)", ...skillAdv("ste", "slt"))] },
  "class-features/Aura of Spite": {
    activities: [{ name: "Aura of Spite", type: "utility", activation: "special", range: 10, rangeUnits: "ft", targets: { count: "", type: "ally" }, duration: { value: 1, units: "minute" },
      note: "You and friendly creatures within 10 feet (30 feet at 18th level) have advantage on opportunity attacks and can make them when a creature leaves reach even after taking the Disengage action, while you are conscious.",
      effects: [{ name: "Aura of Spite", seconds: 60, onTargets: true }] }],
  },
  "class-features/Aura of Tenacity": {
    activities: [{ name: "Aura of Tenacity", type: "utility", activation: "special", range: 10, rangeUnits: "ft", targets: { count: "", type: "enemy" }, duration: { value: 1, units: "minute" },
      note: "Creatures of your choice within 10 feet (30 feet at 18th level) have disadvantage on attack rolls against creatures other than you while you are conscious. The effect gives them disadvantage on all attacks: remove it when they attack you.",
      effects: [{ name: "Aura of Tenacity: disadvantage on attacks against others", seconds: 60, onTargets: true, changes: [MIDI("disadvantage.attack.all")] }] }],
  },
  "class-features/Improved Ardent Smite": {
    activities: [{ name: "Improved Ardent Smite", type: "utility", activation: "special", roll: { formula: "1d8", name: "Extra damage (the type you chose for your Ardent Soul)" }, note: "Whenever you hit a creature with a melee weapon." }],
  },
  "class-features/Mountain Stance": {
    activities: [
      { name: "Anchor", type: "utility", activation: "special", duration: { value: 1, units: "round" }, note: "If you moved half your speed or less this turn: until the start of your next turn you can't be moved against your will, and you count as one size larger for shoving and grappling with advantage on Strength checks to grapple and shove.", effects: [{ name: "Mountain Stance", rounds: 1 }] },
      { name: "Brace for damage", type: "utility", activation: "reaction", roll: { formula: "1d10 + @abilities.str.mod", name: "Damage reduced" }, note: "Spend a spirit point whenever you take damage while anchored." },
    ],
  },
  "class-features/Achilles Heel": { activities: achilles },
  "class-features/Fighting Stances": { activities: [], extraEffects: [
    toggle("Earth Stance (+2 AC until your next turn)", ch("system.attributes.ac.bonus", "2")),
    toggle("Earth Stance reaction (+4 AC against one attack)", ch("system.attributes.ac.bonus", "4")),
    toggle("Fire Stance (advantage on weapon attacks until the end of your turn)", MIDI("advantage.attack.mwak"), MIDI("advantage.attack.rwak")),
  ] },
  "class-features/Stance Improvements": { activities: [], extraEffects: [toggle("Wind Stance: flying speed equal to your walking speed", ch("system.attributes.movement.fly", "@attributes.movement.walk", 4))] },
  "class-features/Primal Totem": { activities: [], extraEffects: [
    ...DAMAGE.filter((t) => t !== "force" && t !== "psychic").map((t) => toggle(`Bear (raging): resistance to ${t}`, ch("system.traits.dr.value", t))),
    toggle("Elk (raging, no heavy armor): +15 ft walking speed", ch("system.attributes.movement.walk", "15")),
  ] },
  "class-features/Totem Attuned": {
    activities: [{ name: "Elk: charge through", type: "save", activation: "bonus", targets: { count: 1, type: "creature" }, save: { ability: "str", dc: "8 + @abilities.str.mod + @prof", onSave: "none" }, damage: [["1d12 + @abilities.str.mod", "bludgeoning"]],
      effects: [{ name: "Knocked prone", statuses: ["prone"], onTargets: true }], note: "While raging, pass through the space of a Large or smaller creature during your move. Add your Rage damage by hand; on a failed save the creature also falls prone and takes the damage." }],
    extraEffects: [
      toggle("Eagle (raging): flying speed equal to your walking speed", ch("system.attributes.movement.fly", "@attributes.movement.walk", 4)),
      toggle("Shark (raging): advantage on melee attacks against a creature that is below its hit point maximum", MIDI("advantage.attack.mwak")),
    ],
  },
  "class-features/Ancient Aspect": { activities: [], extraEffects: [toggle("Shark: swim speed equal to your walking speed", ch("system.attributes.movement.swim", "@attributes.movement.walk", 4))] },
  "class-features/Deft Explorer": {
    uses: { max: "@prof", per: "sr" },
    activities: [{ name: "Tireless", type: "heal", activation: "bonus", consumeUse: true, healing: { formula: "1d10 + @details.level", type: "temp" }, note: "If you chose Tireless. Finishing a short rest also lowers your exhaustion by 1." }],
    extraEffects: [toggle("Roving: +10 ft walking speed, climb and swim equal to walking", ch("system.attributes.movement.walk", "10"), ch("system.attributes.movement.climb", "@attributes.movement.walk", 4), ch("system.attributes.movement.swim", "@attributes.movement.walk", 4))],
  },
  "class-features/Inciting Inspiration": { activities: [], extraEffects: [always("Inciting Inspiration", ch("system.bonuses.msak.attack", "+1"), ch("system.bonuses.rsak.attack", "+1"), ch("system.bonuses.spell.dc", "+1"))] },
  "class-features/Inventive Mind": { activities: [], extraEffects: [always("Inventive Mind", ch("system.bonuses.msak.attack", "+1"), ch("system.bonuses.rsak.attack", "+1"), ch("system.bonuses.spell.dc", "+1"))] },
  "class-features/Huntsmen's Tactics": {
    activities: [
      { name: "Persistent Strike", type: "utility", activation: "special", roll: { formula: "1d8", name: "Extra damage" }, note: "When you hit with a weapon attack against a creature below its hit point maximum. Once per turn." },
      { name: "Big Game Hunting", type: "utility", activation: "reaction", note: "When a Large or larger creature within 5 feet hits or misses you with an attack: attack it immediately after." },
      { name: "Cluster Clasher", type: "utility", activation: "special", note: "Once on each of your turns when you make a weapon attack: attack with the same weapon a different creature within 5 feet of the original target and in range." },
    ],
  },
  "class-features/Fearsome Fortitude": {
    activities: [{ name: "Fearsome Fortitude", type: "utility", activation: "special", roll: { formula: "1d@attributes.hd.largestFace + @abilities.con.mod", name: "Hit point maximum increase" }, note: "Your hit point maximum increases by this amount once, and you gain an extra hit die. Choose your saving throw proficiency by hand." }],
  },
  "class-features/Legendary Flourish": {
    activities: [
      { name: "Shielding Hymn", type: "utility", activation: "reaction", ...BI, roll: { formula: `${DIE} + @abilities.cha.mod + @classes.bard.levels`, name: "Damage blocked" }, note: "A creature within 5 feet of you is hit by an attack (can be you)." },
      { name: "Stampeding Anthem", type: "utility", activation: "special", ...BI, roll: { formula: `${DIE} + @abilities.cha.mod`, name: "Extra damage" }, duration: { value: 1, units: "round" }, note: "As part of an attack with a simple or martial weapon: +20 feet movement until the end of your turn.",
        effects: [{ name: "Stampeding Anthem", rounds: 1, changes: [ch("system.attributes.movement.walk", "20")] }] },
      { name: "Piercing Ballad", type: "utility", activation: "special", ...BI, roll: { formula: DIE, name: "Added to the attack roll" }, note: "As part of an attack with a simple or martial weapon." },
      { name: "Flourish temporary hit points", type: "heal", activation: "special", healing: { formula: `${DIE} + @abilities.cha.mod`, type: "temp" }, note: "Whenever you use one of these flourishes." },
    ],
  },
  "class-features/Signature Fighting Style": { activities: [], extraEffects: [
    toggle("Improved Archery: +3 to ranged weapon attacks", ch("system.bonuses.rwak.attack", "+3")),
    toggle("Improved Blind Fighting: blindsight 30 ft", ch("system.attributes.senses.blindsight", "30")),
    toggle("Improved Defense: +1 AC and saving throws in armor", ch("system.attributes.ac.bonus", "1"), ch("system.bonuses.abilities.save", "+1")),
    toggle("Improved Dueling: +2 melee damage with one weapon in one hand", ch("system.bonuses.mwak.damage", "+2")),
  ] },
};
