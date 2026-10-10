// Marine Ensign (Armor Mk IV): Augmented (Cyborg) Gadgeteer 9 (Armorer, Guardian model), Marine/Soldier, Role: Deckhand, CR 7. Built 2026-10-10.
// Chassis from specs/marine-ensign-spec.json. Custom: Cyborg traits, the suit as an equippable Plate Armor (Propulsion Armor applied), Propulsion Gauntlets, feats, CR balance.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import { refreshFromPacks } from "./refresh-from-packs.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const DATA = "D:/foundry-pi/Foundry/foundrydata/Data";
const PORTRAIT = "one-piece-5e/npcs/Marines/marine-ensign-new.jpg";
const TOKEN = "one-piece-5e/npcs/Marines/marine-ensign-new-token.png";
const actor = JSON.parse(readFileSync(`${ACTORS}/marine-ensign-chassis.json`, "utf-8")) as Doc;
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};
const embed = (p: string, name: string, o?: Record<string, unknown>) => embedOwnedItem(pack(p, name) as never, o as never) as Doc;

// ---- 1. Drop chassis loot placeholders and the unused Navy Uniform; add Cyborg traits, feats, Smith's Tools
const DROP = ["Clothes, Common", "Hammer", "Spyglass", "Book", "Navy Uniform"];
actor.items = actor.items.filter((i) => !DROP.includes(i.name ?? ""));
const seen = new Set<string>(); // chassis carries Role: Deckhand twice
actor.items = actor.items.filter((i) => { if (!i.name?.startsWith("Role: ")) return true; if (seen.has(i.name)) return false; seen.add(i.name); return true; });
for (const n of ["Mechanical Improvements", "Integrated Armor", "Integrated Toolbox"]) actor.items.push(embed("racial-features", n));
for (const n of ["Heavy Armor Master", "Shield Master"]) actor.items.push(embed("feats", n)); // level 4 and 8 feats (both taken instead of ASIs)
const smith = embed("items", "Smith's Tools"); smith.system.proficient = 1; actor.items.push(smith);
for (const i of actor.items) if (i.type === "tool") i.system.proficient = 1;

// ---- 2. The suit: Plate Armor (AC 18) as an equippable item, Propulsion Armor applied (+1 AC, +5 ft). Cyborg Integrated Armor adds +1 => AC 20.
const suit = embed("items", "Plate Armor", { equipped: true });
suit.name = "Armor Mk IV Powered Suit"; suit.system.armor = { value: 18, magicalBonus: 1 }; suit.system.properties = [...new Set([...(Array.isArray(suit.system.properties) ? suit.system.properties : []), "mgc"])];
suit.system.description = { value: "<p>The Marines' Mk IV powered suit: blue and black plate with glowing amber seams and a sealed helmet. Plate armor (AC 18, heavy). Propulsion Armor is applied to it (+1 AC, +5 ft walking speed, gauntlets below); Armorer Mechanical Armor attaches it to the wearer. Swap the mod each long rest for Armor of Mechanical Strength (+1 AC, Int for Str checks and saves).</p>", chat: "" };
actor.items.push(suit);
// Propulsion Gauntlets (Armor Mod): melee 1d8 force, thrown 20/60, Int for attack and damage
const g = embed("items", "Club", { equipped: true });
g.name = "Propulsion Gauntlets"; g.img = "icons/weapons/fists/gauntlet-armored-steel.webp";
g.system.description = { value: "<p>Gauntlets of the Propulsion Armor mod. Melee, 1d8 force, thrown (20/60 ft; they detach, strike and return). You use Intelligence for attack and damage rolls.</p>", chat: "" };
g.system.damage = { base: { number: 1, denomination: 8, bonus: "", types: ["force"], custom: { enabled: false, formula: "" }, scaling: { mode: "", number: 1 } } };
g.system.properties = { thr: true }; g.system.range = { value: 5, long: null, units: "ft", reach: 5 }; g.system.attackBonus = ""; g.system.actionType = "mwak"; g.system.proficient = 1;
const act = Object.values(g.system.activities as Record<string, any>)[0];
act.name = "Propulsion Gauntlet"; act.attack.ability = "int"; act.attack.bonus = ""; act.damage.includeBase = true; act.damage.parts = [];
actor.items.push(g);
const laser = actor.items.find((i) => i.name === "Flintlock")!;
laser.name = "Palm Laser Cannon (Flintlock)"; laser.system.equipped = true;
laser.system.description.value += "<p><em>Reflavored: the gauntlet's built-in laser emitter, mechanically a Flintlock.</em></p>";

