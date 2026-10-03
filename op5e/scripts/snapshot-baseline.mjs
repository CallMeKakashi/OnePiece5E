// Writes baseline/manifests/documents.json from baseline/compendium (immutable snapshot).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
const root = "baseline/compendium", out = [];
for (const pack of readdirSync(root)) for (const f of readdirSync(`${root}/${pack}`)) {
  const d = JSON.parse(readFileSync(`${root}/${pack}/${f}`, "utf8"));
  const acts = Object.values(d.system?.activities ?? {});
  out.push({ pack, id: d._id, name: d.name, type: d.type, uuid: `Compendium.op5e.${pack}.Item.${d._id}`,
    activities: acts.map(a => ({ id: a._id, type: a.type, hasDamage: !!a.damage?.parts?.length, effects: (a.effects ?? []).length })),
    effects: (d.effects ?? []).map(e => ({ id: e._id, name: e.name, changes: (e.changes ?? []).length })) });
}
writeFileSync("baseline/manifests/documents.json", JSON.stringify(out, null, 1));
const c = (f) => out.reduce((n, d) => n + f(d), 0);
const s = { documents: out.length, activities: c(d => d.activities.length), effects: c(d => d.effects.length),
  byType: Object.fromEntries([...new Set(out.map(d => d.type))].map(t => [t, out.filter(d => d.type === t).length])),
  byPack: Object.fromEntries([...new Set(out.map(d => d.pack))].map(p => [p, out.filter(d => d.pack === p).length])) };
writeFileSync("baseline/reports/summary.json", JSON.stringify(s, null, 1)); console.log(s);
