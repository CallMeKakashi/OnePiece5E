// Copy a Foundry world folder to a new world id for rehearsals (never overwrites, never writes into the campaign world).
// Usage: node scripts/copy-world.mjs <source-world> <new-world> [--allow-campaign-read]
// Foundry should not have the source world launched while it is copied (open LevelDB files are skipped, so the copy may be a little behind).
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORLDS = process.env.FOUNDRY_WORLDS ?? "D:/foundry-pi/Foundry/foundrydata/Data/worlds", CAMPAIGN = "blood-and-brine";
const [src, dst] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!src || !dst) { console.error("usage: node scripts/copy-world.mjs <source-world> <new-world> [--allow-campaign-read]"); process.exit(2); }
if (dst === CAMPAIGN) { console.error("refusing: never write into the campaign world"); process.exit(1); }
if (src === CAMPAIGN && !process.argv.includes("--allow-campaign-read")) { console.error("refusing: copying the campaign world reads its database; pass --allow-campaign-read if that is what you want"); process.exit(1); }
if (!/^[a-z0-9-]+$/.test(dst)) { console.error("new world id: lowercase letters, digits and dashes only"); process.exit(1); }
if (!existsSync(join(WORLDS, src, "world.json"))) { console.error(`no such world: ${src}`); process.exit(1); }
if (existsSync(join(WORLDS, dst))) { console.error(`${dst} already exists; pick another id`); process.exit(1); }
cpSync(join(WORLDS, src), join(WORLDS, dst), { recursive: true, filter: (p) => !/(^|[\/])LOCK$/.test(p) });
const wj = join(WORLDS, dst, "world.json"), w = JSON.parse(readFileSync(wj, "utf8"));
Object.assign(w, { id: dst, title: dst }); delete w.lastPlayed; delete w.playtime;
writeFileSync(wj, JSON.stringify(w, null, 2));
console.log(`copied ${src} -> ${dst}. Launch it from Foundry's setup screen.`);
