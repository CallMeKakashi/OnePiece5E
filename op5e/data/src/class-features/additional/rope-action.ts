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

export const ropeActionFeatures: FeatureItem[] = [
  feat(
    "additional-power/rope-action",
    "Rope Action",
    `<p><em>Prerequisite: Proficiency with improvised weapons</em></p>
<p>The ability to tie knots is a very important skill to have in a world dominated by water, especially when it relates to the construction, repair, and operation of most traditional sailing ships. Combative prowess is a key skill, especially when traversing the Grandline. Rope Action is a fighting style that employs both knot tying and combat, allowing the user to restrain, strike, and defend against their enemies.</p>`,
    { requirements: "Proficiency with improvised weapons" },
  ),
  feat(
    "additional-power/rope-action/fiber-artisan",
    "Fiber Artisan",
    `<p>During a short or long rest, you can take 10 minutes to craft 10 Strong Ropes, each of which are 10ft long. They have 5 times your level of Hit Points. They can be burst with a successful Strength check, DC = 8 + your Strength Modifier + Proficiency Bonus.</p>`,
    { requirements: "Rope Action" },
  ),
  feat(
    "additional-power/rope-action/rope-combatant",
    "Rope Combatant",
    `<p>When you wield a 10ft length of rope as an improvised weapon, it gains the finesse and reach property, much like a whip, and deals your choice of 1d6 bludgeoning, piercing, or slashing damage. You can alternatively use a 10ft length of rope like a net.</p>
<p>If you are armed with a Strong Rope, you gain a bonus to attack and damage rolls with it equal to half your proficiency bonus, rounded up. When you use a Strong Rope like a net, the hit points and escape DC are the same as the Strong Rope.</p>`,
    {
      requirements: "Rope Action",
      damage: { parts: [["1d6", ""]], versatile: "" },
    },
  ),
  feat(
    "additional-power/rope-action/spider-rope",
    "Spider Rope",
    `<p>As a bonus action, when you are wielding a rope of at most a distance of 30ft, you can use it to swing a number of feet equal to the rope's length in any direction, as long as there is a stable point for the swinging to occur.</p>`,
    {
      requirements: "Rope Action",
      activation: { type: "bonus", cost: 1, condition: "Wielding a rope of 30ft or less" },
    },
  ),
];
