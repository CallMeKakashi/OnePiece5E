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

export const cheaterCheaterFeatures: FeatureItem[] = [
  feat(
    "additional-power/cheater-cheater",
    "Cheater Cheater",
    `<p><em>Prerequisite: Proficiency in Deception.</em></p>
<p>Through deception, you can hide your true intentions at any moment, turning what seems to be a failure instead into a moment of triumph, no matter how unconventional or how out of your depth you are. Few can call your bluff, and those that do just find themselves tangled deeper within your web.</p>`,
    { requirements: "Proficiency in Deception" },
  ),
  feat(
    "additional-power/cheater-cheater/a-lesson-in-trickery",
    "A Lesson in Trickery",
    `<p>You gain a number of Cheat Dice equal to your proficiency bonus, all of which you regain at the end of a short or long rest. These Cheat Dice are d8s.</p>
<ul>
<li><strong>By the Skin of My Teeth.</strong> As a reaction to a creature hitting you with an attack, you can expend one of your Cheat Dice to roll it to reduce the attack roll by the result. If the attack is a critical hit, it instead becomes a normal hit.</li>
<li><strong>Run and Flee.</strong> You cause your opponent to momentarily drop their guard long enough for you to flee. As a bonus action, you can expend one of your Cheat Dice to move a number of feet equal to 5 x the number rolled on your Cheat Dice. During this movement, you do not provoke opportunity attacks.</li>
<li><strong>Just as Planned.</strong> If you fail an attack roll, ability check, or saving throw, you can expend a Cheat Die to roll it and add the result to the roll, potentially changing it to a success. If this feature is used on a critical failure, it instead turns into a normal failure.</li>
</ul>`,
    {
      requirements: "Cheater Cheater",
      uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    },
  ),
];
