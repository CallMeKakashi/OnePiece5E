// Applies a change set (dev/harness/build-rehearsal-to-live.mjs) to the blood-and-brine DATABASE FILES directly. Only while that world is NOT running.
// Safety: refuses if any world is active whose database is blood-and-brine; backs up the three collections first; dry run unless --apply.
// Usage: node dev/harness/apply-to-live-offline.mjs [--apply] [--superseded] [change-set.json]
import { createRequire } from "node:module";
import { cpSync, mkdirSync, readFileSync } from "node:fs";
const require = createRequire("D:/foundry-pi/Foundry/foundryvtt/node_modules/");
const { ClassicLevel } = require("classic-level");
const args = process.argv.slice(2), APPLY = args.includes("--apply"), SUPER = args.includes("--superseded");
const file = args.find((a) => a.endsWith(".json")) ?? "../Foundry/actors-json/op5e-rehearsal-to-live.json";
const set = JSON.parse(readFileSync(file, "utf8"));
const WORLD = "D:/foundry-pi/Foundry/foundrydata/Data/worlds/blood-and-brine/data";
const st = await (await fetch("http://localhost:30000/api/status")).json().catch(() => ({}));
if (st.world === "blood-and-brine") throw new Error("blood-and-brine is running: stop that world first (its database is in use)");
const now = Date.now(), rid = () => Array.from({ length: 16 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]).join("");
if (APPLY) { const dst = `D:/foundry-pi/Foundry/backups/blood-and-brine-data-${new Date().toISOString().replace(/[:.]/g, "-")}`; mkdirSync(dst, { recursive: true }); for (const c of ["actors", "folders", "settings"]) cpSync(`${WORLD}/${c}`, `${dst}/${c}`, { recursive: true, filter: (s) => !s.endsWith("LOCK") }); console.log("backup:", dst); }
const open = async (c) => { const db = new ClassicLevel(`${WORLD}/${c}`, { valueEncoding: "json" }); await db.open(); return db; };
const all = async (db, c) => { const m = new Map(); for await (const [k, v] of db.iterator()) if (k.split("!")[1] === c) m.set(v._id, v); return m; };
const fDb = await open("folders"), aDb = await open("actors"), sDb = await open("settings");
const folders = await all(fDb, "folders"), actors = await all(aDb, "actors"), settings = await all(sDb, "settings");
const log = { art: 0, moved: 0, folders: 0, settings: [], skipped: [] };
const touch = (d) => { d._stats = { ...(d._stats ?? {}), modifiedTime: now }; return d; };
const findFolder = (name, parent) => [...folders.values()].find((f) => f.type === "Actor" && f.name === name && (f.folder ?? null) === (parent ?? null));
const ensure = async (names) => { let parent = null; for (const name of names) { let f = findFolder(name, parent); if (!f) { f = { type: "Actor", folder: parent, name, color: null, sorting: "a", _id: rid(), description: "", sort: 900000 + folders.size * 1000, flags: {}, _stats: { compendiumSource: null, duplicateSource: null, exportSource: null, coreVersion: "13.350", systemId: "dnd5e", systemVersion: "5.3.3", createdTime: now, modifiedTime: now, lastModifiedBy: null } }; folders.set(f._id, f); log.folders++; if (APPLY) await fDb.put(`!folders!${f._id}`, f); } parent = f._id; } return parent; };
const patch = async (e, fn) => { const a = actors.get(e.id); if (!a || a.name !== e.name) { log.skipped.push(`${e.name} (${e.id})`); return false; } fn(a); touch(a); if (APPLY) await aDb.put(`!actors!${a._id}`, a); return true; };
for (const e of set.art) if (await patch(e, (a) => { a.img = e.img; a.prototypeToken.texture.src = e.token; })) log.art++;
for (const e of set.moves) { const fid = e.folderPath.length ? await ensure(e.folderPath) : null; if (await patch(e, (a) => { a.folder = fid; })) log.moved++; }
if (SUPER) { const fid = await ensure(["Dead", "Archived"]); for (const e of set.superseded) if (await patch(e, (a) => { a.folder = fid; })) log.moved++; }
const want = [...set.settings.map((s) => [s.key, s.value]), ["midi-qol.ReplaceDefaultActivities", "false"], ["dnd5e.criticalDamageMaxDice", "true"], ["dnd5e.criticalDamageModifiers", "false"]];
for (const [key, value] of want) { const s = [...settings.values()].find((x) => x.key === key); if (s) { if (s.value === value) { log.settings.push(`${key}: already ${value}`); continue; } log.settings.push(`${key}: ${s.value} -> ${value}`); s.value = value; touch(s); if (APPLY) await sDb.put(`!settings!${s._id}`, s); } else if (value !== "false" || key.startsWith("midi")) { log.settings.push(`${key}: (absent) -> ${value}`); const n = { key, user: null, value, _id: rid(), _stats: { compendiumSource: null, duplicateSource: null, exportSource: null, coreVersion: "13.350", systemId: "dnd5e", systemVersion: "5.3.3", createdTime: now, modifiedTime: now, lastModifiedBy: null } }; if (APPLY) await sDb.put(`!settings!${n._id}`, n); } else log.settings.push(`${key}: absent, default false, left as is`); }
await fDb.close(); await aDb.close(); await sDb.close();
console.log(APPLY ? "APPLIED" : "DRY RUN (nothing written)", JSON.stringify({ ...log, skipped: log.skipped.slice(0, 8), skippedCount: log.skipped.length }, null, 1));
