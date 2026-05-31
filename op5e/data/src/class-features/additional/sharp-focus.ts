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

export const sharpFocusFeatures: FeatureItem[] = [
  feat(
    "additional-power/sharp-focus",
    "Sharp Focus",
    `<p><em>Prerequisite: 10th level minimum, Marksman class.</em></p>
<p>As a marksman, your hunter instincts have guided your hand and your mission, enabling you to hunt through the seas, striking your prey from far lands. Through years of practice, your aim has become all the more deadly.</p>`,
    { requirements: "Marksman 10" },
  ),
  feat(
    "additional-power/sharp-focus/hunters-eye",
    "Hunter's Eye",
    `<p>You gain an additional number of uses for your Favored Mark feature equal to your proficiency bonus.</p>`,
    { requirements: "Sharp Focus" },
  ),
  feat(
    "additional-power/sharp-focus/crackshot",
    "Crackshot",
    `<p>When you deal damage with your Favored Mark, you deal an additional amount of damage equal to your Wisdom modifier.</p>`,
    { requirements: "Sharp Focus" },
  ),
  feat(
    "additional-power/sharp-focus/snipe-and-strike",
    "Snipe and Strike",
    `<p>You do not gain disadvantage on attack rolls due to being prone, or making attacks against prone targets.</p>`,
    { requirements: "Sharp Focus" },
  ),
];
