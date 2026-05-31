import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/savant/thundering-resolve";

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
      requirements: `Savant (Thundering Resolve) ${level}`,
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

export const echoingSoul = feat(
  "feature/savant/thundering-resolve/echoing-soul", "Echoing Soul", 1,
  `<p>Beginning when you unlock this ardent soul at 1st level, you gain resistance to thunder damage. You also learn the Thunder Bolt and Sonic Boom tricks if you don't already know them.</p>`,
);

export const channelConvictionThunder = feat(
  "feature/savant/thundering-resolve/channel-conviction", "Channel Conviction: Thundering Resolve", 3,
  `<p>At 3rd level, you gain the following two Channel Conviction options:</p>
<ul>
<li><strong>Echoing Rebuke.</strong> As a reaction when a creature hits you with a melee attack, you can use Channel Conviction to grant yourself resistance to all the damage dealt. The attacking creature must then succeed on a Constitution saving throw or suffer an equal amount of damage as thunder damage (not calculating for your resistance).</li>
<li><strong>Reverberating Smite.</strong> When you hit with a melee attack and use your Ardent Smite, you can use your Channel Conviction to make the shockwave reverberate. Each creature of your choice within 15 feet of your target must make a Strength saving throw, suffering the damage of your Ardent Smite + your savant level on a failed save, and half as much on a success. On a failed save, a creature is additionally pulled up to 10 feet to an empty square within 5 feet of you.</li>
</ul>`,
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const auraOfTenacity = feat(
  "feature/savant/thundering-resolve/aura-of-tenacity", "Aura of Tenacity", 7,
  `<p>Beginning at 7th level, you emit an aura of imposing strength. Creatures of your choice within 10 feet of you have disadvantage on attack rolls against creatures other than you while you are conscious.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const tenaciousDefenses = feat(
  "feature/savant/thundering-resolve/tenacious-defenses", "Tenacious Defenses", 15,
  `<p>Starting at 15th level, your resilience rises to new heights. Any damage you suffer is reduced by an amount equal to your Charisma modifier (minimum of 0). This reduction can only happen once per instance of damage.</p>`,
);

export const iconOfStrength = feat(
  "feature/savant/thundering-resolve/icon-of-strength", "Icon of Strength", 20,
  `<p>Starting at 20th level, you can transform into a behemoth of strength. As a bonus action, you gain the following benefits for 1 minute:</p>
<ul>
<li>You are blessed with indomitable toughness, granting resistance to bludgeoning, piercing, and slashing damage, as well as immunity to thunder damage.</li>
<li>You cannot be blinded, deafened, paralyzed, petrified, poisoned, stunned, knocked prone, or moved against your will.</li>
<li>Your steps reverberate with crippling shockwaves, causing the ground within 15 feet of you to be difficult terrain for creatures of your choice.</li>
</ul>
<p>Once you use this bonus action, you can't use it again until you finish a long rest, unless you expend a 5th-level creation slot to use it again.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  echoingSoul, channelConvictionThunder, auraOfTenacity, tenaciousDefenses, iconOfStrength,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Thundering Resolve",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Savants who stand tall in the face of any foe, and respond to the greatest threat with a defiant roar, channel a thundering resolve in their strikes. Echoing shockwaves color their attacks and send enemies flying.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "thundering-resolve",
    classIdentifier: "savant",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 1, [{ uuid: fUuid(echoingSoul) }]),
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(channelConvictionThunder) }]),
      createItemGrant(SC_ID, 7, [{ uuid: fUuid(auraOfTenacity) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(tenaciousDefenses) }]),
      createItemGrant(SC_ID, 20, [{ uuid: fUuid(iconOfStrength) }]),
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
