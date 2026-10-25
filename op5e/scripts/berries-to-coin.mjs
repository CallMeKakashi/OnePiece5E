// A Berries price as a dnd5e coin price, for worlds that keep dnd5e coins. The book's rate is 1 GP = 10,000 Berries (1 sp = 1,000, 1 cp = 100).
const COINS = [["gp", 10_000], ["sp", 1_000], ["cp", 100]];

/** {value, denomination}: the largest coin that gives a whole number, never below 1 cp. 0 stays 0. */
export function berriesToCoin(berries) {
  const n = Number(berries) || 0;
  if (n <= 0) return { value: 0, denomination: "gp" };
  for (const [denomination, per] of COINS) if (n % per === 0) return { value: n / per, denomination };
  const cp = Math.max(1, Math.round(n / 100));
  return { value: cp, denomination: "cp" };
}
