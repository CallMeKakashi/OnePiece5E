// Field-level check: weapons and armor in packs-src/items vs the sourcebook equipment tables (name, price, damage, weight, AC).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const SB = "../Sourcebook/Chapter 4 Equipment and Items";
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const beri = (s) => (/^[─-]$/.test(s.trim()) ? null : Number(s.replace(/beri/i, "").replace(/\s/g, "").replace(/Million/i, "000000")));
const lines = (f) => readFileSync(`${SB}/${f}`, "utf8").split(/\r?\n/);

// weapons: "Name Cost beri 1d4 type Weight lb. Properties"
const expected = new Map();
for (const f of ["Weapons/Weapons.md", "Weapons/Additional Melee Weapons.md", "Weapons/Additional Ranged Weapons.md"]) {
  for (const l of lines(f)) {
    const m = l.match(/^(.+?)\s+((?:\d[\d\s]*?(?:\s*Million)?)|[─-])\s*(?:beri)?\s+(\d+d\d+|\d+|[─-])\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s+(\d+(?:\/\d+)?|[─-])\s*(?:lb\.)?/i);
    if (m) expected.set(norm(m[1]), { kind: "weapon", price: beri(m[2]), damage: m[3], type: m[4].toLowerCase(), weight: m[5] });
  }
}
// armor rows: "Name Cost AC ... Weight"
const armorLines = lines("Armor and Shields/Armor and Shields.md");
for (const l of armorLines) {
  const m = l.match(/^(Padded|Leather|Studded Leather|Hide|Chain Shirt|Scale Mail|Breastplate|Half Plate|Ring Mail|Chain Mail|Splint|Plate|Shield)\s+((?:\d[\d\s]*?(?:\s*Million)?))\s*(?:beri)?\s+(\d+)(?:\s*\+\s*Dex)?/i);
  if (m) expected.set(norm(m[1]), { kind: "armor", price: beri(m[2]), ac: Number(m[3]) });
}

const items = readdirSync("packs-src/items").map((f) => JSON.parse(readFileSync(`packs-src/items/${f}`, "utf8")));
const findings = [], checked = [];
for (const [key, e] of expected) {
  const cands = items.filter((i) => norm(i.name) === key || norm(i.name).replace(/ armor$/, "") === key);
  const it = cands.find((i) => (e.kind === "weapon" ? i.type === "weapon" : i.type === "equipment")) ?? cands[0];
  if (!it) { findings.push({ name: key, problem: `in sourcebook ${e.kind} table but missing from items pack` }); continue; }
  checked.push(it.name);
  const s = it.system;
  if (e.price !== null && e.price !== undefined && s.price?.value !== e.price) findings.push({ name: it.name, problem: `price ${s.price?.value} != source ${e.price}` });
  if (e.kind === "weapon") {
    const part = s.damage?.parts?.[0] ?? [];
    const dmg = part[0]?.replace(/\s/g, "");
    if (e.damage !== "─" && dmg !== e.damage) findings.push({ name: it.name, problem: `damage ${dmg} != source ${e.damage}` });
    if (part[1] && part[1] !== e.type) findings.push({ name: it.name, problem: `damage type ${part[1]} != source ${e.type}` });
  } else if (s.armor?.value !== e.ac && !(it.name === "Shield" && s.armor?.value === 2)) findings.push({ name: it.name, problem: `AC ${s.armor?.value} != source ${e.ac}` });
}
writeFileSync("reports/items-vs-source.json", JSON.stringify({ expected: expected.size, checked: checked.length, findings }, null, 1));
console.log(`source rows ${expected.size}, matched ${checked.length}, findings ${findings.length}`);
for (const f of findings.slice(0, 40)) console.log(`- ${f.name}: ${f.problem}`);
if (process.argv.includes("--list")) for (const [k, e] of expected) console.log(k, JSON.stringify(e));
