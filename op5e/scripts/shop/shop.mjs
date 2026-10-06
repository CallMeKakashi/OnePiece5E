import { MODULE_ID } from "../constants.mjs";
// Shop and trade (part of op5e; kept in scripts/shop/ so it could be split out later): shops live in a world setting (never in compendiums); money and items move only on the GM's client.
// API: game.shopTrade.{createShop, addItem, buy, sell, trade, open, exportShop, importShop}.
// Players call the same functions; mutations are relayed to the active GM over the module socket, which checks ownership.
import { ShopApp, openTradeDialog } from "./shop-app.mjs";
import { price, canAfford, pay, receive, wealthIn } from "./currency.mjs";

const ID = MODULE_ID, SOCKET = `module.${ID}`;
const shops = () => foundry.utils.deepClone(game.settings.get(ID, "shops"));
const saveShops = (s) => game.settings.set(ID, "shops", s);
const fail = (m) => { throw new Error(m); };
const pending = new Map();

export const initShop = () => {
  game.settings.register(ID, "shops", { scope: "world", config: false, type: Object, default: {} });
  game.settings.register(ID, "currencyMode", { name: "SHOPTRADE.CurrencyMode", hint: "SHOPTRADE.CurrencyModeHint", scope: "world", config: true, type: String, default: "coins", choices: { coins: "Coins (dnd5e)", single: "Single currency" } });
  game.settings.register(ID, "singleCurrency", { name: "SHOPTRADE.SingleCurrency", scope: "world", config: true, type: String, default: "gp" });
  game.settings.register(ID, "sellRatio", { name: "SHOPTRADE.SellRatio", scope: "world", config: true, type: Number, default: 50 });
};

const unitLabel = () => game.settings.get(ID, "currencyMode") === "single" ? game.settings.get(ID, "singleCurrency") : "gp";
const owns = (userId, actor) => { const u = game.users.get(userId); return !!actor && !!u && (u.isGM || actor.testUserPermission(u, "OWNER")); };

const handlers = {
  async buy({ shopId, actorId, key, qty = 1, userId }) {
    const s = shops(), shop = s[shopId] ?? fail("No such shop."), actor = game.actors.get(actorId);
    if (!shop.open && !game.users.get(userId)?.isGM) fail("The shop is closed.");
    if (!owns(userId, actor)) fail("You do not own that character.");
    const entry = shop.items.find((i) => i.key === key) ?? fail("No such item in this shop."); qty = Math.max(1, Math.floor(qty));
    if (entry.stock !== null && entry.stock < qty) fail("Out of stock.");
    const total = Math.ceil(price(entry, shop) * qty);
    if (!canAfford(actor, total)) fail("Not enough money.");
    const src = await fromUuid(entry.uuid); if (!src) fail("The item no longer exists.");
    const data = src.toObject(); delete data._id; if ("quantity" in (data.system ?? {})) data.system.quantity = qty;
    await pay(actor, total);
    const merchant = shop.merchantId && game.actors.get(shop.merchantId); if (merchant) await receive(merchant, total);
    const [made] = await actor.createEmbeddedDocuments("Item", [data]);
    if (entry.stock !== null) { entry.stock -= qty; await saveShops(s); }
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p><strong>${actor.name}</strong> buys ${qty}x ${entry.name} from <em>${shop.name}</em> for ${total} ${unitLabel()}.</p>` });
    return { bought: made.name, qty, total };
  },
  async sell({ shopId, actorId, itemId, qty = 1, userId }) {
    const shop = shops()[shopId] ?? fail("No such shop."), actor = game.actors.get(actorId);
    if (!owns(userId, actor)) fail("You do not own that character.");
    const item = actor.items.get(itemId) ?? fail("No such item."), have = item.system.quantity ?? 1; qty = Math.min(Math.max(1, Math.floor(qty)), have);
    const total = Math.floor(Number(item.system.price?.value ?? 0) * qty * (game.settings.get(ID, "sellRatio") / 100));
    const merchant = shop.merchantId && game.actors.get(shop.merchantId);
    if (merchant && !canAfford(merchant, total)) fail(`${merchant.name} cannot afford that.`);
    if (merchant) await pay(merchant, total);
    if (have > qty) await item.update({ "system.quantity": have - qty }); else await item.delete();
    await receive(actor, total);
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p><strong>${actor.name}</strong> sells ${qty}x ${item.name} to <em>${shop.name}</em> for ${total} ${unitLabel()}.</p>` });
    return { sold: item.name, qty, total };
  },
  /** Atomic trade. a, b: {actorId, items:[{itemId, qty}], money}. Both sides are validated before anything moves; both owners must have confirmed (the GM may act for both). */
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

