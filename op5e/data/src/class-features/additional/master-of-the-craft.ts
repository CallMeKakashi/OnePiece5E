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

export const masterOfTheCraftFeatures: FeatureItem[] = [
  feat(
    "additional-power/master-of-the-craft",
    "Master of the Craft",
    `<p><em>Prerequisite: 10th level minimum, Gadgeteer class.</em></p>
<p>All your life has been spent around various gadgets and gizmos, learning about the intricate processes and applying them through your machinery. Speaking of application, applying your brilliant mind in any situation, you can empower your inventions, or better provide advice to your allies at any turn.</p>`,
    { requirements: "Gadgeteer 10" },
  ),
  feat(
    "additional-power/master-of-the-craft/inventive-mind",
    "Inventive Mind",
    `<p>You gain a +1 to your Gadgeteer creation attack rolls and save DCs. In addition, you gain an additional number of uses for your Flash of Genius feature equal to your proficiency bonus.</p>`,
    { requirements: "Master of the Craft" },
  ),
  feat(
    "additional-power/master-of-the-craft/masterful-modification",
    "Masterful Modification",
    `<p>All of your infusions count as +1 mastercraft items. If that specific infusion is already +1 and up, it is increased by 1, to a maximum of +4.</p>`,
    { requirements: "Master of the Craft" },
  ),
];
