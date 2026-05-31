import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/swashbuckler";

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
      requirements: `Rogue (Swashbuckler) ${level}`,
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

export const fancyFootwork = feat(
  "feature/rogue/swashbuckler/fancy-footwork", "Fancy Footwork", 3,
  `<p>When you choose this archetype at 3rd level, during your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn.</p>`,
);

export const rakishAudacity = feat(
  "feature/rogue/swashbuckler/rakish-audacity", "Rakish Audacity", 3,
  `<p>Starting at 3rd level, you add your Charisma modifier to your initiative rolls. In addition, you don't need advantage on your attack roll to use your Sneak Attack if no creature other than your target is within 5 feet of you. All the other rules for the Sneak Attack class feature still apply.</p>`,
);

export const slipperyDevil = feat(
  "feature/rogue/swashbuckler/slippery-devil", "Slippery Devil", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Taunt (Cost: 1d6).</strong> The target must succeed on a Wisdom saving throw or have disadvantage on attack rolls against creatures other than you until the end of your next turn.</li><li><strong>Feint (Cost: 1d6).</strong> You have advantage on your next attack roll against the target this turn.</li></ul>`,
);

export const panache = feat(
  "feature/rogue/swashbuckler/panache", "Panache", 9,
  `<p>At 9th level, as an action, you can make a Charisma (Persuasion) check contested by a creature's Wisdom (Insight) check. If you succeed and the creature is hostile, it has disadvantage on attack rolls against targets other than you and can't make opportunity attacks against targets other than you for 1 minute or until an ally damages it. If the creature is not hostile, it is charmed by you for 1 minute or until you or your allies do anything harmful to it.</p>`,
  { activation: { type: "action", cost: 1, condition: "" } },
);

export const elegantManeuver = feat(
  "feature/rogue/swashbuckler/elegant-maneuver", "Elegant Maneuver", 13,
  `<p>Starting at 13th level, you can use a bonus action on your turn to gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check you make during the same turn.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "" } },
);

export const masterDuelist = feat(
  "feature/rogue/swashbuckler/master-duelist", "Master Duelist", 17,
  `<p>Beginning at 17th level, if you miss with an attack roll, you can roll it again with advantage. Once you use this feature, you can't do so again until you finish a short or long rest.</p>`,
  { uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const features: FeatureItem[] = [
  fancyFootwork, rakishAudacity, slipperyDevil, panache, elegantManeuver, masterDuelist,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Swashbuckler",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>You focus your training on the art of the blade, relying on speed, elegance, and charm in equal parts. While some warriors are brutes clad in heavy armor, your method of fighting looks almost like a performance.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "swashbuckler",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(fancyFootwork) }, { uuid: fUuid(rakishAudacity) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(slipperyDevil) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(panache) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(elegantManeuver) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(masterDuelist) }]),
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
