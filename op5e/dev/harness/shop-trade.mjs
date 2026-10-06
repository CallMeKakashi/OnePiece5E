// Shop and Trade module checks (shop-trade/ in the repo root): buy, sell, trade, insufficient funds, out of stock, permissions, both currency modes.
// The module is copied under op5e/assets/dev/shop-trade (git-ignored) so the running test world can import it without a restart. Test world, Automation user.
import { cpSync, rmSync, mkdirSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const DEST = "D:/foundry-pi/Foundry/foundrydata/Data/modules/op5e/assets/dev/shop-trade";
mkdirSync(DEST, { recursive: true }); cpSync("../shop-trade/scripts", DEST, { recursive: true });
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  await import("/modules/op5e/assets/dev/shop-trade/main.mjs");
  await new Promise((r) => setTimeout(r, 500));
  const T = game.shopTrade, mk = (n, gp) => Actor.create({ name: n, type: "character", system: { currency: { gp } } });
  const buyer = await mk("[SH] Buyer", 50), other = await mk("[SH] Other", 5);
  const sword = await Item.create({ name: "[SH] Sword", type: "weapon", system: { price: { value: 15, denomination: "gp" }, quantity: 1 } });
  const shop = await T.createShop("[SH] Armory", { markup: 0 });
  await T.addItem(shop, sword, { price: 15, stock: 2 });
  const key = T.list().find((s) => s.id === shop).items[0].key;
  ok("Wealth reads the currency (this world has one: gp)", T.wealth(buyer) === 50, `${T.wealth(buyer)} gp`);
  const r = await T.buy(shop, buyer.id, key, 1);
  ok("Buy: item added, price deducted", buyer.items.some((i) => i.name === "[SH] Sword") && T.wealth(buyer) === 35 && r.total === 15, `${T.wealth(buyer)} gp left`);
  ok("Buy: stock decreases", T.list().find((s) => s.id === shop).items[0].stock === 1);
  await buyer.update({ "system.currency.gp": 0 });
  let err = ""; try { await T.buy(shop, buyer.id, key, 1); } catch (e) { err = e.message; }
  ok("Insufficient funds refused", /Not enough/.test(err), err);
  await buyer.update({ "system.currency.gp": 100 });
  await T.buy(shop, buyer.id, key, 1);
  err = ""; try { await T.buy(shop, buyer.id, key, 1); } catch (e) { err = e.message; }
  ok("Out of stock refused", /Out of stock/.test(err), err);
  await buyer.update({ "system.currency.gp": 10 });
  await T.addItem(shop, sword, { price: 3, stock: null }); const cheap = T.list().find((s) => s.id === shop).items[1].key;
  await T.buy(shop, buyer.id, cheap, 1);
  ok("Unlimited stock item: price deducted", T.wealth(buyer) === 7, `${T.wealth(buyer)}`);
  // sell at 50%
  const own = buyer.items.find((i) => i.name === "[SH] Sword"); const w0 = T.wealth(buyer);
  const sold = await T.sell(shop, buyer.id, own.id, 1);
  ok("Sell: pays the sell ratio of the item price", sold.total === 7 && Math.abs(T.wealth(buyer) - w0 - 7) < 1e-9, `got ${sold.total}`);
  // trade
  const gift = buyer.items.find((i) => i.name === "[SH] Sword");
  await buyer.update({ "system.currency.gp": 20 });
  err = ""; try { await T.trade({ actorId: buyer.id, items: [{ itemId: gift.id, qty: 1 }], money: 30 }, { actorId: other.id, items: [], money: 0 }, []); } catch (e) { err = e.message; }
  ok("Trade: refused without both confirmations or with too little money", err.length > 0, err);
  ok("Trade: refusal left everything untouched (atomic)", T.wealth(buyer) === 20 && !!buyer.items.get(gift.id) && other.items.size === 0);
  await T.trade({ actorId: buyer.id, items: [{ itemId: gift.id, qty: 1 }], money: 10 }, { actorId: other.id, items: [], money: 2 }, [game.user.id]);
  ok("Trade: items and money swap", other.items.some((i) => i.name === "[SH] Sword") && !buyer.items.get(gift.id) && T.wealth(buyer) === 12 && T.wealth(other) === 13, `${T.wealth(buyer)} / ${T.wealth(other)}`);
  // permissions: a player cannot edit shops
  const asPlayer = await (async () => { const real = Object.getOwnPropertyDescriptor(User.prototype, "isGM"); Object.defineProperty(game.user, "isGM", { get: () => false, configurable: true }); try { await T.createShop("x"); return "allowed"; } catch (e) { return "refused"; } finally { delete game.user.isGM; } })();
  ok("Permissions: only the GM edits shops", asPlayer === "refused", asPlayer);
  // export / import
  const copy = await T.importShop(T.exportShop(shop)); ok("Export and import a shop", T.list().find((s) => s.id === copy)?.items.length === 2);
  for (const a of [buyer, other]) await a.delete(); await sword.delete();
  await game.settings.set("dnd5e-shop-trade", "shops", {});
  for (const m of game.messages.filter((x) => /\[SH\]|Trade completed/.test(x.content))) await m.delete().catch(() => {});
  return out;
};
try { await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } }); }
finally { rmSync(DEST, { recursive: true, force: true }); }
