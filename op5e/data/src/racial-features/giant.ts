import { generateId } from "../../helpers/id.js";
import { createDAEEffect, customChange, upgradeValue } from "../../helpers/effects.js";
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

export const giantSlam = rf(
  "feature/race/giant/giant-slam",
  "Giant Slam",
  `<p>Your unarmed strikes deal 1d8 bludgeoning damage due to your size.</p>`,
  "Giant",
  {
    actionType: "mwak",
    damage: { parts: [["1d8", "bludgeoning"]], versatile: "" },
  },
);

// ── Standard Giant ──

export const giantNaturalAthlete = rf(
  "feature/race/giant/standard/natural-athlete",
  "Natural Athlete",
  `<p>You have proficiency in the Athletics skill.</p>`,
  "Giant (Standard)",
);

export const warriorsMight = rf(
  "feature/race/giant/standard/warriors-might",
  "Warrior's Might",
  `<p>When you successfully hit with an attack, you can choose to deal the maximum damage of your weapon dice. You regain this ability at the end of a short or long rest.</p>`,
  "Giant (Standard)",
  { uses: { value: null, max: "1", per: "sr", recovery: "", prompt: true } },
);

export const giantsEndurance = rf(
  "feature/race/giant/standard/giants-endurance",
  "Giant's Endurance",
  `<p>As a reaction to taking damage, you can reduce the damage by 1d12 + your Constitution modifier. You have three uses of this ability and regain all uses at the end of a short or long rest.</p>`,
  "Giant (Standard)",
  {
    activation: { type: "reaction", cost: 1, condition: "When you take damage" },
    uses: { value: null, max: "3", per: "sr", recovery: "", prompt: true },
  },
);

// ── Ancient Giant ──

export const thickSkin = rf(
  "feature/race/giant/ancient/thick-skin",
  "Thick Skin",
  `<p>Your Armor Class is equal to 14 + your Constitution modifier.</p>`,
  "Giant (Ancient)",
);

export const fearFactor = rf(
  "feature/race/giant/ancient/fear-factor",
  "Fear Factor",
  `<p>Your size and the horns and teeth that adorn your visage send chills down the spines of most men. You have advantage on Intimidation checks against any creature that is at least one size smaller than you.</p>`,
  "Giant (Ancient)",
);

export const ancientNaturalWeapons = rf(
  "feature/race/giant/ancient/natural-weapons",
  "Natural Weapons",
  `<p>All of your unarmed strikes deal 1d10 damage. You can use your teeth and horns to deal piercing damage.</p>`,
  "Giant (Ancient)",
  {
    actionType: "mwak",
    damage: { parts: [["1d10", "piercing"]], versatile: "" },
  },
);

export const titanicStrength = rf(
  "feature/race/giant/ancient/titanic-strength",
  "Titanic Strength",
  `<p>At no point does your strength falter. Whenever you make a Strength check, you can treat the dice roll as a 10, and add additional modifiers.</p>`,
  "Giant (Ancient)",
);

// ── Wotan ──

export const wotanDarkvision = rf(
  "feature/race/giant/wotan/darkvision",
  "Darkvision",
  `<p>You have darkvision out to 60 feet and can see in dim light as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>`,
  "Giant (Wotan)",
  {},
  [createDAEEffect("race/giant/wotan/darkvision", "Darkvision", [
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const wotanAquaticAdaptation = rf(
  "feature/race/giant/wotan/aquatic-adaptation",
  "Aquatic Adaptation",
  `<p>You can breathe air and water. You have advantage on all Strength (Athletics) ability checks made while in water.</p>`,
  "Giant (Wotan)",
);

export const wotanSpeechOfTheSea = rf(
  "feature/race/giant/wotan/speech-of-the-sea",
  "Speech of the Sea",
  `<p>You can communicate simple ideas and words to creatures with a natural swimming speed that are of Large size or smaller. Most sea life cannot form or understand complicated messages, but can communicate simple expressions and desires such as fear, hunger, or joy.</p>`,
  "Giant (Wotan)",
);

// ── Ice Giant ──

export const dexterous = rf(
  "feature/race/giant/ice-giant/dexterous",
  "Dexterous",
  `<p>You are proficient in Acrobatics and Stealth.</p>`,
  "Giant (Ice Giant)",
);

export const frostBorn = rf(
  "feature/race/giant/ice-giant/frost-born",
  "Frost Born",
  `<p>You have resistance to cold damage and can withstand extreme colds. You also ignore difficult terrain created from ice.</p>`,
  "Giant (Ice Giant)",
  {},
  [createDAEEffect("race/giant/ice-giant/frost-born", "Frost Born", [
    customChange("system.traits.dr.value", "cold"),
  ])],
);

export const iceGiantDarkvision = rf(
  "feature/race/giant/ice-giant/darkvision",
  "Darkvision",
  `<p>Your senses allow you to peer past the darkness. You have darkvision out to 60 feet and can see in dim light as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>`,
  "Giant (Ice Giant)",
  {},
  [createDAEEffect("race/giant/ice-giant/darkvision", "Darkvision", [
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const giantFeatures: FeatureItem[] = [
  giantSlam,
  giantNaturalAthlete, warriorsMight, giantsEndurance,
  thickSkin, fearFactor, ancientNaturalWeapons, titanicStrength,
  wotanDarkvision, wotanAquaticAdaptation, wotanSpeechOfTheSea,
  dexterous, frostBorn, iceGiantDarkvision,
];
