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

export const powerfulLaughterFeatures: FeatureItem[] = [
  feat(
    "additional-power/powerful-laughter",
    "Powerful Laughter",
    `<p><em>Prerequisite: A Charisma score of 13 or higher.</em></p>
<p>Your laughter has a unique effect on your enemies, friends, and even the world around you.</p>`,
    { requirements: "Charisma 13" },
  ),
  feat(
    "additional-power/powerful-laughter/gleeful-bellows",
    "Gleeful Bellows",
    `<p>Choose one of the laughter styles below. Some features of the laughter styles require a saving throw. Your Laughter DC equals 8 + your proficiency bonus + your Charisma modifier.</p>
<p>You can use your Powerful Laughter an amount of times equal to your proficiency bonus, regaining all uses on a long rest.</p>
<ul>
<li><strong>Empowering Laughter.</strong> Your laughter exudes strength that your allies absorb, empowering them in the thick of the fight. As a bonus action, choose up to six creatures within 60ft of you, that can hear you (can include yourself). Until the start of your next turn, each chosen creature has their critical hit range increased by two (20 => 19 => 18 => 17...).</li>
<li><strong>Terrifying Laughter.</strong> You have a laugh that strikes fear into the hearts of those who hear it. As a bonus action, choose up to six creatures within 60ft of you, that can hear you. Each chosen creature must make a Wisdom saving throw against your Laughter DC. On a failure, they become frightened of you until the start of your next turn. While frightened in this way, their movement speed becomes 0.</li>
<li><strong>Hearty Laughter.</strong> Your laughter allows your allies to stand together as an unstoppable wall, steadfast and strong. As a bonus action, choose up to six creatures within 60ft of you, and who can hear you (can include yourself). Each creature gains a number of temporary hit points equal to twice your level.</li>
<li><strong>Beguiling Laughter.</strong> Your laugh soothes the hearts of all who hear it. As a bonus action, choose up to six creatures within 60ft, and can hear you. Each creature must make a Wisdom saving throw against your Laughter DC. On a failure, they become charmed by you for one minute, repeating the saving throw at the end of each of their turns, ending the effect on a success. If the targets make this save in combat, they have advantage on this roll. A charmed target remakes their saving throw with advantage if they take damage.</li>
</ul>`,
    {
      requirements: "Powerful Laughter",
      activation: { type: "bonus", cost: 1, condition: "" },
      target: { value: 6, width: null, units: "", type: "creature" },
      range: { value: 60, long: null, units: "ft" },
      uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
      save: { ability: "wis", dc: null, scaling: "flat" },
    },
  ),
];
