import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "../../helpers/id.js";
import { parseTables, rowRange, type ParsedTable } from "../../helpers/rolltable.js";
import { handTables } from "../roll-tables/index.js";

// Reference journal: sourcebook rules/tables/optional rules, one entry per top section, one page per markdown file.
// The vault md is flattened PDF text (no pipe tables): numbered "d6 Ideal" / "Stage Effect" tables are detected (helpers/rolltable.ts)
// and rendered as real HTML tables; other prose keeps its line breaks.
const SB = join(dirname(fileURLToPath(import.meta.url)), "../../../../Sourcebook");
const SECTIONS = ["Appendix B Running The Game", "Chapter 3 Character Origins", "Chapter 4 Equipment and Items", "Chapter 5 Customization", "Chapter 6 Devil Fruits", "Credits", "General Sub Sections"];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const tableHtml = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

function parsedHtml(t: ParsedTable): string {
  const labeled = t.rows.some((r) => r.label);
  const head = labeled ? [t.key, "Name", t.head] : [t.key, t.head];
  return tableHtml(head, t.rows.map((r) => (labeled ? [rowRange(r), r.label ?? "", r.text] : [rowRange(r), r.text])));
}

// tables the PDF flattening leaves without numbers: [heading, header, rows, last line of the flattened table (default: next heading)]
const HAND: Record<string, { handName: string; head: string[]; until?: RegExp }> = {
  "Prismatic Wall Table": { handName: "Prismatic Wall", head: ["Layer", "Color", "Effect"] },
  "Create Object Table": { handName: "Create Object Table", head: ["#", "Material", "Duration"], until: /^Gems\s+10 minutes$/ },
  "Elemental Trap Effects": { handName: "Elemental Trap Effects", head: ["#", "Damage Type (Saving Throw)", "Effect"], until: /^Thunder\s+Strength\s+Target is knocked prone\.$/ },
};
const handDefs = new Map(handTables().map((d) => [d.name, d]));

export function mdToHtml(md: string): string {
  const text = md.replace(/\r/g, "").replace(/^---[\s\S]*?---\s*/, "").replace(/<!--[\s\S]*?-->/g, "");
  const lines = text.split("\n");
  const tables: string[] = [];
  const stash = (html: string) => { tables.push(html); return `@@TABLE:${tables.length - 1}@@`; };
  // swap each detected table's lines for a placeholder, bottom-up so indexes stay valid
  for (const t of parseTables(text).reverse()) lines.splice(t.start, t.end - t.start + 1, stash(parsedHtml(t)));
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].trim().match(/^#{1,6}\s+(.*)$/);
    const hand = hm ? HAND[hm[1]] : undefined;
    const def = hand ? handDefs.get(hand.handName) : undefined;
    if (!hand || !def) continue;
    let end = i + 1;
    while (end < lines.length && (hand.until ? !hand.until.test(lines[end].trim()) : !/^#{1,6}\s/.test(lines[end].trim()))) end++;
    if (hand.until) end++; // include the last table line
    lines.splice(i + 1, end - i - 1, stash(tableHtml(hand.head, def.rows.map((r) => [String(r.lo), r.label ?? "", r.text]))));
  }
  const tabular = lines.some((l) => /^d\d+\b/.test(l.trim()));
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushP = () => { if (para.length) out.push(`<p>${para.map(esc).join(tabular ? "<br>" : " ")}</p>`); para = []; };
  const flushL = () => { if (list.length) out.push(`<ul>${list.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>`); list = []; };
  for (const raw of lines) {
    const line = raw.trim();
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    const li = line.match(/^[-*•]\s+(.*)$/);
    const tb = line.match(/^@@TABLE:(\d+)@@$/);
    if (!line) { flushP(); flushL(); }
    else if (tb) { flushP(); flushL(); out.push(tables[Number(tb[1])]); }
    else if (h) { flushP(); flushL(); const n = Math.min(6, h[1].length + 1); out.push(`<h${n}>${esc(h[2])}</h${n}>`); }
    else if (li) { flushP(); list.push(li[1]); }
    else { flushL(); para.push(line); }
  }
  flushP(); flushL();
  return out.join("\n");
}

function walk(dir: string): string[] {
  return readdirSync(dir).sort().flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : n.endsWith(".md") ? [p] : [];
  });
}

