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
    _id: generateId(`feature/brawler/style-${slug}`),
    name: `Fighting Style: ${name}`,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "Brawler (Sword Sage) 3",
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

export const brawlerStyles: FeatureItem[] = [
  style(
    "archery",
    "Archery",
    "<p>You gain a +2 bonus to attack rolls you make with ranged weapons.</p>",
    [createDAEEffect("brawler/style-archery", "Archery", [addBonus("system.bonuses.rwak.attack", "2")])],
  ),
  style(
    "blindfighting",
    "Blindfighting",
    "<p>You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total cover, even if blinded or in darkness. Moreover, you can see an invisible creature within range, unless the creature successfully hides.</p>",
  ),
  style(
    "agile-defense",
    "Agile Defense",
    "<p>While you are wearing no armor, you gain a +1 bonus to AC.</p>",
    [createDAEEffect("brawler/style-agile-defense", "Agile Defense", [addBonus("system.attributes.ac.bonus", "1")])],
  ),
  style(
    "wrestling",
    "Wrestling",
    "<p>Your damage dice for your unarmed strikes and natural weapons increase by one step, to a maximum of 1d12. At the start of each of your turns, you can deal 1d4 bludgeoning damage to one creature grappled by you.</p>",
  ),
  style(
    "dueling",
    "Dueling",
    "<p>You gain a +2 damage bonus to a weapon held in one hand if you are holding no other weapons.</p>",
    [createDAEEffect("brawler/style-dueling", "Dueling", [addBonus("system.bonuses.mwak.damage", "2")])],
  ),
  style(
    "great-weapon",
    "Great Weapon Fighting",
    "<p>When you roll damage for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the dice and must use the higher of the two rolls. The weapon must have the two-handed or versatile property for you to gain this benefit.</p>",
  ),
  style(
    "two-weapon",
    "Two-Weapon Fighting",
    "<p>When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack. In addition, when you make an opportunity attack, you can attack with both of your weapons.</p>",
  ),
  style(
    "interception",
    "Interception",
    "<p>When a creature you can see hits a target, including you, within your melee range with an attack, you can use your reaction to reduce the damage the target takes by 1d10 + your level (to a minimum of 0 damage). You must be wielding a simple or martial weapon to use this reaction.</p>",
  ),
  style(
    "thrown-weapon",
    "Thrown Weapon Fighting",
    "<p>You can draw a weapon that has the thrown property as part of the attack you make with the weapon. In addition, when you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll.</p>",
  ),
  style(
    "melee-shooter",
    "Melee Shooter",
    "<p>While you're wielding a ranged weapon, you gain a +1 bonus to the attack and damage rolls and you do not have disadvantage on ranged attacks while a creature is within 5 feet of you.</p>",
    [
      createDAEEffect("brawler/style-melee-shooter", "Melee Shooter", [
        addBonus("system.bonuses.rwak.attack", "1"),
        addBonus("system.bonuses.rwak.damage", "1"),
      ]),
    ],
  ),
  style(
    "versatile",
    "Versatile Fighting",
    "<p>When wielding a weapon with the versatile property with one hand, you gain a +1 bonus to attack rolls. While wielding a weapon with the versatile property with two hands, you gain a +1 bonus to your AC.</p>",
  ),
];
