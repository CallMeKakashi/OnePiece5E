// Imports a standalone actor JSON (Foundry/actors-json/<slug>.json) into the test or bb-rehearsal world and prints the numbers Foundry computes for it.
// Never deletes anything unless you pass --replace (then an actor of the same name is replaced). Usage: node dev/harness/import-npc.mjs <path-to-json> [--folder name] [--keep-id] [--replace]   (--keep leaves it in the world; default keeps it)
import { readFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const path = process.argv[2]; if (!path) throw new Error("usage: node dev/harness/import-npc.mjs <json>");
const data = JSON.parse(readFileSync(path, "utf8"));
const folderName = process.argv.includes("--folder") ? process.argv[process.argv.indexOf("--folder") + 1] : null;
const keepId = process.argv.includes("--keep-id"), replace = process.argv.includes("--replace");
const run = async (data, folderName, keepId, replace) => {
  const same = game.actors.filter((a) => a.name === data.name);
  if (same.length && !replace) return { error: `an actor named "${data.name}" already exists; nothing was deleted. Run with --replace to replace it.` };
  for (const x of same) await x.delete();
  if (!keepId) delete data._id;
  if (folderName) { const f = game.folders.find((x) => x.type === "Actor" && x.name === folderName) ?? await Folder.create({ name: folderName, type: "Actor" }); data.folder = f.id; }
  let a; try { a = await Actor.create(data, { keepId }); } catch (e) { return { error: String(e.message).slice(0, 1500) }; }
  if (!a) {   // bisect: create the actor bare, then add the items one at a time to name the ones Foundry refuses
    const items = data.items; const bare = { ...data, items: [] };
    try { a = await Actor.create(bare, { keepId: false }); } catch (e) { return { error: "bare actor: " + String(e.message).slice(0, 800) }; }
    if (!a) return { error: "even the bare actor was refused" };
    const bad = [];
    for (const it of items) { try { const r = await a.createEmbeddedDocuments("Item", [it], { keepId: true }); if (!r?.length) bad.push(it.name + " (refused)"); } catch (e) { bad.push(`${it.name}: ${String(e.message).slice(0, 200)}`); } }
    if (bad.length) return { error: "items refused", bad };
  }
  if (!a) return { error: "Actor.create returned nothing (a hook or validation refused it); check the browser console" };
  await new Promise((r) => setTimeout(r, 1500));
  const s = a.system, spells = Object.fromEntries(Object.entries(s.spells ?? {}).filter(([, v]) => v.max).map(([k, v]) => [k, v.max]));
  return {
    id: a.id, name: a.name, level: s.details.level, cr: s.details.cr, prof: s.attributes.prof, ac: s.attributes.ac.value, hp: s.attributes.hp.max,
    abilities: Object.fromEntries(Object.entries(s.abilities).map(([k, v]) => [k, `${v.value} (${v.mod >= 0 ? "+" : ""}${v.mod}) save ${v.save?.value ?? v.save}`])),
    spellDC: s.attributes.spell.dc, spellAtk: s.attributes.spell.attack, spellcastingLevel: s.attributes.spell.level, slots: spells,
    skills: Object.fromEntries(Object.entries(s.skills).filter(([, v]) => v.value).map(([k, v]) => [k, `${v.value === 2 ? "expertise" : "prof"} ${v.total >= 0 ? "+" : ""}${v.total}`])),
    initiative: s.attributes.init.total, items: a.items.size,
    weapons: a.items.filter((i) => i.type === "weapon").map((i) => ({ name: i.name, acts: [...i.system.activities].map((x) => `${x.type}:${x.name}`), atk: [...i.system.activities].find((x) => x.type === "attack")?.getAttackToHit?.()?.formula })),
  };
};
await withFoundry(async (page) => { console.log(JSON.stringify(await page.evaluate(`(${run.toString()})(${JSON.stringify(data)}, ${JSON.stringify(folderName)}, ${keepId}, ${replace})`), null, 1)); });
