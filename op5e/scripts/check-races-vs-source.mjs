// Compares size and movement each race ends up with (reports/execution-origins-races.json) to the sourcebook trait pages.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
const run = JSON.parse(readFileSync("reports/execution-origins-races.json", "utf8"));
const DIR = "../Sourcebook/Chapter 1 Races";
const SIZE = { tiny: "tiny", small: "sm", medium: "med", large: "lg", huge: "huge", gargantuan: "grg" };
const out = [];
for (const r of run) {
  const folder = readdirSync(DIR).find((d) => d.toLowerCase().startsWith(r.name.toLowerCase().slice(0, 5)));
  const file = folder && readdirSync(`${DIR}/${folder}`).find((f) => /Traits\.md$/.test(f));
  if (!file) { out.push({ race: r.name, problem: "no trait page found" }); continue; }
  const t = readFileSync(`${DIR}/${folder}/${file}`, "utf8").replace(/\r?\n/g, " ");
  const exp = {
    size: SIZE[(t.match(/Size\.\s*Your size is (\w+)/i) ?? [])[1]?.toLowerCase()] ?? null,
    walk: Number((t.match(/base walking speed is (\d+)/i) ?? [])[1] ?? NaN),
    swim: Number((t.match(/swimming speed (?:of|equal to[^.]*?(\d+))\s*(\d+)?/i) ?? [])[2] ?? (t.match(/swimming speed of (\d+)/i) ?? [])[1] ?? 0),
    fly: Number((t.match(/flying speed of (\d+)/i) ?? [])[1] ?? 0),
    climb: Number((t.match(/climbing speed of (\d+)/i) ?? [])[1] ?? (/climbing speed equal to your (?:movement|walking) speed/i.test(t) ? (t.match(/base walking speed is (\d+)/i) ?? [])[1] : 0) ?? 0),
  };
  const got = r.after, problems = [];
  if (exp.size && exp.size !== got.size) problems.push(`size ${got.size} != source ${exp.size}`);
  for (const k of ["walk", "swim", "fly", "climb"]) if (!Number.isNaN(exp[k]) && Number(exp[k]) !== got[k]) problems.push(`${k} ${got[k]} != source ${exp[k]}`);
  out.push({ race: r.name, source: file, expected: exp, got: { size: got.size, walk: got.walk, swim: got.swim, fly: got.fly, climb: got.climb }, problems });
}
writeFileSync("reports/races-vs-source.json", JSON.stringify(out, null, 1));
for (const o of out) console.log(o.race, o.problem ?? (o.problems.length ? "MISMATCH: " + o.problems.join("; ") : "ok"), o.expected ? JSON.stringify(o.expected) : "");
