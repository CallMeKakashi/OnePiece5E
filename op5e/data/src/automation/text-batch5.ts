import type { Spec, EffectSpec } from "../../helpers/spec.js";

// Conditional text-only features turned usable (issue #26, DM-approved list). A "toggle" is a passive effect that starts switched off:
// the player turns it on while its condition holds (dnd5e cannot test "while wielding", "below half hit points" or "while raging" itself).
// Buttons are activities for the triggered parts. Situational riders that nothing can express stay in the description.
const ch = (key: string, value: string, mode = 2) => ({ key, mode, value });
const toggle = (name: string, ...changes: ReturnType<typeof ch>[]): EffectSpec => ({ name, transfer: true, disabled: true, changes });
const always = (name: string, ...changes: ReturnType<typeof ch>[]): EffectSpec => ({ name, transfer: true, changes });
const MIDI = (what: string, value = "1") => ch(`flags.midi-qol.${what}`, value, 5);

export const batch5Specs: Record<string, Spec> = {
  "feats/Light Armor Master": { activities: [], extraEffects: [
    toggle("Light Armor Master: speed (light or no armor)", ch("system.attributes.movement.walk", "5")),
    toggle("Light Armor Master: moved 20 ft (until your next turn)", ch("system.attributes.ac.bonus", "1")),
  ] },
  "feats/Dual Wielder": { activities: [], extraEffects: [toggle("Dual Wielder: a melee weapon in each hand", ch("system.attributes.ac.bonus", "1"))] },
  "class-features/Fighting Style: Versatile Fighting": { activities: [], extraEffects: [
    toggle("Versatile Fighting: one hand (+1 attack)", ch("system.bonuses.mwak.attack", "+1"), ch("system.bonuses.rwak.attack", "+1")),
    toggle("Versatile Fighting: two hands (+1 AC)", ch("system.attributes.ac.bonus", "1")),
  ] },
  "class-features/Artful Mastery": { activities: [], extraEffects: [toggle("Artful Mastery (unarmored strikes, monk weapons, special brawler attacks)", ch("system.bonuses.mwak.attack", "+1"), ch("system.bonuses.mwak.damage", "+1"))] },
  "class-features/Destroy Defense": { activities: [], extraEffects: [toggle("Destroy Defense: target wears armor or a shield (+2 melee attack)", ch("system.bonuses.mwak.attack", "+2"))] },
  "class-features/In and Out": { activities: [], extraEffects: [toggle("In and Out: below half hit points", ch("system.attributes.movement.walk", "15"), ch("system.bonuses.abilities.save", "+2"))] },
  "class-features/Medical Dissertation": {
    activities: [{ name: "Extra healing", type: "utility", activation: "special", roll: { formula: "@prof", name: "Extra hit points" }, note: "Whenever you restore hit points to a creature, they regain this much more." }],
    extraEffects: [always("Medical Dissertation", ch("system.bonuses.msak.attack", "+1"), ch("system.bonuses.rsak.attack", "+1"), ch("system.bonuses.spell.dc", "+1"))],
  },
  "class-features/Rakish Audacity": { activities: [], extraEffects: [toggle("Rakish Audacity: Charisma to initiative", ch("system.attributes.init.bonus", "+@abilities.cha.mod"))] },
  "class-features/Reckless Brilliance": { activities: [], extraEffects: [
    toggle("Mad Genius (not raging): advantage on Intelligence saves", ch("system.abilities.int.save.roll.mode", "1", 4)),
    toggle("Bound Hulk (raging): resist acid", ch("system.traits.dr.value", "acid")),
    toggle("Bound Hulk (raging): resist poison", ch("system.traits.dr.value", "poison")),
    toggle("Bound Hulk (raging): resist necrotic", ch("system.traits.dr.value", "necrotic")),
  ] },
  "feats/Strong Arms": {
    uses: { max: "1", per: null },
    activities: [{ name: "First-turn strike", type: "utility", activation: "special", consumeUse: true, roll: { formula: "2d6", name: "Extra damage" }, note: "When you hit on your first turn in combat. Once per combat: reset the use by hand when a new combat starts." }],
  },
  "class-features/Unrelenting Fortress": {
    activities: [{ name: "Fortress temporary hit points", type: "heal", activation: "special", healing: { formula: "2 * @prof", type: "temp" }, note: "At the start of each of your turns while you are raging in your Forgemaster's Armor. They vanish when your rage ends. The chosen damage resistance is set on the armor." }],
  },
  "class-features/Aura of Freedom": {
    activities: [{ name: "Aura of Freedom", type: "utility", activation: "special", range: 10, rangeUnits: "ft", targets: { count: "", type: "ally" }, duration: { value: 1, units: "minute" }, note: "You and friendly creatures within 10 feet (30 feet at 18th level) have advantage on saves against being paralyzed or restrained and ignore difficult terrain while you are conscious.",
      effects: [{ name: "Aura of Freedom", seconds: 60, onTargets: true, changes: [ch("system.attributes.movement.ignoredDifficultTerrain", "all"), MIDI("advantage.ability.save.all")] }] }],
  },
  "class-features/Aura of Warding": {
    activities: [{ name: "Aura of Warding", type: "utility", activation: "special", range: 10, rangeUnits: "ft", targets: { count: "", type: "ally" }, duration: { value: 1, units: "minute" }, note: "You and friendly creatures within 10 feet (30 feet at 18th level) have resistance to the damage of creations while you are conscious. Halve creation damage you or an ally takes.",
      effects: [{ name: "Aura of Warding", seconds: 60, onTargets: true }] }],
  },
  "class-features/Carving Inspiration": {
    activities: [{ name: "Carving Inspiration", type: "utility", activation: "special", duration: { value: 1, units: "round" }, note: "When you use your bonus action to give a creature a Bardic Inspiration die.",
      effects: [{ name: "Carving Inspiration", rounds: 1, changes: [MIDI("advantage.attack.mwak")] }] }],
  },
  "class-features/Color of Observation Master": {
    activities: [{ name: "Sense Future", type: "utility", activation: "special", duration: { value: 1, units: "round" }, note: "At the start of your turn, spend two Observation Points. Until the start of your next turn you have advantage on attack rolls, ability checks and saving throws, and other creatures have disadvantage on attack rolls against you.",
      effects: [{ name: "Sense Future", rounds: 1, changes: [MIDI("advantage.attack.all"), MIDI("advantage.ability.check.all"), MIDI("advantage.ability.save.all"), MIDI("grants.disadvantage.attack.all")] }] }],
  },
  "class-features/Colossal Channeler": { activities: [], extraEffects: [toggle("Colossal Channeler (raging): +1d4 more thunder damage (2d4 in total)", ch("system.bonuses.mwak.damage", "+1d4[thunder]"), ch("system.bonuses.rwak.damage", "+1d4[thunder]"))] },
  "class-features/Constant Shots": {
    activities: [{ name: "Regain Advanced Arsenal", type: "utility", activation: "special", consumeUse: true, consumeTarget: "advanced-arsenal", consumeAmount: "-2", note: "When you roll Initiative with no Advanced Arsenal uses left." }],
  },
  "feats/Crusher": {
    activities: [
      { name: "Crusher: push", type: "utility", activation: "special", note: "Once per turn when you hit with bludgeoning damage: move the target 5 feet to an unoccupied space (no more than one size larger than you)." },
      { name: "Crusher: critical hit", type: "utility", activation: "special", targets: { count: 1, type: "enemy" }, duration: { value: 1, units: "round" }, note: "On a critical hit with bludgeoning damage.",
        effects: [{ name: "Crushed: attacks against you have advantage", rounds: 1, onTargets: true, changes: [MIDI("grants.advantage.attack.all")] }] },
    ],
  },
  "class-features/Cut Time": { activities: [], extraEffects: [always("Cut Time", ch("system.attributes.movement.walk", "10"))] },
  "class-features/Dragon Claw": { activities: [], extraEffects: [always("Dragon Claw", ch("flags.op5e.unarmedDieStep", "1"))] },
  "class-features/Endless Vigor": { activities: [], extraEffects: [always("Endless Vigor", ch("system.attributes.hp.bonuses.overall", "+2 * @details.level"))] },
  "feats/Enhanced Evolution": {
    uses: { max: "@prof", per: "lr" },
    activities: [{ name: "Absorption (free cast)", type: "utility", activation: "special", consumeUse: true, note: "Cast the Absorption creation without a creation slot. Constitution is your Creativity modifier for it. The resistance is the damage type chosen for your Spark of War." }],
  },
  "class-features/Enhanced Forms": { activities: [], extraEffects: [toggle("Enhanced Forms: Resilient Constitution",
    ch("system.traits.dr.value", "bludgeoning"), ch("system.traits.dr.value", "piercing"), ch("system.traits.dr.value", "slashing"))] },
};
