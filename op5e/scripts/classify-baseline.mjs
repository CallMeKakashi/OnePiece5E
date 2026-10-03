// Phase 2: static classification of baseline docs. Execution results arrive in Phase 13; until then "working" = STATIC_OK, never WORKING.
import { readFileSync, writeFileSync } from "node:fs";
const rows = JSON.parse(readFileSync("reports/compendium-automation-audit.json", "utf8")).rows;
const seen = new Map(), out = [];
for (const r of rows) {
  const k = `${r.pack}|${r.name.toLowerCase()}`; seen.set(k, (seen.get(k) ?? 0) + 1);
}
for (const r of rows) {
  let status = "UNKNOWN";
  if (seen.get(`${r.pack}|${r.name.toLowerCase()}`) > 1) status = "DUPLICATE";
  else if (r.status === "needs-automation") status = "INCOMPLETE";
  else if (r.status === "reference") status = "REFERENCE";
  else if (r.status === "ready") status = r.notes.length ? "PARTIALLY_WORKING" : "STATIC_OK";
  out.push({ pack: r.pack, name: r.name, type: r.type, status, execution: "UNTESTED", notes: r.notes });
}
writeFileSync("baseline/reports/classification.json", JSON.stringify(out, null, 1));
const tally = {}; for (const o of out) tally[o.status] = (tally[o.status] ?? 0) + 1; console.log(tally);
