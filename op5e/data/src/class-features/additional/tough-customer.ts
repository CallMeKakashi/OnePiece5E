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

export const toughCustomerFeatures: FeatureItem[] = [
  feat(
    "additional-power/tough-customer",
    "Tough Customer",
    `<p><em>Prerequisite: 10th level minimum, Fighter class.</em></p>
<p>Your years of endless encounters and fierce follies of mortal combat have made you all the more tough in the face of the daunting odds ahead. Every scar on your body is a testament to your endurance and ability to act quickly while deep in the thick of the fight.</p>`,
    { requirements: "Fighter 10" },
  ),
  feat(
    "additional-power/tough-customer/active-combatant",
    "Active Combatant",
    `<p>You gain an additional use of your Action Surge and Indomitable features.</p>`,
    { requirements: "Tough Customer" },
  ),
  feat(
    "additional-power/tough-customer/endless-vigor",
    "Endless Vigor",
    `<p>When you use your Second Wind feature, you add your Constitution modifier to the amount of hit points you regain.</p>
<p>In addition, your hit point maximum increases by a number equal to twice your level, and by 2 every level thereafter.</p>`,
    { requirements: "Tough Customer" },
  ),
];
