import { describe, it, expect } from "vitest";
import {
  OP5E_CREATION_IDS,
  OP5E_FEATURE_IDS,
  OP5E_FLAMING_DUALITY_ACTIVITY_IDS,
} from "../scripts/feature-ids.mjs";
import {
  buildFlamingDualityChanges,
  canUseFlameInvestureFireball,
  creationCompendiumSource,
  FLAMING_DUALITY_FORM,
  getActorCharacterLevel,
  getFlamingDualityFormFromActivity,
  IMPROVED_IGNITE_DAMAGE_TYPES,
  isFlameInvestureItem,
  isFlamingDualityItem,
  isValidFlamingDualityForm,
  shouldApplyEmpoweredGodspeedDisadvantage,
  shouldApplyEmpoweredGodspeedToAttack,
} from "../scripts/feature-hooks-lib.mjs";
import {
  FLAMING_DUALITY_GODSPEED_ACTIVITY_ID,
  FLAMING_DUALITY_IGNITED_ACTIVITY_ID,
  ensureFeatureActivities,
} from "../data/helpers/activities.ts";
import { flamingDuality, flameInvesture } from "../data/src/racial-features/lunarian.ts";
import { lunarian } from "../data/src/races/lunarian.ts";

function mockActor({ level = 5, items = [], effects = [] } = {}) {
  return {
    system: { details: { level } },
    items: items.map(i => ({
      id: i.id ?? i,
      _id: i.id ?? i,
      type: i.type ?? "feat",
      system: i.system ?? { levels: i.levels },
    })),
    effects,
  };
}

describe("Lunarian feature IDs", () => {
  it("matches stable data paths", () => {
    expect(flamingDuality._id).toBe(OP5E_FEATURE_IDS.flamingDuality);
    expect(flameInvesture._id).toBe(OP5E_FEATURE_IDS.flameInvesture);
  });

  it("recognizes hook item ids", () => {
    expect(isFlamingDualityItem(OP5E_FEATURE_IDS.flamingDuality)).toBe(true);
    expect(isFlameInvestureItem(OP5E_FEATURE_IDS.flameInvesture)).toBe(true);
  });
});

describe("Flaming Duality activities", () => {
  it("exposes Ignited and Godspeed form activities without chat flavor", () => {
    expect(flamingDuality.system.chatFlavor).toBe("");
    const activities = flamingDuality.system.activities ?? {};
    expect(Object.keys(activities)).toEqual([
      FLAMING_DUALITY_IGNITED_ACTIVITY_ID,
      FLAMING_DUALITY_GODSPEED_ACTIVITY_ID,
    ]);
    expect(activities[FLAMING_DUALITY_IGNITED_ACTIVITY_ID]).toMatchObject({
      name: "Ignited Form",
      type: "utility",
      activation: { type: "bonus", value: 1 },
      description: { chatFlavor: "" },
    });
    expect(activities[FLAMING_DUALITY_GODSPEED_ACTIVITY_ID]).toMatchObject({
      name: "Godspeed Form",
      type: "utility",
    });
    expect(FLAMING_DUALITY_IGNITED_ACTIVITY_ID).toBe(
      OP5E_FLAMING_DUALITY_ACTIVITY_IDS.ignited,
    );
    expect(FLAMING_DUALITY_GODSPEED_ACTIVITY_ID).toBe(
      OP5E_FLAMING_DUALITY_ACTIVITY_IDS.godspeed,
    );
  });

  it("maps activity ids to forms for runtime hooks", () => {
    expect(
      getFlamingDualityFormFromActivity({ id: OP5E_FLAMING_DUALITY_ACTIVITY_IDS.ignited }),
    ).toBe(FLAMING_DUALITY_FORM.IGNITED);
    expect(
      getFlamingDualityFormFromActivity({ id: OP5E_FLAMING_DUALITY_ACTIVITY_IDS.godspeed }),
    ).toBe(FLAMING_DUALITY_FORM.GODSPEED);
    expect(getFlamingDualityFormFromActivity({ id: "unknown" })).toBeNull();
  });

  it("preserves dual activities when ensureFeatureActivities runs", () => {
    const enriched = ensureFeatureActivities(flamingDuality);
    expect(Object.keys(enriched.system.activities ?? {})).toHaveLength(2);
  });
});

