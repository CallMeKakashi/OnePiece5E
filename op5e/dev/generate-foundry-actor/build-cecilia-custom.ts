// Cecilia Moore: Human Marksman 5 (Bounty Hunter) / Rogue 3 (Thief), level 8, CR 5, Khael Dhamar's right hand in the Sand Rats. Built 2026-10-10.
// Chassis from the real pipeline: specs/cecilia-spec.json (Marksman) + specs/cecilia-rogue-spec.json (the Rogue half, merged here).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import { ricochetRoundsFeatures } from "../../data/src/class-features/additional/ricochet-rounds.js";
import creations from "../../data/src/creations/index.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const PORTRAIT = "one-piece-5e/npcs/Sand Rats/cecilia-new.jpg";
const TOKEN = "one-piece-5e/npcs/Sand Rats/cecilia-new-token.png";
const chassis = JSON.parse(readFileSync(`${ACTORS}/cecilia-chassis.json`, "utf-8"));
const rogue = JSON.parse(readFileSync(`${ACTORS}/cecilia-rogue-part.json`, "utf-8"));
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};

// ---- 1. Merge the Rogue half; drop starting kit that duplicates the Marksman's (her weapons are the pistol, cutlass and dagger)
const ROGUE_FEATS = ["Fast Hands", "Second-story Work", "Expertise", "Sneak Attack", "Thieves' Cant", "Cunning Action", "Steady Aim"];
const base = (chassis.items as Doc[]).filter((i) => !["Arrows (20)", "Crossbow Bolts (20)", "Sling Bullets (20)"].includes(i.name ?? ""));
const have = new Set(base.map((i) => i.name));
const fromRogue = (rogue.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || ROGUE_FEATS.includes(i.name ?? ""));
for (const i of fromRogue) if (i.type === "feat" && i.name === "Expertise") i.name = "Expertise (Rogue)";
const items: Doc[] = [...base, ...fromRogue.filter((i) => !have.has(i.name) || i.type === "class" || i.type === "subclass")];

// ---- 2. Chapter 7 additional power: Ricochet Rounds (no Devil Fruit)
for (const f of ricochetRoundsFeatures) items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc);

// ---- 3. Creations (Marksman 5, half caster, Wisdom): tricks and prepared picks, plus the Bounty Hunter's granted creations
const creation = (name: string, mode: "prepared" | "always") => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  let doc = structuredClone(c) as Doc;
  doc.system.preparation = { mode, prepared: true };
  doc = ensureItemActivities(doc as never) as Doc;
  for (const a of Object.values(doc.system.activities ?? {}) as any[]) if (name === "Guidance" && a.type === "save") { a.type = "utility"; delete a.save; delete a.damage; }
  return embedOwnedItem(doc as never) as Doc;
};
for (const n of ["Spark Bolt", "Guidance", "Draw", "Blazing Bullet", "Shrapnel Shot", "Misty Step", "Pass Without a Trace"]) items.push(creation(n, "prepared"));
for (const n of ["Alacrity", "Zephyr Strike", "Blur", "Branding Smite"]) items.push(creation(n, "always")); // Bounty Hunter Creations, levels 3 and 5

// one Role: Master at Arms, no "No Devil Fruit" placeholder
const seen = new Set<string>();
const clean = items.filter((i) => {
  if (i.name === "No Devil Fruit (yet)") return false;
  if (!i.name?.startsWith("Role: ")) return true;
  if (seen.has(i.name)) return false;
  seen.add(i.name); return true;
});
items.length = 0; items.push(...clean);

const auto = refreshFromPacks(items);
console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
// Rider creations: Sourcebook text, creation save DC = 8 + proficiency + Wisdom
const dc = { calculation: "spellcasting", formula: "" };
const act = (n: string) => Object.values(items.find((i) => i.name === n)!.system.activities as Record<string, any>)[0];
{ const a = act("Shrapnel Shot"); a.type = "save"; a.save = { ability: ["dex"], dc }; a.damage = { onSave: "half", parts: a.damage.parts }; a.target.affects = { count: "", type: "creature", choice: false, special: "target and each creature within 5 ft of it" }; delete a.attack; } // bonus action after a ranged hit, Dex save, 2d6 piercing, half on success
{ const a = act("Branding Smite"); a.type = "damage"; a.damage.critical.allow = false; delete a.attack; } // bonus-action rider on a melee hit: +2d8 radiant, no attack roll of its own
{ const it = items.find((i) => i.name === "Blazing Bullet")!; const b = structuredClone(act("Blazing Bullet")); b.type = "save"; b.name = "Burning (start of target's turn)"; b.activation = { type: "special", value: null, condition: "Start of the ignited target's turn", override: false }; b.consumption = { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false }; b.save = { ability: ["con"], dc }; b.damage.onSave = "none"; b.target.affects = { count: "1", type: "creature", choice: false, special: "" }; b._id = "dnd5eactivity001"; b.sort = 1; it.system.activities[b._id] = b; it.system.description.value += "<p><em>Engine note: dnd5e cannot auto-end an effect on a save success. When the target succeeds on the Burning Con save, or the flames are doused, the creation ends: remove the Burning condition by hand.</em></p>"; } // fail: 1d6 fire; success ends the burning
const summons = standaloneSummons(items, ACTORS, "cecilia");
if (summons.length) console.log(`summon actors written: ${summons.join(", ")}`);

