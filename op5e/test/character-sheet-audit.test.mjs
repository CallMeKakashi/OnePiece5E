import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function runAuditJson(extraArgs = []) {
  const result = spawnSync(
    "node",
    ["node_modules/tsx/dist/cli.mjs", "dev/character-sheet-audit/run-audit.ts", "--json", ...extraArgs],
    { cwd: ROOT, encoding: "utf8" },
  );
  if (result.status !== 0 && result.status !== 1) {
    throw new Error(result.stderr || result.stdout || "Audit script failed to run");
  }
  return JSON.parse(result.stdout);
}

describe("character sheet audit (static compendium data)", () => {
  it("runs audit harness and writes JSON report", () => {
    const report = runAuditJson();
    expect(report.mode).toBe("static-data-audit");
    expect(report.builds.length).toBe(11);
    expect(report.masterGaps).toBeDefined();
    expect(report.classScaleSummary).toBeDefined();

    const jsonPath = join(ROOT, "dev/character-sheet-audit/output/audit-report.json");
    expect(existsSync(jsonPath)).toBe(true);
    const onDisk = JSON.parse(readFileSync(jsonPath, "utf8"));
    expect(onDisk.stats).toEqual(report.stats);
  });

  it("covers all nine classes in test matrix", () => {
    const report = runAuditJson();
    const expected = [
      "fighter",
      "rogue",
      "barbarian",
      "bard",
      "brawler",
      "marksman",
      "gadgeteer",
      "medic",
      "savant",
    ];
    for (const cls of expected) {
      expect(report.builds.some((b) => b.buildId.startsWith(cls))).toBe(true);
    }
  });

  it("has no broken compendium UUIDs in class ItemGrants at level 20", () => {
    const report = runAuditJson();
    const broken = report.masterGaps.filter((g) => g.code === "broken-uuid");
    expect(broken).toEqual([]);
  });

  it("has no missing scale definitions for referenced @scale values", () => {
    const report = runAuditJson();
    const missingScales = report.masterGaps.filter((g) => g.code === "scale-missing");
    expect(missingScales).toEqual([]);
  });

  it("Phase 1 audit is clean (0 errors, 0 warnings)", () => {
    const report = runAuditJson();
    expect(report.stats.phase1Errors).toBe(0);
    expect(report.stats.phase1Warnings).toBe(0);
    const phase1Gaps = report.masterGaps.filter((g) => g.phase === "phase1");
    expect(phase1Gaps).toEqual([]);
  });

  it("tracks Phase 2 passive backlog separately", () => {
    const report = runAuditJson();
    expect(Array.isArray(report.phase2Backlog)).toBe(true);
    expect(report.stats).toHaveProperty("phase2Count");
    expect(report.stats.phase2Count).toBe(report.phase2Backlog.length);
  });

  it("tracks Phase 2b checklist status", () => {
    const report = runAuditJson();
    expect(report.phase2bStatus).toBeDefined();
    expect(report.phase2bStatus["Diamond Soul"]?.status).toBe("partial");
    expect(report.phase2bStatus["Danger Sense"]?.status).toBe("partial");
    expect(report.stats.phase2bWired + report.stats.phase2bPartial + report.stats.phase2bDeferred).toBe(
      Object.keys(report.phase2bStatus).length,
    );
  });

  it("additional power root feats are flagged for wizard indexing", () => {
    const result = spawnSync(
      "node",
      [
        "node_modules/tsx/dist/cli.mjs",
        "-e",
        `import { additionalPowerFeatures } from './data/src/class-features/additional/index.ts';
const roots = additionalPowerFeatures.filter((f) => f.flags?.op5e?.additionalPowerRoot);
const subs = additionalPowerFeatures.filter((f) => f.flags?.op5e?.additionalPower && !f.flags?.op5e?.additionalPowerRoot);
if (roots.length !== 47) throw new Error('Expected 47 additional power roots, got ' + roots.length);
if (subs.length < 40) throw new Error('Expected 40+ sub-features, got ' + subs.length);
console.log('ok');`,
      ],
      { cwd: ROOT, encoding: "utf8" },
    );
    expect(result.status).toBe(0);
  });
});

describe("character sheet audit build factory", () => {
  it("generates one smoke build per subclass", async () => {
    const { getAuditBuildSets } = await import("../dev/character-sheet-audit/build-factory.ts");
    const sets = getAuditBuildSets();
    expect(sets.curated.length).toBe(11);
    expect(sets.subclassSmoke.length).toBe(80);
    expect(sets.subclassSmoke.every((b) => b.id.startsWith("smoke-"))).toBe(true);
    expect(new Set(sets.subclassSmoke.map((b) => b.id)).size).toBe(80);
  });

  it("generates one host build per additional power root", async () => {
    const { getAuditBuildSets, getAdditionalPowerRoots } = await import(
      "../dev/character-sheet-audit/build-factory.ts"
    );
    const roots = getAdditionalPowerRoots();
    const sets = getAuditBuildSets();
    expect(roots.length).toBe(47);
    expect(sets.powerHost.length).toBe(47);
    expect(sets.powerHost.every((b) => b.additionalPowerSlug && b.id.startsWith("power-"))).toBe(true);
  });

  it("full audit combines tiers without duplicate build ids", async () => {
    const { getAuditBuildSets } = await import("../dev/character-sheet-audit/build-factory.ts");
    const sets = getAuditBuildSets();
    expect(sets.full.length).toBe(sets.curated.length + sets.subclassSmoke.length + sets.powerHost.length);
  });

  it("full audit mode runs expanded matrix", async () => {
    const { getAuditBuildSets } = await import("../dev/character-sheet-audit/build-factory.ts");
    const { runFullAudit } = await import("../dev/character-sheet-audit/audit-lib.ts");
    const sets = getAuditBuildSets();
    expect(sets.full.length).toBe(138);
    const report = runFullAudit(sets.full);
    expect(report.builds.length).toBe(138);
    expect(report.stats.buildsPassed + report.stats.buildsFailed).toBe(138);
    expect(report.stats.phase1Errors).toBe(0);
  });
});
