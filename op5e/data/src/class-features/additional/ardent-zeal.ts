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

export const ardentZealFeatures: FeatureItem[] = [
  feat(
    "additional-power/ardent-zeal",
    "Ardent Zeal",
    `<p><em>Prerequisite: 10th level minimum, Savant class.</em></p>
<p>As a savant, your charm and spirit brings forth a powerful aura to act in the defense of your friends, and the ability to strike your foes down with an elemental force. Through training and your unyielding presence, your passion and conviction become an unstoppable weapon.</p>`,
    { requirements: "Savant 10" },
  ),
  feat(
    "additional-power/ardent-zeal/charismatic-atmosphere",
    "Charismatic Atmosphere",
    `<p>The radius of your Aura of Protection, Aura of Courage, and Ardent Soul Aura abilities increases by a number of feet equal to 5 x half your proficiency bonus (rounded down).</p>`,
    { requirements: "Ardent Zeal" },
  ),
  feat(
    "additional-power/ardent-zeal/invincible-conviction",
    "Invincible Conviction",
    `<p>You gain an extra use of your Channel Conviction feature.</p>`,
    { requirements: "Ardent Zeal" },
  ),
  feat(
    "additional-power/ardent-zeal/powerful-passion",
    "Powerful Passion",
    `<p>When you use your Ardent Smite feature, it deals an extra 1d8 damage, to a maximum of 6d8 of the same type of your Ardent Soul.</p>`,
    { requirements: "Ardent Zeal" },
  ),
];
