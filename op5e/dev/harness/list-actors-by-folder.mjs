// Read-only: actors grouped by their folder path in the active test/bb-rehearsal world, with type.
import { withFoundry } from "./drive.mjs";
const run = () => { const path = (f) => { const p = []; for (let x = f; x; x = x.folder) p.unshift(x.name); return p.join("/"); };
  const by = {}; for (const a of game.actors) (by[path(a.folder) || "(none)"] ??= []).push(`${a.name}${a.type === "character" ? " [PC]" : ""}`); return by; };
await withFoundry(async (page) => { const by = await page.evaluate(`(${run.toString()})()`); for (const k of Object.keys(by).sort()) console.log(`${k}: ${by[k].sort().join(", ")}`); });
