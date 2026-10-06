import { MODULE_ID } from "../constants.mjs";
// Currency helpers. "coins" mode uses CONFIG.DND5E.currencies (cp/sp/ep/gp/pp conversion ratios, with change making); "single" mode uses one coin only.
const ID = MODULE_ID;
// a world with one currency (for example op5e Berries) always behaves as single-currency
const mode = () => Object.keys(CONFIG.DND5E.currencies).length < 2 ? "single" : game.settings.get(ID, "currencyMode"), single = () => game.settings.get(ID, "singleCurrency");
// value of each coin in the smallest coin; conversion is "coins per gp" (cp 100, sp 10, ep 2, gp 1, pp 0.1)
export const coinValues = (c) => { const most = Math.max(...Object.values(c).map((x) => x.conversion)); return Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round(most / v.conversion)])); };
const unitsPerCoin = () => coinValues(CONFIG.DND5E.currencies);
/** price of a shop entry (in gp, or the single coin) with the shop's markup percent applied */
export const price = (entry, shop) => (entry.price ?? 0) * (1 + (shop.markup ?? 0) / 100);
const totalSmall = (actor) => { const u = unitsPerCoin(), c = actor.system.currency; return Object.entries(u).reduce((n, [k, v]) => n + (c[k] ?? 0) * v, 0); };
export const wealthIn = (actor) => mode() === "single" ? (actor.system.currency[single()] ?? 0) : totalSmall(actor) / unitsPerCoin().gp;
export const canAfford = (actor, amount) => wealthIn(actor) + 1e-9 >= amount;
export const pay = (actor, amount) => mode() === "single"
  ? actor.update({ [`system.currency.${single()}`]: actor.system.currency[single()] - amount })
  : setSmallest(actor, totalSmall(actor) - Math.round(amount * unitsPerCoin().gp));
export const receive = (actor, amount) => mode() === "single"
  ? actor.update({ [`system.currency.${single()}`]: actor.system.currency[single()] + amount })
  : setSmallest(actor, totalSmall(actor) + Math.round(amount * unitsPerCoin().gp));
// redistribute a total (in the smallest coin) greedily from the largest coin; ep is left out of change making
export function makeChange(total, values) {
  const out = {}; let left = total;
  for (const [k, v] of Object.entries(values).filter(([k]) => k !== "ep").sort((a, b) => b[1] - a[1])) { out[k] = Math.floor(left / v); left -= out[k] * v; }
  if ("ep" in values) out.ep = 0;
  return out;
}
const setSmallest = (actor, total) => actor.update(Object.fromEntries(Object.entries(makeChange(total, unitsPerCoin())).map(([k, n]) => [`system.currency.${k}`, n])));
