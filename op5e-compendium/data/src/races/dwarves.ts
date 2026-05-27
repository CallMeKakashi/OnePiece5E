import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { RaceItem } from "../../schemas/race.js";
import {
  quickFooted, nimble, elusive, combatReady, gullible,
} from "../racial-features/dwarves.js";

const RACE_ID = "race/dwarves";

function feat(id: string) { return compendiumUuid("racial-features", id); }

function sizeAdv(raceId: string, sizes: string[]) {
  const id = generateId(`${raceId}/advancement/size`);
  return { _id: id, type: "Size" as const, configuration: { sizes }, value: {}, level: 0, title: "", icon: "", classRestriction: "", hint: "" };
}

function raceASI(raceId: string, points: number) {
  const id = generateId(`${raceId}/advancement/asi`);
  return { _id: id, type: "AbilityScoreImprovement" as const, configuration: { points, fixed: {}, cap: 2 }, value: {}, level: 0, title: "Ability Score Increase", icon: "", classRestriction: "", hint: "" };
}

export const dwarves: RaceItem = {
  _id: generateId(RACE_ID),
  name: "Dwarves",
  type: "race",
  img: "icons/tools/smithing/anvil-worn-steel-grey.webp",
  system: {
    description: {
      value: `<p>Dwarves are a tiny, elusive race known for their incredible agility and climbing ability. Despite their small stature, they are fierce combatants whose unarmed strikes pack surprising power. Their trusting nature can be a weakness, however, making them susceptible to deception.</p>`,
      chat: "",
    },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "dwarves",
    advancement: mergeAdvancements(
      sizeAdv(RACE_ID, ["tiny"]),
      raceASI(RACE_ID, 3),
      createItemGrant(RACE_ID, 0, [
        { uuid: feat(quickFooted._id) },
        { uuid: feat(nimble._id) },
        { uuid: feat(elusive._id) },
        { uuid: feat(combatReady._id) },
        { uuid: feat(gullible._id) },
      ], "base-traits"),
    ) as any,
    movement: { walk: 30, swim: 0, fly: 0, climb: 30, burrow: 0, hover: false, units: "ft" },
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
