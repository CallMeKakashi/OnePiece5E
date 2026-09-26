import { readFileSync, writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const CHASSIS_PATH = "../Foundry/actors-json/gin-chassis.json";
const OUT_PATH = "../Foundry/actors-json/gin.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

function homebrewFeat(idPath: string, name: string, img: string, description: string, options: {
  actionType?: string;
  activation: { type: string; cost: number | null; condition?: string };
  damage?: [string, string][];
  attack?: { ability: string; bonus: string };
  uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
}): FeatureItem {
  const item: FeatureItem = {
    _id: generateId(idPath),
    name, type: "feat", img,
    system: {
      description: { value: description, chat: "" },
      source: { book: "Blood & Brine homebrew (custom Paramecia, no Sourcebook equivalent)", page: "", custom: "", license: "" },
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

// --- Pump-Pump Fruit (Paramecia) — custom, no Sourcebook equivalent. "Wherever
// he gets hit, he gets stronger; different body parts affect different
// ability scores" — designed as a reaction that fires on being hit,
// granting a stacking bonus tied to the struck location.
const pumpPumpFruit = homebrewFeat(
  "homebrew/gin/pump-pump-fruit",
  "Pump-Pump Fruit: Adaptive Physiology",
  "icons/magic/life/heart-glowing-red.webp",
  `<p><em>Paramecia — Pump-Pump Fruit.</em> Gin's body redistributes impact into raw growth. Whenever he takes damage from an attack, roll (or the GM chooses) which part of his body absorbed the blow, granting a stacking bonus until the end of the encounter (or a short/long rest, whichever comes first). Maximum 3 stacks total, of any combination.</p>
<ul>
<li><strong>Arms hit.</strong> +2 Strength (melee attack and damage rolls).</li>
<li><strong>Legs hit.</strong> +10 ft. speed and +1 AC (footwork).</li>
<li><strong>Torso/chest hit.</strong> +2 Constitution (immediately gain the resulting hit points).</li>
<li><strong>Head hit.</strong> +2 Wisdom (Perception/Insight and reaction to feints).</li>
</ul>
<p>Stacks fade together at the end of the encounter or the next short/long rest, whichever comes first.</p>`,
  { activation: { type: "special", cost: null, condition: "Reaction to being hit by an attack, no action cost" } },
);

// --- Legendary actions / resistance (boss-tier convention, consistent with siblings) ---
const legendaryHeader = homebrewFeat(
  "homebrew/gin/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Gin can take 2 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/gin/legendary-resistance",
  "Legendary Resistance (1/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Gin fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 1, max: "1", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/gin/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Gin moves up to his speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryAttack = homebrewFeat(
  "homebrew/gin/legendary-attack",
  "Longsword Strike (Legendary Action)",
  "icons/weapons/swords/sword-guard-purple.webp",
  "<p>Costs 1 legendary action. Gin makes one Longsword attack.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
chassis.items.push(pumpPumpFruit, legendaryHeader, legendaryResistance, legendaryMove, legendaryAttack);
chassis.system.resources = {
  legact: { value: 2, max: 2 },
  legres: { value: 1, max: 1 },
  lair: { value: false, initiative: null },
};

// --- Fix known build-actor.ts gaps: weaponProf/armorProf/saves + equip ---
chassis.system.attributes.prof = 4; // Fighter 11
chassis.system.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.con.proficient = 1;
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "equipment" && (it.name === "Chain Mail" || it.name === "Shield")) it.system.equipped = true;
}

// --- Bespoke boss-tier weapon damage (Longsword) — mandatory CR-balance pass.
// Real output: 2 attacks (Extra Attack) x (1d8 + 5) = ~19 dpr, far under the
// DMG CR-11 band (~117-132). Bumped to 7d8 + 32 per hit (~127 across 2
// attacks, in-band). Watch the custom.enabled trap: Longsword is a static
// weapon (not a scaling formula like Brawler Unarmed Strike), so no
// custom-formula override risk here — confirmed before relying on it.
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "weapon" && it.name === "Longsword") {
    const acts = (it.system as { activities?: Record<string, { damage?: { parts?: { number: number; denomination: number; bonus: string; custom?: { enabled: boolean } }[] } }> }).activities;
    if (acts) {
      for (const act of Object.values(acts)) {
        const part = act.damage?.parts?.[0];
        if (part) {
          part.number = 7; part.denomination = 8; part.bonus = "32";
          if (part.custom) part.custom.enabled = false;
        }
      }
    }
  }
}

// CR-balance summary: AC now 18 (16 chain mail + 2 shield, no DEX since
// heavy armor), HP 148.5 (11d10+CON26x11 -> rounds via formula; slightly
// under the ~161-175 CR-11 band even at CON 26 — noted rather than pushed
// to an implausible CON), attack bonus +9 (prof4+STR5, on target), dpr ~127
// (on target). system.details.cr already 11 from the spec.

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
