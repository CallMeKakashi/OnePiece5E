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

export const phdFeatures: FeatureItem[] = [
  feat(
    "additional-power/phd",
    "PhD",
    `<p><em>Prerequisite: 10th level minimum, Medic class.</em></p>
<p>Years of studying medicine and practical application have led you down the path of medicinal mastery. The health of your patients are paramount, as well as your improving methods and chemical agents you utilize to accomplish your goals.</p>`,
    { requirements: "Medic 10" },
  ),
  feat(
    "additional-power/phd/medical-dissertation",
    "Medical Dissertation",
    `<p>You gain a +1 bonus to your Medic creation attack rolls and save DCs. In addition, anytime you restore hit points to a creature, they regain an additional amount of hit points equal to your proficiency bonus.</p>`,
    { requirements: "PhD" },
  ),
  feat(
    "additional-power/phd/medical-practice",
    "Medical Practice",
    `<p>You gain an additional use of your Experimental Medicine feature.</p>`,
    { requirements: "PhD" },
  ),
];
