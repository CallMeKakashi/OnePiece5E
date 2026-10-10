// Drez Crown: Human Marksman 10 (Sniper), Marine/Soldier, Role: Captain, no fruit, CR 10. Captain of G-45. Built 2026-10-10.
// Chassis from specs/drez-spec.json. Custom: Archery style, Holo-Decoy (replaces the legacy Copy-Copy Clone), Canny expertise, scores, HP override.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import { refreshFromPacks } from "./refresh-from-packs.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const DATA = "D:/foundry-pi/Foundry/foundrydata/Data";
const PORTRAIT = "one-piece-5e/npcs/Marines/drez-new.jpg";
const TOKEN = "one-piece-5e/npcs/Marines/drez-new-token.png";
const actor = JSON.parse(readFileSync(`${ACTORS}/drez-chassis.json`, "utf-8")) as Doc;
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};
const embed = (p: string, name: string, o?: Record<string, unknown>) => embedOwnedItem(pack(p, name) as never, o as never) as Doc;

// ---- 1. Drop placeholders and ammo he does not use; dedupe Role; swap the generic Fighting Style for Archery
const DROP = ["Clothes, Common", "Pirate Flag", "Spyglass", "Arrows (20)", "Crossbow Bolts (20)", "Sling Bullets (20)", "No Devil Fruit (yet)", "Navy Uniform", "Fighting Style"];
actor.items = actor.items.filter((i) => !DROP.includes(i.name ?? ""));
const seen = new Set<string>(); // the pipeline embeds the role twice
actor.items = actor.items.filter((i) => { if (!i.name?.startsWith("Role: ")) return true; if (seen.has(i.name)) return false; seen.add(i.name); return true; });
actor.items.push(embed("class-features", "Fighting Style: Archery"));
for (const i of actor.items) {
  if (["Musket", "Dagger", "Heavy Longcoat"].includes(i.name ?? "")) i.system.equipped = true; // Heavy Longcoat: medium, 14 + Dex (max 2) = AC 16
  if (i.type === "tool") i.system.proficient = 1;
}

// ---- 2. Holo-Decoy: stands in for the legacy Copy-Copy Clone (user's choice: a gadget, not a fruit)
const decoy = embedOwnedItem(ensureFeatureActivities({
  _id: generateId("homebrew/drez-crown/holo-decoy"), name: "Holo-Decoy", type: "feat", img: "icons/magic/control/silhouette-hold-beam-blue.webp",
  system: {
    description: { value: "<p>As a bonus action, Drez deploys a holographic decoy of himself within 60 feet. For 1 minute (or until the decoy is hit) attacks against Drez have disadvantage unless the attacker takes an action to pick out the real one (DC 16 Intelligence (Investigation)). <em>Replaces the legacy Copy-Copy Clone; bespoke Blood &amp; Brine feature.</em></p>", chat: "" },
    source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "class", subtype: "" }, requirements: "",
    activation: { type: "bonus", cost: 1, condition: "" }, duration: { value: "1", units: "minute" }, target: { value: null, width: null, units: "", type: "" },
    range: { value: 60, long: null, units: "ft" }, uses: { value: null, max: "2", per: "sr", recovery: "", prompt: true },
    actionType: "", damage: { parts: [], versatile: "" }, save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "", recharge: { value: null, charged: false },
  },
  effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as FeatureItem) as never) as Doc;
actor.items.push(decoy);

// ---- 3. Numbers: 15/14/13/12/10/8 point-buy on Dex/Con/Wis/Int/Cha/Str, Human +1 all, Light Armor Master Dex +1, L4 ASI Dex +2, L8 ASI Dex +1 and Wis +1
const sys = actor.system;
const abil = { str: 9, dex: 20, con: 15, int: 13, wis: 15, cha: 11 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.dex.proficient = 1; // Marksman saves
sys.attributes.spellcasting = "dex"; // Sniper Creations creative ability left on the class default
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { prc: 2, ste: 2, acr: 1, inv: 1, ins: 1, itm: 1 }; // 2 = expertise (Canny: Perception, Stealth)
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.attributes.hp = { value: 165, max: 165, temp: 0, tempmax: 0, formula: "10d10 + 20" }; // override (user's choice; real about 95). DMG CR 10 band is 206-220, so he is under-tanked for his CR
sys.details.cr = 10; sys.details.level = 10;
sys.details.biography.value = "<p>Captain Drez Crown of G-45, the Marine base at Spirit Cliff: a decorated marksman who fights from long range with a scoped musket.</p><p><strong>Balance note (CR 10):</strong> HP is overridden to 165 (the legacy sheet's value); a straight Marksman 10 is about 95. The legacy Copy-Copy Clone is the Holo-Decoy gadget feature.</p>";
actor.name = "Drez Crown, Captain of G-45";
if (existsSync(`${DATA}/${PORTRAIT}`)) actor.img = PORTRAIT;
if (existsSync(`${DATA}/${TOKEN}`)) actor.prototypeToken = { ...(actor.prototypeToken ?? {}), texture: { ...(actor.prototypeToken?.texture ?? {}), src: TOKEN } };

const r = refreshFromPacks(actor.items);
console.log(`Refreshed ${r.refreshed.length} items; unmatched: ${r.unmatched.join(", ") || "none"}`);
writeFileSync(`${ACTORS}/drez.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/drez.json (${actor.items.length} items)`);
