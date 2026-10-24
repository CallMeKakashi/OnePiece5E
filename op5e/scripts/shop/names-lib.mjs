// Random shop and owner names (no Foundry): every pick avoids names already used, so the same name never shows up twice.
export const SPECIES = ["Human", "Dwarf", "Elf", "Halfling", "Gnome", "Half-Elf", "Half-Orc"];

const FIRST = {
  Human: ["Aldric", "Brenna", "Cedric", "Dara", "Edmund", "Fenna", "Garrick", "Helga", "Ivo", "Jessa", "Kellan", "Lora", "Marek", "Nessa", "Osric", "Petra", "Quinn", "Rhea", "Soren", "Tilda", "Ulric", "Vera", "Wystan", "Yara"],
  Dwarf: ["Bruni", "Dagna", "Eberk", "Fargrim", "Gunnar", "Hilda", "Ingrid", "Kathra", "Morgran", "Orsik", "Rurik", "Sannl", "Thorin", "Vistra", "Torbera", "Baern"],
  Elf: ["Aelar", "Briel", "Caelynn", "Erevan", "Faelar", "Galinndan", "Ielenia", "Lethanil", "Mialee", "Naivara", "Quelenna", "Sariel", "Thamior", "Vaelis", "Yrilla", "Zephyr"],
  Halfling: ["Alton", "Bree", "Cora", "Eldon", "Finnan", "Garret", "Jillian", "Lidda", "Merric", "Nedda", "Perrin", "Rosie", "Seraphina", "Tuck", "Verna", "Wellby"],
  Gnome: ["Alvyn", "Boddynock", "Dimble", "Ellyjobell", "Fonkin", "Glim", "Jebeddo", "Lilli", "Nissa", "Orla", "Pock", "Roondar", "Sindri", "Tana", "Wrenn", "Zook"],
  "Half-Elf": ["Adran", "Bellis", "Corin", "Darien", "Elowen", "Hale", "Isolde", "Kelvin", "Liora", "Mirren", "Nael", "Rilan", "Sylva", "Taren", "Vesper", "Wren"],
  "Half-Orc": ["Dench", "Emen", "Feng", "Gell", "Henk", "Holg", "Imsh", "Krusk", "Mhurren", "Ront", "Shump", "Thokk", "Baggi", "Engong", "Ovak", "Yevelda"],
};
const LAST = {
  Human: ["Ashford", "Blackwood", "Carrow", "Dunmere", "Everhart", "Fairwind", "Greaves", "Holloway", "Ironside", "Kettleman", "Larkin", "Marsh", "Northcott", "Oakes", "Pembrook", "Rowe", "Stanton", "Thatcher", "Whitlock", "Yarrow"],
  Dwarf: ["Anvilbrow", "Battlehammer", "Coppervein", "Deepdelver", "Forgefist", "Granitebeard", "Ironfoot", "Loadstone", "Orebreaker", "Stonehelm", "Tunnelkeep", "Warbeard"],
  Elf: ["Amakir", "Dawnwhisper", "Evenwood", "Galanodel", "Holimion", "Ilphelkiir", "Moonbrook", "Silverleaf", "Starweaver", "Siannodel", "Thistledown", "Windrider"],
  Halfling: ["Brushgather", "Goodbarrel", "Greenbottle", "Hilltopple", "Leagallow", "Tealeaf", "Thorngage", "Tosscobble", "Underbough", "Applewick", "Dewfoot", "Meadowbrook"],
  Gnome: ["Beren", "Daergel", "Folkor", "Garrick", "Nackle", "Murnig", "Ningel", "Raulnor", "Scheppen", "Timbers", "Turen", "Cogsworth"],
  "Half-Elf": ["Ambershade", "Brightwater", "Duskmantle", "Fenwick", "Hollowell", "Lightfoot", "Marlowe", "Oakenshield", "Quickstep", "Ravenmoor", "Summerfield", "Trueblood"],
  "Half-Orc": ["Bonecrusher", "Dreadmaw", "Gorefang", "Ironjaw", "Skullsplitter", "Stoneclaw", "Tuskborn", "Redhand", "Blackmane", "Hardwick", "Gravelthroat", "Ashtooth"],
};

