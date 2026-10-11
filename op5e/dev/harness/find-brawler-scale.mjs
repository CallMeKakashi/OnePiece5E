// Read-only: lists actors whose Unarmored Movement effect references @scale.brawler.unarmored-movement but the scale value does not resolve.
import { withFoundry } from "./drive.mjs";
const run = () => game.actors.filter((a) => a.items.some((i) => i.effects.some((e) => e.changes.some((c) => /scale\.brawler\.unarmored-movement/.test(c.value)))))
  .map((a) => ({ name: a.name, type: a.type, folder: a.folder?.name, brawlerLevel: a.classes?.brawler?.system?.levels ?? null, scale: a.system.scale?.brawler?.["unarmored-movement"]?.value ?? null }));
await withFoundry(async (page) => console.table(await page.evaluate(`(${run.toString()})()`)));
