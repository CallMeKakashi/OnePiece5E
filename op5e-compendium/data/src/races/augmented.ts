import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  augmentedPowerfulBuild,
  mechanicalImprovements, integratedArmor, integratedToolbox,
  beastBody, chimeraDarkvision, chimeraNaturalWeapons,
  acceleratedHealing, naturalArmor, sparkOfWar,
  revivedDarkvision, deathlessNature, graveFortitude,
} from "../racial-features/augmented.js";

const RACE_ID = "race/augmented";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { [id]: { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", hint: "" } };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { [id]: { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", hint: "" } };
}

export const augmented: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Augmented",
  type: "race",
  img: "icons/svg/item-bag.svg",
  system: {
    description: {
      value: `<p>Augmented are beings whose bodies have been modified through technology, genetic experimentation, beast hybridization, or resurrection. They possess powerful builds and diverse abilities depending on the nature of their augmentation.</p>
<p><strong>Subraces:</strong> Cyborg, Chimera, Artificial Human, Revived.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "augmented",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["sm", "med"]),
      raceASI(RACE_ID, 3),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(augmentedPowerfulBuild._id) },
      ], "base-traits"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(mechanicalImprovements._id), optional: true },
        { uuid: feat(integratedArmor._id), optional: true },
        { uuid: feat(integratedToolbox._id), optional: true },
      ], "cyborg"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(beastBody._id), optional: true },
        { uuid: feat(chimeraDarkvision._id), optional: true },
        { uuid: feat(chimeraNaturalWeapons._id), optional: true },
      ], "chimera"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(acceleratedHealing._id), optional: true },
        { uuid: feat(naturalArmor._id), optional: true },
        { uuid: feat(sparkOfWar._id), optional: true },
      ], "artificial-human"),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(revivedDarkvision._id), optional: true },
        { uuid: feat(deathlessNature._id), optional: true },
        { uuid: feat(graveFortitude._id), optional: true },
      ], "revived"),
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
