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

export const planBFeatures: FeatureItem[] = [
  feat(
    "additional-power/plan-b",
    "Plan B",
    `<p><em>Prerequisite: Gadgeteer class.</em></p>
<p>You're always prepared for things to go south so all your creations are designed to escape nasty situations. Your mods come with a self destruction feature.</p>`,
    { requirements: "Gadgeteer" },
  ),
  feat(
    "additional-power/plan-b/obliterate",
    "Obliterate",
    `<p>As a bonus action you or an ally can cause a mod they're carrying to explode forcing all creatures (excluding you and/or the triggering ally) within thirty feet to make a Dexterity saving throw against your creation save DC. On a failure, a creature takes 4d8 fire, lightning, or thunder damage (your choice), or half as much on a success. The explosion will propel the user 50 feet in any direction. The mod on the item ends, but is not destroyed.</p>`,
    {
      requirements: "Plan B",
      activation: { type: "bonus", cost: 1, condition: "" },
      target: { value: 30, width: null, units: "ft", type: "radius" },
      actionType: "save",
      damage: { parts: [["4d8", "fire"]], versatile: "" },
      save: { ability: "dex", dc: null, scaling: "flat" },
    },
  ),
];
