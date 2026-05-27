import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/inquisitive";

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
      requirements: `Rogue (Inquisitive) ${level}`,
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

export const decipherDeceit = feat(
  "feature/rogue/inquisitive/decipher-deceit", "Decipher Deceit", 3,
  `<p>When you choose this archetype at 3rd level, you develop a talent for picking out lies. Whenever you make a Wisdom (Insight) or Intelligence (Investigation) check, you can treat a d20 roll of 11 or lower as a 12.</p>`,
);

export const observeOpponent = feat(
  "feature/rogue/inquisitive/observe-opponent", "Observe Opponent", 3,
  `<p>At 3rd level, as a bonus action, you can make a Wisdom (Insight) check against a creature you can see that isn't incapacitated, contested by the target's Charisma (Deception) check. If you succeed, you can use your Sneak Attack against that target even if you don't have advantage on the attack roll, but not if you have disadvantage on it. This benefit lasts for 1 minute or until you use this feature against a different target.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "" } },
);

export const interrogationTactics = feat(
  "feature/rogue/inquisitive/interrogation-tactics", "Interrogation Tactics", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Expose (Cost: 2d6).</strong> Until the end of your next turn, the target can't benefit from half cover or three-quarters cover.</li><li><strong>Exploit Weakness (Cost: 2d6).</strong> The next attack roll against the target before the end of your next turn has advantage.</li></ul>`,
);

export const keenEyes = feat(
  "feature/rogue/inquisitive/keen-eyes", "Keen Eyes", 9,
  `<p>At 9th level, if you spend at least 1 minute observing or interacting with a creature or if you move at no more than half your speed, you have advantage on Wisdom (Perception) and Intelligence (Investigation) checks.</p>`,
);

export const astuteEye = feat(
  "feature/rogue/inquisitive/astute-eye", "Astute Eye", 13,
  `<p>Starting at 13th level, you can sense when something is an illusion. You have advantage on saving throws against illusions and you can use an action to automatically determine if something you can see within 30 feet is an illusion.</p>`,
);

export const eyeForWeakness = feat(
  "feature/rogue/inquisitive/eye-for-weakness", "Eye For Weakness", 17,
  `<p>At 17th level, while your Observe Opponent feature applies to a creature, your Sneak Attack damage against that creature increases by 3d6.</p>`,
);

export const features: FeatureItem[] = [
  decipherDeceit, observeOpponent, interrogationTactics, keenEyes, astuteEye, eyeForWeakness,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Inquisitive",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>As an Inquisitive, you excel at rooting out secrets and unraveling mysteries. You rely on your sharp eye for detail and your finely honed ability to read the words and deeds of other creatures.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "inquisitive",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(decipherDeceit) }, { uuid: fUuid(observeOpponent) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(interrogationTactics) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(keenEyes) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(astuteEye) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(eyeForWeakness) }]),
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
