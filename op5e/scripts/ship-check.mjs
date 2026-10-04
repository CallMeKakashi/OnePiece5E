// The ship-before-campaign test plan, automated part. Runs each stage in order, stops at the first failure, writes reports/ship-check.json.
// Needs Foundry running on the TEST world. Stages marked manual are in docs/SHIP-CHECK.md.
// Usage: node scripts/ship-check.mjs [--from <stage name>] [--small]   (--small: sampled sweep, ~10 min instead of ~1 h)
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const small = process.argv.includes("--small") ? ["--small"] : [];
const STAGES = [
  ["build", "npm run build"],
  ["validate+regression+unit", "node scripts/validate-packs.mjs && node scripts/regression.mjs && npm test"],
  ["images", "node scripts/check-images.mjs"],
  ["source checks", "node scripts/check-armor.mjs && node scripts/check-class-tables.mjs && node scripts/check-items-vs-source.mjs && node scripts/check-races-vs-source.mjs && node scripts/check-automation-accuracy.mjs"],
  ["sync to live world", "node dev/harness/sync-live.mjs --force"],
  ["prerequisites", "node dev/harness/prereq.mjs"],
  ["wizard", "node dev/harness/wizard.mjs"],
  ["level-up", "node dev/harness/levelup.mjs"],
  ["optional rules", "node dev/harness/optional-rules.mjs"],
  ["sweep", `node dev/harness/sweep-parallel.mjs ${small.join(" ")}`],
  ["rebuild PCs", "node dev/harness/rebuild-pcs.mjs"],
  ["transformations", "node dev/harness/transform.mjs | tee reports/transform.log && ! grep -q FAIL reports/transform.log"],
];
const from = process.argv.indexOf("--from") > 0 ? process.argv[process.argv.indexOf("--from") + 1] : null;
const todo = from ? STAGES.slice(Math.max(0, STAGES.findIndex(([n]) => n === from))) : STAGES;
const results = [];
for (const [name, cmd] of todo) {
  const t = Date.now();
  console.log(`\n=== ${name}: ${cmd}`);
  const ok = spawnSync(cmd, { shell: true, stdio: "inherit" }).status === 0;
  results.push({ name, ok, minutes: Math.round((Date.now() - t) / 600) / 100 });
  writeFileSync("reports/ship-check.json", JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  if (!ok) { console.log(`\nSTOPPED at "${name}". Fix it and re-run with --from "${name}".`); process.exit(1); }
}
console.log("\nAutomated stages passed. Now do the manual stages in docs/SHIP-CHECK.md.");
