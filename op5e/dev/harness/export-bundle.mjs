// Exports every actor in the world folders "OP5E" (whole tree) and "Meridian Island" to one bundle JSON (read-only; test or bb-rehearsal only).
// Usage: node dev/harness/export-bundle.mjs [out.json]   (default ../Foundry/actors-json/op5e-bundle.json)
// Import it into blood-and-brine with scripts/import-bundle-macro.js (a Foundry script macro the GM runs there).
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const out = process.argv[2] ?? "../Foundry/actors-json/op5e-bundle.json";
const ROOTS = ["OP5E", "Meridian Island"];
const run = (ROOTS) => {
  const path = (f) => { const p = []; for (let x = f; x; x = x.folder) p.unshift(x.name); return p; };
  const under = (f) => { for (let x = f; x; x = x.folder) if (!x.folder && ROOTS.includes(x.name)) return true; return false; };
  const actors = game.actors.filter((a) => a.folder && under(a.folder)).map((a) => ({ folderPath: path(a.folder), data: a.toObject() }));
  return { version: 1, source: game.world.id, exported: new Date().toISOString(), actors };
};
await withFoundry(async (page) => {
  const bundle = await page.evaluate(`(${run.toString()})(${JSON.stringify(ROOTS)})`);
  writeFileSync(out, JSON.stringify(bundle, null, 1), "utf8");
  console.log(`Wrote ${out}: ${bundle.actors.length} actors from ${bundle.source}`);
  for (const a of bundle.actors) console.log(`  ${a.folderPath.join("/")} :: ${a.data.name}`);
});
