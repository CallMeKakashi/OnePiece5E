import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";

describe("removed Foundry v13 APIs", () => {
  it("scripts never call isActorOwner", () => {
    for (const f of readdirSync("scripts").filter((n) => n.endsWith(".mjs"))) {
      expect(readFileSync(`scripts/${f}`, "utf8"), f).not.toMatch(/isActorOwner/);
    }
  });
});

import { OP5E_FEATURE_IDS } from "../scripts/feature-ids.mjs";
import { actorHasDiamondSoul, canonicalFeatureId } from "../scripts/feature-hooks-lib.mjs";

describe("feature lookup on embedded copies", () => {
  it("matches by id, compendium source or feat name (embedded items get new ids)", () => {
    expect(canonicalFeatureId({ id: OP5E_FEATURE_IDS.rage, type: "feat" })).toBe(OP5E_FEATURE_IDS.rage);
    expect(canonicalFeatureId({ id: "x1", type: "feat", _stats: { compendiumSource: `Compendium.op5e.racial-features.Item.${OP5E_FEATURE_IDS.innerBeast}` } })).toBe(OP5E_FEATURE_IDS.innerBeast);
    expect(canonicalFeatureId({ id: "x2", type: "feat", name: "Giant's Endurance", system: {} })).toBe(OP5E_FEATURE_IDS.giantsEndurance);
    expect(canonicalFeatureId({ id: "x3", type: "feat", name: "Rage", system: { identifier: "rage" } })).toBe(OP5E_FEATURE_IDS.rage);
    expect(canonicalFeatureId({ id: "x4", type: "weapon", name: "Rage" })).toBeNull();
    expect(actorHasDiamondSoul({ items: [{ id: "x5", type: "feat", name: "Diamond Soul", system: {} }] })).toBe(true);
  });
});

import { usesPatch } from "../scripts/feature-hooks-lib.mjs";

describe("usesPatch (dnd5e 5.x stores spent, not value)", () => {
  it("writes spent when the item has it", () => {
    expect(usesPatch({ system: { uses: { spent: 1, max: "4", value: 3 } } }, 2)).toEqual({ "system.uses.spent": 2 });
    expect(usesPatch({ system: { uses: { value: 3 } } }, 2)).toEqual({ "system.uses.value": 2 });
  });
});
