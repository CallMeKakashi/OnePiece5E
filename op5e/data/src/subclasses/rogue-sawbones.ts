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
  `<p>When you choose this archetype at 3rd level, you gain proficiency in the Medicine skill. If you are already proficient, you instead gain expertise with the skill. If you already have Expertise in the Medicine skill, you instead gain proficiency in another skill.</p>`,
);

export const patchwork = feat(
  "feature/rogue/sawbones/patchwork", "Patchwork", 3,
  `<p>At 3rd level, you learn how to quickly administer first aid while on the battlefield.</p><p>You have a pool of medicine that can be used to heal allies in the middle of combat, represented by a number of d8s equal to 1 + your Rogue level.</p><p>Using your Cunning Action, you can touch a creature and spend a number of those dice equal to your Wisdom modifier (minimum of one). The target regains a number of hit points equal to the total of those dice + your Wisdom Modifier.</p><p>Alternatively, you can expend one of these dice to remove one disease or poison from a creature. You regain all spent dice when you finish a short or long rest.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: null, max: "1 + @classes.rogue.levels", per: "sr", recovery: "", prompt: true },
  },
);

export const twistedSurgery = feat(
  "feature/rogue/sawbones/twisted-surgery", "Twisted Surgery", 6,
  `<p>Starting at 6th level, you can decipher the precise weak points of your foes. The following effects are added to your Devious Strike options.</p><p><strong>Bleed (Cost: 2d6).</strong> You strike a creatue, causing them to bleed profusely. The target must succeed a Constitution saving throw or begin bleeding for 1 minute, repeating the saving throw at the end of each of their turns, ending the effect on a successful save. While bleeding, the target takes 2d6 necrotic damage at the start of each of their turns. Undead and constructs automatically succeed this saving throw.</p><p><strong>Pierce (Cost: 1d6).</strong> You strike through your target's defenses, this attack ignores damage resistances.</p>`,
);

export const miracleWorker = feat(
  "feature/rogue/sawbones/miracle-worker", "Miracle Worker", 9,
  `<p>At 9th level, your medical expertise lets you bring people back from the grave. You can perform life-saving surgery on a creature that has died within the last hour.</p><p>The operation requires costly medicine and anesthetics worth at least 1 000 000 beri (100gp), or for free if the death occured within 10 minutes. You must concentrate on the operation for 1 minute as if you were concentrating on a creation, and if your concentration is broken you lose all progress and medicine involved in the operation.</p><p>If 7 days has not yet passed since the creature died, you can attempt this operation again, provided you have the means to do so. If you successfully finish the operation, the dead creature returns to life with one hit point and is cured of any poisons or diseases it was suffering from.</p><p>If it was missing any limbs, you can reattach them as part of this operation if they are intact and available.</p><p>You can use this feature a number of times equal to your proficiency bonus, and regain the ability to do so when you finish a long rest.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "Creature died within the last hour" },
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const checkUp = feat(
  "feature/rogue/sawbones/check-up", "Check-up", 13,
  `<p>At 13th level, you can set aside time to see to allies when a moment of rest is given. Over the course of a short rest, you can tend to a number of creatures equal to your Wisdom modifier (minimum of one). Each creature you treat are cured of the blinded, deafened, paralyzed, petrified and poisoned conditions.</p><p>Additionally, if the creature was missing a limb, you can reattach it if you still have access to it and it wasn't destroyed.</p><p>Finally, each creature regains an additional 2 hit points for each hit dice it rolls to restore hit points.</p>`,
);

export const surgeonOfDeath = feat(
  "feature/rogue/sawbones/surgeon-of-death", "Surgeon of Death", 17,
  `<p>At 17th level, your anatomical knowledge and surgical precision grants any weapon you wield maximum lethality, allowing you to cause the most damage possible to your enemies.</p><p>When you roll a 1 or 2 on a damage dice for your Sneak Attack, you can treat those rolls as 3's.</p>`,
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
    description: { value: `<p>On the field of battle, first aid for your fallen comrades takes priority. When you're a pirate, you need whatever is necessary to prevent you from bleeding out. In academic circles, being labeled "sawbones" is a mark of shame, known for being medical quacks, however among pirates and marines, it's a title that oftentimes carries some modicum of respect and no small amount of fear.</p><p>Sawbones are rogues who put their deft fingers to use as marine doctors. Good sawbones can easily be counted among the most skilled surgeons on the seas, able to stomach any amount of blood and work with precision through the harshest of storms.</p>`, chat: "" },
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
