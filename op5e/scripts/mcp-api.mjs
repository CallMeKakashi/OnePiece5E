// GM-only API surface for the op5e MCP server (op5e/mcp/server.mjs): name-based helpers over Create OPC, advancement and the packs.
// Everything takes names, not ids, and returns plain JSON. game.op5eApi.* ; refuses non-GM users.
import { createFromDraft, PACKS, defaultData } from "./wizard/create.mjs";
import { levelClassTo } from "./wizard/apply-advancements.mjs";
import { refreshActorFromCompendium } from "./refresh-actor.mjs";

const gm = () => { if (!game.user?.isGM) throw new Error("GM only"); };
const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
const PACK_IDS = ["classes", "subclasses", "class-features", "races", "racial-features", "backgrounds", "feats", "items", "creations", "campaign-items", "devil-fruits", "monsters"].map((p) => `op5e.${p}`);

async function byName(pack, name) {
  const ix = await game.packs.get(pack).getIndex();
  const e = ix.find((x) => norm(x.name) === norm(name)) ?? ix.find((x) => norm(x.name).includes(norm(name)));
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
  async createCharacter({ name, species, background, cls, level = 3, subclass, cls2, level2 = 1, subclass2, feat, fruit, abilities, kind = "pc", dream = "" }) {
    gm(); const notes = [];
    const d = defaultData();
    Object.assign(d, { name, level, level2, dream, abilityMethod: "roll", hpMode: "avg", autoApply: true });
    d.abilities = abilities ?? { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
    d.speciesId = (await byName(PACKS.species, species))._id; d.backgroundId = (await byName(PACKS.backgroundsAndRoles, background))._id;
    d.classId = (await byName(PACKS.classes, cls))._id; if (subclass) d.subclassId = (await byName(PACKS.subclasses, subclass))._id;
    if (cls2) { d.classId2 = (await byName(PACKS.classes, cls2))._id; if (subclass2) d.subclassId2 = (await byName(PACKS.subclasses, subclass2))._id; }
    if (feat) d.freeFeatId = (await byName(PACKS.feats, feat))._id;
    const actor = await createFromDraft({ actorKind: kind, data: d }, { auto: true, hpMode: "avg", notes, noSheet: true, fruit });
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
    const [made] = await a.createEmbeddedDocuments("Item", [d]); return { added: made.name, type: made.type, from: hit.pack };
  },
  async learnFruitSpell({ actor, spell }) { gm(); const hit = (await api.search({ query: spell, type: "spell", limit: 1 }))[0] ?? (await (async () => { for (const id of ["dnd5e.spells", "dnd5e.spells24"]) { const e = (await game.packs.get(id)?.getIndex())?.find((x) => norm(x.name) === norm(spell)); if (e) return { uuid: e.uuid }; } })()); if (!hit) throw new Error(`spell "${spell}" not found`); const made = await game.op5eFruitCasting.learn(actorByName(actor), hit.uuid); return { learned: made.name, level: made.system.level }; },
  async setActor({ actor, set }) { gm(); const a = actorByName(actor); await a.update(set); return summary(a); },
  async listActors({ type } = {}) { gm(); return game.actors.filter((a) => !type || a.type === type).map(summary); },
  async getActor({ actor }) { gm(); const a = actorByName(actor); return { ...summary(a), abilities: Object.fromEntries(Object.entries(a.system.abilities).map(([k, v]) => [k, v.value])), items: a.items.map((i) => `${i.type}: ${i.name}`) }; },
  async refreshActor({ actor, apply = false }) { gm(); return refreshActorFromCompendium(actorByName(actor), { apply }); },
  async deleteActor({ actor, confirm }) { gm(); if (confirm !== true) throw new Error("pass confirm: true to delete"); const a = actorByName(actor); const n = a.name; await a.delete(); return { deleted: n }; },
};

export function registerMcpApi() { game.op5eApi = api; }
