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

export const ramenKenpoFeatures: FeatureItem[] = [
  feat(
    "additional-power/ramen-kenpo",
    "Ramen Kenpo",
    `<p><em>Prerequisite: Proficiency with Chef's Tools</em></p>
<p>A very unorthodox fighting style that only a master chef can hope to fully use, allowing the user to transform the usually harmless noodles as a deadly weapon.</p>`,
    { requirements: "Proficiency with Chef's Tools" },
  ),
  feat(
    "additional-power/ramen-kenpo/noodle-strikes",
    "Noodle Strikes",
    `<p>As long as you have a bag of flour on your person, you can form sharpened noodles as weapons. This attack counts as a melee improvised weapon attack with the finesse, thrown (30/120ft) light properties that deals 1d6 piercing damage.</p>
<p>Additionally, in place of this attack, you can attempt a grapple check, and you can use Acrobatics instead of Athletics to make the grapple.</p>`,
    {
      requirements: "Ramen Kenpo",
      damage: { parts: [["1d6", "piercing"]], versatile: "" },
      range: { value: 30, long: 120, units: "ft" },
    },
  ),
  feat(
    "additional-power/ramen-kenpo/formal-noodle-suit",
    "Formal Noodle Suit",
    `<p>As a bonus action, you can choose to consume an entire bag of flour to form a suit of armor out of Ramen. You gain the following benefits while wearing this suit:</p>
<ul>
<li>You gain twice your level in temporary hit points.</li>
<li>Your Noodle Strike attacks have a bonus to their attack and damage rolls equal to half your proficiency bonus, rounded up.</li>
<li>As a reaction to being hit by a melee attack, you can force the attacker to make a Strength Saving throw, DC = 8 + your Strength Modifier + Proficiency Bonus. On a failure, that creature becomes restrained, escape DC is also the same.</li>
</ul>
<p>This suit lasts 24 hours, or until you lose all your temporary hit points. You can use this ability a number of times equal to your proficiency bonus, per long rest.</p>`,
    {
      requirements: "Ramen Kenpo",
      activation: { type: "bonus", cost: 1, condition: "Consumes a bag of flour" },
      duration: { value: 24, units: "hour" },
      target: { value: null, width: null, units: "", type: "self" },
      uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
    },
  ),
];
