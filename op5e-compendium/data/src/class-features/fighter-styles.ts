import type { FeatureItem } from "../../schemas/feature.js";
import { generateId } from "../../helpers/id.js";
import { createDAEEffect, addBonus } from "../../helpers/effects.js";

function style(
  slug: string,
  name: string,
  description: string,
  effects: FeatureItem["effects"] = [],
): FeatureItem {
  return {
    _id: generateId(`feature/fighter/style-${slug}`),
    name: `Fighting Style: ${name}`,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "Fighter 1",
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
  };
}

export const styleArchery = style(
  "archery",
  "Archery",
  "<p>You gain a +2 bonus to attack rolls you make with ranged weapons.</p>",
  [createDAEEffect("fighter/style-archery", "Archery", [addBonus("system.bonuses.rwak.attack", "2")])],
);

export const styleBlindFighting = style(
  "blindfighting",
  "Blindfighting",
  "<p>You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an invisible creature within that range, unless the creature successfully hides from you.</p>",
);

export const styleDefense = style(
  "defense",
  "Defense",
  "<p>While you are wearing armor, you gain a +1 bonus to AC.</p>",
  [createDAEEffect("fighter/style-defense", "Defense", [addBonus("system.attributes.ac.bonus", "1")])],
);

export const styleDueling = style(
  "dueling",
  "Dueling",
  "<p>When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.</p>",
  [createDAEEffect("fighter/style-dueling", "Dueling", [addBonus("system.bonuses.mwak.damage", "2")])],
);

export const styleSuperiorTechnique = style(
  "superior-technique",
  "Superior Technique",
  "<p>You learn one maneuver of your choice from among those available to the Battlemaster archetype. If a maneuver you use requires your target to make a saving throw to resist the maneuver's effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice).</p><p>You gain one superiority die, which is a d6 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers. A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest.</p>",
);

export const styleGreatWeapon = style(
  "great-weapon",
  "Great Weapon Fighting",
  "<p>When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.</p>",
);

export const styleTwoWeapon = style(
  "two-weapon",
  "Two-Weapon Fighting",
  "<p>When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack. Additionally, you can make opportunity attacks with your off-hand weapon.</p>",
);

export const styleInterception = style(
  "interception",
  "Interception",
  "<p>When a creature you can see hits a target, other than you, within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes by 1d10 + your proficiency bonus (to a minimum of 0 damage). You must be wielding a shield or a simple or martial weapon to use this reaction.</p>",
);

export const styleUnarmed = style(
  "unarmed",
  "Unarmed Fighting",
  "<p>Your unarmed strikes can deal bludgeoning damage equal to 1d6 + your Strength modifier on a hit. If you aren't wielding any weapons or a shield when you make the attack roll, the d6 becomes a d8.</p><p>At the start of each of your turns, you can deal 1d4 bludgeoning damage to one creature grappled by you.</p>",
);

export const styleThrownWeapon = style(
  "thrown-weapon",
  "Thrown Weapon Fighting",
  "<p>You can draw a weapon that has the thrown property as part of the attack you make with the weapon. In addition, when you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll.</p>",
);

export const styleMeleeShooter = style(
  "melee-shooter",
  "Melee Shooter",
  "<p>You gain a +1 bonus to attack and damage rolls you make with ranged weapons. Being within 5 feet of a hostile creature doesn't impose disadvantage on your ranged attack rolls.</p>",
  [
    createDAEEffect("fighter/style-melee-shooter", "Melee Shooter", [
      addBonus("system.bonuses.rwak.attack", "1"),
      addBonus("system.bonuses.rwak.damage", "1"),
    ]),
  ],
);

export const styleVersatile = style(
  "versatile",
  "Versatile Fighting",
  "<p>While wielding a versatile weapon in one hand, you gain a +1 bonus to attack rolls with that weapon. While wielding it in two hands, you gain a +1 bonus to AC.</p>",
);

export const styleProtection = style(
  "protection",
  "Protection",
  "<p>When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to force the attacker to reroll the attack roll, using the lower result. You must be wielding a shield.</p>",
);

export const fighterStyles: FeatureItem[] = [
  styleArchery,
  styleBlindFighting,
  styleDefense,
  styleDueling,
  styleSuperiorTechnique,
  styleGreatWeapon,
  styleTwoWeapon,
  styleInterception,
  styleUnarmed,
  styleThrownWeapon,
  styleMeleeShooter,
  styleVersatile,
  styleProtection,
];
