import { MODULE_ID } from "../constants.mjs";
// Shop and trade (part of op5e; kept in scripts/shop/ so it could be split out later).
// Flow: the GM shows a shop to chosen players (or all); their client opens the storefront; every purchase or sale is a REQUEST the GM approves;
// money and items move only on the GM's client. The GM panel shows who is looking at a shop right now.
// API: game.shopTrade.{createShop, addItem, show, hide, openGM, open, sendRequest, decide, buy, sell, trade, exportShop, importShop, list}.
import { ShopApp } from "./shop-app.mjs";
import { ShopGMApp } from "./gm-panel.mjs";
import { price, canAfford, pay, receive, wealthIn, currencyLabel, fmt } from "./currency.mjs";

const ID = MODULE_ID, SOCKET = `module.${ID}`;
export const shops = () => foundry.utils.deepClone(game.settings.get(ID, "shops"));
export const requests = () => foundry.utils.deepClone(game.settings.get(ID, "shopRequests"));
const saveShops = (s) => game.settings.set(ID, "shops", s);
const saveRequests = (r) => game.settings.set(ID, "shopRequests", r.slice(-60));
const fail = (m) => { throw new Error(m); };
const pending = new Map();
const viewers = new Map();            // shopId -> Set of user ids looking at it now (kept by the GM client)
export const viewersOf = (shopId) => [...(viewers.get(shopId) ?? [])];
const apps = new Set();               // open storefronts and GM panels on this client, re-rendered when the data changes
export const track = (app) => { apps.add(app); return app; };
export const untrack = (app) => apps.delete(app);
const refresh = () => apps.forEach((a) => a.render());

export const initShop = () => {
  game.settings.register(ID, "shops", { scope: "world", config: false, type: Object, default: {} });
  game.settings.register(ID, "shopRequests", { scope: "world", config: false, type: Array, default: [] });
  game.settings.register(ID, "currencyMode", { name: "SHOPTRADE.CurrencyMode", hint: "SHOPTRADE.CurrencyModeHint", scope: "world", config: true, type: String, default: "coins", choices: { coins: "Coins (dnd5e)", single: "Single currency" } });
  game.settings.register(ID, "singleCurrency", { name: "SHOPTRADE.SingleCurrency", scope: "world", config: true, type: String, default: "gp" });
  game.settings.register(ID, "sellRatio", { name: "SHOPTRADE.SellRatio", scope: "world", config: true, type: Number, default: 50 });
};

