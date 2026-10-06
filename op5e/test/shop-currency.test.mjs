// Pure coin math (no Foundry): node --test shop-trade/test
import { test, expect } from "vitest";
import { coinValues, makeChange, price } from "../scripts/shop/currency.mjs";
const std = { pp: { conversion: 0.1 }, gp: { conversion: 1 }, ep: { conversion: 2 }, sp: { conversion: 10 }, cp: { conversion: 100 } };
test("coin values are in copper", () => expect(coinValues(std)).toEqual({ pp: 1000, gp: 100, ep: 50, sp: 10, cp: 1 }));
test("change making from the largest coin", () => expect(makeChange(1234, coinValues(std))).toEqual({ pp: 1, gp: 2, sp: 3, cp: 4, ep: 0 }));
test("1000 cp pays 3 gp and leaves 7 gp", () => expect(makeChange(1000 - 300, coinValues(std)).gp).toEqual(7));
test("a one-coin world", () => expect(makeChange(25, coinValues({ gp: { conversion: 1 } }))).toEqual({ gp: 25 }));
test("markup has no float error", () => expect(price({ price: 800000 }, { markup: 10 })).toBe(880000));
