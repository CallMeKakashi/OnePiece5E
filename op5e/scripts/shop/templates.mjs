import { MODULE_ID } from "../constants.mjs";
import { toGold, selectStock } from "./templates-lib.mjs";
// Shop types: each stocks a shop from a page of the sourcebook's "Shop Catalogues" journal (op5e.reference), so the GM only adjusts quantities.
// stock: a number is the starting quantity, null is unlimited. include/exclude filter the catalogue page by item name.
// Two template sets: "onepiece" (the types below, Berries) and "fantasy" (FANTASY_SHOP_TYPES, gold, stocked from a compendium: the "shopCompendium" setting). The world picks one with the "shopTemplateSet" setting.
const CATALOGUES = "Shop Catalogues", CH4 = "Chapter 4 Equipment and Items";

export const ONE_PIECE_SHOP_TYPES = {
  blank: { label: "Blank shop", keeper: "Shopkeeper", markup: 0, pages: [] },
  armory: { label: "Armory", keeper: "Armorer", markup: 10, pages: [{ page: "Weapons", exclude: /pounder/i, stock: 2 }, { page: "Armor and Shields", stock: 2 }] },
  shipwright: {
    label: "Shipwright company", keeper: "Master Shipwright", markup: 15,
    pages: [{ page: "Ship Weapons", stock: 1 }, { page: "Ship Rooms", stock: 1 }, { page: "Ship Upgrades", stock: 1 }],
    guides: [{ label: "Upgrading your ship", journal: CH4, page: "Ship Building and Repair / Upgrading your Ship" }, { label: "Building and repairing a ship", journal: CH4, page: "Ship Building and Repair" }],
  },
  general: { label: "General store", keeper: "Storekeeper", markup: 0, pages: [{ page: "Adventuring Gear", stock: null }] },
  provisions: { label: "Provisions and tavern", keeper: "Innkeeper", markup: 0, pages: [{ page: "Provisions, Food and Potions", stock: null }] },
  tools: { label: "Tool merchant", keeper: "Tool seller", markup: 0, pages: [{ page: "Tools and Instruments", stock: 2 }] },
  apothecary: {
    label: "Apothecary", keeper: "Apothecary", markup: 10,
    pages: [{ page: "Adventuring Gear", include: /medkit|antitoxin|healer|herbalism|poison|acid|alchemist|bandage|salve|tonic|vial/i, stock: 5 }, { page: "Provisions, Food and Potions", include: /potion|tonic|remedy|elixir/i, stock: 5 }],
  },
  curios: { label: "Curio and black market", keeper: "Fence", markup: 25, pages: [{ page: "Magic and Special Items", stock: 1, allowUnpriced: true }] },   // the book gives these no price: they show "price on request" until the GM sets one
};
export const SHOP_TYPES = ONE_PIECE_SHOP_TYPES;   // kept for macros and other code that imported the original name

