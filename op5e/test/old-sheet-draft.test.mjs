import { test, expect } from "vitest";
import { draftFromOldSheet } from "../scripts/old-sheet-draft.mjs";
const ids = { "classes:Fighter": "f1", "classes:Barbarian": "b1", "subclasses:Brute": "s1", "species:Mink": "m1", "backgrounds:Cook": "c1" };
const find = (k, n) => ids[`${k}:${n}`] ?? null;
const old = { name: "Roma", system: { abilities: { str: { value: 18 }, dex: { value: 12 } } }, items: [
  { type: "class", name: "Fighter", system: { levels: 3, identifier: "fighter" } }, { type: "class", name: "Barbarian", system: { levels: 7, identifier: "barbarian" } },
  { type: "subclass", name: "Brute", system: { classIdentifier: "fighter" } }, { type: "subclass", name: "Path of the Berserker", system: { classIdentifier: "barbarian" } },
  { type: "race", name: "Mink" }, { type: "background", name: "Cook" }] };
test("two classes map by level, subclass by class", () => {
  const { draft, unmapped } = draftFromOldSheet(old, find);
  expect([draft.classId, draft.level, draft.classId2, draft.level2]).toEqual(["b1", 7, "f1", 3]);
  expect([draft.subclassId, draft.subclassId2]).toEqual(["", "s1"]);
  expect([draft.speciesId, draft.backgroundId, draft.abilities.str, draft.abilities.con]).toEqual(["m1", "c1", 18, 10]);
  expect(unmapped).toEqual(["subclass: Path of the Berserker"]);
});
