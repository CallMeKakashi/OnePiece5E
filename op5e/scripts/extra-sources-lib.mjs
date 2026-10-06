// Pure helper for ids that may carry their compendium (no Foundry globals, so it can be unit-tested and imported anywhere).
/** Splits an id that may carry its pack: "world.ddb-feats|abc" -> {collection:"world.ddb-feats", id:"abc"}; a plain id uses `fallback`. */
export function parseSourceId(value, fallback) {
  const s = String(value ?? "");
  const i = s.indexOf("|");
  return i < 0 ? { collection: fallback, id: s } : { collection: s.slice(0, i), id: s.slice(i + 1) };
}

