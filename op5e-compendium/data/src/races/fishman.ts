import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  aquaticAdaption, fishmanDarkvision, powerfulBuild, speechOfTheSea,
  frightening, sharptoothNaturalWeapons,
  naturalAthlete, strongBody,
  manualAgility, ambidextrous,
} from "../racial-features/fishman.js";

const RACE_ID = "race/fishman";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { [id]: { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", hint: "" } };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { [id]: { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", hint: "" } };
}

export const fishman: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Fishman",
  type: "race",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: `<p>Fishmen are a powerful aquatic race with superior physical abilities. They can breathe underwater and communicate with sea creatures. Their diverse physiology ranges from shark-like predators to octopus-like multipods.</p>
<p><strong>Subraces:</strong> Sharptooth, Stronghide, Multipod.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "fishman",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["sm", "med"]),
      raceASI(RACE_ID, 3),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(aquaticAdaption._id) },
        { uuid: feat(fishmanDarkvision._id) },
        { uuid: feat(powerfulBuild._id) },
        { uuid: feat(speechOfTheSea._id) },
      ], "base-traits"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(frightening._id), optional: true },
        { uuid: feat(sharptoothNaturalWeapons._id), optional: true },
      ], "sharptooth"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(naturalAthlete._id), optional: true },
        { uuid: feat(strongBody._id), optional: true },
      ], "stronghide"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(manualAgility._id), optional: true },
        { uuid: feat(ambidextrous._id), optional: true },
      ], "multipod"),
    ) as any,
    movement: { walk: 30, swim: 30, fly: 0, climb: 0, burrow: 0, hover: false, units: "ft" },
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
