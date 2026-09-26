import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { powerfulLaughterFeatures } from "../../data/src/class-features/additional/powerful-laughter.js";

const CHASSIS_PATH = "../Foundry/actors-json/nerolo-chassis.json";
const OUT_PATH = "../Foundry/actors-json/nerolo.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

// --- 1. Powerful Laughter (real additional power, prereq CHA 13+, satisfied at CHA 20) ---
const powerItems = powerfulLaughterFeatures.map((f) => embedOwnedItem(f as never));
chassis.items = [...chassis.items, ...powerItems];

// --- 2. Legendary actions / resistance (boss-tier convention) ---
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
  "homebrew/nerolo/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Nerolo can take 2 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/nerolo/legendary-resistance",
  "Legendary Resistance (1/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Nerolo fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 1, max: "1", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/nerolo/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Nerolo moves up to his speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryAttack = homebrewFeat(
  "homebrew/nerolo/legendary-attack",
  "Scimitar Strike (Legendary Action)",
  "icons/weapons/swords/sword-guard-purple.webp",
  "<p>Costs 1 legendary action. Nerolo makes one Scimitar attack.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
chassis.items.push(legendaryHeader, legendaryResistance, legendaryMove, legendaryAttack);
chassis.system.resources = {
  legact: { value: 2, max: 2 },
  legres: { value: 1, max: 1 },
  lair: { value: false, initiative: null },
};

// --- 3. Fix known build-actor.ts gaps: weaponProf/armorProf/saves + armor
// equip flag, using real Savant class data (data/src/classes/savant.ts). ---
chassis.system.attributes.prof = 5; // Savant 13
chassis.system.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
chassis.system.abilities.wis.proficient = 1;
chassis.system.abilities.cha.proficient = 1;
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "equipment" && it.name === "Heavy Longcoat") it.system.equipped = true;
}

// --- 4. Bespoke boss-tier weapon damage (same rationale/pattern as Queen and
// Cedro): real class output (2 attacks via Extra Attack, 1d8 weapon + 1d8
// Improved Ardent Smite each = ~24 dpr) is far under the DMG CR-10 band
// (~101-116 dpr). Bumping Scimitar/Rapier base damage to 5d10 + 18 lands
// ~106 dpr across 2 attacks (with Improved Ardent Smite and DEX mod still
// applying on top) — deliberate, documented departure from real weapon dice.
const BOSS_WEAPON_DAMAGE = { number: 5, denomination: 10, bonus: "18" };
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "weapon" && (it.name === "Scimitar" || it.name === "Rapier")) {
    const acts = (it.system as { activities?: Record<string, { damage?: { parts?: { number: number; denomination: number; bonus: string }[] } }> }).activities;
    if (acts) {
      for (const act of Object.values(acts)) {
        const part = act.damage?.parts?.[0];
        if (part) Object.assign(part, BOSS_WEAPON_DAMAGE);
      }
    }
  }
}

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