const page = (sec: string, rel: string, name: string, i: number, html: string) => ({
  _id: generateId(`reference/${sec}/${rel}`), name, type: "text", sort: (i + 1) * 100, flags: {},
  system: {}, title: { show: true, level: 1 }, image: {}, video: {},
  text: { format: 1, content: html }, ownership: { default: -1 },
});
const entry = (sec: string, si: number, pages: ReturnType<typeof page>[]) =>
  ({ _id: generateId(`reference/${sec}`), name: sec, folder: null, sort: (si + 1) * 100, ownership: { default: 2 }, flags: {}, pages });

const RESTORED: Record<string, { title: string; body: string }> = (() => {
  const md = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "clean-rulings.md"), "utf8");
  const by: Record<string, string> = {};
  for (const m of md.split(/^## /m).slice(1)) { const nl = m.indexOf("\n"); by[m.slice(0, nl).trim()] = m.slice(nl + 1).trim(); }
  return Object.fromEntries(([["Cri", "Critical Saving Throws"], ["Par", "Party Diversity"], ["Sta", "Starting Rules"]] as const).map(([k, t]) => [k, { title: t, body: `### ${t}\n\n${by[t] ?? ""}` }]));
})();

const sections = SECTIONS.map((sec, si) => {
  const root = join(SB, sec);
  const pages = walk(root).map((f, i) => {
    const rel = relative(root, f).split("\\").join("/").replace(/\.md$/, "");
    const parts = rel.split("/");
    const name = parts.length > 1 && parts[parts.length - 1] === parts[parts.length - 2] ? parts.slice(0, -1).join(" / ") : parts.join(" / ");
    // Cri.md, Par.md and Sta.md are unreadable stubs in the vault: use the owner's restored text (clean-rulings.md) under the real titles
    const fix = RESTORED[basename(f, ".md")];
    if (fix && rel.startsWith("Suggested Rulings/")) return page(sec, rel, `Suggested Rulings / ${fix.title}`, i, mdToHtml(fix.body));
    return page(sec, rel, name || basename(f), i, mdToHtml(readFileSync(f, "utf8")));
  });
  return entry(sec, si, pages);
});

// Appendix A creation level text keeps its tables (Weather Forecast, Confusion, Storm of Vengeance, Prismatic ...) out of the item descriptions: one page per table
const APPX = "Appendix A Creation Tables";
const appxPages: ReturnType<typeof page>[] = [];
for (const f of walk(join(SB, "Appendix A Creations"))) {
  const rel = relative(SB, f).split("\\").join("/").replace(/\.md$/, "");
  for (const t of parseTables(readFileSync(f, "utf8"))) appxPages.push(page(APPX, `${rel}/${t.title}`, t.title, appxPages.length, `<p>${esc(`Appendix A, ${rel.replace("Appendix A Creations/", "")}`)}</p>${parsedHtml(t)}`));
}
for (const [heading, h] of Object.entries(HAND)) {
  const d = handDefs.get(h.handName)!;
  appxPages.push(page(APPX, `hand/${heading}`, d.name, appxPages.length, `<p>${esc(d.description)}</p>${tableHtml(h.head, d.rows.map((r) => [String(r.lo), r.label ?? "", r.text]))}`));
}
const spray = handDefs.get("Prismatic Spray")!;
appxPages.push(page(APPX, "hand/Prismatic Spray", spray.name, appxPages.length, `<p>${esc(spray.description)}</p>${tableHtml(["d8", "Color", "Effect"], spray.rows.map((r) => [String(r.lo), r.label ?? "", r.text]))}`));

export default [...sections, entry(APPX, SECTIONS.length, appxPages)];
