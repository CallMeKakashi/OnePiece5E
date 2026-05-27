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
  tinkering,
  mastercraftNovice,
  mods,
  theRightTool,
  toolExpertise,
  flashOfGenius,
  mastercraftAdept,
  creationStorage,
  highTechDevelopment,
  mastercraftSavant,
  mastercraftMaster,
  soulOfArtifice,
} from "../class-features/gadgeteer.js";

const CLS = "class/gadgeteer";

function featureUuid(id: string): string {
  return compendiumUuid("class-features", id);
}

function hakiUuid(slug: string): string {
  return compendiumUuid("class-features", generateId(`feature/haki/${slug}`));
}

export const gadgeteer: ClassItem = {
  _id: generateId(CLS),
  name: "Gadgeteer",
  type: "class",
  img: "icons/tools/smithing/anvil.webp",
  system: {
    description: {
      value: `<p>A master of mechanical invention, the Gadgeteer uses intelligence and ingenuity to craft mastercraft items, deploy mods, and create wondrous devices. Gadgeteers channel their creativity through tools and tinkering, producing effects that rival the supernatural.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "gadgeteer",
    levels: 1,
    hitDice: "d8",
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
        grants: ["armor:lgt", "armor:med", "armor:shl"],
        hint: "Light armor, medium armor, shields",
      }, "armor"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["weapon:sim"],
        hint: "Simple weapons",
      }, "weapons"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["tool:thief"],
        hint: "Thieves' tools, tinker's tools",
      }, "tools"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["saves:con", "saves:int"],
        hint: "Constitution, Intelligence",
      }, "saves"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 2,
          pool: [
            "skills:arc", "skills:his", "skills:inv",
            "skills:med", "skills:nat", "skills:prc", "skills:slt",
          ],
        }],
        hint: "Choose 2 skills",
      }, "skills"),

      // --- Level 1: Tinkering, Mastercraft Novice ---
      createItemGrant(CLS, 1, [
        { uuid: featureUuid(tinkering._id) },
        { uuid: featureUuid(mastercraftNovice._id) },
      ]),

      // --- Level 2: Mods ---
      createItemGrant(CLS, 2, [
        { uuid: featureUuid(mods._id) },
      ]),

      // --- Level 3: Specialist Path, The Right Tool ---
      createSubclass(CLS, 3),
      createItemGrant(CLS, 3, [
        { uuid: featureUuid(theRightTool._id) },
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

      // --- Level 6: Tool Expertise ---
      createItemGrant(CLS, 6, [
        { uuid: featureUuid(toolExpertise._id) },
      ]),

      // --- Level 7: Flash of Genius ---
      createItemGrant(CLS, 7, [
        { uuid: featureUuid(flashOfGenius._id) },
      ]),

      // --- Level 10: Mastercraft Adept ---
      createItemGrant(CLS, 10, [
        { uuid: featureUuid(mastercraftAdept._id) },
      ]),

      // --- Level 11: Creation Storage, High-Tech Development ---
      createItemGrant(CLS, 11, [
        { uuid: featureUuid(creationStorage._id) },
        { uuid: featureUuid(highTechDevelopment._id) },
      ]),

      // --- Level 14: Mastercraft Savant ---
      createItemGrant(CLS, 14, [
        { uuid: featureUuid(mastercraftSavant._id) },
      ]),

      // --- Level 18: Mastercraft Master ---
      createItemGrant(CLS, 18, [
        { uuid: featureUuid(mastercraftMaster._id) },
      ]),

      // --- Level 20: Soul of Artifice ---
      createItemGrant(CLS, 20, [
        { uuid: featureUuid(soulOfArtifice._id) },
      ]),

      // --- Scale Values ---
      createScaleValue(CLS, "mods-known", "number", {
        2: { value: 4 },
        6: { value: 6 },
        10: { value: 8 },
        14: { value: 10 },
        18: { value: 12 },
      }),
      createScaleValue(CLS, "mods-active", "number", {
        2: { value: 2 },
        6: { value: 3 },
        10: { value: 4 },
        14: { value: 5 },
        18: { value: 6 },
      }),
      createScaleValue(CLS, "tricks-known", "number", {
        1: { value: 3 },
        10: { value: 4 },
        14: { value: 5 },
      }),
    ) as any,
    spellcasting: { progression: "half", ability: "int" },
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
