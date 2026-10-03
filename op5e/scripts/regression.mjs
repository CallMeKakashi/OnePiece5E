// Compares the current build (packs-src) against the immutable baseline manifest. Exit 1 if existing functionality regressed.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const base = JSON.parse(readFileSync("baseline/manifests/documents.json", "utf8"));
const cur = new Map();
for (const pack of readdirSync("packs-src")) for (const f of readdirSync(`packs-src/${pack}`)) {
  const d = JSON.parse(readFileSync(`packs-src/${pack}/${f}`, "utf8"));
  const acts = Object.values(d.system?.activities ?? {});
  cur.set(`${pack}/${d._id}`, { name: d.name, type: d.type, activities: acts.map((a) => ({ id: a._id, type: a.type })), effects: (d.effects ?? []).length });
}

const out = { baseline: base.length, preserved: 0, changed: [], regressed: [], added: 0 };
for (const b of base) {
  const c = cur.get(`${b.pack}/${b.id}`);
  if (!c) { out.regressed.push({ name: b.name, why: "document removed or id changed" }); continue; }
  const why = [];
  if (c.name !== b.name) why.push(`renamed -> ${c.name}`);
  if (c.type !== b.type) why.push(`type ${b.type} -> ${c.type}`);
  const lost = b.activities.filter((a) => !c.activities.some((x) => x.type === a.type && x.id === a.id));
  // an activity id change is a change (not regression) only when type and count survive
  if (lost.length) {
    const sameShape = c.activities.length >= b.activities.length && lost.every((a) => c.activities.some((x) => x.type === a.type));
    (sameShape ? out.changed : out.regressed).push({ name: b.name, why: `activity ids ${lost.map((a) => a.id).join(",")} not present${sameShape ? " (re-keyed)" : " (LOST)"}` });
  }
  if (c.effects < b.effects.length) out.regressed.push({ name: b.name, why: `effects ${b.effects.length} -> ${c.effects}` });
  if (why.length) out.changed.push({ name: b.name, why: why.join("; ") });
  if (!lost.length && !why.length && c.effects >= b.effects.length) out.preserved++;
}
out.added = cur.size - (base.length - out.regressed.filter((r) => r.why.startsWith("document")).length);
writeFileSync("reports/regression-report.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify({ ...out, changed: out.changed.length, regressed: out.regressed.length }));
process.exit(out.regressed.length ? 1 : 0);
