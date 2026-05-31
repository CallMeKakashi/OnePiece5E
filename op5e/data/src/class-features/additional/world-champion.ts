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

export const worldChampionFeatures: FeatureItem[] = [
  feat(
    "additional-power/world-champion",
    "World Champion",
    `<p><em>Prerequisite: Sumo Wrestler Brawler.</em></p>
<p>The art of wrestling, in some places, has taken on a more theatrical approach. While the principles are largely the same, this style of wrestling deviates from the traditions of Sumo in favor of unique and flashy moves of its users' own creation.</p>`,
    { requirements: "Sumo Wrestler Brawler" },
  ),
  feat(
    "additional-power/world-champion/gimmick",
    "Gimmick",
    `<p>You have developed a separate persona to use during combat, complete with a unique outfit and mask. You can adopt this persona as a bonus action as long as no one can see you. While in this persona, no one can recognize you as yourself unless you tell them or they see you change back to your normal self.</p>`,
    {
      requirements: "World Champion",
      activation: { type: "bonus", cost: 1, condition: "No one can see you" },
    },
  ),
  feat(
    "additional-power/world-champion/off-the-ropes",
    "Off the Ropes",
    `<p>You gain a climbing speed equal to your walking speed. In addition, when you use your Savage Slam feature while at least 10 feet off the ground, you deal an additional 1d6 damage of the same type as the attack for every 10 feet you are off the ground, up to a maximum of 10d6. If you hit with the attack, you also take no fall damage if you otherwise would.</p>`,
    { requirements: "World Champion" },
  ),
  feat(
    "additional-power/world-champion/steel-chair",
    "Steel Chair",
    `<p>With style, you can unleash the full force of the objects around you. You gain a bonus to attack and damage rolls made with improvised weapons equal to half your proficiency bonus (rounded down).</p>`,
    { requirements: "World Champion" },
  ),
];
