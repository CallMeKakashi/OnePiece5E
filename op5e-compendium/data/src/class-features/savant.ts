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
      requirements: `Savant ${level}`,
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

export const rallyingPresence = classFeature(
  "feature/savant/rallying-presence",
  "Rallying Presence",
  1,
  `<p>At 1st level, your strong personality inspires allies on the battlefield, allowing them to catch their breath and have a second wind. You have a pool of inspiring energy equal to five times your savant level that replenishes on a long rest. As an action, you can touch a willing creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in that pool.</p>
<p>Alternatively, you can expend 5 of these hit points to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of this ability, expending hit points separately for each one.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    target: { value: 1, width: null, units: "", type: "creature" },
    range: { value: null, long: null, units: "touch" },
    uses: { value: null, max: "@classes.savant.levels * 5", per: "lr", recovery: "", prompt: true },
    actionType: "heal",
  },
);

export const fightingStyleSavant = classFeature(
  "feature/savant/fighting-style",
  "Fighting Style",
  2,
  `<p>At 2nd Level, you adopt a particular style of fighting as your specialty. Choose one of the options from the Savant Styles section. Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to savants.</p>`,
);

export const ardentSmite = classFeature(
  "feature/savant/ardent-smite",
  "Ardent Smite",
  2,
  `<p>Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one creation slot to deal damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level creation slot, plus 1d8 for each creation level higher than 1st, to a maximum of 6d8.</p>
<p>The damage type of this extra damage depends on your choice of Ardent Soul.</p>`,
);

export const extraAttackSavant = classFeature(
  "feature/savant/extra-attack",
  "Extra Attack",
  5,
  `<p>Beginning at 5th Level, you can attack twice, instead of once, whenever you take the Attack action on your turn.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>`,
);

export const auraOfProtection = classFeature(
  "feature/savant/aura-of-protection",
  "Aura of Protection",
  6,
  `<p>Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const auraOfCourage = classFeature(
  "feature/savant/aura-of-courage",
  "Aura of Courage",
  10,
  `<p>Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.</p>
<p>At 18th level, the range of this aura increases to 30 feet.</p>`,
);

export const improvedArdentSmite = classFeature(
  "feature/savant/improved-ardent-smite",
  "Improved Ardent Smite",
  11,
  `<p>Starting at 11th level, your power suffuses your entire being, causing every attack you make to carry elemental powers behind them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 damage of the type you chose for your Ardent Soul.</p>`,
);

export const saviourInNeed = classFeature(
  "feature/savant/saviour-in-need",
  "Saviour in Need",
  14,
  `<p>At 14th level, you can draw upon your inner strength to help an ally escape from nefarious effects. As a bonus action, you can end one creative effect on yourself or a willing creature you touch.</p>
<p>You can use this feature a number of times equal to 1 + your Charisma modifier (minimum of once) and regain all uses when you finish a long rest.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    range: { value: null, long: null, units: "touch" },
    uses: { value: null, max: "1 + @abilities.cha.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const auraImprovements = classFeature(
  "feature/savant/aura-improvements",
  "Aura Improvements",
  18,
  `<p>At 18th level, the range of your Aura of Protection, Aura of Courage, and any Ardent Soul aura increases to 30 feet.</p>`,
);

export const savantClassFeatures: FeatureItem[] = [
  rallyingPresence,
  fightingStyleSavant,
  ardentSmite,
  extraAttackSavant,
  auraOfProtection,
  auraOfCourage,
  improvedArdentSmite,
  saviourInNeed,
  auraImprovements,
];
