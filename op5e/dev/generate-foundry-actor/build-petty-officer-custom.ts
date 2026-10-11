// Petty Officer Marine: Human Marksman 4 (Sniper), Marine/Soldier, Role: Master at Arms, no fruit, CR 2. Built 2026-10-11.
// Chassis from specs/petty-officer-spec.json. Custom: Archery style, Armament Novice, scores, skills.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks } from "./refresh-from-packs.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const DATA = "D:/foundry-pi/Foundry/foundrydata/Data";
const PORTRAIT = "one-piece-5e/npcs/Marines/petty-officer-new.jpg";
const TOKEN = "one-piece-5e/npcs/Marines/petty-officer-new-token.png";
const actor = JSON.parse(readFileSync(`${ACTORS}/petty-officer-chassis.json`, "utf-8")) as Doc;
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};
const embed = (p: string, name: string) => embedOwnedItem(pack(p, name) as never) as Doc;

const DROP = ["Clothes, Common", "Arrows (20)", "Crossbow Bolts (20)", "Sling Bullets (20)", "No Devil Fruit (yet)", "Navy Uniform", "Fighting Style"];
actor.items = actor.items.filter((i) => !DROP.includes(i.name ?? ""));
const seen = new Set<string>(); // the pipeline embeds the role twice
actor.items = actor.items.filter((i) => { if (!i.name?.startsWith("Role: ")) return true; if (seen.has(i.name)) return false; seen.add(i.name); return true; });
actor.items.push(embed("class-features", "Fighting Style: Archery"), embed("class-features", "Color of Armament Novice"));
for (const i of actor.items) {
  if (["Rifle", "Cutlass", "Heavy Longcoat"].includes(i.name ?? "")) i.system.equipped = true;
  if (i.type === "tool") i.system.proficient = 1;
}

// Human +1 all, 14/13/13/10/10/8 point-buy on Dex/Con/Wis/Int/Cha/Str, L4 ASI Dex +2
const sys = actor.system;
const abil = { str: 9, dex: 17, con: 14, int: 11, wis: 14, cha: 11 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.dex.proficient = 1; // Marksman saves
sys.attributes.spellcasting = "dex";
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { prc: 1, ath: 1, acr: 1, ste: 1, itm: 1, ins: 1 };
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.details.cr = 2; sys.details.level = 4;
sys.details.biography.value = "<p>A Marine petty officer: rifle at range, cutlass up close, holding the line beside other marines.</p><p><strong>Build note:</strong> HP is the computed Marksman 4 value (the legacy sheet said 45). Legacy Formation Fighting, Basic Haki Training and Steady Aim are replaced by the class kit: Armament Novice, Archery, Careful Aim and Exploding Shot.</p>";
actor.name = "Petty Officer Marine";
if (existsSync(`${DATA}/${PORTRAIT}`)) actor.img = PORTRAIT;
if (existsSync(`${DATA}/${TOKEN}`)) actor.prototypeToken = { ...(actor.prototypeToken ?? {}), texture: { ...(actor.prototypeToken?.texture ?? {}), src: TOKEN } };

const r = refreshFromPacks(actor.items);
console.log(`Refreshed ${r.refreshed.length} items; unmatched: ${r.unmatched.join(", ") || "none"}`);
writeFileSync(`${ACTORS}/petty-officer.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/petty-officer.json (${actor.items.length} items)`);
