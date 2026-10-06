// Pure coin math (no Foundry): node --test shop-trade/test
import test from "node:test";
import assert from "node:assert/strict";
import { coinValues, makeChange } from "../scripts/currency.mjs";
const std = { pp: { conversion: 0.1 }, gp: { conversion: 1 }, ep: { conversion: 2 }, sp: { conversion: 10 }, cp: { conversion: 100 } };
test("coin values are in copper", () => assert.deepEqual(coinValues(std), { pp: 1000, gp: 100, ep: 50, sp: 10, cp: 1 }));
test("change making from the largest coin", () => assert.deepEqual(makeChange(1234, coinValues(std)), { pp: 1, gp: 2, sp: 3, cp: 4, ep: 0 }));
test("1000 cp pays 3 gp and leaves 7 gp", () => assert.equal(makeChange(1000 - 300, coinValues(std)).gp, 7));
test("a one-coin world", () => assert.deepEqual(makeChange(25, coinValues({ gp: { conversion: 1 } })), { gp: 25 }));