// Fantasy set: each type lists `sources` (specs, see templates-lib.mjs) that pick items from the compendium in the "shopCompendium" setting. Prices come from the items themselves, converted to gold.
const MUNDANE = ["none", "common"];
const FANTASY_BASE = {
  blank: { label: "Blank shop", keeper: "Shopkeeper", markup: 0, sources: [] },
  blacksmith: {
    label: "Blacksmith and armory", keeper: "Smith", markup: 10,
    sources: [{ types: ["weapon"], rarity: MUNDANE, maxPrice: 600, stock: 2 }, { types: ["equipment"], subtypes: ["light", "medium", "heavy", "shield"], rarity: MUNDANE, maxPrice: 2000, stock: 1 }],
  },
  general: {
    label: "General store", keeper: "Storekeeper", markup: 0,
    sources: [{ types: ["loot"], subtypes: ["gear"], rarity: MUNDANE, maxPrice: 100, stock: null }, { types: ["container"], rarity: MUNDANE, maxPrice: 100, stock: null }, { types: ["consumable"], subtypes: ["ammo"], rarity: MUNDANE, stock: null }],   // gear only: gems and art objects belong to the jeweler
  },
  outfitter: {
    label: "Adventurers' outfitter", keeper: "Outfitter", markup: 5,
    sources: [{ types: ["loot", "container", "tool", "equipment"], exclude: /mail|shirt|breastplate|plate/i, include: /pack|rope|torch|lantern|lamp|bedroll|tent|ration|crowbar|grappling|piton|hammer|waterskin|climber|healer's kit|backpack|oil|tinderbox|mess kit|blanket|chain|ladder|pole|shovel|sack|manacles|signal|whistle/i, rarity: MUNDANE, maxPrice: 100, stock: null }],
  },
  inn: {
    label: "Inn and tavern", keeper: "Innkeeper", markup: 0,
    sources: [{ types: ["consumable", "loot"], include: /\bale\b|ration|wine|\bmeat\b|bread|cheese|meal|lodging|brandy|mead|stew|cider|food|drink|spirits|feed/i, rarity: MUNDANE, maxPrice: 50, stock: null }],
  },
  apothecary: {
    label: "Apothecary", keeper: "Apothecary", markup: 10,
    sources: [{ types: ["consumable", "loot", "tool"], include: /antitoxin|healer|herbalism|poison|acid|vial|salve|tonic|bandage|potion of healing|remedy|elixir/i, rarity: ["none", "common", "uncommon"], maxPrice: 500, stock: 5 }],
  },
  alchemist: {
    label: "Alchemist", keeper: "Alchemist", markup: 15,
    sources: [{ types: ["consumable", "loot", "tool"], include: /alchemist|acid|oil|perfume|soap|flask|antitoxin|smokestick|tindertwig|caltrop|ball bearing|holy water/i, rarity: MUNDANE, maxPrice: 300, stock: 5 }],
  },
  bookseller: {
    label: "Bookseller and scribe", keeper: "Scribe", markup: 5,
    sources: [{ types: ["loot", "consumable", "tool", "container"], include: /book|scroll case|ink|parchment|paper|quill|map|sealing wax|calligrapher|forg(er|ery)|case, map/i, rarity: MUNDANE, maxPrice: 100, stock: 5 }],
  },
  stables: {
    label: "Stables and carriages", keeper: "Stablehand", markup: 0,
    sources: [{ types: ["loot", "equipment", "container", "tool"], include: /saddle|bridle|harness|\bhorses?\b|\bpon(y|ies)\b|\bmules?\b|\bcamels?\b|\bdonkeys?\b|feed|barding|\bcarts?\b|wagon|carriage|sled|stabling|yoke|fodder/i, rarity: MUNDANE, maxPrice: 1000, stock: 2 }],
  },
  jeweler: {
    label: "Jeweler and gem dealer", keeper: "Jeweler", markup: 20,
    sources: [{ types: ["loot", "equipment"], include: /\bgems?\b|pearl|jewel|\brings?\b|amulet|brooch|necklace|circlet|\bopal|\bruby|diamond|emerald|sapphire|agate|jasper|topaz|garnet|moonstone|onyx|\bjet\b|coral|quartz|amber|crystal|signet|perfume/i, rarity: MUNDANE, maxPrice: 5000, stock: 3 }],
  },
  arcane: {
    label: "Arcane emporium", keeper: "Mage", markup: 25,
    sources: [{ types: ["equipment", "consumable"], exclude: /adamantine|mithral|silvered/i, rarity: ["uncommon", "rare"], maxPrice: 5000, stock: 1 }],   // priced items only: unpriced magic items would swamp the shop, add those by hand from the compendium
  },
};

// Fantasy keys carry a "fantasy_" prefix so they never collide with the One Piece keys (both sets have a "general" and an "apothecary"); a saved shop's type tells which set it came from.
export const FANTASY_SHOP_TYPES = Object.fromEntries(Object.entries(FANTASY_BASE).map(([k, v]) => [`fantasy_${k}`, v]));

/** The two template sets, by the key the "shopTemplateSet" setting and the Start a shop prompt use. */
export const TEMPLATE_SETS = { onepiece: { label: "One Piece", types: ONE_PIECE_SHOP_TYPES }, fantasy: { label: "Fantasy", types: FANTASY_SHOP_TYPES } };
/** The set this world uses by default (the "shopTemplateSet" setting). */
export const defaultSet = () => (game.settings.get(MODULE_ID, "shopTemplateSet") === "fantasy" ? "fantasy" : "onepiece");
/** The shop types this world offers by default. */
export const shopTypes = () => TEMPLATE_SETS[defaultSet()].types;
/** A type by key, from either set (so a shop keeps working if the world's default set changes). */
export const findType = (key) => ONE_PIECE_SHOP_TYPES[key] ?? FANTASY_SHOP_TYPES[key] ?? ONE_PIECE_SHOP_TYPES.blank;
/** Which set a saved type key belongs to ("fantasy" or "onepiece"). */
export const setOfType = (key) => (key in FANTASY_SHOP_TYPES ? "fantasy" : "onepiece");
/** True for either set's empty shop. */
export const isBlank = (key) => key === "blank" || key === "fantasy_blank";

const refPack = () => game.packs.get(`${MODULE_ID}.reference`);
const indexes = new Map();
const packIndex = async (key) => { if (!indexes.has(key)) indexes.set(key, (await game.packs.get(key).getIndex({ fields: ["system.price.value", "type", "img"] }))); return indexes.get(key); };

async function journalDoc(name) { const p = refPack(), e = (await p.getIndex()).find((x) => x.name === name); return e ? p.getDocument(e._id) : null; }

/** Items listed on one catalogue page, with the price the item itself carries; unpriced entries are left out unless allowed (price 0 = on request). */
export async function catalogueItems(pageName, allowUnpriced = false) {
  const doc = await journalDoc(CATALOGUES), page = doc?.pages.find((p) => p.name === pageName);
  const out = [];
  for (const m of (page?.text?.content ?? "").matchAll(/@UUID\[Compendium\.([^.\]]+\.[^.\]]+)\.(?:Item\.)?([^\]]+)\]\{([^}]+)\}/g)) {
    const [, packKey, id, name] = m, e = (await packIndex(packKey)).get(id); if (!e) continue;
    const price = Number(e.system?.price?.value ?? 0); if (!(price > 0) && !allowUnpriced) continue;
    out.push({ uuid: `Compendium.${packKey}.Item.${id}`, name: e.name ?? name, img: e.img, type: e.type, price });
  }
  return out;
}

