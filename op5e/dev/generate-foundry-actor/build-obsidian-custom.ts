import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { hakiAbilities } from "../../data/src/class-features/haki.js";

const CHASSIS_PATH = "../Foundry/actors-json/obsidian-chassis.json";
const OUT_PATH = "../Foundry/actors-json/obsidian-first-mode.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

// --- "Master of Conqueror's Haki and the rest as well": Conqueror's came
// through the real 5 class gates (Novice->Master). Armament and Observation
// get their full Novice->Master progressions embedded directly here — all
// 10 items are 100% real Sourcebook/compendium content, just embedded
// beyond what the single-choice-per-gate mechanism normally allows. ---
const wantedNames = [
  "Color of Armament Novice", "Color of Armament Apprentice", "Color of Armament Journeyman", "Color of Armament Adept", "Color of Armament Master",
  "Color of Observation Novice", "Color of Observation Apprentice", "Color of Observation Journeyman", "Color of Observation Adept", "Color of Observation Master",
];
const extraHakiItems = hakiAbilities
  .filter((f) => wantedNames.includes(f.name))
  .map((f) => embedOwnedItem(f as never));
chassis.items = [...chassis.items, ...extraHakiItems];

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

// --- Bespoke boss-tier damage on Greatsword (mandatory CR-balance pass).
// Real output: 4 attacks (Extra Attack scales to 4 at level 20) x
// (2d6 + 7) ~= 56 dpr, far under DMG CR-20 (~239-260). Bumped to 5d10 + 33
// per hit (~242 across 4 attacks, in-band). ---
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "weapon" && it.name === "Greatsword") {
    const acts = (it.system as { activities?: Record<string, { damage?: { parts?: { number: number; denomination: number; bonus: string; custom?: { enabled: boolean } }[] } }> }).activities;
    if (acts) {
      for (const act of Object.values(acts)) {
        const part = act.damage?.parts?.[0];
        if (part) { part.number = 5; part.denomination = 10; part.bonus = "33"; if (part.custom) part.custom.enabled = false; }
      }
    }
  }
}

// --- Transform (First Mode -> Second Mode) ---
const transform = homebrewFeat(
  "homebrew/obsidian/transform",
  "Transform: Overheated Obsidian",
  "icons/magic/fire/flame-burning-embers-yellow.webp",
  "<p><em>GM note: this is a two-sheet boss. When this triggers, swap Obsidian's token/actor to the \"Obsidian (Overheated)\" actor, carrying over current HP as a percentage and any active conditions.</em></p><p>Obsidian's armor automatically transforms the instant he drops to half his hit points or lower — no action required. He can also trigger this transformation voluntarily, as an action, before reaching that threshold.</p>",
  { activation: { type: "special", cost: null, condition: "Automatic below half HP, or voluntarily as an action" } },
);
chassis.items.push(transform);

// --- Legendary actions / resistance ---
const legendaryHeader = homebrewFeat(
  "homebrew/obsidian/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Obsidian can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/obsidian/legendary-resistance",
  "Legendary Resistance (3/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Obsidian fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 3, max: "3", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/obsidian/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Obsidian moves up to his speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryStrike = homebrewFeat(
  "homebrew/obsidian/legendary-strike",
  "Greatsword Strike (Legendary Action)",
  "icons/weapons/swords/greatsword-crossguard-flanged-purple.webp",
  "<p>Costs 1 legendary action. Obsidian makes one Greatsword attack.</p>",
  { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: [["5d10 + 33", "slashing"]], attack: { ability: "str", bonus: "13" } },
);
chassis.items.push(legendaryHeader, legendaryResistance, legendaryMove, legendaryStrike);
chassis.system.resources = {
  legact: { value: 3, max: 3 },
  legres: { value: 3, max: 3 },
  lair: { value: false, initiative: null },
};

// --- Fix known build-actor.ts gaps: weaponProf/armorProf/saves + equip ---
chassis.system.attributes.prof = 6; // Fighter 20
chassis.system.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.con.proficient = 1;
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "equipment" && (it.name === "Chain Mail" || it.name === "Shield")) it.system.equipped = true;
}

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
