import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";

const SUB = "subclass/fighter/gunslinger";
const F = "feature/fighter/gunslinger";

function fUuid(path: string): string {
  return compendiumUuid("class-features", generateId(path));
}

function feat(slug: string, name: string, desc: string, req: string): FeatureItem {
  return {
    _id: generateId(`${F}/${slug}`),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: req,
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
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null, coreVersion: "13",
      systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  };
}

const firearmProficiency = feat(
  "firearm-proficiency", "Firearm Proficiency",
  `<p>Starting when you choose this archetype at 3rd level, you gain proficiency with firearms and cannons, allowing you to add your proficiency bonus to attacks made with such weapons.</p>`,
  "Gunslinger 3",
);

const trickShots = feat(
  "trick-shots", "Trick Shots",
  `<p>At 3rd level, you learn two trick shots of your choice. You learn one additional trick shot at 7th, 10th, 15th, and 18th level. Each time you learn a new trick shot, you can also replace one trick shot you know with a different one.</p>
<p><strong>Grit.</strong> You have a number of grit points equal to your Wisdom modifier (minimum of 1). You regain 1 expended grit point each time you score a critical hit with a firearm attack, or when you roll a 20 on a death saving throw. You regain all expended grit points after a short or long rest.</p>
<p><strong>Saving Throws.</strong> Some trick shots require your target to make a saving throw. The DC equals 8 + your proficiency bonus + your Dexterity modifier.</p>`,
  "Gunslinger 3",
);

const bulletTime = feat(
  "bullet-time", "Bullet Time",
  `<p>Starting at 7th level, you can enter a heightened state of focus. As a bonus action, you designate a 10-foot radius area centered on you. Until the start of your next turn, you can use your reaction to make a ranged weapon attack against any creature that enters or moves within this area.</p>`,
  "Gunslinger 7",
);

const sharpSighted = feat(
  "sharp-sighted", "Sharp-Sighted",
  `<p>Beginning at 10th level, the normal and long range of your firearm attacks is doubled.</p>`,
  "Gunslinger 10",
);

const viciousIntent = feat(
  "vicious-intent", "Vicious Intent",
  `<p>At 15th level, your firearm attacks score a critical hit on a roll of 19 or 20.</p>`,
  "Gunslinger 15",
);

const distinguishedShot = feat(
  "distinguished-shot", "Distinguished Shot",
  `<p>At 18th level, your mastery with firearms reaches legendary status. When you score a critical hit with a firearm, the attack deals an additional die of damage. Additionally, when you roll damage for a critical hit with a firearm, the target suffers a hemorrhaging wound, taking damage equal to your Dexterity modifier at the start of each of its turns for 1 minute. A creature can use its action to stanch the bleeding with a successful DC 15 Medicine check, or the wound can be healed with any magical healing.</p>`,
  "Gunslinger 18",
);

export const gunslinger: SubclassItem = {
  _id: generateId(SUB),
  name: "Gunslinger",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: "<p>Most warriors and combat specialists spend their years perfecting the classic arts of swordplay, archery, or pole arm tactics. Whether through necessity or extraordinary talent, the Gunslinger instead masters the use of firearms and cannons.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "gunslinger",
    classIdentifier: "fighter",
    advancement: mergeAdvancements(
      createItemGrant(SUB, 3, [
        { uuid: fUuid(`${F}/firearm-proficiency`) },
        { uuid: fUuid(`${F}/trick-shots`) },
      ]),
      createItemGrant(SUB, 7, [
        { uuid: fUuid(`${F}/bullet-time`) },
      ]),
      createItemGrant(SUB, 10, [
        { uuid: fUuid(`${F}/sharp-sighted`) },
      ]),
      createItemGrant(SUB, 15, [
        { uuid: fUuid(`${F}/vicious-intent`) },
      ]),
      createItemGrant(SUB, 18, [
        { uuid: fUuid(`${F}/distinguished-shot`) },
      ]),
    ),
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: {
    compendiumSource: null, duplicateSource: null, coreVersion: "13",
    systemId: "dnd5e", systemVersion: "5.1.10",
    createdTime: null, modifiedTime: null, lastModifiedBy: null,
  },
};

export const gunslingerFeatures: FeatureItem[] = [
  firearmProficiency,
  trickShots,
  bulletTime,
  sharpSighted,
  viciousIntent,
  distinguishedShot,
];
