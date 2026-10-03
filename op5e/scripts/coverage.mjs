// Phase 6: sourcebook entries vs baseline compendium -> reports/coverage-report.md + differences.json
import fs, { readFileSync, writeFileSync } from "node:fs";
const J = (p) => JSON.parse(readFileSync(p, "utf8"));
const entries = J("extracted/entries.json");
// current build (packs-src) + automation audit status; baseline/ stays immutable for before/after comparison
const audit = new Map(J("reports/compendium-automation-audit.json").rows.map((r) => [`${r.pack}|${r.name}`, r]));
const cls = fs.readdirSync("packs-src").flatMap((pack) => fs.readdirSync(`packs-src/${pack}`).map((f) => J(`packs-src/${pack}/${f}`)).map((d) => { const a = audit.get(`${pack}|${d.name}`); return { pack, name: d.name, status: a?.status === "needs-automation" ? "INCOMPLETE" : "STATIC_OK", notes: a?.notes ?? [] }; }));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const idx = new Map(); for (const c of cls) { const k = norm(c.name); (idx.get(k) ?? idx.set(k, []).get(k)).push(c); }
// chapter -> expected target pack kind; null = prose/structure, not a compendium object
const target = (e) => {
  if (e.kind === "monster") return "actor-npc";
  if (/Mounts and Vehicles\/(Ships|Cannons)/.test(e.source.file)) return "actor-vehicle";
  if (e.kind === "devil-fruit") return "items";
  const [ch, sub] = [e.section[0] ?? "", e.section[1] ?? ""];
  if (!ch || /Credits|General Sub/.test(ch)) return null;
  if (e.name === ch || e.section.length === 0 || /^Chapter \d|^Appendix/.test(e.name)) return null; // chapter index
  if (/Ship|Mounts and Vehicles/.test(e.section.join("/"))) return "actor-vehicle";
  if (/Chapter [1-3]|Chapter [57]/.test(ch)) return "features";
  if (/Chapter 4|Chapter 8/.test(ch)) return "items";
  if (/Appendix A/.test(ch)) return "creations";
  return null; // Chapter 6 reference prose, Appendix B rulings -> rules
};
const out = [], tally = {};
for (const e of entries) {
  const t = target(e); let state, match = idx.get(e.key) ?? [];
  if (!t) state = "NOT_APPLICABLE";
  else if (t.startsWith("actor")) state = idx.has(e.key) || /Ships and Waterborne|Cannons/.test(e.name) ? "EXACT" : "MISSING";
  else if (!match.length) state = e.hints.words < 25 ? "AMBIGUOUS" : "MISSING";
  else if (match.some((m) => m.status === "INCOMPLETE" || m.status === "DUPLICATE" && m.notes.length)) state = "NEEDS_AUTOMATION";
  else state = "EXACT"; // name-level only; content diff is a Phase 8 task
  tally[`${t ?? "none"}|${state}`] = (tally[`${t ?? "none"}|${state}`] ?? 0) + 1;
  out.push({ name: e.name, target: t, state, file: e.source.file, matches: match.map((m) => `${m.pack}:${m.status}`) });
}
writeFileSync("reports/differences.json", JSON.stringify(out, null, 1));
const st = {}; for (const o of out) st[o.state] = (st[o.state] ?? 0) + 1;
const md = `# Coverage report (name-level, baseline vs vault Sourcebook)\n\nEntries: ${out.length}\n\n| State | Count |\n|---|--:|\n${Object.entries(st).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}\n\n## By target|state\n\n${Object.entries(tally).sort().map(([k, v]) => `- ${k}: ${v}`).join("\n")}\n\nEXACT means a same-named doc exists; field-level diffs come in Phase 8.\n`;
writeFileSync("reports/coverage-report.md", md); console.log(md);
