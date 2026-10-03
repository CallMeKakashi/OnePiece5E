import { withFoundry } from "./drive.mjs";
try {
  const r = await withFoundry((_, { evaluate }) => evaluate(async () => ({
    version: game.version, system: game.system.version,
    mods: ["dae", "midi-qol", "op5e"].map((id) => `${id}:${game.modules.get(id)?.active ? game.modules.get(id).version : "off"}`),
    packs: game.op5eHarness.packsLoaded(),
  })));
  console.log(JSON.stringify(r, null, 1));
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
