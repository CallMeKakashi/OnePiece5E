import { MODULE_ID } from "../constants.mjs";
// Shop types: each stocks a shop from a page of the sourcebook's "Shop Catalogues" journal (op5e.reference), so the GM only adjusts quantities.
// stock: a number is the starting quantity, null is unlimited. include/exclude filter the catalogue page by item name.
const CATALOGUES = "Shop Catalogues", CH4 = "Chapter 4 Equipment and Items";

export const SHOP_TYPES = {
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

/** The stock a type starts with: [{uuid,name,img,type,price,stock}] and its guide journals [{label,uuid}]. */
export async function templateStock(typeKey) {
  const t = SHOP_TYPES[typeKey] ?? SHOP_TYPES.blank, items = [], seen = new Set();
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
