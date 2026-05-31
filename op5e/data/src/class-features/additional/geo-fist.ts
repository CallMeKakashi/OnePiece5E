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

export const geoFistFeatures: FeatureItem[] = [
  feat(
    "additional-power/geo-fist",
    "Geo-Fist",
    `<p><em>Prerequisite: Decades of building up power</em></p>
<p>Masters of this style have honed their bodies to be able to store the energy and strength they had from youth to reuse later on in life, allowing them to access a form that goes beyond human limits.</p>`,
    { requirements: "Decades of building up power" },
  ),
  feat(
    "additional-power/geo-fist/battle-insurance-fist",
    "Battle Insurance Fist",
    `<p>You can pull from the energy and power that you have built up in the past and channel it all into a devastatingly powerful form, allowing you to overwhelm your opponents easily. As a bonus action, you gain the following benefits for the next minute:</p>
<ul>
<li>Your Strength score increases temporarily by a number equal to your proficiency bonus, to a maximum of 26.</li>
<li>Your Dexterity score increases temporarily by a number equal to your proficiency bonus, to a maximum of 26.</li>
<li>Your size increases by one category temporarily.</li>
<li>You gain a number of temporary hit points equal to four times your level.</li>
</ul>
<p>After the duration of Battle Insurance Fist, you gain 1 level of exhaustion.</p>`,
    {
      requirements: "Geo-Fist",
      activation: { type: "bonus", cost: 1, condition: "" },
      duration: { value: 1, units: "minute" },
      target: { value: null, width: null, units: "", type: "self" },
    },
  ),
];
