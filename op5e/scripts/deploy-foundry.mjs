// Backs up the installed op5e once, then copies the built module + test harness into the live Foundry modules dir.
// Usage: node scripts/deploy-foundry.mjs [--restore]
import { cpSync, existsSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
const ROOT = join(import.meta.dirname, "..");
const BASE = process.env.FOUNDRY_ROOT ?? "D:/foundry-pi/Foundry";
const MODS = join(BASE, "foundrydata/Data/modules"), BAK = join(BASE, "backups");
const installed = join(MODS, "op5e"), ver = JSON.parse(readFileSync(join(installed, "module.json"), "utf8")).version;
const backup = join(BAK, `op5e-${ver}`);
if (process.argv.includes("--restore")) {
  if (!existsSync(backup)) throw new Error(`no backup at ${backup}`);
  rmSync(installed, { recursive: true, force: true }); cpSync(backup, installed, { recursive: true }); console.log(`restored op5e ${ver}`); process.exit(0);
}
if (!existsSync(backup)) { mkdirSync(BAK, { recursive: true }); cpSync(installed, backup, { recursive: true }); console.log(`backed up ${ver} -> ${backup}`); }
rmSync(installed, { recursive: true, force: true }); mkdirSync(installed);
for (const f of ["module.json", "scripts", "data/generated", "lang", "packs", "templates", "styles", "assets"]) cpSync(join(ROOT, f), join(installed, f), { recursive: true });
console.log("deployed op5e");
