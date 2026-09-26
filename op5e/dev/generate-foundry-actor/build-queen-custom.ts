import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { sixPowersAdeptFeatures } from "../../data/src/class-features/additional/six-powers-adept.js";

const CHASSIS_PATH = "../Foundry/actors-json/queen-chassis.json";
const OUT_PATH = "../Foundry/actors-json/queen.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

// --- 1. Six Powers Adept (real additional power, prereqs satisfied: STR 20, Okama Kenpo not Six Powers Master, level 16) ---
const sixPowersAdeptItems = sixPowersAdeptFeatures.map((f) => embedOwnedItem(f as never));

// --- 2. Reflavor the real Brawler Unarmed Strike as "Nail Attack" (claws),
// with BESPOKE boss-tier damage (3d10 + 8, ~24.5 avg/hit) replacing the real
// @scale.brawler.brawling-die scaling (1d12+5, ~11.5 avg/hit).
//
// Why: real-class Brawler output (Nail Attack x2 via Extra Attack + Flurry
// of Blows x2 more = 4 attacks/round at 1d12+5 each) totals ~46 dpr, far
// short of the DMG CR-13 offensive band (~143-158 dpr). Every Armament Haki
// tier in this system is pure damage-reduction/armor-point defense, not
// offense, so there's no legitimate real-content lever to pull. User
// approved a bespoke damage bump over other options (accepting a lower
// effective CR, or the same fix via more attacks instead of bigger ones).
// At 4 attacks/round (Extra Attack x2 + Flurry x2) this lands ~98 dpr; with
// Elegant Combination's bonus 5th hit after Flurry, ~122.5 — solidly closes
// most of the gap without single-hit damage becoming absurd. This is a
// deliberate, flagged departure from pure real-class fidelity — not a bug.
const BOSS_DAMAGE: [string, string] = ["3d10 + 8", "slashing"];
const BOSS_ATTACK = { ability: "str", bonus: "10" };

function reflavorNailAttack(item: { name: string; system: Record<string, unknown> }) {
  item.name = "Nail Attack";
  const sys = item.system as { description: { value: string }; damage: { parts: unknown } };
  sys.description.value =
    "<p>Queen's claw-like nails replace her unarmed strikes, dealing slashing damage. <em>Bespoke boss-tier damage (3d10 + 8) — see build-queen-custom.ts for the CR-13 balance rationale; departs from the real class's 1d12 + 5 Brawling-die scaling.</em></p>";
  sys.damage.parts = [BOSS_DAMAGE[0], BOSS_DAMAGE[1]];
  const acts = (item.system as { activities?: Record<string, { name?: string; damage?: { parts?: unknown[] } } > }).activities;
  if (acts) {
    for (const act of Object.values(acts)) {
      act.name = "Nail Attack";
      if (act.damage?.parts?.length) {
        for (const part of act.damage.parts as { custom?: { enabled: boolean; formula: string }; types?: string[] }[]) {
          part.types = ["slashing"];
          if (part.custom) { part.custom.enabled = true; part.custom.formula = BOSS_DAMAGE[0]; }
        }
      }
    }
  }
  return item;
}
chassis.items = chassis.items.map((it: { name: string }) =>
  it.name === "Brawler Unarmed Strike" ? reflavorNailAttack(it as never) : it,
);

