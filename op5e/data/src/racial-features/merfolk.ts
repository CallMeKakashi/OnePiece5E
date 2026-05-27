import { generateId } from "../../helpers/id.js";
import { createDAEEffect, customChange, upgradeValue } from "../../helpers/effects.js";
import type { FeatureItem } from "../../schemas/feature.js";

function rf(
  idPath: string,
  name: string,
  desc: string,
  req: string,
  extra: Partial<FeatureItem["system"]> = {},
  effects: FeatureItem["effects"] = [],
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "race", subtype: "" },
      requirements: req,
      activation: { type: "", cost: null, condition: "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: "",
      damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
      ...extra,
    },
    effects,
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null,
      coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
}

export const merfolkAquaticAdaption = rf(
  "feature/race/merfolk/aquatic-adaption",
  "Aquatic Adaption",
  `<p>You can breathe air and water. You have advantage on all Strength (Athletics) ability checks made while in water. In addition, you gain resistance to cold damage.</p>`,
  "Merfolk",
  {},
  [createDAEEffect("race/merfolk/aquatic-adaption", "Aquatic Adaption", [
    customChange("system.traits.dr.value", "cold"),
  ])],
);

export const bubbleFloater = rf(
  "feature/race/merfolk/bubble-floater",
  "Bubble Floater",
  `<p>When near a body of water, you can create a bubble floater around your midsection as an action. While you have this floater, your walking speed increases by 20. The floater lasts for 8 hours.</p>`,
  "Merfolk",
  {
    activation: { type: "action", cost: 1, condition: "Near a body of water" },
    duration: { value: 8, units: "hour" },
    target: { value: null, width: null, units: "", type: "self" },
    range: { value: null, long: null, units: "self" },
  },
);

export const callForAid = rf(
  "feature/race/merfolk/call-for-aid",
  "Call for Aid",
  `<p>As an action, you can use the Call Beast creation without any material components, summoning only beasts of a water environment. This feature uses your choice of Intelligence, Wisdom, or Charisma as your creativity modifier. Once you use this trait, you cannot use it again until you finish a long rest.</p>
<p>If you have the creativity feature, you add this creation to your creation list, not counting against the maximum amount of creations you know or prepare.</p>`,
  "Merfolk",
  {
    activation: { type: "action", cost: 1, condition: "" },
    uses: { value: null, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const merfolkDarkvision = rf(
  "feature/race/merfolk/darkvision",
  "Darkvision",
  `<p>Accustomed to the dark ocean floors where light is scarce, you have darkvision out to 60 feet and can see in dim light as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>`,
  "Merfolk",
  {},
  [createDAEEffect("race/merfolk/darkvision", "Darkvision", [
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const friendOfTheSea = rf(
  "feature/race/merfolk/friend-of-the-sea",
  "Friend of the Sea",
  `<p>You can speak with creatures with a natural swimming speed that are of Huge size or smaller. Though simple-minded, sea creatures can understand the words you speak. Additionally, you have advantage on Wisdom (Animal Handling) ability checks made towards marine creatures.</p>`,
  "Merfolk",
);

export const pureSoul = rf(
  "feature/race/merfolk/pure-soul",
  "Pure Soul",
  `<p>You have advantage on Intelligence, Wisdom, and Charisma saving throws.</p>`,
  "Merfolk",
);

export const merfolkFeatures: FeatureItem[] = [
  merfolkAquaticAdaption, bubbleFloater, callForAid,
  merfolkDarkvision, friendOfTheSea, pureSoul,
];
