import type { Spec } from "../../helpers/spec.js";

// Feats and items whose text has several options. Ability-score and proficiency parts of the feats are already wired by advancement.
const ROUND2 = 2;

export const featItemSpecs: Record<string, Spec> = {
  "feats/Buck-Toothed": {
    activities: [
      { name: "Tail Slam: Bludgeon", type: "damage", activation: "special", consumeUse: true, damage: [["1d6", "bludgeoning"]], note: "When you successfully shove a creature, slam it with your tail." },
      { name: "Tail Slam: Shove Further", type: "utility", activation: "special", consumeUse: true, note: "When you successfully shove a creature, shove it 10 feet instead of 5." },
      { name: "Tail Slam: Slow", type: "utility", activation: "special", consumeUse: true, targets: { count: 1, type: "creature" },
        effects: [{ name: "Slowed by Tail Slam", onTargets: true, rounds: ROUND2, changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "-10" }] }], note: "The target's speed is reduced by 10 feet until the end of its next turn." },
    ],
    extraEffects: [{ name: "Beaver Swimmer", transfer: true, changes: [{ key: "system.attributes.movement.swim", mode: 4, value: "@attributes.movement.walk" }] }],
  },

  "feats/Feral Threat": {
    uses: { max: "@prof", per: "lr" },
    activities: [
      { name: "Menacing Roar", type: "save", activation: "bonus", consumeUse: true, area: { type: "radius", size: 10 }, targets: { type: "creature" },
        save: { ability: "wis", dc: "8 + @prof + @abilities.con.mod", onSave: "none" }, effects: [{ name: "Frightened by Roar", statuses: ["frightened"], onTargets: true, rounds: ROUND2 }],
        note: "Creatures of your choice within 10 feet that can hear you; frightened until the end of your next turn." },
    ],
  },

  "feats/Poisoner": {
    activities: [
      { name: "Coat Weapon", type: "utility", activation: "bonus", duration: { value: 1, units: "minute" }, note: "Coat a weapon or piece of ammo in poison. It keeps its potency for 1 minute or until you hit with it." },
      { name: "Poison Strike", type: "save", activation: "special", targets: { count: 1, type: "creature" },
        save: { ability: "con", dc: "8 + @prof + max(@abilities.int.mod, @abilities.wis.mod)", onSave: "none" }, damage: [["2d8", "poison"]],
        effects: [{ name: "Poisoned by Coated Weapon", statuses: ["poisoned"], onTargets: true, rounds: ROUND2 }],
        note: "A creature damaged by the coated weapon or ammo. On a failure it takes the damage and is poisoned until the end of your next turn." },
      { name: "Brew Poison Doses", type: "utility", activation: "special", note: "One hour with a poisoner's kit and 10 GP of materials makes a number of doses equal to your proficiency bonus." },
    ],
  },

  "feats/Shield Master": {
    activities: [
      { name: "Shield Shove", type: "utility", activation: "bonus", range: 5, targets: { count: 1, type: "creature" }, note: "Shove a creature within 5 feet with your shield." },
      { name: "Interpose Shield", type: "utility", activation: "reaction", reactionWhen: "You succeed on a Dexterity saving throw against an effect that deals half damage on a success", note: "Take no damage instead of half." },
    ],
  },

  "feats/Short Blade Master": {
    activities: [
      { name: "Extra Attack", type: "utility", activation: "special", consumeUse: true, note: "When you take the Attack action with a dagger or shortsword, make one additional attack with it." },
      { name: "Advantage Bonus Damage", type: "damage", activation: "special", damage: [["1d4", ""]], note: "When you have advantage on an attack roll with a dagger or shortsword and hit." },
    ],
  },

  "feats/The Horned One": {
    activities: [
      { name: "Horn Strike", type: "attack", activation: "action", range: 5, attack: { type: "melee", ability: "str" }, damage: [["1d8 + @abilities.str.mod", "piercing"]], note: "Your horns are natural weapons." },
      { name: "Horn Charge", type: "attack", activation: "bonus", range: 5, attack: { type: "melee", ability: "str" }, damage: [["1d8 + @abilities.str.mod", "piercing"]], note: "If you moved at least 20 feet in a straight line toward the target." },
    ],
  },

  "items/Shotgun": {
    activities: [
      { name: "Fire", type: "attack", activation: "action", attack: { type: "ranged", ability: "dex", bonus: "@flags.op5e.wAtk.shotgun" }, includeBase: true, damage: [] },
      { name: "Fire (short range)", type: "attack", activation: "action", attack: { type: "ranged", ability: "dex", bonus: "@flags.op5e.wAtk.shotgun" }, includeBase: true, damage: [["1d(4 + 2 * @flags.op5e.wDie.shotgun)", "piercing"]],
        note: "Ranged attacks against creatures within short range deal an extra 1d4 piercing damage. No disadvantage within close range." },
    ],
  },
};
