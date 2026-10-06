// Node-only helpers shared by audit-animations.mjs and generate-animations.mjs.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_AUTOREC = "D:/foundry-pi/Foundry/foundrydata/Data/modules/dnd5e-animations/module/autorec.json";

/** Parse `--key value` args. Env fallbacks: OP5E_PACKS, OP5E_AUTOREC. */
export function parseArgs(argv = process.argv.slice(2)) {
  const a = { packs: process.env.OP5E_PACKS ?? join(ROOT, "packs-src"), autorec: process.env.OP5E_AUTOREC ?? DEFAULT_AUTOREC };
  for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, "")] = argv[i + 1];
  return a;
}

export function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

/** Load every built pack doc (packs-src/<pack>/*.json) with a `_pack` field. Sorted for stable output. */
export function loadDocs(packsDir) {
  if (!existsSync(packsDir)) throw new Error(`packs dir not found: ${packsDir} (run npm run build:json or pass --packs)`);
  const docs = [];
  for (const pack of readdirSync(packsDir).sort()) {
    const dir = join(packsDir, pack);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir).sort()) {
      if (!f.endsWith(".json")) continue;
      try {
        const d = readJson(join(dir, f));
        if (d?.name) docs.push({ ...d, _pack: pack });
      } catch {
        /* skip unreadable */
      }
    }
  }
  return docs;
}