const ADJ = ["Golden", "Silver", "Crooked", "Gilded", "Rusty", "Laughing", "Sleeping", "Wandering", "Merry", "Broken", "Rowdy", "Prancing", "Hidden", "Lucky", "Weary", "Iron", "Copper", "Scarlet", "Emerald", "Twisted", "Sunken", "Burning", "Bashful", "Hollow"];
// the noun a shop of each type likes to be named after (keys are the type key without its fantasy_ prefix)
const NOUNS = {
  blacksmith: ["Anvil", "Hammer", "Forge", "Bellows", "Tongs", "Shield", "Blade"],
  general: ["Barrel", "Wagon", "Satchel", "Lantern", "Crate", "Market", "Pennant"],
  outfitter: ["Compass", "Backpack", "Bedroll", "Rope", "Trail", "Boot", "Lantern"],
  inn: ["Tankard", "Stag", "Hearth", "Goose", "Griffon", "Lantern", "Flagon", "Boar"],
  apothecary: ["Mortar", "Vial", "Root", "Poppy", "Cauldron", "Leaf", "Remedy"],
  alchemist: ["Flask", "Retort", "Crucible", "Philter", "Alembic", "Phoenix", "Elixir"],
  bookseller: ["Quill", "Folio", "Inkwell", "Scroll", "Tome", "Page", "Raven"],
  stables: ["Mare", "Saddle", "Horseshoe", "Stirrup", "Paddock", "Hound", "Stallion"],
  jeweler: ["Gem", "Pearl", "Diamond", "Crown", "Signet", "Opal", "Locket"],
  arcane: ["Star", "Rune", "Owl", "Orb", "Sigil", "Moon", "Spellbook"],
  _: ["Lantern", "Anchor", "Crown", "Crow", "Door", "Wheel", "Key"],
};
const NOUN_KINDS = { blacksmith: "Smithy", general: "Goods", outfitter: "Outfitters", inn: "Inn", apothecary: "Apothecary", alchemist: "Alchemy", bookseller: "Books", stables: "Stables", jeweler: "Jewels", arcane: "Emporium", _: "Wares" };

const pick = (list, rng) => list[Math.min(list.length - 1, Math.floor(rng() * list.length))];
const kindOf = (typeKey) => { const k = String(typeKey ?? "").replace(/^fantasy_/, ""); return NOUNS[k] ? k : "_"; };
const ROMAN = ["II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** All shop names a type can produce: "The Adj Noun" and "Noun's Kind" style, for the exhaustion check and tests. */
export function shopNameCount(typeKey) { const n = NOUNS[kindOf(typeKey)].length; return ADJ.length * n + n; }

/** A shop name for the type that is not in `used` (compared ignoring case). If every pattern is taken, a numeral is added ("The Golden Anvil II"). */
export function randomShopName(typeKey, used = [], rng = Math.random) {
  const taken = new Set([...used].map((n) => n.toLowerCase())), kind = kindOf(typeKey), nouns = NOUNS[kind];
  const make = () => (rng() < 0.8 ? `The ${pick(ADJ, rng)} ${pick(nouns, rng)}` : `${pick(nouns, rng)} & ${NOUN_KINDS[kind]}`);
  for (let i = 0; i < 60; i++) { const n = make(); if (!taken.has(n.toLowerCase())) return n; }
  const base = make();
  for (const r of ROMAN) if (!taken.has(`${base} ${r}`.toLowerCase())) return `${base} ${r}`;
  return `${base} ${taken.size + 1}`;
}

/** A shopkeeper {name, species} whose name is not in `used`. Species is random; names come from that species' pools. */
export function randomOwner(used = [], rng = Math.random, species = null) {
  const taken = new Set([...used].map((n) => n.toLowerCase())), sp = species ?? pick(SPECIES, rng);
  for (let i = 0; i < 60; i++) { const name = `${pick(FIRST[sp], rng)} ${pick(LAST[sp], rng)}`; if (!taken.has(name.toLowerCase())) return { name, species: sp }; }
  // every first/last pair of this species is taken: move on to another species, then to a numbered name
  const other = SPECIES.find((s) => s !== sp && FIRST[s].some((f) => LAST[s].some((l) => !taken.has(`${f} ${l}`.toLowerCase()))));
  if (other) return randomOwner(used, rng, other);
  return { name: `${pick(FIRST[sp], rng)} ${pick(LAST[sp], rng)} ${taken.size + 1}`, species: sp };
}
