import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, createTrait, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/cavalier";
const F = "feature/fighter/cavalier";

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

const saddleBorn = feat(
  "saddle-born", "Saddle-Born",
  `<h4>Bonus Proficiency</h4>
<p>When you choose this subclass at 3rd level, you gain proficiency in one of the following skills of your choice: Animal Handling, History, Insight, Performance, or Persuasion.</p>
<h4>Saddle-Born</h4>
<p>Starting at 3rd level, your mastery as a rider becomes apparent. You have advantage on saving throws made to avoid falling off your mount. If you fall off your mount and descend no more than 10 feet, you can land on your feet if you're not incapacitated.</p>
<p>Finally, mounting or dismounting a creature costs you only 5 feet of movement, rather than half your speed.</p>`,
  "Cavalier 3",
);

const makeYourMark = feat(
  "make-your-mark", "Make Your Mark",
  `<p>Starting at 3rd level, you can menace your foes. When you hit a creature with a melee weapon attack, you can mark the creature until the end of your next turn. This effect ends early if you are incapacitated or you die.</p>
<p>While it is within your reach, a creature marked by you has disadvantage on any attack roll that doesn't target you.</p>
<p>In addition, if a creature marked by you deals damage to anyone other than you, you can make a special melee weapon attack against the marked creature as a bonus action on your next turn. You have advantage on the attack roll, and if it hits, the attack's weapon deals extra damage to the target equal to half your fighter level.</p>`,
  "Cavalier 3",
);

const wardingMaster = feat(
  "warding-master", "Warding Master",
  `<p>At 7th level, you learn to fend off strikes directed at you, your mount, or other creatures nearby (can include yourself). If you or a creature you can see within 5 feet of you is hit by an attack, you can roll 1d8 as a reaction if you're wielding a melee weapon or a shield. Roll the die, and add the number rolled to the target's AC against that attack. If the attack still hits, the target has resistance against the attack's damage.</p>
<p>In addition, you learn the Find Mount creation at 2nd level, and can use it as a routine for 10 minutes.</p>`,
  "Cavalier 7",
);

const holdTheLine = feat(
  "hold-the-line", "Hold the Line",
  `<p>At 10th level, you become a master of locking down your enemies. Creatures provoke an opportunity attack from you when they move 5 feet or more while within your reach, and if you hit a creature with an opportunity attack, the target's speed is reduced to 0 until the end of the current turn. If the creature disengages, you can still make an opportunity attack against them.</p>
<p>In addition, when you use the Find Mount creation, you use it at a level equal to your proficiency bonus.</p>`,
  "Cavalier 10",
);

const ferociousCharger = feat(
  "ferocious-charger", "Ferocious Charger",
  `<p>Starting at 15th level, you can run down your foes. If you move at least 10 feet in a straight line right before attacking a creature and you hit it with the attack, that target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + your Strength modifier) or be knocked prone. You can use this feature only once on each of your turns.</p>
<p>Additionally, if you are mounted, and use this ability, you deal an extra amount of damage equal to your level.</p>`,
  "Cavalier 15",
);

const vigilantDefender = feat(
  "vigilant-defender", "Vigilant Defender",
  `<p>Starting at 18th level, you respond to danger with extraordinary vigilance. In combat, you get a special reaction that you can take once on every creature's turn, except your turn. You can use this special reaction only to make an opportunity attack or use your Warding Master feature, and you can't use it on the same turn that you take your normal reaction.</p>`,
  "Cavalier 18",
);

export const cavalier: SubclassItem = {
  _id: generateId(SUB),
  name: "Cavalier",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The cavalier is a fighter who excels at mounted combat. Cavaliers learn how to guard those in their charge from harm, often serving as the protectors of their superiors and of the weak. These types of fighters often come from backgrounds of nobility, but had to leave their noble lives behind to pursue a life of adventure.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "cavalier",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createTrait(SUB, 3, { mode: "default", grants: [], choices: [{ count: 1, pool: ["skills:ani","skills:his","skills:ins","skills:prf","skills:per"] }] }, "bonus-proficiency"),
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/saddle-born`) },
        { uuid: fUuid(`${F}/make-your-mark`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/warding-master`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/hold-the-line`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/ferocious-charger`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/vigilant-defender`) },
      ]),
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

export const cavalierFeatures: FeatureItem[] = [
  saddleBorn,
  makeYourMark,
  wardingMaster,
  holdTheLine,
  ferociousCharger,
  vigilantDefender,
];
