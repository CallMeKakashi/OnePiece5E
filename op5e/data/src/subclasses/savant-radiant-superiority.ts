import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/radiant-superiority";

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
      requirements: `Savant (Radiant Superiority) ${level}`,
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

export const shiningSoul = feat(
  "feature/savant/radiant-superiority/shining-soul", "Shining Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain resistance to radiant damage. You also learn the Light and Radiant Bolt tricks if you don't already know them.</p>`,
);

export const channelConvictionRadiant = feat(
  "feature/savant/radiant-superiority/channel-conviction", "Channel Conviction: Radiant Superiority", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Blazing Light.</strong> As a bonus action, you can manifest the element of your soul around a weapon. For 1 minute, your weapon sheds bright light in a 20 feet radius and dim light for another 20 feet, and you can add your Charisma modifier to the attack rolls you make with the weapon.</li>
<li><strong>Commanding Presence.</strong> As an action, you force each creature of your choice that you can see within 30 feet to make a Wisdom saving throw. On a failed save, a creature becomes charmed or frightened of you for 1 minute (your choice). A creature can repeat this saving throw at the end of each of its turns, ending the effect on a success.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const auraOfElegance = feat(
  "feature/savant/radiant-superiority/aura-of-elegance", "Aura of Elegance", 7,
  `<p>Starting at 7th level, you and friendly creatures within 10 feet of you cannot be knocked prone or moved against your will while you are conscious.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const blindingFlare = feat(
  "feature/savant/radiant-superiority/blinding-flare", "Blinding Flare", 15,
  `<p>Beginning at 15th level, you can blind enemies when you strike them with radiant energies. When you deal radiant damage to a creature, you can force it to make a Constitution saving throw against your creation save DC. On a failed save, the creature is blinded until the end of its next turn.</p>
<p>You can use this feature a number of times equal to 1 + your Charisma modifier (minimum of once) and regain all uses when you finish a long rest.</p>`,
  {
    save: { ability: "con", dc: null, scaling: "cha" },
    uses: { value: null, max: "1 + @abilities.cha.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const absoluteAuthority = feat(
  "feature/savant/radiant-superiority/absolute-authority", "Absolute Authority", 20,
  `<p>At 20th level, you can wreathe yourself in light to become a being of perfection. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>You have immunity to radiant damage and resistance against all other forms of damage.</li>
<li>Once when you miss with a weapon or creation attack on your turn, you can reroll the attack and must use the new roll.</li>
<li>When you take the Attack action on your turn, you can make one additional attack as part of that action.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  shiningSoul, channelConvictionRadiant, auraOfElegance, blindingFlare, absoluteAuthority,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Radiant Superiority",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Fueled by their own pride and feelings of superiority, some savants can harness a blazing light at their beck and call. Almost regal in their appearance, these savants can be anything from noble defenders to vain tyrants.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "radiant-superiority",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(shiningSoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionRadiant) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(auraOfElegance) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(blindingFlare) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(absoluteAuthority) }]),
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
