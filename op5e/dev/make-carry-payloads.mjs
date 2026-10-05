// Prepares assets/dev/payload-<key>.json (git-ignored) for each old PC: its gear, spells and loose feats, sanitised for re-creating on the rebuilt actor.
// Usage: node dev/make-carry-payloads.mjs      The page helper dev/harness/... loads them via /modules/op5e/assets/dev/payload-<key>.json after a sync.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
const { ClassicLevel } = createRequire(import.meta.url)("classic-level");

// the old actors store an item's effects as bare ids; the effect documents live in their own table of the old world database (a read-only copy)
const OLD_DB = "C:/Users/Admin/AppData/Local/Temp/claude/F--Documents-GitHub-blood-brine/cb9bb2a9-c85b-4f42-b55f-74f4d24c1465/scratchpad/camp";
const fxByItem = new Map();
{
  const db = new ClassicLevel(OLD_DB, { valueEncoding: "json" });
  for await (const [k, v] of db.iterator()) {
    if (!k.startsWith("!actors.items.effects!")) continue;
    const [aid, iid] = k.slice("!actors.items.effects!".length).split(".");
    (fxByItem.get(`${aid}.${iid}`) ?? fxByItem.set(`${aid}.${iid}`, []).get(`${aid}.${iid}`)).push(v);
  }
  await db.close();
}

const OLD = JSON.parse(readFileSync("reports/campaign-pcs-raw.json", "utf8"));
const DATA = "D:/foundry-pi/Foundry/foundrydata/Data/";
const PCS = { Baptiste: "Baptiste", Matthew: 'Matthew "The Jack" Burgess', BOB: "B.O.B", Roma: "Roma", Hybrid: "Hybrid", Sulong: "Sulong", Malphas: "Malphas", T1: "Thunderbird Form 1", T2: "Thunderbird Form 2" };
const GEAR = new Set(["weapon", "equipment", "consumable", "tool", "loot", "spell"]);
const DEFAULT_IMG = { weapon: "icons/svg/sword.svg", equipment: "icons/svg/shield.svg", consumable: "icons/svg/item-bag.svg", tool: "icons/svg/item-bag.svg", loot: "icons/svg/item-bag.svg", spell: "icons/svg/book.svg" };
const imgOk = (u) => !u || /^(icons|systems)\//.test(u) || existsSync(DATA + decodeURIComponent(u.split("?")[0]));
const out = {};
for (const [key, name] of Object.entries(PCS)) {
  const a = OLD.find((x) => x.name === name); if (!a) continue;
  const items = [];
  let pouches = 0;
  for (const it of a.items) {
    if (/^pouch of berries/i.test(it.name)) { const m = /\((\d+)K\)/i.exec(it.name); if (m) pouches += Number(m[1]) * 1000; continue; }
    if (it.type === "container") continue;   // the loose items inside it are listed on their own
    if (!GEAR.has(it.type)) continue;
    const data = JSON.parse(JSON.stringify(it));
    data.effects = (fxByItem.get(`${a.id}.${it._id}`) ?? []).map((e) => JSON.parse(JSON.stringify(e)));
    delete data._id; delete data.folder; delete data.sort; delete data.ownership; delete data._stats;
    data.flags = { ...(data.flags ?? {}), op5e: { carriedFromOldSheet: true } };
    delete data.flags.ddbimporter; delete data.flags["ddb-importer"];
    if (data.system) { data.system.container = null; data.system.equipped = !!it.system?.equipped; }
    if (!imgOk(data.img)) data.img = DEFAULT_IMG[it.type] ?? "icons/svg/item-bag.svg";
    for (const e of data.effects ?? []) { if (!imgOk(e.img ?? e.icon)) e.img = "icons/svg/aura.svg"; }   // keep the effect ids: the item's activities refer to them
    items.push({ name: it.name, type: it.type, qty: it.system?.quantity ?? 1, equipped: !!it.system?.equipped, data });
  }
  const feats = a.items.filter((i) => i.type === "feat").map((i) => i.name);
  const sy = a.system;
  const profs = { saves: Object.entries(sy.abilities).filter(([, v]) => v.proficient).map(([k]) => k), skills: Object.fromEntries(Object.entries(sy.skills).filter(([, v]) => v.value).map(([k, v]) => [k, v.value])), tools: Object.fromEntries(Object.entries(sy.tools ?? {}).filter(([, v]) => v.value).map(([k, v]) => [k, v.value])) };
  out[key] = { old: name, profs, berries: (a.system.currency?.gp ?? 0) + pouches, items, feats };
  writeFileSync(`assets/dev/payload-${key}.json`, JSON.stringify(out[key]));
  console.log(key.padEnd(9), `${items.length} gear/spell items, ${feats.length} feats, ${out[key].berries} berries`);
}
