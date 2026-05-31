import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/necrotic-mania";

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
      requirements: `Savant (Necrotic Mania) ${level}`,
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

export const scornfulSoul = feat(
  "feature/savant/necrotic-mania/scornful-soul", "Scornful Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain resistance to necrotic damage. You also learn the Necrotic Bolt and Chilling Necrosis tricks if you don't already know them.</p>`,
);

export const channelConvictionNecrotic = feat(
  "feature/savant/necrotic-mania/channel-conviction", "Channel Conviction: Necrotic Mania", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Consuming Gloom.</strong> As a bonus action, you can manifest the element of your soul around a weapon. For 1 minute, all bright light within 20 feet of the weapon becomes dim light, and dim light becomes darkness, and you can add your Charisma modifier to the attack rolls you make with the weapon. Additionally, you can see normally in all forms of darkness for the duration.</li>
<li><strong>Feed on Despair.</strong> As an action, each creature of your choice within 20 feet of you must make a Charisma saving throw, taking 2d10 + your Savant level + your Charisma modifier necrotic damage on a failed save and half as much on a success. You then gain temporary hit points equal to the damage dealt to one of these creatures.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const auraOfCruelty = feat(
  "feature/savant/necrotic-mania/aura-of-cruelty", "Aura of Cruelty", 7,
  `<p>Beginning at 7th level, you become surrounded by negative energy. While you are conscious, creatures of your choice within 10 feet of you cannot regain hit points, and when a creature dies within this aura, you regain hit points equal to your Charisma modifier.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const mercilessFiend = feat(
  "feature/savant/necrotic-mania/merciless-fiend", "Merciless Fiend", 15,
  `<p>Starting at 15th level, your hate filled soul gives you a hellish level of endurance. You regain hit points equal to 1d6 + half your savant level if you end your turn in combat with fewer than half of your hit points remaining and you aren't incapacitated.</p>`,
);

export const creatureOfScorn = feat(
  "feature/savant/necrotic-mania/creature-of-scorn", "Creature of Scorn", 20,
  `<p>Starting at 20th level, you can completely give in to the darkness within your heart and transform into a fiendish creature of hate. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>Your attack rolls score a critical hit on a roll of 19 or 20.</li>
<li>You have advantage on weapon attacks against creatures that are missing any of their hit points.</li>
<li>Once per turn when you deal necrotic damage to a creature, you can choose to gain an equal number of temporary hit points, which last until the start of your next turn.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  scornfulSoul, channelConvictionNecrotic, auraOfCruelty, mercilessFiend, creatureOfScorn,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Necrotic Mania",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Savants who lose themselves to negative emotions of obsession, despondency and hate find their powers change with their mental state. A degenerative energy surrounds them, which destroys everything they touch.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "necrotic-mania",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(scornfulSoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionNecrotic) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(auraOfCruelty) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(mercilessFiend) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(creatureOfScorn) }]),
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
