import { test, expect } from "vitest";
import { randomShopName, randomOwner, shopNameCount, SPECIES } from "../scripts/shop/names-lib.mjs";

// deterministic rng so the tests do not flake
const seeded = (s = 1) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

test("shop names never repeat, even when asked far more times than there are patterns", () => {
  const rng = seeded(7), used = [], total = shopNameCount("fantasy_inn") + 25;
  for (let i = 0; i < total; i++) used.push(randomShopName("fantasy_inn", used, rng));
  expect(new Set(used.map((n) => n.toLowerCase())).size).toBe(total);
});

test("a shop name that is taken is skipped, case-insensitively", () => {
  const rng = () => 0, first = randomShopName("fantasy_blacksmith", [], rng);
  expect(randomShopName("fantasy_blacksmith", [first.toUpperCase()], () => 0)).not.toBe(first);
});

test("owners have a species from the list and never repeat", () => {
  const rng = seeded(3), used = [];
  for (let i = 0; i < 400; i++) { const o = randomOwner(used, rng); expect(SPECIES).toContain(o.species); used.push(o.name); }
  expect(new Set(used.map((n) => n.toLowerCase())).size).toBe(400);
});

test("unknown shop types still get a name", () => {
  expect(randomShopName("nope", [], seeded(2))).toMatch(/\S/);
});
