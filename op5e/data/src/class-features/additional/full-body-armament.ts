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

export const fullBodyArmamentFeatures: FeatureItem[] = [
  feat(
    "additional-power/full-body-armament",
    "Full Body Armament",
    `<p><em>Prerequisites: 14th level, Color of Armament Adept</em></p>
<p>Those who train in this branch of armament haki gain the ability to coat their entire body in haki, allowing them to always be on the defensive.</p>`,
    { requirements: "Color of Armament Adept 14" },
  ),
  feat(
    "additional-power/full-body-armament/full-body-armor",
    "Full Body Armor",
    `<p>On your turn, you can choose to expend an amount of Armament Points equal to your level to instead fully coat your body in a dark layer of armor.</p>
<p>For the next minute, you reduce all incoming damage by your level for 1 minute, and each saving throw you make during this time you can reroll once, taking the highest result.</p>
<p>This effect is ignored by attacks or creations that deal force or psychic damage.</p>`,
    {
      requirements: "Full Body Armament",
      activation: { type: "action", cost: 1, condition: "" },
      duration: { value: 1, units: "minute" },
      target: { value: null, width: null, units: "", type: "self" },
    },
  ),
];
