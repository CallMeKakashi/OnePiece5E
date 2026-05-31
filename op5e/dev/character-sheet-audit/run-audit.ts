#!/usr/bin/env node
/**
 * Static character-sheet audit — Phase 1 combat sheet bar.
 * Run: npm run audit:characters
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runFullAudit } from "./audit-lib.js";
import { getAuditBuilds, getAuditBuildSets } from "./build-factory.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "output");

function formatConsoleReport(
  report: ReturnType<typeof runFullAudit>,
  builds: ReturnType<typeof getAuditBuilds>,
  fullMode: boolean,
): string {
  const lines: string[] = [];
  lines.push("═".repeat(72));
  lines.push(" OP5e Character Sheet Audit — Phase 1 (combat sheet)");
  lines.push("═".repeat(72));
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Mode: ${fullMode ? "full" : "curated"} (${builds.length} builds)`);
  lines.push(`Builds: ${report.stats.buildsPassed} passed / ${report.stats.buildsFailed} failed`);
  lines.push(
    `Phase 1: ${report.stats.phase1Errors} errors, ${report.stats.phase1Warnings} warnings`,
  );
  lines.push(
    `Backlog: ${report.stats.phase2Count} Phase-2 passives, ${report.stats.narrativeCount} narrative, ${report.stats.casterProgressionCount} caster-progression`,
  );
  lines.push("");

  const phase1Gaps = report.masterGaps.filter((g) => g.phase === "phase1");

  for (const build of report.builds) {
    const status = build.pass ? "PASS" : "FAIL";
    lines.push(`${status}  ${build.buildId}  (P1 E:${build.summary.errors} W:${build.summary.warnings})`);
    for (const [lvl, data] of Object.entries(build.levels)) {
      const p1Issues = data.issues.filter((i) => i.phase === "phase1");
      if (data.pass && p1Issues.length === 0) continue;
      const lvlStatus = data.pass ? "ok" : "FAIL";
      lines.push(`  L${lvl} [${lvlStatus}] ${data.expectedItemCount} items, ${p1Issues.length} Phase-1 issues`);
      for (const issue of p1Issues.slice(0, 8)) {
        lines.push(`    [${issue.severity}] ${issue.code}: ${issue.feature} — ${issue.message}`);
      }
      if (p1Issues.length > 8) lines.push(`    … +${p1Issues.length - 8} more`);
    }
  }

  lines.push("");
  lines.push("─".repeat(72));
  lines.push(" Phase 1 gap list (priority 1 = highest)");
  lines.push("─".repeat(72));
  for (const gap of phase1Gaps.slice(0, 40)) {
    lines.push(`P${gap.priority} [${gap.code}] ${gap.feature} @ L${gap.level} (${gap.buildId})`);
    lines.push(`     ${gap.message}`);
    if (gap.fixHint) lines.push(`     → ${gap.fixHint}`);
  }
  if (phase1Gaps.length > 40) {
    lines.push(`… +${phase1Gaps.length - 40} more Phase-1 gaps (see JSON report)`);
  }

  lines.push("");
  lines.push("─".repeat(72));
  lines.push(` Phase 2 passive backlog (${report.phase2Backlog.length} entries)`);
  lines.push("─".repeat(72));
  const p2Unique = [...new Map(report.phase2Backlog.map((g) => [g.feature, g])).values()];
  for (const gap of p2Unique.slice(0, 20)) {
    lines.push(`  ${gap.feature} — ${gap.message}`);
  }
  if (p2Unique.length > 20) lines.push(`  … +${p2Unique.length - 20} more (see phase2Backlog in JSON)`);

  lines.push("");
  lines.push("─".repeat(72));
  lines.push(` Phase 2b checklist (${report.stats.phase2bWired} wired, ${report.stats.phase2bPartial} partial, ${report.stats.phase2bDeferred} deferred)`);
  lines.push("─".repeat(72));
  for (const [name, entry] of Object.entries(report.phase2bStatus)) {
    const detail = entry.wiring ?? entry.reason ?? "";
    lines.push(`  [${entry.status}] ${name}${detail ? ` — ${detail}` : ""}`);
  }

  lines.push("");
  lines.push("─".repeat(72));
  lines.push(" Class scale summary (missing / unused)");
  lines.push("─".repeat(72));
  for (const [cls, scales] of Object.entries(report.classScaleSummary)) {
    if (!scales.missing.length && !scales.unused.length) continue;
    lines.push(`${cls}: missing=[${scales.missing.join(", ")}] unused=[${scales.unused.join(", ")}]`);
  }

  lines.push("");
  lines.push("Foundry spot-check builds (Phase 1):");
  lines.push("  1. Brawler / Open Hand / Acrobat — Unarmed Strike weapon, Spirit uses, scale damage");
  lines.push("  2. Gadgeteer / Alchemist / Scholar — class grants, mods/tricks scales on level-up");
  lines.push("  3. Rogue / Assassin / Archaeologist / Navigator — Sneak Attack, BI, bg/role grants");
  lines.push("  At levels 1/5/10/15/20: confirm ItemGrants, roll attacks, limited-use buttons, scale values");

  return lines.join("\n");
}

export function main() {
  const jsonOut = process.argv.includes("--json");
  const fullMode = process.argv.includes("--full");
  const sets = getAuditBuildSets();
  const builds = fullMode ? sets.full : sets.curated;
  const report = runFullAudit(builds);

  mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = join(OUT_DIR, "audit-report.json");
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const text = formatConsoleReport(report, builds, fullMode);
  if (jsonOut) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    process.stdout.write(text + "\n");
    process.stdout.write(`\nFull JSON: ${jsonPath}\n`);
  }

  if (report.stats.phase1Errors > 0) process.exitCode = 1;
  else if (!fullMode && report.stats.phase1Warnings > 0) process.exitCode = 1;
}

main();
