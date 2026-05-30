import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/bruiser";

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
      requirements: `Rogue (Bruiser) ${level}`,
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

export const hiredThug = feat(
  "feature/rogue/bruiser/hired-thug", "Hired Thug", 3,
  `<p>When you choose this archetype at 3rd level, you gain proficiency in Intimidation and Athletics if you don't already have them.</p>`,
);

export const armedAndDangerous = feat(
  "feature/rogue/bruiser/armed-and-dangerous", "Armed and Dangerous", 3,
  `<p>At 3rd level, you gain proficiency with medium armor and martial weapons. You can use Strength instead of Dexterity for Sneak Attack when attacking a creature that is grappled or deafened.</p>`,
);

export const streetRules = feat(
  "feature/rogue/bruiser/street-rules", "Street Rules", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Pummel (Cost: 1d6).</strong> The target must succeed on a Strength saving throw or drop one item it's holding of your choice.</li><li><strong>Shove (Cost: 1d6).</strong> The target must succeed on a Strength saving throw or be pushed up to 15 feet away from you.</li></ul>`,
);

export const hardKnocks = feat(
  "feature/rogue/bruiser/hard-knocks", "Hard Knocks", 9,
  `<p>At 9th level, you gain the Extra Attack feature—you can attack twice instead of once whenever you take the Attack action on your turn. Additionally, when you use Uncanny Dodge, you reduce the damage by an amount equal to your Rogue level instead of halving it if that reduction would be greater.</p>`,
  { chatFlavor: "Attack action attacks: 2" },
);

export const bullyBlitz = feat(
  "feature/rogue/bruiser/bully-blitz", "Bully Blitz", 13,
  `<p>At 13th level, your Street Rules devious strikes improve:</p><ul><li><strong>Pummel:</strong> On a failure, the target also takes additional bludgeoning damage equal to your proficiency bonus.</li><li><strong>Shove:</strong> The distance increases to 25 feet, and if pushed into a wall or obstacle the target takes 2d6 bludgeoning damage.</li></ul>`,
);

export const toughCustomer = feat(
  "feature/rogue/bruiser/tough-customer", "Tough Customer", 17,
  `<p>At 17th level, when you use Uncanny Dodge, you can choose to negate all the damage from the triggering attack instead of reducing it. Once you use this feature, you can't do so again until you finish a short or long rest.</p>`,
  { uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const features: FeatureItem[] = [
  hiredThug, armedAndDangerous, streetRules, hardKnocks, bullyBlitz, toughCustomer,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Bruiser",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Some rogues rely on brute strength and intimidation rather than subtlety. The Bruiser is a street-hardened enforcer who mixes dirty fighting with raw power.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "bruiser",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(hiredThug) }, { uuid: fUuid(armedAndDangerous) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(streetRules) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(hardKnocks) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(bullyBlitz) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(toughCustomer) }]),
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
