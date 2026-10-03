import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";

// Starting-gear items named in the Chapter 3 origin/role Equipment lines that had no item of their own.
const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};

function loot(id: string, name: string, price: number, wt: number, desc: string): FoundryItem {
  return {
    _id: generateId(`items/gear/${id}`),
    name,
    type: "loot",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      quantity: 1,
      weight: { value: wt, units: "lb" },
      price: { value: price, denomination: "gp" },
      rarity: "common",
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

export const originGear: FoundryItem[] = [
  loot("devil-fruit-encyclopedia", "Devil Fruit Encyclopedia", 250000, 5, "<p>A reference book cataloguing known Devil Fruits.</p>"),
  loot("artwork", "Artwork", 0, 1, "<p>An artwork purchased somewhere (Artist starting equipment).</p>"),
  loot("jewelry-150000", "Jewelry (150,000 Berries)", 150000, 1, "<p>A handful of jewelry worth 150,000 Berries.</p>"),
  loot("area-map", "Map of the Surrounding Area", 0, 0, "<p>A map of the surrounding area within 100 nautical miles.</p>"),
  loot("warm-coat", "Warm Coat", 0, 3, "<p>A warm coat.</p>"),
  loot("lucky-charm", "Lucky Charm", 0, 0, "<p>A lucky charm.</p>"),
];
