import { generateId } from "../../helpers/id.js";
import { createDAEEffect, overrideValue } from "../../helpers/effects.js";
import type { FeatureItem } from "../../schemas/feature.js";

function classFeature(
  idPath: string,
  name: string,
  level: number,
  description: string,
  extra: Partial<FeatureItem["system"]> = {},
  effects: FeatureItem["effects"] = [],
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Bard ${level}`,
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
    effects,
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
}

export const creativitySpellcasting = classFeature(
  "feature/bard/creativity-spellcasting",
  "Creativity (Spellcasting)",
  1,
  `<p>You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. Your creations are part of your vast repertoire, magic that you can tune to different situations.</p>
<p><strong>Tricks (Cantrips).</strong> You know a number of tricks from the bard creation list. You learn additional bard tricks of your choice at higher levels, as shown in the Tricks Known column of the Bard table.</p>
<p><strong>Creation Slots.</strong> The Bard table shows how many creation slots you have to use your bard creations of 1st level and higher. To use one of these creations, you must expend a slot of the creation's level or higher. You regain all expended creation slots when you finish a long rest.</p>
<p><strong>Creations Known.</strong> You know a number of bard creations of your choice shown in the Bard table. Each of these creations must be of a level for which you have creation slots. Whenever you gain a level in this class, you can replace one bard creation you know with another from the bard creation list.</p>
<p><strong>Creative Ability (Spellcasting Ability).</strong> Charisma is your creative ability for your bard creations. You use your Charisma whenever a creation refers to your creative ability.</p>
<p><strong>Creation save DC</strong> = 8 + your proficiency bonus + your Charisma modifier</p>
<p><strong>Creation Attack modifier</strong> = your proficiency bonus + your Charisma modifier</p>
<p><strong>Routine Usage (Ritual Casting).</strong> You can use any bard creation you know as a routine if that creation has the routine tag.</p>
<p><strong>Apparatus (Spellcasting Focus).</strong> You can use a musical instrument as an apparatus for your bard creations.</p>`,
);

export const bardicInspiration = classFeature(
  "feature/bard/bardic-inspiration",
  "Bardic Inspiration",
  1,
  `<p>You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose a creature within 60 feet of you who can hear you (can include yourself). That creature gains one Bardic Inspiration die, a d6.</p>
<p>Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.</p>
<p>You can use this feature a number of times equal to 1 + your Charisma modifier. You regain any expended uses when you finish a long rest.</p>
<p>Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    range: { value: 60, long: null, units: "ft" },
    uses: { value: null, max: "1 + @abilities.cha.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const jackOfAllTrades = classFeature(
  "feature/bard/jack-of-all-trades",
  "Jack of All Trades",
  2,
  `<p>Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.</p>`,
  {},
  [
    createDAEEffect("bard/jack-of-all-trades", "Jack of All Trades", [
      overrideValue("flags.dnd5e.jackOfAllTrades", "1"),
    ]),
  ],
);

export const harmonicVitality = classFeature(
  "feature/bard/harmonic-vitality",
  "Harmonic Vitality",
  2,
  `<p>Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies. When you use an ability or creation that restores hit points, you can increase the total number of hit points restored by 1d6.</p>
<p>The bonus to healing increases when you reach certain levels in this class: to 1d8 at 5th level, to 1d10 at 10th level, and to 1d12 at 15th level.</p>
<p>You can use this feature a number of times equal to 1 + your Charisma modifier, regaining all uses at the end of a long rest.</p>`,
  {
    uses: { value: null, max: "1 + @abilities.cha.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const expertise3 = classFeature(
  "feature/bard/expertise-3",
  "Expertise",
  3,
  `<p>At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.</p>
<p>At 10th level, you can choose two more of your proficiencies to gain this benefit.</p>`,
);

export const fontOfInspiration = classFeature(
  "feature/bard/font-of-inspiration",
  "Font of Inspiration",
  5,
  `<p>Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.</p>`,
);

export const countercharm = classFeature(
  "feature/bard/countercharm",
  "Countercharm",
  6,
  `<p>At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As a reaction to a creature failing an effect that would leave them charmed or frightened, you can make them succeed instead. A creature must be within 60 ft range of yourself and able to hear you to gain this benefit.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Creature within 60 ft fails charm/frighten save" },
    range: { value: 60, long: null, units: "ft" },
  },
);

export const expertise10 = classFeature(
  "feature/bard/expertise-10",
  "Expertise",
  10,
  `<p>At 10th level, choose two more of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.</p>`,
);

export const musicalSecrets10 = classFeature(
  "feature/bard/musical-secrets-10",
  "Musical Secrets",
  10,
  `<p>At 10th level, you've gathered inspiration from creations of a wide spectrum of disciplines. Choose two creations from any class creation list found in this document, including this one. The creation must be of a level you can use, as shown on the Bard table, or a trick.</p>
<p>The chosen creations count as bard creations for you and are included in the Creations Known column on the Bard table.</p>`,
);

export const fontOfVitality = classFeature(
  "feature/bard/font-of-vitality",
  "Font of Vitality",
  10,
  `<p>At 10th level, you regain all of your expended uses of Harmonic Vitality when you finish a short or long rest.</p>`,
);

export const countercharmImprovement = classFeature(
  "feature/bard/countercharm-improvement",
  "Countercharm Improvement",
  13,
  `<p>At 13th level, you gain the ability to protect multiple people from mind-influencing effects. When you use Countercharm, you can instead target a number of creatures equal to your Charisma modifier.</p>`,
);

export const musicalSecrets14 = classFeature(
  "feature/bard/musical-secrets-14",
  "Musical Secrets",
  14,
  `<p>At 14th level, you learn two additional creations from any class creation list. The creation must be of a level you can use, as shown on the Bard table, or a trick. The chosen creations count as bard creations for you.</p>`,
);

export const musicalSecrets18 = classFeature(
  "feature/bard/musical-secrets-18",
  "Musical Secrets",
  18,
  `<p>At 18th level, you learn two additional creations from any class creation list. The creation must be of a level you can use, as shown on the Bard table, or a trick. The chosen creations count as bard creations for you.</p>`,
);

export const limitlessInspiration = classFeature(
  "feature/bard/limitless-inspiration",
  "Limitless Inspiration",
  20,
  `<p>At 20th level, you gain additional uses of Bardic Inspiration equal to your proficiency bonus.</p>`,
);

export const bardClassFeatures: FeatureItem[] = [
  creativitySpellcasting,
  bardicInspiration,
  jackOfAllTrades,
  harmonicVitality,
  expertise3,
  fontOfInspiration,
  countercharm,
  expertise10,
  musicalSecrets10,
  fontOfVitality,
  countercharmImprovement,
  musicalSecrets14,
  musicalSecrets18,
  limitlessInspiration,
];
