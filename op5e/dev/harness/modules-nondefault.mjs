// Read-only: for every ACTIVE module, lists world-scope settings whose stored value differs from the registered default (what was changed from stock).
// Usage: node dev/harness/modules-nondefault.mjs [out.json]
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const out = process.argv[2] ?? "../Foundry/actors-json/modules-nondefault.json";
const run = () => {
  const active = new Set(game.modules.filter((m) => m.active).map((m) => m.id));
  const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  const res = {};
  const world = game.settings.storage.get("world");
  for (const [key, s] of game.settings.settings) {
    if (!active.has(s.namespace) || s.scope !== "world") continue;
    const stored = world.getSetting?.(key);
    if (!stored) continue; // never saved, so it is still the default
    let v; try { v = game.settings.get(s.namespace, s.key); } catch { continue; }
    let d = s.default; if (typeof d === "function") d = d();
    if (!same(v, d)) (res[s.namespace] ??= []).push({ key: s.key, name: game.i18n.localize(s.name ?? ""), value: v, default: d ?? null });
  }
  return { world: game.world.id, active: [...active].sort(), changed: res };
};
await withFoundry(async (page) => {
  const r = await page.evaluate(`(${run.toString()})()`);
  writeFileSync(out, JSON.stringify(r, null, 1), "utf8");
  console.log(`world ${r.world}: ${r.active.length} active modules, ${Object.keys(r.changed).length} with non-default world settings -> ${out}`);
  for (const [m, list] of Object.entries(r.changed)) console.log(`  ${m}: ${list.length}`);
});
