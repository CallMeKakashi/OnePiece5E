import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/fulminating-glee";

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
      requirements: `Savant (Fulminating Glee) ${level}`,
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

export const sparkingSoul = feat(
  "feature/savant/fulminating-glee/sparking-soul", "Sparking Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain resistance to lightning damage. You also learn the Shocking Grasp and Spark Bolt tricks if you don't already know them.</p>`,
);

export const channelConvictionGlee = feat(
  "feature/savant/fulminating-glee/channel-conviction", "Channel Conviction: Fulminating Glee", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Manifest Soul.</strong> As a bonus action, you can manifest the element of your soul around a weapon. For 1 minute, your weapon attacks and creations that deal lightning damage can spread through enemies, as you have the choice to give them a damage spread of 5ft, DC spell save.</li>
<li><strong>Schadenfreude.</strong> As a bonus action, you can use your Channel Conviction to begin a mocking tirade at a creature. The creature then has disadvantage on attack rolls against creatures other than you for 1 minute. You can use a bonus action on each turn to target a different creature.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const auraOfFreedom = feat(
  "feature/savant/fulminating-glee/aura-of-freedom", "Aura of Freedom", 7,
  `<p>Starting at 7th level, you and friendly creatures within 10 feet of you have advantage on saving throws against being paralyzed or restrained, and ignore difficult terrain, while you are conscious.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const lightningReflexes = feat(
  "feature/savant/fulminating-glee/lightning-reflexes", "Lightning Reflexes", 15,
  `<p>Beginning at 15th level, you can take advantage of an enemy's mistake in the flash of an eye. When a creature misses you with an attack, you can use your reaction to instantly make an opportunity attack against it.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "Creature misses you with an attack" } },
);

export const riderOfStorms = feat(
  "feature/savant/fulminating-glee/rider-of-storms", "Rider of Storms", 20,
  `<p>At 20th level, you can channel the storm to surround yourself with thunder and lightning. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>You are immune to lightning damage.</li>
<li>You have a flying speed of 60 feet, and when you use this flying speed, opportunity attacks against you are made with disadvantage.</li>
<li>When you take the Attack action on your turn, you can make one additional attack as part of that action.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  sparkingSoul, channelConvictionGlee, auraOfFreedom, lightningReflexes, riderOfStorms,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Fulminating Glee",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Savants who have little care for anything but fun in the world tend to be sparking with energy, which appears as jolts of lightning shooting from their bodies. At their best, they are bundles of infectious joy.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "fulminating-glee",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(sparkingSoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionGlee) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(auraOfFreedom) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(lightningReflexes) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(riderOfStorms) }]),
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
