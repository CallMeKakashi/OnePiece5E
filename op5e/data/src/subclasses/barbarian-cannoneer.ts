import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/cannoneer";

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
      requirements: `Barbarian (Cannoneer) ${level}`,
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

export const boomstick = feat(
  "feature/barbarian/cannoneer/boomstick", "Boomstick", 3,
  `<p>At 3rd level, you've trained your body to withstand the recoil of smaller cannons. You gain proficiency with cannons and improvised weapons, and can now wield the swivel gun as a weapon, treating it as a ranged improvised weapon with the heavy and two-handed properties. While wielded in your hands, it has a range 60/240. While wielding a swivel gun in this way, you can choose to not have damage spread, as you assert firm control over your aim.</p>
<p>You are proficient with all cannons and use your Strength modifier for the attack and damage rolls.</p>
<p>Additionally, you benefit from Reckless Attack when making ranged attacks with swivel guns, and can add your bonus Rage damage to these attacks. Later when you gain your Brutal Critical feature, it applies to ranged attacks with swivel guns as well.</p>
<p>You can also use the bulk of the cannon to strike at enemies in melee range. In this instance, the swivel gun acts as an improvised weapon that deals 2d6 bludgeoning damage on hit and has the heavy and two-handed properties.</p>
<p>The massive bulk of the cannon makes it unwieldy to use. You have disadvantage on all ranged attack rolls with the swivel gun while you're not raging and wielding it as a ranged improvised weapon.</p>`,
);

export const crazedBravado = feat(
  "feature/barbarian/cannoneer/crazed-bravado", "Crazed Bravado", 6,
  `<p>Beginning at 6th level, you've grown used to the burning of hot iron and thunderous boom of cannons. You gain resistance to fire damage and thunder damage, and immunity to the deafened condition.</p>
<p>In addition, while raging, you can use your object interaction to clean and reload your swivel gun.</p>`,
);

export const packMule = feat(
  "feature/barbarian/cannoneer/pack-mule", "Pack Mule", 10,
  `<p>At 10th level, lugging a massive cannon around has granted you immense physical strength. You gain the following benefits:</p>
<ul>
<li>Your carrying capacity (including maximum load and maximum lift) is doubled, and you have advantage on Strength (Athletics) checks made to push, pull, lift, or break objects.</li>
<li>While raging, you cannot be knocked prone or moved against your will.</li>
<li>You have advantage on Constitution saving throws.</li>
</ul>`,
);

export const blastback = feat(
  "feature/barbarian/cannoneer/blastback", "Blastback", 14,
  `<p>At 14th level, your aim has gotten good enough that you can send enemies flying with your cannon.</p>
<p>Once per turn, while raging and when you hit a creature with a weapon attack using a weapon with the heavy property, you can force the creature to make a Strength saving throw. The DC for the saving throw is calculated as 8 + your proficiency bonus + your Strength modifier. On a failed save, a creature is pushed up to 15 feet away from you and takes additional damage equal to half your Barbarian level (rounded down).</p>`,
  {
    save: { ability: "str", dc: null, scaling: "str" },
  },
);

export const features: FeatureItem[] = [
  boomstick, crazedBravado, packMule, blastback,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Cannoneer",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Every ship needs someone to man the cannons, but barbarians who follow the path of the cannoneer won't settle for leaving their boomstick behind on the ship. Part genius and part madness compels them to sling the massive gun over their shoulder and bring it with them into battle.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "cannoneer",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(boomstick) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(crazedBravado) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(packMule) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(blastback) }]),
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
