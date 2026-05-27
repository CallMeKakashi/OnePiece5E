import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  minkDarkvision, minkNaturalWeapons, innerBeast, electro,
  diurnalNature, nocturnalNature,
} from "../racial-features/mink.js";

const RACE_ID = "race/mink";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", classRestriction: "", hint: "" };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", classRestriction: "", hint: "" };
}

export const mink: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Mink",
  type: "race",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: `<p>Minks are a race of humanoid animals who live on the back of Zunesha. They are natural-born warriors capable of generating electricity through their fur. Their animal heritage grants them enhanced speed and natural weapons.</p>
<p><strong>Subraces:</strong> Diurnal, Nocturnal.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "mink",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["sm", "med"]),
      raceASI(RACE_ID, 3),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(minkDarkvision._id) },
        { uuid: feat(minkNaturalWeapons._id) },
        { uuid: feat(innerBeast._id) },
        { uuid: feat(electro._id) },
      ], "base-traits"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(diurnalNature._id), optional: true },
      ], "diurnal"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(nocturnalNature._id), optional: true },
      ], "nocturnal"),
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
