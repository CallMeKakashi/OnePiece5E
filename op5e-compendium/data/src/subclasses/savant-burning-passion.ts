import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/burning-passion";

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
      requirements: `Savant (Burning Passion) ${level}`,
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

export const fierySoul = feat(
  "feature/savant/burning-passion/fiery-soul", "Fiery Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain resistance to fire damage and can tolerate temperatures as high as 200 degrees without additional protection. Additionally, you gain the Fire Bolt and Guidance tricks if you don't already have them.</p>`,
);

export const channelConvictionBurning = feat(
  "feature/savant/burning-passion/channel-conviction", "Channel Conviction: Burning Passion", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Manifest Soul.</strong> As a bonus action, you can manifest the element of your soul around a weapon. For 1 minute, your weapon attacks and creations deal extra fire damage equal to your Charisma Modifier. You can end this effect on your turn as part of any other action.</li>
<li><strong>Soul Burn.</strong> As an action, your flames burn bright to banish despair. Each creature of your choice within 30 feet gains 2d6 + your Charisma modifier + your savant level in temporary hit points, and while a creature has these temporary hit points, it has advantage on saving throws against being frightened.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const auraOfDevotion = feat(
  "feature/savant/burning-passion/aura-of-devotion", "Aura of Devotion", 7,
  `<p>Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const heroicRush = feat(
  "feature/savant/burning-passion/heroic-rush", "Heroic Rush", 15,
  `<p>At 15th level, when an ally is forced to make a saving throw, you can use your reaction to move up to your speed towards the ally. If this movement brings you within 5 feet of the ally, you can touch the ally and teleport it a number of feet equal to your speed. The ally automatically succeeds on its saving throw and if it would normally take half damage on a successful save, it instead takes no damage. You must then make the saving throw against the effect as normal.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "Ally forced to make a saving throw" } },
);

export const dashingSaviour = feat(
  "feature/savant/burning-passion/dashing-saviour", "Dashing Saviour", 20,
  `<p>At 20th level, you can clad yourself in flames, becoming a beacon of protection to your allies. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>You are immune to fire damage.</li>
<li>You shed bright light in a 30 feet radius, and dim light for another 30 feet.</li>
<li>When a creature starts its turn in this bright light, you can choose to deal 10 points of fire damage to it.</li>
<li>When you use Heroic Rush, you can target a number of creatures equal to 1 + your Charisma modifier (minimum of two) instead of just one.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  fierySoul, channelConvictionBurning, auraOfDevotion, heroicRush, dashingSaviour,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Burning Passion",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Savants who hold a burning passion, love, or ambition within their soul can manifest it as a blazing heat, scorching their enemies when they strike them. Typically, these savants are born defenders who will protect their crews and ideals with their lives.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "burning-passion",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(fierySoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionBurning) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(auraOfDevotion) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(heroicRush) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(dashingSaviour) }]),
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
