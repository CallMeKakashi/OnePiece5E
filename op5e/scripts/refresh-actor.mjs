// Refresh an actor's op5e items from the current compendium (keeps uses spent, quantity, equipped, attuned, prepared, favourites).
// game.op5eRefreshActor(actor, { apply: false })  -> dry run: lists the items that would change. { apply: true } updates them. GM only.
import { MODULE_ID } from "./constants.mjs";

// per-actor state that must survive a refresh
const KEEP = ["system.uses.spent", "system.quantity", "system.equipped", "system.attuned", "system.attunement", "system.prepared", "system.container", "system.proficient", "sort", "flags.dnd5e.favorite"];
const strip = (o) => { const c = foundry.utils.deepClone(o); for (const k of KEEP) foundry.utils.setProperty(c, k, undefined); delete c._id; delete c._stats; delete c.folder; delete c.ownership; return c; };

export async function refreshActorFromCompendium(actor, { apply = false } = {}) {
  const changed = [], missing = [];
  for (const item of actor.items) {
    const src = item._stats?.compendiumSource;
    if (!src?.startsWith(`Compendium.${MODULE_ID}.`)) continue;
    const doc = await fromUuid(src);
    if (!doc) { missing.push(item.name); continue; }
    const now = doc.toObject(), cur = item.toObject();
    // advancement picks and activity ids belong to the actor's copy; only compare what the compendium defines
    const a = strip({ system: { ...now.system, advancement: undefined }, name: now.name, img: now.img }), b = strip({ system: { ...cur.system, advancement: undefined }, name: cur.name, img: cur.img });
    if (foundry.utils.isEmpty(foundry.utils.diffObject(b, a)) && foundry.utils.isEmpty(foundry.utils.diffObject(a, b))) continue;
    changed.push(item.name);
    if (!apply) continue;
    const upd = { name: now.name, img: now.img, system: foundry.utils.deepClone(now.system) };
    delete upd.system.advancement;
    for (const k of KEEP) { const v = foundry.utils.getProperty(cur, k); if (v !== undefined && k.startsWith("system.")) foundry.utils.setProperty(upd, k, v); }
    await item.update(upd, { diff: false, recursive: false });
    if (now.effects?.length) { await item.deleteEmbeddedDocuments("ActiveEffect", item.effects.map((e) => e.id)); await item.createEmbeddedDocuments("ActiveEffect", now.effects); }
  }
  return { changed, missing, applied: apply };
}

export function registerRefreshActor() {
  game.op5eRefreshActor = (actor, opts) => game.user.isGM ? refreshActorFromCompendium(actor, opts) : Promise.reject(new Error("GM only"));
}
