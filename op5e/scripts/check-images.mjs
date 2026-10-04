// Fails when any compendium document, effect, activity or token has an empty, placeholder or missing image.
// Core paths (icons/..., ui/...) resolve against Foundry's public folder, modules/ systems/ against the Data folder.
// Usage: node scripts/check-images.mjs   (needs packs-src; FOUNDRY_PUBLIC / FOUNDRY_DATA override the default install paths)
import { existsSync, readdirSync, readFileSync } from "node:fs";

const PUBLIC = process.env.FOUNDRY_PUBLIC ?? "D:/foundry-pi/Foundry/foundryvtt/public";
const DATA = process.env.FOUNDRY_DATA ?? "D:/foundry-pi/Foundry/foundrydata/Data";
const OWN = "assets/";   // modules/op5e/assets/... lives in this repo
const exists = (u) => {
  u = decodeURIComponent(String(u).split("?")[0]);
  if (/^https?:/.test(u)) return true;
  if (u.startsWith("modules/op5e/")) return existsSync(u.slice("modules/op5e/".length)) || existsSync(`${DATA}/${u}`);
  if (/^(modules|systems|worlds)\//.test(u)) return existsSync(`${DATA}/${u}`);
  return existsSync(`${PUBLIC}/${u}`);
};
const PLACEHOLDER = /question-stone|mystery-man|mystery-man-black/;
const bad = [];
let checked = 0;
for (const pack of readdirSync("packs-src")) for (const f of readdirSync(`packs-src/${pack}`)) {
  const d = JSON.parse(readFileSync(`packs-src/${pack}/${f}`, "utf8"));
  const isJournalOnly = pack === "reference" || pack === "roll-tables" || pack === "spell-lists";
  const imgs = [["doc", d.img], ["token", d.prototypeToken?.texture?.src], ...(d.effects ?? []).map((e) => ["effect " + e.name, e.img ?? e.icon])];
  for (const [what, u] of imgs) {
    if (u === undefined && (isJournalOnly || what === "token")) continue;
    checked++;
    if (!u) bad.push(`${pack}/${d.name} ${what}: empty image`);
    else if (PLACEHOLDER.test(u)) bad.push(`${pack}/${d.name} ${what}: placeholder ${u}`);
    else if (!exists(u)) bad.push(`${pack}/${d.name} ${what}: missing file ${u}`);
  }
}
console.log(`${checked} images checked, ${bad.length} problems${bad.length ? ":\n" + bad.slice(0, 40).join("\n") : ""}`);
process.exit(bad.length ? 1 : 0);
