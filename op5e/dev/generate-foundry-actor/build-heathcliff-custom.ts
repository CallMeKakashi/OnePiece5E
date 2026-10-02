import { readFileSync, writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const CHASSIS_PATH = "../Foundry/actors-json/heathcliff-chassis.json";
const OUT_PATH = "../Foundry/actors-json/heathcliff.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

function homebrewFeat(idPath: string, name: string, img: string, description: string, options: {
  activation: { type: string; cost: number | null; condition?: string };
  actionType?: string;
  damage?: [string, string][];
  attack?: { ability: string; bonus: string };
  uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
}): FeatureItem {
  const item: FeatureItem = {
    _id: generateId(idPath),
    name, type: "feat", img,
    system: {
      description: { value: description, chat: "" },
      source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "",
      activation: { type: options.activation.type, cost: options.activation.cost, condition: options.activation.condition ?? "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: 5, long: null, units: "ft" },
      uses: options.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: options.actionType ?? "",
      damage: { parts: options.damage ?? [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
  return ensureFeatureActivities(item);
}

// --- Reflavor Quarterstaff as his cane ---
function reflavorCane(item: { name: string; system: Record<string, unknown> }) {
  item.name = "Gentleman's Cane";
  const sys = item.system as { description: { value: string } };
  sys.description.value = "<p>A long, slender cane, carried more as an accessory than a walking aid — though it can double as a weapon in a pinch.</p>";
  const acts = (item.system as { activities?: Record<string, { name?: string }> }).activities;
  if (acts) for (const act of Object.values(acts)) act.name = "Gentleman's Cane";
  return item;
}
chassis.items = chassis.items.map((it: { name: string }) =>
  it.name === "Quarterstaff" ? reflavorCane(it as never) : it,
);

// --- Bespoke boss-tier damage on Katana (mandatory CR-balance pass). Real
// output: 3 attacks (Extra Attack is 3 at level 19, becomes 4 only at 20)
// x (1d8 + 5) ~= 28.5 dpr, far under DMG CR-18 (~190-210). Bumped to
// 6d10 + 34 per hit (~201 across 3 attacks, in-band). ---
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "weapon" && it.name === "Katana") {
    const acts = (it.system as { activities?: Record<string, { damage?: { parts?: { number: number; denomination: number; bonus: string; custom?: { enabled: boolean } }[] } }> }).activities;
    if (acts) {
      for (const act of Object.values(acts)) {
        const part = act.damage?.parts?.[0];
        if (part) { part.number = 6; part.denomination = 10; part.bonus = "34"; if (part.custom) part.custom.enabled = false; }
      }
    }
  }
}

// --- Legendary actions / resistance ---
const legendaryHeader = homebrewFeat(
  "homebrew/heathcliff/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Heathcliff can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/heathcliff/legendary-resistance",
  "Legendary Resistance (3/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Heathcliff fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 3, max: "3", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/heathcliff/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Heathcliff moves up to his speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryKatana = homebrewFeat(
  "homebrew/heathcliff/legendary-katana",
  "Katana Strike (Legendary Action)",
  "icons/weapons/swords/sword-katana-purple.webp",
  "<p>Costs 1 legendary action. Heathcliff makes one Katana attack.</p>",
  { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: [["6d10 + 34", "slashing"]], attack: { ability: "str", bonus: "11" } },
);
chassis.items.push(legendaryHeader, legendaryResistance, legendaryMove, legendaryKatana);
chassis.system.resources = {
  legact: { value: 3, max: 3 },
  legres: { value: 3, max: 3 },
  lair: { value: false, initiative: null },
};

// --- Fix known build-actor.ts gaps: weaponProf/armorProf/saves + equip ---
chassis.system.attributes.prof = 6; // Fighter 19
chassis.system.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.con.proficient = 1;
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "equipment" && it.name === "Heavy Longcoat") it.system.equipped = true;
}

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
