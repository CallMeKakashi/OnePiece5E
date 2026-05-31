import { describe, it, expect } from "vitest";
import {
  OP5E_CRITICAL_DAMAGE,
  applyOp5eCriticalDamage,
  assertOp5eCritFormula,
  criticalDiceMultiplier,
  looksLikeDamageRollConfig,
  patchCriticalConfig,
} from "../scripts/crit-damage.mjs";

describe("patchCriticalConfig", () => {
  it("enables powerfulCritical with multiplier 2", () => {
    const critical = patchCriticalConfig({});
    expect(critical.powerfulCritical).toBe(true);
    expect(critical.multiplier).toBe(2);
  });

  it("preserves an explicit multiplier when already set", () => {
    const critical = patchCriticalConfig({ multiplier: 3 });
    expect(critical.powerfulCritical).toBe(true);
    expect(critical.multiplier).toBe(3);
  });
});

describe("criticalDiceMultiplier (dnd5e configureDamage contract)", () => {
  it("doubles dice for standard 5e crit (multiplier 2, no powerfulCritical)", () => {
    expect(criticalDiceMultiplier({ multiplier: 2, powerfulCritical: false })).toBe(2);
  });

  it("keeps one die for OP5e crit (multiplier 2 + powerfulCritical)", () => {
    const patched = patchCriticalConfig({});
    expect(criticalDiceMultiplier(patched)).toBe(1);
    expect(OP5E_CRITICAL_DAMAGE.powerfulCritical).toBe(true);
  });
});

describe("applyOp5eCriticalDamage", () => {
  it("patches process and per-roll critical config", () => {
    const rollConfig = {
      critical: {},
      rolls: [{ critical: {}, options: {} }],
    };
    applyOp5eCriticalDamage(rollConfig);
    expect(rollConfig.critical.powerfulCritical).toBe(true);
    expect(rollConfig.rolls[0].critical.powerfulCritical).toBe(true);
    expect(rollConfig.rolls[0].options.critical.powerfulCritical).toBe(true);
  });
});

describe("looksLikeDamageRollConfig", () => {
  it("detects damage hook names", () => {
    expect(looksLikeDamageRollConfig({ hookNames: ["damage"] })).toBe(true);
  });

  it("ignores unrelated roll configs", () => {
    expect(looksLikeDamageRollConfig({ rolls: [{ options: {} }] })).toBe(false);
  });
});

describe("assertOp5eCritFormula", () => {
  it("rejects doubled weapon dice", () => {
    const result = assertOp5eCritFormula("2d6 + 6");
    expect(result.ok).toBe(false);
    expect(result.reason ?? "").toMatch(/2d6/);
  });

  it("accepts single die plus flat max bonus", () => {
    expect(assertOp5eCritFormula("1d6 + 6 + 6").ok).toBe(true);
    expect(assertOp5eCritFormula("1d6+12").ok).toBe(true);
  });
});
