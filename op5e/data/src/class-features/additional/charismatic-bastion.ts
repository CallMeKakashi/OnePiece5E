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

export const charismaticBastionFeatures: FeatureItem[] = [
  feat(
    "additional-power/charismatic-bastion",
    "Charismatic Bastion",
    `<p><em>Prerequisite: 10th level minimum, Bard class.</em></p>
<p>To your allies, you are a guiding star amongst the black abyss. Your force of personality is unlike any other, the merit of your words reaching the hearts of those around you, granting them the courage they need to succeed in the trials and tribulations ahead. To your foes, you are a force to be reckoned with. Your presence on the field is irresistible, as your allies stand by you, leading the charge.</p>`,
    { requirements: "Bard 10" },
  ),
  feat(
    "additional-power/charismatic-bastion/charming-personality",
    "Charming Personality",
    `<p>You gain a number of additional uses to your Harmonic Vitality ability equal to your proficiency bonus.</p>`,
    { requirements: "Charismatic Bastion" },
  ),
  feat(
    "additional-power/charismatic-bastion/inciting-inspiration",
    "Inciting Inspiration",
    `<p>When you use your Bardic Inspiration feature, you can choose two creatures to gain a bardic inspiration die as part of the same usage.</p>
<p>In addition, you gain a +1 bonus to your creation attack rolls and save DCs for your Bard Creations.</p>`,
    { requirements: "Charismatic Bastion" },
  ),
];
