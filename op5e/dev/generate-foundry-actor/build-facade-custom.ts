// Facade: Artificial Human (Augmented) Gadgeteer 10 (Artillerist), Smuggler, Scholar, Ricochet Rounds, CR 8. Restarted 2026-10-10.
// Chassis comes from the real pipeline (specs/facade-spec.json). Custom: Ricochet Rounds, Alchemist's Supplies, Armament Apprentice, CR balance.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import { ricochetRoundsFeatures } from "../../data/src/class-features/additional/ricochet-rounds.js";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const PORTRAIT = "one-piece-5e/npcs/Gentle Giant Pirates/facade.png"; // placeholder until new art is approved
const TOKEN = "one-piece-5e/npcs/Gentle Giant Pirates/facade-token.png";
const actor = JSON.parse(readFileSync(`${ACTORS}/facade-chassis.json`, "utf-8")) as Doc;
const pack = (p: string, name: string): Doc => {
  const dir = `packs-src/${p}`;
  for (const f of readdirSync(dir)) {
    const d = JSON.parse(readFileSync(`${dir}/${f}`, "utf-8"));
    if (d.name === name) return d;
  }
  throw new Error(`${p}/${name} not found`);
};

// ---- 1. Chapter 7 additional power: Ricochet Rounds (no Devil Fruit); the "No Devil Fruit (yet)" placeholder item goes
actor.items = actor.items.filter((i) => i.name !== "No Devil Fruit (yet)");
for (const f of ricochetRoundsFeatures) actor.items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc);

// ---- 2. Alchemist's Supplies (the pipeline only offers a wildcard for the artisan's tool pick)
const alch = embedOwnedItem(pack("items", "Alchemist's Supplies") as never) as Doc;
alch.system.proficient = 1;
actor.items.push(alch);
for (const i of actor.items) if (i.type === "tool") i.system.proficient = 1;

// ---- 3. Haki: two Armament Novice picks stand for "Novice then Apprentice"
const novice = actor.items.filter((i) => i.name === "Color of Armament Novice");
if (novice.length === 2) actor.items.splice(actor.items.indexOf(novice[1]), 1, embedOwnedItem(pack("class-features", "Color of Armament Apprentice") as never) as Doc);

// ---- 4. One Role: Scholar
const seen = new Set<string>();
actor.items = actor.items.filter((i) => {
  if (!i.name?.startsWith("Role: ")) return true;
  if (seen.has(i.name)) return false;
  seen.add(i.name); return true;
});

// ---- 5. CR 8 balance: HP to the DMG band (176-190) and a labelled bespoke ranged-damage feature
const targeting = embedOwnedItem(ensureFeatureActivities({
  _id: generateId("homebrew/facade/ohm-targeting-suite"), name: "OHM Targeting Suite", type: "feat", img: "icons/skills/targeting/crosshair-pointed-orange.webp",
  system: {
    description: { value: "<p>OHM calculates every shot. <em>Balance note: bespoke CR 8 feature, not a class feature.</em> Facade's ranged weapon attacks deal an extra 2d6 damage.</p>", chat: "" },
    source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "class", subtype: "" }, requirements: "",
    activation: { type: "special", cost: null, condition: "Passive" }, duration: { value: null, units: "" }, target: { value: null, width: null, units: "", type: "" },
    range: { value: null, long: null, units: "" }, uses: { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: "", damage: { parts: [], versatile: "" }, save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "", recharge: { value: null, charged: false },
  },
  effects: [{
    _id: generateId("effect/facade/ohm-targeting-suite"), name: "OHM Targeting Suite", img: "icons/skills/targeting/crosshair-pointed-orange.webp", disabled: false, transfer: true,
    changes: [{ key: "system.bonuses.rwak.damage", mode: 2, value: "+2d6", priority: 20 }],
    duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null,
  }],
  flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as FeatureItem) as never) as Doc;
actor.items.push(targeting);

// ---- 5b. Armour: the build carries no real armour (only a loot vest), so a pack Leather Armor is reflavoured as a bespoke cyborg shell, light armour with base AC 14, to put AC in the CR 8 band
const shell = embedOwnedItem(pack("items", "Leather Armor") as never, { equipped: true }) as Doc;
shell.name = "Reinforced Cyborg Shell"; shell.system.armor = { value: 14 };
shell.system.description = { value: "<p>Plated necrotech over a leather-lined frame. Light armour, base AC 14. <em>Balance note: bespoke AC so Facade reaches the CR 8 band.</em></p>", chat: "" };
actor.items.push(shell);

// ---- 6. Numbers
const sys = actor.system;
sys.attributes.spellcasting = "int";
sys.abilities.con.proficient = 1; sys.abilities.int.proficient = 1; // Gadgeteer saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const PROF = new Set(["slt", "acr", "arc", "inv", "nat", "ste"]); // Smuggler, Gadgeteer, Scholar
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: PROF.has(k) ? 1 : 0, ability: ab }]));
sys.attributes.hp = { value: 183, max: 183, temp: 0, tempmax: 0, formula: "10d8 + 30" }; // real formula gives about 83; overridden to 183 for CR 8 (DMG hp 176-190)
sys.details.cr = 8; sys.details.level = 10;
sys.details.biography.value = "<p>Facade is an undead cyborg shell animated and directed by OHM, an onboard AI, recruited into the Gentle Giant Pirates by Malak. Operation: Facade.</p><p><strong>Balance note (CR 8):</strong> a straight Gadgeteer 10 is well under CR 8, so hit points are overridden to 183 and OHM Targeting Suite adds 2d6 damage to ranged weapon attacks.</p>";
actor.name = "Facade";
actor.img = PORTRAIT;
actor.prototypeToken = { ...(actor.prototypeToken ?? {}), texture: { ...(actor.prototypeToken?.texture ?? {}), src: TOKEN } };

const refreshed = refreshFromPacks(actor.items);
console.log(`Refreshed ${refreshed.refreshed.length} Facade items; unmatched: ${refreshed.unmatched.join(", ") || "none"}`);
const summons = standaloneSummons(actor.items, ACTORS, "facade"); // Mechanical Cannon summon becomes a standalone actor, import it first with --keep-id
console.log(`Summon files: ${summons.join(", ") || "none"}`);
writeFileSync(`${ACTORS}/facade.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/facade.json (${actor.items.length} items)`);
