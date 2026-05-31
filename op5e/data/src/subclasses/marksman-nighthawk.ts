import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/marksman/nighthawk";

function feat(idPath: string, name: string, level: number, description: string, extra: any = {}): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Marksman (Nighthawk) ${level}`,
      activation: { type: "", cost: null, condition: "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: "",
      damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
      ...extra,
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

export const nighthawkCreations = feat(
  "feature/marksman/nighthawk/nighthawk-creations", "Nighthawk Creations", 3,
  `<p>Starting at 3rd level, you gain the following bonus creations at specific marksman levels. They count as marksman creations for you, but don't count towards the number of marksman creations you can prepare.</p>
<ul>
<li><strong>3rd:</strong> Temporary Trick, Disguise, Silent Image</li>
<li><strong>5th:</strong> Darkness, Pass Without a Trace</li>
<li><strong>9th:</strong> Fear, Major Image</li>
<li><strong>13th:</strong> Greater Invisibility, Hold Monster</li>
<li><strong>17th:</strong> Mass Disguise, Mislead</li>
</ul>`,
);

export const dreadedAmbush = feat(
  "feature/marksman/nighthawk/dreaded-ambush", "Dreaded Ambush", 3,
  `<p>At 3rd level, you master the art of the ambush. You can give yourself a bonus to your initiative rolls equal to your Wisdom modifier. You can also use your bonus action to hide or disengage.</p>
<p>In addition, once per turn when you hit with a weapon attack, the target takes an extra 1d8 damage of the weapon's damage type.</p>`,
  {
    damage: { parts: [["1d8", ""]], versatile: "" },
  },
);

export const darkOne = feat(
  "feature/marksman/nighthawk/dark-one", "Dark One", 3,
  `<p>At 3rd level, you gain darkvision out to a range of 60 feet. If you already have darkvision from your race, its range increases by 30 feet.</p>
<p>You are also adept at evading creatures that rely on darkvision. While in darkness, you are invisible to any creature that relies on darkvision to see you in that darkness.</p>`,
);

export const honedSenses = feat(
  "feature/marksman/nighthawk/honed-senses", "Honed Senses", 7,
  `<p>By 7th level, you have honed your ability to resist the mind-altering powers of your prey, and see past any illusion.</p>
<p>In addition, you gain 10 ft of blindsight. You gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).</p>`,
);

export const sureshot = feat(
  "feature/marksman/nighthawk/sureshot", "Sureshot", 11,
  `<p>At 11th level, you learn to attack with such unexpected speed that you can turn a miss into another strike. Once on each of your turns when you miss with a weapon attack, you can make another weapon attack as part of the same action.</p>`,
);

export const slipperyDevil = feat(
  "feature/marksman/nighthawk/slippery-devil", "Slippery Devil", 15,
  `<p>Starting at 15th level, your ability to dodge in unforeseen ways makes it nearly impossible for foes to strike you. You can use your bonus action to take the Dodge Action.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
  },
);

export const features: FeatureItem[] = [
  nighthawkCreations, dreadedAmbush, darkOne, honedSenses, sureshot, slipperyDevil,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Nighthawk",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Nighthawks are marksmen who prefer to never be seen. Like a nocturnal carnivore, they stalk from within the shadows, able to navigate the void as if it was day, or perhaps they hide within plain sight. Their steady minds and swift speed enable them to attack and defend with lethal efficiency.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "nighthawk",
    classIdentifier: "marksman",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(nighthawkCreations) }, { uuid: fUuid(dreadedAmbush) }, { uuid: fUuid(darkOne) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(honedSenses) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(sureshot) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(slipperyDevil) }]),
    ) as any,
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;
