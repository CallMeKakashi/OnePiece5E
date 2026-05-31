import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/bard/lore";

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
      requirements: `Bard (Lore) ${level}`,
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

export const bonusProficiencies = feat(
  "feature/bard/lore/bonus-proficiencies", "Bonus Proficiencies", 3,
  `<p>When you join the College of Lore at 3rd level, you gain proficiency with three skills of your choice.</p>`,
);

export const cuttingWords = feat(
  "feature/bard/lore/cutting-words", "Cutting Words", 3,
  `<p>Also at 3rd level, you learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature's roll.</p>
<p>You can choose to use this feature after the creature makes its roll, but before the DM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can't hear you.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Creature within 60 ft makes attack, check, or damage roll" },
    range: { value: 60, long: null, units: "ft" },
  },
);

export const additionalMusicalSecrets = feat(
  "feature/bard/lore/additional-musical-secrets", "Additional Musical Secrets", 6,
  `<p>At 6th level, you learn two creations of your choice from any class. A creation you choose must be of a level you can cast, as shown on the Bard table, or a trick. The chosen creations count as bard creations for you but don't count against the number of bard creations you know.</p>`,
);

export const customizedCreativity = feat(
  "feature/bard/lore/customized-creativity", "Customized Creativity", 6,
  `<p>Also at 6th level, you gain the ability to alter your creations thanks to your mastery of knowledge from all over the world. You gain two of the following Customized Creativity options of your choice. You gain another one at 10th and 14th level.</p>
<p>You can use this feature a number of times equal to your proficiency bonus, and each option only takes a single use. You regain all uses of this ability at the end of a long rest.</p>
<ul>
<li><strong>Failsafe.</strong> When you use a creation that forces other creatures to make a saving throw, you can protect some of those creatures. Choose a number up to your creativity modifier (minimum of one). A chosen creature automatically succeeds on its saving throw, and takes no damage if it would normally take half on a success.</li>
<li><strong>Extended Range.</strong> When you use a creation that has a range of 5 feet or greater, you can double the range. When the range is touch, you can make it 30 feet instead.</li>
<li><strong>Quick Creation.</strong> When you use a creation with a creation time of 1 action, you can change it to 1 bonus action for this usage.</li>
<li><strong>Silenced.</strong> When you use a creation, you can use it without any somatic or verbal components.</li>
<li><strong>Alternative Effects.</strong> When you use a creation that deals acid, cold, fire, lightning, poison, or thunder damage, you can change that damage type to one of the other listed types.</li>
<li><strong>Double Trouble.</strong> When you use a creation that targets only one creature and doesn't have a range of self, you can target a second creature in range with the same creation.</li>
</ul>`,
  {
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const peerlessUnderstanding = feat(
  "feature/bard/lore/peerless-understanding", "Peerless Understanding", 14,
  `<p>Starting at 14th level, your understanding of the gravity of your words allow you to leave all that hear them utterly befuddled.</p>
<p>When you use your Cutting Words feature on an enemy, that enemy has disadvantage on their next saving throw, or until you use this feature on another creature.</p>`,
);

export const features: FeatureItem[] = [
  bonusProficiencies, cuttingWords, additionalMusicalSecrets, customizedCreativity, peerlessUnderstanding,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "College of Lore",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Bards of the college of lore know something about most things. Whether singing folk ballads in taverns or elaborate compositions in royal courts, these bards use their gifts to hold audiences spellbound. The college's members gather in libraries and sometimes in actual colleges, complete with classrooms and dormitories, to share their lore with one another.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "lore",
    classIdentifier: "bard",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(bonusProficiencies) }, { uuid: fUuid(cuttingWords) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(additionalMusicalSecrets) }, { uuid: fUuid(customizedCreativity) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(peerlessUnderstanding) }]),
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
