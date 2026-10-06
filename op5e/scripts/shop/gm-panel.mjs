import { MODULE_ID } from "../constants.mjs";
import { currencyLabel, fmt, wealthIn } from "./currency.mjs";
import { extraEntries } from "../extra-sources-lib.mjs";
// The GM's shop control panel: start a shop, stock it, show it to everyone or chosen players, see who is looking, approve requests.
const ID = MODULE_ID;
const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const T = () => game.shopTrade;
const shopsNow = () => game.settings.get(ID, "shops");

export class ShopGMApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "op5e-shop-gm", classes: ["op5e-shop", "op5e-shop-gm"], window: { title: "Shop control", resizable: true }, position: { width: 640, height: 720 },
    actions: { select: ShopGMApp.#select, newShop: ShopGMApp.#newShop, deleteShop: ShopGMApp.#deleteShop, showAll: ShopGMApp.#showAll, hideAll: ShopGMApp.#hideAll, toggleUser: ShopGMApp.#toggleUser,
      stockUp: ShopGMApp.#stockUp, stockDown: ShopGMApp.#stockDown, stockOut: ShopGMApp.#stockOut, stockInf: ShopGMApp.#stockInf, restock: ShopGMApp.#restock, findItem: ShopGMApp.#findItem, approve: ShopGMApp.#approve, decline: ShopGMApp.#decline, counter: ShopGMApp.#counter, removeItem: ShopGMApp.#removeItem },
  };
  static PARTS = { body: { template: `modules/${ID}/templates/shop-gm.hbs` } };

  constructor(o = {}) { super(o); this.shopId = o.shopId ?? Object.keys(shopsNow())[0]; }
  get title() { return "Shop control"; }

  async _prepareContext() {
    const shops = shopsNow(), shop = shops[this.shopId], cur = currencyLabel();
    const viewers = new Set(shop ? T().viewers(this.shopId) : []);
    const users = game.users.filter((u) => !u.isGM).map((u) => {
      const shown = !!shop && (shop.openAll || (shop.visibleTo ?? []).includes(u.id));
      return { id: u.id, name: u.name, color: u.color?.css ?? "#888", active: u.active, shown, looking: viewers.has(u.id), state: viewers.has(u.id) ? "looking now" : shown ? "shown" : u.active ? "not shown" : "offline" };
    });
    const all = Object.values(game.settings.get(ID, "shopRequests"));
    const decorate = (r) => ({ ...r, trade: r.kind === "trade", offered: (r.offers ?? []).length > 0, offerText: fmt(r.offers?.at(-1)?.amount ?? 0), byPlayer: r.offers?.at(-1)?.by === "player", agreedText: fmt(r.agreed ?? r.total),
      history: (r.offers ?? []).map((o) => ({ who: o.by === "gm" ? "You" : r.actorName, amountText: fmt(o.amount), note: o.note })), countered: r.status === "countered", text: r.lines.map((l) => `${l.qty}x ${l.name}`).join(", "), totalText: fmt(r.total), buy: r.kind === "buy", purseText: fmt(wealthIn(game.actors.get(r.actorId) ?? { system: { currency: {} } })), approved: r.status === "approved", declined: r.status === "declined", cancelled: r.status === "cancelled" });
    return {
      cur, shops: Object.values(shops).map((s) => ({ id: s.id, name: s.name, on: s.id === this.shopId, pending: all.filter((r) => r.shopId === s.id && r.status === "pending").length })), hasShops: Object.keys(shops).length > 0,
      shop: shop && { ...shop, typeLabel: shop.type ? T().types[shop.type]?.label : null, keeperName: shop.keeper?.name ?? "Shopkeeper", keeperImg: shop.keeper?.img ?? "icons/svg/mystery-man.svg", wallet: shop.merchantId ? fmt(wealthIn(game.actors.get(shop.merchantId) ?? { system: { currency: {} } })) : null,
        items: shop.items.map((i) => ({ ...i, stockValue: i.stock ?? "", lineText: fmt(i.price), out: i.stock === 0, unlimited: i.stock === null })), empty: !shop.items.length, anyShown: shop.openAll || (shop.visibleTo ?? []).length > 0, allShown: !!shop.openAll },
      users, pending: all.filter((r) => r.status === "pending").reverse().map(decorate), hasPending: all.some((r) => r.status === "pending"),
      waiting: all.filter((r) => r.status === "countered").reverse().map(decorate), hasWaiting: all.some((r) => r.status === "countered"),
      recent: all.filter((r) => r.status !== "pending" && r.status !== "countered").slice(-10).reverse().map(decorate),
    };
  }

  async _onFirstRender() { /* the GM client tracks viewers itself */ }

  _onRender() {
    const root = this.element;
    // inline price and stock editing
    for (const input of root.querySelectorAll("input[data-field]")) input.addEventListener("change", async (ev) => {
      const v = ev.target.value.trim(), field = ev.target.dataset.field;
      const value = field === "stock" ? (v === "" ? null : Math.max(0, Math.floor(Number(v)))) : Math.max(0, Number(v) || 0);
      await T().updateItem(this.shopId, ev.target.dataset.key, { [field]: value });
    });
    // drop items from anywhere to stock the shop
    root.addEventListener("drop", async (ev) => {
      if (!this.shopId) return;
      const d = foundry.applications.ux.TextEditor.implementation.getDragEventData(ev);
      if (d?.uuid && d.type === "Item") { ev.preventDefault(); await T().addItem(this.shopId, d.uuid); }
    });
  }

  static #select(ev, el) { this.shopId = el.dataset.id; this.render(); }
  static async #newShop() { const id = await T().startShopPrompt(); if (id) { this.shopId = id; this.render(); } }
  static async #deleteShop() {
    const shop = shopsNow()[this.shopId]; if (!shop) return;
    if (!(await foundry.applications.api.DialogV2.confirm({ window: { title: "Delete shop" }, content: `<p>Delete ${shop.name} and its stock list?</p>` }))) return;
    await T().hide(this.shopId); await T().deleteShop(this.shopId); this.shopId = Object.keys(shopsNow())[0]; this.render();
  }
  static async #showAll() { await T().show(this.shopId, "all"); this.render(); }
  static async #hideAll() { await T().hide(this.shopId, "all"); this.render(); }
  static async #toggleUser(ev, el) {
    const shop = shopsNow()[this.shopId], id = el.dataset.id, shown = shop.openAll || (shop.visibleTo ?? []).includes(id);
    if (shown && shop.openAll) { await T().hide(this.shopId, "all"); const others = game.users.filter((u) => !u.isGM && u.id !== id).map((u) => u.id); if (others.length) await T().show(this.shopId, others); }
    else shown ? await T().hide(this.shopId, [id]) : await T().show(this.shopId, [id]);
    this.render();
  }
  static async #approve(ev, el) { try { const r = await T().decide(el.dataset.id, true); if (r.status === "declined") ui.notifications.warn(r.note); } catch (e) { ui.notifications.warn(e.message); } this.render(); }
  static async #decline(ev, el) {
    const note = await foundry.applications.api.DialogV2.prompt({ window: { title: "Decline request" }, content: `<label>Reason (optional) <input type="text" name="note"></label>`, ok: { label: "Decline", callback: (e, b) => new foundry.applications.ux.FormDataExtended(b.form).object.note } });
    if (note === null || note === undefined) return;
    try { await T().decide(el.dataset.id, false, note); } catch (e) { ui.notifications.warn(e.message); } this.render();
  }
  static async #counter(ev, el) {
    const req = Object.values(game.settings.get(ID, "shopRequests")).find((r) => r.id === el.dataset.id); if (!req) return;
    const start = req.offers?.at(-1)?.amount ?? req.total;
    const d = await foundry.applications.api.DialogV2.prompt({ window: { title: "Counter-offer" }, content: `<p>${req.actorName} (${req.kind === "buy" ? "buying" : "selling"}) &middot; list ${fmt(req.total)} ${currencyLabel()}${req.offers?.length ? `, they offered ${fmt(start)}` : ""}</p>
      <label>Your price (${currencyLabel()}) <input type="number" name="amount" min="1" value="${req.kind === "buy" ? Math.max(start, req.total) : Math.min(start, req.total)}"></label><label>Say something <input type="text" name="note" placeholder="optional"></label>`,
      ok: { label: "Send counter-offer", callback: (e, b) => new foundry.applications.ux.FormDataExtended(b.form).object } });
    if (!d) return;
    try { await T().counter(el.dataset.id, d.amount, d.note); } catch (e) { ui.notifications.warn(e.message); }
    this.render();
  }
  static async #stockUp(ev, el) { const e = shopsNow()[this.shopId].items.find((i) => i.key === el.dataset.key); await T().updateItem(this.shopId, e.key, { stock: (e.stock ?? 0) + 1 }); this.render(); }
  static async #stockDown(ev, el) { const e = shopsNow()[this.shopId].items.find((i) => i.key === el.dataset.key); if (e.stock !== null) await T().updateItem(this.shopId, e.key, { stock: Math.max(0, e.stock - 1) }); this.render(); }
  static async #stockOut(ev, el) { await T().updateItem(this.shopId, el.dataset.key, { stock: 0 }); this.render(); }
  static async #stockInf(ev, el) { await T().updateItem(this.shopId, el.dataset.key, { stock: null }); this.render(); }
  static async #restock() { const n = await T().restock(this.shopId); ui.notifications.info(`Reset the quantities of ${n} items to the ${shopsNow()[this.shopId].type} template.`); this.render(); }
  /** Search the extra compendium sources (for example a D&D Beyond import) for gear and add the pick to this shop's stock. */
  static async #findItem() {
    const gear = new Set(["weapon", "equipment", "consumable", "tool", "loot", "container"]);
    const entries = await extraEntries(["type", "name", "img"], (e) => gear.has(e.type));
    if (!entries.length) return ui.notifications.info("No extra compendium sources with gear are enabled (Game Settings, OP5e, Extra compendium sources).");
    const content = `<div class="form-group"><input type="search" name="q" placeholder="Part of an item's name" autofocus></div><ul class="op5e-find" style="list-style:none;margin:6px 0 0;padding:0;max-height:300px;overflow:auto"></ul>`;
    const dlg = new foundry.applications.api.DialogV2({ window: { title: "Find an item to stock" }, content, buttons: [{ action: "close", label: "Close", default: true }], position: { width: 420 } });
    dlg.addEventListener("render", () => {
      const q = dlg.element.querySelector("input[name=q]"), list = dlg.element.querySelector(".op5e-find");
      const draw = () => {
        const t = q.value.trim().toLowerCase(); list.innerHTML = "";
        if (t.length < 2) return;
        for (const e of entries.filter((x) => x.name.toLowerCase().includes(t)).slice(0, 40)) {
          const li = document.createElement("li"); li.style.cssText = "display:flex;gap:6px;align-items:center;padding:2px 0";
          li.innerHTML = `<img src="${e.img}" width="24" height="24" alt=""><span style="flex:1">${foundry.utils.escapeHTML(e.name)} <small>${foundry.utils.escapeHTML(e.source)}</small></span><button type="button">Add</button>`;
          li.querySelector("button").addEventListener("click", async () => { const [coll, id] = [e._id.split("|")[0], e._id.split("|")[1]]; await T().addItem(this.shopId, `Compendium.${coll}.Item.${id}`); ui.notifications.info(`Added ${e.name}.`); this.render(); });
          list.append(li);
        }
      };
      q.addEventListener("input", draw);
    });
    dlg.render({ force: true });
  }
  static async #removeItem(ev, el) { await T().removeItem(this.shopId, el.dataset.key); this.render(); }
}
