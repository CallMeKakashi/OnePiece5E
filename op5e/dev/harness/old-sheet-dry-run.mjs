// Dry run of draftFromOldSheet against the live world's old actors and the installed op5e packs. Writes nothing.
// Usage: node dev/harness/old-sheet-dry-run.mjs   (set FOUNDRY_URL=https://bloodandbrine.online to go through the tunnel)
import { readFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const src = readFileSync(new URL("../../scripts/old-sheet-draft.mjs", import.meta.url), "utf8").replaceAll('from "./', 'from "@ORIGIN@/modules/op5e/scripts/');
const out = await withFoundry(async (page) => page.evaluate(async (src) => {
  const { draftFromOldSheet } = await import(URL.createObjectURL(new Blob([src.replaceAll("@ORIGIN@", location.origin)], { type: "text/javascript" })));
  const names = { classes: "classes", subclasses: "subclasses", species: "races", backgrounds: "backgrounds" }, idx = {};
  for (const [k, p] of Object.entries(names)) idx[k] = [...(await game.packs.get(`op5e.${p}`).getIndex())];
  const n = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
  const find = (k, name) => idx[k].find((e) => n(e.name) === n(name))?._id ?? null;
  return game.actors.filter((a) => a.items.some((i) => i.type === "class")).map((a) => { const { draft, unmapped } = draftFromOldSheet(a.toObject(), find); return { actor: a.name, classId: draft.classId, level: draft.level, classId2: draft.classId2, speciesId: draft.speciesId, backgroundId: draft.backgroundId, unmapped }; });
}, src));
console.log(JSON.stringify(out, null, 1));
