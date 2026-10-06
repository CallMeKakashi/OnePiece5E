import { describe, it, expect } from "vitest";
import { pickBest } from "../scripts/best-ac.mjs";
import { evaluateCondition } from "../scripts/conditional-effects.mjs";

describe("best armor class", () => {
  it("picks the highest calculation", () => { expect(pickBest({ default: 12, mage: 15, unarmoredMonk: 14 }, "default")).toBe("mage"); });
  it("keeps the current calculation on a tie, so nothing flips back and forth", () => { expect(pickBest({ default: 15, mage: 15 }, "default")).toBe("default"); expect(pickBest({ default: 15, mage: 15 }, "mage")).toBe("mage"); });
  it("handles a single or empty set", () => { expect(pickBest({ default: 10 }, "default")).toBe("default"); expect(pickBest({}, "default")).toBeNull(); });
});

// the evaluator is injected here: the real one is Foundry's Roll
const evalSimple = (f) => Function(`"use strict"; return (${f});`)();
const replace = (f, d) => f.replace(/@([a-z.]+)/gi, (_m, path) => String(path.split(".").reduce((o, k) => o?.[k], d) ?? 0));

describe("conditional effects", () => {
  const data = { attributes: { hp: { value: 4, max: 20 } } };
  it("is true while the formula holds", () => { expect(evaluateCondition("@attributes.hp.value < @attributes.hp.max / 2", data, evalSimple, replace)).toBe(true); });
  it("is false when it does not", () => { expect(evaluateCondition("@attributes.hp.value < @attributes.hp.max / 2", { attributes: { hp: { value: 18, max: 20 } } }, evalSimple, replace)).toBe(false); });
  it("counts a broken formula as false", () => { expect(evaluateCondition("@@@ nonsense", data, evalSimple, replace)).toBe(false); });
});
