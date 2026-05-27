import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/okama-kenpo";

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
      requirements: `Brawler (Okama Kenpo) ${level}`,
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

export const okamaWay = feat(
  "feature/brawler/okama-kenpo/okama-way", "Okama Way", 3,
  `<p>Beginning at 3rd level, you gain proficiency with the disguise kit, and may double your proficiency bonus for any tool ability check you make with the kit. You also gain proficiency in the Performance skill.</p>
<p>Additionally, you may use your Charisma score in place of your Wisdom score for all your Brawler abilities, including Unarmored Defense, Spirit Save DC, and more.</p>`,
);

export const swanDance = feat(
  "feature/brawler/okama-kenpo/swan-dance", "Swan Dance", 3,
  `<p>Also at 3rd level, you learn how to conceal immeasurable strength beneath the veneer of a distracting dance.</p>
<p>As a bonus action on your turn, you can force a creature to make a Wisdom (Insight) check contested by your Charisma (Performance) check. On a successful check, you have advantage on all weapon attacks against the target until the end of your turn.</p>
<p>Additionally, you can immediately make an unarmed strike against the creature as part of the same bonus action.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
  },
);

export const aestheticWeaponry = feat(
  "feature/brawler/okama-kenpo/aesthetic-weaponry", "Aesthetic Weaponry", 6,
  `<p>At 6th level, you learn how to make weapons sync up with your make-up, hair, and outfit, where they become a lot more potent. By taking 10 minutes, you can assign a number of weapons on your person equal to twice your proficiency bonus, incorporating them into your outfit or make-up as nails, earrings, hairpins, or other accessories. These weapons are now considered brawler weapons for you.</p>
<p>If you successfully perform the Swan Dance ability, all of your aesthetic weapons deal extra damage equal to half of your proficiency bonus (rounded up) if you do hit.</p>`,
);

export const elegantCombination = feat(
  "feature/brawler/okama-kenpo/elegant-combination", "Elegant Combination", 11,
  `<p>At 11th level, you learn a potent combination attack that ends with an explosive finish.</p>
<p>When you use your Flurry of Blows and hit with both attacks, you can make one additional unarmed strike as part of the same action. If this additional attack hits, the target must make a Strength saving throw. On a failed save, you decide whether the creature is knocked prone or pushed 15 feet away from you.</p>
<p>Alternatively, you can forgo the additional attack and move 5 &times; your proficiency bonus feet with opportunity attacks against you at disadvantage.</p>`,
  {
    save: { ability: "str", dc: null, scaling: "wis" },
  },
);

export const grandFinale = feat(
  "feature/brawler/okama-kenpo/grand-finale", "Grand Finale", 17,
  `<p>At 17th level, you know that the final act must leave the audience awestruck and at a loss for words, while also having your enemies be struck into next week.</p>
<p>Your Elegant Combination special attack now always scores a critical hit on a successful hit.</p>`,
);

export const features: FeatureItem[] = [
  okamaWay, swanDance, aestheticWeaponry, elegantCombination, grandFinale,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Okama Kenpo",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Okama Kenpo is a kick-focused martial art inspired by dance routines, such as ballet, developed by the inhabitants of the Kamabakka kingdom. While most of its practitioners are okama, that is not a requirement to master it.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "okama-kenpo",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(okamaWay) }, { uuid: fUuid(swanDance) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(aestheticWeaponry) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(elegantCombination) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(grandFinale) }]),
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
