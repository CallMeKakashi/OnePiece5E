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
      requirements: `Barbarian ${level}`,
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

export const rage = classFeature(
  "feature/barbarian/rage",
  "Rage",
  1,
  `<p>In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain the following benefits if you aren't wearing heavy armor:</p>
<ul>
<li>You have advantage on Strength checks and Strength saving throws.</li>
<li>When you make a melee weapon attack using Strength, or unarmed strike, you gain a bonus to the damage roll equal to your proficiency bonus.</li>
<li>You have resistance to bludgeoning, piercing, and slashing damage.</li>
</ul>
<p>Your rage lasts for 1 minute, or if you choose to end it early (no action required). It ends early if you have the Incapacitated condition, or if you don heavy armor.</p>
<p>You can enter your Rage the number of times shown for your Barbarian level in the Rages column of the Barbarian Features table. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 1, units: "minute" },
    target: { value: null, width: null, units: "", type: "self" },
    range: { value: null, long: null, units: "self" },
    uses: { value: null, max: "@scale.barbarian.rages", per: "lr", recovery: "", prompt: true },
  },
);

export const unarmoredDefense = classFeature(
  "feature/barbarian/unarmored-defense",
  "Unarmored Defense",
  1,
  `<p>Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.</p>`,
  {},
  [
    createDAEEffect("barbarian/unarmored-defense", "Unarmored Defense", [
      overrideValue(DAE_KEYS.AC_FORMULA, "10 + @abilities.dex.mod + @abilities.wis.mod"),
    ]),
  ],
);

export const recklessAttack = classFeature(
  "feature/barbarian/reckless-attack",
  "Reckless Attack",
  2,
  `<p>Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.</p>`,
);

export const dangerSense = classFeature(
  "feature/barbarian/danger-sense",
  "Danger Sense",
  2,
  `<p>At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, allowing you to react to any source of danger.</p>
<p>You have advantage on Dexterity saving throws against effects that you can see, such as traps and creations. To gain this benefit, you can't be blinded, deafened, or incapacitated.</p>
<p>In addition, while raging, if you see a creature within 5 ft of you get hit by an attack, you can use your reaction to become the target of that attack instead.</p>`,
  {
    activation: {
      type: "reaction",
      cost: 1,
      condition: "While raging, creature within 5 ft hit by attack you can see",
    },
    chatFlavor:
      "Dex saves vs visible effects: advantage when not blinded/deafened/incapacitated (OP5e module); visible source still GM call",
  },
);

export const primalKnowledge3 = classFeature(
  "feature/barbarian/primal-knowledge-3",
  "Primal Knowledge",
  3,
  `<p>When you reach 3rd level, you gain proficiency in one skill of your choice from the list of skills available to barbarians at 1st level.</p>`,
);

export const primalKnowledge7 = classFeature(
  "feature/barbarian/primal-knowledge-7",
  "Primal Knowledge",
  7,
  `<p>At 7th level, you gain proficiency in one skill of your choice from the list of skills available to barbarians at 1st level.</p>`,
);

export const extraAttack = classFeature(
  "feature/barbarian/extra-attack",
  "Extra Attack",
  5,
  `<p>Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>`,
  {
    chatFlavor: "Attack action attacks: 2",
  },
);

export const fastMovement = classFeature(
  "feature/barbarian/fast-movement",
  "Fast Movement",
  5,
  `<p>Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor.</p>`,
  {},
  [
    createDAEEffect("barbarian/fast-movement", "Fast Movement", [
      addBonus("system.attributes.movement.walk", "10"),
    ]),
  ],
);

export const feralInstinct = classFeature(
  "feature/barbarian/feral-instinct",
  "Feral Instinct",
  7,
  `<p>By 7th level, your instincts are so honed that you have advantage on initiative rolls, and as part of the bonus action you take to enter your rage, you can move up to half your speed.</p>
<p>Additionally, if you are surprised at the beginning of combat and aren't Incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.</p>`,
  {},
  [
    createDAEEffect("barbarian/feral-instinct", "Feral Instinct", [
      overrideValue("flags.dnd5e.initiativeAdv", "1"),
    ]),
  ],
);

export const brutalCritical = classFeature(
  "feature/barbarian/brutal-critical",
  "Brutal Critical",
  9,
  `<p>Beginning at 9th level, you can roll one additional set of weapon damage dice when determining the extra damage for a critical hit with a melee attack.</p>
<p>This increases to two additional sets of damage dice at 13th level and three additional sets of damage dice at 17th level.</p>`,
  {
    chatFlavor: "Extra crit damage dice: @scale.barbarian.brutal-critical",
  },
);

export const relentlessRage = classFeature(
  "feature/barbarian/relentless-rage",
  "Relentless Rage",
  11,
  `<p>Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.</p>
<p>Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.</p>`,
  {
    save: { ability: "con", dc: 10, scaling: "flat" },
  },
);

export const persistentRage = classFeature(
  "feature/barbarian/persistent-rage",
  "Persistent Rage",
  15,
  `<p>Beginning at 15th level, you never know when to give up a fight. Your rage duration increases to 10 minutes, and doesn't end unless you are unconscious.</p>`,
);

export const indomitableMight = classFeature(
  "feature/barbarian/indomitable-might",
  "Indomitable Might",
  18,
  `<p>Beginning at 18th level, your might is second to none. When you make a Strength check or Strength saving throw, and the result is less than your Strength score, you can use that score in place of the total.</p>`,
);

export const primalChampion = classFeature(
  "feature/barbarian/primal-champion",
  "Primal Champion",
  20,
  `<p>At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores also increases by 4, to a maximum of 30.</p>`,
  {},
  [
    createDAEEffect("barbarian/primal-champion", "Primal Champion", [
      addBonus("system.abilities.str.value", "4"),
      addBonus("system.abilities.con.value", "4"),
    ]),
  ],
);

export const barbarianClassFeatures: FeatureItem[] = [
  rage,
  unarmoredDefense,
  recklessAttack,
  dangerSense,
  primalKnowledge3,
  primalKnowledge7,
  extraAttack,
  fastMovement,
  feralInstinct,
  brutalCritical,
  relentlessRage,
  persistentRage,
  indomitableMight,
  primalChampion,
];
