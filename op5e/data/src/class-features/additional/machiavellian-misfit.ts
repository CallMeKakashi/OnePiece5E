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

export const machiavellianMisfitFeatures: FeatureItem[] = [
  feat(
    "additional-power/machiavellian-misfit",
    "Machiavellian Misfit",
    `<p><em>Prerequisite: 10th level minimum, Rogue class.</em></p>
<p>The chaos of life is where you thrive, given that you are able to maneuver any physical or mental obstacle that comes your way thanks to your slippery nature. In the heat of the moment, you remain steadfast, able to take aim to strike your targets where it hurts, or bend yourself away from any harm.</p>`,
    { requirements: "Rogue 10" },
  ),
  feat(
    "additional-power/machiavellian-misfit/evasive-maneuvers",
    "Evasive Maneuvers",
    `<p>When you gain this additional power, choose either Wisdom, Charisma, Intelligence, or Strength. That saving throw benefits from your Evasion feature.</p>`,
    { requirements: "Machiavellian Misfit" },
  ),
  feat(
    "additional-power/machiavellian-misfit/pinpoint-precision",
    "Pinpoint Precision",
    `<p>Your sneak attack damage increases by 1d6. In addition, you can use your Steady Aim feature without sacrificing movement.</p>`,
    { requirements: "Machiavellian Misfit" },
  ),
];
