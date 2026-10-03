// READ-ONLY: summarises the campaign world's characters from a COPY of the actors LevelDB (never writes to the world; does not touch user accounts).
import { ClassicLevel } from "classic-level";
import { cpSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
const SRC = "D:/foundry-pi/Foundry/foundrydata/Data/worlds/blood-and-brine/data/actors", T = process.env.TEMP + "/bb-copy/actors";
rmSync(process.env.TEMP + "/bb-copy", { recursive: true, force: true }); mkdirSync(T, { recursive: true });
cpSync(SRC, T, { recursive: true });
const db = new ClassicLevel(T, { valueEncoding: "json" });
const actors = [], items = {};
for await (const [k, v] of db.iterator()) {
  if (k.startsWith("!actors!") && v.type === "character") actors.push(v);
  else if (k.startsWith("!actors.items!")) (items[k.split("!")[2].split(".")[0]] ??= []).push(v);
}
await db.close();
const out = actors.map((a) => ({ id: a._id, name: a.name, system: a.system, folder: a.folder, items: items[a._id] ?? [] }));
writeFileSync("reports/campaign-pcs-raw.json", JSON.stringify(out));
console.log(out.length, "characters;", Object.values(items).flat().length, "items");
