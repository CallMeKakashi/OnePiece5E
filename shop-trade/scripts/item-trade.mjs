// Trade from an item's three-dots menu: give one or more items to another player who is online now, for a price or free.
// The other player approves (a dialog on their screen); no GM step. A GM client carries out the transfer (players cannot edit each other's characters),
// so a GM must be online. When it goes through, a chat message says what was traded to whom for how much.
import { tradeBlocker, cleanPrice } from "./item-trade-lib.mjs";
import { currencyLabel } from "./currency.mjs";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const blocker = (item) => tradeBlocker({ type: item?.type, contentsSize: item?.system?.contents?.size });

/** Players who are online now (not me, not a GM) with the characters they own that I do not. */
export function onlineRecipients(from) {
  const out = [];
  for (const u of game.users) {
    if (u.isGM || u.id === game.user.id || !u.active) continue;   // the GM may trade from any actor (NPCs too); players only from their own characters
    const chars = game.actors.filter((a) => a.type === "character" && a !== from && a.testUserPermission(u, "OWNER") && (game.user.isGM || !a.testUserPermission(game.user, "OWNER")));
    chars.sort((a, b) => (u.character?.id === b.id) - (u.character?.id === a.id) || a.name.localeCompare(b.name));
    for (const actor of chars) out.push({ user: u, actor });
  }
  return out;
}

export async function openItemTrade(item) {
  const actor = item?.actor;
  if (!actor || !actor.isOwner || (!game.user.isGM && actor.type !== "character")) return null;
  const why = blocker(item); if (why) { ui.notifications.warn(why); return null; }
  const recipients = onlineRecipients(actor);
  if (!recipients.length) { ui.notifications.warn("No other player is online to trade with."); return null; }
  const items = actor.items.filter((i) => !blocker(i)).sort((a, b) => a.name.localeCompare(b.name));
  const rows = items.map((i) => { const q = i.system.quantity ?? 1;
    return `<tr><td><input type="checkbox" name="pick-${i.id}" ${i.id === item.id ? "checked" : ""}></td><td>${esc(i.name)}</td><td><input type="number" name="qty-${i.id}" value="1" min="1" max="${q}" style="width:4.5em" ${q < 2 ? "disabled" : ""}> of ${q}</td></tr>`; }).join("");
  const content = `<form style="display:grid;gap:8px">
    <label>Trade with <select name="partner">${recipients.map((r) => `<option value="${r.actor.id}">${esc(r.user.name)}: ${esc(r.actor.name)}</option>`).join("")}</select></label>
    <div style="max-height:260px;overflow:auto"><table style="width:100%"><thead><tr><th></th><th align="left">Item</th><th align="left">How many</th></tr></thead><tbody>${rows}</tbody></table></div>
    <label>Price in ${esc(currencyLabel())} (0 = free) <input type="number" name="price" value="0" min="0" step="1"></label>
    <p class="hint">They are asked to accept. Nothing moves until they do.</p></form>`;
  const data = await foundry.applications.api.DialogV2.prompt({ window: { title: `Trade from ${actor.name}` }, content, rejectClose: false,
    ok: { label: "Send offer", callback: (ev, btn) => new foundry.applications.ux.FormDataExtended(btn.form).object } });
  if (!data) return null;
  const picked = items.filter((i) => data[`pick-${i.id}`]).map((i) => ({ itemId: i.id, qty: Number(data[`qty-${i.id}`]) || 1 }));
  if (!picked.length) { ui.notifications.warn("Pick at least one item to trade."); return null; }
  const partner = game.actors.get(data.partner);
  try {
    const r = await game.shopTrade.offerItems({ actorId: actor.id, partnerActorId: data.partner, items: picked, price: cleanPrice(data.price) });
    ui.notifications.info(`Offer sent to ${partner?.name ?? "the other player"}. Waiting for their answer.`);
    return r;
  } catch (e) { ui.notifications.warn(e.message); return null; }
}

/** Adds "Trade" to an item's three-dots (context) menu on a player's own character. */
export function registerItemTrade() {
  Hooks.on("dnd5e.getItemContextOptions", (item, options) => {
    const actor = item?.actor; if (!actor || !actor.isOwner || (!game.user.isGM && actor.type !== "character")) return;
    options.push({ name: "Trade", icon: '<i class="fa-solid fa-handshake fa-fw"></i>', condition: () => !blocker(item), callback: () => openItemTrade(item) });
  });
}
