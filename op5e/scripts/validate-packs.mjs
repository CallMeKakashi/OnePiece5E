// Phase 9 static quality gate over packs-src/. Exit 1 on any error. Writes reports/validation-report.json.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const ROOT = "packs-src";
const ID16 = /^[A-Za-z0-9]{16}$/;
const ABILITIES = new Set(["str", "dex", "con", "int", "wis", "cha", "hon"]);
const issues = [];
const add = (level, pack, name, msg) => issues.push({ level, pack, name, msg });

const docs = [];
for (const pack of readdirSync(ROOT)) for (const f of readdirSync(`${ROOT}/${pack}`)) {
  const d = JSON.parse(readFileSync(`${ROOT}/${pack}/${f}`, "utf8"));
  docs.push({ pack, d });
}
const ids = new Map(); // pack -> Set(id)
for (const { pack, d } of docs) (ids.get(pack) ?? ids.set(pack, new Set()).get(pack)).add(d._id);

const checkActivities = (pack, item) => {
  for (const [key, a] of Object.entries(item.system?.activities ?? {})) {
    const where = `${item.name} [${key}]`;
    if (!ID16.test(key) || a._id !== key) add("error", pack, where, `activity id "${key}" invalid or != _id`);
    const parts = a.damage?.parts ?? [];
    if (a.type === "utility" && (a.damage || a.attack || a.save)) add("error", pack, where, "utility activity has attack/damage/save block");
    if (a.type === "attack" && !a.damage) add("error", pack, where, "attack activity missing damage block");
    if (a.type === "attack" && !a.attack) add("warn", pack, where, "attack activity has no attack block (dnd5e defaults apply)");
    if (a.type === "save" && !a.save?.ability?.length) add("error", pack, where, "save activity missing save ability");
    for (const ab of a.save?.ability ?? []) if (!ABILITIES.has(ab)) add("error", pack, where, `bad save ability ${ab}`);
    for (const p of parts) {
      const ok = (p.number && p.denomination) || (p.custom?.enabled && p.custom.formula) || p.bonus;
      if (!ok) add("error", pack, where, "damage part has no formula");
    }
    for (const e of a.effects ?? []) {
      const id = e._id ?? e;
      if (!(item.effects ?? []).some((x) => x._id === id)) add("error", pack, where, `activity effect ref ${id} not on item`);
    }
  }
};

const seenNames = new Map();
for (const { pack, d } of docs) {
  if (!ID16.test(d._id)) add("error", pack, d.name, `bad _id ${d._id}`);
  const nk = `${pack}|${d.name}`; seenNames.set(nk, (seenNames.get(nk) ?? 0) + 1);
  for (const e of d.effects ?? []) {
    if (!ID16.test(e._id)) add("error", pack, `${d.name}/${e.name}`, `bad effect id ${e._id}`);
    for (const c of e.changes ?? []) if (!(c.mode >= 0 && c.mode <= 5) || typeof c.key !== "string" || !c.key) add("error", pack, `${d.name}/${e.name}`, `bad change ${JSON.stringify(c)}`);
  }
  checkActivities(pack, d);
  for (const it of d.items ?? []) {
    if (!ID16.test(it._id)) add("error", pack, `${d.name}/${it.name}`, `bad embedded id ${it._id}`);
    checkActivities(pack, { ...it, name: `${d.name}/${it.name}` });
  }
}
for (const [k, n] of seenNames) if (n > 1) { const [pack, name] = k.split("|"); add("warn", pack, name, `${n} docs share this name`); }

// UUID links to this module must resolve (Compendium.op5e.<pack>[.Item|.Actor].<id>)
const UUID = /Compendium\.op5e\.([a-z-]+)\.(?:Item\.|Actor\.)?([A-Za-z0-9]{16})/g;
let links = 0;
for (const { pack, d } of docs) for (const m of JSON.stringify(d).matchAll(UUID)) {
  links++; if (!ids.get(m[1])?.has(m[2])) add("error", pack, d.name, `broken link ${m[0]}`);
}

const errors = issues.filter((i) => i.level === "error"), warns = issues.filter((i) => i.level === "warn");
const summary = { documents: docs.length, links, errors: errors.length, warnings: warns.length, byMessage: {} };
for (const i of issues) { const k = `${i.level}: ${i.msg.replace(/[0-9a-zA-Z]{16}/g, "<id>").replace(/"[^"]*"/g, "\"…\"")}`; summary.byMessage[k] = (summary.byMessage[k] ?? 0) + 1; }
writeFileSync("reports/validation-report.json", JSON.stringify({ summary, issues }, null, 1));
console.log(JSON.stringify(summary, null, 1));
process.exit(errors.length ? 1 : 0);
