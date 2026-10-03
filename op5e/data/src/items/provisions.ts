import { mkItem } from "./_make.js";

const food = (id: string, name: string, price: number, desc: string) =>
  mkItem("provisions", id, name, price, `<p>${desc}</p>`, { type: "consumable", subtype: "food" });
const svc = (id: string, name: string, price: number, desc: string) =>
  mkItem("provisions", id, name, price, `<p>${desc}</p>`);

const TIERS: [string, number, number][] = [
  // tier, inn per day, meals per day (beri)
  ["Squalid", 350, 150], ["Poor", 1000, 600], ["Modest", 5000, 3000],
  ["Comfortable", 8000, 5000], ["Wealthy", 20000, 8000], ["Aristocratic", 40000, 20000],
];

export const provisions = [
  food("ale-gallon", "Ale (Gallon)", 1000, "A gallon of ale."),
  food("ale-mug", "Ale (Mug)", 40, "A mug of ale."),
  food("banquet", "Banquet (per person)", 100000, "A banquet, priced per person."),
  food("bread", "Bread (Loaf)", 100, "A loaf of bread."),
  food("cheese", "Cheese (Hunk)", 500, "A hunk of cheese."),
  food("meat", "Meat (Chunk)", 1500, "A chunk of meat."),
  food("wine-common", "Wine, Common (Pitcher)", 1000, "A pitcher of common wine."),
  food("wine-fine", "Wine, Fine (Bottle)", 100000, "A bottle of fine wine."),
  ...TIERS.map(([t, inn]) => svc(`inn-${t.toLowerCase()}`, `Inn Stay, ${t} (Per Day)`, inn, `One day of ${t.toLowerCase()} lodging at an inn.`)),
  ...TIERS.map(([t, , meal]) => svc(`meal-${t.toLowerCase()}`, `Meals, ${t} (Per Day)`, meal, `One day of ${t.toLowerCase()} meals.`)),
];
