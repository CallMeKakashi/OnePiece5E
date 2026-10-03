import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";

const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};
const SRC = { book: "OP5e", page: "", custom: "", license: "" };

/** Priced good/service. Price is raw beri in the "gp" slot (the module redefines gp as Berries, conversion 1). */
export function mkItem(
  ns: string, id: string, name: string, price: number, desc: string,
  opts: { type?: "loot" | "consumable"; subtype?: string; weight?: number } = {},
): FoundryItem {
  const type = opts.type ?? "loot";
  return {
    _id: generateId(`items/${ns}/${id}`),
    name,
    type,
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      quantity: 1,
      weight: { value: opts.weight ?? 0, units: "lb" },
      price: { value: price, denomination: "gp" },
      rarity: "common",
      ...(type === "consumable" ? { type: { value: opts.subtype ?? "food" } } : {}),
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}
