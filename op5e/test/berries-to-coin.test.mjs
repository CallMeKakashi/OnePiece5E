import { test, expect } from "vitest";
import { berriesToCoin } from "../scripts/berries-to-coin.mjs";
test.each([
  [5_000_000, 500, "gp"], [150_000, 15, "gp"], [5_000, 5, "sp"], [1_500, 15, "cp"], [50, 1, "cp"], [0, 0, "gp"],
])("%i Berries", (b, value, denomination) => expect(berriesToCoin(b)).toEqual({ value, denomination }));
