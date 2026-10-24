// Pure shop-template maths (no Foundry): the fantasy shop set stocks from a compendium by filtering entries.
import { test, expect } from "vitest";
import { toGold, ceilCents, floorCents, matchesSpec, selectStock } from "../scripts/shop/templates-lib.mjs";

test("prices convert to gold by denomination", () => {
  expect(toGold({ value: 5, denomination: "sp" })).toBe(0.5);
  expect(toGold({ value: 75, denomination: "cp" })).toBe(0.75);
  expect(toGold({ value: 2, denomination: "pp" })).toBe(20);
  expect(toGold({ value: 15 })).toBe(15);            // no denomination means gold
  expect(toGold(undefined)).toBe(0);
});

test("rounding is to the copper piece with no float noise", () => {
  expect(ceilCents(0.1)).toBe(0.1);
  expect(ceilCents(0.123)).toBe(0.13);
  expect(floorCents(0.123)).toBe(0.12);
  expect(ceilCents(2.0000000000000004)).toBe(2);
  expect(floorCents(0.1 * 3)).toBe(0.3);
});

// templates.mjs imports Foundry-only constants at call time, not import time, so the type tables can be checked here
import { FANTASY_SHOP_TYPES, ONE_PIECE_SHOP_TYPES, findType, setOfType, isBlank, TEMPLATE_SETS } from "../scripts/shop/templates.mjs";

test("fantasy keys never collide with One Piece keys", () => {
  const fantasy = Object.keys(FANTASY_SHOP_TYPES), onePiece = Object.keys(ONE_PIECE_SHOP_TYPES);
  expect(fantasy.every((k) => k.startsWith("fantasy_"))).toBe(true);
  expect(fantasy.filter((k) => onePiece.includes(k))).toEqual([]);
  expect(setOfType("fantasy_general")).toBe("fantasy");
  expect(setOfType("general")).toBe("onepiece");
  expect(findType("fantasy_apothecary").label).toBe("Apothecary");
  expect(findType("apothecary").markup).toBe(10);
  expect(findType("nope").label).toBe("Blank shop");
  expect(isBlank("blank") && isBlank("fantasy_blank") && !isBlank("armory")).toBe(true);
  expect(Object.keys(TEMPLATE_SETS)).toEqual(["onepiece", "fantasy"]);
});

const sword = { uuid: "a", name: "Longsword", type: "weapon", rarity: "", subtype: "martialM", gp: 15 };
const plate = { uuid: "b", name: "Plate", type: "equipment", rarity: "", subtype: "heavy", gp: 1500 };
const wand = { uuid: "c", name: "Wand of Secrets", type: "equipment", rarity: "uncommon", subtype: "wand", gp: 0 };
const rope = { uuid: "d", name: "Rope, Hempen (50 feet)", type: "loot", rarity: "", subtype: "gear", gp: 1 };

test("types, subtypes and rarity filter entries", () => {
  expect(matchesSpec(sword, { types: ["weapon"], rarity: ["none", "common"], maxPrice: 600 })).toBe(true);
  expect(matchesSpec(plate, { types: ["equipment"], subtypes: ["light", "medium"] })).toBe(false);
  expect(matchesSpec(plate, { types: ["equipment"], subtypes: ["heavy"], maxPrice: 1000 })).toBe(false);
  expect(matchesSpec(wand, { rarity: ["none", "common"] })).toBe(false);
});

test("unpriced items need allowUnpriced", () => {
  expect(matchesSpec(wand, { rarity: ["uncommon"] })).toBe(false);
  expect(matchesSpec(wand, { rarity: ["uncommon"], allowUnpriced: true })).toBe(true);
});

test("include and exclude match the name", () => {
  expect(matchesSpec(rope, { include: /rope/i })).toBe(true);
  expect(matchesSpec(rope, { include: /rope/i, exclude: /hempen/i })).toBe(false);
});

test("selectStock keeps each item once, takes stock from the first spec and sorts by name", () => {
  const out = selectStock([plate, rope, sword], [{ types: ["weapon"], stock: 2 }, { types: ["weapon", "loot"], stock: 9 }, { types: ["equipment"], stock: null }]);
  expect(out.map((e) => e.name)).toEqual(["Longsword", "Plate", "Rope, Hempen (50 feet)"]);
  expect(out.find((e) => e.name === "Longsword").stock).toBe(2);
  expect(out.find((e) => e.name === "Rope, Hempen (50 feet)").stock).toBe(9);
  expect(out.find((e) => e.name === "Plate").stock).toBe(null);
});
