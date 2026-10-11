import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";

describe("removed Foundry v13 APIs", () => {
  it("scripts never call isActorOwner", () => {
    for (const f of readdirSync("scripts").filter((n) => n.endsWith(".mjs"))) {
      expect(readFileSync(`scripts/${f}`, "utf8"), f).not.toMatch(/isActorOwner/);
    }
  });
});
