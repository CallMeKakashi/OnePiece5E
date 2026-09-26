import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { machiavellianMisfitFeatures } from "../../data/src/class-features/additional/machiavellian-misfit.js";

const CHASSIS_PATH = "../Foundry/actors-json/cedro-chassis.json";
const OUT_PATH = "../Foundry/actors-json/cedro.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

// --- 1. Machiavellian Misfit (real additional power, prereq Rogue 10 satisfied at level 12) ---
const powerItems = machiavellianMisfitFeatures.map((f) => embedOwnedItem(f as never));
chassis.items = [...chassis.items, ...powerItems];

// --- 2. Legendary actions / resistance (boss-tier convention, matches Queen/Zenzara) ---
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
  "homebrew/cedro/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Cedro can take 2 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/cedro/legendary-resistance",
  "Legendary Resistance (1/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Cedro fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 1, max: "1", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/cedro/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Cedro moves up to his speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryAttack = homebrewFeat(
  "homebrew/cedro/legendary-attack",
  "Rapier Strike (Legendary Action)",
  "icons/weapons/swords/sword-guard-purple.webp",
  "<p>Costs 1 legendary action. Cedro makes one Rapier attack.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
chassis.items.push(legendaryHeader, legendaryResistance, legendaryMove, legendaryAttack);
chassis.system.resources = {
  legact: { value: 2, max: 2 },
  legres: { value: 1, max: 1 },
  lair: { value: false, initiative: null },
};

// --- 3. Fix known build-actor.ts gaps: weaponProf/armorProf/saves, using real
// Rogue class data (data/src/classes/rogue.ts) ---
chassis.system.attributes.prof = 4; // CR 8 -> +3, but Rogue 12 proficiency is +4; class level drives this, not CR, for a class-based NPC
chassis.system.traits.armorProf = { value: ["lgt"], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim"], custom: "Hand crossbows, longswords, rapiers, shortswords" };
chassis.system.abilities.dex.proficient = 1;
chassis.system.abilities.int.proficient = 1;

// build-actor.ts embeds starting armor but doesn't equip it — AC computes as
// unarmored otherwise. Same class of gap as the weaponProf/armorProf issue.
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "equipment" && it.name === "Leather Armor") it.system.equipped = true;
}

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
