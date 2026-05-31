import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/cold-indifference";

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
      requirements: `Savant (Cold Indifference) ${level}`,
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

export const frozenSoul = feat(
  "feature/savant/cold-indifference/frozen-soul", "Frozen Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain resistance to cold damage and can tolerate temperatures as cold as negative 50 degrees without additional protection. Lastly, you gain the Ice Bolt and Piercing Frost tricks.</p>`,
);

export const channelConvictionCold = feat(
  "feature/savant/cold-indifference/channel-conviction", "Channel Conviction: Cold Indifference", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Manifest Soul.</strong> As a bonus action, you can manifest the element of your soul around a weapon. For 1 minute, your weapon attacks that deal cold damage reduce the target's AC by 2 and halve their speed. This effect doesn't stack. The target can spend their action to end the effect.</li>
<li><strong>Touch of Winter.</strong> As an action, you can instantly freeze the surrounding area. The area within 20 feet of you becomes difficult terrain for creatures other than you as jagged ice spreads across it. If you touch a body of water, you instantly freeze the surface and as deep as 10 feet. The ice remains for 1 minute.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const auraOfWinter = feat(
  "feature/savant/cold-indifference/aura-of-winter", "Aura of Winter", 7,
  `<p>Starting at 7th level, creatures of your choice within 10 feet of you have their speed reduced by 10 while you are conscious.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const bitterChill = feat(
  "feature/savant/cold-indifference/bitter-chill", "Bitter Chill", 15,
  `<p>Beginning at 15th level, your creations grasp enemies in the cold throes of winter. While a creature is under the effects of a creation you have used that either reduces its speed or incapacitates it, it suffers cold damage at the start of its turn equal to your Charisma modifier (minimum of one). If damage would normally allow the creature to make a saving throw, this damage does not trigger such effects.</p>`,
);

export const diamondDust = feat(
  "feature/savant/cold-indifference/diamond-dust", "Diamond Dust", 20,
  `<p>At 20th level, you can manifest your inner cold in a veil of frost and snow. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>You are immune to cold damage.</li>
<li>Creatures within range of your Aura of Winter or Touch of Winter now suffer damage from Bitter Chill as if it was a creation, and the damage of Bitter Chill is doubled.</li>
<li>Creatures that move into or start their turn in your Aura of Winter or Touch of Winter must make a Strength saving throw against your creation save DC. On a failed save, the creature's speed is 0 until the end of your next turn.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  frozenSoul, channelConvictionCold, auraOfWinter, bitterChill, diamondDust,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Cold Indifference",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Savants whose hearts are distant from the world, who keep their feelings shut away from others, may manifest the icy cold embrace of winter around them. Those who break past their icy shells will find stout allies who can approach any problem with a level head and cool rationality.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "cold-indifference",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(frozenSoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionCold) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(auraOfWinter) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(bitterChill) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(diamondDust) }]),
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
