// GM-only API surface for the op5e MCP server (op5e/mcp/server.mjs): name-based helpers over Create OPC, advancement and the packs.
// Everything takes names, not ids, and returns plain JSON. game.op5eApi.* ; refuses non-GM users.
import { createFromDraft, PACKS, defaultData } from "./wizard/create.mjs";
import { levelClassTo } from "./wizard/apply-advancements.mjs";
import { refreshActorFromCompendium } from "./refresh-actor.mjs";
import { carryOldCharacter } from "./import-old-character.mjs";

const gm = () => { if (!game.user?.isGM) throw new Error("GM only"); };
const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
const PACK_IDS = ["classes", "subclasses", "class-features", "races", "racial-features", "backgrounds", "feats", "items", "creations", "campaign-items", "devil-fruits", "monsters"].map((p) => `op5e.${p}`);

async function byName(pack, name) {
  const ix = await game.packs.get(pack).getIndex();
  const e = ix.find((x) => norm(x.name) === norm(name)) ?? ix.find((x) => norm(x.name).includes(norm(name)))
    ?? ix.find((x) => norm(x.name).length >= 4 && norm(name).includes(norm(x.name)));   // "Lunarians" finds "Lunarian"
  if (!e) throw new Error(`"${name}" not found in ${pack}`);
  return e;
}
const actorByName = (n) => game.actors.getName(n) ?? game.actors.get(n) ?? (() => { throw new Error(`actor "${n}" not found`); })();
const summary = (a) => ({ id: a.id, name: a.name, type: a.type, level: a.system.details?.level ?? a.system.details?.cr, hp: a.system.attributes?.hp?.max, ac: a.system.attributes?.ac?.value,
  classes: a.items.filter((i) => i.type === "class").map((c) => `${c.name} ${c.system.levels}`), items: a.items.size });

