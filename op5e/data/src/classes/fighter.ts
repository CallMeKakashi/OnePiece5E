import type { ClassItem } from "../../schemas/class.js";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import {
  createHitPoints,
  createItemGrant,
  createItemChoiceRestricted,
  createScaleValue,
  createSubclass,
  createTrait,
  createASI,
  mergeAdvancements,
} from "../../helpers/advancement.js";

const CLS = "class/fighter";

function fUuid(path: string): string {
  return compendiumUuid("class-features", generateId(path));
}

function hakiUuid(slug: string): string {
  return compendiumUuid("class-features", generateId(`feature/haki/${slug}`));
}

export const fighter: ClassItem = {
  _id: generateId(CLS),
  name: "Fighter",
  type: "class",
  img: "icons/skills/melee/hand-grip-sword-red.webp",
  system: {
    description: {
      value:
        "<p>A master of martial combat, skilled with a variety of weapons and armor. Fighters learn the basics of all combat styles. Every fighter can swing an axe, fence with a rapier, wield a longsword or a greatsword, use a bow, and even trap foes in a net with some degree of skill. Likewise, a fighter is adept with shields and every form of armor.</p>",
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "fighter",
    levels: 1,
    hitDice: "d10",
    hitDiceUsed: 0,
    advancement: mergeAdvancements(
      createHitPoints(CLS),

      // --- Haki progression scaffold (used by OP5e Haki feat tiers) ---
      createScaleValue(CLS, "haki-tier", "number", {
        1: { value: 0 },
        8: { value: 1 },
        10: { value: 2 },
        12: { value: 3 },
        14: { value: 4 },
        16: { value: 5 },
      }),

      // --- Proficiencies (level 1) ---
      createTrait(
        CLS, 1,
        { mode: "default", grants: ["armor:lgt", "armor:med", "armor:hvy", "armor:shl"] },
        "armor",
      ),
      createTrait(
        CLS, 1,
        { mode: "default", grants: ["weapon:sim", "weapon:mar"] },
        "weapons",
      ),
      createTrait(
        CLS, 1,
        { mode: "default", grants: ["saves:str", "saves:con"] },
        "saves",
      ),
      createTrait(
        CLS, 1,
        {
          mode: "default",
          grants: [],
          choices: [{
            count: 2,
            pool: [
              "skills:acr", "skills:ani", "skills:ath", "skills:his",
              "skills:ins", "skills:itm", "skills:prc", "skills:sur",
            ],
          }],
        },
        "skills",
      ),

      // --- Level 1: Fighting Style + Second Wind ---
      createItemGrant(CLS, 1, [
        { uuid: fUuid("feature/fighter/fighting-style") },
        { uuid: fUuid("feature/fighter/second-wind") },
      ]),

      // --- Level 2: Action Surge ---
      createItemGrant(CLS, 2, [
        { uuid: fUuid("feature/fighter/action-surge") },
      ]),

      // --- Level 3: Subclass ---
      createSubclass(CLS, 3),

      // --- ASI: 4, 6, 8, 12, 14, 16, 19 ---
      createASI(CLS, 4),
      createASI(CLS, 6),
      createASI(CLS, 8),
      createASI(CLS, 12),
      createASI(CLS, 14),
      createASI(CLS, 16),
      createASI(CLS, 19),

      // --- Haki feat choices (restricted pool) ---
      createItemChoiceRestricted(CLS, 8, [
        hakiUuid("armament-novice"),
        hakiUuid("observation-novice"),
        hakiUuid("conqueror-novice"),
      ], { label: "Haki (Novice)" }),
      createItemChoiceRestricted(CLS, 10, [
        hakiUuid("armament-apprentice"),
        hakiUuid("observation-apprentice"),
        hakiUuid("conqueror-apprentice"),
      ], { label: "Haki (Apprentice)" }),
      createItemChoiceRestricted(CLS, 12, [
        hakiUuid("armament-journeyman"),
        hakiUuid("observation-journeyman"),
        hakiUuid("conqueror-journeyman"),
      ], { label: "Haki (Journeyman)" }),
      createItemChoiceRestricted(CLS, 14, [
        hakiUuid("armament-adept"),
        hakiUuid("observation-adept"),
        hakiUuid("conqueror-adept"),
      ], { label: "Haki (Adept)" }),
      createItemChoiceRestricted(CLS, 16, [
        hakiUuid("armament-master"),
        hakiUuid("observation-master"),
        hakiUuid("conqueror-master"),
      ], { label: "Haki (Master)" }),

      // --- Level 5: Extra Attack ---
      createItemGrant(CLS, 5, [
        { uuid: fUuid("feature/fighter/extra-attack") },
      ]),

      // --- Level 9: Indomitable ---
      createItemGrant(CLS, 9, [
        { uuid: fUuid("feature/fighter/indomitable") },
      ]),

      // --- Scale Values ---
      createScaleValue(CLS, "extra-attack", "number", {
        5: { value: 2 },
        11: { value: 3 },
        20: { value: 4 },
      }),
      createScaleValue(CLS, "indomitable-uses", "number", {
        9: { value: 1 },
        13: { value: 2 },
        17: { value: 3 },
      }),
      createScaleValue(CLS, "action-surge-uses", "number", {
        2: { value: 1 },
        17: { value: 2 },
      }),
    ),
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
};
