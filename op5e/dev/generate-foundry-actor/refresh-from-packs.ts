// The actor pipeline embeds the raw data/src features, which have no automation. The built packs (packs-src/*, after data/src/automation) do:
// activities, effects, uses. This copies that automation onto the actor's own copy of every feature that matches a pack entry by name AND description
// (names alone collide: Unarmored Defense exists for two classes). _ids on the actor item stay as they are.
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
type Doc = Record<string, any>;
const PACKS = ["class-features", "feats", "racial-features", "subclasses"];
let index: Map<string, Doc[]> | null = null;
const load = () => {
  if (index) return index;
  index = new Map();
  for (const p of PACKS) for (const f of readdirSync(`packs-src/${p}`)) {
    const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8"));
    const key = `${d.type}|${d.name}`; (index.get(key) ?? index.set(key, []).get(key)!).push(d);
  }
  return index;
};
const text = (d: Doc) => String(d.system?.description?.value ?? "").replace(/\s+/g, " ").trim();
export function refreshFromPacks(items: Doc[]): { refreshed: string[]; unmatched: string[] } {
  const refreshed: string[] = [], unmatched: string[] = [];
  for (const it of items) {
    if (!["feat"].includes(it.type)) continue;
    if (String(it.system?.source?.book ?? "").includes("homebrew")) continue;
    const cands = load().get(`${it.type}|${it.name}`) ?? [];
    const pick = cands.find((c) => text(c) === text(it)) ?? (cands.length === 1 ? cands[0] : undefined);
    if (!pick) { unmatched.push(it.name); continue; }
    const hasAuto = Object.keys(pick.system.activities ?? {}).length || (pick.effects ?? []).length || pick.system.uses?.max;
    if (!hasAuto) continue;
    it.system.activities = structuredClone(pick.system.activities ?? {});
    it.effects = structuredClone(pick.effects ?? []);
    if (pick.system.uses) it.system.uses = structuredClone(pick.system.uses);
    if (pick.system.damage) it.system.damage = structuredClone(pick.system.damage);
    if (pick.system.activation) it.system.activation = structuredClone(pick.system.activation);
    refreshed.push(it.name);
  }
  return { refreshed, unmatched };
}

/** Summon activities point at "Compendium.op5e.summons.Actor.<id>", which breaks the standalone rule. Copies each summon actor out as its own JSON next to the NPC
 *  (same id, so import it with ids kept) and rewrites the profile to "Actor.<id>". Returns the files written. */
export function standaloneSummons(items: Doc[], outDir: string, slug: string): string[] {
  const written: string[] = [];
  for (const it of items) for (const act of Object.values(it.system?.activities ?? {}) as Doc[]) for (const prof of act.profiles ?? []) {
    const m = /^Compendium\.op5e\.summons\.Actor\.(\w+)$/.exec(prof.uuid ?? ""); if (!m) continue;
    const file = `packs-src/summons/${m[1]}.json`; if (!existsSync(file)) throw new Error(`summon ${m[1]} not found in packs-src/summons`);
    const actor = JSON.parse(readFileSync(file, "utf-8")); delete actor._key; delete actor._stats;
    const out = `${outDir}/${slug}-summon-${String(actor.name).toLowerCase().replace(/\W+/g, "-")}.json`;
    writeFileSync(out, JSON.stringify(actor, null, 2), "utf-8"); written.push(out);
    prof.uuid = `Actor.${actor._id}`;
  }
  return written;
}
