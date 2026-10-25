// Pure helpers for the item-menu trade (no Foundry globals, so they are unit tested).
// A trade is one-way: the sender gives items, the receiver pays a price (0 = free). The receiver must approve; no GM step.

/** Item types that can be traded. Anything else (features, spells, classes, species...) is not a physical item. */
export const TRADEABLE_TYPES = Object.freeze(["weapon", "equipment", "consumable", "tool", "loot", "container"]);

/** Why an item cannot be traded, or "" if it can. item: { type, contentsSize? }. A container must be empty (its contents would be left behind). */
export function tradeBlocker(item) {
  if (!item || !TRADEABLE_TYPES.includes(item.type)) return "That is not an item that can be traded.";
  if (item.type === "container" && (item.contentsSize ?? 0) > 0) return "Empty the container first.";
  return "";
}

export const itemLine = (name, qty) => (qty > 1 ? `${qty}× ${name}` : name);

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Whole-number price, 0 or more. Anything else (negative, NaN, blank) is 0. */
export const cleanPrice = (v) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n > 0 ? n : 0; };

/**
 * Validate and normalise the items of an offer against what the sender actually holds.
 * offered: [{ itemId, qty }]; held: Map itemId -> { name, type, quantity, contentsSize }. Returns [{ itemId, qty, name }], or throws an Error with a plain message.
 */
export function cleanOffer(offered, held) {
  if (!Array.isArray(offered) || !offered.length) throw new Error("Pick at least one item to trade.");
  const seen = new Set(), out = [];
  for (const o of offered) {
    if (seen.has(o.itemId)) continue; seen.add(o.itemId);
    const it = held.get(o.itemId);
    if (!it) throw new Error("You no longer have one of those items.");
    const blocked = tradeBlocker(it); if (blocked) throw new Error(`${it.name}: ${blocked}`);
    const have = Math.max(1, Math.floor(it.quantity ?? 1)), qty = Math.min(have, Math.max(1, Math.floor(Number(o.qty) || 1)));
    out.push({ itemId: o.itemId, qty, name: it.name });
  }
  return out;
}

/** The public chat line: who traded what to whom, and for how much. items: [{ name, qty }]. */
export function tradeMessage({ from, to, items, price, currency, fmt = (n) => String(n) }) {
  const what = items.map((i) => esc(itemLine(i.name, i.qty))).join(", ");
  const cost = price > 0 ? `${fmt(price)} ${esc(currency)}` : "free";
  return `<p><strong>${esc(from)}</strong> traded <strong>${what}</strong> to <strong>${esc(to)}</strong> for <strong>${cost}</strong>.</p>`;
}

/** The text shown to the receiver when asked to approve. */
export function offerSummary({ from, to, items, price, currency, fmt = (n) => String(n) }) {
  const what = items.map((i) => esc(itemLine(i.name, i.qty)));
  return { intro: `<strong>${esc(from)}</strong> offers <strong>${esc(to)}</strong>:`, lines: what, cost: price > 0 ? `for ${fmt(price)} ${esc(currency)}` : "for free" };
}
