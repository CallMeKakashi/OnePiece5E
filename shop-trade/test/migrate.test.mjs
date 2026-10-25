import { test, expect } from "vitest";
import { planMigration } from "../scripts/migrate.mjs";
const defaults = { shops: {}, shopRequests: [], usedShopNames: [], currencyMode: "coins", singleCurrency: "gp", sellRatio: 50, shopTemplateSet: "fantasy", shopCompendium: "dnd5e.items" };
const raw = (o) => (k) => (k in o ? JSON.stringify(o[k]) : undefined);
test("copies old shops and changed settings into an empty module", () => {
  const old = { shops: { a: { name: "Armory" } }, usedShopNames: ["Armory"], currencyMode: "single", sellRatio: 50, shopTemplateSet: "onepiece" };
  expect(planMigration(raw(old), (k) => defaults[k], defaults)).toEqual({ shops: { a: { name: "Armory" } }, usedShopNames: ["Armory"], currencyMode: "single", shopTemplateSet: "onepiece" });
});
test("never overwrites shops or settings the module already has", () => {
  const cur = { ...defaults, shops: { mine: {} }, currencyMode: "single" };
  expect(planMigration(raw({ shops: { a: {} }, currencyMode: "coins" }), (k) => cur[k], defaults)).toEqual({});
});
test("nothing to copy when op5e kept nothing", () => expect(planMigration(raw({}), (k) => defaults[k], defaults)).toEqual({}));
