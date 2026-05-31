import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/battlemaster";
const F = "feature/fighter/battlemaster";

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

const superiorCombatant = feat(
  "superior-combatant", "Superior Combatant",
  `<p>When you choose this archetype at 3rd level, you learn maneuvers that are fueled by special dice called superiority dice.</p>
<p><strong>Maneuvers.</strong> You learn three maneuvers of your choice. You learn two additional maneuvers at 7th, 10th, and 15th level. Each time you learn new maneuvers, you can also replace one maneuver you know with a different one.</p>
<p><strong>Superiority Dice.</strong> You have four superiority dice, which are d8s. A superiority die is expended when you use it. You regain all expended superiority dice when you finish a short or long rest. You gain another superiority die at 7th level and one more at 15th level.</p>
<p><strong>Saving Throws.</strong> Some maneuvers require your target to make a saving throw. The DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice).</p>`,
  "Battlemaster 3",
);

const studentOfWar = feat(
  "student-of-war", "Student of War",
  `<p>At 3rd level, you gain proficiency with one type of artisan's tools of your choice.</p>`,
  "Battlemaster 3",
);

const advancedCombatTactics = feat(
  "advanced-combat-tactics", "Advanced Combat Tactics",
  `<p>Starting at 7th level, you can add your Wisdom modifier to your initiative rolls.</p>
<p>Additionally, you learn two additional maneuvers and gain one additional superiority die.</p>`,
  "Battlemaster 7",
);

const improvedSuperiorCombatant = feat(
  "improved-superior-combatant", "Improved Superior Combatant",
  `<p>At 10th level, your superiority dice turn into d10s. At 18th level, they turn into d12s.</p>
<p>Additionally, you learn two additional maneuvers.</p>`,
  "Battlemaster 10",
);

const relentlessCombatant = feat(
  "relentless-combatant", "Relentless Combatant",
  `<p>Starting at 15th level, when you roll initiative and have no superiority dice remaining, you can use a bonus action to regain all of your expended superiority dice. Once you use this feature, you can't do so again until you finish a long rest.</p>
<p>Additionally, you learn two additional maneuvers and gain one additional superiority die.</p>`,
  "Battlemaster 15",
);

const signatureStrike = feat(
  "signature-strike", "Signature Strike",
  `<p>At 18th level, choose one maneuver you know. You can use that maneuver once on each of your turns without expending a superiority die. Your superiority dice also become d12s if they haven't already.</p>`,
  "Battlemaster 18",
);

export const battlemaster: SubclassItem = {
  _id: generateId(SUB),
  name: "Battlemaster",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>Those who emulate the Battlemaster employ martial techniques passed down through generations. A Battlemaster uses superior tactics and maneuvers to overcome foes on the battlefield.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "battlemaster",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/superior-combatant`) },
        { uuid: fUuid(`${F}/student-of-war`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/advanced-combat-tactics`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/improved-superior-combatant`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/relentless-combatant`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/signature-strike`) },
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

export const battlemasterFeatures: FeatureItem[] = [
  superiorCombatant,
  studentOfWar,
  advancedCombatTactics,
  improvedSuperiorCombatant,
  relentlessCombatant,
  signatureStrike,
];
