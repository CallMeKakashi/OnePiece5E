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

export const flowingMindFeatures: FeatureItem[] = [
  feat(
    "additional-power/flowing-mind",
    "Flowing Mind",
    `<p><em>Prerequisite: 10th level minimum, Brawler class.</em></p>
<p>You have honed your brawler abilities, enhancing not only your spirit, but also your body. Your fighting spirit never seems to run out, and your techniques and strikes are sharper and more accurate than any blade.</p>`,
    { requirements: "Brawler 10" },
  ),
  feat(
    "additional-power/flowing-mind/artful-mastery",
    "Artful Mastery",
    `<p>You gain a +1 bonus to your Spirit Save DCs, as well as attack and damage rolls made with your unarmored strikes, monk weapons, and special brawler attacks (such as Water Shot and Tempest Kick) if you have any.</p>`,
    { requirements: "Flowing Mind" },
  ),
  feat(
    "additional-power/flowing-mind/free-spirit",
    "Free Spirit",
    `<p>When you gain this additional power, your maximum number of Spirit Points increases by an amount equal to your Wisdom modifier.</p>`,
    { requirements: "Flowing Mind" },
  ),
  feat(
    "additional-power/flowing-mind/back-in-the-fight",
    "Back In The Fight",
    `<p>When you use your Shake it Off ability, and have no more remaining uses of the ability, you can spend 3 Spirit points to use it again.</p>`,
    { requirements: "Flowing Mind" },
  ),
];
