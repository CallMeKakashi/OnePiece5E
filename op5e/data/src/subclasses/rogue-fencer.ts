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
  `<p>When you choose this archetype at 3rd level, you have learned that an opponent is always off-guard when they miss. When an enemy within range of your weapon attack misses an attack or creation, regardless of their target, you can use your reaction to make an opportunity attack with a melee weapon against it.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "An enemy within range of your weapon attack misses an attack or creation, regardless of its target" } },
);

export const duelingDefense = feat(
  "feature/rogue/fencer/dueling-defense", "Dueling Defense", 3,
  `<p>At 3rd level, your practice of fencing gives you an elegant speed for avoiding most attacks. While not wearing armor or using a shield, your AC is equal to 10 + Intelligence modifier + Dexterity modifier.</p><p>In addition, you can add your Intelligence modifier to your initiative.</p>`,
  {},
  [
    createDAEEffect("rogue/fencer/dueling-defense", "Dueling Defense", [
      overrideValue("system.attributes.ac.formula", "10 + @abilities.int.mod + @abilities.dex.mod"),
    ]),
  ],
);

export const masterBladework = feat(
  "feature/rogue/fencer/master-bladework", "Master Bladework", 6,
  `<p>Starting at 6th level, with a mix of finesse and intuition, you can overwhelm your opponent. The following effects are added to your Devious Strike options.</p><p><strong>Disarm (Cost: 2d6).</strong> The target must make a Strength saving throw. On a failed save, it drops a held object of your choice. The object lands at its feet.</p><p><strong>Guard Break (Cost: 3d6).</strong> The target must make a Dexterity saving throw. On a failed save, you disrupt your opponent's defenses. Until the start of your next turn, their AC is reduced by 2.</p>`,
);

export const agileReflexes = feat(
  "feature/rogue/fencer/agile-reflexes", "Agile Reflexes", 9,
  `<p>Through your cunning and combat experience, at 9th level, you become able to read your foes' movements. When a creature hits you with an attack, you gain a bonus to AC equal to your Wisdom Modifier against all subsequent attacks made by that creature for the rest of the turn.</p>`,
);

export const martialMetre = feat(
  "feature/rogue/fencer/martial-metre", "Martial Metre", 13,
  `<p>Starting at 13th level, you have trained yourself to match the timing and tempo of all things, granting you the ability to react faster than normal.</p><p>You gain a second reaction, this reaction can only be used for Uncanny Dodge. You regain this reaction at the start of each of your turns.</p><p>Additionally, whenever you are knocked prone or grappled, you can make a Dexterity saving throw, DC 15 to avoid being knocked prone or grappled on a success.</p>`,
);

export const weaponWeave = feat(
  "feature/rogue/fencer/weapon-weave", "Weapon Weave", 17,
  `<p>At 17th level, your attacks are so precise that you can slip through even the toughest armor with ease, and pierce even the most lofty of foes. Your melee weapon attack rolls add double your proficiency bonus, rather than once.</p>`,
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
    description: { value: `<p>Very few are faster and more precise in combat than the adept fencer. Your expertise in dodging, parrying, and lunging make you essentially a blur of metal to your opponent. Many fencers make the most of their dexterity to avoid any unfavorable attack, move with great acrobatic expertise, and are able to strike through even the toughest of armor.</p>`, chat: "" },
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
