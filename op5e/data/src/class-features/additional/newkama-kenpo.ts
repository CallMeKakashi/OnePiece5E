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

export const newkamaKenpoFeatures: FeatureItem[] = [
  feat(
    "additional-power/newkama-kenpo",
    "Newkama Kenpo",
    `<p><em>Prerequisite: Okama Kenpo Brawler Class, at least 5th level</em></p>
<p>Martial arts are always evolving, and Okama Kenpo is no exception. Those who practice this style make the most out of their Okama ways, to not only use their immense charm but also their immense strength and speed to dominate the battlefield.</p>`,
    { requirements: "Okama Kenpo Brawler 5" },
  ),
  feat(
    "additional-power/newkama-kenpo/charming-spirit",
    "Charming Spirit",
    `<p>At 5th level, you can use your charm to fuel your spirit. You gain additional Spirit Points equal to your Charisma Modifier. These Spirit Points are added to any Spirit Point total and replenish after a short or long rest like with the rest of the Spirit Points.</p>
<p>In addition, you no longer have limited uses of the bonus action attack when you use your Swan Dance feature.</p>`,
    { requirements: "Newkama Kenpo 5" },
  ),
  feat(
    "additional-power/newkama-kenpo/death-wink",
    "Death Wink",
    `<p>At 5th level, you gain a new attack option which can be performed by winking. This attack can be used to replace any of your unarmed strikes, including a flurry of blows and the martial arts bonus action attack, and counts as an aesthetic weapon.</p>
<p>This special attack is a ranged weapon attack with a range of 30 feet. You are proficient with it, and you add your Dexterity modifier to its attack and damage rolls. Its damage is bludgeoning, and its damage die is a d6. This die changes as you gain brawler levels, as shown in the Martial Arts column of the Brawler table.</p>
<p>Once per turn, the first creature you hit with this attack must make a Strength Saving throw against your Spirit DC. On a failure, they are either pushed back 10ft or knocked prone (the user's choice).</p>`,
    {
      requirements: "Newkama Kenpo 5",
      actionType: "rwak",
      range: { value: 30, long: null, units: "ft" },
      damage: { parts: [["1d6", "bludgeoning"]], versatile: "" },
    },
  ),
  feat(
    "additional-power/newkama-kenpo/awaken-the-maiden",
    "Awaken the Maiden",
    `<p>At 10th level, using your innate charisma, you can attempt to charm a creature you can see within range to become an Okama.</p>
<p>As an action, you can expend 2 Spirit Points to use the Charm Person Creation with your Spirit DC.</p>`,
    {
      requirements: "Newkama Kenpo 10",
      activation: { type: "action", cost: 1, condition: "Costs 2 Spirit Points" },
    },
  ),
  feat(
    "additional-power/newkama-kenpo/rolling-spa",
    "Rolling Spa",
    `<p>At 10th level, when you take the dodge action, you can additionally move a number of feet equal to your proficiency bonus x 5. This movement doesn't provoke opportunity attacks.</p>`,
    { requirements: "Newkama Kenpo 10" },
  ),
  feat(
    "additional-power/newkama-kenpo/waxing-fist",
    "Waxing Fist",
    `<p>At 15th level, when you use Elegant Combination, you don't need to hit with both attacks to make the extra attack.</p>`,
    { requirements: "Newkama Kenpo 15" },
  ),
  feat(
    "additional-power/newkama-kenpo/oh-come-my-way",
    "Oh Come My Way",
    `<p>At 15th level, using your innate charisma, you can attempt to bring a creature you can see within range to enter an irresistible dance.</p>
<p>As an action, you can expend 6 Spirit Points to use the Irresistible Dance Creation with your Spirit DC.</p>`,
    {
      requirements: "Newkama Kenpo 15",
      activation: { type: "action", cost: 1, condition: "Costs 6 Spirit Points" },
    },
  ),
  feat(
    "additional-power/newkama-kenpo/okama-queen",
    "Okama Queen",
    `<p>At 20th level, you have mastered Newkama Kenpo. You can use the Charm Person Creation without spending any Spirit Points.</p>
<p>Additionally, you cannot be charmed against your will.</p>`,
    { requirements: "Newkama Kenpo 20" },
  ),
];
