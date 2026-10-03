// Exhaustive structural completeness audit: every markdown file and heading in Sourcebook/ against every compendium document name.
// Read-only; needs a built packs-src/. Writes reports/sourcebook-completeness.{json,md}. Unmatched titles are leads to triage, not all gaps
// (prose headings such as "Overview" are expected to be unmatched).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, basename } from "node:path";

const SB = "../Sourcebook";
const norm = (s) => String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/\(.*?\)/g, " ").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
const names = new Map();
for (const p of readdirSync("packs-src")) for (const f of readdirSync(`packs-src/${p}`)) {
  const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf8"));
  names.set(norm(d.name), `${p}/${d.name}`);
  for (const pg of d.pages ?? []) names.set(norm(pg.name ?? ""), `${p}/${d.name}`);
}
const files = [];
(function walk(d) { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); e.isDirectory() ? walk(p) : e.name.endsWith(".md") && files.push(p); } })(SB);

const GENERIC = new Set(["overview", "introduction", "description", "actions", "traits", "credits", "contents", "table of contents", "notes", "examples", "example", "options", "rules", "summary", "features", "equipment", "proficiencies", "hit points", "at higher levels"]);
const out = []; let titles = 0, matched = 0;
const perTop = {};
for (const f of files) {
  const rel = relative(SB, f).replace(/\\/g, "/"), top = rel.split("/")[0];
  const txt = readFileSync(f, "utf8");
  const heads = [...new Set([basename(f, ".md"), ...[...txt.matchAll(/^#{2,6}\s+(.+?)\s*$/gm)].map((m) => m[1].replace(/[*_`]/g, ""))])];
  for (const h of heads) {
    titles++; const n = norm(h);
    perTop[top] ??= { titles: 0, matched: 0 };
    perTop[top].titles++;
    if (names.has(n)) { matched++; perTop[top].matched++; continue; }
    if (!n || GENERIC.has(n) || n.length < 3) continue;
    out.push({ top, file: rel, title: h });
  }
}
mkdirSync("reports", { recursive: true });
writeFileSync("reports/sourcebook-completeness.json", JSON.stringify({ files: files.length, titles, matched, perTop, unmatched: out }, null, 2));
const byTop = {};
for (const u of out) (byTop[u.top] ??= []).push(`${u.title}  _(${u.file})_`);
writeFileSync("reports/sourcebook-completeness.md", [`# Sourcebook completeness`, ``, `Files ${files.length}, headings/titles ${titles}, matched to a compendium name ${matched}, unmatched ${out.length}.`, ``,
  `| section | titles | matched |`, `|---|---:|---:|`, ...Object.entries(perTop).map(([k, v]) => `| ${k} | ${v.titles} | ${v.matched} |`), ``,
  ...Object.entries(byTop).flatMap(([k, v]) => [`## ${k} (${v.length} unmatched)`, ...v.map((x) => `- ${x}`), ``])].join("\n"));
console.log({ files: files.length, titles, matched, unmatched: out.length });
console.log(perTop);
console.log(Object.fromEntries(Object.entries(byTop).map(([k, v]) => [k, v.length])));
