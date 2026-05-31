import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/open-hand";

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
      requirements: `Brawler (Open Hand) ${level}`,
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

export const palmStrikes = feat(
  "feature/brawler/open-hand/palm-strikes", "Palm Strikes", 3,
  `<p>Starting when you choose this style at 3rd level, you can manipulate your enemy's spirit when you harness your own. Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects on that target:</p>
<ul>
<li>It must succeed on a Dexterity saving throw or be knocked prone.</li>
<li>It must make a Strength saving throw. If it fails, you can push it up to 15 feet away from you.</li>
<li>It can't take reactions until the end of your next turn.</li>
</ul>`,
);

export const purityOfTheBody = feat(
  "feature/brawler/open-hand/purity-of-the-body", "Purity of the Body", 6,
  `<p>At 6th level, your training has granted you the ability to resist any debilitating ailment. You become immune to all poisons and diseases, and the poisoned condition.</p>`,
);

export const tranquility = feat(
  "feature/brawler/open-hand/tranquility", "Tranquility", 11,
  `<p>Beginning at 11th level, you can enter a special meditation that surrounds you with an aura of peace. At the end of a long rest, you gain the effect of a Sanctuary creation that lasts until the start of your next long rest (the creation can end early as normal). The saving throw DC for the creation equals 8 + your Wisdom modifier + your proficiency bonus.</p>`,
);

export const theOpenHand = feat(
  "feature/brawler/open-hand/the-open-hand", "The Open Hand", 17,
  `<p>At 17th level, you gain the ability to set up lethal vibrations in someone's body. When you hit a creature with an unarmed strike, you can spend 3 spirit points to start these imperceptible vibrations, which last for a number of days equal to your brawler level. The vibrations are harmless unless you use your action to end them.</p>
<p>When you use this action, the creature must make a Constitution saving throw. If it fails, it is reduced to 0 hit points. If it succeeds, it takes 10d10 necrotic damage.</p>
<p>You can have only one creature under the effect of this feature at a time. You can choose to end the vibrations harmlessly without using an action.</p>`,
  {
    save: { ability: "con", dc: null, scaling: "wis" },
    damage: { parts: [["10d10", "necrotic"]], versatile: "" },
  },
);

export const features: FeatureItem[] = [
  palmStrikes, purityOfTheBody, tranquility, theOpenHand,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Open Hand",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Brawlers who follow the philosophies and techniques of the Open Hand focus on martial arts and inner harmony to best their enemies. Classically trained, their mastery over martial arts renders them as an unstoppable and tranquil flurry.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "open-hand",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(palmStrikes) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(purityOfTheBody) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(tranquility) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(theOpenHand) }]),
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
