import { generateId } from "../../helpers/id.js";
import { createDAEEffect, upgradeValue } from "../../helpers/effects.js";
import type { FeatureItem } from "../../schemas/feature.js";

function rf(
  idPath: string,
  name: string,
  desc: string,
  req: string,
  extra: Partial<FeatureItem["system"]> = {},
  effects: FeatureItem["effects"] = [],
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "race", subtype: "" },
      requirements: req,
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
      compendiumSource: null, duplicateSource: null,
      coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
}

// ── Base ──

export const minkDarkvision = rf(
  "feature/race/mink/darkvision",
  "Darkvision",
  `<p>You are accustomed to the dark forests of Zou. You have darkvision out to 60 feet and can see in dim light as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>`,
  "Mink",
  {},
  [createDAEEffect("race/mink/darkvision", "Darkvision", [
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const minkNaturalWeapons = rf(
  "feature/race/mink/natural-weapons",
  "Natural Weapons",
  `<p>Due to your appearance being based upon an animal, you also gain their natural weapons. You have natural weapons which you can use to make unarmed strikes. If you hit with them, you deal bludgeoning, piercing, or slashing damage equal to 1d6 + your Strength or Dexterity modifier. You can choose whether to use Strength or Dexterity when attacking with these natural weapons, but must use the same ability score for both the attack and damage roll.</p>`,
  "Mink",
  {
    actionType: "mwak",
    damage: { parts: [["1d6 + @mod", "bludgeoning"]], versatile: "" },
  },
);

export const innerBeast = rf(
  "feature/race/mink/inner-beast",
  "Inner Beast",
  `<p>You can draw upon your bestial blood to greatly boost your speed and strength for a short time. As a bonus action, you can grant yourself advantage on all Strength and Dexterity-based ability checks for 1 minute. During this time, your speed increases by 10 and when you use your Electro trait, you deal additional lightning damage equal to your level.</p>
<p>If the full moon is visible when you make this transformation, you enter Sulong form for the duration, increasing both your Strength and Dexterity scores by 4. This increase can exceed an ability score of 20, but not 30. When this sulong form ends, you suffer one level of exhaustion.</p>
<p>You must finish a long rest before you can use this trait again.</p>`,
  "Mink",
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 1, units: "minute" },
    target: { value: null, width: null, units: "", type: "self" },
    range: { value: null, long: null, units: "self" },
    uses: { value: null, max: "1", per: "lr", recovery: "", prompt: true },
  },
);

export const electro = rf(
  "feature/race/mink/electro",
  "Electro",
  `<p>All minks can generate electricity through their fur. Once per turn when you hit with a weapon attack, you can choose to deal lightning damage instead of the weapon's normal damage. When dealing lightning damage with this attack, the target then cannot take reactions until the start of your next turn.</p>`,
  "Mink",
);

// ── Diurnal ──

export const diurnalNature = rf(
  "feature/race/mink/diurnal/diurnal-nature",
  "Diurnal Nature",
  `<p>You gain proficiency in two of the following skills of your choice: Athletics, History, Medicine, Nature, or Persuasion.</p>`,
  "Mink (Diurnal)",
);

// ── Nocturnal ──

export const nocturnalNature = rf(
  "feature/race/mink/nocturnal/nocturnal-nature",
  "Nocturnal Nature",
  `<p>You gain proficiency in two of the following skills of your choice: Acrobatics, Athletics, Perception, Stealth, or Survival.</p>`,
  "Mink (Nocturnal)",
);

export const minkFeatures: FeatureItem[] = [
  minkDarkvision, minkNaturalWeapons, innerBeast, electro,
  diurnalNature, nocturnalNature,
];
