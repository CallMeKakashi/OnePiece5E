// Read-only on the world: writes op5e-config-bundle.json (enabled modules + non-default world settings of the ACTIVE modules) for scripts/apply-config-macro.js.
// Skips values that are machine state, not choices (GM ids, migration/version markers, tour flags, roll stats, drafts, caches).
// Usage: node dev/harness/export-config-bundle.mjs [out.json]
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const out = process.argv[2] ?? "../Foundry/actors-json/op5e-config-bundle.json";
const SKIP = /migration|version|gmID|ActiveGM|lastUpdateCheck|seenTour|updateToken|^drafts$|RollStats|appData|extraSourcesApplied|allProviders|enabledProviders|songs|presets|chat-welcome|Debug$/i;
const run = (SKIP) => {
  const skip = new RegExp(SKIP.source, SKIP.flags);
  const world = game.settings.storage.get("world");
  const active = new Set(game.modules.filter((m) => m.active).map((m) => m.id));
  const settings = [];
  for (const [, s] of game.settings.settings) {
    if (!active.has(s.namespace) || s.scope !== "world" || skip.test(s.key) || !world.getSetting?.(`${s.namespace}.${s.key}`)) continue;
    const v = game.settings.get(s.namespace, s.key); let d = s.default; if (typeof d === "function") d = d();
    if (JSON.stringify(v ?? null) !== JSON.stringify(d ?? null)) settings.push({ ns: s.namespace, key: s.key, value: v });
  }
  return { version: 1, source: game.world.id, moduleConfiguration: game.settings.get("core", "moduleConfiguration"), settings };
};
await withFoundry(async (page) => {
  const r = await page.evaluate(`(${run.toString()})(${JSON.stringify({ source: SKIP.source, flags: SKIP.flags })})`);
  writeFileSync(out, JSON.stringify(r), "utf8");
  console.log(`Wrote ${out}: ${Object.values(r.moduleConfiguration).filter(Boolean).length} enabled modules, ${r.settings.length} settings, ${(JSON.stringify(r).length / 1024).toFixed(0)} KB`);
  const by = {}; for (const s of r.settings) (by[s.ns] ??= []).push(s.key); for (const [m, k] of Object.entries(by)) console.log(`  ${m}: ${k.join(", ")}`);
});
