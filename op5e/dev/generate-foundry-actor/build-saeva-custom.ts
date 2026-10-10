// Saeva "Longcast" Virell: Human Fighter 5 (Champion) / Barbarian 3 (Blade Master), level 8, CR 5, Sharkfin Pirates harpooner. Built 2026-10-10.
// Chassis from the real pipeline: specs/saeva-spec.json (Fighter) + specs/saeva-barbarian-spec.json (the Barbarian half, merged here). Compendium only.
import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { fearsomeFortitudeFeatures } from "../../data/src/class-features/additional/fearsome-fortitude.js";
const ACTORS = "../Foundry/actors-json";
const PORTRAIT = "one-piece-5e/npcs/SharkFin Pirates/saeva-new.jpg";
const TOKEN = "one-piece-5e/npcs/SharkFin Pirates/saeva-new-token.png";
const chassis = JSON.parse(readFileSync(`${ACTORS}/saeva-chassis.json`, "utf-8"));
const barb = JSON.parse(readFileSync(`${ACTORS}/saeva-barbarian-part.json`, "utf-8"));
const pack = (p: string, id: string): Doc => JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8"));
const embed = (p: string, id: string) => embedOwnedItem(pack(p, id) as never) as Doc;

// ---- 1. Merge the Barbarian half (no Unarmored Defense, she wears armour); drop kit the Fighter side makes redundant
const BARB_FEATS = ["Masterful Hew", "Cleaving Hew", "Crushing Hew", "Savage Hew", "Sprinting Hew", "Rage", "Reckless Attack", "Danger Sense", "Primal Knowledge"];
const fromBarb = (barb.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || BARB_FEATS.includes(i.name ?? "") || i.name === "Javelin");
const DROP = ["Handaxe", "Arrows (20)", "Crossbow Bolts (20)", "Longbow", "No Devil Fruit (yet)"];
const items: Doc[] = [...(chassis.items as Doc[]).filter((i) => !DROP.includes(i.name ?? "")), ...fromBarb];

// ---- 2. Fighting styles: Fighter Dueling, Fighting Initiate Defense, Blade Master Versatile Fighting; Scimitar Master (level 4 ASI); Armament Novice
const fs = items.findIndex((i) => i.name === "Fighting Style" && i.type === "feat" && /one of the following options/.test(i.system.description.value));
if (fs >= 0) items.splice(fs, 1, embed("class-features", "e9178a9c2b55cc91")); // Fighting Style: Dueling (Fighter)
items.push(embed("class-features", "ab64448d42de5b44")); // Fighting Style: Versatile Fighting (Blade Master)
items.push(embed("class-features", "1137c1d216636fb9")); // Fighting Style: Defense (via Fighting Initiate)
items.push(embed("feats", "fd72cbbb04d52bf2")); // Scimitar Master
items.push(embed("class-features", "16bc2636849312ce"));

// one Role: Deckhand
const seen = new Set<string>();
const clean = items.filter((i) => {
  if (!i.name?.startsWith("Role: ")) return true;
  if (seen.has(i.name)) return false;
  seen.add(i.name); return true;
});
items.length = 0; items.push(...clean);

const auto = refreshFromPacks(items);
console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
standaloneSummons(items, ACTORS, "saeva");

// Rage toggle (no pack/other-builder Rage effect exists; same style as Reckless Attack: disabled transfer effect)
const fx = (name: string, changes: any[]) => ({ _id: Math.random().toString(16).slice(2, 18).padEnd(16, "0"), name, img: "icons/svg/upgrade.svg", changes: changes.map(([key, mode, value]) => ({ key, mode, value, priority: 20 })), disabled: true, duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, transfer: true, flags: { dae: { transfer: true, stackable: "noneName" } }, statuses: [], tint: null });
const rage = items.find((i) => i.name === "Rage");
// Sourcebook Rage: damage bonus = proficiency bonus, Strength melee weapon attacks only (mwak bonus can't filter by ability); uses = scale.barbarian.rages (3 at Barbarian 3)
if (rage) rage.effects = [fx("Rage: +prof melee damage (Str attacks only), B/P/S resistance, advantage on Str checks and saves", [
  ["system.bonuses.mwak.damage", 2, "+@prof"],
  ["system.traits.dr.value", 2, "bludgeoning"], ["system.traits.dr.value", 2, "piercing"], ["system.traits.dr.value", 2, "slashing"],
  ["flags.midi-qol.advantage.ability.check.str", 5, "1"], ["flags.midi-qol.advantage.ability.save.str", 5, "1"]])];
// Scimitar Master: +1 to scimitar attack rolls, scoped to the Scimitar's own attack activity
const scim = items.find((i) => i.name === "Scimitar");
const scimAct = scim && Object.values(scim.system.activities ?? {}).find((a: any) => a.type === "attack") as any;
if (scimAct) scimAct.attack = { ...(scimAct.attack ?? {}), bonus: "1" };

// Deckhand tool proficiency: one artisan's tool kit (player pick: Cook's Utensils)
const cook = embed("items", "2266c1e83f216c5e"); cook.system.proficient = 1; items.push(cook);
// Primal Knowledge: Sourcebook grants a skill at 3rd AND 7th level (pack text omits the 7th)
const pk = items.find((i) => i.name === "Primal Knowledge");
if (pk) pk.system.description.value = pk.system.description.value.replace("When you reach 3rd level, you", "When you reach 3rd level and again at 7th level, you");

for (const i of items) if (["Leather Armor", "Scimitar", "Shield", "Javelin"].includes(i.name ?? "") && i.system) i.system.equipped = true;

// ---- 3. Numbers and proficiencies
const sys = chassis.system;
const abil = { str: 18, dex: 15, con: 18, int: 8, wis: 12, cha: 10 }; // Human trait +1 Str/Dex/Con; Free Diver +1 Con; Fighting Initiate +1 Str; Scimitar Master took the level 4 ASI
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.con.proficient = 1; // Fighter saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { ath: 2, nat: 1, acr: 1, sur: 1, prc: 1, ani: 1, itm: 1 }; // Sailor Ath/Nat; Fighter Acr/Sur; Deckhand Prc + Animal Handling; Barbarian Primal Knowledge Intimidation; Champion Physical Superiority (Str) gives Athletics expertise
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
sys.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
// CR balance pass: Fighter 5 / Barbarian 3 sits under the CR 5 hit point band (131-145), so HP is overridden.
sys.attributes.hp = { value: 138, max: 138, temp: 0, tempmax: 0, formula: "5d10 + 3d12 + 32" };
sys.details.cr = 5; sys.details.level = 8;
chassis.items = items;
chassis.name = "Saeva Virell";
chassis.img = PORTRAIT;
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: TOKEN } };
sys.details.biography.value = "<p>Saeva \"Longcast\" Virell, harpooner of the Sharkfin Pirates: a sailor with a scimitar, a shield and a javelin thrown like a harpoon.</p><p><strong>Balance note (CR 5):</strong> a straight Fighter 5 / Barbarian 3 is under CR 5 on hit points, so HP is overridden to 138.</p>";

// Chapter 7 additional power (no Devil Fruit): Fearsome Fortitude, chosen by the user 2026-10-10
for (const f of fearsomeFortitudeFeatures) chassis.items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc);
writeFileSync(`${ACTORS}/saeva.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/saeva.json (${items.length} items)`);
