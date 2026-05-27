import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

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
  `<p>Starting at 3rd level, you have advantage on saving throws made to avoid falling off your mount. If you fall off your mount and descend no more than 10 feet, you can land on your feet if you're not incapacitated.</p>
<p>Additionally, mounting or dismounting a creature costs you only 5 feet of movement, rather than half your speed.</p>`,
  "Cavalier 3",
);

const makeYourMark = feat(
  "make-your-mark", "Make Your Mark",
  `<p>At 3rd level, when you hit a creature with a weapon attack, you can mark that creature until the end of your next turn. A marked creature has disadvantage on any attack roll that doesn't target you. If a creature marked by you deals damage to anyone other than you, you can make a special melee weapon attack against the marked creature as a bonus action on your next turn. You have advantage on the attack roll, and if it hits, the attack's weapon deals extra damage to the target equal to half your fighter level (rounded up).</p>
<p>Regardless of the number of creatures you mark, you can make this special attack a number of times equal to your Strength modifier (minimum of once), and you regain all expended uses when you finish a long rest.</p>`,
  "Cavalier 3",
);

const wardingMaster = feat(
  "warding-master", "Warding Master",
  `<p>At 7th level, if a creature within 5 feet of you is hit by an attack, you can use your reaction to add 1d8 to the target's AC against that attack, potentially causing the attack to miss. You must be wielding a melee weapon or a shield to use this feature.</p>`,
  "Cavalier 7",
);

const holdTheLine = feat(
  "hold-the-line", "Hold the Line",
  `<p>At 10th level, creatures provoke an opportunity attack from you when they move 5 feet or more while within your reach, and if you hit a creature with an opportunity attack, the target's speed is reduced to 0 until the end of the current turn.</p>`,
  "Cavalier 10",
);

const ferociousCharger = feat(
  "ferocious-charger", "Ferocious Charger",
  `<p>Starting at 15th level, you can run down your foes, whether you're mounted or not. If you move at least 10 feet in a straight line right before attacking a creature and you hit it with the attack, that target must succeed on a Strength saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or be knocked prone. You can use this feature only once per turn.</p>`,
  "Cavalier 15",
);

const vigilantDefender = feat(
  "vigilant-defender", "Vigilant Defender",
  `<p>Starting at 18th level, you respond to danger with extraordinary vigilance. In combat, you get a special reaction that you can take once on every creature's turn, except your own. You can use this special reaction only to make an opportunity attack, and you can't use it on the same turn that you take your normal reaction.</p>`,
  "Cavalier 18",
);

export const cavalier: SubclassItem = {
  _id: generateId(SUB),
  name: "Cavalier",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>The archetypal Cavalier excels at mounted combat. Usually born among the nobility and raised at court, a Cavalier is equally at home leading a cavalry charge or exchanging repartee at a state dinner.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "cavalier",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
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
