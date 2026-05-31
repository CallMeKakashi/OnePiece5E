import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  merfolkAquaticAdaption, bubbleFloater, callForAid,
  merfolkDarkvision, friendOfTheSea, pureSoul,
} from "../racial-features/merfolk.js";

const RACE_ID = "race/merfolk";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", classRestriction: "", hint: "" };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", classRestriction: "", hint: "" };
}

export const merfolk: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Merfolk",
  type: "race",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: `<p>Merfolk are a kindhearted aquatic race who dwell beneath the seas. Though slow on land, they are remarkably fast swimmers. Their pure souls grant them exceptional mental fortitude, and they can communicate with marine creatures of all kinds.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "merfolk",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["sm", "med"]),
      raceASI(RACE_ID, 3),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(merfolkAquaticAdaption._id) },
        { uuid: feat(bubbleFloater._id) },
        { uuid: feat(callForAid._id) },
        { uuid: feat(merfolkDarkvision._id) },
        { uuid: feat(friendOfTheSea._id) },
        { uuid: feat(pureSoul._id) },
      ], "base-traits"),
    ) as any,
    movement: { walk: 10, swim: 40, fly: 0, climb: 0, burrow: 0, hover: false, units: "ft" },
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
