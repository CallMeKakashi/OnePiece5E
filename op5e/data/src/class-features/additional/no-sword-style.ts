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

export const noSwordStyleFeatures: FeatureItem[] = [
  feat(
    "additional-power/no-sword-style",
    "No Sword Style",
    `<p>When a swordsman is backed to a wall, and their weapons are nowhere to be found, they can continue to fight to utilize their bare hands and strength built up from sword fighting.</p>`,
    { requirements: "" },
  ),
  feat(
    "additional-power/no-sword-style/blade-hands",
    "Blade Hands",
    `<p>Your unarmed strikes deal a 1d6 and are capable of doing bludgeoning, piercing, and slashing damage.</p>
<p>In addition, your unarmed strikes are now capable to act as simple and martial weapons for your other sword-based abilities, such as Foxfire Style.</p>`,
    {
      requirements: "No Sword Style",
      damage: { parts: [["1d6", ""]], versatile: "" },
    },
  ),
];