const owns = (userId, actor) => { const u = game.users.get(userId); return !!actor && !!u && (u.isGM || actor.testUserPermission(u, "OWNER")); };
export const visibleTo = (shop, user) => user.isGM || shop.openAll || (shop.visibleTo ?? []).includes(user.id);
const shopTotal = (shop, entry, qty) => Math.ceil(price(entry, shop) * qty);
const sellOffer = (item, qty) => Math.floor(Number(item.system.price?.value ?? 0) * qty * (game.settings.get(ID, "sellRatio") / 100));
const receipt = (actor, text) => ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${text}</p>` });

/** The two operations that move things. Only ever run on the GM's client, after approval (or by the GM directly). */
const doBuy = async ({ shopId, actorId, key, qty = 1 }) => {
  const s = shops(), shop = s[shopId] ?? fail("No such shop."), actor = game.actors.get(actorId) ?? fail("No such character.");
  const entry = shop.items.find((i) => i.key === key) ?? fail("No such item in this shop."); qty = Math.max(1, Math.floor(qty));
  if (entry.stock !== null && entry.stock < qty) fail(`${entry.name}: out of stock.`);
  const total = shopTotal(shop, entry, qty);
  if (!canAfford(actor, total)) fail(`${actor.name} cannot afford ${entry.name}.`);
  const src = await fromUuid(entry.uuid); if (!src) fail(`${entry.name} no longer exists.`);
  const data = src.toObject(); delete data._id; if ("quantity" in (data.system ?? {})) data.system.quantity = qty;
  await pay(actor, total);
  const merchant = shop.merchantId && game.actors.get(shop.merchantId); if (merchant) await receive(merchant, total);
  const [made] = await actor.createEmbeddedDocuments("Item", [data]);
  if (entry.stock !== null) { entry.stock -= qty; await saveShops(s); }
  await receipt(actor, `<strong>${actor.name}</strong> buys ${qty}x ${entry.name} from <em>${shop.name}</em> for ${fmt(total)} ${currencyLabel()}.`);
  return { bought: made.name, qty, total };
};
const doSell = async ({ shopId, actorId, itemId, qty = 1 }) => {
  const shop = shops()[shopId] ?? fail("No such shop."), actor = game.actors.get(actorId) ?? fail("No such character.");
  const item = actor.items.get(itemId) ?? fail("No such item."), have = item.system.quantity ?? 1; qty = Math.min(Math.max(1, Math.floor(qty)), have);
  const total = sellOffer(item, qty), merchant = shop.merchantId && game.actors.get(shop.merchantId);
  if (merchant && !canAfford(merchant, total)) fail(`${merchant.name} cannot afford ${item.name}.`);
  if (merchant) await pay(merchant, total);
  if (have > qty) await item.update({ "system.quantity": have - qty }); else await item.delete();
  await receive(actor, total);
  await receipt(actor, `<strong>${actor.name}</strong> sells ${qty}x ${item.name} to <em>${shop.name}</em> for ${fmt(total)} ${currencyLabel()}.`);
  return { sold: item.name, qty, total };
};

const emit = (data) => game.socket.emit(SOCKET, data);
const event = (name, extra = {}) => { emit({ event: name, ...extra }); handleEvent({ event: name, ...extra }); };   // also run it here: the socket does not echo to the sender

const handlers = {
  // direct purchase: the GM acts at once; a player's call becomes a request that waits for approval
  async buy({ shopId, actorId, key, qty = 1, userId }) {
    if (game.users.get(userId)?.isGM) return doBuy({ shopId, actorId, key, qty });
    return handlers.request({ shopId, actorId, kind: "buy", lines: [{ key, qty }], userId });
  },
  async sell({ shopId, actorId, itemId, qty = 1, userId }) {
    if (game.users.get(userId)?.isGM) return doSell({ shopId, actorId, itemId, qty });
    return handlers.request({ shopId, actorId, kind: "sell", lines: [{ itemId, qty }], userId });
  },
  /** A player's cart: validated now (visibility, ownership, stock, funds), executed only when the GM approves. */
  async request({ shopId, actorId, kind, lines, userId }) {
    const user = game.users.get(userId), shop = shops()[shopId] ?? fail("No such shop."), actor = game.actors.get(actorId);
    if (!visibleTo(shop, user)) fail("The GM has not opened this shop to you.");
    if (!owns(userId, actor)) fail("You do not own that character.");
    if (!lines?.length) fail("The cart is empty.");
    const out = []; let total = 0;
    for (const l of lines) {
      const qty = Math.max(1, Math.floor(l.qty ?? 1));
      if (kind === "buy") {
        const e = shop.items.find((i) => i.key === l.key) ?? fail("That item is not in this shop.");
        if (e.stock !== null && e.stock < qty) fail(`${e.name}: only ${e.stock} left.`);
        const t = shopTotal(shop, e, qty); total += t; out.push({ key: e.key, name: e.name, img: e.img, qty, amount: t });
      } else {
        const it = actor.items.get(l.itemId) ?? fail("You no longer have that item.");
        const q = Math.min(qty, it.system.quantity ?? 1), t = sellOffer(it, q); total += t; out.push({ itemId: it.id, name: it.name, img: it.img, qty: q, amount: t });
      }
    }
    if (kind === "buy" && !canAfford(actor, total)) fail(`Not enough ${currencyLabel()} for this cart.`);
    const all = requests(), req = { id: foundry.utils.randomID(), shopId, shopName: shop.name, actorId, actorName: actor.name, userId, userName: user.name, kind, lines: out, total, status: "pending", at: Date.now() };
    all.push(req); await saveRequests(all);
    ChatMessage.create({ whisper: game.users.filter((u) => u.isGM).map((u) => u.id), content: `<p><strong>${actor.name}</strong> asks to ${kind === "buy" ? "buy" : "sell"} ${out.map((l) => `${l.qty}x ${l.name}`).join(", ")} (${fmt(total)} ${currencyLabel()}) at <em>${shop.name}</em>. Open the shop panel to approve.</p>` });
    event("newRequest", { requestId: req.id });
    return { pending: true, id: req.id, total };
  },
  async decide({ id, approve, note = "", userId }) {
    if (!game.users.get(userId)?.isGM) fail("Only the GM can approve purchases.");
    const all = requests(), req = all.find((r) => r.id === id); if (!req || req.status !== "pending") fail("That request is no longer waiting.");
    if (approve) {
      try {
        for (const l of req.lines) await (req.kind === "buy" ? doBuy({ shopId: req.shopId, actorId: req.actorId, key: l.key, qty: l.qty }) : doSell({ shopId: req.shopId, actorId: req.actorId, itemId: l.itemId, qty: l.qty }));
        req.status = "approved";
      } catch (e) { req.status = "declined"; req.note = `Could not complete: ${e.message}`; }
    } else { req.status = "declined"; req.note = note; }
    req.decidedAt = Date.now(); await saveRequests(all);
    event("decided", { requestId: id, userId: req.userId, status: req.status, note: req.note ?? "" });
    return { status: req.status, note: req.note ?? "" };
  },
  async cancel({ id, userId }) {
    const all = requests(), req = all.find((r) => r.id === id);
    if (!req || req.status !== "pending" || (req.userId !== userId && !game.users.get(userId)?.isGM)) fail("Nothing to cancel.");
    req.status = "cancelled"; await saveRequests(all); return { status: "cancelled" };
  },
  async viewing({ shopId, on, userId }) {
    const set = viewers.get(shopId) ?? new Set(); on ? set.add(userId) : set.delete(userId); viewers.set(shopId, set); refresh(); return {};
  },
  /** Atomic trade between two characters (not a shop). Both owners must confirm; the GM may act for both. */
  async trade({ a, b, confirmedBy = [], userId }) {
    const A = game.actors.get(a.actorId), B = game.actors.get(b.actorId);
    if (!A || !B || A === B) fail("Pick two different actors.");
    const isGM = game.users.get(userId)?.isGM;
    for (const [x, side] of [[A, a], [B, b]]) {
      if (!isGM && !confirmedBy.some((u) => owns(u, x))) fail(`${x.name}'s owner has not confirmed.`);
      if ((side.money ?? 0) > 0 && !canAfford(x, side.money)) fail(`${x.name} cannot afford ${side.money}.`);
      for (const it of side.items ?? []) { const doc = x.items.get(it.itemId); if (!doc || (doc.system.quantity ?? 1) < (it.qty ?? 1)) fail(`${x.name} no longer has ${doc?.name ?? "that item"}.`); }
    }
    const move = async (from, to, side) => {
      for (const it of side.items ?? []) {
        const doc = from.items.get(it.itemId), have = doc.system.quantity ?? 1, q = it.qty ?? 1;
        const data = doc.toObject(); delete data._id; if ("quantity" in data.system) data.system.quantity = q;
        await to.createEmbeddedDocuments("Item", [data]);
        if (have > q) await doc.update({ "system.quantity": have - q }); else await doc.delete();
      }
      if ((side.money ?? 0) > 0) { await pay(from, side.money); await receive(to, side.money); }
    };
    await move(A, B, a); await move(B, A, b);
    await ChatMessage.create({ content: `<p>Trade completed between <strong>${A.name}</strong> and <strong>${B.name}</strong>.</p>` });
    return { ok: true };
  },
};

