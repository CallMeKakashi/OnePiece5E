import type { FeatureItem } from "../../../schemas/feature.js";
import { generateId } from "../../../helpers/id.js";
import { createDAEEffect, addBonus } from "../../../helpers/effects.js";
import { DAE_KEYS } from "../../../schemas/common.js";

function feat(
  idPath: string,
  name: string,
  description: string,
  overrides: Partial<FeatureItem["system"]> = {},
  effects: FeatureItem["effects"] = [],
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
    effects,
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

export const armorlessGuardianFeatures: FeatureItem[] = [
  feat(
    "additional-power/armorless-guardian",
    "Armorless Guardian",
    `<p><em>Prerequisite: An unarmored AC or natural armor.</em></p>
<p>Be it a tough body, or enhanced reflexes, you are able to avoid major harm that comes your way. They say through a focused spirit can one dodge bullets, or take powerful blows unscathed, and you are no exception.</p>`,
    { requirements: "Unarmored AC or Natural Armor" },
  ),
  feat(
    "additional-power/armorless-guardian/duck-and-dodge",
    "Duck and Dodge",
    `<p>When you gain this ability you gain a +1 bonus to your unarmored AC or natural armor. At 10th level, this bonus increases to +2.</p>`,
    { requirements: "Armorless Guardian" },
    [
      createDAEEffect(
        "armorless-guardian/duck-and-dodge",
        "Duck and Dodge",
        [addBonus(DAE_KEYS.AC_BONUS, "1")],
      ),
    ],
  ),
];
