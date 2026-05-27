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
  medicalExpertise,
  experimentalMedicine,
  rapidRemedy,
  extendedRelease,
  overheal,
  secretsOfMedicine,
  miracleWorker,
} from "../class-features/medic.js";

const CLS = "class/medic";

function featureUuid(id: string): string {
  return compendiumUuid("class-features", id);
}

function hakiUuid(slug: string): string {
  return compendiumUuid("class-features", generateId(`feature/haki/${slug}`));
}

export const medic: ClassItem = {
  _id: generateId(CLS),
  name: "Medic",
  type: "class",
  img: "icons/magic/life/heart-cross-green.webp",
  system: {
    description: {
      value: `<p>A healer and scientist who uses medicinal creations, experimental medicine, and anatomical expertise to mend the wounded and harm the hostile. Medics are the lifeblood of any pirate crew, keeping their allies alive through the most dangerous encounters.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "medic",
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
        grants: ["armor:lgt"],
        hint: "Light armor",
      }, "armor"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["weapon:sim"],
        hint: "Simple weapons",
      }, "weapons"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["tool:herb", "tool:alchemist"],
        hint: "Herbalism kit, alchemist's supplies",
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
            "skills:arc", "skills:his", "skills:ins",
            "skills:med", "skills:nat", "skills:rel", "skills:sur",
          ],
        }],
        hint: "Choose 2 skills",
      }, "skills"),

      // --- Level 1: Medical Expertise ---
      createItemGrant(CLS, 1, [
        { uuid: featureUuid(medicalExpertise._id) },
      ]),

      // --- Level 2: Experimental Medicine, Subclass ---
      createSubclass(CLS, 2),
      createItemGrant(CLS, 2, [
        { uuid: featureUuid(experimentalMedicine._id) },
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

      // --- Level 5: Rapid Remedy ---
      createItemGrant(CLS, 5, [
        { uuid: featureUuid(rapidRemedy._id) },
      ]),

      // --- Level 7: Extended Release ---
      createItemGrant(CLS, 7, [
        { uuid: featureUuid(extendedRelease._id) },
      ]),

      // --- Level 18: Overheal, Secrets of Medicine ---
      createItemGrant(CLS, 18, [
        { uuid: featureUuid(overheal._id) },
        { uuid: featureUuid(secretsOfMedicine._id) },
      ]),

      // --- Level 20: Miracle Worker ---
      createItemGrant(CLS, 20, [
        { uuid: featureUuid(miracleWorker._id) },
      ]),

      // --- Scale Values ---
      createScaleValue(CLS, "tricks-known", "number", {
        1: { value: 3 },
        4: { value: 4 },
        10: { value: 5 },
      }),
    ) as any,
    spellcasting: { progression: "full", ability: "wis" },
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
