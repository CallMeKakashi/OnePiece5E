import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import {
  createItemGrant,
  createScaleValue,
  mergeAdvancements,
} from "../../helpers/advancement.js";

const SUB = "subclass/fighter/brute";
const F = "feature/fighter/brute";

function fUuid(path: string): string {
  return compendiumUuid("class-features", generateId(path));
}

function feat(slug: string, name: string, desc: string, req: string): FeatureItem {
  return {
    _id: generateId(`${F}/${slug}`),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: req,
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
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null, coreVersion: "13",
      systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  };
}

const bruteForce = feat(
  "brute-force", "Brute Force",
  `<p>Starting at 3rd level, you're able to strike with your weapons with especially brutal force. Whenever you hit with a weapon that you're proficient with and deal damage, the weapon's damage increases by an amount based on your level in this class, as shown on the Brute Bonus Damage table.</p>
<table>
<tr><th>Fighter Level</th><th>Bonus Damage</th></tr>
<tr><td>3rd</td><td>1d4</td></tr>
<tr><td>10th</td><td>1d6</td></tr>
<tr><td>16th</td><td>1d8</td></tr>
<tr><td>20th</td><td>1d10</td></tr>
</table>`,
  "Brute 3",
);

const unstoppableDurability = feat(
  "unstoppable-durability", "Unstoppable Durability",
  `<p>Beginning at 7th level, whenever you make a saving throw, you can add 1d6 to the result. If applying this bonus to a death saving throw increases the total to 20 or higher, you gain the benefits of rolling a 20 on the d20.</p>`,
  "Brute 7",
);

const thirdWind = feat(
  "third-wind", "Third Wind",
  `<p>At 10th level, when you use your Second Wind feature, you also gain temporary hit points equal to the hit points you regained.</p>`,
  "Brute 10",
);

const devastatingCritical = feat(
  "devastating-critical", "Devastating Critical",
  `<p>Starting at 15th level, when you score a critical hit with a weapon attack, you deal additional damage equal to your fighter level.</p>`,
  "Brute 15",
);

const survivor = feat(
  "survivor", "Survivor",
  `<p>At 18th level, you attain the pinnacle of resilience in battle. At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points remaining. You don't gain this benefit if you have 0 hit points.</p>`,
  "Brute 18",
);

export const brute: SubclassItem = {
  _id: generateId(SUB),
  name: "Brute",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>Brutes are simple warriors who rely on mighty attacks and their own durability to overcome their enemies. Some brutes combine this physical might with tactical cunning. Others just hit things until those things stop hitting back.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "brute",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/brute-force`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/unstoppable-durability`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/third-wind`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/devastating-critical`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/survivor`) },
      ]),
      createScaleValue(SUB, "brute-force", "dice", {
        3: { number: 1, die: { number: 1, faces: 4 } },
        10: { number: 1, die: { number: 1, faces: 6 } },
        16: { number: 1, die: { number: 1, faces: 8 } },
        20: { number: 1, die: { number: 1, faces: 10 } },
      }),
    ),
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: {
    compendiumSource: null, duplicateSource: null, coreVersion: "13",
    systemId: "dnd5e", systemVersion: "5.1.10",
    createdTime: null, modifiedTime: null, lastModifiedBy: null,
  },
};

export const bruteFeatures: FeatureItem[] = [
  bruteForce,
  unstoppableDurability,
  thirdWind,
  devastatingCritical,
  survivor,
];
