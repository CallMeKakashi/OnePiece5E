import { readFileSync, writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const CHASSIS_PATH = "../Foundry/actors-json/amareno-chassis.json";
const OUT_PATH = "../Foundry/actors-json/amareno.json";

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

// --- Reflavor his Quarterstaff (Simple Weapon pick) as "Ladle" ---
function reflavorLadle(item: { name: string; system: Record<string, unknown> }) {
  item.name = "Ladle";
  const sys = item.system as { description: { value: string } };
  sys.description.value =
    "<p>A heavy iron kitchen ladle, dented and battle-worn, that Amareno wields with the same calm precision as any bladed weapon. <em>Bespoke boss-tier damage (6d10 + 35) over the real 1d6 + mod Quarterstaff dice, per this skill's mandatory CR-balance pass.</em></p>";
  const acts = (item.system as { activities?: Record<string, { name?: string; damage?: { parts?: { number: number; denomination: number; bonus: string; types?: string[]; custom?: { enabled: boolean; formula: string } }[] } }> }).activities;
  if (acts) {
    for (const act of Object.values(acts)) {
      act.name = "Ladle";
      const part = act.damage?.parts?.[0];
      if (part) {
        part.number = 6; part.denomination = 10; part.bonus = "35"; part.types = ["bludgeoning"];
        if (part.custom) part.custom.enabled = false;
      }
    }
  }
  return item;
}
chassis.items = chassis.items.map((it: { name: string }) =>
  it.name === "Quarterstaff" ? reflavorLadle(it as never) : it,
);

// --- Legendary actions / resistance ---
const legendaryHeader = homebrewFeat(
  "homebrew/amareno/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Amareno can take 2 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/amareno/legendary-resistance",
  "Legendary Resistance (1/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Amareno fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 1, max: "1", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/amareno/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Amareno moves up to his speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryLadle = homebrewFeat(
  "homebrew/amareno/legendary-ladle",
  "Ladle Strike (Legendary Action)",
  "icons/weapons/hammers/hammer-double-simple-worn.webp",
  "<p>Costs 1 legendary action. Amareno makes one Ladle attack.</p>",
  { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: [["6d10 + 35", "bludgeoning"]], attack: { ability: "str", bonus: "10" } },
);
chassis.items.push(legendaryHeader, legendaryResistance, legendaryMove, legendaryLadle);
chassis.system.resources = {
  legact: { value: 2, max: 2 },
  legres: { value: 1, max: 1 },
  lair: { value: false, initiative: null },
};

// --- Fix known build-actor.ts gaps: weaponProf/armorProf/saves (real
// Brawler data: weapons simple, no armor grant, saves str/dex) ---
chassis.system.attributes.prof = 5; // Brawler 15
chassis.system.traits.armorProf = { value: [], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim"], custom: "Improvised weapons, brawler weapons" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.dex.proficient = 1;

// CR-balance summary (mandatory pass): AC 10+DEX4+WIS3=17 (WIS 14->16),
// HP ~172 (CON 18->24, in the ~161-175 CR-12 band), attack bonus +10
// (prof5+STR4, above the ~+9 CR-12 target — kept, matches real class
// level), dpr ~136 across 2 Ladle attacks (Extra Attack), in the
// ~133-149 band.

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
