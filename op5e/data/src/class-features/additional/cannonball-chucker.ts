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

export const cannonballChuckerFeatures: FeatureItem[] = [
  feat(
    "additional-power/cannonball-chucker",
    "Cannonball Chucker",
    `<p><em>Prerequisite: Fighting Style: Thrown Weapon Fighting.</em></p>
<p>You have figured out that loading cannonballs is too slow, so you have decided to speed things up by taking matters into your own hands.</p>`,
    { requirements: "Fighting Style: Thrown Weapon Fighting" },
  ),
  feat(
    "additional-power/cannonball-chucker/strongarm",
    "Strongarm",
    `<p>Once per turn, while wielding a cannonball, you may use it as an improvised weapon attack. This attack uses the statistics of a Cannon Attack with a Swivel Gun, using either your Strength or Dexterity for the attack and damage rolls (using the same modifier for both). This attack counts as having the thrown property.</p>
<p>At 10th level, you can instead treat this attack as one used with a 12-Pounder instead of a Swivel Gun.</p>`,
    {
      requirements: "Cannonball Chucker",
      activation: { type: "action", cost: 1, condition: "While wielding a cannonball" },
    },
  ),
];
