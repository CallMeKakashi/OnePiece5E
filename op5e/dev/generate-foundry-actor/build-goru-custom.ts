// Goru Yamashita: Human Fighter 10 (Samurai), CR 5, Noble, Master at Arms. Built 2026-10-10.
// Class "The Fang" and the MistFrame/summon/Forms are not in the Sourcebook, so a plain compendium Samurai (user's choice).
import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks } from "./refresh-from-packs.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { toughCustomerFeatures } from "../../data/src/class-features/additional/tough-customer.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/goru-chassis.json`, "utf-8"));
const pack = (p: string, id: string): Doc => JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8"));
const embed = (p: string, id: string) => embedOwnedItem(pack(p, id) as never) as Doc;

let items: Doc[] = chassis.items as Doc[];
const DROP = ["Handaxe", "Arrows (20)", "No Devil Fruit (yet)"];
items = items.filter((i) => !DROP.includes(i.name ?? "") && !(i.name === "Fighting Style" && i.type === "feat"));
const seen = new Set<string>();
items = items.filter((i) => { if (!i.name?.startsWith("Role: ")) return true; if (seen.has(i.name)) return false; seen.add(i.name); return true; });

items.push(embed("class-features", "72769d4989cf62a8")); // Fighting Style: Great Weapon Fighting
// Level 4/6/8 feats: Katana Master, Great Weapon Master, Permanent Haki-Imbuement
for (const id of ["39b3aeef347aab36", "f701a351c863bf46", "857f50c5626aa3b4"]) items.push(embed("feats", id));
// Second Katana (dual blades, user's choice; the pipeline merged the two picks into one item)
const k = items.find((i) => i.name === "Katana")!;
const k2 = JSON.parse(JSON.stringify(k)); k2._id = (k._id as string).slice(0, 8) + "goru2katana".slice(0, 8);
items.push(k2 as Doc);

const auto = refreshFromPacks(items);
console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
for (const i of items) if (["Heavy Longcoat", "Odachi", "Katana"].includes(i.name ?? "") && i.system) i.system.equipped = true;
for (const i of items) if (i === k2) i.system.equipped = false; // spare blade

const sys = chassis.system;
const abil = { str: 14, dex: 18, con: 14, int: 12, wis: 14, cha: 13 }; // live-sheet scores (user's choice)
for (const [kk, v] of Object.entries(abil)) sys.abilities[kk].value = v;
for (const kk of ["str", "con"]) sys.abilities[kk].proficient = 1;
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { per: 1, ins: 1, acr: 1, ath: 1, his: 1, itm: 1 };
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([kk, ab]) => [kk, { value: VALUES[kk] ?? 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
sys.traits.weaponProf = { value: ["sim", "mar"], custom: "" };

// CR 5 band: HP 131-145. Fighter 10 at Con 14 is about 75, so overridden to 138.
sys.attributes.hp = { value: 138, max: 138, temp: 0, tempmax: 0, formula: "10d10 + 20" };
sys.details.cr = 5; sys.details.level = 10;
chassis.items = items;
chassis.name = "Goru Yamashita";
chassis.img = "one-piece-5e/npcs/Driftroot Isle/goru-new.jpg";
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Driftroot Isle/goru-new-token.png" } };
sys.details.biography.value = "<p>Goru Yamashita (born Lazarus Valencruz), exiled noble swordsman of Driftroot.</p><p><strong>Build note:</strong> Fighter 10 (Samurai), compendium only. The custom class The Fang, MistFrame, the air-elemental summon and the five Forms are dropped. HP overridden to 138 (real 75) for the CR 5 band.</p>";
for (const f of toughCustomerFeatures) chassis.items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc);
writeFileSync(`${ACTORS}/goru.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/goru.json (${chassis.items.length} items)`);
