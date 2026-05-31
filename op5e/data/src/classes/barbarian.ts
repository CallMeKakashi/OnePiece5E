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
import type { ClassItem } from "../../schemas/class.js";
import {
  rage,
  unarmoredDefense,
  recklessAttack,
  dangerSense,
  primalKnowledge3,
  primalKnowledge7,
  extraAttack,
  fastMovement,
  feralInstinct,
  brutalCritical,
  relentlessRage,
  persistentRage,
  indomitableMight,
  primalChampion,
} from "../class-features/barbarian.js";

const CLASS_ID = "class/barbarian";

function featureUuid(id: string): string {
  return compendiumUuid("class-features", id);
}


export const barbarian: ClassItem = {
  _id: generateId(CLASS_ID),
  name: "Barbarian",
  type: "class",
  img: "icons/skills/melee/blood-slash-foam-red.webp",
  system: {
    description: {
      value: `<p>A fierce warrior of primitive background who can enter a battle rage. Barbarians are defined by their rage: unbridled, unquenchable, and unthinking fury. More than a mere emotion, their anger is the ferocity of a cornered predator, the unrelenting assault of a storm, the churning turmoil of the sea.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "barbarian",
    levels: 1,
    hitDice: "d12",
    hitDiceUsed: 0,
    advancement: mergeAdvancements(
      createHitPoints(CLASS_ID),
      ...classStartingEquipmentAdvancement("barbarian"),

      // --- Haki progression (branching choices at 8/10/12/14/16) ---
      createHakiTierScaleValue(CLASS_ID),


      // --- Proficiencies (level 1) ---
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: ["armor:lgt", "armor:med", "armor:shl"],
        hint: "Light armor, medium armor, shields",
      }, "armor"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: ["weapon:sim", "weapon:mar"],
        hint: "Simple weapons, martial weapons",
      }, "weapons"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: ["saves:str", "saves:con"],
        hint: "Strength, Constitution",
      }, "saves"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 2,
          pool: [
            "skills:ani", "skills:ath", "skills:itm",
            "skills:nat", "skills:prc", "skills:sur",
          ],
        }],
        hint: "Choose 2 skills",
      }, "skills"),

      // --- Level 1: Rage, Unarmored Defense ---
      createItemGrant(CLASS_ID, 1, [
        { uuid: featureUuid(rage._id) },
        { uuid: featureUuid(unarmoredDefense._id) },
      ]),

      // --- Level 2: Reckless Attack, Danger Sense ---
      createItemGrant(CLASS_ID, 2, [
        { uuid: featureUuid(recklessAttack._id) },
        { uuid: featureUuid(dangerSense._id) },
      ]),

      // --- Level 3: Subclass, Primal Knowledge ---
      createSubclass(CLASS_ID, 3),
      createItemGrant(CLASS_ID, 3, [
        { uuid: featureUuid(primalKnowledge3._id) },
      ]),

      // --- Level 5: Extra Attack, Fast Movement ---
      createItemGrant(CLASS_ID, 5, [
        { uuid: featureUuid(extraAttack._id) },
        { uuid: featureUuid(fastMovement._id) },
      ]),

      // --- Level 7: Feral Instinct, Primal Knowledge ---
      createItemGrant(CLASS_ID, 7, [
        { uuid: featureUuid(feralInstinct._id) },
        { uuid: featureUuid(primalKnowledge7._id) },
      ]),

      // --- Level 9: Brutal Critical ---
      createItemGrant(CLASS_ID, 9, [
        { uuid: featureUuid(brutalCritical._id) },
      ]),

      // --- Level 11: Relentless Rage ---
      createItemGrant(CLASS_ID, 11, [
        { uuid: featureUuid(relentlessRage._id) },
      ]),

      // --- Level 15: Persistent Rage ---
      createItemGrant(CLASS_ID, 15, [
        { uuid: featureUuid(persistentRage._id) },
      ]),

      // --- Level 18: Indomitable Might ---
      createItemGrant(CLASS_ID, 18, [
        { uuid: featureUuid(indomitableMight._id) },
      ]),

      // --- Level 20: Primal Champion ---
      createItemGrant(CLASS_ID, 20, [
        { uuid: featureUuid(primalChampion._id) },
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
      createScaleValue(CLASS_ID, "rages", "number", {
        1: { value: 2 },
        3: { value: 3 },
        6: { value: 4 },
        12: { value: 5 },
        17: { value: 6 },
      }),
      createScaleValue(CLASS_ID, "brutal-critical", "number", {
        9: { value: 1 },
        13: { value: 2 },
        17: { value: 3 },
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
