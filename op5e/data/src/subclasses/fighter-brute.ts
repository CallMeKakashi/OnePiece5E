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
  `<p>Starting at 3rd level, whenever you hit with a weapon that you're proficient with and deal damage, the weapon's damage increases by 1d4. This feature also works with unarmed strikes. This bonus becomes 1d6 at 5th level, 1d8 at 11th level, and 1d10 at 17th level.</p>`,
  "Brute 3",
);

const unstoppableDurability = feat(
  "unstoppable-durability", "Unstoppable Durability",
  `<p>Beginning at 7th level, whenever you make a saving throw, roll 1d6 and add the die to your saving throw total. If applying this bonus to a death saving throw increases the total to 20 or higher, you gain the benefits of rolling a 20 on the d20.</p>`,
  "Brute 7",
);

const thirdWind = feat(
  "third-wind", "Third Wind",
  `<p>At 10th level, you won't give up the fight. When you use your Second Wind feature, you additionally gain a number of temporary hit points equal to the amount you rolled.</p>`,
  "Brute 10",
);

const devastatingCritical = feat(
  "devastating-critical", "Devastating Critical",
  `<p>Starting at 15th level, when you score a critical hit with a weapon attack, you gain a bonus to that weapon's damage roll equal to your level in this class.</p>`,
  "Brute 15",
);

const survivor = feat(
  "survivor", "Survivor",
  `<p>At 18th level, at the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left. You don't gain this benefit if you have 0 hit points.</p>`,
  "Brute 18",
);

export const brute: SubclassItem = {
  _id: generateId(SUB),
  name: "Brute",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The powerful Brute focuses on the use of raw physical power honed to deadly perfection. Those who model themselves on this archetype combine rigorous training with physical excellence to deal devastating blows, and to take heavy hits.</p>",
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
        3: { number: 1, faces: 4 },
        5: { number: 1, faces: 6 },
        11: { number: 1, faces: 8 },
        17: { number: 1, faces: 10 },
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
