import { MODULE_ID } from "./constants.mjs";
import { toGold, selectStock } from "./templates-lib.mjs";
// Shop types. A template set is { label, types, stock? }: `types` maps a type key to { label, keeper, markup, sources? }, and an optional `stock(typeKey)` returns { items, guides } for types that
// are not stocked from a compendium. The module ships the "fantasy" set (stocked from the compendium in the "shopCompendium" setting); other modules add sets with registerTemplateSet.
// `sources` and `stock` for a type: a number is the starting quantity, null is unlimited. include/exclude filter by item name.

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
    sources: [{ types: ["equipment"], subtypes: ["ring", "wand", "rod", "wondrous", "clothing"], exclude: /\bgem\b/i, rarity: ["uncommon", "rare"], maxPrice: 5000, stock: 1 }, { types: ["consumable"], subtypes: ["potion", "scroll"], rarity: ["uncommon", "rare"], maxPrice: 5000, stock: 1 }],   // priced items only: unpriced magic items would swamp the shop, add those by hand from the compendium
  },
};

// Fantasy keys carry a "fantasy_" prefix so they never collide with the keys of a set another module registers; a saved shop's type tells which set it came from.
export const FANTASY_SHOP_TYPES = Object.fromEntries(Object.entries(FANTASY_BASE).map(([k, v]) => [`fantasy_${k}`, v]));

/** The template sets by id: what the "shopTemplateSet" setting and the Start a shop prompt offer. */
export const TEMPLATE_SETS = { fantasy: { label: "Fantasy", types: FANTASY_SHOP_TYPES } };
const SET_CHOICES = { fantasy: "Fantasy" };   // the setting reads this object when its window opens, so a set registered later shows up
export const setChoices = () => SET_CHOICES;

/** Add a template set. Call it from your module's "ready" hook through `game.modules.get("shop-trade").api`. */
export function registerTemplateSet(id, set) {
  if (!id || !set?.label || !set?.types) throw new Error("registerTemplateSet(id, { label, types, stock? })");
  TEMPLATE_SETS[id] = set; SET_CHOICES[id] = set.label;
}
/** The set this world uses by default (the "shopTemplateSet" setting); fantasy if that set is not installed. */
export const defaultSet = () => { const id = game.settings.get(MODULE_ID, "shopTemplateSet"); return id in TEMPLATE_SETS ? id : "fantasy"; };
/** The shop types this world offers by default. */
export const shopTypes = () => TEMPLATE_SETS[defaultSet()].types;
/** Which set a saved type key belongs to; fantasy if no installed set has it. */
export const setOfType = (key) => Object.keys(TEMPLATE_SETS).find((id) => key in TEMPLATE_SETS[id].types) ?? "fantasy";
/** A type by key, from any set (so a shop keeps working if the world's default set changes). */
export const findType = (key) => TEMPLATE_SETS[setOfType(key)].types[key] ?? FANTASY_SHOP_TYPES.fantasy_blank;
/** True for a set's empty shop (a key ending in "blank"). */
export const isBlank = (key) => /(^|_)blank$/.test(key);

/** Stock for a fantasy type: the compendium named in the "shopCompendium" setting, filtered by the type's specs, priced in gold from each item. */
async function compendiumStock(specs) {
  const key = game.settings.get(MODULE_ID, "shopCompendium"), pack = game.packs.get(key);
  if (!pack) { ui.notifications.warn(`Shop compendium "${key}" was not found; set it in the Shop & Trade module settings.`); return []; }
  const index = await pack.getIndex({ fields: ["system.price", "system.rarity", "system.type.value", "type", "img"] });
  const entries = [...index].map((e) => ({ uuid: `Compendium.${key}.Item.${e._id}`, name: e.name, img: e.img, type: e.type, rarity: e.system?.rarity, subtype: e.system?.type?.value, gp: toGold(e.system?.price) }));
  return selectStock(entries, specs).map(({ rarity, subtype, gp, ...e }) => ({ ...e, price: gp }));
}

/** The stock a type starts with: [{uuid,name,img,type,price,stock}] and its guide journals [{label,uuid}]. */
export async function templateStock(typeKey) {
  const set = TEMPLATE_SETS[setOfType(typeKey)], t = findType(typeKey);
  if (set.stock) return set.stock(typeKey);
  return { items: await compendiumStock(t.sources ?? []), guides: [] };
}
