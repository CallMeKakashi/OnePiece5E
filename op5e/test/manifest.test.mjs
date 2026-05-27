import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

async function readJson(relPath) {
  const raw = await readFile(resolve(ROOT, relPath), "utf8");
  return JSON.parse(raw);
}

describe("op5e manifest", () => {
  it("has consistent id/name/version fields", async () => {
    const [pkg, manifest] = await Promise.all([
      readJson("package.json"),
      readJson("module.json"),
    ]);

    expect(manifest.id).toBe(pkg.name);
    expect(manifest.id).toBe("op5e");
    expect(manifest.version).toBe(pkg.version);
    expect(manifest.esmodules).toContain("scripts/compendium.mjs");
    expect(manifest.esmodules).toContain("scripts/character-creator.mjs");
    expect(manifest.styles).toContain("styles/module.css");
  });

  it("declares compendium packs and does not require a separate module", async () => {
    const manifest = await readJson("module.json");
    expect(manifest.packs?.length).toBeGreaterThan(0);
    expect(manifest.requires ?? []).toHaveLength(0);
  });
});
