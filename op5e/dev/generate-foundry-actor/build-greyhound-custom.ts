import { readFileSync, writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const CHASSIS_PATH = "../Foundry/actors-json/greyhound-chassis.json";
const OUT_PATH = "../Foundry/actors-json/greyhound.json";

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
      source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "",
      activation: { type: options.activation.type, cost: options.activation.cost, condition: options.activation.condition ?? "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: 10, long: null, units: "ft" },
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

// --- Reflavor Brawler Unarmed Strike as "Claw" ---
function reflavorClaw(item: { name: string; system: Record<string, unknown> }) {
  item.name = "Claw";
  const sys = item.system as { description: { value: string } };
  sys.description.value =
    "<p>Greyhound's forelimbs end in enormous clawed paws. <em>Bespoke boss-tier damage (6d10 + 35) over the real 1d8 + mod Brawling-die scaling, per this skill's mandatory CR-balance pass.</em></p>";
  const acts = (item.system as { activities?: Record<string, { name?: string; damage?: { parts?: { number: number; denomination: number; bonus: string; types?: string[]; custom?: { enabled: boolean; formula: string } }[] } }> }).activities;
  if (acts) {
    for (const act of Object.values(acts)) {
      act.name = "Claw";
      const part = act.damage?.parts?.[0];
      if (part) {
        part.number = 6; part.denomination = 10; part.bonus = "35"; part.types = ["slashing"];
        if (part.custom) { part.custom.enabled = false; part.custom.formula = ""; }
      }
    }
  }
  return item;
}
chassis.items = chassis.items.map((it: { name: string }) =>
  it.name === "Brawler Unarmed Strike" ? reflavorClaw(it as never) : it,
);

const bite = homebrewFeat(
  "homebrew/greyhound/bite",
  "Bite",
  "icons/creatures/abilities/fangs-teeth-bite.webp",
  "<p>Bonus action (Spirit point). Greyhound's massive wolf jaws snap at a creature within 5 feet. Melee Weapon Attack, +11 to hit. Hit: 5d10 + 30 piercing damage. If the target is Large or smaller, it is grappled (escape DC 20) and restrained until the grapple ends.</p>",
  { actionType: "mwak", activation: { type: "bonus", cost: 1 }, damage: [["5d10 + 30", "piercing"]], attack: { ability: "str", bonus: "11" } },
);

const uncontrollable = homebrewFeat(
  "homebrew/greyhound/uncontrollable-fury",
  "Uncontrollable Fury",
  "icons/magic/control/fear-fright-monster-red.webp",
  "<p>Passive. Once Greyhound drops to half its hit points or lower, it flies into a mindless rage: it must attack the nearest creature each turn (including allies), has advantage on all melee attack rolls, but attack rolls against it also have advantage. Nothing can calm it once triggered — the mutation's control was never perfected. <em>Flavor/roleplay hook for \"uncontrollable, driven by wild temperament\" — GM adjudicated, not automated.</em></p>",
  { activation: { type: "", cost: null } },
);

const fadedGreatness = homebrewFeat(
  "homebrew/greyhound/faded-greatness",
  "Faded Greatness",
  "icons/skills/social/thumbsup-approval-like.webp",
  "<p><em>Flavor only, no mechanical effect.</em> Beneath the mutation, fragments remain of the man Greyhound once was: a famous pirate captain, before an experiment stripped away his mind and left this. Occasionally, in a lull between attacks, something almost like recognition flickers in its yellow-gold eyes.</p>",
  { activation: { type: "", cost: null } },
);

// --- Legendary actions / resistance ---
const legendaryHeader = homebrewFeat(
  "homebrew/greyhound/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Greyhound can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. It regains spent legendary actions at the start of its turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/greyhound/legendary-resistance",
  "Legendary Resistance (3/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Greyhound fails a saving throw, it can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 3, max: "3", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/greyhound/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Greyhound moves up to its speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryClaw = homebrewFeat(
  "homebrew/greyhound/legendary-claw",
  "Claw (Legendary Action)",
  "icons/creatures/claws/claw-bear-paw-swipe-brown.webp",
  "<p>Costs 1 legendary action. Greyhound makes one Claw attack.</p>",
  { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: [["6d10 + 35", "slashing"]], attack: { ability: "str", bonus: "11" } },
);

chassis.items.push(bite, uncontrollable, fadedGreatness, legendaryHeader, legendaryResistance, legendaryMove, legendaryClaw);
chassis.system.resources = {
  legact: { value: 3, max: 3 },
  legres: { value: 3, max: 3 },
  lair: { value: false, initiative: null },
};

// --- Fix known build-actor.ts gaps: weaponProf/armorProf/saves (real
// Brawler data: weapons simple, no armor grant, saves str/dex). ---
chassis.system.attributes.prof = 6; // Brawler level 18
chassis.system.traits.armorProf = { value: [], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim"], custom: "Improvised weapons, brawler weapons" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.dex.proficient = 1;

// CR-balance summary (mandatory pass): AC now 10+DEX3+WIS5=18 (WIS 12->20
// via the real Unarmored Defense formula, no override needed), HP 225
// (18d8+144 from CON 26, in the ~215-229 CR-16 band), attack bonus +11
// (prof6 tied to real class level 18 + STR7 — slightly above the generic
// CR-16 ~+9, kept because it matches his real class progression rather
// than being artificially capped), dpr ~193.5 (Claw x2 via Extra Attack +
// Bite bonus action = 68+68+57.5), a touch over the ~176-190 band but
// close and consistent with a level-18 chassis rather than a pure CR-16
// median monster.

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
