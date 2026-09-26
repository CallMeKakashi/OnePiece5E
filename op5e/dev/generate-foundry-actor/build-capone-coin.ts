import { writeFileSync } from "node:fs";
import { generateId } from "../../data/helpers/id.js";

const OUT_PATH = "../Foundry/actors-json/capone-family-coin.json";

// Loot item — no activities needed (not activatable), same schema learned
// from every actor build this session (loot type: description/source/
// identified/container/quantity/weight/price/rarity/properties/type).
// The mechanical benefits go in system.description.gmSecret — a real
// dnd5e 5.1 field rendered only on the GM's view of the item sheet, never
// to players. Players only ever see description.value.
const item = {
  _id: generateId("item/capone-family-coin"),
  name: "Capone Family Coin",
  type: "loot",
  img: "icons/commodities/currency/coin-embossed-skull-gold.webp",
  sort: 0,
  flags: {},
  system: {
    description: {
      value:
        "<p>A heavy gold coin, its surface stamped with an ornate crest — the sigil of the Capone family. The metal is warm and slightly worn at the edges, as though it has passed through many hands over many years.</p>",
      chat: "",
      gmSecret:
        "<p><strong>GM-only — do not reveal to players.</strong></p><ul><li><strong>Black Market Value.</strong> Fences and underworld buyers will pay handsomely for a genuine Capone coin — treat it as worth a small fortune in Berries to the right (wrong) buyer, well above its metal value.</li><li><strong>Free Services in West Blue.</strong> Anyone who recognizes the coin's crest in West Blue treats the bearer with immediate respect and will provide services (lodging, passage, information, minor goods) free of charge, no questions asked.</li><li><strong>Marine Blind Eye.</strong> Marines stationed in West Blue — and, less reliably, Marines originally from West Blue serving elsewhere — will look the other way on minor infractions when shown the coin. This does not extend to major crimes or Marines with no West Blue connection.</li></ul>",
    },
    source: { revision: 1, rules: "2024" },
    identifier: "capone-family-coin",
    identified: true,
    unidentified: { description: "" },
    container: null,
    quantity: 1,
    weight: { value: 0.1, units: "lb" },
    price: { value: 500, denomination: "gp" },
    rarity: "legendary",
    properties: [],
    type: { value: "trinket", subtype: "" },
  },
  effects: [],
  folder: null,
  ownership: { default: 0 },
  _stats: {
    compendiumSource: null, duplicateSource: null, exportSource: null,
    coreVersion: "13.350", systemId: "dnd5e", systemVersion: "5.1.10",
    createdTime: null, modifiedTime: null, lastModifiedBy: null,
  },
};

writeFileSync(OUT_PATH, JSON.stringify(item, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH}`);
