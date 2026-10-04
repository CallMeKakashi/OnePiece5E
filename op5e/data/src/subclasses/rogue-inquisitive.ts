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
  `<p>Starting at 3rd level, you develop a keen ear for picking out lies. Whenever you make a Wisdom (Insight) or Intelligence (Investigation) check, treat a roll of 11 or lower on the d20 as a 12.</p><p>In addition, you can take the Search action as a bonus action.</p>`,
);

export const observeOpponent = feat(
  "feature/rogue/inquisitive/observe-opponent", "Observe Opponent", 3,
  `<p>At 3rd level, you gain the ability to decipher an opponent's tactics and develop a counter to them. As a bonus action, you make a Wisdom (Insight) check against a creature you can see that isn't incapacitated, contested by the target's Charisma (Deception) check. If you succeed, you can use your Sneak Attack against that target even if you don't have advantage on the attack roll, but not if you have disadvantage on it.</p><p>This benefit lasts for 1 minute or until you successfully use this feature against a different target.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "" } },
);

export const interrogationTactics = feat(
  "feature/rogue/inquisitive/interrogation-tactics", "Interrogation Tactics", 6,
  `<p>Starting at 6th level, you can decipher the precise weak points of your foes. The following effects are added to your Devious Strike options.</p><p><strong>Interrogate (Cost: 2d6).</strong> You know how to get any old wise guy talking. The target must succeed a Charisma saving throw, or be unable to speak a deliberate lie for 10 minutes. You know if it succeeded or failed on its saving throw.</p><p>If you wish to impose this effect on a creature without injuring it, you can attack the creature to simply touch it, dealing no damage on a hit.</p><p><strong>Terrorize (Cost: 3d6).</strong> You know how to rattle the target, leaving them shaking in their boots. The target must succeed a Wisdom saving throw, or become frightened by you until the end of its next turn.</p>`,
);

export const keenEyes = feat(
  "feature/rogue/inquisitive/keen-eyes", "Keen Eyes", 9,
  `<p>Starting at 9th level, you gain advantage on any Wisdom (Perception) or Intelligence (Investigation) check if you move no more than half your speed on the same turn.</p>`,
);

export const astuteEye = feat(
  "feature/rogue/inquisitive/astute-eye", "Astute Eye", 13,
  `<p>Starting at 13th level, your senses are almost impossible to foil. As an action, you sense the presence of illusions, disguised creatures, and techniques designed to deceive the senses within 30 feet of you, provided you aren't blinded or deafened. You sense that an effect is attempting to trick you, but you gain no insight into what is hidden or into its true nature.</p><p>You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    uses: { value: null, max: "max(1, @abilities.wis.mod)", per: "lr", recovery: "", prompt: true },
  },
);

export const eyeForWeakness = feat(
  "feature/rogue/inquisitive/eye-for-weakness", "Eye For Weakness", 17,
  `<p>Starting at 17th level, you learn to exploit a creature's weaknesses by carefully studying its tactics and movement. While your Observe Opponent feature applies to a creature, your Sneak Attack damage against that creature increases by 3d6.</p>`,
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
    description: { value: `<p>Inquisitives are rogues that take a slower and more calculated approach to their job. You become an expert at rooting out the truth, whether through careful observation or interaction with other creatures, reading them like an open book.</p>`, chat: "" },
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
