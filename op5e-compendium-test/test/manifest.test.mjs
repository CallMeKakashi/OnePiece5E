import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

async function readJson(relPath) {
  const raw = await readFile(resolve(ROOT, relPath), "utf8");
  return JSON.parse(raw);
}

describe("op5e-compendium-test manifest", () => {
  it("declares dependency on op5e-compendium", async () => {
    const manifest = await readJson("module.json");
    expect(manifest.id).toBe("op5e-compendium-test");
    expect(manifest.requires?.[0]?.id).toBe("op5e-compendium");
    expect(manifest.esmodules).toContain("scripts/module.mjs");
  });
});

