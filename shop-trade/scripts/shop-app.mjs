// Minimal shop window: lists the shop's items with Buy buttons; the GM can drop items from any compendium or sidebar onto it.
const ID = "dnd5e-shop-trade";
export class ShopApp extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  static DEFAULT_OPTIONS = { id: "shop-trade", classes: ["shop-trade"], window: { title: "Shop", resizable: true }, position: { width: 460, height: 520 }, actions: { buy: ShopApp.#buy, sell: ShopApp.#sell } };
  static PARTS = { body: { template: `modules/${ID}/templates/shop.hbs` } };
  constructor(o) { super(o); this.shopId = o.shopId; this.actor = o.actor; }
  get shop() { return game.settings.get(ID, "shops")[this.shopId]; }
  async _prepareContext() {
    const s = this.shop;
    return { shop: s, actor: this.actor?.name, wealth: this.actor ? game.shopTrade.wealth(this.actor) : null,
      mine: (this.actor?.items.filter((i) => i.system.price?.value > 0) ?? []).map((i) => ({ id: i.id, name: i.name, qty: i.system.quantity ?? 1, offer: Math.floor(i.system.price.value * game.settings.get(ID, "sellRatio") / 100) })),
      items: s.items.map((i) => ({ ...i, shown: Math.ceil((i.price ?? 0) * (1 + (s.markup ?? 0) / 100)), unlimited: i.stock === null })) };
  }
  _onRender() {
    if (!game.user.isGM) return;
    this.element.addEventListener("drop", async (ev) => {
      const d = foundry.applications.ux.TextEditor.implementation.getDragEventData(ev);
      if (d?.uuid) { await game.shopTrade.addItem(this.shopId, d.uuid, { price: (await fromUuid(d.uuid))?.system?.price?.value ?? 0 }); this.render(); }
    });
  }
  static async #sell(ev, el) {
    try { const r = await game.shopTrade.sell(this.shopId, this.actor.id, el.dataset.id, 1); ui.notifications.info(`Sold ${r.sold} for ${r.total}`); } catch (e) { ui.notifications.warn(e.message); }
    this.render();
  }
  static async #buy(ev, el) {
    try { const r = await game.shopTrade.buy(this.shopId, this.actor.id, el.dataset.key, 1); ui.notifications.info(`Bought ${r.bought}`); } catch (e) { ui.notifications.warn(e.message); }
    this.render();
  }
}

/** Trade window: pick a partner, what each side gives (one item and money each); both owners must confirm, the GM confirms for everyone. */
export async function openTradeDialog(actor) {
  const others = game.actors.filter((a) => a.id !== actor.id && a.hasPlayerOwner || a.type === "npc").filter((a) => a.id !== actor.id);
  const opts = (list) => list.map((i) => `<option value="${i.id}">${i.name} x${i.system.quantity ?? 1}</option>`).join("");
  const content = `<form><label>Partner <select name="partner">${others.map((a) => `<option value="${a.id}">${a.name}</option>`).join("")}</select></label>
    <fieldset><legend>You give</legend><select name="giveItem"><option value="">(no item)</option>${opts(actor.items.filter((i) => i.system.quantity !== undefined))}</select> <input type="number" name="giveMoney" value="0" min="0"></fieldset>
    <fieldset><legend>You get</legend><select name="getItem"><option value="">(no item)</option></select> <input type="number" name="getMoney" value="0" min="0"></fieldset></form>`;
  const data = await foundry.applications.api.DialogV2.prompt({ window: { title: `Trade: ${actor.name}` }, content, ok: { label: "Offer trade", callback: (ev, btn) => new foundry.applications.ux.FormDataExtended(btn.form).object } });
  if (!data) return null;
  const partner = game.actors.get(data.partner);
  const side = (a, item, money) => ({ actorId: a.id, items: item ? [{ itemId: item, qty: 1 }] : [], money: Number(money) || 0 });
  // the partner's owner confirms in a prompt on their client; a GM-run trade skips that step
  const confirmedBy = [game.user.id];
  if (!game.user.isGM) { const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Trade" }, content: `<p>Offer this trade to ${partner.name}'s owner? They must also confirm (ask the GM to confirm for them).</p>` }); if (!ok) return null; }
  return game.shopTrade.trade(side(actor, data.giveItem, data.giveMoney), side(partner, data.getItem, data.getMoney), confirmedBy);
}
