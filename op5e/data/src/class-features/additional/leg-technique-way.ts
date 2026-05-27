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

export const legTechniqueWayFeatures: FeatureItem[] = [
  feat(
    "additional-power/leg-technique-way",
    "Leg Technique Way",
    `<p><em>Prerequisite: Longleg Human Race.</em></p>
<p>The Long-Leg Tribe are masters at utilizing their powerful legs to strike their enemies and outspeed them. However, a master of Leg Technique Way can go one step further. The ability to create after-images while kicking makes it difficult for enemies to hit you.</p>`,
    { requirements: "Longleg Human Race" },
  ),
  feat(
    "additional-power/leg-technique-way/fancy-feet",
    "Fancy Feet",
    `<p>When you gain this ability, your movements with your long legs enable you to move quickly and strike fast. Your unarmed strike damage dice with your kicks increases by one size, to a maximum of 1d12. (1d6 => 1d8 => 1d10 => 1d12)</p>
<p>In addition, when you use your Sprint feature, you gain the benefits of the Blur creation until the start of your next turn.</p>`,
    { requirements: "Leg Technique Way" },
  ),
];
