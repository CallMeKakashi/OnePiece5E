// The ship-before-campaign test plan, automated part. Runs each stage in order, stops at the first failure, writes reports/ship-check.json
// and appends all output to reports/ship.log (read by scripts/status-page.mjs). Needs Foundry running on the test world or the bb-rehearsal campaign copy.
// Usage: node scripts/ship-check.mjs [--from <stage name>] [--small] [--resume] [--skip "stage,stage"]   (--resume: continue a stopped sweep from its checkpoints)
// Pause or stop the sweep any time: node scripts/control.mjs pause|resume|stop   (--small: sampled sweep, ~10 min instead of ~1 h)
import { spawn } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { STAGES, POOL } from "./ship-stages.mjs";
import { shardsFor, waitForRoom } from "./memory-gate.mjs";

const small = process.argv.includes("--small"), resume = process.argv.includes("--resume");
const from = process.argv.includes("--from") ? process.argv[process.argv.indexOf("--from") + 1] : null;
const start = from ? Math.max(0, STAGES.findIndex(([n]) => n === from)) : 0;
const prev = (() => { try { return JSON.parse(readFileSync("reports/ship-check.json", "utf8")).results; } catch { return []; } })();
const results = prev.filter((r) => STAGES.findIndex(([n]) => n === r.name) < start);   // a resumed run keeps the stages that already passed
if (!from) writeFileSync("reports/ship.log", "");

const run = (cmd, env = {}, buffered = false) => new Promise((res) => {
  const p = spawn(cmd, { shell: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...env } });
  let buf = "";
  const out = (d) => { if (buffered) buf += d; else { process.stdout.write(d); appendFileSync("reports/ship.log", d); } };
  p.stdout.on("data", out); p.stderr.on("data", out);
  p.on("close", (code) => { if (buffered) { process.stdout.write(buf); appendFileSync("reports/ship.log", buf); } res(code === 0); });
});
const record = (name, ok, t) => { results.push({ name, ok, minutes: Math.round((Date.now() - t) / 600) / 100 }); writeFileSync("reports/ship-check.json", JSON.stringify({ at: new Date().toISOString(), results }, null, 1)); };

// The independent stages run side by side, each with its own automation user, as many as free memory allows (at most 3). A stage that fails in the pool is
// run again alone before it counts as a failure, because stages sharing one world can disturb each other.
const runPool = async (names) => {
  const USERS = ["Automation", "Automation 2", "Automation 3"], free = [...USERS], queue = [...names], failed = [];
  const one = async (name, user) => {
    const t = Date.now(), cmd = STAGES.find(([n]) => n === name)[1];
    appendFileSync("reports/ship.log", `
=== ${name} (pool, ${user}): ${cmd}
`);
    const ok = await run(cmd, { FOUNDRY_USER: user }, true);
    free.push(user); if (ok) record(name, true, t); else failed.push(name);
  };
  const active = new Set();
  while (queue.length || active.size) {
    if (queue.length && free.length) {
      await waitForRoom();
      const name = queue.shift(), pr = one(name, free.shift()).then(() => active.delete(pr)); active.add(pr);
    } else await Promise.race(active);
  }
  for (const name of failed) {   // second chance, alone and with the default user
    const t = Date.now(); appendFileSync("reports/ship.log", `
=== ${name} (retry alone)
`);
    const ok = await run(STAGES.find(([n]) => n === name)[1]); record(name, ok, t);
    if (!ok) { console.log(`
STOPPED at "${name}". Fix it and re-run with --from "${name}".`); process.exit(1); }
  }
};

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
