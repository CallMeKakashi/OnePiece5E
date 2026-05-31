import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/chromatic-commandment";

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
      requirements: `Brawler (Chromatic Commandment) ${level}`,
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

export const spiritFist = feat(
  "feature/brawler/chromatic-commandment/spirit-fist", "Spirit Fist", 3,
  `<p>When you choose this tradition at 3rd level, you gain the ability to channel your spirit into your unarmed strikes, causing it to burst with elemental energy.</p>
<p>At the end of a long rest, choose one of the following damage types: acid, cold, fire, lightning, poison, necrotic, radiant, or thunder damage. When you damage a target with an unarmed strike, you can change the damage type to the chosen type.</p>
<p>In addition, as a bonus action, you can spend 1 spirit point to surround yourself with your chosen element for 10 minutes. While the elements are present, you gain the following benefits:</p>
<ul>
<li>You can use your Wisdom modifier in place of your Strength modifier when making Strength checks and Strength saving throws.</li>
<li>Your unarmed strikes can use your Wisdom modifier in place of your Strength or Dexterity modifier for the attack and damage rolls, and their damage type is of the one you chose at the end of a long rest.</li>
<li>You gain darkvision for 120 feet.</li>
</ul>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 10, units: "minute" },
  },
);

export const spiritUnleashed = feat(
  "feature/brawler/chromatic-commandment/spirit-unleashed", "Spirit Unleashed", 6,
  `<p>Starting at 6th level, you can channel your spirit to produce destructive waves of energy, expanding the reach of your attacks. You gain the following benefits while you are surrounded by the elements from Spirit Fist:</p>
<ul>
<li>When you make an unarmed strike, your reach for it is 5 feet greater than normal.</li>
<li>When you use your bonus action to dash or disengage, you unleash a burst of elements, giving you a flying speed equal to your walking speed that lasts until the end of your turn.</li>
<li>When you take the Attack action on your turn, you can replace one of the attacks with a wave of elements in either a 20-foot cone or a 30-foot line that is 5 feet wide (your choice). Each creature in that area must make a Dexterity saving throw against your Spirit save DC, taking damage of the chosen type equal to three rolls of your Martial Arts die on a failed save, or half as much damage on a successful one. At 11th level, the damage increases to four rolls. You can use this a number of times equal to your proficiency bonus per long rest, or spend 1 Spirit point to use it again.</li>
</ul>`,
  {
    save: { ability: "dex", dc: null, scaling: "wis" },
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const chromaticAura = feat(
  "feature/brawler/chromatic-commandment/chromatic-aura", "Chromatic Aura", 11,
  `<p>Starting at 11th level, the elements you unleash form an aura around you. While you are surrounded by the elements from Spirit Fist, you gain the following benefits:</p>
<ul>
<li>You and each creature of your choice within 10 ft of you have resistance to the damage type you chose from Spirit Fist.</li>
<li>When you take acid, cold, fire, lightning, poison, necrotic, radiant, or thunder damage, you can use your reaction to reduce the damage you take by 1d10 + your Wisdom modifier + your brawler level.</li>
<li>Once on each of your turns when you hit a target with your unarmed strike, you can deal extra damage to the target equal to your Martial Arts die of the chosen type.</li>
</ul>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Taking elemental damage" },
  },
);

export const ascendantAspect = feat(
  "feature/brawler/chromatic-commandment/ascendant-aspect", "Ascendant Aspect", 17,
  `<p>By 17th level, your connection to your fighting spirit is complete, allowing you to take on an overwhelming and transcending transformation.</p>
<p>As a bonus action, you can expend 4 spirit points to enter your Ascendant Aspect form for 10 minutes (or until you are incapacitated or die), granting you the following benefits:</p>
<ul>
<li>You gain all the benefits of the elements from your Spirit Fist transformation.</li>
<li>You gain a +1 bonus to your AC.</li>
<li>Whenever you use the Extra Attack feature to attack twice, you can instead attack three times.</li>
<li>The wave of destructive energy from your Spirit Unleashed feature becomes either a 60-foot cone, a 90-foot line that is 5 feet wide, or your normal shapes (your choice).</li>
</ul>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 10, units: "minute" },
  },
);

export const features: FeatureItem[] = [
  spiritFist, spiritUnleashed, chromaticAura, ascendantAspect,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Chromatic Commandment",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>There is potential in all creatures, an energy stirring and waiting to be released. Those who follow the ways of this energy are known as the Chromatic Commandment, able to transform the potential energy of their spirit into an overwhelming force of nature through their mastery and understanding of their place in the natural order.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "chromatic-commandment",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(spiritFist) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(spiritUnleashed) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(chromaticAura) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(ascendantAspect) }]),
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
