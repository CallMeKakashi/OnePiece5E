import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { cannonballChuckerFeatures } from "../../data/src/class-features/additional/cannonball-chucker.js";

const CHASSIS_PATH = "../Foundry/actors-json/bosco-chassis.json";
const OUT_PATH = "../Foundry/actors-json/bosco.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

// --- 1. Cannonball Chucker (additional power, explicitly requested). Real
// prereq is "Fighting Style: Thrown Weapon Fighting" — Brawler has no
// Fighting Style grant anywhere in this class, so the prereq is technically
// unmet. Including it anyway per explicit instruction; flagged, not hidden. ---
const powerItems = cannonballChuckerFeatures.map((f) => embedOwnedItem(f as never));
chassis.items = [...chassis.items, ...powerItems];

// --- 2. Reflavor Brawler Unarmed Strike as "Brass Knuckles", with a modest
// boss-tier-adjacent damage bump. Real class output (1d8 + 5, x2 Extra
// Attack + x2 Flurry of Blows = ~38 dpr) undershoots DMG's CR-10 band
// (~101-116), same pattern as Queen/Cedro/Nerolo, but Bosco is a "defender"
// support-tank lieutenant rather than a solo boss, so the bump here is
// moderate (not pushed all the way to the full band) — prioritizes his real
// tankiness (Sumo Wrestler stances, high HP/AC) over matching a solo-boss
// damage curve he isn't designed to fill.
function reflavorBrassKnuckles(item: { name: string; system: Record<string, unknown> }) {
  item.name = "Brass Knuckles";
  const sys = item.system as { description: { value: string } };
  sys.description.value =
    "<p>Bosco's weighted brass knuckles replace his unarmed strikes, dealing bludgeoning damage. <em>Bespoke boss-tier damage bump (3d8 + 13) over the real 1d8 + 5 Brawling-die scaling, pushed to CR 10 per request.</em></p>";
  const acts = (item.system as { activities?: Record<string, { name?: string; damage?: { parts?: { number: number; denomination: number; bonus: string; types?: string[]; custom?: { enabled: boolean; formula: string } }[] } }> }).activities;
  if (acts) {
    for (const act of Object.values(acts)) {
      act.name = "Brass Knuckles";
      const part = act.damage?.parts?.[0];
      if (part) {
        part.number = 3; part.denomination = 8; part.bonus = "13"; part.types = ["bludgeoning"];
        // The source item had custom.enabled=true with the real brawling-die
        // formula — that would silently override number/denomination/bonus
        // in Foundry if left in place. Must disable it for the bump to apply.
        if (part.custom) { part.custom.enabled = false; part.custom.formula = ""; }
      }
    }
  }
  return item;
}
chassis.items = chassis.items.map((it: { name: string }) =>
  it.name === "Brawler Unarmed Strike" ? reflavorBrassKnuckles(it as never) : it,
);

// --- 3. Fix known build-actor.ts gaps: weaponProf/armorProf/saves, using
// real Brawler class data (weapons simple, no armor grant, saves str/dex). ---
chassis.system.attributes.prof = 4; // Brawler 10
chassis.system.traits.armorProf = { value: [], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim"], custom: "Improvised weapons, brawler weapons" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.dex.proficient = 1;

// --- 4. Push to CR 10 (explicit request). AC/DPR reach the band through
// real ability scores and the weapon damage bump above, but HP cannot: even
// an implausible CON (30+) can't get a 10-hit-die character's real formula
// into the CR-10 band (~161-175) — the math caps out around 145 at CON 30.
// Flat-overriding hp.value/max here, same class of documented departure as
// the weapon damage bump, just applied to HP instead since stats alone
// can't do it at this character level.
chassis.system.attributes.hp.value = 168;
chassis.system.attributes.hp.max = 168;
chassis.system.details.cr = 10;

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
