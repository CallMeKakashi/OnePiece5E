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
import type { ClassItem } from "../../schemas/class.js";
import {
  expertise1,
  expertise6,
  sneakAttack,
  thievesCant,
  cunningAction,
  steadyAim,
  deviousStrike,
  uncannyDodge,
  evasion,
  reliableTalent,
  duplicitousStrike,
  blindsense,
  slipperyMind,
  elusive,
  strokeOfLuck,
} from "../class-features/rogue.js";

const CLASS_ID = "class/rogue";

function featureUuid(id: string): string {
  return compendiumUuid("class-features", id);
}

const sneakAttackScale = createScaleValue(
  CLASS_ID,
  "sneak-attack",
  "dice",
  {
    1: { number: 2, faces: 6 } as any,
    3: { number: 3, faces: 6 } as any,
    5: { number: 4, faces: 6 } as any,
    7: { number: 5, faces: 6 } as any,
    9: { number: 6, faces: 6 } as any,
    11: { number: 7, faces: 6 } as any,
    13: { number: 8, faces: 6 } as any,
    15: { number: 9, faces: 6 } as any,
    16: { number: 10, faces: 6 } as any,
    18: { number: 11, faces: 6 } as any,
    20: { number: 12, faces: 6 } as any,
  },
);

export const rogue: ClassItem = {
  _id: generateId(CLASS_ID),
  name: "Rogue",
  type: "class",
  img: "icons/weapons/daggers/dagger-serrated-black.webp",
  system: {
    description: {
      value: `<p>A scoundrel who uses stealth and trickery to overcome obstacles and enemies.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "rogue",
    levels: 1,
    hitDice: "d8",
    hitDiceUsed: 0,
    advancement: mergeAdvancements(
      createHitPoints(CLASS_ID),
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
        hint: "Simple weapons, hand crossbows, longswords, rapiers, shortswords",
      }, "weapons"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: ["tool:thief"],
        hint: "Thieves' tools",
      }, "tools"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: ["saves:dex", "saves:int"],
        hint: "Dexterity, Intelligence",
      }, "saves"),
      createTrait(CLASS_ID, 1, {
        mode: "default",
        grants: [],
        choices: [{
          count: 4,
          pool: [
            "skills:acr",
            "skills:ath",
            "skills:dec",
            "skills:ins",
            "skills:itm",
            "skills:inv",
            "skills:prc",
            "skills:prf",
            "skills:per",
            "skills:slt",
            "skills:ste",
          ],
        }],
        hint: "Choose 4 skills",
      }, "skills"),
      sneakAttackScale,
      createSubclass(CLASS_ID, 3),
      createItemGrant(CLASS_ID, 1, [
        { uuid: featureUuid(expertise1._id) },
        { uuid: featureUuid(sneakAttack._id) },
        { uuid: featureUuid(thievesCant._id) },
      ]),
      createItemGrant(CLASS_ID, 2, [
        { uuid: featureUuid(cunningAction._id) },
      ]),
      createItemGrant(CLASS_ID, 3, [
        { uuid: featureUuid(steadyAim._id) },
      ]),
      createItemGrant(CLASS_ID, 5, [
        { uuid: featureUuid(deviousStrike._id) },
        { uuid: featureUuid(uncannyDodge._id) },
      ]),
      createItemGrant(CLASS_ID, 6, [
        { uuid: featureUuid(expertise6._id) },
      ]),
      createItemGrant(CLASS_ID, 7, [
        { uuid: featureUuid(evasion._id) },
      ]),
      createItemGrant(CLASS_ID, 11, [
        { uuid: featureUuid(reliableTalent._id) },
      ]),
      createItemGrant(CLASS_ID, 14, [
        { uuid: featureUuid(duplicitousStrike._id) },
        { uuid: featureUuid(blindsense._id) },
      ]),
      createItemGrant(CLASS_ID, 15, [
        { uuid: featureUuid(slipperyMind._id) },
      ]),
      createItemGrant(CLASS_ID, 18, [
        { uuid: featureUuid(elusive._id) },
      ]),
      createItemGrant(CLASS_ID, 20, [
        { uuid: featureUuid(strokeOfLuck._id) },
      ]),
      createASI(CLASS_ID, 4),
      createASI(CLASS_ID, 8),
      createASI(CLASS_ID, 10),
      createASI(CLASS_ID, 12),
      createASI(CLASS_ID, 16),
      createASI(CLASS_ID, 19),
    ) as any,
    spellcasting: { progression: "none", ability: "" },
    wealth: "4d4 * 10",
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
