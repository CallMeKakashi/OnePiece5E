import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";

function feat(
  idPath: string,
  name: string,
  description: string,
  overrides: Partial<FeatureItem["system"]> = {},
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
      requirements: overrides.requirements ?? "Fighter",
      activation: overrides.activation ?? { type: "", cost: null, condition: "" },
      duration: overrides.duration ?? { value: null, units: "" },
      target: overrides.target ?? { value: null, width: null, units: "", type: "" },
      range: overrides.range ?? { value: null, long: null, units: "" },
      uses: overrides.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: overrides.actionType ?? "",
      damage: overrides.damage ?? { parts: [], versatile: "" },
      save: overrides.save ?? { ability: "", dc: null, scaling: "spell" },
      chatFlavor: overrides.chatFlavor ?? "",
      recharge: overrides.recharge ?? { value: null, charged: false },
    },
    effects: [],
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
  };
}

export const fightingStyle = feat(
  "feature/fighter/fighting-style",
  "Fighting Style",
  `<p>You adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again.</p>
<ul>
<li><strong>Archery.</strong> You gain a +2 bonus to attack rolls you make with ranged weapons.</li>
<li><strong>Blindfighting.</strong> You have blindsight with a range of 10 feet.</li>
<li><strong>Defense.</strong> While you are wearing armor, you gain a +1 bonus to AC.</li>
<li><strong>Dueling.</strong> When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.</li>
<li><strong>Superior Technique.</strong> You learn one maneuver of your choice and gain one superiority die (d6).</li>
<li><strong>Great Weapon Fighting.</strong> When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property.</li>
<li><strong>Two-Weapon Fighting.</strong> When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack. You can also make opportunity attacks with your off-hand weapon.</li>
<li><strong>Interception.</strong> When a creature you can see hits a target, other than you, within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes by 1d10 + your proficiency bonus.</li>
<li><strong>Unarmed Fighting.</strong> Your unarmed strikes deal 1d6 bludgeoning damage (1d8 if both hands are free). At the start of each of your turns, you can deal 1d4 bludgeoning damage to one creature grappled by you.</li>
<li><strong>Thrown Weapon Fighting.</strong> You can draw a weapon that has the thrown property as part of the attack you make with the weapon. You gain a +2 bonus to damage rolls with thrown weapons.</li>
<li><strong>Melee Shooter.</strong> You gain a +1 bonus to attack and damage rolls with ranged weapons. Being within 5 feet of a hostile creature doesn't impose disadvantage on your ranged attack rolls.</li>
<li><strong>Versatile Fighting.</strong> While wielding a versatile weapon in one hand, you gain a +1 bonus to attack rolls. While wielding it in two hands, you gain a +1 bonus to AC.</li>
<li><strong>Protection.</strong> When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to force the attacker to reroll the attack roll, using the lower result. You must be wielding a shield.</li>
</ul>`,
  { requirements: "Fighter 1" },
);

export const secondWind = feat(
  "feature/fighter/second-wind",
  "Second Wind",
  `<p>You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.</p>
<p>You can use this feature a number of times equal to your proficiency bonus. You regain all expended uses when you finish a short or long rest.</p>`,
  {
    requirements: "Fighter 1",
    activation: { type: "bonus", cost: 1, condition: "" },
    target: { value: null, width: null, units: "", type: "self" },
    range: { value: null, long: null, units: "self" },
    uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    actionType: "heal",
    damage: { parts: [["1d10 + @classes.fighter.levels", "healing"]], versatile: "" },
  },
);

export const actionSurge = feat(
  "feature/fighter/action-surge",
  "Action Surge",
  `<p>Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action and one additional bonus action.</p>
<p>Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.</p>`,
  {
    requirements: "Fighter 2",
    activation: { type: "special", cost: 1, condition: "" },
    uses: { value: null, max: "@scale.fighter.action-surge-uses", per: "sr", recovery: "", prompt: true },
  },
);

export const extraAttack = feat(
  "feature/fighter/extra-attack",
  "Extra Attack",
  `<p>Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
<p>The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.</p>`,
  { requirements: "Fighter 5" },
);

export const indomitable = feat(
  "feature/fighter/indomitable",
  "Indomitable",
  `<p>Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you make the new saving throw with advantage, and you must use the new roll.</p>
<p>You can use this feature once between short rests. You can use it twice between short rests starting at 13th level and three times between short rests starting at 17th level.</p>`,
  {
    requirements: "Fighter 9",
    activation: { type: "special", cost: 1, condition: "Failed saving throw" },
    uses: { value: null, max: "@scale.fighter.indomitable-uses", per: "sr", recovery: "", prompt: true },
  },
);

export const fighterFeatures: FeatureItem[] = [
  fightingStyle,
  secondWind,
  actionSurge,
  extraAttack,
  indomitable,
];
