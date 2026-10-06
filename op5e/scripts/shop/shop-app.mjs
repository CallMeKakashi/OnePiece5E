import { MODULE_ID } from "../constants.mjs";
import { price, currencyLabel, fmt, wealthIn } from "./currency.mjs";
// The player's storefront: browse by category, build a cart, send it to the GM. Nothing moves until the GM approves.
const ID = MODULE_ID;
const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const CATEGORIES = { weapon: "Weapons", equipment: "Armor and gear", consumable: "Supplies", tool: "Tools", loot: "Goods", container: "Goods", spell: "Scrolls" };
const catOf = (type) => CATEGORIES[type] ?? "Other";

// ShopTrade API is attached to game later; import lazily to avoid a cycle
const T = () => game.shopTrade;
const shopsNow = () => game.settings.get(ID, "shops");

export class ShopApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "op5e-shop", classes: ["op5e-shop"], window: { title: "Shop", resizable: true }, position: { width: 560, height: 680 },
    actions: { view: ShopApp.#view, cat: ShopApp.#cat, add: ShopApp.#add, sub: ShopApp.#sub, send: ShopApp.#send, sendOffer: ShopApp.#sendOffer, cancel: ShopApp.#cancel, accept: ShopApp.#accept, counter: ShopApp.#counter, withdraw: ShopApp.#withdraw, guide: ShopApp.#guide },
  };
  static PARTS = { body: { template: `modules/${ID}/templates/shop.hbs` } };

  constructor(o) {
    super(o); this.shopId = o.shopId; this.actorId = o.actorId;
    this.view = "buy"; this.category = "all"; this.cart = { buy: {}, sell: {} };
  }
  get shop() { return shopsNow()[this.shopId]; }
  get actor() { return game.actors.get(this.actorId); }
  get title() { return this.shop?.name ?? "Shop"; }

  async _onFirstRender() { T().reportViewing(this.shopId, true); }
  async close(options) { T().reportViewing(this.shopId, false); return super.close(options); }

  async _prepareContext() {
    const shop = this.shop, actor = this.actor;
    if (!shop) return { gone: true };
    const cur = currencyLabel(), purse = actor ? wealthIn(actor) : 0, buying = this.view === "buy";
    const cart = this.cart[this.view];
    // what can be listed
    let rows;
    if (buying) {
      rows = shop.items.map((e) => {
        const unit = Math.ceil(price(e, shop)), qty = cart[e.key] ?? 0, soldOut = e.stock !== null && e.stock <= 0;
        return { id: e.key, img: e.img, name: e.name, cat: catOf(e.type), unit, unitText: fmt(unit), qty, stockText: e.stock === null ? "" : soldOut ? "Sold out" : `${e.stock} left`, soldOut,
          maxed: soldOut || unit <= 0 || (e.stock !== null && qty >= e.stock), onRequest: unit <= 0, can: purse >= unit, short: Math.max(0, unit - purse) };
      });
    } else {
      const ratio = game.settings.get(ID, "sellRatio") / 100;
      rows = (actor?.items ?? []).filter((i) => Number(i.system.price?.value) > 0 && !i.system.equipped).map((i) => {
        const have = i.system.quantity ?? 1, unit = Math.floor(Number(i.system.price.value) * ratio), qty = cart[i.id] ?? 0;
        return { id: i.id, img: i.img, name: i.name, cat: catOf(i.type), unit, unitText: fmt(unit), qty, stockText: have > 1 ? `you have ${have}` : "", maxed: qty >= have, can: true, short: 0 };
      });
    }
    const counts = {}; for (const r of rows) counts[r.cat] = (counts[r.cat] ?? 0) + 1;
    const categories = [{ key: "all", label: "All", n: rows.length, on: this.category === "all" }, ...Object.entries(counts).map(([k, n]) => ({ key: k, label: k, n, on: this.category === k }))];
    const shown = rows.filter((r) => this.category === "all" || r.cat === this.category);
    const lines = rows.filter((r) => r.qty > 0).map((r) => ({ ...r, lineText: fmt(r.unit * r.qty) }));
    const total = lines.reduce((n, l) => n + l.unit * l.qty, 0);
    const mine = Object.values(game.settings.get(ID, "shopRequests")).filter((r) => r.shopId === this.shopId && r.userId === game.user.id).slice(-3).reverse().map((r) => ({
      ...r, text: r.lines.map((l) => `${l.qty}x ${l.name}`).join(", "), totalText: fmt(r.total), pending: r.status === "pending", countered: r.status === "countered", approved: r.status === "approved", declined: r.status === "declined",
      agreedText: fmt(r.agreed ?? r.total), haggled: (r.offers ?? []).length > 0, askText: fmt(r.offers?.at(-1)?.amount ?? 0), open: ["pending", "countered"].includes(r.status),
      history: (r.offers ?? []).map((o) => ({ who: o.by === "gm" ? "The GM" : "You", amountText: fmt(o.amount), note: o.note })),
    }));
    const owned = game.actors.filter((a) => a.type === "character" && a.testUserPermission(game.user, "OWNER"));
    return {
      shop, guides: shop.guides ?? [], cur, keeper: shop.keeper ?? { name: "Shopkeeper", img: "icons/svg/mystery-man.svg" }, actorName: actor?.name, purseText: fmt(purse), buying, selling: !buying,
      categories, rows: shown, empty: !shown.length, lines, hasCart: lines.length > 0, totalText: fmt(total), after: fmt(buying ? purse - total : purse + total), overBudget: buying && total > purse,
      requests: mine, hasPending: mine.some((r) => r.open), owned: owned.length > 1 ? owned.map((a) => ({ id: a.id, name: a.name, on: a.id === this.actorId })) : null,
    };
  }

  _onRender() {
    if (this.window?.title) this.window.title.textContent = this.title;   // the same window can switch shops
    this.element.querySelector("select[name=actor]")?.addEventListener("change", (ev) => { this.actorId = ev.target.value; this.cart = { buy: {}, sell: {} }; this.render(); });
  }

  static #view(ev, el) { this.view = el.dataset.view; this.category = "all"; this.render(); }
  static #cat(ev, el) { this.category = el.dataset.cat; this.render(); }
  static #add(ev, el) { const c = this.cart[this.view]; c[el.dataset.id] = (c[el.dataset.id] ?? 0) + 1; this.render(); }
  static #sub(ev, el) { const c = this.cart[this.view]; c[el.dataset.id] = Math.max(0, (c[el.dataset.id] ?? 0) - 1); if (!c[el.dataset.id]) delete c[el.dataset.id]; this.render(); }
  static async #send() {
    const kind = this.view, cart = this.cart[kind];
    const lines = Object.entries(cart).map(([id, qty]) => kind === "buy" ? { key: id, qty } : { itemId: id, qty });
    try { await T().sendRequest(this.shopId, this.actorId, kind, lines); this.cart[kind] = {}; ui.notifications.info("Sent to the GM. You will be told when they answer."); }
    catch (e) { ui.notifications.warn(e.message); }
    this.render();
  }
  static async #sendOffer(ev, el) {
    const kind = this.view, cart = this.cart[kind], amount = this.element.querySelector("input[name=offer]")?.value;
    if (!amount) { ui.notifications.warn("Type the amount you want to offer."); return; }
    const lines = Object.entries(cart).map(([id, qty]) => kind === "buy" ? { key: id, qty } : { itemId: id, qty });
    try { await T().sendRequest(this.shopId, this.actorId, kind, lines, amount); this.cart[kind] = {}; ui.notifications.info("Your offer is with the GM."); }
    catch (e) { ui.notifications.warn(e.message); }
    this.render();
  }
  static async #guide(ev, el) { const page = await fromUuid(el.dataset.uuid); if (page) page.parent.sheet.render(true, { pageId: page.id }); else ui.notifications.warn("That guide is not available."); }
  static async #accept(ev, el) { try { await T().respond(el.dataset.id, "accept"); } catch (e) { ui.notifications.warn(e.message); } this.render(); }
  static async #withdraw(ev, el) { try { await T().respond(el.dataset.id, "withdraw"); } catch (e) { ui.notifications.warn(e.message); } this.render(); }
  static async #counter(ev, el) {
    const row = el.closest(".req"), amount = row.querySelector("input[name=counter]")?.value, note = row.querySelector("input[name=note]")?.value ?? "";
    if (!amount) { ui.notifications.warn("Type your counter-offer."); return; }
    try { await T().respond(el.dataset.id, "counter", amount, note); } catch (e) { ui.notifications.warn(e.message); }
    this.render();
  }
  static async #cancel(ev, el) { try { await T().cancelRequest(el.dataset.id); } catch (e) { ui.notifications.warn(e.message); } this.render(); }
}

