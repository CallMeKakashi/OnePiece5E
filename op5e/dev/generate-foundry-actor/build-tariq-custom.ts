// Tariq Solen: Human Marksman 5 (Sniper), level 5, CR 3, 15-year-old Sand Rats scout. Built 2026-10-10.
// Chassis from the real pipeline: specs/tariq-spec.json -> ../Foundry/actors-json/tariq-chassis.json.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";
import { ensureItemActivities } from "../../data/helpers/activities.js";
import creations from "../../data/src/creations/index.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/tariq-chassis.json`, "utf-8"));
const pack = (p: string, id: string): Doc => JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8"));

const DROP = ["Arrows (20)", "Crossbow Bolts (20)", "Firearms Bullets (20)", "Sling Bullets (20)", "No Devil Fruit (yet)", "Playing Card Set"];
const items: Doc[] = (chassis.items as Doc[]).filter((i) => !DROP.includes(i.name ?? ""));
items.push(embedOwnedItem(pack("items", "eccee0becc9e6792") as never) as Doc); // Dice Set (Wanderer gaming set)
items.push(embedOwnedItem(pack("class-features", "046b6f1dffc9244a") as never) as Doc); // Fighting Style: Archery (Marksman)

const creation = (name: string, mode: "prepared" | "always") => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  const doc = ensureItemActivities({ ...structuredClone(c), system: { ...structuredClone(c.system), preparation: { mode, prepared: true } } } as never) as Doc;
  return embedOwnedItem(doc as never) as Doc;
};
for (const n of ["Guidance", "Draw", "Spark Bolt", "Alacrity", "Zephyr Strike", "Misty Step"]) items.push(creation(n, "prepared"));
for (const n of ["Advanced Weapon", "Retreat", "Grounding", "Cloud of Daggers"]) items.push(creation(n, "always")); // Sniper Creations, levels 3 and 5

const auto = refreshFromPacks(items);
console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
standaloneSummons(items, ACTORS, "tariq");

for (const i of items) {
  if (["Leather Armor", "Longbow", "Dagger"].includes(i.name ?? "") && i.system) i.system.equipped = true;
  if (i.type === "tool") i.system.proficient = i.name === "Dice Set" ? 1 : 0;
}

const sys = chassis.system;
const abil = { str: 8, dex: 18, con: 12, int: 10, wis: 14, cha: 10 }; // +2 Dex at Marksman 4
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.dex.proficient = 1; // Marksman saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { prc: 1, sur: 1, ste: 1, nat: 1 }; // Wanderer: Perception, Survival; Marksman: Stealth, Nature
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.attributes.spellcasting = "wis";
sys.spells = Object.fromEntries([4, 2, 0, 0, 0, 0, 0, 0, 0].map((max, i) => [`spell${i + 1}`, { value: max, max }]));
// CR balance pass: Marksman 5 d10 HP sits at 39, far under the CR 3 band (70-85), so HP is overridden.
sys.attributes.hp = { value: 72, max: 72, temp: 0, tempmax: 0, formula: "5d10 + 5" };
sys.details.cr = 3; sys.details.level = 5;
chassis.items = items;
chassis.name = "Tariq Solen";
sys.details.biography.value = "<p>Tariq Solen, a 15-year-old scout of the Sand Rats: a lean wanderer with a longbow, quick eyes and a guarded calm.</p><p><strong>Balance note (CR 3):</strong> a straight Marksman 5 is under CR 3 on hit points, so HP is overridden to 72.</p>";

writeFileSync(`${ACTORS}/tariq.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/tariq.json (${items.length} items)`);
