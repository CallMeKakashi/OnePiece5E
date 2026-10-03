// Compares features each class grants per level (from reports/execution-classes.json) with the sourcebook class table.
import { readFileSync, writeFileSync } from "node:fs";
const run = JSON.parse(readFileSync("reports/execution-classes.json", "utf8"));
const ORD = (n) => `${n}${[, "st", "nd", "rd"][n % 10 > 3 || [11, 12, 13].includes(n % 100) ? 0 : n % 10] ?? "th"}`;
const norm = (s) => s.toLowerCase().replace(/\([^)]*\)/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const SKIP = /archetype|path|college|specialization|specialist|ardent soul|style\b.*feature|subclass|feature$|ability score improvement|^$/;
const out = [];
for (const r of run.filter((x) => !x.subclass && x.grantedList)) {
  const dir = "../Sourcebook/Chapter 2 Classes", file = `${dir}/${r.class}/${r.class}.md`;
  let lines; try { lines = readFileSync(file, "utf8").split(/\r?\n/); } catch { out.push({ class: r.class, note: "no class table file" }); continue; }
  const rows = {}; let cur = null;
  const start = lines.findIndex((l) => /^Level\b.*Features/.test(l));
  for (const l of lines.slice(start + 1)) {
    const m = l.match(/^(\d+)(?:st|nd|rd|th)\s+\+\d+\s*(.*)$/);
    if (m) { cur = Number(m[1]); rows[cur] = m[2]; if (cur === 20) { continue; } }
    else if (cur && l.trim() && !/^#|^[A-Z][a-z]+ [A-Z][a-z]+ ?Features?$/.test(l)) rows[cur] += " " + l.trim();
    else if (cur === 20 && !l.trim()) break;
  }
  const have = (lvl) => new Set(r.grantedList.filter((g) => g.level <= lvl).map((g) => norm(g.name)));
  const missing = [];
  for (const [lvl, txt] of Object.entries(rows)) {
    const cleaned = txt.replace(/^(?:[\d\-─—]+\s+|\d+d\d+\s+)+/, "").replace(/─/g, "");
    for (const raw of cleaned.split(",")) {
      const n = norm(raw); if (!n || SKIP.test(n)) continue;
      const h = have(Number(lvl)); if (![...h].some((x) => x === n || x.includes(n) || n.includes(x))) missing.push(`L${lvl} ${raw.trim()}`);
    }
  }
  out.push({ class: r.class, rowsParsed: Object.keys(rows).length, missing });
}
writeFileSync("reports/class-table-check.json", JSON.stringify(out, null, 1));
for (const o of out) console.log(o.class, o.note ?? `rows ${o.rowsParsed}`, o.missing?.length ? `MISSING: ${o.missing.join(" | ")}` : "ok");
