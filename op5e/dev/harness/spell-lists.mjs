// Checks Foundry accepts every built spell list as a JournalEntry with a valid `spells` page.
import { readFileSync, readdirSync } from "node:fs";
import { withFoundry } from "./drive.mjs";

const docs = readdirSync("packs-src/spell-lists").map((f) => JSON.parse(readFileSync(`packs-src/spell-lists/${f}`, "utf8")));
const r = await withFoundry(async (page) => page.evaluate(async (docs) => {
  const out = [];
  for (const d of docs) {
    const e = await JournalEntry.create({ ...foundry.utils.deepClone(d), name: `[T] ${d.name}`, flags: { op5e: { harnessTest: true } } });
    const p = e.pages.contents[0];
    out.push({ name: e.name, type: p.type, identifier: p.system.identifier, spells: p.system.spells.size ?? p.system.spells.length });
    await e.delete();
  }
  return out;
}, docs));
console.log(JSON.stringify(r));
process.exit(r.every((x) => x.type === "spells" && x.spells > 0) ? 0 : 1);
