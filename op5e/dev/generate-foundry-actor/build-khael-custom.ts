// Khael Dhamar: Human Fighter 5 (Champion) / Rogue 3 (Thief), level 8, CR 5, leader of the Sand Rats. Built 2026-10-10.
// Chassis from the real pipeline: specs/khael-spec.json (Fighter) + specs/khael-rogue-spec.json (the Rogue half, merged here).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const PORTRAIT = "one-piece-5e/npcs/Sand Rats/khael-new.jpg";
const TOKEN = "one-piece-5e/npcs/Sand Rats/khael-new-token.png";
const chassis = JSON.parse(readFileSync(`${ACTORS}/khael-chassis.json`, "utf-8"));
const rogue = JSON.parse(readFileSync(`${ACTORS}/khael-rogue-part.json`, "utf-8"));
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};

// ---- 1. Merge the Rogue half; drop starting kit that duplicates the Fighter's (his weapons are the Fighter scimitars and longbow)
const ROGUE_FEATS = ["Fast Hands", "Second-story Work", "Expertise", "Sneak Attack", "Thieves' Cant", "Cunning Action", "Steady Aim"];
const fromRogue = (rogue.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || ROGUE_FEATS.includes(i.name ?? "") || i.name === "Thieves' Tools");
for (const i of fromRogue) if (i.type === "feat" && i.name === "Expertise") i.name = "Expertise (Rogue)";
const DROP = ["Handaxe", "Crossbow Bolts (20)"];
const items: Doc[] = [...(chassis.items as Doc[]).filter((i) => !DROP.includes(i.name ?? "")), ...fromRogue];

// ---- 2. Dual Wielder (level 4 ASI), Two-Weapon Fighting (Multiple Weapon Style needs it), the Chapter 7 power, Armament Novice
items.push(embedOwnedItem(pack("feats", "Dual Wielder") as never) as Doc);
const fs = items.findIndex((i) => i.name === "Fighting Style" && i.type === "feat");
if (fs >= 0) items.splice(fs, 1, embedOwnedItem(pack("class-features", "Fighting Style: Two-Weapon Fighting") as never) as Doc);
for (const n of ["Multiple Weapon Style", "Additional Strike"]) items.push(embedOwnedItem(pack("class-features", n) as never) as Doc);
items.push(embedOwnedItem(pack("class-features", "Color of Armament Novice") as never) as Doc);

// one Role: Captain, no "No Devil Fruit" placeholder
const seen = new Set<string>();
const clean = items.filter((i) => {
  if (i.name === "No Devil Fruit (yet)") return false;
  if (!i.name?.startsWith("Role: ")) return true;
  if (seen.has(i.name)) return false;
  seen.add(i.name); return true;
});
items.length = 0; items.push(...clean);

// automation from the built packs first (see refresh-from-packs.ts)
const auto = refreshFromPacks(items);
console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
const summons = standaloneSummons(items, ACTORS, "khael");
if (summons.length) console.log(`summon actors written: ${summons.join(", ")}`);

// limited-use features: legacy uses.per -> item uses.recovery (all of these regain on a short rest, which a long rest also covers)
for (const i of items) { const u = i.system?.uses; if (u?.max && ["sr", "lr"].includes(u.per)) { u.recovery = [{ period: u.per === "lr" ? "lr" : "sr", type: "recoverAll" }]; u.per = null; } }

// ---- 3. CR 5 balance feature: a labelled +1d8 to weapon damage
const edge = embedOwnedItem(ensureFeatureActivities({
  _id: generateId("homebrew/khael/liberators-edge"), name: "Liberator's Edge", type: "feat", img: "icons/skills/melee/blade-tips-double-blue.webp",
  system: {
    description: { value: "<p>Years of guarding caravans and years of atonement have given Khael a killer's economy of motion. <em>Balance note: bespoke CR 5 feature, not a class feature.</em> His melee weapon attacks deal an extra 1d8 damage.</p>", chat: "" },
    source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "class", subtype: "" }, requirements: "",
    activation: { type: "special", cost: null, condition: "Passive" }, duration: { value: null, units: "" }, target: { value: null, width: null, units: "", type: "" },
    range: { value: null, long: null, units: "" }, uses: { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: "", damage: { parts: [], versatile: "" }, save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "", recharge: { value: null, charged: false },
  },
  effects: [{
    _id: generateId("effect/khael/liberators-edge"), name: "Liberator's Edge", img: "icons/skills/melee/blade-tips-double-blue.webp", disabled: false, transfer: true,
    changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "+1d8", priority: 20 }],
    duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null,
  }],
  flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as FeatureItem) as never) as Doc;
items.push(edge);

// the pipeline embeds starting armour and weapons unequipped
for (const i of items) if (["Leather Armor", "Scimitar", "Longbow"].includes(i.name ?? "") && i.system) i.system.equipped = true;
for (const i of items) if (i.type === "tool") i.system.proficient = i.name === "Thieves' Tools" ? 2 : 1;

// ---- 4. Numbers and proficiencies
const sys = chassis.system;
const abil = { str: 15, dex: 17, con: 15, int: 10, wis: 12, cha: 10 }; // Human trait +1 Str/Dex/Con; Dual Wielder took the level 4 ASI, so no ability bump
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.con.proficient = 1; // Fighter saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { acr: 1, slt: 2, prc: 1, sur: 1, per: 1, ins: 1, itm: 1, ste: 2, dec: 1, inv: 1, ath: 2 }; // Smuggler, Fighter, Captain, Rogue; Rogue expertise in Stealth (and thieves' tools), Quick Fingers expertise in Sleight of Hand // Physical Superiority (Champion 3): Strength, so Athletics proficiency becomes expertise
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
sys.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
// CR balance pass: a straight Fighter 5 / Rogue 3 sits well under the CR 5 hit point band (131-145), so HP is overridden.
sys.attributes.hp = { value: 138, max: 138, temp: 0, tempmax: 0, formula: "5d10 + 3d8 + 16" };
sys.details.cr = 5; sys.details.level = 8;
chassis.items = items;
chassis.name = "Khael Dhamar";
chassis.img = PORTRAIT;
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: TOKEN } };
sys.details.biography.value = "<p>Khael Dhamar, a tall, lean Alabastan with sun-scarred skin and dark-red eyes, leader of the Sand Rats. He once guarded royal caravans, then smuggled slaves for coin until a fellow guard sold his wife Layla and daughter Samira into bondage and left him for dead. Now he frees the slaves he once sold. Twin talwars (statted as scimitars), tattered desert robes and scavenged naval gear.</p><p><strong>Balance note (CR 5):</strong> a straight Fighter 5 / Rogue 3 is under CR 5, so hit points are overridden to 138 and Liberator's Edge adds 1d8 to melee weapon damage.</p>";

writeFileSync(`${ACTORS}/khael.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/khael.json (${items.length} items)`);
