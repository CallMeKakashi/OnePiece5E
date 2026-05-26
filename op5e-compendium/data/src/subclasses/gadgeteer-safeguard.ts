import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/gadgeteer/safeguard";

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
      requirements: `Gadgeteer (Safeguard) ${level}`,
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

export const appliedAegis = feat(
  "feature/gadgeteer/safeguard/applied-aegis", "Applied Aegis", 3,
  `<p>Starting at 3rd level, you can create an Applied Aegis, the apex of your defensive creations. Over the course of 1 hour, you can use your tinker's tools to modify one shield into an Applied Aegis. It gains the following benefits:</p>
<ul>
<li>You can use the Aegis to shove and resist being shoved or grappled, utilizing your Intelligence (Engineering) skill instead of Strength (Athletics).</li>
<li>When you succeed a shove contest with your Aegis, the enemy creature takes 2d6 force damage.</li>
<li>The Aegis counts as an apparatus for your gadgeteer creations.</li>
<li>The Aegis counts as a martial melee weapon that deals 1d8 force damage. It has the versatile (1d10), and thrown property (30/120ft).</li>
<li>You can use your Intelligence score, rather than Strength, for the attack and damage rolls with the Aegis. It returns to your hand after being thrown.</li>
</ul>
<p>You can only have one Applied Aegis at any time. If you create a new Aegis, the old one immediately ceases to function and becomes a shield again.</p>`,
);

export const fortificationZone = feat(
  "feature/gadgeteer/safeguard/fortification-zone", "Fortification Zone", 3,
  `<p>Also at 3rd level, you can utilize your Aegis to protect your allies from a distance. When a creature you can see attacks a target, including yourself, that is within 30 feet of you, you can use your reaction to reroll the attack roll, and the lowest takes effect. You must be wielding your Aegis.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "Creature within 30 ft is attacked" } },
);

export const immovableObject = feat(
  "feature/gadgeteer/safeguard/immovable-object", "Immovable Object", 5,
  `<p>Beginning at 5th level, you can attack twice, instead of once, when you take the Attack action on your turn and attack with your Aegis.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>
<p>In addition, while wielding your Aegis, you cannot be knocked prone or moved against your will, and you count as one size larger when it comes to shoving.</p>`,
);

export const dauntlessDesign = feat(
  "feature/gadgeteer/safeguard/dauntless-design", "Dauntless Design", 9,
  `<p>Beginning at 9th level, your Aegis' design provides a near perfect defense. As a reaction to a creature failing a saving throw within 30ft of you, while you wield your Aegis, you cause them to roll again. If they still fail, they take half damage, or no damage if they succeed.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "Creature within 30 ft fails a saving throw" } },
);

export const ultimateAegis = feat(
  "feature/gadgeteer/safeguard/ultimate-aegis", "Ultimate Aegis", 15,
  `<p>Starting at 15th level, your Aegis has reached its peak performance. It gains the following benefits:</p>
<ul>
<li>If you have already used your reaction to use either your Fortification Zone or Dauntless Design features, you can choose to gain another reaction to use those features again for that round. You can use this feature a number of times equal to your Intelligence modifier, regaining all uses back on a long rest.</li>
<li>Any creature you have shoved while wielding your Aegis is knocked back 15ft instead of 5ft. Additionally, you count as two sizes larger when it comes to shoving.</li>
</ul>`,
  { uses: { value: null, max: "@abilities.int.mod", per: "lr", recovery: "", prompt: true } },
);

export const features: FeatureItem[] = [
  appliedAegis, fortificationZone, immovableObject, dauntlessDesign, ultimateAegis,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Safeguard",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The Safeguard and their stalwart aegis is a master of keeping others out of harm's way, and shove back against any threat. Forged for the purpose to rend all opposing force null. The Safeguard is an unstoppable warden, unable to be kept down, and unpierced, like an iron wall.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "safeguard",
    classIdentifier: "gadgeteer",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(appliedAegis) }, { uuid: fUuid(fortificationZone) }]),
      createItemGrant(SC_ID, 5, [{ uuid: fUuid(immovableObject) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(dauntlessDesign) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(ultimateAegis) }]),
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
