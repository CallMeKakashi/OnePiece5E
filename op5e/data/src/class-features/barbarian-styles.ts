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
    _id: generateId(`feature/barbarian/style-${slug}`),
    name: `Fighting Style: ${name}`,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "Barbarian (Blade Master) 3",
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

export const barbarianStyles: FeatureItem[] = [
  style(
    "dueling",
    "Dueling",
    "<p>When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.</p>",
    [createDAEEffect("barbarian/style-dueling", "Dueling", [addBonus("system.bonuses.mwak.damage", "2")])],
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
    "versatile",
    "Versatile Fighting",
    "<p>When wielding a weapon with the versatile property with one hand, you gain a +1 bonus to attack rolls. While wielding a weapon with the versatile property with two hands, you gain a +1 bonus to your AC.</p>",
  ),
];
