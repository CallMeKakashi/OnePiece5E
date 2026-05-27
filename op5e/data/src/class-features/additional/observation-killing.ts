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

export const observationKillingFeatures: FeatureItem[] = [
  feat(
    "additional-power/observation-killing",
    "Observation Killing",
    `<p><em>Prerequisites: 18th level, Conqueror's Haki Adept</em></p>
<p>Those who train in this branch of conqueror's haki gain the ability to attack the enemies' ability to observe, rendering their observation haki obsolete.</p>`,
    { requirements: "Conqueror's Haki Adept 18" },
  ),
  feat(
    "additional-power/observation-killing/observation-obliteration",
    "Observation Obliteration",
    `<p>When using your Overwhelming Presence, any creatures that remain conscious must make an additional Wisdom Saving Throw against your Conqueror's DC. On a failure, they lose all the benefits of their observation haki for 1 minute, repeating the saving throw at the end of each of their turns.</p>`,
    {
      requirements: "Observation Killing",
      save: { ability: "wis", dc: null, scaling: "flat" },
      duration: { value: 1, units: "minute" },
    },
  ),
];