export const api = {
  async search({ query, pack, type, limit = 25 }) {
    gm(); const out = [];
    for (const id of pack ? [pack] : PACK_IDS) {
      const p = game.packs.get(id); if (!p) continue;
      for (const e of await p.getIndex({ fields: ["type"] })) if ((!type || e.type === type) && norm(e.name).includes(norm(query))) out.push({ pack: id, name: e.name, type: e.type, uuid: e.uuid });
    }
    return out.slice(0, limit);
  },
  /** species/background/cls/subclass by name. abilities default to the standard array in str..cha order. kind "npc" makes an npc actor. */
  async createCharacter({ name, species, background, cls, level = 3, subclass, cls2, level2 = 1, subclass2, feat, fruit, abilities, kind = "pc", dream = "", prefer, haki }) {
    gm(); const notes = [];
    const d = defaultData();
    Object.assign(d, { name, level, level2, dream, abilityMethod: "roll", hpMode: "avg", autoApply: true });
    d.abilities = abilities ?? { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
    d.speciesId = (await byName(PACKS.species, species))._id; d.backgroundId = (await byName(PACKS.backgroundsAndRoles, background))._id;
    d.classId = (await byName(PACKS.classes, cls))._id; if (subclass) d.subclassId = (await byName(PACKS.subclasses, subclass))._id;
    if (cls2) { d.classId2 = (await byName(PACKS.classes, cls2))._id; if (subclass2) d.subclassId2 = (await byName(PACKS.subclasses, subclass2))._id; }
    if (feat) d.freeFeatId = (await byName(PACKS.feats, feat))._id;
    const actor = await createFromDraft({ actorKind: kind, data: d }, { auto: true, hpMode: "avg", notes, noSheet: true, fruit, prefer, haki });
    return { ...summary(actor), notes };
  },
  async levelUp({ actor, cls, to }) {
    gm(); const a = actorByName(actor); const c = a.items.find((i) => i.type === "class" && norm(i.name) === norm(cls));
    if (!c) throw new Error(`${a.name} has no class ${cls}`);
    const notes = []; await levelClassTo(a, c.id, to, { auto: true, hpMode: "avg", notes }); return { ...summary(a), notes };
  },
  async addItem({ actor, name, pack, quantity = 1 }) {
    gm(); const a = actorByName(actor); let hit;
    for (const id of pack ? [pack] : [...PACK_IDS, "dnd5e.items", "dnd5e.spells"]) { const p = game.packs.get(id); const ix = p && await p.getIndex(); const e = ix?.find((x) => norm(x.name) === norm(name)); if (e) { hit = await p.getDocument(e._id); break; } }
    if (!hit) throw new Error(`"${name}" not found`);
    const d = hit.toObject(); delete d._id; d._stats = { ...d._stats, compendiumSource: hit.uuid }; if (d.system && "quantity" in d.system) d.system.quantity = quantity;
    const [made] = await a.createEmbeddedDocuments("Item", [d]);
    if (!made) throw new Error(`Foundry did not add ${hit.name} (a prerequisite or another rule refused it)`);
    return { added: made.name, type: made.type, from: hit.pack };
  },
  async learnFruitSpell({ actor, spell }) { gm(); const hit = (await api.search({ query: spell, type: "spell", limit: 1 }))[0] ?? (await (async () => { for (const id of ["dnd5e.spells", "dnd5e.spells24"]) { const e = (await game.packs.get(id)?.getIndex())?.find((x) => norm(x.name) === norm(spell)); if (e) return { uuid: e.uuid }; } })()); if (!hit) throw new Error(`spell "${spell}" not found`); const made = await game.op5eFruitCasting.learn(actorByName(actor), hit.uuid); return { learned: made.name, level: made.system.level }; },
  /** Rebuild an old-campaign actor through Create OPC. map: {"Gunslinger": "Marksman"} for classes that no longer exist; species/background/fruit override what is read from the old sheet. */
  async importOldCharacter({ source, name, map = {}, species, background, fruit, prefer, haki, matchHp = false, apply = true }) {
    gm(); const old = actorByName(source);
    const classes = old.items.filter((i) => i.type === "class").map((c) => ({ name: map[c.name] ?? c.name, level: c.system.levels, sub: old.items.find((s) => s.type === "subclass" && s.system.classIdentifier === c.system.identifier)?.name })).sort((a, b) => b.level - a.level);
    if (!classes.length) throw new Error(`${old.name} has no class items`);
    // old species names that op5e files under another name (the Three-eye Tribe is a Human people with the Third Eye feature)
    const SPECIES_ALIAS = { "three-eye tribe": "Human", "three-eye": "Human" };
    const oldRace = old.items.find((i) => i.type === "race")?.name;
    const race = species ?? SPECIES_ALIAS[String(oldRace ?? "").toLowerCase()] ?? oldRace, bg = background ?? old.items.find((i) => i.type === "background")?.name;
    const base = Object.fromEntries(Object.entries(old.system.abilities).map(([k, v]) => [k, v.value]));
    // the old sheet's fighting style and Haki picks steer the automatic choices (a style or Haki tier the sheet already had is preferred over the first one offered)
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const picked = old.items.filter((i) => i.type === "feat" && /^(Fighting Style:|Color of |Conqueror.s Haki |Armament Haki|Observation Haki)/i.test(i.name)).map((i) => `^${esc(i.name)}$`);
    prefer = [...(prefer ?? []), ...picked];
    const trySub = async (n) => { try { return n && (await byName(PACKS.subclasses, n), n); } catch { return undefined; } };
    const made = await api.createCharacter({ name: name ?? `${old.name} (OPC)`, species: race, background: bg, cls: classes[0].name, level: classes[0].level, subclass: await trySub(classes[0].sub),
      cls2: classes[1]?.name, level2: classes[1]?.level, subclass2: await trySub(classes[1]?.sub), abilities: base, fruit, prefer, haki });
    const target = game.actors.get(made.id), report = await carryOldCharacter(old, target, { apply, matchHp });
    return { ...summary(target), notes: made.notes, carry: report.counts, noEquivalent: report.noEquivalent, failed: report.failed, hpDifference: report.hpDifference };
  },
  async setActor({ actor, set }) { gm(); const a = actorByName(actor); await a.update(set); return summary(a); },
  async listActors({ type } = {}) { gm(); return game.actors.filter((a) => !type || a.type === type).map(summary); },
  async getActor({ actor }) { gm(); const a = actorByName(actor); return { ...summary(a), abilities: Object.fromEntries(Object.entries(a.system.abilities).map(([k, v]) => [k, v.value])), items: a.items.map((i) => `${i.type}: ${i.name}`) }; },
  async refreshActor({ actor, apply = false }) { gm(); return refreshActorFromCompendium(actorByName(actor), { apply }); },
  async deleteActor({ actor, confirm }) { gm(); if (confirm !== true) throw new Error("pass confirm: true to delete"); const a = actorByName(actor); const n = a.name; await a.delete(); return { deleted: n }; },
};

export function registerMcpApi() { game.op5eApi = api; }
