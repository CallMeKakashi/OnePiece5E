import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/forgemaster";

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
      requirements: `Barbarian (Forgemaster) ${level}`,
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

export const armoredArtisan = feat(
  "feature/barbarian/forgemaster/armored-artisan", "Armored Artisan", 3,
  `<p>Starting when you choose this path at 3rd level, you gain proficiency in smith's tools, as well as in Intelligence (Engineering) checks.</p>`,
);

export const forgemastersArmor = feat(
  "feature/barbarian/forgemaster/forgemasters-armor", "Forgemaster's Armor", 3,
  `<p>Starting when you choose this path at 3rd level, you gain the ability to transform a set of light or medium armor into your Forgemaster's Armor over the course of a long rest. The chosen armor remains as your Forgemaster's Armor until you die, or until you use this ability to make another suit of armor.</p>
<p>When you create this armor, choose a damage type from the following list: bludgeoning, piercing, slashing, fire, lightning, thunder, acid, or cold.</p>
<p>While you are wearing your Forgemaster's Armor, you gain the following benefits:</p>
<ul>
<li>You gain a +1 bonus to your AC.</li>
<li>You can use a bonus action to make one melee weapon attack with your armor against a target within 5 feet of you. If the attack hits, the armor deals 1d6 damage of the type you chose. You use your Strength modifier for the attack and damage rolls.</li>
<li>When you grapple a creature, the target takes 1d6 damage of the chosen type if your grapple check succeeds.</li>
</ul>
<p>The damage die of both the bonus action attack and grapple abilities increases to 1d8 at 6th level, 1d10 at 10th level, and 1d12 at 14th level.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "While wearing Forgemaster's Armor" },
  },
);

export const unrelentingFortress = feat(
  "feature/barbarian/forgemaster/unrelenting-fortress", "Unrelenting Fortress", 6,
  `<p>Beginning at 6th level, developing your armor has granted you the ability to shrug off any punishment. You gain the following benefits while wearing your Forgemaster's Armor:</p>
<ul>
<li>At the start of each of your turns, while you are raging, you gain temporary hit points equal to double your proficiency bonus. They vanish if any of them are left when your rage ends.</li>
<li>You gain resistance to the chosen damage type when you made your Forgemaster's Armor.</li>
</ul>`,
);

export const hostileCharge = feat(
  "feature/barbarian/forgemaster/hostile-charge", "Hostile Charge", 10,
  `<p>Beginning at 10th level, you can run down your enemies, leaving them ultimately devastated.</p>
<p>Once per turn, when you move 20 ft towards a target and hit them with a melee attack, it deals extra damage equal to your level. The damage type is the type you chose when you made your Forgemaster's Armor.</p>`,
);

export const ironRetribution = feat(
  "feature/barbarian/forgemaster/iron-retribution", "Iron Retribution", 10,
  `<p>Beginning at 10th level, when a creature hits you with a melee attack within 5 ft of you, the attacker takes 1d4 damage if you are wearing your Forgemaster's Armor. The damage type is the type you chose when you made your Forgemaster's Armor.</p>
<p>This damage increases to 1d6 at 14th level.</p>`,
);

export const forgedInFire = feat(
  "feature/barbarian/forgemaster/forged-in-fire", "Forged in Fire", 14,
  `<p>Starting at 14th level, your armor is impenetrable, able to resist any onslaught. You gain the following benefits while wearing your Forgemaster's Armor:</p>
<ul>
<li>Your +1 bonus to your AC becomes a +2 bonus.</li>
<li>You gain immunity to the damage type you chose when you made your Forgemaster's Armor.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  armoredArtisan, forgemastersArmor, unrelentingFortress, hostileCharge, ironRetribution, forgedInFire,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Forgemaster",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Forged in iron and scalding flames emerges the expert Forgemaster, proudly donning their creation to the world, their signature armor. Forgemasters imbue their rage into the very metal they sculpt, having it act as a second skin as they show what is truly possible when you take your fate in your own hands.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "forgemaster",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(armoredArtisan) }, { uuid: fUuid(forgemastersArmor) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(unrelentingFortress) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(hostileCharge) }, { uuid: fUuid(ironRetribution) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(forgedInFire) }]),
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
