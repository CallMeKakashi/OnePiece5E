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
  `<p>When you choose this archetype at 3rd level, you learn how to turn anything into a weapon. You gain proficiency in improvised weapons, and whenever you obtain a new improvised weapon, you can add one weapon property of your choice, other than ammunition, to it.</p>
<p>When you add the thrown property to an improvised weapon, its ranges are 30/90ft. Its damage type is your choice of bludgeoning, piercing, or slashing.</p>
<p>Your damage dice with improvised weapons are equal to the damage type corresponding to your level on the Improv Damage Table. Additionally, you can use either your Strength or Dexterity modifiers to make attack and damage rolls with improvised weapons, using the same modifier for each roll.</p>
<table>
<thead><tr><th colspan="2">Improv Damage</th></tr><tr><th>Level</th><th>Damage Dice</th></tr></thead>
<tbody>
<tr><td>3rd</td><td>1d6</td></tr>
<tr><td>6th</td><td>1d8</td></tr>
<tr><td>11th</td><td>1d10</td></tr>
<tr><td>16th</td><td>1d12</td></tr>
</tbody></table>`,
  "Master of None 3",
);

const breakdown = feat(
  "breakdown", "Breakdown",
  `<p>Also at 3rd level, you can put all your energy into one attack for maximum effect. When you make a successful weapon attack with an improvised weapon, you can choose to double your Strength or Dexterity Modifier for the purposes of calculating damage with that attack.</p>
<p>When you do this, the weapon used is destroyed. This doesn't destroy seastone.</p>`,
  "Master of None 3",
);

const juryRigging = feat(
  "jury-rigging", "Jury-Rigging",
  `<p>Also at 3rd level, you can make the most of you improvised weapons. Once per turn, when you use your Breakdown feature, you can trigger an additional effect. At 7th level, two effects trigger. At 15th level, three effects trigger.</p>
<p>You can use this feature a number of times equal to 1 + your Constitution modifier, regaining all uses on a short or long rest.</p>
<p>When you gain this feature, and at 7th and 15th level, you choose one of the effects below, making that the effect that triggers.</p>
<ul>
<li>All creatures, excluding yourself, within 5 feet of the target must succeed on a Dexterity saving throw or take 1d(Improv Damage Dice Size) piercing damage.</li>
<li>The target's movement speed is reduced to 0 until the start of your next turn.</li>
<li>The target must succeed on a Wisdom saving throw or be unable to take the Attack action on its next turn.</li>
<li>The target is unable to speak for the next minute.</li>
<li>The target cannot regain hit points until the start of your next turn.</li>
<li>The target must succeed on a Constitution saving throw or become stunned until the start of your next turn.</li>
<li>The target must succeed on a Strength saving throw or be knocked back 10 feet, or knocked prone.</li>
<li>The target must succeed on a Wisdom saving throw or be frightened of you until the end of your next turn.</li>
<li>The target must succeed on a Constitution saving throw or be blinded until the start of your next turn.</li>
<li>The target's Armor Class is reduced by 2 until the start of your next turn.</li>
</ul>
<p>If any of these effects requires the target to make a saving throw, the DC is equal to 8 + your Constitution modifier + your proficiency bonus.</p>`,
  "Master of None 3",
);

const wreckResistance = feat(
  "wreck-resistance", "Wreck Resistance",
  `<p>Starting at 7th level, when you make an attack with an improvised weapon, you can ignore any resistance to bludgeoning, piercing, or slashing.</p>
<p>In addition, when you obtain an improvised weapon, instead of adding one weapon property to it, you can add two weapon properties.</p>`,
  "Master of None 7",
);

const inAndOut = feat(
  "in-and-out", "In and Out",
  `<p>Starting at 10th level, when you have less than half of your maximum hit points, your walking speed increases by 15 feet, you don't provoke opportunity attacks, and you gain a +2 bonus to all Saving throws.</p>`,
  "Master of None 10",
);

const rushRampage = feat(
  "rush-rampage", "Rush Rampage",
  `<p>Starting at 15th level, you master quick combat. During the first round of combat, you can make two additional weapon attacks, shoves, or grapples at no action cost, the first of which is made at advantage.</p>`,
  "Master of None 15",
);

const smashAndCrash = feat(
  "smash-and-crash", "Smash and Crash",
  `<p>From 18th level onwards, your attacks grow devastating. Whenever you make an attack and a damage die reads its maximum value, you can choose to roll an additional die and add the new result to the total damage. You can repeat this till you are dealing a maximum of 6 extra damage dice.</p>`,
  "Master of None 18",
);

export const masterOfNone: SubclassItem = {
  _id: generateId(SUB),
  name: "Master of None",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The creative Master of None needs no weapons, only the material world around them. Those trained to master this archetype combine their battle prowess in conjunction with improv skills to break down their opponents, making use of any situation.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "master-of-none",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/improvised-weaponry`) },
        { uuid: fUuid(`${F}/breakdown`) },
        { uuid: fUuid(`${F}/jury-rigging`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/wreck-resistance`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/in-and-out`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/rush-rampage`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/smash-and-crash`) },
      ]),
      createScaleValue(SUB, "improvised-die", "dice", {
        3: { number: 1, faces: 6 },
        6: { number: 1, faces: 8 },
        11: { number: 1, faces: 10 },
        16: { number: 1, faces: 12 },
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
