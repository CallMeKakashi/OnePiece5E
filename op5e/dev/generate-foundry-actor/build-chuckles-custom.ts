// Chuckles D. Clown: Human Brawler 5 (Sumo Wrestler), Entertainer, Deckhand, level 5, CR 3, Circle of Clowns strongman. Built 2026-10-10.
// Chassis from the real pipeline: specs/chuckles-spec.json -> ../Foundry/actors-json/chuckles-chassis.json.
import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, wireSpirit } from "./refresh-from-packs.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { armorlessGuardianFeatures } from "../../data/src/class-features/additional/armorless-guardian.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any>; effects?: any[] } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/chuckles-chassis.json`, "utf-8"));
const pack = (p: string, id: string): Doc => JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8"));

const DROP = ["Sling Bullets (20)", "Playing Card Set", "No Devil Fruit (yet)"];
const items: Doc[] = (chassis.items as Doc[]).filter((i) => !DROP.includes(i.name ?? ""));
// the pipeline embeds the Deckhand role twice
const seenRole = new Set<string>();
chassis.items = items.filter((i) => i.name !== "Role: Deckhand" || (seenRole.has("x") ? false : (seenRole.add("x"), true)));
const out = chassis.items as Doc[];
out.push(embedOwnedItem(pack("items", "a9d155147acc4b8a") as never) as Doc); // Painter's Supplies (Deckhand tool kit)

for (const f of armorlessGuardianFeatures) out.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc); // Chapter 7 additional power, user pick

const auto = refreshFromPacks(out); console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
console.log(`spirit cost wired on: ${wireSpirit(out).join(", ")}`);
for (const i of out) {
  if (["Greatclub", "Brawler Unarmed Strike"].includes(i.name ?? "") && i.system) i.system.equipped = true;
  if (i.type === "tool") i.system.proficient = 1;
  const parts = i.system?.damage?.parts; // Foundry refuses legacy @scale parts; the real formula lives in the activity
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
}
// Sumo Stance: Strength replaces Dexterity in Unarmored Defense -> AC 10 + Str + Wis
const ud = out.find((i) => i.name === "Unarmored Defense");
if (ud?.effects?.[0]) ud.effects[0].changes = [
  { key: "system.attributes.ac.calc", mode: 5, value: "custom", priority: 20 },
  { key: "system.attributes.ac.formula", mode: 5, value: "10 + @abilities.str.mod + @abilities.wis.mod", priority: 20 },
];

const sys = chassis.system;
const abil = { str: 19, dex: 10, con: 16, int: 8, wis: 12, cha: 14 }; // 16/10/15/8/12/13 + Human +1 Str/Con/Cha + level 4 +2 Str
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.dex.proficient = 1; // Brawler saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { acr: 1, prf: 1, ath: 2, sur: 1, ani: 1, prc: 1 }; // Entertainer: Acrobatics, Performance; Brawler: Athletics, Survival; Deckhand: Animal Handling, Perception; Sumo Stance: Athletics expertise
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.attributes.ac = { flat: null, calc: "custom", formula: "10 + @abilities.str.mod + @abilities.wis.mod" };
// CR balance pass: Brawler 5 d8 HP sits at 43, under the CR 3 band (70-85), so HP is overridden.
sys.attributes.hp = { value: 105, max: 105, temp: 0, tempmax: 0, formula: "5d8 + 15" };
sys.details.cr = 3; sys.details.level = 5;
chassis.name = "Chuckles";
chassis.img = "one-piece-5e/npcs/Circus Ring/Chuckles-d-clown.png";
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Circus Ring/Chuckles-d-clown.png" } };
sys.details.biography.value = "<p>Chuckles D. Clown, the strongman of the Circle of Clowns: a huge, grinning brute in striped suspenders and chains.</p><p><strong>Balance note (CR 3):</strong> a straight Brawler 5 is under CR 3 on hit points, so HP is overridden to 105 (DMG CR 3 band 101-115).</p>";
writeFileSync(`${ACTORS}/chuckles.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/chuckles.json (${out.length} items)`);
