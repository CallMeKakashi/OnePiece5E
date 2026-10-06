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
    for (const a of game.actors.filter((x) => x.name.startsWith("[SA]"))) await a.delete();
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
