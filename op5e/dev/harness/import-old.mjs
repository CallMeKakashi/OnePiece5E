// Rebuilds the real old-campaign characters through Create OPC from their old sheets (game.op5eApi.importOldCharacter) and compares the result.
// Test world, Automation user. The old sheets come from reports/campaign-pcs-raw.json (a read-only export); they are created as "[OLD] <name>" source actors, then removed.
import { readFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";

const RAW = JSON.parse(readFileSync("reports/campaign-pcs-raw.json", "utf8"));
const WANT = [
  { old: "Baptiste" }, { old: 'Matthew "The Jack" Burgess', map: { Gunslinger: "Marksman" } }, { old: "B.O.B", map: { Paladin: "Savant" } },
  { old: "Roma" }, { old: "Malphas" }, { old: "Hybrid" }, { old: "Sulong" }, { old: "Thunderbird Form 1" }, { old: "Thunderbird Form 2" },
].map((w) => ({ ...w, data: RAW.find((a) => a.name === w.old) }));

const run = async (cases) => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const prior = game.settings.get("op5e", "prerequisiteMode"), made = [];
  await game.settings.set("op5e", "prerequisiteMode", "off");
  for (const x of game.actors.filter((y) => /^\[OLD\]|\(import\)$/.test(y.name))) await x.delete();
  try {
    for (const c of cases) {
      const d = foundry.utils.deepClone(c.data); delete d._id; delete d.folder; delete d.ownership; d.name = `[OLD] ${c.old}`; d.type = "character";   // the export is data only: no actor type, and item effects are bare ids (they live in a separate table of the old database)
      for (const i of d.items) { delete i.folder; i.effects = (i.effects ?? []).filter((e) => typeof e === "object"); if (i.flags) { delete i.flags.ddbimporter; delete i.flags["ddb-importer"]; } }
      const src = await Actor.create(d, { keepId: false }); made.push(src);
      let r; try { r = await game.op5eApi.importOldCharacter({ source: src.name, name: `${c.old} (import)`, map: c.map, matchHp: false }); } catch (e) { ok(`${c.old}: rebuilt through Create OPC`, false, e.message.slice(0, 160)); continue; }
      const t = game.actors.get(r.id); if (!t) { ok(`${c.old}: the rebuilt actor exists`, false, JSON.stringify(r).slice(0, 200)); continue; } made.push(t);
      ok(`${c.old}: rebuilt through Create OPC`, !!t, `${r.classes.join(" + ")}; ${r.items} items`);
      const oldClasses = src.items.filter((i) => i.type === "class").map((i) => [c.map?.[i.name] ?? i.name, i.system.levels]).sort(), newClasses = t.items.filter((i) => i.type === "class").map((i) => [i.name, i.system.levels]).sort();
      ok(`${c.old}: same classes and levels (after the class rename)`, JSON.stringify(oldClasses) === JSON.stringify(newClasses), `${JSON.stringify(oldClasses)} vs ${JSON.stringify(newClasses)}`);
      const sv = (a) => Object.entries(a.system.abilities).filter(([, v]) => v.proficient).map(([k]) => k).join(), sk = (a) => Object.entries(a.system.skills).filter(([, v]) => v.value).map(([k, v]) => k + v.value).join();
      ok(`${c.old}: saving throw and skill proficiencies copied exactly`, sv(t) === sv(src) && sk(t) === sk(src), `${sv(t)} | ${sk(t)}`);
      const berries = (src.system.currency?.gp ?? 0) + src.items.filter((i) => /^pouch of berries/i.test(i.name)).reduce((n, i) => n + Number(/\((\d+)K\)/i.exec(i.name)?.[1] ?? 0) * 1000, 0);
      ok(`${c.old}: berries carried over`, t.system.currency.gp === berries, `${t.system.currency.gp} vs ${berries}`);
      const gear = src.items.filter((i) => ["weapon", "equipment", "consumable", "tool", "loot"].includes(i.type) && !/^pouch of berries/i.test(i.name));
      const nm = (x) => x.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, "").replace(/^clothescommon$/, "commonclothes");   // "Rations (1 day)" is "Rations", "Clothes, Common" is "Common Clothes"
      const have = new Set(t.items.map((i) => nm(i.name)));
      const missing = gear.filter((i) => !have.has(nm(i.name)) && ![...have].some((h) => h.length > 3 && (h.startsWith(nm(i.name)) || nm(i.name).startsWith(h))) && !/^unarmedstrike/i.test(i.name.replace(/[^a-z]/gi, "")));
      ok(`${c.old}: gear carried over (containers and Unarmed Strike aside)`, missing.filter((i) => i.type !== "container").length <= 3, `${gear.length - missing.length}/${gear.length}; missing: ${missing.map((i) => i.name).slice(0, 6).join(", ")}`);
      ok(`${c.old}: nothing failed while carrying`, !r.failed.length, r.failed.slice(0, 3).join("; "));
    }
  } catch (e) { ok("the test itself stopped", false, e.message); }
  for (const a of made.filter(Boolean)) await a.delete().catch(() => {});
  await game.settings.set("op5e", "prerequisiteMode", prior);
  return out;
};
await withFoundry(async (page) => {
  page.setDefaultTimeout(1800000);
  for (const l of await page.evaluate(`(${run.toString()})(${JSON.stringify(WANT)})`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; }
});
