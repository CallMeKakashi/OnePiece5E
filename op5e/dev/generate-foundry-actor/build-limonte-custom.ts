import { readFileSync, writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const CHASSIS_PATH = "../Foundry/actors-json/limonte-chassis.json";
const OUT_PATH = "../Foundry/actors-json/limonte.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

function homebrewFeat(idPath: string, name: string, img: string, description: string, itype: "feat" | "weapon", options: {
  actionType?: string;
  activation: { type: string; cost: number | null; condition?: string };
  damage?: [string, string][];
  save?: { ability: string; dc: number | null };
  attack?: { ability: string; bonus: string };
  uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
}): FeatureItem {
  const item: FeatureItem = {
    _id: generateId(idPath),
    name, type: itype, img,
    system: {
      description: { value: description, chat: "" },
      source: { book: "D&D Wiki homebrew (Judge and Jury Pistols), reflavored magic -> Armament Haki per request", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "",
      activation: { type: options.activation.type, cost: options.activation.cost, condition: options.activation.condition ?? "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: 60, long: 120, units: "ft" },
      uses: options.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: options.actionType ?? "",
      damage: { parts: options.damage ?? [], versatile: "" },
      save: options.save ? { ability: options.save.ability, dc: options.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
  return ensureFeatureActivities(item);
}

// --- Reflavor his real Pistol pick as "Jury" (currently carried) ---
function reflavorJury(item: { name: string; system: Record<string, unknown> }) {
  item.name = "Jury";
  const sys = item.system as { description: { value: string } };
  sys.description.value =
    "<p><em>Very Rare, requires attunement. Reflavored from the \"Judge and Jury\" homebrew pistols (D&D Wiki) — Haki-imbued craftsmanship in place of magic, per request.</em></p><p>\"Two shots, one verdict. The first marks the truth, the second delivers the consequence.\" Jury delivers the consequence: on a hit, the target takes an additional 2d10 force damage as Limonte's Armament Haki punches through flesh and bone (the \"verdict\" made manifest). If Limonte is also attuned to Judge, he gains a +1 bonus to attack rolls made with either pistol (\"the best shot in the realm\").</p>";
  const acts = (item.system as { activities?: Record<string, { name?: string; damage?: { parts?: { number: number; denomination: number; bonus: string; types?: string[]; custom?: { enabled: boolean } }[] } }> }).activities;
  if (acts) {
    for (const act of Object.values(acts)) {
      act.name = "Jury";
      const part = act.damage?.parts?.[0];
      if (part) { part.number = 2; part.denomination = 10; part.bonus = "8"; part.types = ["piercing"]; if (part.custom) part.custom.enabled = false; }
    }
  }
  return item;
}
chassis.items = chassis.items.map((it: { name: string }) =>
  it.name === "Pistol" ? reflavorJury(it as never) : it,
);

// --- Reflavor Quarterstaff as his cane ---
function reflavorCane(item: { name: string; system: Record<string, unknown> }) {
  item.name = "Ornate Cane";
  const sys = item.system as { description: { value: string } };
  sys.description.value = "<p>An elegant walking cane with an ornate, claw-like metallic handle — both an accessory and a concealed weapon.</p>";
  const acts = (item.system as { activities?: Record<string, { name?: string }> }).activities;
  if (acts) for (const act of Object.values(acts)) act.name = "Ornate Cane";
  return item;
}
chassis.items = chassis.items.map((it: { name: string }) =>
  it.name === "Quarterstaff" ? reflavorCane(it as never) : it,
);

// --- "Judge" — the pistol he no longer carries (dropped), on the sheet for
// reference per explicit request. Not equipped, no attunement active. ---
const judge = homebrewFeat(
  "homebrew/limonte/judge",
  "Judge (Dropped, Not Carried)",
  "icons/weapons/guns/gun-pistol-flintlock.webp",
  "<p><em>Very Rare, requires attunement. Reflavored from the \"Judge and Jury\" homebrew pistols (D&D Wiki) — Haki-imbued craftsmanship in place of magic, per request. Limonte dropped this weapon and no longer carries it — kept on the sheet for reference/lore, not currently attuned or usable.</em></p><p>\"Two shots, one verdict. The first marks the truth, the second delivers the consequence.\" Judge marks the truth: on a hit, the target must succeed on a DC 15 Wisdom saving throw or be compelled to answer Limonte's next question truthfully (his Observation Haki reading their intent leaves no room to lie).</p>",
  "weapon",
  { actionType: "rwak", activation: { type: "action", cost: 1 }, damage: [["2d10", "piercing"]], save: { ability: "wis", dc: 15 }, attack: { ability: "dex", bonus: "9" } },
);
chassis.items.push(judge);

// --- Legendary actions / resistance ---
const legendaryHeader = homebrewFeat(
  "homebrew/limonte/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Limonte can take 2 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  "feat",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/limonte/legendary-resistance",
  "Legendary Resistance (1/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Limonte fails a saving throw, he can choose to succeed instead.</p>",
  "feat",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 1, max: "1", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/limonte/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Limonte moves up to his speed without provoking opportunity attacks.</p>",
  "feat",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryJury = homebrewFeat(
  "homebrew/limonte/legendary-jury",
  "Jury (Legendary Action)",
  "icons/weapons/guns/gun-pistol-flintlock.webp",
  "<p>Costs 1 legendary action. Limonte makes one Jury attack.</p>",
  "weapon",
  { actionType: "rwak", activation: { type: "legendary", cost: 1 }, damage: [["6d10 + 30", "piercing"]], attack: { ability: "dex", bonus: "9" } },
);
chassis.items.push(legendaryHeader, legendaryResistance, legendaryMove, legendaryJury);
chassis.system.resources = {
  legact: { value: 2, max: 2 },
  legres: { value: 1, max: 1 },
  lair: { value: false, initiative: null },
};

// --- Fix known build-actor.ts gaps: weaponProf/armorProf/saves + equip ---
chassis.system.attributes.prof = 4; // Marksman 12
chassis.system.traits.armorProf = { value: ["lgt", "med", "shl"], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
chassis.system.abilities.str.proficient = 1;
chassis.system.abilities.dex.proficient = 1;
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "equipment" && it.name === "Heavy Longcoat") it.system.equipped = true;
}

// --- Bespoke boss-tier damage on his main attack (Jury) — mandatory
// CR-balance pass. Real output (2 attacks via Extra Attack, Pistol 1d10 +
// DEX5 each) is far under the DMG CR-12 band (~133-149 dpr). Bumped Jury's
// base damage to 6d10 + 30 per hit (~133 across 2 attacks, in-band).
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "weapon" && it.name === "Jury") {
    const acts = (it.system as { activities?: Record<string, { damage?: { parts?: { number: number; denomination: number; bonus: string; custom?: { enabled: boolean } }[] } }> }).activities;
    if (acts) {
      for (const act of Object.values(acts)) {
        const part = act.damage?.parts?.[0];
        if (part) { part.number = 6; part.denomination = 10; part.bonus = "30"; if (part.custom) part.custom.enabled = false; }
      }
    }
  }
}

// CR-balance summary: AC 10+DEX5+shield0(none equipped)=15... target ~17-18
// for CR12 — Heavy Longcoat (14) + DEX5 = 19 once equipped, above target,
// acceptable overshoot. HP 112 (12d10+36, CON16) vs ~161-175 target — needs
// a real fix; see ability bump in spec (CON raised) reflected in the
// rebuilt chassis this script reads from.

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
