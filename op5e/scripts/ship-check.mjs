// The ship-before-campaign test plan, automated part. Runs each stage in order, stops at the first failure, writes reports/ship-check.json
// and appends all output to reports/ship.log (read by scripts/status-page.mjs). Needs Foundry running on the test world or the bb-rehearsal campaign copy.
// Usage: node scripts/ship-check.mjs [--from <stage name>] [--small] [--resume] [--skip "stage,stage"]   (--resume: continue a stopped sweep from its checkpoints)
// Pause or stop the sweep any time: node scripts/control.mjs pause|resume|stop   (--small: sampled sweep, ~10 min instead of ~1 h)
import { spawn } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { STAGES } from "./ship-stages.mjs";

const small = process.argv.includes("--small"), resume = process.argv.includes("--resume");
const from = process.argv.includes("--from") ? process.argv[process.argv.indexOf("--from") + 1] : null;
const start = from ? Math.max(0, STAGES.findIndex(([n]) => n === from)) : 0;
const prev = (() => { try { return JSON.parse(readFileSync("reports/ship-check.json", "utf8")).results; } catch { return []; } })();
const results = prev.filter((r) => STAGES.findIndex(([n]) => n === r.name) < start);   // a resumed run keeps the stages that already passed
if (!from) writeFileSync("reports/ship.log", "");

const run = (cmd) => new Promise((res) => {
  const p = spawn(cmd, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
  const out = (d) => { process.stdout.write(d); appendFileSync("reports/ship.log", d); };
  p.stdout.on("data", out); p.stderr.on("data", out);
  p.on("close", (code) => res(code === 0));
});

const skip = process.argv.includes("--skip") ? process.argv[process.argv.indexOf("--skip") + 1].split(",") : [];   // e.g. --skip "rebuild PCs,old characters"
for (const [name, base] of STAGES.slice(start).filter(([n]) => !skip.includes(n))) {
  const cmd = name === "sweep" ? [base, small && "--small", resume && "--resume"].filter(Boolean).join(" ") : base;
  const t = Date.now();
  appendFileSync("reports/ship.log", `\n=== ${name}: ${cmd}\n`);
  const ok = await run(cmd);
  results.push({ name, ok, minutes: Math.round((Date.now() - t) / 600) / 100 });
  writeFileSync("reports/ship-check.json", JSON.stringify({ at: new Date().toISOString(), results }, null, 1));
  if (!ok) { console.log(`\nSTOPPED at "${name}". Fix it and re-run with --from "${name}".`); process.exit(1); }
}
console.log("\nAutomated stages passed. Now do the manual stages in docs/SHIP-CHECK.md.");
