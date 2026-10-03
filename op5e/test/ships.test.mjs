import { describe, it, expect } from "vitest";
import { parseShips, parseCannons, parseAvailability, beri } from "../data/src/ships/parse.js";
import ships from "../data/src/ships/index.js";
import cannons from "../data/src/ship-weapons/index.js";

describe("ships and cannons", () => {
  it("parses costs", () => {
    expect(beri("100 Million")).toBe(100_000_000);
    expect(beri("500 000")).toBe(500_000);
  });
  it("parses 8 ships and 8 cannons from the sourcebook tables", () => {
    const s = parseShips(), c = parseCannons();
    expect(s).toHaveLength(8); expect(c).toHaveLength(8);
    expect(s.find((x) => x.name === "Galleon")).toMatchObject({ mph: 4.5, crew: 60, ac: 17, hp: 1200, threshold: 30, slots: { bow: 4, port: 24, star: 24, stern: 8 } });
    expect(s.find((x) => x.name === "Rowboat")).toMatchObject({ cargoTons: null, ac: 11, hp: 100, threshold: null });
    expect(c.find((x) => x.name === "64-pounder")).toMatchObject({ dice: 15, sides: 10, range: 300, long: 1200, siege: true });
  });
  it("links ships and cannons both ways", () => {
    expect(parseAvailability(parseShips().map((s) => s.name))[7].ships).toEqual(["Galleon"]);
    const big = cannons.find((c) => c.name === "64-pounder");
    const galleon = ships.find((s) => s.name === "Galleon");
    expect(big.flags.op5e.cannon.ships.map((u) => u.split(".").pop())).toEqual([galleon._id]);
    expect(galleon.flags.op5e.ship.cannons.map((u) => u.split(".").pop())).toContain(big._id);
    expect(ships.find((s) => s.name === "Caravel").flags.op5e.ship.cannons.some((u) => u.endsWith(big._id))).toBe(false);
  });
  it("uses valid 16-char activity ids", () => {
    for (const c of cannons) for (const id of Object.keys(c.system.activities)) expect(id).toHaveLength(16);
  });
});
