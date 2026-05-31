import { generateId } from "../../helpers/id.js";
import { createDAEEffect, addBonus, overrideValue } from "../../helpers/effects.js";
import { DAE_KEYS } from "../../schemas/common.js";
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
      requirements: `Brawler ${level}`,
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

export const brawling = classFeature(
  "feature/brawler/brawling",
  "Brawling",
  1,
  `<p>At 1st level, your experience in street fighting gives you mastery of combat styles that use unarmed strikes and brawler weapons, which are improvised weapons and any simple melee weapons that lack the two-handed or heavy property.</p>
<p>You gain the following benefits while you are unarmed or wielding only brawler weapons and you aren't wearing armor or wielding a shield:</p>
<ul>
<li>You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and brawler weapons.</li>
<li>You can roll a d6 in place of the normal damage of your unarmed strike or brawler weapon. This die changes as you gain brawler levels, as shown in the Brawling column of the Brawler table.</li>
<li>When you hit with an unarmed strike, improvised weapon, or brawler weapon, you can choose to make the damage type of the attack bludgeoning, piercing, or slashing.</li>
<li>When you use the Attack action with an unarmed strike or a brawler weapon on your turn, you can make one unarmed strike as a bonus action.</li>
</ul>`,
);

export const unarmoredDefense = classFeature(
  "feature/brawler/unarmored-defense",
  "Unarmored Defense",
  1,
  `<p>Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.</p>`,
  {},
  [
    createDAEEffect("brawler/unarmored-defense", "Unarmored Defense", [
      overrideValue(DAE_KEYS.AC_FORMULA, "10 + @abilities.dex.mod + @abilities.wis.mod"),
    ]),
  ],
);

export const spirit = classFeature(
  "feature/brawler/spirit",
  "Spirit",
  2,
  `<p>Starting at 2nd level, your training allows you to draw upon an inner energy of willpower and grit. Your access to this energy is represented by a number of spirit points. Your brawler level determines the number of points you have, as shown in the Spirit Points column of the Brawler table.</p>
<p>You can spend these points to fuel various spirit features. You start knowing three such features: Flurry of Blows, Patient Defense, and Deft Escape. You learn more spirit features as you gain levels in this class.</p>
<p>When you spend a spirit point, it is unavailable until you finish a short or long rest, at the end of which you psyche your spirit back to full energy.</p>
<p>Some of your spirit features require your target to make a saving throw to resist the feature's effects. The saving throw DC is calculated as follows:</p>
<p><strong>Spirit save DC</strong> = 8 + your Proficiency Bonus + your Wisdom modifier</p>
<p><strong>Flurry of Blows.</strong> Immediately after you take the Attack action on your turn, you can spend 1 spirit point to make two unarmed strikes as a bonus action.</p>
<p><strong>Patient Defense.</strong> You can spend 1 spirit point to take the Dodge action as a bonus action on your turn.</p>
<p><strong>Deft Escape.</strong> While you are grappled, you can spend 1 spirit point to attempt to escape a grapple or restraints as a bonus action.</p>`,
  {
    uses: { value: null, max: "@scale.brawler.spirit-points", per: "sr", recovery: "", prompt: true },
  },
);

export const unarmoredMovement = classFeature(
  "feature/brawler/unarmored-movement",
  "Unarmored Movement",
  2,
  `<p>Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain brawler levels, as shown in the Brawler table.</p>
<p>Additionally, as a bonus action, you can take the Disengage or Dash action, and your jump distance is doubled for the turn.</p>
<p>At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.</p>`,
  {},
  [
    createDAEEffect("brawler/unarmored-movement", "Unarmored Movement", [
      addBonus(DAE_KEYS.SPEED_WALK, "@scale.brawler.unarmored-movement"),
    ]),
  ],
);

export const deflectMissiles = classFeature(
  "feature/brawler/deflect-missiles",
  "Deflect Missiles",
  3,
  `<p>Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by any ranged attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your brawler level.</p>
<p>If you reduce the damage to 0, you can catch it if you have a free hand. If you catch it in this way, you can spend 1 spirit point to make a ranged attack with the weapon or ammunition you caught, as part of the same reaction. You make this attack with proficiency, and the missile counts as a brawler weapon for the attack, which has a normal range of 20 feet and a long range of 60 feet. You do not have close range disadvantage with this attack.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Hit by a ranged attack" },
    chatFlavor: "Damage reduced by 1d10 + DEX mod + @classes.brawler.levels",
  },
);

export const braceForImpact = classFeature(
  "feature/brawler/brace-for-impact",
  "Brace for Impact",
  4,
  `<p>Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your brawler level.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Falling" },
    chatFlavor: "Fall damage reduced by 5 × @classes.brawler.levels",
  },
);

