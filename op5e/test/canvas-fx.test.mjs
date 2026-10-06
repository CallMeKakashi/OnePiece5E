import { describe, it, expect } from "vitest";
import { hitScale } from "../scripts/canvas-fx.mjs";

describe("big-hit shake scale", () => {
  it("grows with the damage", () => { expect(hitScale(60).strength).toBeGreaterThan(hitScale(20).strength); expect(hitScale(60).ms).toBeGreaterThan(hitScale(20).ms); });
  it("is capped", () => { expect(hitScale(500).strength).toBe(40); expect(hitScale(500).ms).toBe(1000); });
  it("never goes negative or breaks on bad input", () => { expect(hitScale(-5).strength).toBe(8); expect(hitScale(0).ms).toBe(350); });
});
