import { generateId } from "../../helpers/id.js";
import { createDAEEffect, overrideValue, addBonus } from "../../helpers/effects.js";
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
      requirements: `Rogue ${level}`,
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

export const expertise1 = classFeature(
  "feature/rogue/expertise-1",
  "Expertise",
  1,
  `<p>At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.</p><p>At 6th level, you can choose two more of your proficiencies (in skills or with thieves' tools) to gain this benefit.</p>`,
);

export const expertise6 = classFeature(
  "feature/rogue/expertise-6",
  "Expertise",
  6,
  `<p>At 6th level, choose two more of your skill proficiencies, or one skill proficiency and your proficiency with thieves' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.</p>`,
);

export const sneakAttack = classFeature(
  "feature/rogue/sneak-attack",
  "Sneak Attack",
  1,
  `<p>Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.</p><p>You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.</p><p>The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.</p>`,
  {
    damage: { parts: [["@scale.rogue.sneak-attack", ""]], versatile: "" },
  },
);

export const thievesCant = classFeature(
  "feature/rogue/thieves-cant",
  "Thieves' Cant",
  1,
  `<p>During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.</p><p>In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.</p>`,
);

export const cunningAction = classFeature(
  "feature/rogue/cunning-action",
  "Cunning Action",
  2,
  `<p>Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "" } },
);

export const steadyAim = classFeature(
  "feature/rogue/steady-aim",
  "Steady Aim",
  3,
  `<p>As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.</p>`,
  { activation: { type: "bonus", cost: 1, condition: "Haven't moved this turn" } },
);

export const deviousStrike = classFeature(
  "feature/rogue/devious-strike",
  "Devious Strike",
  5,
  `<p>Beginning at 5th level, when you deal Sneak Attack damage, you can forgo some of your Sneak Attack dice to produce a special effect. The save DC equals 8 + your Dexterity modifier + your proficiency bonus.</p><ul><li><strong>Trip (Cost: 1d6).</strong> The target must succeed on a Dexterity saving throw or be knocked prone.</li><li><strong>Withdraw (Cost: 1d6).</strong> You can move up to half your speed without provoking opportunity attacks immediately after dealing the damage.</li></ul>`,
  {
    save: { ability: "dex", dc: null, scaling: "dex" },
  },
);

export const uncannyDodge = classFeature(
  "feature/rogue/uncanny-dodge",
  "Uncanny Dodge",
  5,
  `<p>Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.</p>`,
  { activation: { type: "reaction", cost: 1, condition: "Hit by an attack you can see" } },
);

export const evasion = classFeature(
  "feature/rogue/evasion",
  "Evasion",
  7,
  `<p>Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.</p>`,
  {},
  [
    createDAEEffect("rogue/evasion", "Evasion", [
      overrideValue("flags.dnd5e.evasion", "1"),
    ]),
  ],
);

export const reliableTalent = classFeature(
  "feature/rogue/reliable-talent",
  "Reliable Talent",
  11,
  `<p>By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.</p>`,
  {},
  [
    createDAEEffect("rogue/reliable-talent", "Reliable Talent", [
      overrideValue("flags.dnd5e.reliableTalent", "1"),
    ]),
  ],
);

export const duplicitousStrike = classFeature(
  "feature/rogue/duplicitious-strike",
  "Duplicitious Strike",
  14,
  `<p>At 14th level, you gain additional Devious Strike options:</p><ul><li><strong>Daze (Cost: 3d6).</strong> The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.</li><li><strong>Knock Out (Cost: 6d6).</strong> The target must succeed on a Constitution saving throw or fall unconscious for 1 minute. The target wakes early if it takes damage or another creature uses an action to shake it awake.</li><li><strong>Obscure (Cost: 3d6).</strong> The target must succeed on a Dexterity saving throw or be blinded until the end of your next turn.</li></ul>`,
  {
    save: { ability: "con", dc: null, scaling: "dex" },
  },
);

export const blindsense = classFeature(
  "feature/rogue/blindsense",
  "Blindsense",
  14,
  `<p>Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 30 feet of you.</p>`,
  {},
  [
    createDAEEffect("rogue/blindsense", "Blindsense", [
      overrideValue("system.attributes.senses.blindsight", "30"),
    ]),
  ],
);

export const slipperyMind = classFeature(
  "feature/rogue/slippery-mind",
  "Slippery Mind",
  15,
  `<p>By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws.</p>`,
  {},
  [
    createDAEEffect("rogue/slippery-mind", "Slippery Mind", [
      addBonus("system.abilities.wis.proficient", "1"),
    ]),
  ],
);

export const elusive = classFeature(
  "feature/rogue/elusive",
  "Elusive",
  18,
  `<p>Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren't incapacitated.</p>`,
  {},
  [
    createDAEEffect("rogue/elusive", "Elusive", [
      overrideValue("flags.dnd5e.elusive", "1"),
    ]),
  ],
);

export const strokeOfLuck = classFeature(
  "feature/rogue/stroke-of-luck",
  "Stroke of Luck",
  20,
  `<p>At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.</p><p>Once you use this feature, you can't use it again until you finish a short or long rest.</p>`,
  {
    uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true },
  },
);

export const rogueClassFeatures: FeatureItem[] = [
  expertise1,
  expertise6,
  sneakAttack,
  thievesCant,
  cunningAction,
  steadyAim,
  deviousStrike,
  uncannyDodge,
  evasion,
  reliableTalent,
  duplicitousStrike,
  blindsense,
  slipperyMind,
  elusive,
  strokeOfLuck,
];
