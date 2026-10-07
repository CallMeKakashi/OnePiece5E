// Runs the level-up test as parallel shards (one browser and one automation user each, Foundry allows one login per user), then merges the results.
// Shard count follows free memory: each browser needs about 2.5 GB and 6 GB must stay free. Usage: node dev/harness/levelup-parallel.mjs [maxShards]
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { shardsFor } from "../../scripts/memory-gate.mjs";

const n = shardsFor(Number(process.argv[2] ?? 3));
console.log(`level-up: ${n} shard(s)`);
const run = (i) => new Promise((res) => {
  const p = spawn("node", ["dev/harness/levelup.mjs"], { env: { ...process.env, FOUNDRY_USER: i ? `Automation ${i + 1}` : "Automation", SLICE: `${i}/${n}`, LEVELUP_OUT: `reports/.levelup-shard-${i}.json` }, stdio: ["ignore", "pipe", "pipe"] });
  p.stdout.on("data", (d) => process.stdout.write(d)); p.stderr.on("data", (d) => process.stderr.write(d));
  p.on("close", (code) => res(code));
});
const codes = await Promise.all([...Array(n).keys()].map(run));
const results = [];
for (let i = 0; i < n; i++) { try { results.push(...JSON.parse(readFileSync(`reports/.levelup-shard-${i}.json`, "utf8"))); } catch { /* a crashed shard shows up as a bad exit code */ } }
writeFileSync("reports/execution-levelup.json", JSON.stringify(results, null, 1));
console.log(`== level-up: ${results.length} class/subclass runs, ${results.filter((r) => r.fails.length).length} with issues`);
process.exit(codes.some((c) => c) ? 2 : 0);
