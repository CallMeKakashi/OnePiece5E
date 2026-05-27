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

export const mermanCombatFeatures: FeatureItem[] = [
  feat(
    "additional-power/merman-combat",
    "Merman Combat",
    `<p><em>Prerequisite: Merman Race.</em></p>
<p>Mermen, like fishman, are one with the sea. Using their tridents and hands, they can grab water and force it toward their enemies, as well as achieve mastery over tridents.</p>`,
    { requirements: "Merman Race" },
  ),
  feat(
    "additional-power/merman-combat/tides-of-war",
    "Tides of War",
    `<p>When you gain the ability, you learn that you can grab and weaponize water, and how to make a trident's strike especially deadly.</p>
<p>You learn the Water Flow trick, using either your Strength or Dexterity modifier as the creative ability modifier.</p>
<p>As an action, you can grab water and fire it as a blast in the form of a line that is (Your proficiency bonus x 20) long, and 5ft wide. All creatures within this line must make a Dexterity Saving Throw, DC equal to 8 + your Strength or Dexterity modifier + your Proficiency Bonus. On a failure, they take your (proficiency bonus)d10 bludgeoning damage and half on a success.</p>
<p>You can use this feature 3 times per long rest.</p>
<p>In addition, while wielding a trident, the size of the damage dice increases by one size.</p>`,
    {
      requirements: "Merman Combat",
      activation: { type: "action", cost: 1, condition: "" },
      uses: { value: null, max: "3", per: "lr", recovery: "", prompt: true },
      actionType: "save",
      save: { ability: "dex", dc: null, scaling: "flat" },
    },
  ),
];
