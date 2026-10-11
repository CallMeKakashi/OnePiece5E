// Read-only: shows the Unarmored Movement items/effects on Baptiste vs a working Brawler (Veyl Corven).
import { withFoundry } from "./drive.mjs";
const run = () => ["Baptiste", "Veyl Corven"].map((n) => {
  const a = game.actors.getName(n);
  return { n, items: a.items.filter((i) => /Unarmored Movement/.test(i.name)).map((i) => ({ name: i.name, src: i._stats?.compendiumSource, effects: i.effects.map((e) => ({ name: e.name, disabled: e.disabled, transfer: e.transfer, changes: e.changes.map((c) => `${c.key} ${c.mode} ${c.value}`) })) })),
    actorEffects: a.effects.filter((e) => e.changes.some((c) => /scale\.brawler/.test(c.value))).map((e) => `${e.name} <- ${e.origin}`), classScales: a.items.filter((i) => i.type === "class").map((i) => `${i.name} ${i.system.identifier} L${i.system.levels}`) };
});
await withFoundry(async (page) => console.log(JSON.stringify(await page.evaluate(`(${run.toString()})()`), null, 1)));
