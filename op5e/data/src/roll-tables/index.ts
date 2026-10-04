import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "../../helpers/id.js";
import { parseTables, type ParsedTable } from "../../helpers/rolltable.js";

// Every dice table in the Sourcebook as a RollTable. Numbered "d6 Ideal" tables are parsed from the vault markdown (helpers/rolltable.ts);
// the few tables the PDF flattening cannot be parsed (Prismatic Spray/Wall, Elemental Trap, Create Object) or that sit in prose (Smiles,
// lingering-injury trigger, storm lightning) are written here with the book's numbers.
const SB = join(dirname(fileURLToPath(import.meta.url)), "../../../../Sourcebook");

export interface Row { lo: number; hi: number; label?: string; text: string }
export interface Def { name: string; formula: string; description: string; rows: Row[] }

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function walk(dir: string): string[] {
  return readdirSync(dir).sort().flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : n.endsWith(".md") ? [p] : [];
  });
}

// "Personality Traits" in Backgrounds/Acrobat.md -> "Acrobat: Personality Traits"
function tableName(file: string, t: ParsedTable): string {
  const rel = relative(SB, file).split("\\").join("/").replace(/\.md$/, "");
  const base = basename(rel);
  if (/^Chapter 3 Character Origins\/(Backgrounds|Roles)\//.test(rel)) {
    const kind = rel.includes("/Roles/") ? "Role" : "Background";
    return `${base} ${kind}: ${t.title}`;
  }
  if (/^(Precipitation|Temperature|Wind)$/.test(t.title)) return `Weather Forecast: ${t.title}`;
  return t.title;
}

const fromParsed = (file: string, t: ParsedTable): Def => ({
  name: tableName(file, t),
  formula: t.rolled ? `1d${t.die}` : "",
  description: `Sourcebook: ${relative(SB, file).split("\\").join("/").replace(/\.md$/, "")}${t.rolled ? "" : " (a lookup table, not rolled)"}`,
  rows: t.rows.map((r) => ({ ...r })),
});

/** rows that start with a known first word ("Red The creature takes ...") */
function namedRows(md: string, heading: string, names: string[], sep: string): Row[] {
  const lines = md.replace(/\r/g, "").split("\n").map((l) => l.trim());
  const at = lines.findIndex((l) => l === `##### ${heading}`);
  const rows: Row[] = [];
  for (let i = at + 1; i < lines.length && !lines[i].startsWith("#"); i++) {
    const l = lines[i];
    if (!l || l.startsWith("<!--")) continue;
    const idx = names.findIndex((n) => l.startsWith(`${n}${sep}`));
    if (idx >= 0 && idx === rows.length) rows.push({ lo: idx + 1, hi: idx + 1, label: names[idx], text: l.slice(names[idx].length + sep.length).trim() });
    else if (rows.length) rows[rows.length - 1].text += ` ${l}`;
  }
  return rows.map((r) => ({ ...r, text: r.text.replace(/\s+/g, " ").trim() }));
}