/** Run on the GM's client: directly if we are the GM, otherwise ask the active GM over the socket (ownership is re-checked there). */
const asGM = (op, args) => game.user.isGM ? handlers[op]({ ...args, userId: game.user.id }) : new Promise((resolve, reject) => {
  const id = foundry.utils.randomID();
  const timer = setTimeout(() => { pending.delete(id); reject(new Error("No GM answered the request.")); }, 10000);
  pending.set(id, { resolve, reject, timer });
  game.socket.emit(SOCKET, { id, op, args, userId: game.user.id });
});

export const readyShop = () => {
  game.socket.on(SOCKET, async (msg) => {
    if (msg.reply) { const p = pending.get(msg.id); if (p) { clearTimeout(p.timer); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error)) : p.resolve(msg.result); } return; }
    if (game.users.activeGM?.id !== game.user.id || !handlers[msg.op]) return;   // only the active GM executes
    try { game.socket.emit(SOCKET, { reply: true, id: msg.id, result: await handlers[msg.op]({ ...msg.args, userId: msg.userId }) }); }
    catch (e) { game.socket.emit(SOCKET, { reply: true, id: msg.id, error: e.message }); }
  });
  const gmOnly = () => { if (!game.user.isGM) fail("GM only"); };
  game.shopTrade = {
    async createShop(name, { markup = 0, open = true, merchantId = null } = {}) { gmOnly(); const s = shops(), id = foundry.utils.randomID(); s[id] = { id, name, markup, open, merchantId, items: [] }; await saveShops(s); return id; },
    async addItem(shopId, uuidOrItem, { price: p = null, stock = null } = {}) {
      gmOnly(); const doc = typeof uuidOrItem === "string" ? await fromUuid(uuidOrItem) : uuidOrItem; if (!doc) fail("Item not found.");
      const s = shops(), shop = s[shopId] ?? fail("No such shop."); shop.items.push({ key: foundry.utils.randomID(), uuid: doc.uuid, name: doc.name, img: doc.img, price: p ?? Number(doc.system?.price?.value ?? 0), stock }); await saveShops(s);
    },
    async setOpen(shopId, open) { gmOnly(); const s = shops(); s[shopId].open = open; await saveShops(s); },
    exportShop: (shopId) => JSON.stringify(shops()[shopId], null, 1),
    async importShop(json) { gmOnly(); const d = JSON.parse(json), s = shops(); d.id = foundry.utils.randomID(); s[d.id] = d; await saveShops(s); return d.id; },
    list: () => Object.values(shops()),
    buy: (shopId, actorId, key, qty) => asGM("buy", { shopId, actorId, key, qty }),
    sell: (shopId, actorId, itemId, qty) => asGM("sell", { shopId, actorId, itemId, qty }),
    trade: (a, b, confirmedBy) => asGM("trade", { a, b, confirmedBy }),
    wealth: (actor) => wealthIn(actor),
    open: (shopId, actor) => new ShopApp({ shopId, actor }).render(true),
    openTrade: (actor) => openTradeDialog(actor),
  };
};
