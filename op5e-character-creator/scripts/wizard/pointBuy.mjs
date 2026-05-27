export const POINT_BUY = {
  points: 27,
  min: 8,
  max: 15
};

export function scoreCost(score) {
  if (!Number.isFinite(score)) return Infinity;
  if (score < POINT_BUY.min || score > POINT_BUY.max) return Infinity;
  if (score <= 13) return score - 8;
  if (score === 14) return 7;
  if (score === 15) return 9;
  return Infinity;
}

export function totalCost(abilities) {
  const vals = Object.values(abilities ?? {});
  if (vals.length !== 6) return Infinity;
  return vals.reduce((sum, v) => sum + scoreCost(Number(v)), 0);
}

export function isValidPointBuy(abilities) {
  return totalCost(abilities) === POINT_BUY.points;
}

