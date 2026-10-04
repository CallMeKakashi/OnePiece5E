// Runs the real-UI walkthroughs in order (headless browser as the Automation user, test world) and fails if any check FAILs.
// Usage: node dev/harness/walkthrough-all.mjs      Screenshots land in reports/walkthrough*/ (ignored by git).
import { spawnSync } from "node:child_process";

const SCRIPTS = ["walkthrough", "walkthrough2", "walkthrough3", "walkthrough4", "walkthrough5", "walkthrough6"];
let pass = 0, fail = 0;
for (const s of SCRIPTS) {
  const r = spawnSync("node", [`dev/harness/${s}.mjs`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const out = `${r.stdout}${r.stderr}`;
  const p = (out.match(/^PASS /gm) ?? []).length, f = (out.match(/^FAIL /gm) ?? []).length;
  pass += p; fail += f + (r.status ? 1 : 0);
  console.log(`${s}: ${p} pass, ${f} fail${r.status ? `, exit ${r.status}` : ""}`);
  for (const l of out.split("\n").filter((x) => /^FAIL /.test(x))) console.log(`  ${l.slice(0, 200)}`);
}
console.log(`WALKTHROUGHS: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
