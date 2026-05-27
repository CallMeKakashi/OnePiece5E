import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";

const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};
const SRC = { book: "OP5e", page: "", custom: "", license: "" };

function tool(
  id: string, name: string, toolType: "art" | "game" | "music",
  price: number, weight: number, ability: string,
  opts: { base?: string; desc?: string } = {},
): FoundryItem {
  return {
    _id: generateId(`items/tools/${id}`),
    name,
    type: "tool",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: opts.desc ?? "", chat: "" },
      source: SRC,
      quantity: 1,
      weight: { value: weight, units: "lb" },
      price: { value: price, denomination: "gp" },
      rarity: "common",
      ability,
      chatFlavor: "",
      proficient: 0,
      type: { value: toolType, baseItem: opts.base ?? "" },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

export const tools: FoundryItem[] = [
  // ═══ Artisan's Tools ═══
  tool("alchemists-supplies", "Alchemist's Supplies", "art", 500000, 8, "int",
    { base: "alchemist" }),
  tool("appraisers-tools", "Appraiser's Tools", "art", 500000, 4, "int",
    { desc: "<p>A tool kit consisting of a magnifying glass, reference material, a small hammer, and scales. Useful for establishing the proper value of bounty and loot found on your travels.</p>" }),
  tool("brewers-supplies", "Brewer's Supplies", "art", 200000, 9, "int",
    { base: "brewer" }),
  tool("calligraphers-supplies", "Calligrapher's Supplies", "art", 100000, 5, "int",
    { base: "calligrapher" }),
  tool("carpenters-tools", "Carpenter's Tools", "art", 80000, 6, "int",
    { base: "carpenter" }),
  tool("cartographers-tools", "Cartographer's Tools", "art", 150000, 6, "int",
    { base: "cartographer" }),
  tool("cobblers-tools", "Cobbler's Tools", "art", 50000, 5, "int",
    { base: "cobbler" }),
  tool("cooks-utensils", "Cook's Utensils", "art", 10000, 8, "int",
    { base: "cook" }),
  tool("glassblowers-tools", "Glassblower's Tools", "art", 300000, 5, "int",
    { base: "glassblower" }),
  tool("jewelers-tools", "Jeweler's Tools", "art", 250000, 2, "int",
    { base: "jeweler" }),
  tool("leatherworkers-tools", "Leatherworker's Tools", "art", 50000, 5, "int",
    { base: "leatherworker" }),
  tool("masons-tools", "Mason's Tools", "art", 100000, 8, "int",
    { base: "mason" }),
  tool("painters-supplies", "Painter's Supplies", "art", 100000, 5, "int",
    { base: "painter" }),
  tool("potters-tools", "Potter's Tools", "art", 100000, 3, "int",
    { base: "potter" }),
  tool("smiths-tools", "Smith's Tools", "art", 200000, 8, "int",
    { base: "smith" }),
  tool("tinkers-tools", "Tinker's Tools", "art", 500000, 10, "int",
    { base: "tinker" }),
  tool("weavers-tools", "Weaver's Tools", "art", 10000, 5, "int",
    { base: "weaver" }),
  tool("woodcarvers-tools", "Woodcarver's Tools", "art", 10000, 5, "int",
    { base: "woodcarver" }),

  // ═══ OP5e Custom Artisan's Tools ═══
  tool("dial-kit", "Dial Kit", "art", 500000, 4, "int",
    { desc: "<p>Contains everything a tinkerer needs to repair and prepare dials. With a dial kit, you can repair cracked dials, identify different types of dials and their uses, and repair broken skyborne vehicles.</p>" }),

  // ═══ Kits ═══
  tool("disguise-kit", "Disguise Kit", "art", 250000, 3, "cha",
    { base: "disg" }),
  tool("forgery-kit", "Forgery Kit", "art", 150000, 5, "int",
    { base: "forg" }),
  tool("herbalism-kit", "Herbalism Kit", "art", 50000, 3, "wis",
    { base: "herb" }),
  tool("navigators-tools", "Navigator's Tools", "art", 250000, 2, "wis",
    { base: "navg" }),
  tool("poisoners-kit", "Poisoner's Kit", "art", 500000, 2, "int",
    { base: "pois" }),
  tool("thieves-tools", "Thieves' Tools", "art", 250000, 1, "dex",
    { base: "thief" }),

  // ═══ Gaming Sets ═══
  tool("dice-set", "Dice Set", "game", 500, 0, "int",
    { base: "dice" }),
  tool("chess-set", "Chess Set", "game", 10000, 0.5, "int",
    { base: "chess" }),
  tool("playing-card-set", "Playing Card Set", "game", 2500, 0, "int",
    { base: "card" }),

  // ═══ Musical Instruments ═══
  tool("bagpipes", "Bagpipes", "music", 300000, 6, "cha",
    { base: "bagpipes" }),
  tool("drum", "Drum", "music", 60000, 3, "cha",
    { base: "drum" }),
  tool("dulcimer", "Dulcimer", "music", 250000, 10, "cha",
    { base: "dulcimer" }),
  tool("flute", "Flute", "music", 20000, 1, "cha",
    { base: "flute" }),
  tool("guitar", "Guitar", "music", 350000, 3, "cha"),
  tool("lyre", "Lyre", "music", 300000, 2, "cha",
    { base: "lyre" }),
  tool("horn", "Horn", "music", 30000, 2, "cha",
    { base: "horn" }),
  tool("shamisen", "Shamisen", "music", 200000, 2, "cha"),
  tool("tambourine", "Tambourine", "music", 10000, 0.25, "cha"),
  tool("trumpet", "Trumpet", "music", 100000, 1, "cha"),
  tool("viol", "Viol", "music", 300000, 1, "cha",
    { base: "viol" }),
];

export default tools;
