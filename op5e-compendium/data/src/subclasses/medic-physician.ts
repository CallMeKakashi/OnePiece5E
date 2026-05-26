import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import { createDAEEffect, overrideValue } from "../../helpers/effects.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/medic/physician";

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
      requirements: `Medic (Physician) ${level}`,
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

export const healersTouch = feat(
  "feature/medic/physician/healers-touch", "Healer's Touch", 2,
  `<p>Beginning at 2nd level, you have a number of healing dice equal to your level + your Wisdom modifier, which are d6s. As a bonus action on your turn, you can touch a creature within 5 feet of you and spend a number of these healing dice up to your Wisdom modifier (minimum of one healer's die). Roll the dice, add them together, and restore hit points to the target equal to the total. You regain all spent healing dice when you finish a long rest.</p>
<p>Alternatively, when you restore hit points to a creature using a medic creation of 1st level or higher, you can expend a number of these healing dice up to the level of the creation and add them to the amount of hit points restored to one creature affected by the creation.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    target: { value: 1, width: null, units: "", type: "creature" },
    range: { value: 5, long: null, units: "ft" },
    uses: { value: null, max: "@classes.medic.levels + @abilities.wis.mod", per: "lr", recovery: "", prompt: true },
    actionType: "heal",
  },
);

export const experimentalApplication = feat(
  "feature/medic/physician/experimental-application", "Experimental Application", 6,
  `<p>Starting at 6th level, you've learned how to apply your Experimental Medicine as regenerative medicine. As an action on your turn, you can expend one use of your Experimental Medicine and create a cloud of medical fumes that can restore a number of hit points equal to five times your medic level. Choose any creatures within 30 feet of you, and divide those hit points among them. You can't use this feature on an Undead or a Construct.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    range: { value: 30, long: null, units: "ft" },
    actionType: "heal",
  },
);

export const developedImmunity = feat(
  "feature/medic/physician/developed-immunity", "Developed Immunity", 10,
  `<p>Beginning at 10th level, you become immune to all poisons and diseases. Additionally, your hit point maximum can no longer be reduced, and your hit point maximum is increased by your level, and by 1 each level thereafter.</p>`,
  {},
  [
    createDAEEffect("medic/physician/developed-immunity", "Developed Immunity", [
      overrideValue("system.traits.ci.value", "poisoned"),
    ]),
  ],
);

export const masterPractitioner = feat(
  "feature/medic/physician/master-practitioner", "Master Practitioner", 14,
  `<p>Beginning at 14th level, you can use Lesser Restoration at will, and no longer require material components to use Greater Restoration.</p>`,
);

export const features: FeatureItem[] = [
  healersTouch, experimentalApplication, developedImmunity, masterPractitioner,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Physician",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Physicians focus primarily on their job as the ship's doctor, and specialize in using their medicine to aid allies and heal their wounds over fighting on the frontlines themselves.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "physician",
    classIdentifier: "medic",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 2, [{ uuid: fUuid(healersTouch) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(experimentalApplication) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(developedImmunity) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(masterPractitioner) }]),
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
