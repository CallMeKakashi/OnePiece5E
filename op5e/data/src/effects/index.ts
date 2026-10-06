import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";

// Premade effects (issue #39): common table effects as ready-made items. Each has one activity that applies its effect to the user or the targets, with the
// right duration (the duration text drives turn-based expiry, issue #42). Drag the item onto a sheet or use it from the compendium; the effects themselves
// are defined in data/src/automation/effects-pack.ts.
function effectItem(name: string, description: string): FeatureItem {
  return {
    _id: generateId(`effects/${name}`), name, type: "feat", img: "icons/svg/aura.svg",
    system: {
      description: { value: description, chat: "" }, source: { book: "OP5e", page: "", custom: "", license: "" }, type: { value: "class", subtype: "" },
      requirements: "", activation: { type: "", cost: null, condition: "" }, duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" }, range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true }, actionType: "", damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "", recharge: { value: null, charged: false },
    },
    effects: [], flags: { op5e: { premadeEffect: true } }, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  };
}

export default [
  effectItem("Dodge", "<p>You take the Dodge action. Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if you are incapacitated or your speed drops to 0.</p>"),
  effectItem("Help", "<p>You take the Help action. The creature you help has advantage on the next ability check or attack roll it makes before the start of your next turn.</p>"),
  effectItem("Half Cover", "<p>A target with half cover has a +2 bonus to AC and Dexterity saving throws.</p>"),
  effectItem("Three-Quarters Cover", "<p>A target with three-quarters cover has a +5 bonus to AC and Dexterity saving throws.</p>"),
];
