import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/rogue/sawbones";

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
      requirements: `Rogue (Sawbones) ${level}`,
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

export const medicallyTrained = feat(
  "feature/rogue/sawbones/medically-trained", "Medically Trained", 3,
  `<p>When you choose this archetype at 3rd level, you gain proficiency in the Medicine skill if you don't already have it. Your proficiency bonus is doubled for any ability check you make using Medicine.</p>`,
);

export const patchwork = feat(
  "feature/rogue/sawbones/patchwork", "Patchwork", 3,
  `<p>At 3rd level, you gain a pool of healing dice equal to your Rogue level (d8s). As a bonus action, you can expend dice from this pool to heal a creature you can touch. Roll the dice expended and the creature regains hit points equal to the total. The pool resets on a long rest.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: null, max: "@classes.rogue.levels", per: "lr", recovery: "", prompt: true },
  },
);

export const twistedSurgery = feat(
  "feature/rogue/sawbones/twisted-surgery", "Twisted Surgery", 6,
  `<p>At 6th level, you gain the following additional Devious Strike options:</p><ul><li><strong>Sever Tendon (Cost: 2d6).</strong> The target must succeed on a Constitution saving throw or have its speed halved until the end of its next turn.</li><li><strong>Nerve Strike (Cost: 2d6).</strong> The target must succeed on a Constitution saving throw or have disadvantage on its next attack roll.</li></ul>`,
);

export const miracleWorker = feat(
  "feature/rogue/sawbones/miracle-worker", "Miracle Worker", 9,
  `<p>At 9th level, you can use your medical expertise to revive the recently deceased. As an action, if a creature has died within the last minute, you can expend 5 dice from your Patchwork pool to revive it with 1 hit point. Once you use this feature, you can't do so again until you finish a long rest.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "Creature died within 1 minute" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const checkUp = feat(
  "feature/rogue/sawbones/check-up", "Check-up", 13,
  `<p>Starting at 13th level, during a short or long rest, you can tend to your allies' ailments. Choose a number of creatures up to your Intelligence modifier (minimum 1) that you can tend to during the rest. Those creatures are cured of one disease or one condition afflicting them (your choice). The condition can be blinded, deafened, paralyzed, or poisoned.</p>`,
);

export const surgeonOfDeath = feat(
  "feature/rogue/sawbones/surgeon-of-death", "Surgeon of Death", 17,
  `<p>At 17th level, your knowledge of anatomy makes your strikes devastatingly precise. When you roll Sneak Attack damage, you can treat any die roll of 1 or 2 as a 3.</p>`,
);

export const features: FeatureItem[] = [
  medicallyTrained, patchwork, twistedSurgery, miracleWorker, checkUp, surgeonOfDeath,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Sawbones",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The Sawbones is a battlefield surgeon who combines medical knowledge with deadly precision—equally capable of saving lives and taking them.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "sawbones",
    classIdentifier: "rogue",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(medicallyTrained) }, { uuid: fUuid(patchwork) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(twistedSurgery) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(miracleWorker) }]),
      createItemGrant(SC_ID, 13, [{ uuid: fUuid(checkUp) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(surgeonOfDeath) }]),
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
