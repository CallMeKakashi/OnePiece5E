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
  createHakiAdvancementChoices,
  createHakiTierScaleValue,
} from "../../helpers/haki-advancement.js";
import { classStartingEquipmentAdvancement } from "./class-equipment-grants.js";
import { ARTISAN_TOOL_TRAIT_POOL } from "./class-proficiency-pools.js";
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
      ...classStartingEquipmentAdvancement("gadgeteer"),

      // --- Haki progression (branching choices at 8/10/12/14/16) ---
      createHakiTierScaleValue(CLS),


      // --- Proficiencies (level 1) ---
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["weapon:sim"],
        hint: "Daggers, darts, slings, quarterstaffs, blunderbuss, flintlocks, light crossbows",
      }, "weapons"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["tool:tinker"],
        hint: "Tinker's tools",
      }, "tools-fixed"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 1,
          pool: [...ARTISAN_TOOL_TRAIT_POOL],
        }],
        hint: "One additional artisan's tool of your choice",
      }, "tools"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["saves:int", "saves:wis"],
        hint: "Intelligence, Wisdom",
      }, "saves"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 2,
          pool: [
            "skills:arc", "skills:his", "skills:ins", "skills:inv",
            "skills:med", "skills:rel",
          ],
        }],
        hint: "Choose 2 from Engineering, History, Insight, Investigation, Medicine, Religion",
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

      // --- Haki feat choices (branching pool; filtered at runtime) ---
      ...createHakiAdvancementChoices(CLS),

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
