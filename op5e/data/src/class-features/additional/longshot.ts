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

export const longshotFeatures: FeatureItem[] = [
  feat(
    "additional-power/longshot",
    "Longshot",
    `<p><em>Prerequisites: 10th level, proficiency with a ranged simple or martial weapon</em></p>
<p>Master sharpshooters can fire far, farther beyond any reasonable range, ensuring no enemy can simply run away.</p>`,
    { requirements: "Level 10, Ranged weapon proficiency" },
  ),
  feat(
    "additional-power/longshot/mile-eye",
    "Mile Eye",
    `<p>You can see a mile without difficulty. Additionally, as an action, you can make a single ranged attack. The range of this attack becomes a mile.</p>`,
    {
      requirements: "Longshot",
      activation: { type: "action", cost: 1, condition: "" },
      actionType: "rwak",
      range: { value: 5280, long: null, units: "ft" },
    },
  ),
];
