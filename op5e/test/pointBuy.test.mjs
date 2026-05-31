import { describe, it, expect } from "vitest";
import { POINT_BUY, scoreCost, totalCost, isValidPointBuy } from "../scripts/wizard/pointBuy.mjs";

describe("point buy", () => {
  it("matches 5e point-buy constraints", () => {
    expect(POINT_BUY.points).toBe(27);
    expect(POINT_BUY.min).toBe(8);
    expect(POINT_BUY.max).toBe(15);
  });

  it("computes score costs (8..15)", () => {
    expect(scoreCost(8)).toBe(0);
    expect(scoreCost(13)).toBe(5);
    expect(scoreCost(14)).toBe(7);
    expect(scoreCost(15)).toBe(9);
    expect(scoreCost(16)).toBe(Infinity);
  });

  it("validates a full 6-ability array totaling 27", () => {
    const abilities = { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }; // 9+9+9
    expect(totalCost(abilities)).toBe(27);
    expect(isValidPointBuy(abilities)).toBe(true);
  });

  it("rejects incomplete or invalid ability sets", () => {
    expect(totalCost({ str: 15 })).toBe(Infinity);
    expect(isValidPointBuy({ str: 15 })).toBe(false);
  });
});

