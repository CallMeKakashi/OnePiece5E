import type { ClassItem } from "../../schemas/class.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import {
  createHitPoints,
  createItemGrant,
  createScaleValue,
  createSubclass,
  createTrait,
  createASI,
  mergeAdvancements,
} from "../../helpers/advancement.js";
import {
  brawling,
  unarmoredDefense,
  spirit,
  unarmoredMovement,
  deflectMissiles,
  braceForImpact,
  extraAttack,
  stunningStrike,
  evasion,
  shakeItOff,
  unarmoredMovementImprovement,
  animalSpirit,
  diamondSoul,
  timelessBody,
  immortalWill,
  endlessSpirit,
} from "../class-features/brawler.js";

const CLS = "class/brawler";

function featureUuid(id: string): string {
  return compendiumUuid("class-features", id);
}

export const brawler: ClassItem = {
  _id: generateId(CLS),
  name: "Brawler",
  type: "class",
  img: "icons/skills/melee/unarmed-punch-fist.webp",
  system: {
    description: {
      value: `<p>A master of unarmed combat and inner spirit, the Brawler channels willpower and grit into devastating strikes. Whether wielding fists, improvised weapons, or simple arms, Brawlers rely on speed, discipline, and an unbreakable fighting spirit to overcome any challenge.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "brawler",
    levels: 1,
    hitDice: "d8",
    hitDiceUsed: 0,
    advancement: mergeAdvancements(
      createHitPoints(CLS),

      // --- Proficiencies (level 1) ---
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["weapon:sim"],
        hint: "Simple weapons, improvised weapons",
      }, "weapons"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["saves:str", "saves:dex"],
        hint: "Strength, Dexterity",
      }, "saves"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 2,
          pool: [
            "skills:acr", "skills:ath", "skills:his",
            "skills:ins", "skills:rel", "skills:ste",
          ],
        }],
        hint: "Choose 2 skills",
      }, "skills"),

      // --- Level 1: Brawling + Unarmored Defense ---
      createItemGrant(CLS, 1, [
        { uuid: featureUuid(brawling._id) },
        { uuid: featureUuid(unarmoredDefense._id) },
      ]),

      // --- Level 2: Spirit + Unarmored Movement ---
      createItemGrant(CLS, 2, [
        { uuid: featureUuid(spirit._id) },
        { uuid: featureUuid(unarmoredMovement._id) },
      ]),

      // --- Level 3: Subclass + Deflect Missiles ---
      createSubclass(CLS, 3),
      createItemGrant(CLS, 3, [
        { uuid: featureUuid(deflectMissiles._id) },
      ]),

      // --- Level 4: Brace for Impact ---
      createItemGrant(CLS, 4, [
        { uuid: featureUuid(braceForImpact._id) },
      ], "level-4-features"),

      // --- Level 5: Extra Attack + Stunning Strike ---
      createItemGrant(CLS, 5, [
        { uuid: featureUuid(extraAttack._id) },
        { uuid: featureUuid(stunningStrike._id) },
      ]),

      // --- Level 7: Evasion + Shake it Off ---
      createItemGrant(CLS, 7, [
        { uuid: featureUuid(evasion._id) },
        { uuid: featureUuid(shakeItOff._id) },
      ]),

      // --- Level 9: Unarmored Movement Improvement ---
      createItemGrant(CLS, 9, [
        { uuid: featureUuid(unarmoredMovementImprovement._id) },
      ]),

      // --- Level 13: Animal Spirit ---
      createItemGrant(CLS, 13, [
        { uuid: featureUuid(animalSpirit._id) },
      ]),

      // --- Level 14: Diamond Soul ---
      createItemGrant(CLS, 14, [
        { uuid: featureUuid(diamondSoul._id) },
      ]),

      // --- Level 15: Timeless Body ---
      createItemGrant(CLS, 15, [
        { uuid: featureUuid(timelessBody._id) },
      ]),

      // --- Level 18: Immortal Will ---
      createItemGrant(CLS, 18, [
        { uuid: featureUuid(immortalWill._id) },
      ]),

      // --- Level 20: Endless Spirit ---
      createItemGrant(CLS, 20, [
        { uuid: featureUuid(endlessSpirit._id) },
      ]),

      // --- ASI: 4, 8, 10, 12, 16, 19 ---
      createASI(CLS, 4),
      createASI(CLS, 8),
      createASI(CLS, 10),
      createASI(CLS, 12),
      createASI(CLS, 16),
      createASI(CLS, 19),

      // --- Scale Values ---
      createScaleValue(CLS, "brawling-die", "dice", {
        1: { number: 1, faces: 6 } as any,
        6: { number: 1, faces: 8 } as any,
        11: { number: 1, faces: 10 } as any,
        16: { number: 1, faces: 12 } as any,
      }),
      createScaleValue(CLS, "spirit-points", "number", {
        2: { value: 2 },
        3: { value: 3 },
        4: { value: 4 },
        5: { value: 5 },
        6: { value: 6 },
        7: { value: 7 },
        8: { value: 8 },
        9: { value: 9 },
        10: { value: 10 },
        11: { value: 11 },
        12: { value: 12 },
        13: { value: 13 },
        14: { value: 14 },
        15: { value: 15 },
        16: { value: 16 },
        17: { value: 17 },
        18: { value: 18 },
        19: { value: 19 },
        20: { value: 20 },
      }),
      createScaleValue(CLS, "unarmored-movement", "number", {
        2: { value: 10 },
        6: { value: 15 },
        10: { value: 20 },
        14: { value: 25 },
        18: { value: 30 },
      }),
    ) as any,
    spellcasting: { progression: "none", ability: "" },
    wealth: "",
  },
  effects: [],
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
} as unknown as ClassItem;
