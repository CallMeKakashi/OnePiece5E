import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import {
  createItemGrant,
  createScaleValue,
  mergeAdvancements,
} from "../../helpers/advancement.js";

const SUB = "subclass/fighter/master-of-none";
const F = "feature/fighter/master-of-none";

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

const improvisedWeaponry = feat(
  "improvised-weaponry", "Improvised Weaponry",
  `<p>At 3rd level, you gain proficiency with improvised weapons. Your improvised weapon damage die scales with your fighter level:</p>
<table>
<tr><th>Fighter Level</th><th>Damage Die</th></tr>
<tr><td>3rd</td><td>1d6</td></tr>
<tr><td>7th</td><td>1d8</td></tr>
<tr><td>11th</td><td>1d10</td></tr>
<tr><td>17th</td><td>1d12</td></tr>
</table>
<p>You can use Strength or Dexterity for improvised weapon attacks.</p>`,
  "Master of None 3",
);

const breakdown = feat(
  "breakdown", "Breakdown",
  `<p>At 3rd level, when you hit a creature with an improvised weapon attack, you can choose to destroy the weapon to deal devastating damage. You add double your ability modifier to the damage roll (instead of the normal modifier). The improvised weapon is destroyed after the attack.</p>
<p>You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest.</p>`,
  "Master of None 3",
);

const juryRigging = feat(
  "jury-rigging", "Jury-Rigging",
  `<p>At 7th level, when you hit a creature with an improvised weapon, you can apply one of the following debuff effects instead of dealing extra damage (the target must succeed on a Strength or Dexterity saving throw, DC = 8 + your proficiency bonus + your Strength or Dexterity modifier):</p>
<ul>
<li><strong>Entangle.</strong> The target's speed is reduced by 10 feet until the end of its next turn.</li>
<li><strong>Disorient.</strong> The target has disadvantage on its next attack roll before the end of its next turn.</li>
<li><strong>Blind.</strong> The target is blinded until the end of its next turn.</li>
</ul>`,
  "Master of None 7",
);

const wreckResistance = feat(
  "wreck-resistance", "Wreck Resistance",
  `<p>At 10th level, your experience with breaking things gives you insight into durability. You gain resistance to bludgeoning damage. Additionally, your improvised weapon attacks ignore resistance to bludgeoning, piercing, and slashing damage.</p>`,
  "Master of None 10",
);

const inAndOut = feat(
  "in-and-out", "In and Out",
  `<p>Also at 10th level, when you make an improvised weapon attack, you can move 5 feet before or after the attack without provoking opportunity attacks. This movement doesn't count against your normal movement.</p>`,
  "Master of None 10",
);

const rushRampage = feat(
  "rush-rampage", "Rush Rampage",
  `<p>At 15th level, when you use your Action Surge, every improvised weapon attack you make during that turn deals maximum damage instead of rolling. Additionally, if you destroy an improvised weapon using Breakdown during an Action Surge turn, you can immediately grab another improvised weapon within reach as a free action.</p>`,
  "Master of None 15",
);

const smashAndCrash = feat(
  "smash-and-crash", "Smash and Crash",
  `<p>At 18th level, your destructive potential reaches its apex. When you use Breakdown, the destroyed weapon shatters into shrapnel. Each creature of your choice within 10 feet must make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Strength modifier). On a failed save, a creature takes damage equal to your improvised weapon damage die + your Strength modifier.</p>
<p>Additionally, your Breakdown no longer has a limited number of uses.</p>`,
  "Master of None 18",
);

export const masterOfNone: SubclassItem = {
  _id: generateId(SUB),
  name: "Master of None",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The Master of None is a fighter who has turned the art of improvisation into a deadly combat style. Where others see junk, you see weapons. Where others see finished fights, you see building materials. Everything is a weapon in your hands.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "master-of-none",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/improvised-weaponry`) },
        { uuid: fUuid(`${F}/breakdown`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/jury-rigging`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/wreck-resistance`) },
        { uuid: fUuid(`${F}/in-and-out`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/rush-rampage`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/smash-and-crash`) },
      ]),
      createScaleValue(SUB, "improvised-die", "dice", {
        3: { number: 1, die: { number: 1, faces: 6 } },
        7: { number: 1, die: { number: 1, faces: 8 } },
        11: { number: 1, die: { number: 1, faces: 10 } },
        17: { number: 1, die: { number: 1, faces: 12 } },
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

export const masterOfNoneFeatures: FeatureItem[] = [
  improvisedWeaponry,
  breakdown,
  juryRigging,
  wreckResistance,
  inAndOut,
  rushRampage,
  smashAndCrash,
];
