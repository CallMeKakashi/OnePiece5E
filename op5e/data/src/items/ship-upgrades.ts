import { mkItem } from "./_make.js";

const KW: Record<string, string> = {
  Activation: "This upgrade is normally not in effect. Someone on the crew (typically the helmsman) must use an action to activate it.",
  "Burst of Speed": "As an action, the helmsman chooses an amount of fuel to expend, up to the fuel remaining in all the ship's fuel tanks. The ship moves in a straight line a number of feet equal to the total fuel expended.",
  Dive: "Creates a shell around the ship, allowing it to dive beneath the ocean's surface and travel along the ocean floor.",
  Everlasting: "The ship ignores the effects of the Siege property and gains resistance to bludgeoning, piercing, and slashing damage.",
  "Fish Tank": "Lets the crew keep fresh fish aboard for food. Halves the crew's lifestyle expenses if they have a cook on board.",
  "Fuel Supply": "Measured in gallons of fuel. By itself it does nothing, but it is necessary for upgrades that require fuel.",
  Gardening: "Lets the crew grow plants, typically for medicine or food. Halves the crew's lifestyle expenses if they have a doctor on board.",
  "Lift Off": "Lets the ship take flight at a great cost of fuel. Upon activation, the ship flies at a speed equal to its movement speed.",
  Lightweight: "Makes the ship nimble and light, allowing it to travel in shallow water and sail upon the clouds of sky islands.",
  Reverse: "Allows the ship to move in a straight line backward by expending fuel.",
};

// [id, name, cost (beri), time, prof, repeatable, requirement, properties text, keywords]
type U = [string, string, number, string, number, boolean, string, string, string[]];
const CVG = "Caravel, carrack, galleon";
const UPGRADES: U[] = [
  ["deck-1", "Additional Deck Level (+1)", 5e6, "60 days", 2, false, CVG, "x2 cannon slots (port/starboard)", []],
  ["deck-2", "Additional Deck Level (+2)", 10e6, "60 days", 3, false, CVG, "x3 cannon slots (port/starboard)", []],
  ["adam-wood", "Adam Wood", 200e6, "Half of the total ship time", 3, false, "None", "Everlasting", ["Everlasting"]],
  ["aerodynamics", "Aerodynamics", 500e3, "20 days", 2, false, "None", "Lightweight", ["Lightweight"]],
  ["aquarium", "Aquarium", 750e3, "7 days", 2, false, "None", "Fish tank", ["Fish Tank"]],
  ["enhanced-support", "Enhanced Support", 750e3, "7 days", 2, true, "None", "+1 cannon weight capacity", []],
  ["expanded-storage", "Expanded Storage", 500e3, "7 days", 2, true, "Caravel, carrack, galleon, galley", "x1.5 Cargo hold", []],
  ["flight", "Flight", 30e6, "60 days", 3, false, "Aerodynamics, fuel tank (50/hour)", "Activation, lift off, propulsion", ["Activation", "Lift Off"]],
  ["fuel-tank", "Fuel Tank (Gallon, 100)", 2e6, "30 days", 3, true, CVG, "Fuel supply", ["Fuel Supply"]],
  ["orchard", "Orchard", 300e3, "7 days", 2, false, "None", "Gardening", ["Gardening"]],
  ["propulsion-apprentice", "Propulsion (Apprentice)", 20e6, "30 days", 2, false, "Fuel tank (25/hour)", "+2 mph, Activation, reverse", ["Activation", "Reverse"]],
  ["propulsion-journeyman", "Propulsion (Journeyman)", 30e6, "30 days", 3, false, "Fuel tank (25/hour)", "+4 mph, Activation, reverse", ["Activation", "Reverse"]],
  ["propulsion-masterwork", "Propulsion (Masterwork)", 40e6, "30 days", 4, false, "Fuel tank (25/hour)", "+6 mph, Activation, reverse", ["Activation", "Reverse"]],
  ["hull-apprentice", "Reinforced Hull (Apprentice)", 5e6, "30 days", 2, false, "None", "+1 AC", []],
  ["hull-journeyman", "Reinforced Hull (Journeyman)", 10e6, "30 days", 3, false, "None", "+2 AC", []],
  ["hull-masterwork", "Reinforced Hull (Masterwork)", 20e6, "30 days", 4, false, "None", "+3 AC", []],
  ["keel-apprentice", "Reinforced Keel (Apprentice)", 10e6, "40 days", 2, false, "None", "+100 hit point maximum", []],
  ["keel-journeyman", "Reinforced Keel (Journeyman)", 20e6, "40 days", 3, false, "None", "+200 hit point maximum", []],
  ["keel-masterwork", "Reinforced Keel (Masterwork)", 30e6, "40 days", 4, false, "None", "+300 hit point maximum", []],
  ["submarine", "Submarine", 30e6, "60 days", 3, false, "Fuel tank (25/hour), propulsion", "Activation, dive", ["Activation", "Dive"]],
  ["turbo-engine", "Turbo Engine", 5e6, "30 days", 3, false, "Carrack, galleon, fuel (all remaining)", "Activation, burst of speed", ["Activation", "Burst of Speed"]],
  ["turret-bow", "Turrets, Bow", 7e6, "30 days", 2, false, "Caravel, carrack, galleon, galley", "x2 cannon slots (bow)", []],
  ["turret-stern", "Turrets, Stern", 7e6, "30 days", 2, false, "Caravel, carrack, galleon, galley", "x2 cannon slots (stern)", []],
];

export const shipUpgrades = UPGRADES.map(([id, name, cost, time, prof, rep, req, props, kws]) =>
  mkItem("ship-upgrades", id, name, cost,
    `<p><strong>Ship Upgrade.</strong> Cost ${cost.toLocaleString("en-US")} beri; time ${time}; crafter proficiency bonus ${prof}+; repeatable: ${rep ? "yes" : "no"}.</p>` +
    `<p>Requirement: ${req}.</p><p>Properties: ${props}.</p>` +
    kws.map((k) => `<p><strong>${k}.</strong> ${KW[k]}</p>`).join("") +
    `<p>Crafted with the same rules as building a ship; one upgrade at a time, and crewmembers can help.</p>`));
