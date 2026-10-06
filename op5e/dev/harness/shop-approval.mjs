// Shop v2 with a GM and two players in the TEST world at the same time (docs/SHOP-SPEC.md): show to one or all, the storefront opens on their client,
// presence, cart -> request -> approve / decline / cancel, funds and stock re-checked on approval, currency name on every price, permissions.
// Creates users "Test Player 1" and "Test Player 2" (no passwords) and scratch documents; removes them afterwards.
import { chromium } from "playwright-core";
import { foundryStatus } from "./drive.mjs";

const BASE = process.env.FOUNDRY_URL ?? "http://localhost:30000";
const st = await foundryStatus();
if (st?.world !== "test") throw new Error(`refusing: active world is "${st?.world}", not "test"`);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const open = async (user) => {
  const page = await (await browser.newContext({ viewport: { width: 1500, height: 950 } })).newPage();
  await page.goto(`${BASE}/join`);
  await page.selectOption("select[name=userid]", { label: user });
  await page.click("button[name=join]");
  await page.waitForFunction(() => globalThis.game?.ready && game.shopTrade, null, { timeout: 120000 });
  await page.evaluate(() => { for (const w of Object.values(ui.windows)) w.close({ force: true }); });
  return page;
};
const out = [];
const ok = (n, p, d = "") => { out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`); console.log(out.at(-1)); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let gm, p1, p2;
try {
  gm = await open("Automation");
  const ids = await gm.evaluate(async () => {
    for (const [name, role] of [["Test Player 1", CONST.USER_ROLES.PLAYER], ["Test Player 2", CONST.USER_ROLES.PLAYER]]) if (!game.users.getName(name)) await User.create({ name, role });
    return { p1: game.users.getName("Test Player 1").id, p2: game.users.getName("Test Player 2").id };
  });
  p1 = await open("Test Player 1"); p2 = await open("Test Player 2");

  const S = await gm.evaluate(async ({ ids }) => {
    for (const a of game.actors.filter((x) => x.name.startsWith("[SA]") || x.name.startsWith("[DEMO]") || ["Baptiste", "Old Man Gen"].includes(x.name))) await a.delete();
    for (const sh of game.shopTrade.list()) await game.shopTrade.deleteShop(sh.id);   // a clean slate: leftovers of a demo or an interrupted run
    await game.settings.set("op5e", "shopRequests", []);
    const tag = { flags: { op5e: { harnessTest: true } } };
    const buyer = await Actor.create({ name: "[SA] Buyer", type: "character", ownership: { default: 0, [ids.p1]: 3 }, system: { currency: { gp: 1000 } }, ...tag });
    const buyer2 = await Actor.create({ name: "[SA] Buyer Two", type: "character", ownership: { default: 0, [ids.p2]: 3 }, system: { currency: { gp: 1000 } }, ...tag });
    const keeper = await Actor.create({ name: "[SA] Keeper", type: "npc", system: { currency: { gp: 500 } }, ...tag });
    const sword = await Item.create({ name: "[SA] Sword", type: "weapon", system: { price: { value: 100, denomination: "gp" } } });
    const potion = await Item.create({ name: "[SA] Potion", type: "consumable", system: { price: { value: 50, denomination: "gp" } } });
    const T = game.shopTrade;
    const generic = await T.createShop("[SA] Sal's Stall", { keeper: { name: "Old Sal" } });
    const named = await T.createShop("[SA] Keeper's Forge", { keeper: { actorId: keeper.id } });
    await T.addItem(generic, sword, { price: 100, stock: 2 }); await T.addItem(generic, potion, { price: 50, stock: null });
    await T.addItem(named, sword, { price: 100, stock: null });
    const shop = T.list().find((s) => s.id === generic), nshop = T.list().find((s) => s.id === named);
    return { buyer: buyer.id, buyer2: buyer2.id, keeper: keeper.id, generic, named, swordKey: shop.items[0].key, potionKey: shop.items[1].key, genericKeeper: shop.keeper, namedKeeper: nshop.keeper, genericMerchant: shop.merchantId, namedMerchant: nshop.merchantId, sword: sword.id, potion: potion.id };
  }, { ids });
  ok("Generic shopkeeper: name only, no wallet", S.genericKeeper.actorId === null && S.genericKeeper.name === "Old Sal" && S.genericMerchant === null, JSON.stringify(S.genericKeeper));
  ok("NPC shopkeeper: actor, portrait and wallet used", S.namedKeeper.actorId === S.keeper && S.namedMerchant === S.keeper, S.namedKeeper.name);

  // not shown yet: nothing for the player
  const early = await p1.evaluate(async (S) => { try { await game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.swordKey, qty: 1 }]); return "sent"; } catch (e) { return e.message; } }, S);
  ok("A shop that has not been shown refuses requests", /not opened/.test(early), early);
  ok("No storefront open yet", !(await p1.locator("#op5e-shop").count()));

  // show to one player
  await gm.evaluate(({ S, ids }) => game.shopTrade.show(S.generic, [ids.p1]), { S, ids });
  await p1.waitForSelector("#op5e-shop .shop-head", { timeout: 15000 });
  ok("Show to one player: storefront opens on that player's client", true);
  ok("The other player's screen stays closed", !(await p2.locator("#op5e-shop").count()));
  const head = await p1.locator("#op5e-shop").innerText();
  ok("Storefront shows the shop, the keeper and the purse in the currency name", /Sal's Stall/.test(head) && /Old Sal/.test(head) && /1,000/.test(head), head.replace(/\s+/g, " ").slice(0, 160));
  const cur = await p1.evaluate(() => game.i18n.localize(CONFIG.DND5E.currencies[game.settings.get("op5e", "singleCurrency")]?.label ?? "gp"));
  ok("Prices carry the currency name", (head.match(new RegExp(cur, "g")) ?? []).length >= 3, `currency "${cur}"`);
  ok("Affordability is stated", /You can afford it/.test(head));
  await wait(800);
  ok("GM sees the player looking", await gm.evaluate(({ S, ids }) => game.shopTrade.viewers(S.generic).includes(ids.p1), { S, ids }));

  // cart -> request, nothing moves
  await p1.click('#op5e-shop button[data-action=add]'); await p1.click('#op5e-shop button[data-action=add]');
  await p1.waitForSelector("#op5e-shop .cart");
  ok("Cart shows the total and the purse afterwards", /Purse after/.test(await p1.locator("#op5e-shop .cart").innerText()));
  await p1.click("#op5e-shop button.send");
  await wait(1500);
  const reqs = await gm.evaluate(() => game.shopTrade.requests());
  ok("Sending creates a pending request and moves nothing", reqs.length === 1 && reqs[0].status === "pending" && reqs[0].total === 200 && await gm.evaluate((S) => game.actors.get(S.buyer).system.currency.gp === 1000 && game.actors.get(S.buyer).items.size === 0, S), JSON.stringify(reqs[0]?.lines));
  ok("The player sees it waiting", /Waiting for the GM/.test(await p1.locator("#op5e-shop").innerText()));
  ok("The GM panel lists it with the purse", await gm.evaluate(async () => { game.shopTrade.openGM(); await new Promise((r) => setTimeout(r, 1500)); return /Waiting for your approval/.test(document.querySelector("#op5e-shop-gm")?.innerText ?? "") && /\[SA\] Sword/.test(document.querySelector("#op5e-shop-gm")?.innerText ?? ""); }));

  // approve
  await gm.evaluate((id) => game.shopTrade.decide(id, true), reqs[0].id); await wait(1500);
  const after = await gm.evaluate((S) => { const a = game.actors.get(S.buyer); return { gp: a.system.currency.gp, items: a.items.map((i) => `${i.name} x${i.system.quantity}`), stock: game.shopTrade.list().find((s) => s.id === S.generic).items[0].stock }; }, S);
  ok("Approve applies it: items, money, stock", after.gp === 800 && after.items.some((i) => /\[SA\] Sword x2/.test(i)) && after.stock === 0, JSON.stringify(after));
  ok("The player is told it was approved", /Approved/.test(await p1.locator("#op5e-shop").innerText()));
  ok("Sold-out items say so", /Sold out/.test(await p1.locator("#op5e-shop").innerText()));

  // too expensive up front
  await gm.evaluate((S) => game.actors.get(S.buyer).update({ "system.currency.gp": 10 }), S);
  const poor = await p1.evaluate(async (S) => { try { await game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }]); return "sent"; } catch (e) { return e.message; } }, S);
  ok("A cart above the purse is refused up front", /Not enough/.test(poor), poor);

  // funds change before approval: declined, nothing half-applied
  await gm.evaluate((S) => game.actors.get(S.buyer).update({ "system.currency.gp": 60 }), S);
  await p1.evaluate((S) => game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }]), S); await wait(800);
  await gm.evaluate((S) => game.actors.get(S.buyer).update({ "system.currency.gp": 5 }), S);
  const pend = (await gm.evaluate(() => game.shopTrade.requests())).find((r) => r.status === "pending");
  const dec = await gm.evaluate((id) => game.shopTrade.decide(id, true), pend.id);
  ok("Approval re-checks funds: declined with a reason, nothing applied", dec.status === "declined" && /cannot afford/.test(dec.note) && await gm.evaluate((S) => game.actors.get(S.buyer).system.currency.gp === 5, S), dec.note);

  // decline and cancel
  await gm.evaluate((S) => game.actors.get(S.buyer).update({ "system.currency.gp": 500 }), S);
  const r3 = await p1.evaluate((S) => game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }]), S);
  const d3 = await gm.evaluate((id) => game.shopTrade.decide(id, false, "Not today"), r3.id);
  ok("Decline keeps everything and carries the reason", d3.status === "declined" && d3.note === "Not today");
  const r4 = await p1.evaluate((S) => game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }]), S);
  await p1.evaluate((id) => game.shopTrade.cancelRequest(id), r4.id); await wait(500);
  ok("A waiting request can be cancelled by its player", (await gm.evaluate(() => game.shopTrade.requests())).find((r) => r.id === r4.id).status === "cancelled");

  // sell
  const sellItem = await gm.evaluate((S) => game.actors.get(S.buyer).items.find((i) => /\[SA\] Sword/.test(i.name)).id, S);
  const r5 = await p1.evaluate(async (a) => game.shopTrade.sendRequest(a.S.generic, a.S.buyer, "sell", [{ itemId: a.sellItem, qty: 1 }]), { S, sellItem });
  await gm.evaluate((id) => game.shopTrade.decide(id, true), r5.id); await wait(800);
  ok("A sale request is approved the same way", await gm.evaluate((S) => game.actors.get(S.buyer).items.find((i) => /\[SA\] Sword/.test(i.name)).system.quantity === 1 && game.actors.get(S.buyer).system.currency.gp === 550, S));

  // permissions
  const perm = await p1.evaluate(async (S) => { const r = {}; for (const [k, f] of [["approve", () => game.shopTrade.decide("x", true)], ["show", () => game.shopTrade.show(S.generic, "all")], ["edit", () => game.shopTrade.updateItem(S.generic, S.potionKey, { price: 1 })]]) { try { await f(); r[k] = "allowed"; } catch (e) { r[k] = "refused"; } } return r; }, S);
  ok("A player cannot approve, show shops or edit them", Object.values(perm).every((v) => v === "refused"), JSON.stringify(perm));
  const other = await p2.evaluate(async (S) => { try { await game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }]); return "sent"; } catch (e) { return e.message; } }, S);
  ok("A player cannot shop with someone else's character or an unshown shop", /not opened|not own/.test(other), other);

  // ---- bargaining
  await gm.evaluate((S) => { game.shopTrade.show(S.generic, "all"); return game.actors.get(S.buyer).update({ "system.currency.gp": 500 }); }, S); await wait(800);
  const gp = () => gm.evaluate((S) => game.actors.get(S.buyer).system.currency.gp, S);
  const status = (id) => gm.evaluate((id) => game.shopTrade.requests().find((r) => r.id === id)?.status, id);
  const lastGp = await gp();
  const b1 = await p1.evaluate((S) => game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }], 30), S);
  ok("A player can open with their own offer", b1.offered === 30 && await status(b1.id) === "pending");
  const wrongTurn = await p1.evaluate((id) => game.shopTrade.respond(id, "accept").then(() => "allowed", (e) => e.message), b1.id);
  ok("The player cannot answer before the GM has", /not your turn/.test(wrongTurn), wrongTurn);
  await gm.evaluate((id) => game.shopTrade.counter(id, 45, "Closer to what it is worth"), b1.id); await wait(600);
  ok("The GM can counter: the request waits for the player", await status(b1.id) === "countered");
  ok("The player sees the GM's price and the Accept and Counter controls", await p1.evaluate(async () => { game.shopTrade.open(game.shopTrade.list()[0].id); await new Promise((r) => setTimeout(r, 1200)); const t = document.querySelector("#op5e-shop")?.innerText ?? ""; return /Accept 45/.test(t) && !!document.querySelector("#op5e-shop input[name=counter]"); }));
  const stranger = await p2.evaluate((id) => game.shopTrade.respond(id, "accept").then(() => "allowed", (e) => e.message), b1.id);
  ok("Another player cannot answer someone else's negotiation", /not your request/.test(stranger), stranger);
  await p1.evaluate((id) => game.shopTrade.respond(id, "counter", 40, "Last offer"), b1.id); await wait(600);
  ok("The player can counter again and it returns to the GM", await status(b1.id) === "pending");
  await gm.evaluate((id) => game.shopTrade.decide(id, true), b1.id); await wait(900);
  ok("Approving a haggled request charges the agreed price, not the list price", await gp() === lastGp - 40, `${lastGp} -> ${await gp()}`);
  const hist = (await gm.evaluate(() => game.shopTrade.requests())).find((r) => r.id === b1.id);
  ok("Every offer is kept in the history", hist.offers.map((o) => `${o.by}:${o.amount}`).join(",") === "player:30,gm:45,player:40", hist.offers.map((o) => `${o.by}:${o.amount}`).join(","));
  ok("The receipt shows both prices", await gm.evaluate(() => game.messages.contents.some((m) => /for 40 .*\(list price 50\)/.test(m.content.replace(/<[^>]+>/g, "")))));
  const b2 = await p1.evaluate((S) => game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }], 20), S);
  await gm.evaluate((id) => game.shopTrade.counter(id, 48), b2.id); await wait(500);
  const before2 = await gp();
  await p1.evaluate((id) => game.shopTrade.respond(id, "accept"), b2.id); await wait(900);
  ok("Accepting the GM's counter closes the deal at that price", await status(b2.id) === "approved" && await gp() === before2 - 48);
  const b3 = await p1.evaluate((S) => game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }], 10), S);
  await p1.evaluate((id) => game.shopTrade.respond(id, "withdraw"), b3.id); await wait(400);
  ok("A player can withdraw while waiting", await status(b3.id) === "cancelled");
  const bad = await p1.evaluate((S) => game.shopTrade.sendRequest(S.generic, S.buyer, "buy", [{ key: S.potionKey, qty: 1 }], 0).then(() => "allowed", (e) => e.message), S);
  ok("An offer must be above zero", /above zero/.test(bad), bad);
  ok("Shares of an agreed amount add up exactly", await gm.evaluate(() => { const a = game.shopTrade.allocate; return [[100, [30, 30, 40]], [101, [1, 1, 1]], [7, [3, 5]], [1, [2, 2]]].every(([n, w]) => a(n, w).reduce((x, y) => x + y, 0) === n); }));
  await p1.evaluate(() => { for (const w of Object.values(ui.windows)) w.close({ force: true }); for (const a of foundry.applications.instances.values()) if (a.id === "op5e-shop") a.close(); });

  // ---- trades between characters: the other owner accepts, then the GM approves
  const tid = await gm.evaluate(async (S) => { const it = await Item.create({ name: "[SA] Trade Gem", type: "loot", system: { price: { value: 10, denomination: "gp" }, quantity: 1 } }, { parent: game.actors.get(S.buyer) }); await game.actors.get(S.buyer).update({ "system.currency.gp": 300 }); await game.actors.get(S.buyer2).update({ "system.currency.gp": 300 }); return it.id; }, S);
  const sideOf = (actorId, itemId, money) => ({ actorId, items: itemId ? [{ itemId, qty: 1 }] : [], money });
  const t1 = await p1.evaluate(async ({ S, tid }) => game.shopTrade.proposeTrade({ actorId: S.buyer, items: [{ itemId: tid, qty: 1 }], money: 0 }, { actorId: S.buyer2, items: [], money: 120 }), { S, tid });
  ok("A trade offer waits for the other character's owner first", t1.waitingForPartner === true && await status(t1.id) === "partner");
  ok("Nothing moves while the offer waits", await gm.evaluate(({ S, tid }) => !!game.actors.get(S.buyer).items.get(tid) && game.actors.get(S.buyer).system.currency.gp === 300, { S, tid }));
  await p2.waitForFunction(() => [...document.querySelectorAll("dialog, .application")].some((e) => /Trade offer/.test(e.innerText)), null, { timeout: 15000 });
  ok("The other owner is shown the offer to accept or decline", true);
  const wrongOwner = await p1.evaluate((id) => game.shopTrade.respondTrade(id, true).then(() => "allowed", (e) => e.message), t1.id);
  ok("The proposer cannot answer for the other side", /not your trade/.test(wrongOwner), wrongOwner);
  await p2.locator("button", { hasText: "Accept" }).first().click(); await wait(900);
  ok("Accepting sends the trade to the GM", await status(t1.id) === "pending");
  ok("Still nothing moved before the GM approves", await gm.evaluate(({ S, tid }) => !!game.actors.get(S.buyer).items.get(tid), { S, tid }));
  await gm.evaluate((id) => game.shopTrade.decide(id, true), t1.id); await wait(1200);
  const after1 = await gm.evaluate(({ S }) => ({ gem1: game.actors.get(S.buyer).items.some((i) => i.name === "[SA] Trade Gem"), gem2: game.actors.get(S.buyer2).items.some((i) => i.name === "[SA] Trade Gem"), gp1: game.actors.get(S.buyer).system.currency.gp, gp2: game.actors.get(S.buyer2).system.currency.gp }), { S });
  ok("The approved trade moves the item and the money both ways", !after1.gem1 && after1.gem2 && after1.gp1 === 420 && after1.gp2 === 180, JSON.stringify(after1));
  const t2 = await p1.evaluate(async ({ S }) => game.shopTrade.proposeTrade({ actorId: S.buyer, items: [], money: 50 }, { actorId: S.buyer2, items: [], money: 0 }), { S });
  await p2.waitForFunction(() => [...document.querySelectorAll("dialog, .application")].some((e) => /Trade offer/.test(e.innerText)), null, { timeout: 15000 });
  await p2.locator("button", { hasText: "Decline" }).first().click(); await wait(900);
  ok("Declining ends the trade and moves nothing", await status(t2.id) === "declined" && await gm.evaluate((S) => game.actors.get(S.buyer).system.currency.gp === 420, S));
  const t3 = await p1.evaluate(async ({ S }) => game.shopTrade.proposeTrade({ actorId: S.buyer, items: [], money: 10 }, { actorId: S.keeper, items: [], money: 0 }), { S });
  ok("A trade with an NPC skips the partner step and goes straight to the GM", t3.waitingForPartner === false && await status(t3.id) === "pending");
  await gm.evaluate((id) => game.shopTrade.decide(id, false, "No"), t3.id);
  const t4 = await p1.evaluate(async ({ S }) => game.shopTrade.proposeTrade({ actorId: S.buyer, items: [], money: 5 }, { actorId: S.buyer2, items: [], money: 0 }), { S });
  await p1.evaluate((id) => game.shopTrade.cancelRequest(id), t4.id); await wait(500);
  ok("The proposer can withdraw an offer while it waits for the other owner", await status(t4.id) === "cancelled");
  await p2.evaluate(() => { for (const a of foundry.applications.instances.values()) if (/dialog/i.test(a.constructor.name)) a.close(); });
  const tooMuch = await p1.evaluate(async ({ S }) => game.shopTrade.proposeTrade({ actorId: S.buyer, items: [], money: 999999 }, { actorId: S.buyer2, items: [], money: 0 }).then(() => "sent", (e) => e.message), { S });
  ok("A trade a character cannot afford is refused up front", /cannot afford/.test(tooMuch), tooMuch);

  // ---- shop types from the sourcebook catalogues
  const T = await gm.evaluate(async () => {
    const t = game.shopTrade, r = {};
    for (const type of ["armory", "shipwright", "general", "provisions", "tools", "apothecary", "curios"]) {
      const id = await t.createShop(`[SA] ${type}`, { type }); const shop = t.list().find((s) => s.id === id);
      r[type] = { n: shop.items.length, names: shop.items.map((i) => i.name), priced: type === "curios" ? shop.items.some((i) => !(i.price > 0)) : shop.items.every((i) => i.price > 0), guides: shop.guides.length, stocks: [...new Set(shop.items.map((i) => i.stock))], id };
    }
    const g = t.list().find((s) => s.id === r.shipwright.id).guides; r.guideOk = (await Promise.all(g.map((x) => fromUuid(x.uuid)))).every(Boolean);
    return r;
  });
  ok("Every shop type stocks items (curios are unpriced: price on request)", Object.entries(T).filter(([k]) => k !== "guideOk").every(([, v]) => v.n > 0 && v.priced), Object.entries(T).filter(([k]) => k !== "guideOk").map(([k, v]) => `${k} ${v.n}`).join(", "));
  ok("The armory sells weapons and armor but no ship cannons", T.armory.names.some((n) => /Breastplate/.test(n)) && T.armory.names.some((n) => /Longsword/.test(n)) && !T.armory.names.some((n) => /pounder/i.test(n)), `${T.armory.n} items`);
  ok("The shipwright sells cannons, rooms and upgrades and has its guides", T.shipwright.names.some((n) => /pounder/.test(n)) && T.shipwright.names.some((n) => /Kitchen/.test(n)) && T.shipwright.names.some((n) => /Adam Wood/.test(n)) && T.shipwright.guides === 2 && T.guideOk, `${T.shipwright.n} items`);
  ok("Stock rules: armory 2, shipwright 1, general store unlimited", T.armory.stocks.join() === "2" && T.shipwright.stocks.join() === "1" && T.general.stocks.join() === "");
  const unpriced = await gm.evaluate((id) => game.shopTrade.list().find((s) => s.id === id).items.find((i) => !(i.price > 0))?.key, T.curios.id);
  await gm.evaluate((id) => game.shopTrade.show(id, "all"), T.curios.id); await wait(800);
  const onReq = await p1.evaluate(async ({ id, key, S }) => { try { await game.shopTrade.sendRequest(id, S.buyer, "buy", [{ key, qty: 1 }]); return "sent"; } catch (e) { return e.message; } }, { id: T.curios.id, key: unpriced, S });
  ok("An unpriced curio cannot be requested until the GM prices it", /no price yet/.test(onReq), onReq);
  await gm.evaluate((id) => game.shopTrade.hide(id), T.curios.id);
  // out of stock on the fly, seen by the player, then restock
  await gm.evaluate((id) => game.shopTrade.show(id, "all"), T.armory.id);
  await p1.waitForSelector("#op5e-shop .shop-head", { timeout: 15000 });
  const key = await gm.evaluate((id) => game.shopTrade.list().find((s) => s.id === id).items[0].key, T.armory.id);
  await gm.evaluate(({ id, key }) => game.shopTrade.updateItem(id, key, { stock: 0 }), { id: T.armory.id, key }); await wait(1000);
  ok("Out of stock shows as Sold out on the player's screen", /Sold out/.test(await p1.locator("#op5e-shop").innerText()));
  await gm.evaluate((id) => game.shopTrade.restock(id), T.armory.id);
  ok("Reset stock puts the template quantity back", await gm.evaluate(({ id, key }) => game.shopTrade.list().find((s) => s.id === id).items.find((i) => i.key === key).stock === 2, { id: T.armory.id, key }));
  await gm.evaluate(async () => { for (const s of game.shopTrade.list().filter((x) => /^\[SA\] (armory|shipwright|general|provisions|tools|apothecary|curios)$/.test(x.name))) { await game.shopTrade.hide(s.id); await game.shopTrade.deleteShop(s.id); } });

  await p1.evaluate(() => { for (const a of foundry.applications.instances.values()) if (a.id === "op5e-shop") a.close(); }); await wait(500);
  await gm.evaluate((S) => game.shopTrade.show(S.generic, "all"), S); await p1.waitForSelector("#op5e-shop .shop-head", { timeout: 15000 });
  // hide and show to all
  await gm.evaluate((S) => game.shopTrade.hide(S.generic, "all"), S); await wait(1200);
  ok("Hide closes the storefront", !(await p1.locator("#op5e-shop").count()));
  ok("Presence clears when the window closes", !(await gm.evaluate(({ S, ids }) => game.shopTrade.viewers(S.generic).includes(ids.p1), { S, ids })));
  await gm.evaluate((S) => game.shopTrade.show(S.named, "all"), S);
  await p1.waitForSelector("#op5e-shop .shop-head", { timeout: 15000 }); await p2.waitForSelector("#op5e-shop .shop-head", { timeout: 15000 });
  ok("Show to everyone opens it for every player at once", true);
  ok("An NPC keeper's name is on the storefront", /\[SA\] Keeper/.test(await p2.locator("#op5e-shop").innerText()));
  await wait(800);
  ok("GM sees both players looking", await gm.evaluate(({ S, ids }) => { const v = game.shopTrade.viewers(S.named); return v.includes(ids.p1) && v.includes(ids.p2); }, { S, ids }));
} finally {
  if (gm) await gm.evaluate(async () => {
    for (const w of Object.values(ui.windows)) w.close({ force: true });
    for (const a of game.actors.filter((x) => x.getFlag("op5e", "harnessTest"))) await a.delete().catch(() => {});
    for (const i of game.items.filter((x) => x.name.startsWith("[SA]"))) await i.delete().catch(() => {});
    await game.settings.set("op5e", "shops", {}); await game.settings.set("op5e", "shopRequests", []);
    await new Promise((r) => setTimeout(r, 2500));
    for (const m of game.messages.filter((x) => /\[SA\]/.test(x.content))) await m.delete().catch(() => {});
  }).catch(() => {});
  await browser.close();
}
const f = out.filter((l) => l.startsWith("FAIL")).length;
console.log(`SHOP APPROVAL: ${out.length - f} pass, ${f} fail`);
process.exit(f ? 1 : 0);
