import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { parseAvailability, parseCannons, parseShips } from "./parse.js";

const ships = parseShips();
const names = ships.map((x) => x.name);
const availability = parseAvailability(names);
const cannons = parseCannons();

// Vehicle fields follow dnd5e 5.1.10 (vehicleType, attributes.hp.dt, capacity). Speed is stored in mph (movement units "mi").
export default ships.map((s) => ({
  _id: generateId(`ship/${s.name}`),
  name: s.name,
  type: "vehicle",
  img: "icons/svg/anchor.svg",
  system: {
    vehicleType: "water",
    attributes: {
      ac: { calc: "flat", flat: s.ac },
      hp: { value: s.hp, max: s.hp, dt: s.threshold },
      movement: { swim: s.mph, units: "mi" },
      capacity: { creature: `${s.crew} crew, ${s.passengers} passengers`, cargo: s.cargoTons ?? 0 },
    },
    traits: { size: s.name === "Rowboat" || s.name === "Keelboat" ? "lg" : "grg" },
    details: { biography: { value: `<p>Cost: ${s.cost.toLocaleString("en-US")} beri. Speed ${s.mph} mph.</p>` } },
  },
  items: [],
  effects: [],
  flags: {
    op5e: {
      ship: {
        cost: s.cost, cannonSlots: s.slots, crew: s.crew, passengers: s.passengers,
        // links: compendium UUIDs of cannons this ship can mount
        cannons: cannons.filter((_, i) => availability[i].ships === "all" || (availability[i].ships as string[]).includes(s.name)).map((c) => compendiumUuid("ship-weapons", generateId(`cannon/${c.name}`))),
      },
      automation: "NEEDS_REVIEW",
      note: "AC/HP/slots aligned to ship by table row order (source table has no row names)",
    },
  },
}));
