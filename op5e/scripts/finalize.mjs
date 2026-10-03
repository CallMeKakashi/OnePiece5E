// Assembles final/: installable module zip + manifest + validation, automation, coverage and unresolved reports.
// Run after `npm run gates` and `npm run test:foundry`; refuses to run if any report is missing.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const need = ["validation-report.json", "regression-report.json", "execution-baseline.json", "execution-items.json", "execution-monsters.json", "execution-ships.json",
  "execution-ids.json", "execution-feats.json", "execution-effects.json", "execution-gear.json", "execution-classes.json", "execution-classes-subclasses.json",
  "execution-origins-races.json", "execution-origins-backgrounds.json"];
const missing = need.filter((f) => !existsSync(`reports/${f}`));
if (missing.length) { console.error(`missing reports: ${missing.join(", ")}`); process.exit(1); }

for (const cmd of [["node", ["scripts/final-report.mjs"]], ["npm", ["run", "package"]]]) {
  const r = spawnSync(cmd[0], cmd[1], { stdio: "ignore", shell: process.platform === "win32" });
  if (r.status) { console.error(`${cmd.join(" ")} failed`); process.exit(1); }
}
mkdirSync("final", { recursive: true });
copyFileSync("dist/module.json", "final/manifest.json");
copyFileSync("dist/op5e.zip", "final/op5e.zip");
for (const f of ["validation-report.json", "unresolved.json", "coverage-report.md", "final-report.md"]) copyFileSync(`reports/${f}`, `final/${f}`);
const R = (f) => JSON.parse(readFileSync(`reports/${f}`, "utf8"));
writeFileSync("final/automation-report.json", JSON.stringify(Object.fromEntries(need.filter((f) => f.startsWith("execution") || f.startsWith("regression")).map((f) => [f.replace(".json", ""), R(f)])), null, 1));
console.log("final/ ready");
