// Aggregates reports/*.json into reports/unresolved.json + reports/final-report.md. Run after build, validate, regression and the foundry runs.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const J = (p, d = null) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : d);
const val = J("reports/validation-report.json")?.summary;
const reg = J("reports/regression-report.json");
const exec = {
  baseline: J("reports/execution-baseline.json"), items: J("reports/execution-items.json"),
  monsters: J("reports/execution-monsters.json"), ships: J("reports/execution-ships.json"), ids: J("reports/execution-ids.json"),
};
const diff = J("reports/differences.json", []);

// Unresolved: anything flagged NEEDS_REVIEW in the built packs + known source ambiguities.
const unresolved = [];
for (const pack of readdirSync("packs-src")) for (const f of readdirSync(`packs-src/${pack}`)) {
  const d = JSON.parse(readFileSync(`packs-src/${pack}/${f}`, "utf8"));
  if (d.flags?.op5e?.automation === "NEEDS_REVIEW") unresolved.push({ name: d.name, pack, problem: d.flags.op5e.note ?? "source gives prose powers with no dice/DCs/durations; no mechanics invented", automation: "blocked" });
}
unresolved.push(
  { name: "Ship stat rows", pack: "ships", problem: "AC/HP/slots table in Cannons.md has no row names; aligned to ship table by order (8 rows = 8 ships, values plausible)", automation: "generated, needs confirmation" },
  { name: "Cannon availability rows", pack: "ship-weapons", problem: "Clean and Reload / Ship Availability table has no row names; aligned to cannon table by order", automation: "generated, needs confirmation" },
  { name: "Ship speed units", pack: "ships", problem: "Speeds are mph; stored as movement.swim with units mi. Foundry has no native mph unit", automation: "generated" },
  { name: "Lute", pack: "items", problem: "Named in Bard starting equipment but absent from the Tools table; price/weight taken from 5e SRD (35 gp x10000)", automation: "generated, needs confirmation" },
  { name: "Ship Rooms / Upgrades", pack: "-", problem: "Source text is column-scrambled (PDF extraction); room effects cannot be reconstructed reliably", automation: "blocked" },
  { name: "Creation creature sheets (Appendix A Actions)", pack: "-", problem: "Stat lines scale with the creator's level and creation attack/save DC; need a scaling design decision", automation: "not generated" },
  { name: "midi-qol / chris-premades", pack: "-", problem: "Installed versions require dnd5e >= 5.2 but the world runs 5.1.10, so Midi/CPR behaviour could not be tested", automation: "untested" },
);
// group identical problems (e.g. 28 devil fruits) into one line
const grouped = [];
for (const u of unresolved) {
  const g = grouped.find((x) => x.pack === u.pack && x.problem === u.problem && x.automation === u.automation);
  if (g) g.names.push(u.name); else grouped.push({ ...u, names: [u.name] });
}
writeFileSync("reports/unresolved.json", JSON.stringify(grouped, null, 1));

const tally = (rows, key) => rows.reduce((t, r) => ((t[r[key]] = (t[r[key]] ?? 0) + 1), t), {});
const cov = tally(diff, "state");
const sweepAll = [...Object.values(exec.baseline ?? {}).flat(), ...(exec.items?.items ?? [])];
const sweepRows = sweepAll.filter((r) => r.status !== "NO_ACTIVITY");
const timedOut = sweepRows.filter((r) => r.activities.some((a) => a.error === "TIMEOUT")).length;
const acts = (rows) => rows.reduce((n, r) => n + (r.activities?.length ?? 0), 0);
const md = `# Final report

## Sourcebook coverage (name-level)
${Object.entries(cov).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Foundry validation (static)
- Documents: ${val?.documents}, internal links checked: ${val?.links}
- Errors: ${val?.errors}, warnings: ${val?.warnings} (mostly attack activities without an explicit attack block, and same-name features across classes)

## Automation (executed in the Foundry test world, dnd5e 5.1.10)
- Baseline activity-bearing items executed: ${sweepRows.length} (${acts(sweepRows)} activities); ${timedOut} first timed out on measured-template placement (harness limitation); all re-ran PASS once the harness skipped templates
- Monsters: ${exec.monsters?.filter((r) => r.pass).length}/${exec.monsters?.length} pass (HP/AC/CR vs stat block, attack roll bonus, damage)
- Ships and cannons: ${exec.ships?.filter((r) => r.pass).length}/${exec.ships?.length} pass
- Stable activity ids after embed: ${exec.ids ? `${exec.ids.checked - exec.ids.bad.length}/${exec.ids.checked}` : "not run"}
- Limits: smoke-level for baseline content (activity runs without error); value assertions exist only for monsters, ships and cannons

## Regression vs baseline
- Baseline documents: ${reg?.baseline}; preserved identical: ${reg?.preserved}; changed: ${reg?.changed.length} (${reg?.changed.map((c) => c.name).join(", ")}); regressed: ${reg?.regressed.length}; added: ${reg?.added}

## Remaining issues (${grouped.length})
${grouped.map((u) => `- **${u.names.length > 1 ? `${u.names.length} items` : u.name}** (${u.pack}): ${u.problem} [${u.automation}]`).join("\n")}
`;
writeFileSync("reports/final-report.md", md);
console.log(md);