/** Run on the GM's client: directly if we are the GM, otherwise ask the active GM over the socket (ownership and visibility are re-checked there). */
const asGM = (op, args) => game.user.isGM ? handlers[op]({ ...args, userId: game.user.id }) : new Promise((resolve, reject) => {
  const id = foundry.utils.randomID();
  const timer = setTimeout(() => { pending.delete(id); reject(new Error("No GM answered the request.")); }, 10000);
  pending.set(id, { resolve, reject, timer });
  emit({ id, op, args, userId: game.user.id });
});

/** The player's own character: the one assigned to them, else the first they own. */
export const myActors = () => game.actors.filter((a) => a.type === "character" && a.testUserPermission(game.user, "OWNER"));
export const myActor = () => game.user.character ?? myActors()[0];
let storefront = null;
export const openStorefront = (shopId, actorId) => { if (storefront?.rendered) { storefront.shopId = shopId; if (actorId) storefront.actorId = actorId; storefront.render(true); return storefront; } storefront = track(new ShopApp({ shopId, actorId: actorId ?? myActor()?.id })); storefront.render(true); return storefront; };

function handleEvent(msg) {
  const forMe = (ids) => ids === "all" || (Array.isArray(ids) && ids.includes(game.user.id));
  if (msg.event === "open" && !game.user.isGM && forMe(msg.userIds)) openStorefront(msg.shopId);
  else if (msg.event === "close" && !game.user.isGM && forMe(msg.userIds) && storefront?.shopId === msg.shopId) storefront.close();
  else if (msg.event === "decided" && msg.userId === game.user.id) ui.notifications[msg.status === "approved" ? "info" : "warn"](msg.status === "approved" ? "The GM approved your request." : `The GM declined your request${msg.note ? `: ${msg.note}` : "."}`);
  else if (msg.event === "newRequest" && game.user.isGM) ui.notifications.info("A shop request is waiting for your approval.");
  refresh();
}

