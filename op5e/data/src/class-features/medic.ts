import { generateId } from "../../helpers/id.js";
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
      requirements: `Medic ${level}`,
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

export const medicalExpertise = classFeature(
  "feature/medic/medical-expertise",
  "Medical Expertise",
  1,
  `<p>You are particularly adept at healing the wounded. You have advantage on all Wisdom (Medicine) checks made to stabilize dying creatures, and if you roll a 20 on the ability check, the creature regains consciousness with 1 hit point. A creature can only benefit from this effect once and must finish a long rest before it can do so again.</p>
<p>You also gain Expertise in Wisdom (Medicine) checks, and whenever you craft medicines or poisons, it takes you half of the time and cost it normally would.</p>
<p>Additionally, when you stabilize a creature, you can remove one poison or disease from it.</p>`,
);

export const experimentalMedicine = classFeature(
  "feature/medic/experimental-medicine",
  "Experimental Medicine",
  2,
  `<p>Starting at 2nd level, you've developed a type of medicine that massively boosts your physical abilities for an extended period. The medicine is tailored to your physiology, and only you can benefit from it.</p>
<p>As an action on your turn, you can administer this special medicine to yourself, granting you temporary hit points equal to four times your level in this class. When you administer this medicine, additionally choose one of the following enhancements to gain:</p>
<ul>
<li><strong>Hulking Strength.</strong> Your Strength score is set to a number equal to your Wisdom score unless it's already higher. Additionally, your unarmed strikes and any melee weapon you wield deal 1d8 damage of the weapon's type instead of the normal damage.</li>
<li><strong>Nimble Dexterity.</strong> Your Dexterity score is set to a number equal to your Wisdom score unless it's already higher, and your speed increases by 10 feet.</li>
<li><strong>Resilient Constitution.</strong> Your Constitution score is set to a number equal to your Wisdom score unless it's already higher, and you gain advantage on Constitution saving throws.</li>
</ul>
<p>The medicine's effects last for a number of hours equal to half your Medic level rounded down, if your hit points reach 0, or if you willingly end it as a bonus action. While the medicine is active, you can change the enhancement you gained as an action on your turn.</p>
<p>You can use this feature twice, and regain all uses when you finish a short or long rest.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    target: { value: null, width: null, units: "", type: "self" },
    range: { value: null, long: null, units: "self" },
    uses: { value: 2, max: "2", per: "sr", recovery: "", prompt: true },
  },
);

export const rapidRemedy = classFeature(
  "feature/medic/rapid-remedy",
  "Rapid Remedy",
  5,
  `<p>At 5th level, your treatment procedures are fast acting and effective. When you use a creation that restores hit points to a creature with a creation slot of 1st level or higher, you can choose to have the creation count as being cast with one creation slot higher. You can use this feature a number of times equal to 1 + your Wisdom modifier, regaining all uses at the end of a long rest.</p>
<p>At 10th level, all of your creations that restore hit points can benefit from this feature, no longer requiring any uses.</p>`,
  {
    uses: { value: null, max: "1 + @abilities.wis.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const extendedRelease = classFeature(
  "feature/medic/extended-release",
  "Extended Release",
  7,
  `<p>At 7th level, your Experimental Medicine has long lasting effects, even in combat. When you use your Experimental Medicine feature, and you lose your temporary hit points, you still retain the benefits for a number of hours equal to your Wisdom modifier, or until your hit points reach 0.</p>`,
);

export const overheal = classFeature(
  "feature/medic/overheal",
  "Overheal",
  18,
  `<p>At 18th level, your healing becomes unparalleled. When you restore hit points to a creature with a creation of 1st level or higher, you restore the maximum amount of hit points possible instead of rolling.</p>`,
);

export const secretsOfMedicine = classFeature(
  "feature/medic/secrets-of-medicine",
  "Secrets of Medicine",
  18,
  `<p>Beginning at 18th level, you've unraveled the secrets of longevity with your medical expertise. For every 10 years that pass, you age only 1 year.</p>`,
);

export const miracleWorker = classFeature(
  "feature/medic/miracle-worker",
  "Miracle Worker",
  20,
  `<p>At 20th level, you've completely stabilized the formula for your Experimental Medicine, allowing you to use it an unlimited amount of times between rests.</p>
<p>Additionally, you no longer require verbal or somatic components for any medic creations you use and only require material components if they have a listed cost or are consumed upon use.</p>`,
);

export const medicClassFeatures: FeatureItem[] = [
  medicalExpertise,
  experimentalMedicine,
  rapidRemedy,
  extendedRelease,
  overheal,
  secretsOfMedicine,
  miracleWorker,
];