// limited-use features: legacy uses.per -> item uses.recovery (all of these regain on a short rest, which a long rest also covers)
for (const i of items) { const u = i.system?.uses; if (u?.max && ["sr", "lr"].includes(u.per)) { u.recovery = [{ period: u.per === "lr" ? "lr" : "sr", type: "recoverAll" }]; u.per = null; } }

// ---- 4. CR 5 balance feature: a labelled +1d8 to ranged weapon damage
const aim = embedOwnedItem(ensureFeatureActivities({
  _id: generateId("homebrew/cecilia/skirmishers-aim"), name: "Skirmisher's Aim", type: "feat", img: "icons/skills/targeting/crosshair-pointed-orange.webp",
  system: {
    description: { value: "<p>Cecilia fires on the move and rarely wastes a shot. <em>Balance note: bespoke CR 5 feature, not a class feature.</em> Her ranged weapon attacks deal an extra 1d8 damage.</p>", chat: "" },
    source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "class", subtype: "" }, requirements: "",
    activation: { type: "special", cost: null, condition: "Passive" }, duration: { value: null, units: "" }, target: { value: null, width: null, units: "", type: "" },
    range: { value: null, long: null, units: "" }, uses: { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: "", damage: { parts: [], versatile: "" }, save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "", recharge: { value: null, charged: false },
  },
  effects: [{
    _id: generateId("effect/cecilia/skirmishers-aim"), name: "Skirmisher's Aim", img: "icons/skills/targeting/crosshair-pointed-orange.webp", disabled: false, transfer: true,
    changes: [{ key: "system.bonuses.rwak.damage", mode: 2, value: "+1d8", priority: 20 }],
    duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null,
  }],
  flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as FeatureItem) as never) as Doc;
items.push(aim);

// the pipeline embeds starting armour and weapons unequipped
for (const i of items) if (["Leather Armor", "Pistol", "Cutlass"].includes(i.name ?? "") && i.system) i.system.equipped = true;
for (const i of items) if (i.type === "tool") i.system.proficient = i.name === "Thieves' Tools" ? 1 : 1;

// ---- 5. Numbers and proficiencies
const sys = chassis.system;
const abil = { str: 8, dex: 19, con: 15, int: 10, wis: 15, cha: 10 }; // previous scores (incl. +2 Dex at Marksman 4) + Human +1 Dex/Con/Wis (Sourcebook Human trait)
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.dex.proficient = 1; sys.abilities.wis.proficient = 1; // Marksman saves: Dexterity, Wisdom
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { ste: 2, slt: 2, prc: 1, sur: 1, ins: 1, itm: 1, acr: 1, dec: 1, inv: 1, ath: 1 }; // Urchin, Marksman, Master at Arms, Rogue; expertise in Stealth and Sleight of Hand
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt", "med", "shl"], custom: "" };
sys.traits.weaponProf = { value: ["sim", "mar"], custom: "firearms" };
sys.attributes.spellcasting = "wis";
sys.spells = Object.fromEntries([4, 2, 0, 0, 0, 0, 0, 0, 0].map((max, i) => [`spell${i + 1}`, { value: max, max }]));
// CR balance pass: a straight Marksman 5 / Rogue 3 sits under the CR 5 hit point band (131-145), so HP is overridden.
sys.attributes.hp = { value: 123, max: 123, temp: 0, tempmax: 0, formula: "5d10 + 3d8 + 16" }; // real dice; max 123 is the CR balance override
sys.details.cr = 5; sys.details.level = 8;
chassis.items = items;
chassis.name = "Cecilia Moore";
chassis.img = PORTRAIT;
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: TOKEN } };
sys.details.biography.value = "<p>Cecilia Moore, a street-raised Urchin and Khael Dhamar's right hand in the Sand Rats. An agile, pistol-wielding skirmisher who trades her pistol for a cutlass when a fight closes in. Loyal to Khael, but pragmatic.</p><p><strong>Balance note (CR 5):</strong> a straight Marksman 5 / Rogue 3 is under CR 5, so hit points are overridden to 123 and Skirmisher's Aim adds 1d8 to ranged weapon damage.</p>";

writeFileSync(`${ACTORS}/cecilia.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/cecilia.json (${items.length} items)`);
