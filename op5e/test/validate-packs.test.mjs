import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

// Quality gate: needs `npm run build:json` first (packs-src/ is generated and gitignored).
describe.skipIf(!existsSync("packs-src"))("static pack validation", () => {
  it("has no errors (ids, activity blocks, effect refs, internal links)", () => {
    const r = spawnSync("node", ["scripts/validate-packs.mjs"], { encoding: "utf8" });
    expect(r.status, r.stdout).toBe(0);
  });
});
