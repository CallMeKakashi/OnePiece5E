import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  aircraftExpertise, cloudWalker, strongFaith,
  ancientDials, birkanProficiencies,
  battleDials, shandianProficiencies,
  artisanDials, skypieanProficiencies,
} from "../racial-features/sky-islander.js";

const RACE_ID = "race/sky-islander";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", classRestriction: "", hint: "" };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", classRestriction: "", hint: "" };
}

export const skyIslander: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Sky Islander",
  type: "race",
  img: "icons/magic/nature/elemental-wind-tornado-green.webp",
  system: {
    description: {
      value: `<p>Sky Islanders inhabit the sky islands high above the Blue Sea. They are often religious and acclimated to high altitudes. Their expertise with dials and sky vehicles sets them apart from surface dwellers.</p>
<p><strong>Subraces:</strong> Birkan, Shandian, Skypiean.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "sky-islander",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["sm", "med"]),
      raceASI(RACE_ID, 3),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(aircraftExpertise._id) },
        { uuid: feat(cloudWalker._id) },
        { uuid: feat(strongFaith._id) },
      ], "base-traits"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(ancientDials._id), optional: true },
        { uuid: feat(birkanProficiencies._id), optional: true },
      ], "birkan"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(battleDials._id), optional: true },
        { uuid: feat(shandianProficiencies._id), optional: true },
      ], "shandian"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(artisanDials._id), optional: true },
        { uuid: feat(skypieanProficiencies._id), optional: true },
      ], "skypiean"),
    ) as any,
    movement: { walk: 35, swim: 0, fly: 0, climb: 0, burrow: 0, hover: false, units: "ft" },
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
