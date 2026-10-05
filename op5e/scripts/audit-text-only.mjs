// Finds features whose text states a mechanical effect (a bonus, a die change, advantage, resistance, speed...) but that have no effect, no activity and no
// advancement that implements it: the "Unarmed Master" class of problem. Usage: node scripts/audit-text-only.mjs [--json]   (needs a build: packs-src)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const PACKS = ["feats", "class-features", "racial-features", "backgrounds"];
const RULES = [   // [label, regex]: a sentence like these is a rule the sheet should apply
  ["bonus to rolls", /[+-]\d+ (?:bonus )?(?:to|on) (?:attack|damage|initiative|saving|ability|skill|AC|armor class|your)/i],
  ["gain a +N", /gain(?:s)? a [+-]\d+/i],
  ["die size", /(?:die|dice) (?:size )?(?:becomes|increases|changes)|one (?:die )?size larger|size of .* die/i],
  ["advantage/disadvantage", /\b(?:have |gain )?(?:dis)?advantage on\b/i],
  ["resistance/immunity", /\b(?:resistance|immun\w+) to\b/i],
  ["speed", /(?:walking |movement )?speed (?:increases|is increased|becomes)|(?:swim|climb|fly)(?:ing)? speed/i],
  ["AC", /(?:your |gain a )?(?:armor class|AC) (?:equals|is equal|increases|becomes)|\+\d+ (?:bonus )?to (?:your )?(?:AC|armor class)/i],
  ["extra damage", /(?:extra|additional|bonus) \d*d?\d+ (?:\w+ )?damage|deal(?:s)? an extra/i],
  ["hit points", /(?:hit point maximum|temporary hit points) (?:increases|equal)|gain (?:\d+|\w+) temporary hit points/i],
  ["initiative", /initiative/i],
];
const text = (h) => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const rows = [];
for (const pack of PACKS) for (const f of readdirSync(`packs-src/${pack}`)) {
  const d = JSON.parse(readFileSync(`packs-src/${pack}/${f}`, "utf8"));
  const body = text(d.system?.description?.value);
  const hits = RULES.filter(([, re]) => re.test(body)).map(([l]) => l);
  if (!hits.length) continue;
  const acts = Object.keys(d.system?.activities ?? {}).length, fx = (d.effects ?? []).length;
  const adv = (d.system?.advancement ?? []).filter((a) => ["AbilityScoreImprovement", "Trait", "ScaleValue", "Size", "HitPoints"].includes(a.type)).length;
  if (acts || fx) continue;   // something implements it (whether it is complete is for the review sheet)
  rows.push({ pack, name: d.name, hits, adv, text: body.slice(0, 160) });
}
rows.sort((a, b) => b.hits.length - a.hits.length || a.name.localeCompare(b.name));
if (process.argv.includes("--json")) writeFileSync("reports/audit-text-only.json", JSON.stringify(rows, null, 1));
const by = {}; for (const r of rows) by[r.pack] = (by[r.pack] ?? 0) + 1;
console.log(`${rows.length} features with a mechanical rule in the text and no effect or activity:`, JSON.stringify(by));
for (const r of rows.slice(0, 400)) console.log(`${r.pack.padEnd(16)} ${r.name.padEnd(38)} [${r.hits.join(", ")}]${r.adv ? " (has advancement)" : ""}`);
