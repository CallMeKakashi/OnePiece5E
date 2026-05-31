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

export const multipleWeaponStyleFeatures: FeatureItem[] = [
  feat(
    "additional-power/multiple-weapon-style",
    "Multiple Weapon Style",
    `<p><em>Prerequisite: Two Weapon Fighting Style</em></p>
<p>When merely two blades are not enough, wielding an additional or even multiple additional blades can be used to not only confuse but overwhelm your opponents with a flurry of weapon strikes.</p>`,
    { requirements: "Two Weapon Fighting Style" },
  ),
  feat(
    "additional-power/multiple-weapon-style/additional-strike",
    "Additional Strike",
    `<p>When you gain this feature, you master the art of making several attacks with various weapons. Once per turn, you can make an additional melee weapon attack when you take the attack action and engage in two weapon fighting. You can only make this extra attack a number of times equal to your proficiency bonus. You regain all uses on a short or long rest.</p>`,
    {
      requirements: "Multiple Weapon Style",
      uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    },
  ),
];