export const extraAttack = classFeature(
  "feature/brawler/extra-attack",
  "Extra Attack",
  5,
  `<p>Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>`,
  {
    chatFlavor: "Attack action attacks: 2",
  },
);

export const stunningStrike = classFeature(
  "feature/brawler/stunning-strike",
  "Stunning Strike",
  5,
  `<p>Starting at 5th level, when you hit another creature with a melee weapon attack, you can spend 1 spirit point to attempt a stunning strike. The target must succeed on a Constitution saving throw against your Spirit DC or be stunned until the end of your next turn.</p>`,
  {
    save: { ability: "con", dc: null, scaling: "wis" },
  },
);

export const evasion = classFeature(
  "feature/brawler/evasion",
  "Evasion",
  7,
  `<p>Beginning at 7th level, your instinctive agility lets you dodge out of the way of certain area effects. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.</p>`,
  {},
  [
    createDAEEffect("brawler/evasion", "Evasion", [
      overrideValue("flags.dnd5e.evasion", "1"),
    ]),
  ],
);

export const shakeItOff = classFeature(
  "feature/brawler/shake-it-off",
  "Shake it Off",
  7,
  `<p>At 7th level, you can use your action to regain hit points equal to three times your brawler level. You must finish a long rest before you can use this feature again.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    target: { value: null, width: null, units: "", type: "self" },
    range: { value: null, long: null, units: "self" },
    uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true },
    actionType: "heal",
    damage: { parts: [["3 * @classes.brawler.levels", "healing"]], versatile: "" },
  },
);

export const unarmoredMovementImprovement = classFeature(
  "feature/brawler/unarmored-movement-improvement",
  "Unarmored Movement Improvement",
  9,
  `<p>At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.</p>`,
);

export const animalSpirit = classFeature(
  "feature/brawler/animal-spirit",
  "Animal Spirit",
  13,
  `<p>Starting at 13th level, your inner spirit burns with a passion that even wild animals can understand. You can speak with all beasts and monstrosities, and understand what they say as well. Additionally, you have advantage on Charisma (Intimidation) ability checks you make towards beasts and monstrosities.</p>`,
);

export const diamondSoul = classFeature(
  "feature/brawler/diamond-soul",
  "Diamond Soul",
  14,
  `<p>Beginning at 14th level, your hardened spirit grants you proficiency in all saving throws.</p>
<p>Additionally, whenever you make a saving throw and fail, you can spend 1 spirit point to reroll it and take the second result.</p>`,
  {},
  [
    createDAEEffect("brawler/diamond-soul", "Diamond Soul", [
      addBonus("system.abilities.con.proficient", "1"),
      addBonus("system.abilities.int.proficient", "1"),
      addBonus("system.abilities.wis.proficient", "1"),
      addBonus("system.abilities.cha.proficient", "1"),
    ]),
  ],
);

export const timelessBody = classFeature(
  "feature/brawler/timeless-body",
  "Timeless Body",
  15,
  `<p>At 15th level, your spirit sustains you so that you suffer none of the frailty of old age, and you can't be aged magically. You can still die of old age, however. Additionally, you no longer require food or water to survive.</p>`,
);

export const immortalWill = classFeature(
  "feature/brawler/immortal-will",
  "Immortal Will",
  18,
  `<p>Starting at 18th level, you can spend 4 spirit points as an action to gain resistance to all damage except force damage for 1 minute. During this time, you have advantage on all attack rolls.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    duration: { value: 1, units: "minute" },
  },
);

export const endlessSpirit = classFeature(
  "feature/brawler/endless-spirit",
  "Endless Spirit",
  20,
  `<p>At 20th level, your pool of spirit becomes an endless well to draw from. If you spend 10 minutes performing only light activities, as if you were taking a short rest, you regain all of your expended Spirit Points.</p>`,
);

export const brawlerClassFeatures: FeatureItem[] = [
  brawling,
  unarmoredDefense,
  spirit,
  unarmoredMovement,
  deflectMissiles,
  braceForImpact,
  extraAttack,
  stunningStrike,
  evasion,
  shakeItOff,
  unarmoredMovementImprovement,
  animalSpirit,
  diamondSoul,
  timelessBody,
  immortalWill,
  endlessSpirit,
];
