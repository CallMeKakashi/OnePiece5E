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
import {
  rallyingPresence,
  fightingStyleSavant,
  ardentSmite,
  extraAttackSavant,
  auraOfProtection,
  auraOfCourage,
  improvedArdentSmite,
  saviourInNeed,
  auraImprovements,
} from "../class-features/savant.js";

const CLS = "class/savant";

function featureUuid(id: string): string {
  return compendiumUuid("class-features", id);
}

function hakiUuid(slug: string): string {
  return compendiumUuid("class-features", generateId(`feature/haki/${slug}`));
}

export const savant: ClassItem = {
  _id: generateId(CLS),
  name: "Savant",
  type: "class",
  img: "icons/magic/holy/projectiles-blades-salvo-yellow.webp",
  system: {
    description: {
      value: `<p>A warrior driven by an ardent soul, the Savant channels elemental forces through sheer conviction and passion. Part combatant, part leader, the Savant inspires allies and smites foes with the raw power of their inner fire.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "savant",
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
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["armor:lgt", "armor:med", "armor:hvy", "armor:shl"],
        hint: "All armor, shields",
      }, "armor"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["weapon:sim", "weapon:mar"],
        hint: "Simple weapons, martial weapons",
      }, "weapons"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["saves:wis", "saves:cha"],
        hint: "Wisdom, Charisma",
      }, "saves"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 2,
          pool: [
            "skills:ath", "skills:ins", "skills:itm",
            "skills:med", "skills:per", "skills:rel",
          ],
        }],
        hint: "Choose 2 skills",
      }, "skills"),

      // --- Level 1: Ardent Soul, Rallying Presence ---
      createSubclass(CLS, 1),
      createItemGrant(CLS, 1, [
        { uuid: featureUuid(rallyingPresence._id) },
      ]),

      // --- Level 2: Creativity, Fighting Style, Ardent Smite ---
      createItemGrant(CLS, 2, [
        { uuid: featureUuid(fightingStyleSavant._id) },
        { uuid: featureUuid(ardentSmite._id) },
      ]),

      // --- ASI: 4, 8, 12, 16, 19 ---
      createASI(CLS, 4),
      createASI(CLS, 8),
      createASI(CLS, 12),
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
        { uuid: featureUuid(extraAttackSavant._id) },
      ]),

      // --- Level 6: Aura of Protection ---
      createItemGrant(CLS, 6, [
        { uuid: featureUuid(auraOfProtection._id) },
      ]),

      // --- Level 10: Aura of Courage ---
      createItemGrant(CLS, 10, [
        { uuid: featureUuid(auraOfCourage._id) },
      ]),

      // --- Level 11: Improved Ardent Smite ---
      createItemGrant(CLS, 11, [
        { uuid: featureUuid(improvedArdentSmite._id) },
      ]),

      // --- Level 14: Saviour in Need ---
      createItemGrant(CLS, 14, [
        { uuid: featureUuid(saviourInNeed._id) },
      ]),

      // --- Level 18: Aura Improvements ---
      createItemGrant(CLS, 18, [
        { uuid: featureUuid(auraImprovements._id) },
      ]),
    ) as any,
    spellcasting: { progression: "half", ability: "cha" },
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
