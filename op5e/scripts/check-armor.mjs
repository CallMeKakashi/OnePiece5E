// Armor in packs-src/items vs the sourcebook armor table (supplied by the DM): price, AC, dex cap, strength, stealth, weight.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const SOURCE = [
  // name, price(beri), base AC, type, dex cap, strength, stealth disadvantage, weight(lb)
  ["Leather", 100000, 11, "light", null, 0, false, 10], ["Navy Uniform", 100000, 11, "light", null, 0, false, 4],
  ["Studded Leather", 450000, 12, "light", null, 0, false, 13], ["Light Longcoat", 500000, 12, "light", null, 0, false, 8],
  ["Hide", 100000, 12, "medium", 2, 0, false, 12], ["Chain Shirt", 500000, 13, "medium", 2, 0, false, 20],
  ["Scale Mail", 500000, 14, "medium", 2, 0, true, 45], ["Heavy Longcoat", 650000, 14, "medium", 2, 0, false, 35],
  ["Breastplate", 1000000, 15, "medium", 2, 0, true, 40], ["Chain Mail", 750000, 16, "heavy", null, 13, true, 55],
  ["Splint", 2000000, 17, "heavy", null, 15, true, 60], ["Plate", 4000000, 18, "heavy", null, 15, true, 65],
  ["Shield", 100000, 2, "shield", null, 0, false, 6],
];
const norm = (s) => s.toLowerCase().replace(/ armor$/, "").replace(/[^a-z]+/g, " ").trim();
const items = readdirSync("packs-src/items").map((f) => JSON.parse(readFileSync(`packs-src/items/${f}`, "utf8"))).filter((d) => d.type === "equipment");
const findings = [];
for (const [name, price, ac, type, cap, str, stealth, weight] of SOURCE) {
  const it = items.find((d) => norm(d.name) === norm(name));
  if (!it) { findings.push({ name, problem: "missing from items pack" }); continue; }
  const s = it.system, bad = [];
  if (s.price?.value !== price) bad.push(`price ${s.price?.value} != ${price}`);
  if (s.armor?.value !== ac) bad.push(`AC ${s.armor?.value} != ${ac}`);
  if (s.type?.value !== type) bad.push(`type ${s.type?.value} != ${type}`);
  if (type === "medium" && s.armor?.dex !== cap) bad.push(`dex cap ${s.armor?.dex} != ${cap}`);
  if ((s.strength ?? 0) !== str) bad.push(`strength ${s.strength} != ${str}`);
  const hasStealth = Array.isArray(s.properties) ? s.properties.includes("stealthDisadvantage") : !!s.stealth;
  if (hasStealth !== stealth) bad.push(`stealth disadvantage ${hasStealth} != ${stealth}`);
  if (s.weight?.value !== weight) bad.push(`weight ${s.weight?.value} != ${weight}`);
  if (bad.length) findings.push({ name: it.name, problem: bad.join("; ") });
}
writeFileSync("reports/armor-vs-source.json", JSON.stringify({ rows: SOURCE.length, findings }, null, 1));
console.log(`armor rows ${SOURCE.length}, findings ${findings.length}`);
for (const f of findings) console.log(`- ${f.name}: ${f.problem}`);
