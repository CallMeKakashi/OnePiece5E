// Runs the full sweep as parallel shards, one per automation user (Foundry allows one login per user), then merges the results.
// Needs the users "Automation", "Automation 2" ... "Automation 5" (GM role, no password) in the test world.
// Usage: node dev/harness/sweep-parallel.mjs [--small] [shard index ...]
//   --small  quick check: one shard, every 25th doc of every pack (about 90 docs)
//   --resume continue a stopped or crashed sweep from each shard's checkpoint (control: node scripts/control.mjs pause|resume|stop)
//   indexes  re-run only those shards; the others keep their last results
// Prints a one-line progress report every 30 s; writes reports/execution-everything.json when done.
import { spawn } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const ALL = ["class-features", "racial-features", "feats", "items", "creations", "backgrounds", "devil-fruits", "ship-weapons"];
// 3 shards by default: every shard is a headless browser of about 3.5 GB. SWEEP_SHARDS=5 uses all five automation users.
const FIVE = [
  { user: "Automation", packs: ["class-features"], slice: "0/3" },
  { user: "Automation 2", packs: ["class-features"], slice: "1/3" },
  { user: "Automation 3", packs: ["class-features"], slice: "2/3" },
  { user: "Automation 4", packs: ["feats", "racial-features", "ship-weapons", "devil-fruits"], slice: "0/1" },
  { user: "Automation 5", packs: ["items", "creations", "backgrounds"], slice: "0/1" },
];
const THREE = [   // the two class-features shards take every other document of EVERY pack they list, so both list the same packs
  { user: "Automation", packs: ["class-features", "racial-features", "feats", "backgrounds", "devil-fruits", "ship-weapons"], slice: "0/2" },
  { user: "Automation 2", packs: ["class-features", "racial-features", "feats", "backgrounds", "devil-fruits", "ship-weapons"], slice: "1/2" },
  { user: "Automation 3", packs: ["items", "creations"], slice: "0/1" },
];
const SHARDS = process.argv.includes("--small") ? [{ user: "Automation", packs: ALL, slice: "0/25" }] : process.env.SWEEP_SHARDS === "5" ? FIVE : THREE;
let resume = process.argv.includes("--resume");
const only = process.argv.slice(2).filter((a) => /^\d+$/.test(a)).map(Number);
const active = SHARDS.map((s, i) => i).filter((i) => !only.length || only.includes(i));

const packSize = (p) => readdirSync(`packs-src/${p}`).length;
const shardTotal = (s) => s.packs.reduce((t, p) => t + Math.ceil(packSize(p) / Number(s.slice.split("/")[1])), 0);
const total = active.reduce((t, i) => t + shardTotal(SHARDS[i]), 0);
const prog = {};   // shard index -> pack -> { n, fails }
const t0 = Date.now();
const report = () => {
  let n = 0, fails = 0;
  for (const per of Object.values(prog)) for (const v of Object.values(per)) { n += v.n; fails += v.fails; }
  const el = (Date.now() - t0) / 1000, rate = n / Math.max(el, 1), eta = rate ? Math.round((total - n) / rate / 60) : "?";
  writeFileSync("reports/sweep-progress.json", JSON.stringify({ n, total, fails, minutes: Math.round(el / 60), etaMinutes: eta, shards: prog, at: Date.now() }));
  console.log(`PROGRESS ${n}/${total} docs (${Math.round((100 * n) / total)}%), ${fails} failed, ${Math.round(el / 60)} min elapsed, about ${eta} min left`);
};
const timer = setInterval(report, 30000);

const run = (i) => new Promise((res) => {
  const s = SHARDS[i], out = `reports/.sweep-shard-${i}.json`;
  if (!resume) writeFileSync(out, "{}");   // --resume keeps each shard's checkpoint and skips the documents already tested
  const p = spawn("node", ["dev/harness/everything.mjs", ...s.packs], { env: { ...process.env, FOUNDRY_USER: s.user, SLICE: s.slice, SWEEP_OUT: out, RESUME: resume ? "1" : "0" }, stdio: ["ignore", "pipe", "pipe"] });
  p.stdout.on("data", (d) => {
    for (const l of String(d).split("\n").filter(Boolean)) {
      const m = /^PROGRESS (\S+) (\d+)\/\d+ fails (\d+)/.exec(l);
      if (m) (prog[i] ??= {})[m[1]] = { n: Number(m[2]), fails: Number(m[3]) };
      else console.log(`[${s.user}] ${l}`);
    }
  });
  p.stderr.on("data", (d) => process.stderr.write(`[${s.user}] ${d}`));
  p.on("close", (code) => res({ out, code }));
});
// exit code 4 = the shard saved its place and asked for a fresh browser: start it again, resuming
const runShard = async (i) => { let r = await run(i); while (r.code === 4) { resume = true; r = await run(i); } return r; };
const done = await Promise.all(active.map(runShard));
clearInterval(timer);
report();
const merged = {};
for (const i of [0, 1, 2, 3, 4]) {
  try { for (const [pack, rows] of Object.entries(JSON.parse(readFileSync(`reports/.sweep-shard-${i}.json`, "utf8")))) { const into = (merged[pack] ??= []); for (const r of rows) if (!into.some((x) => x.id === r.id)) into.push(r); } } catch { /* shard never ran */ }
}
if (!process.argv.includes("--small")) writeFileSync("reports/execution-everything.json", JSON.stringify(merged, null, 1));
let docs = 0, fails = 0;
for (const [pack, rows] of Object.entries(merged)) { const f = rows.filter((r) => r.fails?.length).length; docs += rows.length; fails += f; console.log(`== ${pack}: ${rows.length} docs, ${f} fail`); }
console.log(`SWEEP TOTAL: ${docs} docs, ${fails} fail; shard exit codes ${done.map((d) => d.code).join(",")}`);
process.exit(fails || done.some((d) => d.code) ? 1 : 0);
