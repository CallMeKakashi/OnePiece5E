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

export const ironFuryFeatures: FeatureItem[] = [
  feat(
    "additional-power/iron-fury",
    "Iron Fury",
    `<p><em>Prerequisite: 10th level minimum, Barbarian class.</em></p>
<p>Your rage is a fire, tempering both the steel of your nerves and the iron like durability of your body, enabling you to tear your foes down with the strength and fury of a hundred men. From sea to sea and Earth to Heaven, your might knows no bounds.</p>`,
    { requirements: "Barbarian 10" },
  ),
  feat(
    "additional-power/iron-fury/durable-rage",
    "Durable Rage",
    `<p>When your rage ends, you can choose to ignore the 1 minute cooldown and re-enter your rage as a bonus action, once per long rest.</p>`,
    {
      requirements: "Iron Fury",
      activation: { type: "bonus", cost: 1, condition: "When rage ends" },
      uses: { value: null, max: "1", per: "lr", recovery: "", prompt: true },
    },
  ),
  feat(
    "additional-power/iron-fury/furious-juggernaut",
    "Furious Juggernaut",
    `<p>While raging, the critical hit range of your weapon attacks are increased by 1 (20 => 19 => 18…).</p>
<p>In addition, while you are raging, any damage you are resistant to, after resistance is calculated, can reduce the damage taken by a number equal to half your proficiency bonus, rounded down.</p>`,
    { requirements: "Iron Fury" },
  ),
];
