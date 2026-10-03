import { generateId } from "../../helpers/id.js";
import { PRIMARY_ACTIVITY_ID } from "../../helpers/activities.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { parseAvailability, parseCannons, parseShips } from "../ships/parse.js";

const shipNames = parseShips().map((s) => s.name);
const availability = parseAvailability(shipNames);

const part = (n: number, d: number, type: string) => ({
  number: n, denomination: d, bonus: "", types: [type],
  custom: { enabled: false, formula: "" }, scaling: { mode: "", number: null, formula: "" },
});

const base = (id: string, type: string, name: string, extra: object) => ({
  _id: id, type, name, sort: 0,
  activation: { type: "action", value: 1, condition: "", override: false },
  consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false },
  description: { chatFlavor: "" },
  duration: { concentration: false, value: null, units: "inst", special: "", override: false },
  effects: [],
  range: { value: null, units: "ft", special: "", override: false },
  target: {
    template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "" },
    affects: { count: "", type: "", choice: false, special: "" }, prompt: true, override: false,
  },
  uses: { spent: 0, max: "", recovery: [] },
  ...extra,
});

// Rules (Cannons.md): attack = d20 + prof + Dex; Save DC = 8 + number of damage dice; round shot is bludgeoning with a 5 ft radius spread.
export default parseCannons().map((c, i) => ({
  _id: generateId(`cannon/${c.name}`),
  name: c.name,
  type: "weapon",
  img: "icons/svg/explosion.svg",
  system: {
    type: { value: "siege", baseItem: "" },
    range: { value: c.range, long: c.long, units: "ft" },
    price: { value: c.cost, denomination: "gp" },
    properties: [], equipped: true, crewed: true, quantity: 1,
    description: { value: `<p>${c.siege ? "Siege weapon. " : ""}Round shot: ${c.dice}d${c.sides} bludgeoning, 5 ft radius spread.</p>`, chat: "" },
    activities: {
      [PRIMARY_ACTIVITY_ID]: base(PRIMARY_ACTIVITY_ID, "attack", "Fire", {
        attack: { ability: "dex", bonus: "", critical: { threshold: null }, flat: false, type: { value: "ranged", classification: "weapon" } },
        damage: { critical: { allow: true, bonus: "" }, parts: [part(c.dice, c.sides, "bludgeoning")] },
      }),
      op5ecannonspread: base("op5ecannonspread", "save", "Damage Spread", {
        save: { ability: ["dex"], dc: { calculation: "", formula: String(8 + c.dice) } },
        damage: { onSave: "half", parts: [part(c.dice, c.sides, "bludgeoning")] },
      }),
    },
  },
  effects: [],
  flags: {
    op5e: {
      cannon: {
        siege: c.siege, dice: c.dice, sides: c.sides, reload: availability[i].reload,
        // links: compendium UUIDs of the ships that can mount this cannon (row-order alignment, see ship flags note)
        ships: (availability[i].ships === "all" ? shipNames : (availability[i].ships as string[])).map((n) => compendiumUuid("ships", generateId(`ship/${n}`))),
      },
    },
  },
}));
