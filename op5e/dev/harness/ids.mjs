// Stable-ID regression: embed every built item that has activities and verify Foundry keeps the activity ids.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const items = [];
for (const pack of readdirSync("packs-src")) for (const f of readdirSync(`packs-src/${pack}`)) {
  const d = JSON.parse(readFileSync(`packs-src/${pack}/${f}`, "utf8"));
  if (d.type !== "npc" && d.type !== "vehicle" && Object.keys(d.system?.activities ?? {}).length) items.push({ pack, name: d.name, data: d });
}
let bad;
try {
  bad = await withFoundry((_, { evaluate }) => evaluate(async (items) => {
    const H = game.op5eHarness, bad = []; const a = await H.createActor({ name: "Ids", hp: 10 });
    for (const x of items) { // one at a time: batch creation does not preserve input order
      const [c] = await a.createEmbeddedDocuments("Item", [{ ...foundry.utils.deepClone(x.data), _id: undefined }], { keepId: false });
      const want = Object.keys(x.data.system.activities).sort().join(), got = [...c.system.activities.keys()].sort().join();
      if (want !== got) bad.push({ pack: x.pack, name: x.name, want, got });
      await c.delete();
    }
    await H.cleanup(); return bad;
  }, items));
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-ids.json", JSON.stringify({ checked: items.length, bad }, null, 1));
console.log(`${items.length} items checked, ${bad.length} with changed activity ids`); console.log(bad.slice(0, 5));
process.exit(bad.length ? 1 : 0);
