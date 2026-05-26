import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  giantSlam,
  giantNaturalAthlete, warriorsMight, giantsEndurance,
  thickSkin, fearFactor, ancientNaturalWeapons, titanicStrength,
  wotanDarkvision, wotanAquaticAdaptation, wotanSpeechOfTheSea,
  dexterous, frostBorn, iceGiantDarkvision,
} from "../racial-features/giant.js";

const RACE_ID = "race/giant";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { [id]: { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", hint: "" } };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { [id]: { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", hint: "" } };
}

export const giant: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Giant",
  type: "race",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: `<p>Giants are immensely powerful beings that tower over all other races. Most giants are over 20 meters tall and possess incredible strength. Their size makes them formidable warriors but also marks them as a DM race due to scale challenges.</p>
<p><strong>Subraces:</strong> Standard Giant, Ancient Giant, Wotan, Ice Giant.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "giant",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["huge", "grg"]),
      raceASI(RACE_ID, 4),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(giantSlam._id) },
      ], "base-traits"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(giantNaturalAthlete._id), optional: true },
        { uuid: feat(warriorsMight._id), optional: true },
        { uuid: feat(giantsEndurance._id), optional: true },
      ], "standard-giant"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(thickSkin._id), optional: true },
        { uuid: feat(fearFactor._id), optional: true },
        { uuid: feat(ancientNaturalWeapons._id), optional: true },
        { uuid: feat(titanicStrength._id), optional: true },
      ], "ancient-giant"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(wotanDarkvision._id), optional: true },
        { uuid: feat(wotanAquaticAdaptation._id), optional: true },
        { uuid: feat(wotanSpeechOfTheSea._id), optional: true },
      ], "wotan"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(dexterous._id), optional: true },
        { uuid: feat(frostBorn._id), optional: true },
        { uuid: feat(iceGiantDarkvision._id), optional: true },
      ], "ice-giant"),
    ) as any,
    movement: { walk: 40, swim: 0, fly: 0, climb: 0, burrow: 0, hover: false, units: "ft" },
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
