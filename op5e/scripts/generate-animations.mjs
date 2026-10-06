// Usage: node scripts/generate-animations.mjs [--packs <packs-src>] [--autorec <autorec.json>]
// Writes assets/autorec-op5e.json (+ data/autorec-index.json, the label index the unit tests check against).
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { AA_MENUS, generate } from "./animations-lib.mjs";
import { ROOT, parseArgs, loadDocs, readJson } from "./animations-tools.mjs";

const args = parseArgs();
const autorec = readJson(args.autorec);
const map = readJson(join(ROOT, "data/animation-map.json"));
const pkg = readJson(join(ROOT, "package.json"));
const { menus, unmapped, entries } = generate({ docs: loadDocs(args.packs), autorec, map, version: 1, moduleVersion: pkg.version });

const out = { ...menus, version: autorec.version };
mkdirSync(join(ROOT, "assets"), { recursive: true });
writeFileSync(join(ROOT, "assets/autorec-op5e.json"), JSON.stringify(out, null, 1) + "\n");

const index = Object.fromEntries(AA_MENUS.map((m) => [m, (autorec[m] ?? []).map((e) => e.label)]));
writeFileSync(join(ROOT, "data/autorec-index.json"), JSON.stringify(index) + "\n");

console.log(`entries: ${entries.length}`, Object.fromEntries(AA_MENUS.map((m) => [m, menus[m].length])));
if (unmapped.length) console.warn("UNMAPPED:", unmapped);
