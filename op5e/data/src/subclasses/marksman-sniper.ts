import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/marksman/sniper";

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
      requirements: `Marksman (Sniper) ${level}`,
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

export const sniperCreations = feat(
  "feature/marksman/sniper/sniper-creations", "Sniper Creations", 3,
  `<p>Starting at 3rd level, you gain the following bonus creations at specific marksman levels. They count as marksman creations for you, but don't count towards the number of marksman creations you can prepare.</p>
<ul>
<li><strong>3rd:</strong> Advanced Weapon, Retreat</li>
<li><strong>5th:</strong> Grounding, Cloud of Daggers</li>
<li><strong>9th:</strong> Barrage, Clairvoyance</li>
<li><strong>13th:</strong> Locate Creature, Freedom of Movement</li>
<li><strong>17th:</strong> Cloudkill, Swift Shots</li>
</ul>`,
);

export const carefulAim = feat(
  "feature/marksman/sniper/careful-aim", "Careful Aim", 3,
  `<p>Starting at 3rd level, you can use a bonus action to take careful aim until the start of your next turn.</p>
<p>If you do so, the ranges of any ranged weapon you're wielding becomes (50 &times; your Proficiency Bonus)/(200 &times; your Proficiency Bonus) feet unless it's already more than that. Additionally, you ignore any disadvantage on ranged attacks imposed by weather-related effects, such as fog or strong winds.</p>
<p>At 11th level, all ranged weapon attacks you make benefit from Careful Aim.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
  },
);

export const explodingShot = feat(
  "feature/marksman/sniper/exploding-shot", "Exploding Shot", 3,
  `<p>Also at 3rd level, when you hit with a ranged weapon attack, you can choose to make it explosive. It deals an extra 1d6 damage of your choice of the weapon you are using, fire, or thunder. You can deal this damage once per turn.</p>
<p>In addition, you can choose to make it so all creatures within 5 ft of the attack must make a Dexterity saving throw against your Creation Save DC. On a failure, they also take the damage from the attack, half on a success.</p>`,
  {
    damage: { parts: [["1d6", ""]], versatile: "" },
    save: { ability: "dex", dc: null, scaling: "wis" },
  },
);

export const crackshot = feat(
  "feature/marksman/sniper/crackshot", "Crackshot", 7,
  `<p>At 7th level, you gain accurate and devastating aim. Once on each of your turns, when you miss with an attack using Careful Aim, you can reroll the attack, using the new result.</p>
<p>In addition, when you make a ranged attack while under the effect of Careful Aim, you score critical hits with ranged attacks on a roll of 19 or 20 on the d20.</p>`,
);

export const creativeArsenal = feat(
  "feature/marksman/sniper/creative-arsenal", "Creative Arsenal", 11,
  `<p>At 11th level, when you use your Action to activate a Creation, you can make a ranged weapon attack as a bonus action. If the creation has a range other than self, you can make the creation originate within the range of the weapon you are wielding.</p>`,
);

export const unerringAim = feat(
  "feature/marksman/sniper/unerring-aim", "Unerring Aim", 15,
  `<p>At 15th level, your aim grows so accurate that you never miss a shot. When you make a ranged attack roll and miss, you can choose to make it hit instead. You can use this feature a number of times equal to your proficiency bonus, regaining all uses on a long rest.</p>`,
  {
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  sniperCreations, carefulAim, explodingShot, crackshot, creativeArsenal, unerringAim,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Sniper",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The quintessential marksman is the sniper, a skilled fighter that excels at fighting at long ranges utilizing the massive reach of their weapons. A sniper is remarkable for their skill more so than their weapon of choice, as even a humble slingshot can be deadly in the hands of a skilled sniper.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "sniper",
    classIdentifier: "marksman",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(sniperCreations) }, { uuid: fUuid(carefulAim) }, { uuid: fUuid(explodingShot) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(crackshot) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(creativeArsenal) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(unerringAim) }]),
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
