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

export const dragonClawFistFeatures: FeatureItem[] = [
  feat(
    "additional-power/dragon-claw-fist",
    "Dragon Claw Fist",
    `<p>Utilizing the full force of your fingers and striking the core of your targets, masters of this style are capable of crushing just about anything with the claws of dragons.</p>`,
    { requirements: "" },
  ),
  feat(
    "additional-power/dragon-claw-fist/dragon-claw",
    "Dragon Claw",
    `<p>When you gain this ability, you gain the ability to crush anything with your bare hands. Your unarmed strike damage dice increases by one size and deal double damage to objects and structures.</p>`,
    { requirements: "Dragon Claw Fist" },
  ),
  feat(
    "additional-power/dragon-claw-fist/dragon-grip",
    "Dragon Grip",
    `<p>At 5th level, your grip never leaves the enemy. After landing a successful strike on an enemy, you can attempt to grapple them with advantage. You can use this ability a number of times equal to your proficiency bonus, regaining all expended uses on a short or long rest.</p>
<p>In addition, while you are grappling a target, they start their turns taking 1d4 bludgeoning damage.</p>`,
    {
      requirements: "Dragon Claw Fist 5",
      uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    },
  ),
  feat(
    "additional-power/dragon-claw-fist/dragon-breath",
    "Dragon Breath",
    `<p>At 10th level, you have trained yourself to strike the core of the ground to generate shockwaves. Once per turn, you can replace an unarmed strike to use the Thunderwave creation at 1st level using either your Strength or Dexterity to calculate the save DC.</p>
<p>You can use this feature a number of times equal to your proficiency bonus, regaining all expended uses on a long rest.</p>`,
    {
      requirements: "Dragon Claw Fist 10",
      uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
    },
  ),
  feat(
    "additional-power/dragon-claw-fist/dragon-talons",
    "Dragon Talons",
    `<p>At 15th level, when you use your Dragon Grip feature, the extra 1d4 damage becomes 1d6. When you use Dragon's Breath, the Thunderwave creation is used at 2nd level.</p>`,
    { requirements: "Dragon Claw Fist 15" },
  ),
  feat(
    "additional-power/dragon-claw-fist/dragons-dream",
    "Dragon's Dream",
    `<p>At 20th level, Dragon's Grip and Dragon's Breath no longer require uses, but you still only make one Dragon's Breath attack per turn.</p>`,
    { requirements: "Dragon Claw Fist 20" },
  ),
];
