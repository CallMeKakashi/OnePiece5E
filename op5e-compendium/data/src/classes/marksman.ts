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
  deftExplorer1,
  deftExplorer6,
  deftExplorer10,
  favoredMark,
  creativity,
  fightingStyle,
  quickOnTheDraw,
  extraAttack,
  landsStride,
  volley,
  eagleEyes,
  vigilantGaze,
  deadlyMark,
  killshot,
} from "../class-features/marksman.js";

const CLS = "class/marksman";

function featureUuid(id: string): string {
  return compendiumUuid("class-features", id);
}

export const marksman: ClassItem = {
  _id: generateId(CLS),
  name: "Marksman",
  type: "class",
  img: "icons/weapons/guns/gun-pistol-flintlock.webp",
  system: {
    description: {
      value: `<p>A peerless hunter and sharpshooter, the Marksman combines deadly precision with survival instincts honed through years of tracking prey across every terrain. Whether wielding a rifle, bow, or sling, Marksmen mark their targets and never miss.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "marksman",
    levels: 1,
    hitDice: "d10",
    hitDiceUsed: 0,
    advancement: mergeAdvancements(
      createHitPoints(CLS),

      // --- Proficiencies (level 1) ---
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["armor:lgt", "armor:med", "armor:shl"],
        hint: "Light armor, medium armor, shields",
      }, "armor"),
      createTrait(CLS, 1, {
        mode: "default",
        grants: ["weapon:sim", "weapon:mar"],
        hint: "Simple weapons, martial weapons",
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
          count: 3,
          pool: [
            "skills:ani", "skills:ath", "skills:ins",
            "skills:inv", "skills:nat", "skills:prc",
            "skills:ste", "skills:sur",
          ],
        }],
        hint: "Choose 3 skills",
      }, "skills"),

      // --- Level 1: Deft Explorer + Favored Mark ---
      createItemGrant(CLS, 1, [
        { uuid: featureUuid(deftExplorer1._id) },
        { uuid: featureUuid(favoredMark._id) },
      ]),

      // --- Level 2: Creativity + Fighting Style ---
      createItemGrant(CLS, 2, [
        { uuid: featureUuid(creativity._id) },
        { uuid: featureUuid(fightingStyle._id) },
      ]),

      // --- Level 3: Subclass + Quick On The Draw ---
      createSubclass(CLS, 3),
      createItemGrant(CLS, 3, [
        { uuid: featureUuid(quickOnTheDraw._id) },
      ]),

      // --- Level 5: Extra Attack ---
      createItemGrant(CLS, 5, [
        { uuid: featureUuid(extraAttack._id) },
      ]),

      // --- Level 6: Deft Explorer ---
      createItemGrant(CLS, 6, [
        { uuid: featureUuid(deftExplorer6._id) },
      ]),

      // --- Level 8: Land's Stride ---
      createItemGrant(CLS, 8, [
        { uuid: featureUuid(landsStride._id) },
      ], "level-8-features"),

      // --- Level 9: Volley ---
      createItemGrant(CLS, 9, [
        { uuid: featureUuid(volley._id) },
      ]),

      // --- Level 10: Deft Explorer + Eagle Eyes ---
      createItemGrant(CLS, 10, [
        { uuid: featureUuid(deftExplorer10._id) },
        { uuid: featureUuid(eagleEyes._id) },
      ]),

      // --- Level 14: Vigilant Gaze ---
      createItemGrant(CLS, 14, [
        { uuid: featureUuid(vigilantGaze._id) },
      ]),

      // --- Level 18: Deadly Mark ---
      createItemGrant(CLS, 18, [
        { uuid: featureUuid(deadlyMark._id) },
      ]),

      // --- Level 20: Killshot ---
      createItemGrant(CLS, 20, [
        { uuid: featureUuid(killshot._id) },
      ]),

      // --- ASI: 4, 8, 12, 16, 19 ---
      createASI(CLS, 4),
      createASI(CLS, 8),
      createASI(CLS, 12),
      createASI(CLS, 16),
      createASI(CLS, 19),

      // --- Scale Values ---
      createScaleValue(CLS, "favored-mark", "dice", {
        1: { number: 1, faces: 6 } as any,
        5: { number: 1, faces: 8 } as any,
        14: { number: 1, faces: 10 } as any,
        20: { number: 1, faces: 12 } as any,
      }),
    ) as any,
    spellcasting: { progression: "half", ability: "wis" },
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
