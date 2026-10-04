// Hot reload: pushes the built compendium data into the RUNNING Foundry (test world) through Foundry's own API, so no restart is needed.
// Packs are locked LevelDB files while Foundry runs, so they are updated document by document (create / replace / delete), never by file copy.
// Also copies the non-database module files (scripts, templates, styles, lang, assets); refresh the browser tab (F5) to load those.
// Only changed documents are sent (hash per document in reports/.sync-hashes.json). Needs a fresh `npm run build` (reads packs-src).
// Usage: node dev/harness/sync-live.mjs [--files-only] [--force] [pack ...]
// Touches: the test world's compendium lock setting (unlocked while syncing, locked again after) and the module folder. Never any other world.
import { cpSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { withFoundry } from "./drive.mjs";

const args = process.argv.slice(2);
const filesOnly = args.includes("--files-only"), force = args.includes("--force");
const wanted = args.filter((a) => !a.startsWith("--"));
const BASE = process.env.FOUNDRY_ROOT ?? "D:/foundry-pi/Foundry";
const MOD = `${BASE}/foundrydata/Data/modules/op5e`;
const HASHES = "reports/.sync-hashes.json";

// 1. plain files (never packs/ or module.json: a new pack or manifest change needs one Foundry restart)
for (const f of ["scripts", "templates", "styles", "lang", "assets", "data/generated"]) if (existsSync(f)) cpSync(f, `${MOD}/${f}`, { recursive: true });
console.log("module files copied (refresh the browser tab to load them)");
if (filesOnly) process.exit(0);

// 2. documents
const hashes = !force && existsSync(HASHES) ? JSON.parse(readFileSync(HASHES, "utf8")) : {};
const clean = (d) => { const c = structuredClone(d); delete c._key; delete c._stats; return c; };
const sha = (o) => createHash("sha1").update(JSON.stringify(o)).digest("hex");
const todo = {};   // pack -> { upsert: [docs], remove: [ids] }
for (const pack of readdirSync("packs-src")) {
  if (wanted.length && !wanted.includes(pack)) continue;
  const built = Object.fromEntries(readdirSync(`packs-src/${pack}`).map((f) => { const d = clean(JSON.parse(readFileSync(`packs-src/${pack}/${f}`, "utf8"))); return [d._id, d]; }));
  const old = hashes[pack] ?? {};
  const upsert = Object.values(built).filter((d) => old[d._id] !== sha(d));
  const remove = Object.keys(old).filter((id) => !built[id]);
  if (upsert.length || remove.length) todo[pack] = { upsert, remove, hashes: Object.fromEntries(Object.entries(built).map(([id, d]) => [id, sha(d)])) };
}
const summary = Object.entries(todo).map(([p, t]) => `${p}: ${t.upsert.length} changed, ${t.remove.length} removed`);
console.log(summary.length ? summary.join("\n") : "no document changes");
if (!summary.length) process.exit(0);

await withFoundry(async (page) => {
  page.setDefaultTimeout(600000);
  for (const [pack, t] of Object.entries(todo)) {
    const id = `op5e.${pack}`;
    const info = await page.evaluate(async (id) => { const p = game.packs.get(id); if (!p) return null; const was = p.locked; if (was) await p.configure({ locked: false }); return { was, type: p.documentName }; }, id);
    if (!info) { console.log(`SKIP ${pack}: not registered in the running world (needs a Foundry restart after module.json changes)`); delete hashes[pack]; continue; }
    let created = 0, replaced = 0;
    for (let i = 0; i < t.upsert.length; i += 40) {
      const r = await page.evaluate(async ({ id, docs }) => {
        const p = game.packs.get(id), cls = p.documentClass, have = new Set((await p.getIndex()).map((e) => e._id));
        const mk = docs.filter((d) => !have.has(d._id)), up = docs.filter((d) => have.has(d._id));
        if (mk.length) await cls.createDocuments(mk, { pack: id, keepId: true });
        if (up.length) await cls.updateDocuments(up, { pack: id, diff: false, recursive: false });
        return { c: mk.length, u: up.length };
      }, { id, docs: t.upsert.slice(i, i + 40) });
      created += r.c; replaced += r.u;
    }
    if (t.remove.length) await page.evaluate(async ({ id, ids }) => { const p = game.packs.get(id); await p.documentClass.deleteDocuments(ids, { pack: id }); }, { id, ids: t.remove });
    if (info.was) await page.evaluate(async (id) => game.packs.get(id).configure({ locked: true }), id);
    hashes[pack] = t.hashes;
    console.log(`${pack}: ${created} created, ${replaced} replaced, ${t.remove.length} removed`);
  }
});
writeFileSync(HASHES, JSON.stringify(hashes));
console.log("synced");
