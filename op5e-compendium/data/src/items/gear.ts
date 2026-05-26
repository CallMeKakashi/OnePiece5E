import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";

const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};
const SRC = { book: "OP5e", page: "", custom: "", license: "" };

function loot(id: string, name: string, price: number, wt: number, desc = ""): FoundryItem {
  return {
    _id: generateId(`items/gear/${id}`),
    name,
    type: "loot",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
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

function ammo(id: string, name: string, price: number, wt: number, desc = ""): FoundryItem {
  return {
    _id: generateId(`items/gear/${id}`),
    name,
    type: "consumable",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      quantity: 1,
      weight: { value: wt, units: "lb" },
      price: { value: price, denomination: "gp" },
      rarity: "common",
      type: { value: "ammo" },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

function consumable(
  id: string, name: string, price: number, wt: number,
  subtype: string, desc = "",
  uses?: { value: number; max: string; per: string },
): FoundryItem {
  return {
    _id: generateId(`items/gear/${id}`),
    name,
    type: "consumable",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      quantity: 1,
      weight: { value: wt, units: "lb" },
      price: { value: price, denomination: "gp" },
      rarity: "common",
      type: { value: subtype },
      ...(uses ? { uses: { ...uses, recovery: "" } } : {}),
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

function equipment(id: string, name: string, price: number, wt: number, desc = ""): FoundryItem {
  return {
    _id: generateId(`items/gear/${id}`),
    name,
    type: "equipment",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      quantity: 1,
      weight: { value: wt, units: "lb" },
      price: { value: price, denomination: "gp" },
      rarity: "common",
      type: { value: "trinket" },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

export const gear: FoundryItem[] = [
  // ═══════════════════════════════════════════
  //  Ammunition
  // ═══════════════════════════════════════════
  ammo("arrows-20", "Arrows (20)", 10000, 1),
  ammo("blowgun-needles-50", "Blowgun Needles (50)", 10000, 1),
  ammo("crossbow-bolts-20", "Crossbow Bolts (20)", 10000, 1.5),
  ammo("firearms-bullets-20", "Firearms Bullets (20)", 25000, 1.5,
    "<p>Iron or lead balls used as ammunition in pistols, flintlocks, muskets, rifles, shotguns, and revolvers.</p>"),
  ammo("sling-bullets-20", "Sling Bullets (20)", 200, 1.5),

  // ═══════════════════════════════════════════
  //  Apparatus (Gadgeteer Focus)
  // ═══════════════════════════════════════════
  equipment("bag-of-inventions", "Bag of Inventions", 100000, 12,
    "<p>An apparatus that allows gadgeteers to create fantastic effects. Functions as a creation focus.</p>"),
  equipment("dial-set", "Dial Set", 500000, 7,
    "<p>A set of dials from the sky islands that serves as an apparatus for gadgeteers to create fantastic effects.</p>"),
  equipment("experimental-device", "Experimental Device", 150000, 3,
    "<p>An experimental rod with sprockets and gyri attached. Functions as a gadgeteer apparatus for creating fantastic effects.</p>"),

  // ═══════════════════════════════════════════
  //  Adventuring Gear
  // ═══════════════════════════════════════════
  loot("abacus", "Abacus", 20000, 2),
  consumable("acid-vial", "Acid (vial)", 250000, 1, "trinket"),
  consumable("antitoxin-vial", "Antitoxin (vial)", 500000, 0, "trinket"),
  loot("backpack", "Backpack", 20000, 5),
  loot("ball-bearings", "Ball Bearings (bag of 1,000)", 10000, 2),
  loot("barrel", "Barrel", 20000, 70),
  loot("basket-woven", "Basket, Woven", 2000, 2),
  loot("bedroll", "Bedroll", 10000, 7),
  loot("bell", "Bell", 10000, 0),
  loot("blanket", "Blanket", 2500, 3),
  loot("block-and-tackle", "Block and Tackle", 10000, 5),
  loot("book", "Book", 250000, 5),
  loot("bottle-glass", "Bottle, Glass", 20000, 2),
  loot("bucket", "Bucket", 250, 2),
  loot("caltrops", "Caltrops (bag of 20)", 10000, 2),
  consumable("candle", "Candle", 5, 0, "trinket"),
  loot("case-quiver", "Case or Quiver, Ammunition", 10000, 1),
  loot("chain-10ft", "Chain (10 feet)", 50000, 10),
  loot("chalk", "Chalk", 5, 0),
  loot("chest-with-lock", "Chest, with Lock", 50000, 25),
  loot("climbers-kit", "Climber's Kit", 250000, 12),
  loot("clothes-common", "Clothes, Common", 2500, 3),
  loot("clothes-costume", "Clothes, Costume", 50000, 4),
  loot("clothes-fine", "Clothes, Fine", 150000, 6),
  loot("crowbar", "Crowbar", 20000, 5),
  loot("fishing-tackle", "Fishing Tackle", 10000, 4),
  loot("flask-tankard", "Flask or Tankard", 100, 1),
  loot("grappling-hook", "Grappling Hook", 20000, 4),
  loot("hammer", "Hammer", 10000, 3),
  loot("hammer-sledge", "Hammer, Sledge", 20000, 10),
  consumable("healers-kit", "Healer's Kit", 50000, 3, "trinket", "",
    { value: 10, max: "10", per: "charges" }),
  loot("hourglass", "Hourglass", 250000, 1),
  loot("hunting-trap", "Hunting Trap", 50000, 25),
  loot("ink", "Ink (1 ounce bottle)", 100000, 0),
  loot("ink-pen", "Ink Pen", 10, 0),
  loot("jug-pitcher", "Jug or Pitcher", 100, 4),
  loot("ladder-10ft", "Ladder (10-foot)", 500, 25),
  loot("lamp", "Lamp", 2500, 1),
  loot("lantern", "Lantern", 50000, 2),
  loot("log-pose", "Log Pose", 1000000, 0,
    "<p>In the Grand Line, compasses do not work because of the strong magnetic fields surrounding each island. A log pose is required to make navigation rolls at all while in the Grand Line; otherwise, you're sailing blindly.</p>"),
  loot("lock", "Lock", 100000, 1),
  loot("mess-kit", "Mess Kit", 1000, 1),
  loot("mirror-steel", "Mirror, Steel", 50000, 0.5),
  consumable("oil-flask", "Oil (flask)", 500, 1, "trinket"),
  loot("paper", "Paper (one sheet)", 1000, 0),
  loot("parchment", "Parchment (one sheet)", 500, 0),
  loot("perfume-vial", "Perfume (vial)", 50000, 0),
  loot("pick-miners", "Pick, Miner's", 20000, 10),
  loot("piton", "Piton", 25, 0.25),
  loot("pole-10ft", "Pole (10-foot)", 250, 7),
  loot("pot-iron", "Pot, Iron", 20000, 10),
  loot("pouch", "Pouch", 2500, 1),
  loot("preservation-box", "Preservation Box", 1000000, 35,
    "<p>A massive iron box filled with ice or other coolants, tightly insulated from the elements. Keeps fresh produce or medicine from spoiling on long trips, allowing crews to enjoy better and healthier food and medical treatment.</p>"),
  loot("ram-portable", "Ram, Portable", 40000, 35),
  consumable("rations", "Rations (1 day)", 500, 2, "food"),
  loot("rope-hempen", "Rope, Hempen (50 feet)", 10000, 10),
  loot("rope-silken", "Rope, Silken (50 feet)", 100000, 5),
  loot("sack", "Sack", 100, 0.5),
  loot("scales-merchants", "Scales, Merchant's", 50000, 3),
  loot("sea-charts-local", "Sea Charts, Local", 10000, 0,
    "<p>Maps the nearby island as well as water depth and land elevations. While a navigator has sea charts at hand, all navigation checks have advantage within the charted area.</p>"),
  loot("sealing-wax", "Sealing Wax", 2500, 0),
  loot("shovel", "Shovel", 20000, 5),
  loot("signal-whistle", "Signal Whistle", 250, 0),
  loot("signet-ring", "Signet Ring", 50000, 0),
  loot("soap", "Soap", 100, 0),
  loot("spikes-iron-10", "Spikes, Iron (10)", 10000, 5),
  loot("spyglass", "Spyglass", 100000, 1),
  loot("tent-two-person", "Tent, Two-person", 20000, 20),
  loot("tinderbox", "Tinderbox", 2500, 1),
  consumable("torch", "Torch", 10, 1, "trinket"),
  loot("vial", "Vial", 10000, 0),
  loot("waterskin", "Waterskin", 200, 5),
  loot("whetstone", "Whetstone", 50, 1),

  // ═══════════════════════════════════════════
  //  Transponder Snails
  // ═══════════════════════════════════════════
  loot("basic-transponder-snail", "Basic Transponder Snail", 1000000, 10,
    `<p>A unique genus of snails with the ability to communicate through telepathy across great distances. Can perfectly mimic human speech and expressions. Domesticated for use as phones across the world, also known as "den den mushi".</p>`),
  loot("black-transponder-snail", "Black Transponder Snail", 50000000, 0.5,
    "<p>A subspecies that remains small for life, small enough to be fitted to one's wrist. Picks up and eavesdrops on other transponder snails, allowing the user to listen in on conversations. Typically only used by marines.</p>"),
  loot("cameko-transponder-snail", "Cameko Transponder Snail", 2000000, 1,
    "<p>Can store images and videos. Creates flashes of light with its eyes for flash photography. Usually outfitted with an antenna to send signals and live video feeds to a connected proko.</p>"),
  loot("horned-transponder-snail", "Horned Transponder Snail", 10000000, 9,
    "<p>Does not receive signals for communication. Instead, broadcasts signals that intercept other transponder snails, making it impossible to use them in the vicinity. Typically used by pirates for secret meetings.</p>"),
  loot("proko-transponder-snail", "Proko Transponder Snail", 6000000, 12,
    "<p>Can receive, project, and broadcast what a cameko subspecies sees onto a bigger video screen. Can broadcast frequencies between two relatively close locations.</p>"),
  loot("surveillance-transponder-snail", "Surveillance Transponder Snail", 2500000, 8,
    "<p>Adult form of the cameko transponder snail. Too big to move by hand; placed strategically to survey an area. Multiple surveillance snails can broadcast to a single proko for an effective surveillance network.</p>"),

  // ═══════════════════════════════════════════
  //  Cannon Shot
  // ═══════════════════════════════════════════
  ammo("round-shot", "Round Shot", 10000, 0,
    "<p>Standard cannonball. Deals bludgeoning damage with a 5-foot radius sphere spread from the impact point.</p>"),
  ammo("grapeshot", "Grapeshot", 15000, 0,
    "<p>Deals piercing damage in a 30-foot cone from the muzzle of the cannon.</p>"),
  ammo("chain-shot", "Chain Shot", 15000, 0,
    "<p>Deals bludgeoning damage in a line (5 feet wide) extending from the muzzle to the cannon's normal range.</p>"),
  ammo("exploding-shell", "Exploding Shell", 20000, 0,
    "<p>Deals fire damage with a 20-foot radius sphere spread from the impact point.</p>"),
  ammo("flame-dial-ammo", "Flame Dial", 100000, 0,
    "<p>Deals fire damage in a line (10 feet wide) extending from the muzzle to the cannon's normal range.</p>"),

  // ═══════════════════════════════════════════
  //  Mounts and Animals
  // ═══════════════════════════════════════════
  loot("camel", "Camel", 500000, 0, "<p>Speed 50 ft.</p>"),
  loot("donkey-mule", "Donkey or Mule", 80000, 0, "<p>Speed 40 ft.</p>"),
  loot("giant-duck", "Duck, Giant", 1000000, 0, "<p>Speed 60 ft.</p>"),
  loot("elephant", "Elephant", 2000000, 0, "<p>Speed 40 ft.</p>"),
  loot("horse-draft", "Horse, Draft", 500000, 0, "<p>Speed 40 ft.</p>"),
  loot("horse-riding", "Horse, Riding", 750000, 0, "<p>Speed 60 ft.</p>"),
  loot("horse-sea", "Horse, Sea", 600000, 0, "<p>Swim 40 ft.</p>"),
  loot("pony", "Pony", 300000, 0, "<p>Speed 40 ft.</p>"),
  loot("warhorse", "Warhorse", 4000000, 0, "<p>Speed 60 ft.</p>"),

  // ═══════════════════════════════════════════
  //  Tack, Harness, and Drawn Vehicles
  // ═══════════════════════════════════════════
  loot("barding", "Barding", 0, 0,
    "<p>Armor for mounts. Cost is 4\u00d7 the base armor cost; weight is 2\u00d7 the base armor weight.</p>"),
  loot("bit-and-bridle", "Bit and Bridle", 20000, 1),
  loot("carriage", "Carriage", 1000000, 600),
  loot("cart", "Cart", 150000, 200),
  loot("chariot", "Chariot", 2500000, 100),
  loot("feed", "Feed (per day)", 25, 10),
  loot("saddle", "Saddle", 150000, 15),
  loot("saddlebags", "Saddlebags", 40000, 8),
  loot("sled", "Sled", 200000, 300),
  loot("stabling", "Stabling (per day)", 2500, 0),
  loot("wagon", "Wagon", 350000, 400),

  // ═══════════════════════════════════════════
  //  Sky Vehicles (Dial-powered)
  // ═══════════════════════════════════════════
  loot("board-breath-dial", "Board, Breath Dial", 200000, 2,
    "<p>A skyborne surfing board with breath dials for propulsion. Speed 50 ft. The middle ground for sky vehicles\u2014faster than shooters but more nimble than a waver.</p>"),
  loot("board-jet-dial", "Board, Jet Dial", 10000000, 2,
    "<p>A skyborne surfing board with a rare jet dial for propulsion. Speed 65 ft.</p>"),
  loot("shooters-breath-dial", "Shooters, Breath Dial", 100000, 1,
    "<p>Skate-like sky vehicles with breath dials attached to feet or footwear. Speed 40 ft. The most agile sky vehicles\u2014difficult to master but rewarding as they carry next to no bulk.</p>"),
  loot("shooters-jet-dial", "Shooters, Jet Dial", 5000000, 1,
    "<p>Skate-like sky vehicles with jet dials. Speed 50 ft.</p>"),
  loot("waver-breath-dial", "Waver, Breath Dial", 1000000, 80,
    "<p>Resembles a water scooter, using a breath dial as an engine. Speed 60 ft. By far the fastest of the three sky vehicle types.</p>"),
  loot("waver-jet-dial", "Waver, Jet Dial", 50000000, 80,
    "<p>Resembles a water scooter, using a rare jet dial as an engine. Speed 80 ft.</p>"),
];

export default gear;
