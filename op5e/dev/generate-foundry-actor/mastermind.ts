/** 5e Mastermind rogue (Xanathar's) — homebrew subclass for workshop actors. */
import { generateId } from "../../data/helpers/id.js";
import { createItemGrant, mergeAdvancements } from "../../data/helpers/advancement.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.ts";
import type { SubclassItem } from "../../data/schemas/subclass.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const SC_ID = "subclass/rogue/mastermind";

function feat(
  idPath: string,
  name: string,
  level: number,
  description: string,
  extra: Partial<FeatureItem["system"]> = {},
): FeatureItem {
  return ensureFeatureActivities({
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/skills/social/diplomacy-handshake-yellow.webp",
    system: {
      description: { value: description, chat: "" },
      source: { book: "XGE", page: "46", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Rogue (Mastermind) ${level}`,
      activation: { type: "", cost: null, condition: "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: extra.actionType ?? "",
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
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  } as FeatureItem);
}

export const masterOfIntrigue = feat(
  "feature/rogue/mastermind/master-of-intrigue",
  "Master of Intrigue",
  3,
  `<p>When you choose this archetype at 3rd level, you gain proficiency with the disguise kit, the forgery kit, and one gaming set of your choice. You also learn two languages of your choice.</p>
<p>Additionally, if you spend at least 1 minute observing or listening to a creature, you can learn whether it is lying, its general emotional state, and its attitude toward nearby creatures.</p>`,
);

export const masterOfTactics = feat(
  "feature/rogue/mastermind/master-of-tactics",
  "Master of Tactics",
  3,
  `<p>Starting at 3rd level, you can use the Help action as a bonus action. When you use the Help action to aid an ally's attack, the target can be within 30 feet of you rather than 5 feet, if the target can see or hear you.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "Help action" },
    actionType: "util",
  },
);

const features = [masterOfIntrigue, masterOfTactics];

export const mastermindSubclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Mastermind",
  type: "subclass",
  img: "icons/skills/social/diplomacy-handshake-yellow.webp",
  system: {
    description: {
      value: `<p>Your focus is on people and on the subtle skills needed to manipulate them. You excel at social manipulation and tactical coordination.</p>`,
      chat: "",
    },
    source: { book: "XGE", page: "46", custom: "", license: "" },
    identifier: "mastermind",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [
        { uuid: masterOfIntrigue._id },
        { uuid: masterOfTactics._id },
      ]),
    ) as never,
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: { op5e: { homebrew: "5e-xge" } },
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: {
    compendiumSource: null,
    duplicateSource: null,
    coreVersion: "13",
    systemId: "dnd5e",
    systemVersion: "5.1.10",
    createdTime: null,
    modifiedTime: null,
    lastModifiedBy: null,
  },
} as unknown as SubclassItem;

export { features as mastermindFeatures };
