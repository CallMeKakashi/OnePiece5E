import type { FoundryItem } from "../../schemas/common.js";

// The book prices no magic or special item. Prices come from its own anchors: the Attack Cuisine potency table (common 100 GP, uncommon 500, rare 5,000, very rare 50,000;
// 1 GP = 10,000 Berries) and the priced dials, snails and special ammo in the shops. Consumables cost half; medkits follow the potion of healing tiers it reflavors.
const GP = 10_000;
const TIER_GP: Record<string, number> = { common: 100, uncommon: 500, rare: 5_000, "very rare": 50_000 };
const MEDKIT_GP: Record<string, number> = { "Small Medkit": 50, "Medkit (Uncommon)": 150, "Medkit (Rare)": 500, "Medkit (Very Rare)": 5_000 };
const AMMO_BERRIES: Record<string, number> = { uncommon: 100_000, rare: 500_000 };   // Flame Dial (Cannon Shot), the priced special ammo, is 100,000
// not sold: legendary relics, templates, fruits and non-canon entries stay "price on request"
const NOT_SOLD = /Template|Non-Canon|Wakened|Ascendant|Exalted|SMILE Fruit|Devil Fruit/i;

export function priceMagicItems(items: FoundryItem[]): FoundryItem[] {
  for (const it of items as unknown as { name: string; type: string; system: { rarity?: string; type?: { value?: string }; price?: { value: number; denomination: string } } }[]) {
    const rarity = it.system.rarity ?? "";
    if (it.type === "loot" || NOT_SOLD.test(it.name) || it.system.price?.value) continue;
    let berries: number | undefined;
    if (it.name in MEDKIT_GP) berries = MEDKIT_GP[it.name] * GP;
    else if (it.type === "consumable" && it.system.type?.value === "ammo") berries = AMMO_BERRIES[rarity];
    else if (TIER_GP[rarity]) berries = TIER_GP[rarity] * GP * (it.type === "consumable" ? 0.5 : 1);
    if (berries) it.system.price = { value: berries, denomination: "gp" };
  }
  return items;
}
