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
  createHakiAdvancementChoices,
  createHakiTierScaleValue,
} from "../../helpers/haki-advancement.js";
import { classStartingEquipmentAdvancement } from "./class-equipment-grants.js";
import { MUSICAL_INSTRUMENT_TRAIT_POOL } from "./class-proficiency-pools.js";
import type { ClassItem } from "../../schemas/class.js";
import {
  creativitySpellcasting,
  bardicInspiration,
  jackOfAllTrades,
  harmonicVitality,
  expertise3,
  fontOfInspiration,
  countercharm,
  expertise10,
  musicalSecrets10,
  fontOfVitality,
  countercharmImprovement,
  musicalSecrets14,
  musicalSecrets18,
  limitlessInspiration,
} from "../class-features/bard.js";

const CLASS_ID = "class/bard";

function featureUuid(id: string): string {
  return compendiumUuid("class-features", id);
}


export const bard: ClassItem = {
  _id: generateId(CLASS_ID),
  name: "Bard",
  type: "class",
  img: "icons/skills/trades/music-notes-sound-blue.webp",
  system: {
    description: {
      value: `<p>An inspiring performer whose music and words channel creative power to aid allies, hinder foes, and reshape reality. Whether singing folk ballads in taverns or elaborate compositions on the high seas, bards use their gifts to hold audiences spellbound and turn the tide of battle.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "bard",
    levels: 1,
    hitDice: "d8",
    hitDiceUsed: 0,
    advancement: mergeAdvancements(
      createHitPoints(CLASS_ID),
      ...classStartingEquipmentAdvancement("bard"),

      // --- Haki progression (branching choices at 8/10/12/14/16) ---
      createHakiTierScaleValue(CLASS_ID),


      // --- Proficiencies (level 1) ---
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: ["armor:lgt"],
        hint: "Light armor",
      }, "armor"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: [
          "weapon:sim",
          "weapon:handcrossbow",
          "weapon:longsword",
          "weapon:rapier",
          "weapon:shortsword",
        ],
        hint: "Simple weapons, hand crossbows, pistols, cutlass, longswords, rapiers, shortswords",
      }, "weapons"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 3,
          pool: [...MUSICAL_INSTRUMENT_TRAIT_POOL],
        }],
        hint: "Three musical instruments of your choice",
      }, "tools"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: ["saves:dex", "saves:cha"],
        hint: "Dexterity, Charisma",
      }, "saves"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 3,
          pool: [
            "skills:acr", "skills:ani", "skills:arc", "skills:ath",
            "skills:dec", "skills:his", "skills:ins", "skills:itm",
            "skills:inv", "skills:med", "skills:nat", "skills:prc",
            "skills:prf", "skills:per", "skills:rel", "skills:slt",
            "skills:ste", "skills:sur",
          ],
        }],
        hint: "Choose any 3 skills",
      }, "skills"),

      // --- Level 1: Creativity (Spellcasting), Bardic Inspiration ---
      createItemGrant(CLASS_ID, 1, [
        { uuid: featureUuid(creativitySpellcasting._id) },
        { uuid: featureUuid(bardicInspiration._id) },
      ]),

      // --- Level 2: Jack of All Trades, Harmonic Vitality ---
      createItemGrant(CLASS_ID, 2, [
        { uuid: featureUuid(jackOfAllTrades._id) },
        { uuid: featureUuid(harmonicVitality._id) },
      ]),

      // --- Level 3: Subclass, Expertise ---
      createSubclass(CLASS_ID, 3),
      createTrait(CLASS_ID, 3, {
        mode: "expertise",
        grants: [],
        choices: [{ count: 2, pool: [] }],
        hint: "Choose two skill proficiencies",
      }, "expertise-3"),
      createItemGrant(CLASS_ID, 3, [
        { uuid: featureUuid(expertise3._id) },
      ]),

      // --- Level 5: Font of Inspiration ---
      createItemGrant(CLASS_ID, 5, [
        { uuid: featureUuid(fontOfInspiration._id) },
      ]),

      // --- Level 6: Countercharm ---
      createItemGrant(CLASS_ID, 6, [
        { uuid: featureUuid(countercharm._id) },
      ]),

      // --- Level 10: Expertise, Musical Secrets, Font of Vitality ---
      createTrait(CLASS_ID, 10, {
        mode: "expertise",
        grants: [],
        choices: [{ count: 2, pool: [] }],
        hint: "Choose two more skill proficiencies",
      }, "expertise-10"),
      createItemGrant(CLASS_ID, 10, [
        { uuid: featureUuid(expertise10._id) },
        { uuid: featureUuid(musicalSecrets10._id) },
        { uuid: featureUuid(fontOfVitality._id) },
      ]),

      // --- Level 13: Countercharm Improvement ---
      createItemGrant(CLASS_ID, 13, [
        { uuid: featureUuid(countercharmImprovement._id) },
      ]),

      // --- Level 14: Musical Secrets ---
      createItemGrant(CLASS_ID, 14, [
        { uuid: featureUuid(musicalSecrets14._id) },
      ]),

      // --- Level 18: Musical Secrets ---
      createItemGrant(CLASS_ID, 18, [
        { uuid: featureUuid(musicalSecrets18._id) },
      ]),

      // --- Level 20: Limitless Inspiration ---
      createItemGrant(CLASS_ID, 20, [
        { uuid: featureUuid(limitlessInspiration._id) },
      ]),

      // --- ASIs: 4, 8, 12, 16, 19 ---
      createASI(CLASS_ID, 4),
      createASI(CLASS_ID, 8),
      createASI(CLASS_ID, 12),
      createASI(CLASS_ID, 16),
      createASI(CLASS_ID, 19),

      // --- Haki feat choices (branching pool; filtered at runtime) ---
      ...createHakiAdvancementChoices(CLASS_ID),

      // --- Scale Values ---
      createScaleValue(CLASS_ID, "bardic-inspiration", "dice", {
        1: { number: 1, faces: 6 } as any,
        5: { number: 1, faces: 8 } as any,
        10: { number: 1, faces: 10 } as any,
        15: { number: 1, faces: 12 } as any,
      }),
      createScaleValue(CLASS_ID, "harmonic-vitality", "dice", {
        2: { number: 1, faces: 6 } as any,
        5: { number: 1, faces: 8 } as any,
        10: { number: 1, faces: 10 } as any,
        15: { number: 1, faces: 12 } as any,
      }),
    ) as any,
    spellcasting: { progression: "full", ability: "cha" },
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