export const readyShop = () => {
  game.socket.on(SOCKET, async (msg) => {
    if (msg.event) return handleEvent(msg);
    if (msg.reply) { const p = pending.get(msg.id); if (p) { clearTimeout(p.timer); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error)) : p.resolve(msg.result); } return; }
    if (game.users.activeGM?.id !== game.user.id || !handlers[msg.op]) return;   // only the active GM executes
    try { emit({ reply: true, id: msg.id, result: await handlers[msg.op]({ ...msg.args, userId: msg.userId }) }); }
    catch (e) { emit({ reply: true, id: msg.id, error: e.message }); }
  });
  Hooks.on("updateSetting", (s) => { if (s.key === `${ID}.shops` || s.key === `${ID}.shopRequests`) refresh(); });
  Hooks.on("updateActor", (a, ch) => { if (ch.system?.currency) refresh(); });
  Hooks.on("userConnected", (user, connected) => { if (!connected) { for (const set of viewers.values()) set.delete(user.id); refresh(); } });   // a player who left is no longer looking
  Hooks.on("renderActorDirectory", (_app, html) => {
    const root = html instanceof HTMLElement ? html : html[0]; if (!root || root.querySelector(".op5e-shop-button")) return;
    const mine = Object.values(shops()).filter((s) => visibleTo(s, game.user));
    if (!game.user.isGM && !mine.length) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "op5e-shop-button";
    b.innerHTML = game.user.isGM ? '<i class="fa-solid fa-store"></i> Shops' : '<i class="fa-solid fa-store"></i> Shop';
    b.addEventListener("click", () => game.user.isGM ? game.shopTrade.openGM() : openStorefront(mine[0].id));
    (root.querySelector(".directory-header .header-actions") ?? root.querySelector(".header-actions") ?? root.querySelector(".directory-header"))?.prepend(b);
  });
  const gmOnly = () => { if (!game.user.isGM) fail("GM only"); };
  game.shopTrade = {
    /** keeper: {actorId} for an existing actor (its portrait and name are shown, and its wealth pays for what it buys), or {name, img} for a generic shopkeeper. */
    async createShop(name, { markup = 0, merchantId = null, keeper = null } = {}) {
      gmOnly(); const s = shops(), id = foundry.utils.randomID(); const actor = keeper?.actorId ? game.actors.get(keeper.actorId) : null;
      const k = actor ? { actorId: actor.id, name: actor.name, img: actor.img } : { actorId: null, name: keeper?.name || "Shopkeeper", img: keeper?.img || "icons/svg/mystery-man.svg" };
      s[id] = { id, name, markup, merchantId: actor ? actor.id : merchantId, keeper: k, visibleTo: [], openAll: false, items: [] }; await saveShops(s); return id;
    },
    /** The "start a shop" prompt: shop name and who runs it (an existing NPC or a generic shopkeeper). Returns the new shop id, or null if cancelled. */
    async startShopPrompt() {
      gmOnly();
      const npcs = game.actors.filter((a) => a.type === "npc").sort((a, b) => a.name.localeCompare(b.name));
      const content = `<form style="display:grid;gap:8px">
        <label>Shop name <input type="text" name="name" placeholder="Orange Town Armory" autofocus></label>
        <label>Who runs it <select name="actorId"><option value="">Generic shopkeeper (no actor)</option>${npcs.map((a) => `<option value="${a.id}">${a.name}</option>`).join("")}</select></label>
        <label>Generic shopkeeper name <input type="text" name="keeperName" placeholder="Shopkeeper"></label>
        <label>Markup percent <input type="number" name="markup" value="0" step="5"></label></form>`;
      const d = await foundry.applications.api.DialogV2.prompt({ window: { title: "Start a shop" }, content, ok: { label: "Create shop", callback: (ev, btn) => new foundry.applications.ux.FormDataExtended(btn.form).object } });
      if (!d) return null;
      if (!d.name?.trim()) { ui.notifications.warn("Give the shop a name."); return null; }
      return game.shopTrade.createShop(d.name.trim(), { markup: Number(d.markup) || 0, keeper: d.actorId ? { actorId: d.actorId } : { name: d.keeperName?.trim() || "Shopkeeper" } });
    },
    async addItem(shopId, uuidOrItem, { price: p = null, stock = null } = {}) {
      gmOnly(); const doc = typeof uuidOrItem === "string" ? await fromUuid(uuidOrItem) : uuidOrItem; if (!doc) fail("Item not found.");
      const s = shops(), shop = s[shopId] ?? fail("No such shop."); shop.items.push({ key: foundry.utils.randomID(), uuid: doc.uuid, name: doc.name, img: doc.img, type: doc.type, price: p ?? Number(doc.system?.price?.value ?? 0), stock }); await saveShops(s);
    },
    async updateItem(shopId, key, changes) { gmOnly(); const s = shops(), e = s[shopId]?.items.find((i) => i.key === key); if (!e) fail("No such item."); Object.assign(e, changes); await saveShops(s); },
    async removeItem(shopId, key) { gmOnly(); const s = shops(); s[shopId].items = s[shopId].items.filter((i) => i.key !== key); await saveShops(s); },
    /** Show a shop to chosen players ("all" for everyone); their client opens the storefront. */
    async show(shopId, userIds = "all") {
      gmOnly(); const s = shops(), shop = s[shopId] ?? fail("No such shop.");
      if (userIds === "all") { shop.openAll = true; userIds = game.users.filter((u) => !u.isGM).map((u) => u.id); }
      else shop.visibleTo = [...new Set([...(shop.visibleTo ?? []), ...userIds])];
      await saveShops(s); event("open", { shopId, userIds });
    },
    async hide(shopId, userIds = "all") {
      gmOnly(); const s = shops(), shop = s[shopId] ?? fail("No such shop.");
      if (userIds === "all") { shop.openAll = false; shop.visibleTo = []; userIds = "all"; } else shop.visibleTo = (shop.visibleTo ?? []).filter((u) => !userIds.includes(u));
      await saveShops(s); event("close", { shopId, userIds });
    },
    exportShop: (shopId) => JSON.stringify(shops()[shopId], null, 1),
    async importShop(json) { gmOnly(); const d = JSON.parse(json), s = shops(); d.id = foundry.utils.randomID(); d.visibleTo = []; d.openAll = false; s[d.id] = d; await saveShops(s); return d.id; },
    async deleteShop(shopId) { gmOnly(); const s = shops(); delete s[shopId]; await saveShops(s); viewers.delete(shopId); },
    viewers: viewersOf,
    list: () => Object.values(shops()),
    requests: () => requests(),
    buy: (shopId, actorId, key, qty) => asGM("buy", { shopId, actorId, key, qty }),
    sell: (shopId, actorId, itemId, qty) => asGM("sell", { shopId, actorId, itemId, qty }),
    sendRequest: (shopId, actorId, kind, lines) => asGM("request", { shopId, actorId, kind, lines }),
    decide: (id, approve, note) => asGM("decide", { id, approve, note }),
    cancelRequest: (id) => asGM("cancel", { id }),
    reportViewing: (shopId, on) => game.user.isGM ? Promise.resolve() : asGM("viewing", { shopId, on }).catch(() => {}),
    trade: (a, b, confirmedBy) => asGM("trade", { a, b, confirmedBy }),
    wealth: (actor) => wealthIn(actor),
    open: (shopId, actor) => openStorefront(shopId, actor?.id),
    openGM: () => track(new ShopGMApp()).render(true),
  };
};
