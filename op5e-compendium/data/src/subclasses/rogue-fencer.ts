import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import { createDAEEffect, overrideValue } from "../../helpers/effects.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/fencer";

function feat(idPath: string, name: string, level: number, description: string, extra: any = {}, effects: any[] = []): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Rogue (Fencer) ${level}`,
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
    effects,
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

export const enGarde = feat(
  "feature/rogue/fencer/en-garde", "En Garde", 3,
  `<p>Starting at 3rd level, when a creature misses you with a melee attack, you can use your reaction to make an opportunity attack against that creature.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "A creature misses you with a melee attack" } },
);

export const duelingDefense = feat(
  "feature/rogue/fencer/dueling-defense", "Dueling Defense", 3,
  `<p>At 3rd level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Intelligence modifier + your Dexterity modifier. Additionally, you add your Intelligence modifier to your initiative rolls.</p>`,
  {},
  [
    createDAEEffect("rogue/fencer/dueling-defense", "Dueling Defense", [
      overrideValue("system.attributes.ac.formula", "10 + @abilities.int.mod + @abilities.dex.mod"),
    ]),
  ],
);

export const masterBladework = feat(
  "feature/rogue/fencer/master-bladework", "Master Bladework", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Disarm (Cost: 1d6).</strong> The target must succeed on a Strength saving throw or drop one weapon it's holding.</li><li><strong>Riposte (Cost: 2d6).</strong> You can immediately make one melee weapon attack against the target as part of dealing your Sneak Attack damage.</li></ul>`,
);

export const agileReflexes = feat(
  "feature/rogue/fencer/agile-reflexes", "Agile Reflexes", 9,
  `<p>At 9th level, when a creature you can see attacks you, you can add your Wisdom modifier to your AC against that attack. You must be able to see the attacker to gain this benefit.</p>`,
);

export const martialMetre = feat(
  "feature/rogue/fencer/martial-metre", "Martial Metre", 13,
  `<p>Starting at 13th level, you can take a second reaction each round. Additionally, when a creature hits you with a melee attack, you can use your reaction to force it to make a Dexterity saving throw (DC = 8 + your proficiency bonus + your Dexterity modifier) or be knocked prone or grappled (your choice).</p>`,
);

export const weaponWeave = feat(
  "feature/rogue/fencer/weapon-weave", "Weapon Weave", 17,
  `<p>At 17th level, you add double your proficiency bonus to melee weapon attack rolls instead of your normal proficiency bonus.</p>`,
);

export const features: FeatureItem[] = [
  enGarde, duelingDefense, masterBladework, agileReflexes, martialMetre, weaponWeave,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Fencer",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The Fencer is a master of elegant swordplay, relying on precision, agility, and intellect to outmaneuver opponents in melee combat.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "fencer",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(enGarde) }, { uuid: fUuid(duelingDefense) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(masterBladework) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(agileReflexes) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(martialMetre) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(weaponWeave) }]),
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
