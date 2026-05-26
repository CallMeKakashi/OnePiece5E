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

export const kappaStyleFeatures: FeatureItem[] = [
  feat(
    "additional-power/kappa-style",
    "Kappa Style",
    `<p><em>Prerequisite: The Powerful Build feature, or similar effect (increases your carrying capacity to a Large creature)</em></p>
<p>A fighting style that involves the use of brute strength to inflict powerful melee blows, charging through the enemies like a raging river.</p>`,
    { requirements: "Powerful Build or similar" },
  ),
  feat(
    "additional-power/kappa-style/raging-charge",
    "Raging Charge",
    `<p>When you move at least 10 ft. straight toward a target and then hit it with an Attack on the same turn, the target takes an extra 2d8 damage from the melee weapon used. If the target is a creature, it must succeed on a Strength saving throw or be pushed up to 10 ft. away and knocked prone. The DC equals 8 + your Proficiency Bonus + your Strength or Dexterity modifier.</p>
<p>You can use this ability a number of times equal to your proficiency bonus, regaining all expended uses on a long rest.</p>`,
    {
      requirements: "Kappa Style",
      uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
      damage: { parts: [["2d8", ""]], versatile: "" },
      save: { ability: "str", dc: null, scaling: "flat" },
    },
  ),
  feat(
    "additional-power/kappa-style/rushing-river",
    "Rushing River",
    `<p>When you gain this ability, you become unbelievably fast. When you use the dash action and move in a straight line, you do not provoke opportunity attacks.</p>`,
    { requirements: "Kappa Style" },
  ),
];
