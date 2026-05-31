import { generateId } from "../../helpers/id.js";
import { createDAEEffect, addBonus } from "../../helpers/effects.js";
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

export const humanDetermination = rf(
  "feature/race/human/human-determination",
  "Human Determination",
  `<p>Once when you're reduced to 0 hit points but not killed outright, you can choose to fall to 1 hit point instead. You must finish a long rest before you can use this trait again.</p>`,
  "Human",
  { uses: { value: null, max: "1", per: "lr", recovery: "", prompt: true } },
);

// ── Standard Human ──

export const resourcefulness = rf(
  "feature/race/human/standard/resourcefulness",
  "Resourcefulness",
  `<p>You gain proficiency with one skill or one simple or martial weapon of your choice.</p>`,
  "Human (Standard)",
);

export const strongWill = rf(
  "feature/race/human/standard/strong-will",
  "Strong Will",
  `<p>When you fail a saving throw, you can roll a d4 and add it to the roll, possibly changing the outcome. You can do this a number of times equal to your proficiency bonus, and regain all uses when you finish a long rest.</p>`,
  "Human (Standard)",
  { uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true } },
);

// ── Kuja ──

export const amazonianBond = rf(
  "feature/race/human/kuja/amazonian-bond",
  "Amazonian Bond",
  `<p>You can use the Animal Friend creation at will, however only when targeting beasts that are snakes. If you have the creativity feature, this creation is added to your creation list.</p>`,
  "Human (Kuja)",
);

export const minorHaki = rf(
  "feature/race/human/kuja/minor-haki",
  "Minor Haki",
  `<p>When you make a weapon attack that lets you add your proficiency bonus to the attack roll, you can choose to temporarily infuse the weapon with haki. You add a d4 to the damage roll, and the weapon is considered haki-imbued for the purpose of overcoming resistances and immunities. You can use this feature a number of times equal to your proficiency bonus, and regain all uses when you finish a short or long rest.</p>`,
  "Human (Kuja)",
  {
    uses: { value: null, max: "@prof", per: "sr", recovery: "", prompt: true },
    damage: { parts: [["1d4", ""]], versatile: "" },
  },
);

// ── Long-arm ──

export const longLimbs = rf(
  "feature/race/human/long-arm/long-limbs",
  "Long Limbs",
  `<p>When you wield a weapon or unarmed strikes, your reach with the weapon or your unarmed strikes increases by 5 feet.</p>`,
  "Human (Long-arm)",
);

export const suddenReach = rf(
  "feature/race/human/long-arm/sudden-reach",
  "Sudden Reach",
  `<p>You have advantage on opportunity attacks.</p>`,
  "Human (Long-arm)",
);

// ── Snakeneck ──

export const steadyMind = rf(
  "feature/race/human/snakeneck/steady-mind",
  "Steady Mind",
  `<p>You can add your proficiency bonus to any initiative roll you make. Once when you are surprised while you are conscious, you can choose to act normally on your turn, and must finish a long rest before you can do so again.</p>`,
  "Human (Snakeneck)",
  { uses: { value: null, max: "1", per: "lr", recovery: "", prompt: true } },
);

export const toweringGaze = rf(
  "feature/race/human/snakeneck/towering-gaze",
  "Towering Gaze",
  `<p>You have proficiency in the Perception skill.</p>`,
  "Human (Snakeneck)",
);

// ── Long-leg ──

export const tallStride = rf(
  "feature/race/human/long-leg/tall-stride",
  "Tall Stride",
  `<p>Your walking speed increases by 5 feet, and the distance you can cover with a high or long jump doubles.</p>`,
  "Human (Long-leg)",
  {},
  [createDAEEffect("race/human/long-leg/tall-stride", "Tall Stride", [
    addBonus("system.attributes.movement.walk", 5),
  ])],
);

export const sprint = rf(
  "feature/race/human/long-leg/sprint",
  "Sprint",
  `<p>When you move on your turn, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns.</p>`,
  "Human (Long-leg)",
);

// ── Three-eye ──

export const keeperOfSecrets = rf(
  "feature/race/human/three-eye/keeper-of-secrets",
  "Keeper of Secrets",
  `<p>You have proficiency in the Deception and Insight skills.</p>`,
  "Human (Three-eye)",
);

export const thirdEye = rf(
  "feature/race/human/three-eye/third-eye",
  "Third Eye",
  `<p>You have advantage on saving throws against being blinded or charmed, and on all ability checks you make to see through illusions and mirages.</p>`,
  "Human (Three-eye)",
);

export const secretPotential = rf(
  "feature/race/human/three-eye/secret-potential",
  "Secret Potential",
  `<p>You are eligible to gain the Voice of All Things.</p>`,
  "Human (Three-eye)",
);

export const humanFeatures: FeatureItem[] = [
  humanDetermination,
  resourcefulness, strongWill,
  amazonianBond, minorHaki,
  longLimbs, suddenReach,
  steadyMind, toweringGaze,
  tallStride, sprint,
  keeperOfSecrets, thirdEye, secretPotential,
];
