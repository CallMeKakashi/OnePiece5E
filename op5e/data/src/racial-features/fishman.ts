import { generateId } from "../../helpers/id.js";
import { createDAEEffect, addBonus, customChange, upgradeValue } from "../../helpers/effects.js";
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

export const aquaticAdaption = rf(
  "feature/race/fishman/aquatic-adaption",
  "Aquatic Adaption",
  `<p>You can breathe air and water. You have advantage on all Strength (Athletics) ability checks made while in water. In addition, you gain resistance to cold damage.</p>`,
  "Fishman",
  {},
  [createDAEEffect("race/fishman/aquatic-adaption", "Aquatic Adaption", [
    customChange("system.traits.dr.value", "cold"),
  ])],
);

export const fishmanDarkvision = rf(
  "feature/race/fishman/darkvision",
  "Darkvision",
  `<p>Accustomed to the dark ocean floors where light is scarce, you have darkvision out to 60 feet and can see in dim light as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>`,
  "Fishman",
  {},
  [createDAEEffect("race/fishman/darkvision", "Darkvision", [
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const powerfulBuild = rf(
  "feature/race/fishman/powerful-build",
  "Powerful Build",
  `<p>You count as one size larger when determining your carrying capacity and the weight you can push, drag, lift, and for grapple and shove attempts.</p>`,
  "Fishman",
);

export const speechOfTheSea = rf(
  "feature/race/fishman/speech-of-the-sea",
  "Speech of the Sea",
  `<p>You can communicate simple ideas and words to creatures with a natural swimming speed that are of Large size or smaller. Most sea life cannot form or understand complicated messages, but can communicate simple expressions and desires such as fear, hunger, or joy.</p>`,
  "Fishman",
);

// ── Sharptooth ──

export const frightening = rf(
  "feature/race/fishman/sharptooth/frightening",
  "Frightening",
  `<p>You have proficiency in the Intimidation skill.</p>`,
  "Fishman (Sharptooth)",
);

export const sharptoothNaturalWeapons = rf(
  "feature/race/fishman/sharptooth/natural-weapons",
  "Natural Weapons",
  `<p>You have sharp claws, teeth, or spines that can be used as weapons. Your unarmed strikes deal piercing or slashing damage equal to 1d8 + your Strength modifier instead of the normal damage.</p>`,
  "Fishman (Sharptooth)",
  {
    actionType: "mwak",
    damage: { parts: [["1d8 + @mod", "piercing"]], versatile: "" },
  },
);

// ── Stronghide ──

export const naturalAthlete = rf(
  "feature/race/fishman/stronghide/natural-athlete",
  "Natural Athlete",
  `<p>You have proficiency in the Athletics skill.</p>`,
  "Fishman (Stronghide)",
);

export const strongBody = rf(
  "feature/race/fishman/stronghide/strong-body",
  "Strong Body",
  `<p>Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.</p>`,
  "Fishman (Stronghide)",
  {},
  [createDAEEffect("race/fishman/stronghide/strong-body", "Strong Body", [
    addBonus("system.attributes.hp.bonuses.level", 1),
  ])],
);

// ── Multipod ──

export const manualAgility = rf(
  "feature/race/fishman/multipod/manual-agility",
  "Manual Agility",
  `<p>You have proficiency in the Sleight of Hand skill.</p>`,
  "Fishman (Multipod)",
);

export const ambidextrous = rf(
  "feature/race/fishman/multipod/ambidextrous",
  "Ambidextrous",
  `<p>Having grown up your whole life with extra arms, you gain the benefits of the Two Weapon Fighting Style, allowing you to add your damage modifier when you engage in two weapon fighting. Despite having multiple arms, you can still only attack once with your bonus action and cannot dual wield two-handed weapons, as well as not benefiting from multiple shields.</p>`,
  "Fishman (Multipod)",
);

export const fishmanFeatures: FeatureItem[] = [
  aquaticAdaption, fishmanDarkvision, powerfulBuild, speechOfTheSea,
  frightening, sharptoothNaturalWeapons,
  naturalAthlete, strongBody,
  manualAgility, ambidextrous,
];
