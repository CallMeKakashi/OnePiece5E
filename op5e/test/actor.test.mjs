import { describe, it, expect } from "vitest";
import { actionActivities, statblockToActor } from "../data/helpers/actor.js";
import { PRIMARY_ACTIVITY_ID } from "../data/helpers/activities.js";
import monsters from "../data/src/actors/index.js";

describe("statblock -> actor", () => {
  it("parses a melee attack into a flat-bonus attack activity with damage", () => {
    const a = actionActivities("Melee Weapon Attack: +5 to hit. Hit: 1d6 +3 slashing")[PRIMARY_ACTIVITY_ID];
    expect(a.type).toBe("attack");
    expect(a.attack).toMatchObject({ flat: true, bonus: "5" });
    expect(a.damage.parts[0]).toMatchObject({ number: 1, denomination: 6, bonus: "3", types: ["slashing"] });
  });
  it("drops a +0 bonus and parses a save", () => {
    expect(actionActivities("Melee Weapon Attack: +9 to hit. Hit: 2d8 +0 slashing")[PRIMARY_ACTIVITY_ID].damage.parts[0].bonus).toBe("");
    expect(actionActivities("Creatures within 10 ft must succeed DC 15 WIS save or be frightened")[PRIMARY_ACTIVITY_ID]).toMatchObject({ type: "save", save: { ability: ["wis"], dc: { formula: "15" } } });
  });
  it("is deterministic, with unique ids and every monster built", () => {
    const ids = new Set(monsters.map((m) => m._id));
    expect(ids.size).toBe(monsters.length);
    expect(monsters.length).toBeGreaterThanOrEqual(29);
    const sb = { name: "X", size: "large", type: "Beast", ac: 12, hp: 20, speed: "walk 30 ft., swim 40 ft.", stats: [10, 10, 10, 10, 10, 10], cr: 1, actions: [] };
    expect(statblockToActor(sb, {})).toEqual(statblockToActor(sb, {}));
    expect(statblockToActor(sb, {}).system.attributes.movement).toMatchObject({ walk: 30, swim: 40 });
    expect(statblockToActor(sb, {}).system.traits.size).toBe("lg");
  });
});
