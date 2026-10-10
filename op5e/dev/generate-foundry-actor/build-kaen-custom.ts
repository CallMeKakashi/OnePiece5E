// Kaen Solaris: Human Fighter 20 (Samurai), level 20, CR 20, Knight, Master at Arms. Built 2026-10-10.
// Last survivor of the heroes who fought Aegir. Sourcebook has no Paladin, so a plain Samurai Fighter, compendium only, no homebrew (user's choice).
import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { generateId } from "../../data/helpers/id.js";
import { refreshFromPacks, limitedUse } from "./refresh-from-packs.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { toughCustomerFeatures } from "../../data/src/class-features/additional/tough-customer.js";
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/kaen-solaris-chassis.json`, "utf-8"));
const pack = (p: string, id: string): Doc => JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8"));
const embed = (p: string, id: string) => embedOwnedItem(pack(p, id) as never) as Doc;

let items: Doc[] = chassis.items as Doc[];
// Drop chassis leftovers: generic Fighting Style chooser, loot placeholders, duplicate Haki picks (replaced with real tiers below), redundant kit
const DROP = ["Handaxe", "Arrows (20)", "Crossbow Bolts (20)", "No Devil Fruit (yet)", "Conqueror's Haki Novice", "Color of Armament Novice", "Color of Observation Novice"];
items = items.filter((i) => !DROP.includes(i.name ?? "") && !(i.name === "Fighting Style" && i.type === "feat"));
const seen = new Set<string>();
items = items.filter((i) => { if (!i.name?.startsWith("Role: ")) return true; if (seen.has(i.name)) return false; seen.add(i.name); return true; });

items.push(embed("class-features", "1137c1d216636fb9")); // Fighting Style: Defense
// Haki chain as picked: Conqueror's at 8/10/12 (Novice, Apprentice, Journeyman), Armament Novice at 14, Observation Novice at 16
for (const id of ["409ca29b4a12db94", "882fa5d6cef02212", "691d3f9d84866b56", "16bc2636849312ce", "96dcda2a40ae256f"]) items.push(embed("class-features", id));
// Level 4/6/8/12/14/16/19 feats (all taken instead of ASIs)
for (const id of ["4eea1b8aa9ac99ab", "83ba322751ee4f40", "2003c84be4cdc61f", "f7de2d5787ab5e64", "b3025a4edc8d1c58", "3fbf1369c90665d7", "6986ef01137f143d"]) items.push(embed("feats", id));
// Knight tool: Calligrapher's Supplies
const cal = embed("items", "6f4b655fdf8c31e0"); cal.system.proficient = 1; items.push(cal);

const auto = refreshFromPacks(items);
for (const n of ["Action Surge", "Indomitable"]) { const it = items.find((i) => i.name === n); if (it?.system?.uses?.max) it.system.uses.max = `${it.system.uses.max} + 1`; } // Active Combatant: one additional use of each
{ const u = items.find((i) => i.name === "Undying Devotion"); if (u) limitedUse(u, { max: "@abilities.con.mod", per: "lr", type: "special", condition: "reduced to 0 hit points but not killed outright" }); } // Con modifier uses, long rest
console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);

for (const i of items) if (["Chain Mail", "Shield", "Longsword"].includes(i.name ?? "") && i.system) i.system.equipped = true;

// ---- Numbers. Standard array maxed (20/14/20/12/14/16) + Human trait +1 Str/Con/Cha; every ASI was a feat, so the +1 feat bumps (cap 20) add nothing.
const sys = chassis.system;
const abil = { str: 21, dex: 14, con: 21, int: 12, wis: 14, cha: 17 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
for (const k of ["str", "con", "wis", "cha"]) sys.abilities[k].proficient = 1; // Fighter Str/Con, Elegant Courtier Wis, Unyielding Charisma Cha
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { rel: 1, his: 1, ins: 1, prc: 1, itm: 1, per: 1 }; // Knight Rel/His; Fighter Ins/Prc; Master at Arms Itm; Samurai Per
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
sys.traits.weaponProf = { value: ["sim", "mar"], custom: "" };

// ---- CR balance pass (CR 20 band: AC 19, HP 311-325, attack +10, damage/round 123-140, DC 19)
// AC: chain mail 16 + shield 2 + Defense 1 = 19 (in band). Attack: +6 prof +5 Str +1 Longsword Master = +12.
// HP: Fighter 20 at Con 21 is 224, 87 under the band, so overridden to 318.
sys.attributes.hp = { value: 318, max: 318, temp: 0, tempmax: 0, formula: "20d10 + 100" };
// DPR: real Longsword 1d8 + 5 x4 attacks is ~38/round. Relic Icarus below is tuned to ~126/round (3d8 + 8 slashing + 2d8 radiant, x4).
const clone = (o: any) => JSON.parse(JSON.stringify(o));
const sentinel = items.find((i) => i.name === "Sentinel")!;
const utility = (name: string, activation: string, roll = "") => { const a = clone(Object.values(sentinel.system.activities)[0]); a._id = generateId(`homebrew/kaen-solaris/${name}`); a.name = name; a.activation.type = activation; a.roll.formula = roll; return a; };
const relicFx = (name: string, changes: any[]) => ({ _id: generateId(`homebrew/kaen-solaris/${name}-fx`), name, img: "icons/svg/upgrade.svg", changes: changes.map(([key, mode, value]) => ({ key, mode, value, priority: 20 })), disabled: false, duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, transfer: true, flags: {}, statuses: [], tint: null });
const relic = (it: Doc, name: string, text: string) => { it.name = name; it.system.rarity = "legendary"; it.system.description.value = `<p><strong>Relic of the ancient times.</strong> ${text}</p>`; };

// Icarus: +3 relic Longsword, +2d8 radiant, bonus action light. Offence comes out at +15 to hit (band +10), a known overshoot kept for the relic's +3.
const ls = items.find((i) => i.name === "Longsword")!;
relic(ls, "Icarus", "A +3 longsword. Hits deal an extra 2d8 radiant damage. As a bonus action you can make it shed bright light in a 30-foot radius (dim 30 ft beyond), or douse it. Bespoke damage bump (3d8 + 8 slashing) to reach CR 20; the real longsword is 1d8 + 5.");
ls.system.properties = { ...(ls.system.properties ?? {}), mgc: true };
const part = (number: number, denomination: number, bonus: string, type: string) => ({ number, denomination, bonus, types: [type], custom: { enabled: false, formula: "" }, scaling: { mode: "", number: null, formula: "" } });
for (const a of Object.values(ls.system.activities ?? {}) as any[]) {
  a.name = "Icarus";
  a.attack = { ...(a.attack ?? {}), bonus: "3" };
  a.damage.parts = [part(3, 8, "8", "slashing"), part(2, 8, "", "radiant")]; // 8 = Str 5 + relic +3
}
ls.system.damage = { base: { number: 3, denomination: 8, bonus: "8", types: ["slashing"], custom: { enabled: false, formula: "" }, scaling: { mode: "", number: 1 } } };
const light = utility("Icarus: Shed Light", "bonus"); ls.system.activities[light._id] = light;

// Aegis of Sol: chain mail relic, resistance to radiant while worn
const mail = items.find((i) => i.name === "Chain Mail")!;
relic(mail, "Aegis of Sol", "Chain mail (AC 16, heavy). You have resistance to radiant damage while wearing it.");
mail.effects = [relicFx("Aegis of Sol: radiant resistance", [["system.traits.dr.value", 2, "radiant"]])];

// Bulwark of Sol: shield relic with a reaction
const shield = items.find((i) => i.name === "Shield")!;
relic(shield, "Bulwark of Sol", "A shield (+2 AC). <em>Guardian's Interposition (reaction):</em> when a creature you can see within 5 feet of you is hit by an attack, you can take the damage instead, reduced by 1d10 + your proficiency bonus (minimum 0).");
const interpose = utility("Guardian's Interposition", "reaction", "1d10 + @prof"); shield.system.activities = { ...(shield.system.activities ?? {}), [interpose._id]: interpose };
sys.details.cr = 20; sys.details.level = 20;
chassis.items = items;
chassis.name = "Kaen Solaris";
chassis.img = "one-piece-5e/npcs/Guardians of Sol/kaen-new.jpg";
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Guardians of Sol/kaen-new-token.png" } };
sys.details.biography.value = "<p>Kaen Solaris, last surviving hero of the company that fought the great evil Aegir.</p><p><strong>Balance note (CR 20):</strong> Sourcebook has no Paladin, so he is a Fighter 20 (Samurai). HP overridden to 318 (real formula 224) and relic sword Icarus (+3, 3d8 + 8 slashing + 2d8 radiant) tuned to about 126 damage a round, +15 to hit (band +10). Armour Aegis of Sol, shield Bulwark of Sol. Conqueror's Haki DC is 17 (band expects 19); not raised, CHA stays human.</p>";

// Chapter 7 additional power (no Devil Fruit): Tough Customer, chosen by the user 2026-10-10
for (const f of toughCustomerFeatures) chassis.items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc);
writeFileSync(`${ACTORS}/kaen-solaris.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/kaen-solaris.json (${items.length} items)`);
