import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
    assert.equal(critical.powerfulCritical, true);
    assert.equal(critical.multiplier, 2);
  });

  it("preserves an explicit multiplier when already set", () => {
    const critical = patchCriticalConfig({ multiplier: 3 });
    assert.equal(critical.powerfulCritical, true);
    assert.equal(critical.multiplier, 3);
  });
});

describe("criticalDiceMultiplier (dnd5e configureDamage contract)", () => {
  it("doubles dice for standard 5e crit (multiplier 2, no powerfulCritical)", () => {
    assert.equal(criticalDiceMultiplier({ multiplier: 2, powerfulCritical: false }), 2);
  });

  it("keeps one die for OP5e crit (multiplier 2 + powerfulCritical)", () => {
    const patched = patchCriticalConfig({});
    assert.equal(criticalDiceMultiplier(patched), 1);
    assert.equal(OP5E_CRITICAL_DAMAGE.powerfulCritical, true);
  });
});

describe("applyOp5eCriticalDamage", () => {
  it("patches process and per-roll critical config", () => {
    const rollConfig = {
      critical: {},
      rolls: [{ critical: {}, options: {} }],
    };
    applyOp5eCriticalDamage(rollConfig);
    assert.equal(rollConfig.critical.powerfulCritical, true);
    assert.equal(rollConfig.rolls[0].critical.powerfulCritical, true);
    assert.equal(rollConfig.rolls[0].options.critical.powerfulCritical, true);
  });
});

describe("looksLikeDamageRollConfig", () => {
  it("detects damage hook names", () => {
    assert.equal(looksLikeDamageRollConfig({ hookNames: ["damage"] }), true);
  });

  it("ignores unrelated roll configs", () => {
    assert.equal(looksLikeDamageRollConfig({ rolls: [{ options: {} }] }), false);
  });
});

describe("assertOp5eCritFormula", () => {
  it("rejects doubled weapon dice", () => {
    const result = assertOp5eCritFormula("2d6 + 6");
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /2d6/);
  });

  it("accepts single die plus flat max bonus", () => {
    assert.equal(assertOp5eCritFormula("1d6 + 6 + 6").ok, true);
    assert.equal(assertOp5eCritFormula("1d6+12").ok, true);
  });
});
