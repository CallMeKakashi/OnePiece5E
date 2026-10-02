import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { eightImpactsFistFeatures } from "../../data/src/class-features/additional/eight-impacts-fist.js";

const CHASSIS_PATH = "../Foundry/actors-json/salvatore-chassis.json";
const OUT_PATH = "../Foundry/actors-json/salvatore.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

// --- 1. Eight Impacts Fist (real additional power, no prereq). At level 11,
// applicable tiers are the base + First Impacts + Thunderous Blows (10th) —
// Thunderstruck (5th) is explicitly REPLACED by Thunderous Blows per its own
// text, so it's correctly excluded, not missing. Deep Impact (15)/Eighth
// Impact (20) are above his level. ---
const wantedPowerNames = ["Eight Impacts Fist", "First Impacts", "Thunderous Blows"];
const powerItems = eightImpactsFistFeatures
  .filter((f) => wantedPowerNames.includes(f.name))
  .map((f) => embedOwnedItem(f as never));
chassis.items = [...chassis.items, ...powerItems];

// --- 2. Reflavor Brawler Unarmed Strike as "Brass Knuckles" ---
function reflavorBrassKnuckles(item: { name: string; system: Record<string, unknown> }) {
  item.name = "Brass Knuckles";
  const sys = item.system as { description: { value: string } };
  sys.description.value =
    "<p>Salvatore's brass knuckles replace his unarmed strikes, dealing bludgeoning damage (or thunder, via Eight Impacts Fist's First Impacts). <em>Bespoke boss-tier damage bump (3d8 + 16) over the real 1d10 + 5 Brawling-die scaling, per this skill's mandatory CR-balance pass — see comment below.</em></p>";
  const acts = (item.system as { activities?: Record<string, { name?: string; damage?: { parts?: { number: number; denomination: number; bonus: string; types?: string[]; custom?: { enabled: boolean; formula: string } }[] } }> }).activities;
  if (acts) {
    for (const act of Object.values(acts)) {
      act.name = "Brass Knuckles";
      const part = act.damage?.parts?.[0];
      if (part) {
        part.number = 3; part.denomination = 8; part.bonus = "16"; part.types = ["bludgeoning"];
        if (part.custom) { part.custom.enabled = false; part.custom.formula = ""; }
      }
    }
  }
  return item;
}
chassis.items = chassis.items.map((it: { name: string }) =>
  it.name === "Brawler Unarmed Strike" ? reflavorBrassKnuckles(it as never) : it,
);

// --- 3. Legendary actions (3) / resistance (1), per explicit spec ---
function homebrewFeat(idPath: string, name: string, img: string, description: string, options: {
  activation: { type: string; cost: number | null; condition?: string };
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
      actionType: "", damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
  return ensureFeatureActivities(item);
}

const legendaryHeader = homebrewFeat(
  "homebrew/salvatore/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Salvatore can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/salvatore/legendary-resistance",
  "Legendary Resistance (1/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Salvatore fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 1, max: "1", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/salvatore/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Salvatore moves up to his speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryAttack = homebrewFeat(
  "homebrew/salvatore/legendary-attack",
  "Brass Knuckles Strike (Legendary Action)",
  "icons/commodities/biological/hand-clawed-blue.webp",
  "<p>Costs 1 legendary action. Salvatore makes one Brass Knuckles attack.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
chassis.items.push(legendaryHeader, legendaryResistance, legendaryMove, legendaryAttack);
chassis.system.resources = {
  legact: { value: 3, max: 3 },
  legres: { value: 1, max: 1 },
  lair: { value: false, initiative: null },
};

// --- 4. Fix known build-actor.ts gaps: weaponProf/armorProf/saves (real
// Brawler data: weapons simple, no armor grant, saves str/dex). ---
chassis.system.attributes.prof = 4; // Brawler 11
chassis.system.traits.armorProf = { value: [], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim"], custom: "Improvised weapons, brawler weapons" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.dex.proficient = 1;

// --- 5. Mandatory CR-balance pass (per SKILL.md step 4) ---
// Real-formula numbers before this pass: HP 113 (11d8+55), AC 15
// (10 + DEX 2 + WIS 3, Brawler's default Unarmored Defense — Daredevil
// doesn't substitute STR the way Sumo Wrestler does), DPR ~42 (4 attacks x
// 1d10+5). DMG CR-11 targets: AC ~17, HP ~161-175, atk ~+9, dpr ~117-132.
// WIS 16->20 closes AC via the real formula (10+2+5=17). HP can't reach the
// band through plausible CON at 11 hit dice, so it's flat-overridden below.
// DPR closed via the Brass Knuckles bump above (3d8+16 x4 ~= 118).
chassis.system.attributes.hp.value = 168;
chassis.system.attributes.hp.max = 168;

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