describe("Flaming Duality effect builder", () => {
  it("applies B/P/S resistance in Ignited form", () => {
    const actor = mockActor({ items: [] });
    const changes = buildFlamingDualityChanges(actor, FLAMING_DUALITY_FORM.IGNITED);
    const values = changes.map(c => c.value);
    expect(values).toContain("bludgeoning");
    expect(values).toContain("piercing");
    expect(values).toContain("slashing");
  });

  it("applies all non-psychic resistances with Improved Ignite", () => {
    const actor = mockActor({
      items: [{ id: OP5E_FEATURE_IDS.improvedIgnite }],
    });
    const changes = buildFlamingDualityChanges(actor, FLAMING_DUALITY_FORM.IGNITED);
    expect(changes.length).toBe(IMPROVED_IGNITE_DAMAGE_TYPES.length);
    expect(changes.some(c => c.value === "psychic")).toBe(false);
  });

  it("adds +10 walk for Godspeed by default", () => {
    const actor = mockActor();
    const changes = buildFlamingDualityChanges(actor, FLAMING_DUALITY_FORM.GODSPEED);
    expect(changes).toEqual([
      expect.objectContaining({ key: "system.attributes.movement.walk", mode: 2, value: "10" }),
    ]);
  });

  it("doubles walk for Godspeed with Ultimate Duality", () => {
    const actor = mockActor({
      items: [{ id: OP5E_FEATURE_IDS.ultimateDuality }],
    });
    const changes = buildFlamingDualityChanges(actor, FLAMING_DUALITY_FORM.GODSPEED);
    expect(changes).toEqual([
      expect.objectContaining({ key: "system.attributes.movement.walk", mode: 1, value: "2" }),
    ]);
  });

  it("validates form ids", () => {
    expect(isValidFlamingDualityForm(FLAMING_DUALITY_FORM.IGNITED)).toBe(true);
    expect(isValidFlamingDualityForm("invalid")).toBe(false);
  });
});

describe("Empowered Godspeed", () => {
  it("requires Godspeed form and L5 feature", () => {
    const actor = mockActor({
      items: [{ id: OP5E_FEATURE_IDS.empoweredGodspeed }],
      effects: [{ flags: { op5e: { flamingDualityForm: FLAMING_DUALITY_FORM.GODSPEED } } }],
    });
    expect(
      shouldApplyEmpoweredGodspeedDisadvantage(actor, FLAMING_DUALITY_FORM.GODSPEED),
    ).toBe(true);
    expect(
      shouldApplyEmpoweredGodspeedDisadvantage(actor, FLAMING_DUALITY_FORM.IGNITED),
    ).toBe(false);
  });

  it("applies disadvantage on opportunity attacks against the actor", () => {
    const actor = mockActor({
      items: [{ id: OP5E_FEATURE_IDS.empoweredGodspeed }],
      effects: [
        {
          disabled: false,
          active: true,
          flags: { op5e: { flamingDualityForm: FLAMING_DUALITY_FORM.GODSPEED } },
        },
      ],
    });
    const config = {
      activity: { activation: { type: "opportunity" } },
      targets: [{ actor }],
    };
    expect(shouldApplyEmpoweredGodspeedToAttack(config)).toBe(true);
  });
});

describe("Flame Investure data", () => {
  it("generates an activatable activity", () => {
    const withActivity = ensureFeatureActivities(flameInvesture);
    expect(withActivity.system.activities).toBeDefined();
    expect(Object.keys(withActivity.system.activities).length).toBeGreaterThan(0);
  });

  it("gates fireball uses by level", () => {
    const investure = { system: { uses: { value: 1, max: "1" } } };
    expect(canUseFlameInvestureFireball(mockActor({ level: 4 }), investure)).toBe(false);
    expect(canUseFlameInvestureFireball(mockActor({ level: 5 }), investure)).toBe(true);
  });

  it("grants creations at L0 / L3 / L5 via race advancement", () => {
    const advancement = lunarian.system.advancement ?? [];
    const grants = advancement.flatMap(a =>
      a.type === "ItemGrant" ? (a.configuration?.items ?? []) : [],
    );
    const uuids = grants.map(g => g.uuid);
    expect(uuids).toContain(creationCompendiumSource(OP5E_CREATION_IDS.fireBolt));
    expect(uuids).toContain(creationCompendiumSource(OP5E_CREATION_IDS.elementalArmor));
    expect(uuids).toContain(creationCompendiumSource(OP5E_CREATION_IDS.fireball));
  });

  it("sums class levels when details.level is absent", () => {
    const actor = mockActor({
      items: [
        { id: "class-a", type: "class", system: { levels: 3 } },
        { id: "class-b", type: "class", system: { levels: 2 } },
      ],
    });
    expect(getActorCharacterLevel(actor)).toBe(5);
  });
});
