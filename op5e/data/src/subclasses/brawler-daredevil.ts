import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/daredevil";

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
      requirements: `Brawler (Daredevil) ${level}`,
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

export const powerStrike = feat(
  "feature/brawler/daredevil/power-strike", "Power Strike", 3,
  `<p>Starting at 3rd level, when you make an unarmed strike as part of the Attack action, you can choose to not add your proficiency bonus to the attack roll. You gain a bonus to the damage roll equal to twice your proficiency bonus.</p>`,
);

export const rampagingVigor = feat(
  "feature/brawler/daredevil/rampaging-vigor", "Rampaging Vigor", 3,
  `<p>Also at 3rd level, your daring march into the battlefield fuels you with each enemy you take down. When you reduce a creature to 0 hit points using an unarmed strike, you gain temporary hit points equal to your Wisdom modifier + your brawler level (minimum of 1).</p>`,
);

export const toughAsNails = feat(
  "feature/brawler/daredevil/tough-as-nails", "Tough As Nails", 6,
  `<p>Starting at 6th level, your spirit makes you extremely tough. You can use your reaction to being hit by a melee attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your brawler level. If you reduce the damage to 0, you can make an unarmed strike as part of this reaction against the creature.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Hit by a melee attack" },
  },
);

export const insurmountableSpirit = feat(
  "feature/brawler/daredevil/insurmountable-spirit", "Insurmountable Spirit", 11,
  `<p>At 11th level, you cannot be brought down. When you are reduced to 0 hit points, you can expend 1 spirit point (no action required) to have 1 hit point instead.</p>`,
);

export const finishingBlow = feat(
  "feature/brawler/daredevil/finishing-blow", "Finishing Blow", 17,
  `<p>At 17th level, you can make a single, devastating strike. When you hit with an unarmed strike, you can expend a number of spirit points up to your brawler level. For each spirit point you spend, you add one additional brawler die to the damage. If you spend five or more spirit points, you additionally add your brawler level to the amount of damage done.</p>`,
);

export const features: FeatureItem[] = [
  powerStrike, rampagingVigor, toughAsNails, insurmountableSpirit, finishingBlow,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Daredevil",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Daredevils are brawlers that go into a fight seemingly without a plan and fight with complete abandon. However, while they may look unprofessional and unrefined, a daredevil is defined by the purpose for which they fight. Few enemies make for scarier opponents than a daredevil with everything to lose.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "daredevil",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(powerStrike) }, { uuid: fUuid(rampagingVigor) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(toughAsNails) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(insurmountableSpirit) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(finishingBlow) }]),
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
