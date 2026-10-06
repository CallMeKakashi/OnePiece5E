// Minimal shop window: lists the shop's items with Buy buttons; the GM can drop items from any compendium or sidebar onto it.
const ID = "dnd5e-shop-trade";
export class ShopApp extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  static DEFAULT_OPTIONS = { id: "shop-trade", classes: ["shop-trade"], window: { title: "Shop", resizable: true }, position: { width: 460, height: 520 }, actions: { buy: ShopApp.#buy } };
  static PARTS = { body: { template: `modules/${ID}/templates/shop.hbs` } };
  constructor(o) { super(o); this.shopId = o.shopId; this.actor = o.actor; }
  get shop() { return game.settings.get(ID, "shops")[this.shopId]; }
  async _prepareContext() {
    const s = this.shop;
    return { shop: s, actor: this.actor?.name, wealth: this.actor ? game.shopTrade.wealth(this.actor) : null,
      items: s.items.map((i) => ({ ...i, shown: Math.ceil((i.price ?? 0) * (1 + (s.markup ?? 0) / 100)), unlimited: i.stock === null })) };
  }
  _onRender() {
    if (!game.user.isGM) return;
    this.element.addEventListener("drop", async (ev) => {
      const d = foundry.applications.ux.TextEditor.implementation.getDragEventData(ev);
      if (d?.uuid) { await game.shopTrade.addItem(this.shopId, d.uuid, { price: (await fromUuid(d.uuid))?.system?.price?.value ?? 0 }); this.render(); }
    });
  }
  static async #buy(ev, el) {
    try { const r = await game.shopTrade.buy(this.shopId, this.actor.id, el.dataset.key, 1); ui.notifications.info(`Bought ${r.bought}`); } catch (e) { ui.notifications.warn(e.message); }
    this.render();
  }
}
