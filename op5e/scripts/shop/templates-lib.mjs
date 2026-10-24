// Pure helpers for shop templates that stock from a compendium instead of the One Piece "Shop Catalogues" journal (no Foundry): node --test or vitest.
// An entry is { name, type, rarity, subtype, gp }; a spec filters entries: types, subtypes, include/exclude (name regex), rarity, minPrice/maxPrice (gp), allowUnpriced.

/** How many gold pieces each dnd5e coin is worth. */
export const GOLD_PER = { pp: 10, gp: 1, ep: 0.5, sp: 0.1, cp: 0.01 };

/** An item's price ({value, denomination}) in gold pieces, to the copper piece. */
export const toGold = (price) => Math.round(Number(price?.value ?? 0) * (GOLD_PER[price?.denomination] ?? 1) * 100) / 100;

/** Round a charge up / down to the copper piece without float noise (0.1 gp stays 0.1, 0.123 gp becomes 0.13 up or 0.12 down). */
export const ceilCents = (n) => Math.ceil(Math.round(n * 1e4) / 100) / 100;
export const floorCents = (n) => Math.floor(Math.round(n * 1e4) / 100) / 100;

const rarityOf = (e) => (e.rarity ? String(e.rarity) : "none");

/** Does an entry belong to the stock a spec describes? */
export function matchesSpec(e, spec) {
  if (spec.types && !spec.types.includes(e.type)) return false;
  if (spec.subtypes && !spec.subtypes.includes(e.subtype)) return false;
  if (spec.include && !spec.include.test(e.name)) return false;
  if (spec.exclude && spec.exclude.test(e.name)) return false;
  if (spec.rarity && !spec.rarity.includes(rarityOf(e))) return false;
  if (!(e.gp > 0)) return !!spec.allowUnpriced;
  if (spec.minPrice != null && e.gp < spec.minPrice) return false;
  if (spec.maxPrice != null && e.gp > spec.maxPrice) return false;
  return true;
}

/** The entries a list of specs selects, each once (the first spec that takes it sets its stock), sorted by name. */
export function selectStock(entries, specs) {
  const seen = new Set(), out = [];
  for (const spec of specs) for (const e of entries) {
    if (seen.has(e.uuid ?? e.name) || !matchesSpec(e, spec)) continue;
    seen.add(e.uuid ?? e.name); out.push({ ...e, stock: spec.stock ?? null });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