export function handTables(): Def[] {
  const out: Def[] = [];
  const read = (p: string) => readFileSync(join(SB, p), "utf8");
  const spray = read("Appendix A Creations/Summoned Yokai/7th Level.md");
  const sprayText = spray.slice(spray.indexOf("##### Prismatic Spray"), spray.indexOf("##### Storm of Vengeance")).replace(/<!--[\s\S]*?-->/g, "").replace(/\r/g, "");
  const sprayRows: Row[] = [];
  const sl = sprayText.split("\n").map((l) => l.trim());
  for (const l of sl) {
    const m = l.match(/^(\d)-(\w+): (.*)$/);
    if (m && Number(m[1]) === sprayRows.length + 1) sprayRows.push({ lo: Number(m[1]), hi: Number(m[1]), label: m[2], text: m[3] });
    else if (sprayRows.length && l && !l.startsWith("#")) sprayRows[sprayRows.length - 1].text += ` ${l}`;
  }
  out.push({ name: "Prismatic Spray", formula: "1d8", description: "Roll a d8 for each creature in the 60-foot cone to determine which color ray affects it (Prismatic Spray, 7th level).", rows: sprayRows.map((r) => ({ ...r, text: r.text.replace(/\s+/g, " ").trim() })) });

  const wall = read("Appendix A Creations/Summoned Yokai/9th Level.md");
  out.push({ name: "Prismatic Wall", formula: "", description: "The wall's seven layers, passed through in order from red to violet; a creature makes a Dexterity saving throw per layer (Prismatic Wall, 9th level). Not rolled.",
    rows: namedRows(wall, "Prismatic Wall Table", ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"], " ") });

  out.push({ name: "Elemental Trap Effects", formula: "", description: "Effect by damage type chosen for the Elemental Trap creation: the triggering creature makes the listed saving throw, taking 3d8 of the damage type plus the additional effect on a failure, half damage on a success. Not rolled.", rows: [
    { lo: 1, hi: 1, label: "Acid (Constitution)", text: "The target's AC is reduced by 2 until the end of its next turn." },
    { lo: 2, hi: 2, label: "Cold (Strength)", text: "Target's movement speed becomes 0 until the end of its next turn." },
    { lo: 3, hi: 3, label: "Fire (Dexterity)", text: "The d8s of the damage instead are d10s." },
    { lo: 4, hi: 4, label: "Lightning (Dexterity)", text: "An additional creature within 30ft of the target must also make the saving throw against only the damage." },
    { lo: 5, hi: 5, label: "Poison (Constitution)", text: "Target is poisoned until the end of its next turn." },
    { lo: 6, hi: 6, label: "Thunder (Strength)", text: "Target is knocked prone." },
  ] });
  out.push({ name: "Create Object Table", formula: "", description: "Duration of an object made with the Create Object creation, by material; for several materials use the shortest duration. Not rolled.", rows: [
    { lo: 1, hi: 1, label: "Vegetable matter", text: "24 hours" }, { lo: 2, hi: 2, label: "Stone, crystal", text: "12 hours" },
    { lo: 3, hi: 3, label: "Precious metals", text: "1 hour" }, { lo: 4, hi: 4, label: "Gems", text: "10 minutes" },
  ] });

  out.push({ name: "Smiles: Transformation Roll", formula: "1d10", description: "Eating a Smile (artificial devil fruit): the consumer rolls 1d10 (Chapter 8, Smiles).", rows: [
    { lo: 1, hi: 9, text: "You gain Ocean's Scorn and are permanently smiling." },
    { lo: 10, hi: 10, text: "You gain Ocean's Scorn and a slight, permanent zoan transformation of a random animal at a random placement (natural weapon +2, enhanced speed, extra head, or an ability score increase of 2, following the Smiles rulings)." },
  ] });
  out.push({ name: "Lingering Injury Check", formula: "1d20", description: "Roll when a creature takes a critical hit or damage of at least half its hit point maximum (Appendix B, Lingering Injuries). A creature that chooses non-lethal damage can choose not to inflict an injury; a creature that reduces a critical hit's damage to 0 does not roll.", rows: [
    { lo: 1, hi: 1, text: "The creature gains a severe lingering injury (roll on the Severe Lingering Injuries table or choose)." },
    { lo: 2, hi: 10, text: "The creature gains a moderate lingering injury (roll on the Moderate Lingering Injuries table or choose)." },
    { lo: 11, hi: 20, text: "The creature doesn't suffer a lingering injury." },
  ] });
  out.push({ name: "Reattaching a Body Part", formula: "", description: "Dismemberment from severe lingering injuries (Appendix B, Lingering Injuries): a creature proficient in Medicine can make a Medicine check, DC 15. Not rolled; each failure increases the DC by 5.", rows: [
    { lo: 1, hi: 1, label: "Success", text: "The body part is reattached." },
    { lo: 2, hi: 2, label: "Failure", text: "The patient takes 1d8 necrotic damage and the body part is not reattached. The DC increases by 5." },
    { lo: 3, hi: 3, label: "DC past 30", text: "If the DC increases past 30, the body part is lost." },
  ] });
  out.push({ name: "Storm Lightning", formula: "1d100", description: "Lightning can accompany a storm at sea (Appendix B, The Environment: Storms). Roll a d100.", rows: [
    { lo: 1, hi: 49, text: "No lightning." },
    { lo: 50, hi: 84, text: "Lightning strikes an area within 10ft of a creature on board." },
    { lo: 85, hi: 100, text: "One of the crew members is struck by lightning: Dexterity saving throw DC 15 for 8d6 lightning damage." },
  ] });
  return out;
}

const defs: Def[] = [];
for (const f of walk(SB)) for (const t of parseTables(readFileSync(f, "utf8"))) defs.push(fromParsed(f, t));
defs.push(...handTables());

// the Severe table's last row runs into the following body text in the PDF flattening
for (const d of defs) for (const r of d.rows) r.text = r.text.split(" In the case of severe lingering injuries")[0];

const seen = new Set<string>();
export default defs.map((d, i) => {
  let name = d.name; for (let n = 2; seen.has(name); n++) name = `${d.name} (${n})`; seen.add(name);
  const id = generateId(`roll-table/${name}`);
  return {
    _id: id, name, img: "icons/svg/d20-grey.svg", description: `<p>${esc(d.description)}</p>`, formula: d.formula, replacement: true, displayRoll: true,
    folder: null, sort: (i + 1) * 100, ownership: { default: 2 }, flags: {},
    results: d.rows.map((r) => ({
      _id: generateId(`roll-table/${name}/${r.lo}`), type: "text", name: r.label ?? "", description: esc(r.text), text: r.label ? `${r.label}. ${r.text}` : r.text, img: "icons/svg/d20-grey.svg",
      weight: r.hi - r.lo + 1, range: [r.lo, r.hi] as [number, number], drawn: false, flags: {},
    })),
  };
});
