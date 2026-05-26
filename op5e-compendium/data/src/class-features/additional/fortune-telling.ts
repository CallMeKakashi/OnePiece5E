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

export const fortuneTellingFeatures: FeatureItem[] = [
  feat(
    "additional-power/fortune-telling",
    "Fortune Telling",
    `<p><em>Prerequisites: A Charisma, Intelligence, or Wisdom score of 16 or higher</em></p>
<p>You have spent decades honing your craft, the ability to divine the fortunes of yourself and others, be it via a crystal ball, or even performing augury, you have a knack for knowing what comes ahead.</p>`,
    { requirements: "Charisma, Intelligence, or Wisdom 16" },
  ),
  feat(
    "additional-power/fortune-telling/unfolded-fortune",
    "Unfolded Fortune",
    `<p>When you finish a long rest, roll three d20s and record the numbers rolled. You can replace any attack roll, saving throw, or ability check made by you or a creature that you can see with one of these fortune telling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn.</p>
<p>Each foretelling roll can be used only once. When you finish a long rest, you lose any unused rolls.</p>`,
    {
      requirements: "Fortune Telling",
      uses: { value: null, max: "3", per: "lr", recovery: "", prompt: true },
    },
  ),
];
