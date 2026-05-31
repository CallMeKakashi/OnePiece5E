import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";

const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};
const SRC = { book: "OP5e", page: "", custom: "", license: "" };

function armor(
  id: string, name: string, armorType: "light" | "medium" | "heavy" | "shield",
  price: number, ac: number, weight: number,
  opts: { base?: string; str?: number; stealth?: boolean; desc?: string } = {},
): FoundryItem {
  return {
    _id: generateId(`items/armor/${id}`),
    name,
    type: "equipment",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: opts.desc ?? "", chat: "" },
      source: SRC,
      quantity: 1,
      weight: { value: weight, units: "lb" },
      price: { value: price, denomination: "gp" },
      rarity: "common",
      equipped: false,
      identified: true,
      armor: { value: ac },
      strength: opts.str ?? 0,
      stealth: opts.stealth ?? false,
      proficient: null,
      type: { value: armorType, baseItem: opts.base ?? "" },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

export const armorItems: FoundryItem[] = [
  // ═══ Light Armor ═══
  armor("leather", "Leather Armor", "light", 100000, 11, 10,
    { base: "leather" }),

  armor("navy-uniform", "Navy Uniform", "light", 100000, 11, 4,
    { desc: "<p>The navy standard uniform is made from durable cloth capable of surviving the harsh seas, though not directly designed for close-quarters combat.</p>" }),

  armor("studded-leather", "Studded Leather Armor", "light", 450000, 12, 13,
    { base: "studded" }),

  armor("light-longcoat", "Light Longcoat", "light", 500000, 12, 8,
    { desc: "<p>Longcoats primarily made of sturdy cloth and leather, designed for comfort and ease of movement over protection. Favored by marines; each soldier earns a longcoat when they reach ensign rank or higher.</p>" }),

  // ═══ Medium Armor ═══
  armor("hide", "Hide Armor", "medium", 100000, 12, 12,
    { base: "hide" }),

  armor("chain-shirt", "Chain Shirt", "medium", 500000, 13, 20,
    { base: "chainshirt" }),

  armor("scale-mail", "Scale Mail", "medium", 500000, 14, 45,
    { base: "scalemail", stealth: true }),

  armor("heavy-longcoat", "Heavy Longcoat", "medium", 650000, 14, 35,
    { desc: "<p>Made of thick hides or leather interlocked with pieces of metal or boiled leather for extra protection, often accompanied by ammunition belts and knife straps. Popular among pirates for the balance between protection and versatility.</p>" }),

  armor("breastplate", "Breastplate", "medium", 1000000, 15, 40,
    { base: "breastplate", stealth: true }),

  // ═══ Heavy Armor ═══
  armor("chain-mail", "Chain Mail", "heavy", 750000, 16, 55,
    { base: "chainmail", str: 13, stealth: true }),

  armor("splint", "Splint Armor", "heavy", 2000000, 17, 60,
    { base: "splint", str: 15, stealth: true }),

  armor("plate", "Plate Armor", "heavy", 4000000, 18, 65,
    { base: "plate", str: 15, stealth: true }),

  // ═══ Shields ═══
  armor("shield", "Shield", "shield", 100000, 2, 6,
    { base: "shield" }),
];

export default armorItems;
