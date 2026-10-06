import type { Spec } from "../../helpers/spec.js";

// The premade effects pack (issue #39). Durations come from the rule text (turn-based expiry, issue #42).
const ch = (key: string, value: string, mode = 2) => ({ key, mode, value });
const MIDI = (what: string) => ch(`flags.midi-qol.${what}`, "1", 5);

export const effectsPackSpecs: Record<string, Spec> = {
  "effects/Dodge": { activities: [{
    name: "Take the Dodge action", type: "utility", activation: "action", range: 0, rangeUnits: "self", targets: { count: "1", type: "self" }, duration: { value: 1, units: "round" },
    note: "Until the start of your next turn, attack rolls against you have disadvantage if you can see the attacker, and you have advantage on Dexterity saving throws.",
    effects: [{ name: "Dodging", rounds: 1, changes: [MIDI("grants.disadvantage.attack.all"), MIDI("advantage.ability.save.dex")] }],
  }] },
  "effects/Help": { activities: [{
    name: "Help an ally", type: "utility", activation: "action", range: 5, rangeUnits: "ft", targets: { count: "1", type: "ally" }, duration: { value: 1, units: "round" },
    note: "The ally has advantage on the next ability check or attack roll it makes before the start of your next turn.",
    effects: [{ name: "Helped: advantage on the next attack or check", onTargets: true, rounds: 1, specialDuration: ["1Attack", "isCheck"], changes: [MIDI("advantage.attack.all"), MIDI("advantage.ability.check.all")] }],
  }] },
  "effects/Half Cover": { activities: [{
    name: "Take half cover", type: "utility", activation: "special", range: 0, rangeUnits: "self", targets: { count: "1", type: "self" },
    note: "+2 bonus to AC and Dexterity saving throws. Remove the effect when the cover is gone.",
    effects: [{ name: "Half cover (+2 AC and Dex saves)", changes: [ch("system.attributes.ac.bonus", "2"), ch("system.abilities.dex.bonuses.save", "2")] }],
  }] },
  "effects/Three-Quarters Cover": { activities: [{
    name: "Take three-quarters cover", type: "utility", activation: "special", range: 0, rangeUnits: "self", targets: { count: "1", type: "self" },
    note: "+5 bonus to AC and Dexterity saving throws. Remove the effect when the cover is gone.",
    effects: [{ name: "Three-quarters cover (+5 AC and Dex saves)", changes: [ch("system.attributes.ac.bonus", "5"), ch("system.abilities.dex.bonuses.save", "5")] }],
  }] },
};