/** Stock for a fantasy type: the compendium named in the "shopCompendium" setting, filtered by the type's specs, priced in gold from each item. */
async function compendiumStock(specs) {
  const key = game.settings.get(MODULE_ID, "shopCompendium"), pack = game.packs.get(key);
  if (!pack) { ui.notifications.warn(`Shop compendium "${key}" was not found; set it in the op5e module settings.`); return []; }
  const index = await pack.getIndex({ fields: ["system.price", "system.rarity", "system.type.value", "type", "img"] });
  const entries = [...index].map((e) => ({ uuid: `Compendium.${key}.Item.${e._id}`, name: e.name, img: e.img, type: e.type, rarity: e.system?.rarity, subtype: e.system?.type?.value, gp: toGold(e.system?.price) }));
  return selectStock(entries, specs).map(({ rarity, subtype, gp, ...e }) => ({ ...e, price: gp }));
}

/** The stock a type starts with: [{uuid,name,img,type,price,stock}] and its guide journals [{label,uuid}]. */
export async function templateStock(typeKey) {
  const t = findType(typeKey), items = [], seen = new Set();
  if (t.sources) return { items: await compendiumStock(t.sources), guides: [] };
  for (const spec of t.pages) for (const i of await catalogueItems(spec.page, spec.allowUnpriced)) {
    if ((spec.exclude && spec.exclude.test(i.name)) || (spec.include && !spec.include.test(i.name)) || seen.has(i.uuid)) continue;
    seen.add(i.uuid); items.push({ ...i, stock: spec.stock });
  }
  const guides = [];
  for (const g of t.guides ?? []) {
    const doc = await journalDoc(g.journal), page = doc?.pages.find((p) => p.name === g.page);
    if (page) guides.push({ label: g.label, uuid: `Compendium.${MODULE_ID}.reference.JournalEntry.${doc.id}.JournalEntryPage.${page.id}` });
  }
  return { items, guides };
}
