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

export const heartStringsFeatures: FeatureItem[] = [
  feat(
    "additional-power/heart-strings",
    "Heart Strings",
    `<p><em>Prerequisites: Bard class</em></p>
<p>They say the arts are the true path towards the soul, that they can inspire all who hear them to accomplish the impossible. Your charm and charisma go beyond simply inspiring, but instilling within your audience and allies the will to live, granting them another chance when faced against great odds.</p>`,
    { requirements: "Bard" },
  ),
  feat(
    "additional-power/heart-strings/song-of-life-and-death",
    "Song of Life and Death",
    `<p>A creature with one of your Bardic Inspiration dice can expend it when dealing damage with a weapon attack, dealing an additional amount of damage equal to the die result added to the weapon's damage. Additionally, when a living creature that has your Bardic Inspiration die is reduced to 0 hit points, it can expend that die as a reaction to be reduced to a number of hit points equal to a roll of the Bardic Inspiration die instead.</p>`,
    {
      requirements: "Heart Strings",
      activation: { type: "reaction", cost: 1, condition: "Reduced to 0 HP with Bardic Inspiration" },
    },
  ),
];
