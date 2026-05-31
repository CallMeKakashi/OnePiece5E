import { generateId } from "../../helpers/id.js";
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

export const quickFooted = rf(
  "feature/race/dwarves/quick-footed",
  "Quick-Footed",
  `<p>You are proficient in Dexterity (Stealth) and Dexterity (Acrobatics) checks.</p>`,
  "Dwarves",
);

export const nimble = rf(
  "feature/race/dwarves/nimble",
  "Nimble",
  `<p>You can move through the space of any creature that is of a size larger than yours.</p>`,
  "Dwarves",
);

export const elusive = rf(
  "feature/race/dwarves/elusive",
  "Elusive",
  `<p>As a bonus action, you can take either the Disengage or Hide action.</p>`,
  "Dwarves",
  {
    activation: { type: "bonus", cost: 1, condition: "" },
  },
);

export const combatReady = rf(
  "feature/race/dwarves/combat-ready",
  "Combat Ready",
  `<p>Your damage dice for your unarmed strikes increase by one step, to a maximum of 1d12. In addition, you count as Medium when determining your carrying capacity and jump height.</p>`,
  "Dwarves",
);

export const gullible = rf(
  "feature/race/dwarves/gullible",
  "Gullible",
  `<p>Dwarves have disadvantage on Insight checks to see if someone is lying.</p>`,
  "Dwarves",
);

export const dwarvesFeatures: FeatureItem[] = [
  quickFooted, nimble, elusive, combatReady, gullible,
];
