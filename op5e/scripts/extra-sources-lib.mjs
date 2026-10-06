// Helpers for ids that may carry their compendium. Foundry globals are only touched inside functions, so this file can be unit-tested and imported anywhere.
import { MODULE_ID } from "./constants.mjs";

export const EXTRA_SETTING = "extraSources";
/** Splits an id that may carry its pack: "world.ddb-feats|abc" -> {collection:"world.ddb-feats", id:"abc"}; a plain id uses `fallback`. */
export function parseSourceId(value, fallback) {
  const s = String(value ?? "");
  const i = s.indexOf("|");
  return i < 0 ? { collection: fallback, id: s } : { collection: s.slice(0, i), id: s.slice(i + 1) };
}


/** The enabled extra sources that are still installed. */
export const extraPacks = () => (game.settings.get(MODULE_ID, EXTRA_SETTING) ?? []).map((id) => game.packs.get(id)).filter(Boolean);

/** Index entries from every extra source that pass `keep`, tagged with their source and a pack-carrying id. */
export async function extraEntries(fields, keep = () => true) {
  const out = [];
  for (const pack of extraPacks()) {
    const idx = await pack.getIndex({ fields }).catch(() => []);
    for (const e of idx) if (keep(e)) out.push({ ...e, _id: `${pack.collection}|${e._id}`, source: pack.metadata.label });
  }
  return out;
}

/** The document for an id that may carry its pack; plain ids come from `fallback`. */
export async function docFromSourceId(value, fallback) {
  const { collection, id } = parseSourceId(value, fallback);
  return id ? (await game.packs.get(collection)?.getDocument(id)) ?? null : null;
}

/** "Name — Source" for an entry from an extra source, the plain name for op5e's own. */
export const labelled = (e) => (e.source ? `${e.name} — ${e.source}` : e.name);
