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
      requirements: `Marksman ${level}`,
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

export const deftExplorer1 = classFeature(
  "feature/marksman/deft-explorer-1",
  "Deft Explorer",
  1,
  `<p>You are an unsurpassed explorer and survivor. Choose one of the following benefits, and then choose another one at 6th and 10th level.</p>
<p><strong>Canny.</strong> Choose two of your skill proficiencies. You gain expertise with the chosen skills. In addition, thanks to your extensive wandering, you can no longer get lost by natural means.</p>
<p><strong>Roving.</strong> Your walking speed increases by 10, and you gain a climbing speed and a swimming speed equal to your walking speed.</p>
<p><strong>Tireless.</strong> As a bonus action, you can give yourself a number of temporary hit points equal to 1d10 + your level. You can use this ability a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest. In addition, whenever you finish a short rest, your exhaustion level, if any, is decreased by 1.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "Tireless option" },
    uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    damage: { parts: [["1d10 + @classes.marksman.levels", "temphp"]], versatile: "" },
  },
);

export const deftExplorer6 = classFeature(
  "feature/marksman/deft-explorer-6",
  "Deft Explorer",
  6,
  `<p>At 6th level, choose another benefit from the Deft Explorer options: Canny, Roving, or Tireless.</p>`,
);

export const deftExplorer10 = classFeature(
  "feature/marksman/deft-explorer-10",
  "Deft Explorer",
  10,
  `<p>At 10th level, choose your final benefit from the Deft Explorer options: Canny, Roving, or Tireless.</p>`,
);

export const favoredMark = classFeature(
  "feature/marksman/favored-mark",
  "Favored Mark",
  1,
  `<p>You can use your uncanny precision to mark a target for termination. As a bonus action, you can mark a creature that you can see as your favored mark for 1 hour or until you mark another creature.</p>
<p>You don't have disadvantage on ranged weapon attacks at long range against the marked target, and once per turn when you hit a marked target with a weapon attack you can choose to deal an additional 1d6 damage to it. If the target of your mark is reduced to 0 hit points, you can immediately use your reaction to mark another creature without expending a use of this feature.</p>
<p>Additionally, you have advantage on Intelligence (Investigation) and Wisdom (Perception) checks made to spot the mark.</p>
<p>You can use this feature a number of times equal to 1 + your Wisdom modifier (minimum of once) and regain all uses when you finish a short or long rest. The damage increases as you gain levels: d8 at 5th level, d10 at 14th level, and d12 at 20th level.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 1, units: "hour" },
    uses: { value: null, max: "1 + @abilities.wis.mod", per: "sr", recovery: "", prompt: true },
    damage: { parts: [["@scale.marksman.favored-mark", ""]], versatile: "" },
  },
);

export const creativity = classFeature(
  "feature/marksman/creativity",
  "Creativity",
  2,
  `<p>At 2nd level, your passionate soul finally stirs enough to awaken the power slumbering within. You learn to prepare and use creations (spells) from the marksman creation list using Wisdom as your creative ability.</p>
<p><strong>Creation save DC</strong> = 8 + your proficiency bonus + your Wisdom modifier</p>
<p><strong>Creation Attack modifier</strong> = your proficiency bonus + your Wisdom modifier</p>
<p>You prepare a number of creations equal to your Wisdom modifier + half your marksman level (rounded down, minimum 1). You regain all expended creation slots when you finish a long rest.</p>`,
);

export const fightingStyle = classFeature(
  "feature/marksman/fighting-style",
  "Fighting Style",
  2,
  `<p>At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the options from the Marksman Styles section. Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to marksmen.</p>`,
);

export const quickOnTheDraw = classFeature(
  "feature/marksman/quick-on-the-draw",
  "Quick On The Draw",
  3,
  `<p>Also at 3rd level, your speed and trigger finger is almost unmatched in combat. You have advantage on initiative rolls, and you can draw a weapon when you roll initiative.</p>
<p>Additionally, you ignore the reload and loading properties of ranged weapons.</p>`,
  {},
  [
    createDAEEffect("marksman/quick-on-the-draw", "Quick On The Draw", [
      overrideValue("flags.dnd5e.initiativeAdv", "1"),
    ]),
  ],
);

export const extraAttack = classFeature(
  "feature/marksman/extra-attack",
  "Extra Attack",
  5,
  `<p>Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>`,
  {
    chatFlavor: "Attack action attacks: 2",
  },
);

export const landsStride = classFeature(
  "feature/marksman/lands-stride",
  "Land's Stride",
  8,
  `<p>Starting at 8th level, your constant travels enable you to cross any hazard that comes your way at a quick pace. Your movement speed cannot be reduced or impeded by hazards or physical obstruction such as difficult terrain, climbing, swimming, etc. This does not extend to effects such as being grappled, restrained, and incapacitated.</p>
<p>In addition, as a bonus action, you can take the Dash action.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "Dash action" },
  },
);

export const volley = classFeature(
  "feature/marksman/volley",
  "Volley",
  9,
  `<p>Starting at 9th level, you can unleash volleys of ranged attacks upon enemies. When you take the Attack action and attack with a ranged weapon, you can choose one target within range of the weapon and make a single weapon attack against it and each creature of your choice within 10 feet of it as part of the same action.</p>`,
);

export const eagleEyes = classFeature(
  "feature/marksman/eagle-eyes",
  "Eagle Eyes",
  10,
  `<p>Starting at 10th level, your eyes have become that of an apex predator and there is nothing that escapes them. You gain the following benefits:</p>
<ul>
<li>You can see up to 1 mile away with no difficulty, able to discern even fine details as though looking at something no more than 100 feet away from you.</li>
<li>You never have disadvantage on ranged weapon attacks.</li>
<li>You have advantage on Wisdom (Perception) checks while you are not incapacitated.</li>
<li>The normal and max range of all ranged weapons and cannons you are proficient with doubles.</li>
</ul>`,
);

export const vigilantGaze = classFeature(
  "feature/marksman/vigilant-gaze",
  "Vigilant Gaze",
  14,
  `<p>Starting at 14th level, you can take the Search action as a bonus action on your turn. Additionally, you gain blindsight of 30 ft range.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "Search action" },
  },
  [
    createDAEEffect("marksman/vigilant-gaze", "Vigilant Gaze", [
      overrideValue("system.attributes.senses.blindsight", "30"),
    ]),
  ],
);

export const deadlyMark = classFeature(
  "feature/marksman/deadly-mark",
  "Deadly Mark",
  18,
  `<p>Beginning at 18th level, your knowledge of your mark and hunting prowess have both expanded greatly, making each and every shot against your prey both deadly and efficient.</p>
<p>The additional damage you deal to the creature marked by your Favored Mark feature applies to all of your weapon attacks against them instead of once per turn.</p>`,
);

export const killshot = classFeature(
  "feature/marksman/killshot",
  "Killshot",
  20,
  `<p>At 20th level, your aim becomes completely unerring and extremely lethal.</p>
<p>If you hit a creature marked as your Favored Mark with a weapon attack and the target has 25 hit points remaining or less, you can choose to cause it to die instantly. On a critical hit, this threshold increases to 50 hit points or less.</p>`,
);

export const marksmanClassFeatures: FeatureItem[] = [
  deftExplorer1,
  deftExplorer6,
  deftExplorer10,
  favoredMark,
  creativity,
  fightingStyle,
  quickOnTheDraw,
  extraAttack,
  landsStride,
  volley,
  eagleEyes,
  vigilantGaze,
  deadlyMark,
  killshot,
];
