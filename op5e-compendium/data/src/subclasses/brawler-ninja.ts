import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/ninja";

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
      requirements: `Brawler (Ninja) ${level}`,
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

export const bonusProficiencies = feat(
  "feature/brawler/ninja/bonus-proficiencies", "Bonus Proficiencies", 3,
  `<p>At 3rd level, you gain proficiency with katanas and longbows, and they count as brawler weapons for you. Additionally, you gain proficiency in Stealth (Dexterity) checks, unless you were already proficient, instead gaining expertise.</p>`,
);

export const ninjaArts = feat(
  "feature/brawler/ninja/ninja-arts", "Ninja Arts", 3,
  `<p>At 3rd level, you can use your spirit to replicate the effects of certain creations. As an action, you can spend 2 spirit points to use one of the following creations: Darkness, Darkvision, Pass Without a Trace, Silence, Fog Cloud, Disguise, and Invisibility without providing material components.</p>
<p>Additionally, you gain the Temporary Trick trick if you don't already know it. All of these creations use your Spirit DC.</p>
<p>Furthermore, as a bonus action, you can take the Hide or Search action.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
  },
);

export const vanishingStep = feat(
  "feature/brawler/ninja/vanishing-step", "Vanishing Step", 6,
  `<p>At 6th level, you gain the ability to cross vast distances while hidden. While you are successfully hidden, as a bonus action you can teleport up to 60 feet to an unoccupied space you can see. You then have advantage on the first melee attack you make before the end of the turn.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "While hidden" },
    range: { value: 60, long: null, units: "ft" },
  },
);

export const paralysisJutsu = feat(
  "feature/brawler/ninja/paralysis-jutsu", "Paralysis Jutsu", 11,
  `<p>At 11th level, you gain the ability to lock a target in a paralyzing technique. When you hit another creature with a melee weapon attack, you can spend 3 spirit points to paralyze them. The target must succeed on a Constitution saving throw against your Spirit DC or be paralyzed until the end of your next turn.</p>`,
  {
    save: { ability: "con", dc: null, scaling: "wis" },
  },
);

export const reclaimedSpirit = feat(
  "feature/brawler/ninja/reclaimed-spirit", "Reclaimed Spirit", 17,
  `<p>At 17th level, your training allows you to continue performing your techniques as long as your enemies lay defeated. When a hostile creature within 10 feet of you is reduced to 0 hit points, you can use your reaction to regain a number of spirit points equal to your Wisdom modifier (minimum 1).</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Hostile creature within 10 ft reduced to 0 HP" },
  },
);

export const features: FeatureItem[] = [
  bonusProficiencies, ninjaArts, vanishingStep, paralysisJutsu, reclaimedSpirit,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Ninja",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Ninjas are the legendary shadow warriors of Wano. Officially known as the Oniwabanshu, they are the eyes and ears of Wano's shogun. Renowned for their stealth and tricks.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "ninja",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(bonusProficiencies) }, { uuid: fUuid(ninjaArts) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(vanishingStep) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(paralysisJutsu) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(reclaimedSpirit) }]),
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
