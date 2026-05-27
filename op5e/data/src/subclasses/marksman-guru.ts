import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/marksman/guru";

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
      requirements: `Marksman (Guru) ${level}`,
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

export const guruCreations = feat(
  "feature/marksman/guru/guru-creations", "Guru Creations", 3,
  `<p>Starting at 3rd level, you gain the following bonus creations at specific marksman levels. They count as marksman creations for you, but don't count towards the number of marksman creations you can prepare.</p>
<ul>
<li><strong>3rd:</strong> Healing Word, Detect Poison and Disease (R)</li>
<li><strong>5th:</strong> Aid, Lesser Restoration</li>
<li><strong>9th:</strong> Aura of Vitality, Revivify</li>
<li><strong>13th:</strong> Aura of Life, Death Ward</li>
<li><strong>17th:</strong> Mass Cure Wounds, Raise Dead</li>
</ul>`,
);

export const naturesWay = feat(
  "feature/marksman/guru/natures-way", "Nature's Way", 3,
  `<p>At 3rd level, your mastery of medicine shines through. You gain proficiency in Wisdom (Medicine) checks and Herbalism tools, or expertise if you were already proficient in each respectively.</p>
<p>In addition, the time and cost it takes for you to craft medicines and poisons are halved.</p>`,
);

export const mendingMark = feat(
  "feature/marksman/guru/mending-mark", "Mending Mark", 3,
  `<p>At 3rd level, you can expend a use of your Favored Mark feature to instead place a Mending Mark on the target for 1 hour, or until you use this feature on another creature.</p>
<p>While a creature has this mark, any creation you use on the creature that restores hit points heals an additional amount of hit points equal to one roll of your Favored Mark die.</p>
<p>In addition, choose Strength, Dexterity, or Constitution. The creature has advantage on saving throws made with the chosen ability for the duration.</p>
<p>Furthermore, you can cast any Marksman creation that doesn't have a range of self onto the marked creature, regardless of range.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 1, units: "hour" },
  },
);

export const practicedKnowledge = feat(
  "feature/marksman/guru/practiced-knowledge", "Practiced Knowledge", 7,
  `<p>By 7th level, when you take the Attack action on your turn, you can use a trick in place of one of the attacks.</p>
<p>In addition, you can use the Lesser Restoration creation without expending a creation slot a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</p>`,
  {
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const restoringVolley = feat(
  "feature/marksman/guru/restoring-volley", "Restoring Volley", 11,
  `<p>At 11th level, when you use a creation to restore a creature's hit points, you can additionally target each creature of your choice within 10 feet of the target.</p>
<p>You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a long rest.</p>`,
  {
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const trueMastery = feat(
  "feature/marksman/guru/true-mastery", "True Mastery", 15,
  `<p>Starting at 15th level, when you use your Mending Mark feature, you can target two additional creatures within 30 ft of the first creature to also gain the benefits as part of the same usage.</p>`,
);

export const features: FeatureItem[] = [
  guruCreations, naturesWay, mendingMark, practicedKnowledge, restoringVolley, trueMastery,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Guru",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>One with the natural world, the peaceful Guru has spent years as a healer, making it their mission to mend the world with their natural medicines. Unlike other marksmen, Gurus utilize their wisdom and precision to cure wounds, rather than cause them.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "guru",
    classIdentifier: "marksman",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(guruCreations) }, { uuid: fUuid(naturesWay) }, { uuid: fUuid(mendingMark) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(practicedKnowledge) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(restoringVolley) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(trueMastery) }]),
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