// ---- 3. CR 7 balance: HP overridden to the band, bespoke +2d6 weapon damage (labelled)
const calib = embedOwnedItem(ensureFeatureActivities({
  _id: generateId("homebrew/marine-ensign/suit-overcharge"), name: "Suit Overcharge", type: "feat", img: "icons/skills/targeting/crosshair-pointed-orange.webp",
  system: {
    description: { value: "<p>The suit's capacitors dump into every strike. <em>Balance note: bespoke CR 7 feature, not a class feature.</em> The Ensign's weapon attacks deal an extra 2d6 damage.</p>", chat: "" },
    source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "class", subtype: "" }, requirements: "",
    activation: { type: "special", cost: null, condition: "Passive" }, duration: { value: null, units: "" }, target: { value: null, width: null, units: "", type: "" },
    range: { value: null, long: null, units: "" }, uses: { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: "", damage: { parts: [], versatile: "" }, save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "", recharge: { value: null, charged: false },
  },
  effects: [{
    _id: generateId("effect/marine-ensign/suit-overcharge"), name: "Suit Overcharge", img: "icons/skills/targeting/crosshair-pointed-orange.webp", disabled: false, transfer: true,
    changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "+2d6", priority: 20 }, { key: "system.bonuses.rwak.damage", mode: 2, value: "+2d6", priority: 20 }],
    duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null,
  }],
  flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as FeatureItem) as never) as Doc;
actor.items.push(calib);

// ---- 4. Numbers: Int 20 Con 16 Dex 14 Str 10 Wis 12 Cha 8, Augmented +2 Con +1 Dex
const sys = actor.system;
const abil = { str: 10, dex: 15, con: 18, int: 20, wis: 12, cha: 8 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.con.proficient = 1; sys.abilities.int.proficient = 1; // Gadgeteer saves
sys.attributes.spellcasting = "int";
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const PROF = new Set(["ath", "acr", "arc", "med"]); // Marine/Soldier, Gadgeteer; Deckhand skills left unchosen on purpose
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: PROF.has(k) ? 1 : 0, ability: ab }]));
sys.attributes.hp = { value: 150, max: 150, temp: 0, tempmax: 0, formula: "9d8 + 36" }; // real about 81; overridden to the CR 7 band (146-160)
sys.details.cr = 7; sys.details.level = 9;
sys.details.biography.value = "<p>A Marine Ensign in the Mk IV powered suit. The people inside the armor are ordinary officers; the suit does the heavy lifting.</p><p><strong>Balance note (CR 7):</strong> a straight Gadgeteer 9 is well under CR 7, so hit points are overridden to 150 and Suit Overcharge adds 2d6 weapon damage. The legacy sheet's flight, legendary actions and Overcharge Beam were dropped on the user's say-so.</p>";
actor.name = "Marine Ensign (Armor Mk IV)";
if (existsSync(`${DATA}/${PORTRAIT}`)) actor.img = PORTRAIT;
if (existsSync(`${DATA}/${TOKEN}`)) actor.prototypeToken = { ...(actor.prototypeToken ?? {}), texture: { ...(actor.prototypeToken?.texture ?? {}), src: TOKEN } };

const r = refreshFromPacks(actor.items);
console.log(`Refreshed ${r.refreshed.length} items; unmatched: ${r.unmatched.join(", ") || "none"}`);
const item = (n: string) => actor.items.find((i) => i.name === n)!;
item("Mods").system.uses = { spent: 0, max: "@scale.gadgeteer.mods-active", recovery: [{ period: "lr", type: "recoverAll" }] };
item("Flash of Genius").system.uses = { spent: 0, max: "1 + @abilities.int.mod", recovery: [{ period: "lr", type: "recoverAll" }] };
writeFileSync(`${ACTORS}/marine-ensign.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/marine-ensign.json (${actor.items.length} items)`);
