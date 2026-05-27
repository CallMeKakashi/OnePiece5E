import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  lunarianDarkvision, omniAdapted,
  flamingDuality, empoweredGodspeed, improvedIgnite, ultimateDuality,
  flameInvesture,
} from "../racial-features/lunarian.js";

const RACE_ID = "race/lunarian";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", classRestriction: "", hint: "" };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", classRestriction: "", hint: "" };
}

export const lunarian: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Lunarian",
  type: "race",
  img: "icons/magic/fire/projectile-meteor-burning-orange.webp",
  system: {
    description: {
      value: `<p>Lunarians are a near-extinct race once known as gods. They possess large black wings granting flight, can withstand any environment, and wield the power of flames. Their Flaming Duality allows them to shift between defensive and speed-focused forms.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "lunarian",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["sm", "med"]),
      raceASI(RACE_ID, 3),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(lunarianDarkvision._id) },
        { uuid: feat(omniAdapted._id) },
        { uuid: feat(flamingDuality._id) },
        { uuid: feat(flameInvesture._id) },
      ], "base-traits"),
      createItemGrant(RACE_ID, 5, [
        { uuid: feat(empoweredGodspeed._id) },
      ], "level-5"),
      createItemGrant(RACE_ID, 10, [
        { uuid: feat(improvedIgnite._id) },
      ], "level-10"),
      createItemGrant(RACE_ID, 15, [
        { uuid: feat(ultimateDuality._id) },
      ], "level-15"),
    ) as any,
    movement: { walk: 30, swim: 0, fly: 30, climb: 0, burrow: 0, hover: false, units: "ft" },
    type: { value: "humanoid", subtype: "", custom: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: {
    compendiumSource: null, duplicateSource: null,
    coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
    createdTime: null, modifiedTime: null, lastModifiedBy: null,
  },
} as unknown as RaceItem;
