// Shop money in a world with normal dnd5e coins. This world only has Berries, so the real code runs against a stand-in actor while CONFIG.DND5E.currencies is
// temporarily the stock five coins: wealth, affordability, paying with change making, and receiving. Test world, Automation user, nothing is saved.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const cur = await import("/modules/op5e/scripts/shop/currency.mjs");
  const saved = CONFIG.DND5E.currencies, savedMode = game.settings.get("op5e", "currencyMode");
  CONFIG.DND5E.currencies = { pp: { label: "Platinum", conversion: 0.1 }, gp: { label: "Gold", conversion: 1 }, ep: { label: "Electrum", conversion: 2 }, sp: { label: "Silver", conversion: 10 }, cp: { label: "Copper", conversion: 100 } };
  await game.settings.set("op5e", "currencyMode", "coins");
  const stub = (c) => { const a = { system: { currency: { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0, ...c } }, update: async (u) => { for (const [k, v] of Object.entries(u)) a.system.currency[k.split(".").pop()] = v; } }; return a; };
  try {
    ok("Currency label in coin mode is Gold", cur.currencyLabel() === "Gold", cur.currencyLabel());
    const rich = stub({ gp: 10, sp: 5, cp: 50 });
    ok("Wealth counts every coin in gold (10 gp + 5 sp + 50 cp = 11 gp)", Math.abs(cur.wealthIn(rich) - 11) < 1e-9, `${cur.wealthIn(rich)}`);
    ok("Can afford 11 gp, not 11.1 gp", cur.canAfford(rich, 11) && !cur.canAfford(rich, 11.1));
    const a = stub({ cp: 1000 }); await cur.pay(a, 3);
    ok("Paying 3 gp from 1000 cp leaves 7 gp in change-made coins", Math.abs(cur.wealthIn(a) - 7) < 1e-9 && a.system.currency.gp === 7, JSON.stringify(a.system.currency));
    const b = stub({ gp: 1 }); await cur.receive(b, 12.5);
    ok("Receiving 12.5 gp adds up to 13.5 gp", Math.abs(cur.wealthIn(b) - 13.5) < 1e-9, JSON.stringify(b.system.currency));
    const c = stub({ pp: 1, gp: 0 }); await cur.pay(c, 4);
    ok("Paying 4 gp from 1 platinum breaks the platinum", Math.abs(cur.wealthIn(c) - 6) < 1e-9, JSON.stringify(c.system.currency));
    ok("Prices use whole-number maths (800000 with 10% markup)", cur.price({ price: 800000 }, { markup: 10 }) === 880000);
    // one currency in the config always acts as single-currency
    CONFIG.DND5E.currencies = { gp: { label: "Berries", conversion: 1 } };
    const d = stub({ gp: 500 }); ok("A one-coin world is single-currency (Berries)", cur.currencyLabel() === "Berries" && cur.wealthIn(d) === 500);
    await cur.pay(d, 120); ok("Single currency pays from that coin only", d.system.currency.gp === 380, JSON.stringify(d.system.currency));
  } finally { CONFIG.DND5E.currencies = saved; await game.settings.set("op5e", "currencyMode", savedMode); }
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
