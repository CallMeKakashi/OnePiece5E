import type { FeatureItem } from "../../../schemas/feature.js";
import { generateId } from "../../../helpers/id.js";

function feat(
  idPath: string,
  name: string,
  description: string,
  overrides: Partial<FeatureItem["system"]> = {},
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: overrides.requirements ?? "",
      activation: overrides.activation ?? { type: "", cost: null, condition: "" },
      duration: overrides.duration ?? { value: null, units: "" },
      target: overrides.target ?? { value: null, width: null, units: "", type: "" },
      range: overrides.range ?? { value: null, long: null, units: "" },
      uses: overrides.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: overrides.actionType ?? "",
      damage: overrides.damage ?? { parts: [], versatile: "" },
      save: overrides.save ?? { ability: "", dc: null, scaling: "spell" },
      chatFlavor: overrides.chatFlavor ?? "",
      recharge: overrides.recharge ?? { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  };
}

export const dodgeRollFeatures: FeatureItem[] = [
  feat(
    "additional-power/dodge-roll",
    "Dodge Roll",
    `<p><em>Prerequisites: Dexterity 16 or higher, and proficiency in Acrobatics</em></p>
<p>When in combat, never underestimate the power of a well timed dodge. Sometimes you need to tuck and roll like the mighty snail.</p>`,
    { requirements: "Dexterity 16, Proficiency in Acrobatics" },
  ),
  feat(
    "additional-power/dodge-roll/defense-roll",
    "Defense Roll",
    `<p>As a reaction to being hit by an attack, you can attempt to roll out of the way, adding your proficiency bonus to your AC for that attack and moving half your movement in a direction you can see.</p>`,
    {
      requirements: "Dodge Roll",
      activation: { type: "reaction", cost: 1, condition: "Hit by an attack" },
      target: { value: null, width: null, units: "", type: "self" },
    },
  ),
];
