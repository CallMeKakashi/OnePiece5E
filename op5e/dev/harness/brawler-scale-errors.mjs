// Read-only: joins the world and reports "Unresolved StringTerm" console errors during load plus which actors still throw when re-prepared.
import { withFoundry } from "./drive.mjs";
const run = () => {
  const bad = [];
  for (const a of game.actors) {
    try {
      const orig = console.error; let hit = false; console.error = (...x) => { if (String(x[0]?.message ?? x[0]).includes("Unresolved StringTerm")) hit = true; };
      a.reset(); console.error = orig; if (hit) bad.push(`${a.name} (${a.folder?.name})`);
    } catch (e) { bad.push(`${a.name}: ${e.message}`); }
  }
  return bad;
};
await withFoundry(async (page, { logs }) => {
  console.log("load-time errors containing Unresolved:", logs.filter((l) => l.includes("Unresolved StringTerm")).length);
  console.log("actors that still throw on re-prepare:", await page.evaluate(`(${run.toString()})()`));
});
