import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { buildActor } from "../dev/generate-foundry-actor/build-actor.ts";
import { parseBuildSpec } from "../dev/generate-foundry-actor/build-spec.schema.ts";
import { validateActor } from "../dev/generate-foundry-actor/validate-actor-lib.ts";
import { countCompendiumRefs } from "../dev/generate-foundry-actor/standalone.ts";
import { exportHakiManifest } from "../data/helpers/haki-advancement.ts";
import manifest from "../data/generated/haki-manifest.json" with { type: "json" };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ACE_SPEC = join(ROOT, "dev/generate-foundry-actor/specs/ace-spec.json");

describe("generate-foundry-actor workshop export", () => {
  it("builds Ace from ace-spec.json with zero compendium refs", async () => {
    const spec = parseBuildSpec(JSON.parse(readFileSync(ACE_SPEC, "utf8")));
    const actor = await buildActor(spec);

    expect(actor.name).toBe("Ace");
    expect(countCompendiumRefs(actor)).toBe(0);

    const types = actor.items.map((i) => i.type);
    expect(types).toContain("race");
    expect(types).toContain("class");
    expect(types).toContain("subclass");
    expect(types).toContain("background");
    expect(types.some((t) => t === "weapon")).toBe(true);

    const result = validateActor(actor);
    expect(result.ok).toBe(true);
    expect(actor.system.currency.gp).toBe(150_000);
  });

  it("validate-actor CLI passes on rebuilt ace.json", () => {
    spawnSync(
      "node",
      [
        "node_modules/tsx/dist/cli.mjs",
        "dev/generate-foundry-actor/build-from-spec.ts",
        "--spec",
        `@${ACE_SPEC}`,
        "--out",
        join(ROOT, "../Foundry/actors-json/ace.json"),
      ],
      { cwd: ROOT, encoding: "utf8" },
    );

    const result = spawnSync(
      "node",
      [
        "node_modules/tsx/dist/cli.mjs",
        "dev/generate-foundry-actor/validate-actor.ts",
        "--file",
        join(ROOT, "../Foundry/actors-json/ace.json"),
      ],
      { cwd: ROOT, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
  });

  it("BuildSpec schema rejects invalid specs", () => {
    expect(() => parseBuildSpec({ name: "X" })).toThrow();
  });

  it("haki manifest matches TS exportHakiManifest", () => {
    const live = exportHakiManifest();
    expect(manifest.featIds).toEqual(live.featIds);
    expect(manifest.slugToUuid).toEqual(live.slugToUuid);
  });
});

describe("compendium index finders", () => {
  it("findBackground matches case-insensitively", async () => {
    const { findBackground, getCompendiumIndex } = await import(
      "../dev/character-sheet-audit/audit-lib.ts"
    );
    const idx = getCompendiumIndex();
    expect(findBackground("Librarian", idx)?.name).toBe("Librarian");
    expect(findBackground("librarian", idx)?.name).toBe("Librarian");
  });
});
