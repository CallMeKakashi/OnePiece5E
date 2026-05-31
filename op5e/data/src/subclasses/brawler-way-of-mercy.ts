import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/way-of-mercy";

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
      requirements: `Brawler (Way of Mercy) ${level}`,
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

export const medicalMercy = feat(
  "feature/brawler/way-of-mercy/medical-mercy", "Medical Mercy", 3,
  `<p>When you choose this tradition at 3rd level, you gain proficiency in the Insight and Medicine skills, and you gain proficiency with the herbalism kit. If you were already proficient in one of these skills, you gain expertise in that skill.</p>`,
);

export const handOfHealing = feat(
  "feature/brawler/way-of-mercy/hand-of-healing", "Hand of Healing", 3,
  `<p>At 3rd level, your touch can mend wounds. As an action, you can touch a creature and restore a number of hit points equal to a roll of your Brawler die + your Wisdom modifier.</p>
<p>You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a short or long rest. If you have no more uses remaining, you can instead spend 1 spirit point to use the feature.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    target: { value: 1, width: null, units: "", type: "creature" },
    range: { value: null, long: null, units: "touch" },
    uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    actionType: "heal",
    damage: { parts: [["@scale.brawler.brawling-die + @mod", "healing"]], versatile: "" },
  },
);

export const handOfHarm = feat(
  "feature/brawler/way-of-mercy/hand-of-harm", "Hand of Harm", 3,
  `<p>At 3rd level, you use your spirit to inflict wounds. When you hit a creature with an unarmed strike, you can deal extra necrotic damage equal to one roll of your Brawler die + your Wisdom modifier.</p>
<p>You can use this feature a number of times equal to your proficiency bonus, regaining all uses at the end of a short or long rest. If you have no more uses remaining, you can instead spend 1 spirit point to use the feature.</p>`,
  {
    uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    damage: { parts: [["@scale.brawler.brawling-die + @mod", "necrotic"]], versatile: "" },
  },
);

export const physiciansMercy = feat(
  "feature/brawler/way-of-mercy/physicians-mercy", "Physician's Mercy", 6,
  `<p>Starting at 6th level, you can cause even greater cures with just a single touch, and if necessary, cause devastating harm.</p>
<p>When you use Hand of Healing on a creature, you can also end one disease or one of the following conditions: blinded, deafened, paralyzed, poisoned, or stunned. When you use Hand of Harm on a creature, you can subject that creature to one of the following conditions: blinded, deafened, or poisoned until the end of your next turn.</p>
<p>In addition, you gain proficiency in Constitution saving throws, and gain resistance to necrotic damage.</p>`,
);

export const graciousMercy = feat(
  "feature/brawler/way-of-mercy/gracious-mercy", "Gracious Mercy", 11,
  `<p>Starting at 11th level, your mastery of life and death opens the door to a greater mercy. As an action, you can touch the corpse of a creature that died within the past 24 hours and expend 5 spirit points. The creature then returns to life, regaining 50 hit points. If the creature died while subject to any of the following conditions, it revives with them removed: blinded, deafened, paralyzed, poisoned, and stunned.</p>
<p>Once you use this feature, you can't use it again until you finish a short or long rest.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    range: { value: null, long: null, units: "touch" },
    uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true },
  },
);

export const ultimateMercy = feat(
  "feature/brawler/way-of-mercy/ultimate-mercy", "Ultimate Mercy", 17,
  `<p>By 17th level, you have completely mastered the forces of life and death. You gain the following benefits:</p>
<ul>
<li>When you use your Hand of Healing and your Hand of Harm features, you can roll two of your martial arts dice + your Wisdom modifier instead of one.</li>
<li>When you use your Hand of Healing feature, you can also cure a level of exhaustion, the petrified condition, or remove a curse as if you had cast the Greater Restoration creation.</li>
<li>You will no longer die of old age.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  medicalMercy, handOfHealing, handOfHarm, physiciansMercy, graciousMercy, ultimateMercy,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Way of Mercy",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Those who follow the Way of Mercy are often doctors who have studied intensely in medicine, allowing them to manipulate the very forces of life and death for both the needs to harm and heal.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "way-of-mercy",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(medicalMercy) }, { uuid: fUuid(handOfHealing) }, { uuid: fUuid(handOfHarm) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(physiciansMercy) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(graciousMercy) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(ultimateMercy) }]),
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
