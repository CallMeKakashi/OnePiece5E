import type { Spec, ActSpec } from "../../helpers/spec.js";

// Unarmed combat. The feats Unarmed Master and Spirit Adept change what both unarmed strike weapons do, so they only set actor flags
// (a transfer effect adds to flags.op5e.unarmedDieStep / unarmedAttack) and the two weapons read them:
//   die size: 1d(min(12, base + 2 x step)) in data/src/items/weapons.ts; attack bonus: the activities below. A missing flag counts as 0.
const ATK = "@flags.op5e.unarmedAttack";
const strike = (name: string, ability: string, activation: ActSpec["activation"] = "action"): ActSpec =>
  ({ name, type: "attack", activation, attack: { type: "melee", ability, bonus: ATK }, includeBase: true });
const power = (ability: string): ActSpec =>
  ({ name: "Power Strike (-5 to hit, +10 damage)", type: "attack", activation: "action", attack: { type: "melee", ability, bonus: `${ATK} - 5` }, includeBase: true, damage: [["10", "bludgeoning"]],
    note: "Unarmed Master: before you make an unarmed strike you can take a -5 penalty to the attack roll; if it hits, add +10 to the damage." });

export const unarmedSpecs: Record<string, Spec> = {
  "items/Unarmed Strike": { activities: [strike("Unarmed Strike", ""), power("")] },
  // Brawling: Dexterity for unarmed strikes, and one unarmed strike as a bonus action after the Attack action
  "items/Brawler Unarmed Strike": { activities: [strike("Brawler Unarmed Strike", "dex"), strike("Unarmed Strike (bonus action after the Attack action)", "dex", "bonus"), power("dex")] },
  "feats/Unarmed Master": {
    activities: [],
    extraEffects: [{ name: "Unarmed Master", transfer: true, changes: [
      { key: "flags.op5e.unarmedAttack", mode: 2, value: "1" },     // +1 to unarmed attack rolls
      { key: "flags.op5e.unarmedDieStep", mode: 2, value: "1" },    // unarmed damage die one size larger (max d12)
    ] }],
  },
  "feats/Spirit Adept": {
    activities: [],
    extraEffects: [{ name: "Spirit Adept", transfer: true, changes: [
      { key: "flags.op5e.unarmedDieStep", mode: 2, value: "1" },    // unarmed damage die one size larger (max d12)
      { key: "system.attributes.movement.walk", mode: 2, value: "5" },
    ] }],
  },
};
