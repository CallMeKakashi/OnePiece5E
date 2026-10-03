// Phase 4: Sourcebook/Monster Manual/Devil Fruits/Homebrew -> extracted/*.json. No Foundry output here.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import YAML from "yaml";
const VAULT = join(import.meta.dirname, "..", "..");
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : []; });
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const dice = (t) => [...new Set(t.match(/\b\d+d\d+(?:\s*[+-]\s*\d+)?/g) ?? [])];
const saves = (t) => [...new Set([...t.matchAll(/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) saving throw/gi)].map((m) => m[1].toLowerCase()))];
const entries = [], monsters = [], vehicles = [];
for (const [root, kind] of [["Sourcebook", "sourcebook"], ["Monster Manual", "monster"], ["Devil Fruits", "devil-fruit"], ["Homebrew Items", "homebrew-item"]]) {
  for (const f of walk(join(VAULT, root))) {
    const rel = relative(VAULT, f).split(sep).join("/"), raw = readFileSync(f, "utf8");
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/), body = fm ? raw.slice(fm[0].length) : raw;
    const parts = rel.split("/"), name = parts.at(-1).replace(/\.md$/, "");
    const heading = body.match(/^#+\s+(.+)$/m)?.[1]?.trim() ?? name;
    const meta = fm ? (() => { try { return YAML.parse(fm[1]) ?? {}; } catch { return {}; } })() : {};
    const e = { name, key: norm(name), kind, meta, source: { book: "SOURCEBOOK", file: rel, heading, pageMarkers: [...body.matchAll(/<!-- Page (\d+) -->/g)].map((m) => Number(m[1])) }, section: parts.slice(1, -1), links: [...new Set([...body.matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim()))],
      hints: { dice: dice(body), saves: saves(body), usesPerRest: /(short|long) rest/i.test(body), words: body.split(/\s+/).length }, body };
    entries.push(e);
    const sb = body.match(/```statblock\n([\s\S]*?)```/);
    if (sb) try { monsters.push({ name, source: e.source, statblock: YAML.parse(sb[1]) }); } catch (err) { monsters.push({ name, source: e.source, error: String(err) }); }
    if (/Mounts and Vehicles|Ship/i.test(rel)) vehicles.push({ name, source: e.source, section: e.section });
  }
}
const w = (n, d) => writeFileSync(join(import.meta.dirname, "..", "extracted", n), JSON.stringify(d, null, 1));
w("entries.json", entries); w("monsters.json", monsters); w("vehicles.json", vehicles);
const by = {}; for (const e of entries) { const k = e.section[0] ?? e.kind; by[k] = (by[k] ?? 0) + 1; }
console.log({ entries: entries.length, monsters: monsters.length, monsterErrors: monsters.filter((m) => m.error).length, vehicleDocs: vehicles.length, by });
