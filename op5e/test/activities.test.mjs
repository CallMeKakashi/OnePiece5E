import { describe, it, expect } from "vitest";
import {
  FLAMING_DUALITY_GODSPEED_ACTIVITY_ID,
  FLAMING_DUALITY_IGNITED_ACTIVITY_ID,
  PRIMARY_ACTIVITY_ID,
  buildActivities,
  buildFlamingDualityActivities,
  ensureFeatureActivities,
  needsActivity,
  resolveActivityType,
  transformDamagePart,
} from "../data/helpers/activities.js";
import { secondWind } from "../data/src/class-features/fighter.js";
import { rage } from "../data/src/class-features/barbarian.js";
import { hakiAbilities } from "../data/src/class-features/haki.js";
import { flamingDuality } from "../data/src/racial-features/lunarian.js";

describe("feature activities", () => {
  it("detects activatable legacy fields", () => {
    expect(needsActivity(secondWind.system)).toBe(true);
    expect(needsActivity({ ...secondWind.system, activation: { type: "", cost: null, condition: "" }, uses: { value: null, max: "", per: null, recovery: "", prompt: true }, actionType: "", damage: { parts: [], versatile: "" }, save: { ability: "", dc: null, scaling: "spell" } })).toBe(false);
  });

  it("maps action types to activity types", () => {
    expect(resolveActivityType(secondWind.system)).toBe("heal");
    expect(resolveActivityType({ ...rage.system, actionType: "" })).toBe("utility");
    expect(resolveActivityType({ ...secondWind.system, actionType: "save" })).toBe("save");
  });

  it("parses healing damage parts with class scaling bonus", () => {
    const part = transformDamagePart(["1d10 + @classes.fighter.levels", "healing"]);
    expect(part.number).toBe(1);
    expect(part.denomination).toBe(10);
    expect(part.bonus).toBe("@classes.fighter.levels");
    expect(part.types).toEqual(["healing"]);
  });

  it("generates heal activity for Second Wind", () => {
    const activities = buildActivities(secondWind);
    const activity = activities[PRIMARY_ACTIVITY_ID];
    expect(activity.type).toBe("heal");
    expect(activity.activation).toMatchObject({ type: "bonus", value: 1 });
    expect(activity.consumption).toMatchObject({
      targets: [{ type: "itemUses", value: "1" }],
    });
    expect(activity.healing).toMatchObject({
      number: 1,
      denomination: 10,
      bonus: "@classes.fighter.levels",
    });
  });

  it("generates utility activity for Rage", () => {
    const activities = buildActivities(rage);
    const activity = activities[PRIMARY_ACTIVITY_ID];
    expect(activity.type).toBe("utility");
    expect(activity.activation).toMatchObject({ type: "bonus", value: 1 });
    expect(activity.duration).toMatchObject({ value: 1, units: "minute" });
  });

  it("generates save activity for Conqueror's Haki", () => {
    const conqueror = hakiAbilities.find((h) => h.name === "Conqueror's Haki Novice");
    expect(conqueror).toBeDefined();
    const activities = buildActivities(conqueror);
    const activity = activities[PRIMARY_ACTIVITY_ID];
    expect(activity.type).toBe("save");
    expect(activity.activation).toMatchObject({ type: "bonus", value: 1 });
    expect(activity.consumption).toMatchObject({
      targets: [{ type: "itemUses", value: "1" }],
    });
  });

  it("generates utility activity for haki resource pools", () => {
    const armament = hakiAbilities.find((h) => h.name === "Color of Armament Novice");
    expect(armament).toBeDefined();
    const enriched = ensureFeatureActivities(armament);
    const activities = enriched.system.activities ?? {};
    expect(Object.keys(activities).length).toBeGreaterThan(0);
    expect(activities[PRIMARY_ACTIVITY_ID]).toMatchObject({ type: "utility" });
  });

  it("builds separate Ignited and Godspeed activities for Flaming Duality", () => {
    const source = {
      name: flamingDuality.name,
      type: flamingDuality.type,
      effects: flamingDuality.effects,
      system: flamingDuality.system,
    };
    const activities = buildFlamingDualityActivities(source);
    expect(activities[FLAMING_DUALITY_IGNITED_ACTIVITY_ID]).toMatchObject({
      type: "utility",
      name: "Ignited Form",
      duration: { value: 1, units: "minute" },
      consumption: { targets: [{ type: "itemUses", value: "1" }] },
    });
    expect(activities[FLAMING_DUALITY_GODSPEED_ACTIVITY_ID]).toMatchObject({
      type: "utility",
      name: "Godspeed Form",
    });
  });

  it("does not overwrite existing activities", () => {
    const existing = {
      custom000000000001: { _id: "custom000000000001", type: "utility" },
    };
    const item = ensureFeatureActivities({
      ...secondWind,
      system: { ...secondWind.system, activities: existing },
    });
    expect(item.system.activities).toEqual(existing);
  });
});
