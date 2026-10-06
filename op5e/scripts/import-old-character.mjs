// Carry an old-campaign actor's gear, spells, loose feats, berries and exact proficiencies onto an actor built with Create OPC.
// game.op5eCarryOldCharacter(source, target, { apply: false }) -> report; dry run by default. GM only. Class/species/background features are never copied.
import { MODULE_ID } from "./constants.mjs";

const GEAR = ["weapon", "equipment", "consumable", "tool", "loot", "spell"];
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, ""), loose = (s) => norm(s.replace(/\(.*?\)/g, ""));
const GEAR_PACKS = [`${MODULE_ID}.campaign-items`, `${MODULE_ID}.items`, "dnd5e.items", "dnd5e.equipment24", "dnd5e.tradegoods"];
const SPELL_PACKS = [`${MODULE_ID}.creations`, "dnd5e.spells", "dnd5e.spells24"];
const ALIAS = { commonclothes: "clothescommon" };
const DIE = "(@scale.brawler.brawling-die.faces + 2 * @flags.op5e.unarmedDieStep)";
// old-module scale references -> OP5e expressions (one pass so a replacement is never re-processed)
const translate = (d) => JSON.parse(JSON.stringify(d).replace(/@scale\.(boxer\.die(?:\.die)?|brawler\.brawling(?:\.die)?)(?![\w-])/g, (m, w) => w.startsWith("boxer") ? `1d(min(12, ${DIE}))` : "@scale.brawler.brawling-die"));
const dmgSig = (sys) => { const b = sys?.damage?.base; return b ? JSON.stringify([b.custom?.enabled ? b.custom.formula : [b.number, b.denomination], b.bonus ?? "", [...(b.types ?? [])]]) : ""; };

async function findInPacks(packIds, name, cache) {
  for (const id of packIds) {
    const pack = game.packs.get(id); if (!pack) continue;
    const ix = (cache[id] ??= await pack.getIndex());
    const e = ix.find((x) => norm(x.name) === norm(name)) ?? ix.find((x) => loose(x.name) === loose(name));
    if (e) return { id, doc: await pack.getDocument(e._id) };
  }
  return null;
}

export async function carryOldCharacter(source, target, { apply = false, matchHp = false } = {}) {
  const have = new Set(target.items.map((i) => norm(i.name)));
  const cache = {}, rep = { fromOp5e: [], fromDnd5e: [], copiedFromOld: [], keptOldVersion: [], skipped: [], feats: [], noEquivalent: [], failed: [] };
  const hasBrawler = target.items.some((i) => i.name === "Brawler Unarmed Strike");
  for (const it of source.items) {
    if (!GEAR.includes(it.type) || /^pouch of berries/i.test(it.name)) continue;
    if (have.has(norm(it.name)) || have.has(ALIAS[norm(it.name)]) || (/^Unarmed Strike/i.test(it.name) && hasBrawler)) { rep.skipped.push(it.name); continue; }
    try {
      const hit = await findInPacks(it.type === "spell" ? SPELL_PACKS : GEAR_PACKS, it.name, cache);
      const old = it.toObject();
      const keepOld = hit && old.type === "weapon" && dmgSig(old.system) !== dmgSig(hit.doc.toObject().system);   // the old sheet had other numbers: keep them
      let data;
      if (hit && !keepOld) { data = hit.doc.toObject(); rep[hit.id.startsWith(MODULE_ID) ? "fromOp5e" : "fromDnd5e"].push(it.name); }
      else { data = translate(old); data.flags = { ...data.flags, [MODULE_ID]: { ...data.flags?.[MODULE_ID], carriedFromOldSheet: true } }; if (data.system && "container" in data.system) data.system.container = null; (keepOld ? rep.keptOldVersion : rep.copiedFromOld).push(it.name); }
      delete data._id; delete data.folder; delete data.sort; delete data.ownership; delete data._stats;
      if (data.system && "quantity" in data.system) data.system.quantity = old.system?.quantity ?? 1;
      if (data.system && "equipped" in data.system) data.system.equipped = !!old.system?.equipped;
      if (apply) { const [made] = await target.createEmbeddedDocuments("Item", [data]); if (!made) throw new Error("Foundry created nothing"); have.add(norm(made.name)); }
    } catch (e) { rep.failed.push(`${it.name}: ${String(e.message).slice(0, 80)}`); }
  }
  for (const f of source.items.filter((i) => i.type === "feat")) {   // loose feats with a general-feat equivalent; class/race features stay behind
    if (have.has(norm(f.name))) continue;
    const isFeature = /Haki|^Color of|Fighting Style/i.test(f.name);   // Haki tiers and fighting styles live in class-features
    const hit = await findInPacks(isFeature ? [`${MODULE_ID}.class-features`, `${MODULE_ID}.feats`] : [`${MODULE_ID}.feats`], f.name, cache);
    if (hit?.doc.type === "feat" && !(isFeature && /^Haki$/i.test(f.name))) { rep.feats.push(f.name); if (apply) { const d = hit.doc.toObject(); delete d._id; await target.createEmbeddedDocuments("Item", [d]); have.add(norm(f.name)); } }
    else rep.noEquivalent.push(f.name);
  }
  const s = source.system, upd = { "system.currency.gp": (s.currency?.gp ?? 0) + source.items.filter((i) => /^pouch of berries/i.test(i.name)).reduce((n, i) => n + (Number(/\((\d+)K\)/i.exec(i.name)?.[1] ?? 0) * 1000), 0) };
  for (const k of Object.keys(target.system.abilities)) upd[`system.abilities.${k}.proficient`] = s.abilities?.[k]?.proficient ? 1 : 0;
  for (const k of Object.keys(target.system.skills)) upd[`system.skills.${k}.value`] = s.skills?.[k]?.value ?? 0;
  for (const [k, v] of Object.entries(s.tools ?? {})) if (v.value) upd[`system.tools.${k}.value`] = v.value;
  upd["system.traits.size"] = s.traits?.size ?? "med";
  upd["system.details.biography.value"] = `${target.system.details.biography.value ?? ""}<h3>Carried over from the old campaign sheet</h3><p>No equivalent in the rebuilt class, species or background: ${[...new Set(rep.noEquivalent)].sort().join(", ") || "none"}.</p>`;
  if (matchHp) { const diff = (source.system.attributes?.hp?.max ?? 0) - (target.system.attributes?.hp?.max ?? 0) + (target.system.attributes?.hp?.bonuses?.overall ? 0 : 0); if (diff) upd["system.attributes.hp.bonuses.overall"] = String(diff); rep.hpDifference = diff; }   // old sheets rolled or used another hit die; this makes the maximum match
  if (apply) await target.update(upd);
  return { applied: apply, counts: Object.fromEntries(Object.entries(rep).map(([k, v]) => [k, v.length])), ...rep };
}

export function registerImportOldCharacter() {
  game.op5eCarryOldCharacter = (src, dst, opts) => game.user.isGM ? carryOldCharacter(src, dst, opts) : Promise.reject(new Error("GM only"));
}