// --- 3. Her two Chosen Powers from Six Techniques (Shave, Tempest Kick) —
// hand-authored because the compendium only has these as bullet text inside
// one shared description item, not as individually automatable items. Real
// mechanics text quoted from data/src/subclasses/brawler-six-powers-master.ts. ---
function homebrewFeat(idPath: string, name: string, img: string, description: string, options: {
  actionType?: string;
  activation: { type: string; cost: number | null; condition?: string };
  damage?: [string, string][];
  attack?: { ability: string; bonus: string };
  uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
}): FeatureItem {
  const item: FeatureItem = {
    _id: generateId(idPath),
    name,
    type: "feat",
    img,
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e (Six Powers Master — Shave/Tempest Kick, reflavored Soru/Rankyaku)", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "Six Powers Adept: Chosen Powers",
      activation: { type: options.activation.type, cost: options.activation.cost, condition: options.activation.condition ?? "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: 5, long: null, units: "ft" },
      uses: options.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: options.actionType ?? "",
      damage: { parts: options.damage ?? [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null, coreVersion: "13",
      systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
  return ensureFeatureActivities(item);
}

const soru = homebrewFeat(
  "homebrew/queen/soru-shave",
  "Soru (Shave)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p><em>Six Powers Adept — Chosen Power (Shave).</em></p><p>As a bonus action, Queen can teleport 15 feet. Alternatively, as a reaction when a creature targets her with an attack, she can spend 1 Spirit Point to impose disadvantage on the attack and then teleport 15 feet. She cannot use this feature if her movement speed is 0.</p>",
  { activation: { type: "bonus", cost: 1 } },
);

const rankyaku = homebrewFeat(
  "homebrew/queen/rankyaku-tempest-kick",
  "Rankyaku (Tempest Kick)",
  "icons/magic/air/wind-swirl-gray-blue.webp",
  "<p><em>Six Powers Adept — Chosen Power (Tempest Kick).</em></p><p>In place of an unarmed strike, Queen can make a ranged attack with a range of 60 feet, adding her Dexterity to the attack and damage rolls. Its damage is slashing, using the Brawling die (currently 1d12).</p>",
  { actionType: "rwak", activation: { type: "special", cost: null, condition: "In place of an unarmed strike" }, damage: [["2d10 + 6", "slashing"]], attack: { ability: "dex", bonus: "10" } },
);

// --- 4. Legendary actions / resistance (boss-tier, matches her stated Legendary Actions text) ---
const legendaryActionsHeader = homebrewFeat(
  "homebrew/queen/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Queen can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. She regains spent legendary actions at the start of her turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/queen/legendary-resistance",
  "Legendary Resistance (2/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Queen fails a saving throw, she can choose to succeed instead. Usable twice per day.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 2, max: "2", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/queen/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Queen moves up to her speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryNailAttack = homebrewFeat(
  "homebrew/queen/legendary-nail-attack",
  "Nail Attack (Legendary Action)",
  "icons/commodities/biological/hand-clawed-blue.webp",
  "<p>Costs 1 legendary action. Queen makes one Nail Attack.</p>",
  { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: BOSS_DAMAGE ? [BOSS_DAMAGE] : [], attack: BOSS_ATTACK },
);
const soruStepLegendary = homebrewFeat(
  "homebrew/queen/soru-step-legendary",
  "Soru Step (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Queen teleports 15 feet (a legendary-action use of Soru/Shave).</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const protectTheFamily = homebrewFeat(
  "homebrew/queen/protect-the-family",
  "Protect The Family",
  "icons/magic/defensive/shield-barrier-blue.webp",
  "<p>Legendary Action (Costs 2 Actions): Queen moves up to her speed to become adjacent to an ally and becomes the target of the triggering attack instead.</p>",
  { activation: { type: "legendary", cost: 2 } },
);
const mothersWrath = homebrewFeat(
  "homebrew/queen/mothers-wrath",
  "Mother's Wrath",
  "icons/magic/defensive/barrier-shield-dome-deflect-blue.webp",
  "<p>Reaction: When an ally within her speed is damaged, Queen may move up to her speed toward them (without provoking opportunity attacks) and immediately make a Nail Attack against the attacker, if within reach.</p>",
  { actionType: "mwak", activation: { type: "reaction", cost: 1, condition: "An ally within her speed takes damage" }, damage: BOSS_DAMAGE ? [BOSS_DAMAGE] : [], attack: BOSS_ATTACK },
);

chassis.items = [
  ...chassis.items,
  ...sixPowersAdeptItems, soru, rankyaku,
  legendaryActionsHeader, legendaryResistance, legendaryMove, legendaryNailAttack, soruStepLegendary,
  protectTheFamily, mothersWrath,
];
chassis.system.resources = {
  legact: { value: 3, max: 3 },
  legres: { value: 2, max: 2 },
  lair: { value: false, initiative: null },
};

// --- 5. Explicit proficiency bonus (CR 13 -> +5 per DMG table) ---
chassis.system.attributes.prof = 5;

// --- 6. Fix build-actor.ts's known weaponProf/armorProf/saves gap (same as
// Zenzara) using real Brawler class source data/src/classes/brawler.ts:
// weapons "sim" (simple, incl. improvised/brawler weapons per Brawling),
// saves str/dex. Brawler has NO armor proficiency grant at all (relies on
// Unarmored Defense) — leaving armorProf empty is correct here, not a gap.
chassis.system.traits.weaponProf = { value: ["sim"], custom: "Improvised weapons, brawler weapons" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.dex.proficient = 1;

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
console.log("DROPPED (not requested this rebuild, and prereq-mismatched anyway): Full Body Armament (needs Color of Armament ADEPT, she only reaches Journeyman), Fearsome Fortitude.");
