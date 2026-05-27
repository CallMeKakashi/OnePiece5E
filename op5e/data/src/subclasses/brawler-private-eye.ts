import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/private-eye";

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
      requirements: `Brawler (Private Eye) ${level}`,
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

export const wellVersedScholar = feat(
  "feature/brawler/private-eye/well-versed-scholar", "Well Versed Scholar", 3,
  `<p>Beginning at 3rd level, you gain proficiency in two of the following skills of your choice: Engineering, History, Investigation, Nature, or Religion. If you already have proficiency in one of the listed skills, you can instead gain expertise with the chosen skill. You gain proficiency in an additional skill from the list at 6th, 11th, and 17th level.</p>
<p>Additionally, you may use your Intelligence score in place of your Wisdom score for all your Brawler abilities, including Unarmored Defense, Spirit Save DC, and more.</p>`,
);

export const analyticalStrike = feat(
  "feature/brawler/private-eye/analytical-strike", "Analytical Strike", 3,
  `<p>Starting at 3rd level, your strikes coupled with your intuition and analysis allow you to become aware of your foe's shortcomings. When you hit a creature with one of the attacks granted by your Flurry of Blows, you can analyze it.</p>
<p>Whenever an analyzed creature misses you with an attack, you can immediately use your reaction to make an unarmed strike against that creature if it's within your reach. This benefit lasts until you finish a short or long rest.</p>
<p>When you analyze a creature, you learn a number of features equal to 1 + your Intelligence modifier from the following list:</p>
<ul>
<li>All damage vulnerabilities and damage resistances</li>
<li>All damage immunities and condition immunities</li>
<li>Individual Ability Scores (can be chosen multiple times)</li>
<li>Current Hit Points</li>
<li>Armor Class</li>
<li>Senses</li>
<li>Proficiency Bonus</li>
</ul>
<p>Additionally, you can precisely strike a creature, forcing them to speak truthfully. When you hit a creature with an unarmed strike, you can spend 1 spirit point to force it to make a Charisma saving throw. On a failed save, the creature is unable to speak a deliberate lie, and all Charisma checks directed at the creature are made with advantage for up to 10 minutes.</p>`,
  {
    save: { ability: "cha", dc: null, scaling: "wis" },
  },
);

export const reactiveSpirit = feat(
  "feature/brawler/private-eye/reactive-spirit", "Reactive Spirit", 6,
  `<p>Starting at 6th level, your knowledge of your enemies coupled with your quick reflexes enable you to act on a dime. Once per turn, if you've already taken your reaction, you may spend 1 spirit point to take an additional reaction. You can use only one reaction per triggering effect.</p>`,
);

export const achillesHeel = feat(
  "feature/brawler/private-eye/achilles-heel", "Achilles Heel", 11,
  `<p>Upon reaching 11th level, you can gain further insight to a creature's defenses, making them suffer for their shortcomings.</p>
<p>When you hit a creature with an unarmed strike, you can spend 3 spirit points to cause the creature to gain vulnerability to one damage type of your choice. After that creature takes that damage, they no longer are vulnerable.</p>
<p>If a creature has resistance to the damage type you choose, this resistance is suppressed for 1 minute, rather than gaining vulnerability. A creature that is immune to the damage type you choose is unaffected. A creature who is affected by this feature cannot be affected by it again for 24 hours.</p>`,
);

export const primeOperative = feat(
  "feature/brawler/private-eye/prime-operative", "Prime Operative", 17,
  `<p>When you reach 17th level, you have mastered the art of combative deduction and sharp reasoning. You gain the following benefits:</p>
<ul>
<li>When you use your Achilles Heel feature on a creature, you no longer have the 24-hour cooldown to affect the same creature.</li>
<li>The cost of your Achilles Heel feature is now 2 spirit points instead of 3.</li>
<li>When you use the analysis ability of your Analytical Strike feature, you can choose to analyze a creature any time you hit them with an unarmed strike, and not just with Flurry of Blows.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  wellVersedScholar, analyticalStrike, reactiveSpirit, achillesHeel, primeOperative,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Private Eye",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Followers of the Private Eye combine intellect and hand-to-hand combat, doing whatever it takes to find the truth. Typically these brawlers are traveling scholars, always on the journey for discovery, using their knowledge from many corners of the world to avoid attacks, analyze their opponents, find their weaknesses and make them suffer for them.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "private-eye",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(wellVersedScholar) }, { uuid: fUuid(analyticalStrike) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(reactiveSpirit) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(achillesHeel) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(primeOperative) }]),
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
