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

export const manDemonTacticsFeatures: FeatureItem[] = [
  feat(
    "additional-power/man-demon-tactics",
    "Man Demon Tactics",
    `<p>A very specialized martial art that allows the user to rotate their weapons at high speeds to break through most defenses, and leap vast distances towards their targets.</p>`,
    { requirements: "" },
  ),
  feat(
    "additional-power/man-demon-tactics/demon-strike",
    "Demon Strike",
    `<p>When you receive this power, you are able to harness both your strength and dexterity while wielding your weapons, causing them to rotate at a rapid pace. All melee weapons you wield gain the Finesse property. In addition, you add both your Strength and Dexterity modifiers to damage rolls made with any melee weapon you wield.</p>`,
    { requirements: "Man Demon Tactics" },
  ),
  feat(
    "additional-power/man-demon-tactics/demon-leap",
    "Demon Leap",
    `<p>When you receive this power, you gain the ability to leap far distances like a mad devil. As a bonus action, while your movement speed isn't 0, you can jump a number of feet equal to 10 x your Proficiency Bonus in a direction of your choice.</p>`,
    {
      requirements: "Man Demon Tactics",
      activation: { type: "bonus", cost: 1, condition: "Movement speed isn't 0" },
    },
  ),
  feat(
    "additional-power/man-demon-tactics/demonic-dance",
    "Demonic Dance",
    `<p>At 5th level, your leaps through the air are not without purpose, slamming into the enemy with the extra momentum. When you use your Demon Leap feature, you can make an additional attack with a melee weapon you are wielding as part of the same bonus action. You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</p>`,
    {
      requirements: "Man Demon Tactics 5",
      activation: { type: "bonus", cost: 1, condition: "When using Demon Leap" },
      uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
    },
  ),
  feat(
    "additional-power/man-demon-tactics/destroy-defense",
    "Destroy Defense",
    `<p>At 10th level, your momentum allows you to break through nearly any armor. You gain a +2 bonus to your melee attack rolls against creatures wearing armor, or using a shield.</p>`,
    { requirements: "Man Demon Tactics 10" },
  ),
  feat(
    "additional-power/man-demon-tactics/demon-wind",
    "Demon Wind",
    `<p>At 15th level, you strike fast like the wind, and strong like a mountain. Your uses with Demon Dance come back on a short rest. In addition, your +2 bonus to melee attacks from Destroy Defense affects all creatures regardless of armor.</p>`,
    { requirements: "Man Demon Tactics 15" },
  ),
  feat(
    "additional-power/man-demon-tactics/momentum-mori",
    "Momentum Mori",
    `<p>At 20th level, you have mastered the art of Man Demon Tactics, turning all of your momentum into a devastating force. Your critical hit range increases by 1 for melee weapons, and your melee weapon attacks ignore resistances to bludgeoning, piercing, and slashing damage.</p>`,
    { requirements: "Man Demon Tactics 20" },
  ),
];
