import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { weapons } from "../items/weapons.js";
import { armorItems } from "../items/armor.js";
import { gear } from "../items/gear.js";
import { tools } from "../items/tools.js";
import { magicItems } from "../items/magic-items.js";
import { shipRooms } from "../items/ship-rooms.js";
import { shipUpgrades } from "../items/ship-upgrades.js";
import { provisions } from "../items/provisions.js";
import { originGear } from "../items/origin-gear.js";
import campaignItems from "../campaign-items/index.js";
import shipWeapons from "../ship-weapons/index.js";

// Shop catalogues: every purchasable item by category, with price in Berries (the module's only currency) and a link to the item.
type Doc = { _id: string; name: string; system?: { price?: { value?: number }; weight?: { value?: number }; rarity?: string } };
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const berries = (n?: number) => (n ? `${Math.round(n).toLocaleString("en-US")} ʙ` : "—");

function table(pack: "items" | "ship-weapons" | "campaign-items", docs: Doc[]): string {
  const rows = [...docs].sort((a, b) => a.name.localeCompare(b.name)).map((d) => {
    const w = d.system?.weight?.value;
    return `<tr><td>@UUID[${compendiumUuid(pack, d._id)}]{${esc(d.name)}}</td><td>${berries(d.system?.price?.value)}</td><td>${w ? `${w} lb` : "—"}</td><td>${d.system?.rarity && d.system.rarity !== "common" ? esc(d.system.rarity) : ""}</td></tr>`;
  });
  return `<table><thead><tr><th>Item</th><th>Price</th><th>Weight</th><th>Rarity</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
}

const all = (a: unknown[]) => a as Doc[];
const CATS: [string, "items" | "ship-weapons" | "campaign-items", Doc[]][] = [
  ["Campaign Items (given out in play)", "campaign-items", all(campaignItems)],
  ["Weapons", "items", all(weapons)],
  ["Armor and Shields", "items", all(armorItems)],
  ["Adventuring Gear", "items", all([...gear, ...originGear])],
  ["Tools and Instruments", "items", all(tools)],
  ["Provisions, Food and Potions", "items", all(provisions)],
  ["Magic and Special Items", "items", all(magicItems)],
  ["Ship Weapons", "ship-weapons", all(shipWeapons)],
  ["Ship Rooms", "items", all(shipRooms)],
  ["Ship Upgrades", "items", all(shipUpgrades)],
];

const pages = CATS.map(([name, pack, docs], i) => ({
  _id: generateId(`reference/shops/${name}`), name, type: "text", sort: (i + 1) * 100, flags: {},
  system: {}, title: { show: true, level: 1 }, image: {}, video: {},
  text: { format: 1, content: `<p>${docs.length} items. Prices are in Berries (ʙ).</p>${table(pack, docs)}` }, ownership: { default: -1 },
}));

export default { _id: generateId("reference/Shop Catalogues"), name: "Shop Catalogues", folder: null, sort: 9000, ownership: { default: 2 }, flags: {}, pages };
