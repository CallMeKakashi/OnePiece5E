import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/barbarian/storm-herald";

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
      requirements: `Barbarian (Storm Herald) ${level}`,
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

export const ragingStorm = feat(
  "feature/barbarian/storm-herald/raging-storm", "Raging Storm", 3,
  `<p>At 3rd level, you emanate a stormy, violent aura while you rage. The aura extends 10 feet from you in every direction, but not through total cover.</p>
<p>Your aura has an effect that activates when you enter your rage, and you can activate the effect again on each of your turns as a bonus action. If your aura's effects require a saving throw, the DC equals 8 + your proficiency bonus + your Constitution modifier.</p>
<p>Whenever you finish a long rest, choose firestorm, thunderstorm, or blizzard. Your aura's effect depends on that chosen storm, as detailed below.</p>
<ul>
<li><strong>Firestorm.</strong> When this effect is activated, all creatures in your aura other than you take 1d6 fire damage. The damage increases to 2d6 at 5th level, 3d6 at 11th level, and 4d6 at 17th level.</li>
<li><strong>Thunderstorm.</strong> When this effect is activated, you can choose one other creature you can see in your aura. The target must make a Dexterity saving throw. The target takes 1d12 lightning or thunder damage (your choice) on a failed save, or half as much on a successful one. The damage increases to 2d12 at 5th level, 3d12 at 11th level, and 4d12 at 17th level.</li>
<li><strong>Snowstorm.</strong> When this effect is activated, you and each other creature of your choice in your aura gain 1d6 temporary hit points. The temporary hit points increase to 2d6 at 5th level, 3d6 at 11th level, and 4d6 at 17th level.</li>
</ul>`,
  {
    activation: { type: "bonus", cost: 1, condition: "While raging" },
    target: { value: 10, width: null, units: "ft", type: "radius" },
    save: { ability: "con", dc: null, scaling: "con" },
  },
);

export const stormySoul = feat(
  "feature/barbarian/storm-herald/stormy-soul", "Stormy Soul", 6,
  `<p>At 6th level, the storm grants you benefits even when your aura isn't active. The benefits are based on the storm type you chose for your Raging Storm.</p>
<ul>
<li><strong>Firestorm.</strong> You gain resistance to fire damage, and you don't suffer the effects of extreme heat. Moreover, as an action, you can touch a flammable object that isn't being worn or carried by anyone else and set it on fire.</li>
<li><strong>Thunderstorm.</strong> You gain resistance to lightning and thunder damage. Moreover, as an action, you can summon wind, rainfall and the faint sounds of thunder in the distance within a 10 ft radius.</li>
<li><strong>Snowstorm.</strong> You gain resistance to cold damage, and you don't suffer the effects of extreme cold. Moreover, as an action, you can freeze and shape water in a 5-foot cube into ice sculptures, which melt after 1 minute.</li>
</ul>`,
);

export const shieldingStorm = feat(
  "feature/barbarian/storm-herald/shielding-storm", "Shielding Storm", 10,
  `<p>At 10th level, you learn to use your mastery of the storm to protect others. Each creature of your choice has the damage resistance you gained from the Stormy Soul feature while the creature is in the aura of your Raging Storm.</p>`,
);

export const furyOfTheStorm = feat(
  "feature/barbarian/storm-herald/fury-of-the-storm", "Fury of the Storm", 14,
  `<p>At 14th level, the power of the storm you channel grows mightier, lashing out at your foes. The effect is based on the storm type you chose for your Raging Storm.</p>
<ul>
<li><strong>Firestorm.</strong> Immediately after a creature in your aura hits you with an attack, you can use your reaction to force that creature to make a Dexterity saving throw. On a failed save, the creature takes fire damage equal to your barbarian level, or half as much damage on a successful one.</li>
<li><strong>Thunderstorm.</strong> When you hit a creature in your aura with an attack, once per turn, you can force that creature to make a Strength saving throw. On a failed save, the creature takes lightning or thunder damage equal to half your barbarian level and is knocked prone, or half as much damage and not knocked prone on a successful one.</li>
<li><strong>Snowstorm.</strong> Whenever the effect of your Storm Aura is activated, you can choose one creature you can see in the aura. That creature must succeed on a Constitution saving throw. On a failed save, the creature takes cold damage equal to half your barbarian level and its speed is reduced to 0 until the start of your next turn, or half as much damage and its speed is not reduced on a successful one.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  ragingStorm, stormySoul, shieldingStorm, furyOfTheStorm,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Path of the Storm Herald",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>All barbarians harbor a fury within. Their rage grants them superior strength, durability, and speed. Barbarians who follow the path of the storm herald learn to transform that rage into a mantle of nature's pure destructive elements. Most would describe fighting a storm herald as going against a natural disaster.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "storm-herald",
    classIdentifier: "barbarian",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(ragingStorm) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(stormySoul) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(shieldingStorm) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(furyOfTheStorm) }]),
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
