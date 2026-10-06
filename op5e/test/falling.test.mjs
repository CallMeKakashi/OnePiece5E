import { describe, it, expect } from "vitest";
import { fallingDice } from "../scripts/falling.mjs";

describe("falling damage dice", () => {
  it("is 1d6 per full 10 ft", () => { expect(fallingDice(10)).toBe(1); expect(fallingDice(25)).toBe(2); expect(fallingDice(99)).toBe(9); });
  it("is nothing under 10 ft and for bad input", () => { expect(fallingDice(9)).toBe(0); expect(fallingDice(0)).toBe(0); expect(fallingDice(-30)).toBe(0); expect(fallingDice("abc")).toBe(0); });
  it("caps at 20d6", () => { expect(fallingDice(200)).toBe(20); expect(fallingDice(5000)).toBe(20); });
});
