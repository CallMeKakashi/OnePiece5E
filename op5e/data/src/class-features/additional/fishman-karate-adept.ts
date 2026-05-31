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

export const fishmanKarateAdeptFeatures: FeatureItem[] = [
  feat(
    "additional-power/fishman-karate-adept",
    "Fishman Karate Adept",
    `<p><em>Prerequisite: Wisdom or Dexterity Score of 13 or higher, any class that is not a Fishman Karate Brawler, at least 5th level.</em></p>
<p>You have received basic training in the art of Fishman Karate.</p>`,
    { requirements: "Wisdom or Dexterity 13, Not Fishman Karate Brawler, Level 5" },
  ),
  feat(
    "additional-power/fishman-karate-adept/aquatic-novice",
    "Aquatic Novice",
    `<p>When you gain this ability, you gain the Aquatic Brawler, Brick Fist, and Water Shot abilities from the Fishman Karate Brawler Subclass. The damage dice of these abilities are equal to your unarmed strike damage dice, and any DC it uses is based on your Wisdom modifier.</p>`,
    { requirements: "Fishman Karate Adept" },
  ),
];
