/** dnd5e 5.1 stores advancement as an array, 5.3+ as an object keyed by _id (an AdvancementCollection in documents). Returns a plain array either way. */
export function advancementList(adv) {
  if (!adv) return [];
  if (Array.isArray(adv)) return adv;
  return Array.from(adv.values?.() ?? Object.values(adv));
}
