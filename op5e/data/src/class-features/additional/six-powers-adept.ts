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

export const sixPowersAdeptFeatures: FeatureItem[] = [
  feat(
    "additional-power/six-powers-adept",
    "Six Powers Adept",
    `<p><em>Prerequisite: Strength or Dexterity Score of 13 or higher, any class that is not a Six Powers Master Brawler, at least 5th level.</em></p>
<p>You have trained in a few of the Six Powers, focusing your efforts on mastering two techniques.</p>`,
    { requirements: "Strength or Dexterity 13, Not Six Powers Master Brawler, Level 5" },
  ),
  feat(
    "additional-power/six-powers-adept/chosen-powers",
    "Chosen Powers",
    `<p>When you gain this ability you learn one of the 3rd level Six Powers from the Brawler subclass to learn. If the technique you have chosen requires Spirit Points, and you don't have Spirit Points, you can use those techniques a number of times equal to your proficiency bonus, regaining all uses on a short or long rest.</p>
<p>At 10th level, you learn another technique, and the one you had chosen previously improves to the 11th level version. At 15th level, the second power you chose improves.</p>`,
    {
      requirements: "Six Powers Adept",
      uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    },
  ),
];
