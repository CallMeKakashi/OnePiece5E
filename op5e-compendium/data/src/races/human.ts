import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  humanDetermination,
  resourcefulness, strongWill,
  amazonianBond, minorHaki,
  longLimbs, suddenReach,
  steadyMind, toweringGaze,
  tallStride, sprint,
  keeperOfSecrets, thirdEye, secretPotential,
} from "../racial-features/human.js";

const RACE_ID = "race/human";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { [id]: { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", hint: "" } };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { [id]: { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", hint: "" } };
}

export const human: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Human",
  type: "race",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: `<p>Humans are the most common and widespread race, varying greatly in appearance and culture. They are adaptable, ambitious, and remarkably diverse, forming the majority of the world's population.</p>
<p><strong>Subraces:</strong> Standard Human, Kuja, Long-arm, Long-leg, Snakeneck, Three-eye.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "human",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["sm", "med"]),
      raceASI(RACE_ID, 3),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(humanDetermination._id) },
      ], "base-traits"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(resourcefulness._id), optional: true },
        { uuid: feat(strongWill._id), optional: true },
      ], "standard-human"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(amazonianBond._id), optional: true },
        { uuid: feat(minorHaki._id), optional: true },
      ], "kuja"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(longLimbs._id), optional: true },
        { uuid: feat(suddenReach._id), optional: true },
      ], "long-arm"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(steadyMind._id), optional: true },
        { uuid: feat(toweringGaze._id), optional: true },
      ], "snakeneck"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(tallStride._id), optional: true },
        { uuid: feat(sprint._id), optional: true },
      ], "long-leg"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(keeperOfSecrets._id), optional: true },
        { uuid: feat(thirdEye._id), optional: true },
        { uuid: feat(secretPotential._id), optional: true },
      ], "three-eye"),
    ) as any,
    movement: { walk: 30, swim: 0, fly: 0, climb: 0, burrow: 0, hover: false, units: "ft" },
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