/** Trade window: pick a partner, what each side gives (an item and some money); the partner's owner must accept, then the GM approves. A GM trades at once. */
export async function openTradeDialog(actor) {
  const others = game.actors.filter((a) => a.id !== actor.id && a.type !== "vehicle" && (a.hasPlayerOwner || a.type === "npc")).sort((x, y) => x.name.localeCompare(y.name));
  if (!others.length) { ui.notifications.warn("There is nobody to trade with."); return null; }
  const opts = (list) => [...list].filter((i) => i.system.quantity !== undefined).map((i) => `<option value="${i.id}">${i.name} x${i.system.quantity ?? 1}</option>`).join("");
  const seeItems = (a) => (a.testUserPermission(game.user, "OBSERVER") ? a.items : []);
  const content = `<form style="display:grid;gap:8px"><label>Trade with <select name="partner">${others.map((a) => `<option value="${a.id}">${a.name}</option>`).join("")}</select></label>
    <fieldset><legend>You give</legend><select name="giveItem"><option value="">(no item)</option>${opts(actor.items)}</select> <input type="number" name="giveMoney" value="0" min="0"></fieldset>
    <fieldset><legend>You get</legend><select name="getItem"><option value="">(no item)</option></select> <input type="number" name="getMoney" value="0" min="0"></fieldset></form>`;
  const data = await foundry.applications.api.DialogV2.prompt({
    window: { title: `Trade: ${actor.name}` }, content, ok: { label: "Offer trade", callback: (ev, btn) => new foundry.applications.ux.FormDataExtended(btn.form).object },
    render: (ev, dlg) => {
      const f = (dlg.element ?? ev.target.element).querySelector("form");
      const fill = () => { const p = game.actors.get(f.elements.partner.value); f.elements.getItem.innerHTML = `<option value="">(no item)</option>${opts(seeItems(p))}`; };
      f.elements.partner.addEventListener("change", fill); fill();
    },
  });
  if (!data) return null;
  const partner = game.actors.get(data.partner);
  const side = (a, item, money) => ({ actorId: a.id, items: item ? [{ itemId: item, qty: 1 }] : [], money: Number(money) || 0 });
  const mine = side(actor, data.giveItem, data.giveMoney), theirs = side(partner, data.getItem, data.getMoney);
  if (game.user.isGM) return game.shopTrade.trade(mine, theirs, [game.user.id]);
  try { const r = await game.shopTrade.proposeTrade(mine, theirs); ui.notifications.info(r.waitingForPartner ? `Offer sent to ${partner.name}'s owner.` : "Offer sent to the GM."); return r; }
  catch (e) { ui.notifications.warn(e.message); return null; }
}
