// Runs the real-UI walkthroughs in order (headless browser as the Automation user, test world) and fails if any check FAILs.
// Usage: node dev/harness/walkthrough-all.mjs      Screenshots land in reports/walkthrough*/ (ignored by git).
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SCRIPTS = ["walkthrough", "walkthrough2", "walkthrough3", "walkthrough4", "walkthrough5", "walkthrough6"];
const J = (f) => { try { return JSON.parse(readFileSync(f, "utf8")); } catch { return null; } };
const CHECKS = {
  walkthrough: () => { const r = J("reports/walkthrough/walkthrough-result.json"); return [["Create OPC wizard builds the character in the real UI", !!r?.result?.classes?.length && r.result.roleFeats?.length > 0, JSON.stringify(r?.result?.classes)]]; },
  walkthrough2: () => { const r = J("reports/walkthrough2/walkthrough2-result.json"); return [["Level-up through the real UI reaches level 8 with Haki", r?.result?.level === 8 && r.result.haki?.length >= 1, `L${r?.result?.level} haki ${r?.result?.haki?.length}`]]; },
  walkthrough3: () => { const r = J("reports/walkthrough3/walkthrough3-result.json"); return [["Level-up to 14 grants the whole Haki chain", r?.result?.level === 14 && r.result.haki?.length === 4, `L${r?.result?.level} haki ${r?.result?.haki?.length}`], ["A feat whose prerequisite is not met is refused", r?.result?.tookUnqualifiedFeat === false && (r.asiNotifications?.length ?? 0) > 0, `${r?.asiNotifications?.length} refusal(s)`]]; },
};
let pass = 0, fail = 0;
for (const s of SCRIPTS) {
  const r = spawnSync("node", [`dev/harness/${s}.mjs`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const out = `${r.stdout}${r.stderr}`;
  const p = (out.match(/^PASS /gm) ?? []).length, f = (out.match(/^FAIL /gm) ?? []).length;
  pass += p; fail += f + (r.status ? 1 : 0);
  for (const [name, ok, detail] of CHECKS[s]?.() ?? []) { console.log(`${ok ? "PASS" : "FAIL"} ${s}: ${name} ${detail}`); ok ? pass++ : fail++; }
  console.log(`${s}: ${p} pass, ${f} fail${r.status ? `, exit ${r.status}` : ""}`);
  for (const l of out.split("\n").filter((x) => /^FAIL /.test(x))) console.log(`  ${l.slice(0, 200)}`);
}
console.log(`WALKTHROUGHS: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
