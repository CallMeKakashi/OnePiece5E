// Malphas "The Waning Fist": Lunarian Brawler 12 (Drunken Master), Wanderer, Role: Navigator, eater of the Tori Tori no Mi, Model: Raicho (mythical zoan), level 12, CR 11. Built 2026-10-11.
// Chassis from specs/malphas-spec.json. Lunarian traits are added by hand (the pipeline does not grant them). Hybrid Form and Full Beast Form transform into the actors from build-malphas-forms.ts.
// Per the user: no named fruit techniques beyond Hybrid / Full Beast; the lightning creations (legacy "spells") ride on Hybrid Form only and are limited to one use per long rest.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks } from "./refresh-from-packs.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import { lunarianFeatures } from "../../data/src/racial-features/lunarian.js";
import creations from "../../data/src/creations/index.js";
import { BEAST_ID, HYBRID_ID } from "./build-malphas-forms.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const ch = JSON.parse(readFileSync(`${ACTORS}/malphas-chassis.json`, "utf-8")) as Doc;
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};
const emb = (p: string, name: string) => embedOwnedItem(pack(p, name) as never) as Doc;
const creation = (name: string) => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  return embedOwnedItem(ensureItemActivities({ ...structuredClone(c), system: { ...structuredClone(c.system), preparation: { mode: "always", prepared: true } } } as never) as never) as Doc;
};

const DROP = ["Quarterstaff", "Sling Bullets (20)", "No Devil Fruit (yet)", "Playing Card Set"];
const seen = new Set<string>(); // the pipeline embeds the role twice
const items: Doc[] = (ch.items as Doc[]).filter((i) => {
  if (DROP.includes(i.name ?? "")) return false;
  if (!i.name?.startsWith("Role: ")) return true;
  if (seen.has(i.name)) return false; seen.add(i.name); return true;
});
items.push(emb("items", "Dice Set")); // Wanderer gaming set (the pipeline mapped the pick to cards)

// Lunarian traits (flame duality, flame investure, omni-adapted, wings) and the creations Flame Investure grants
for (const f of lunarianFeatures) if (f.name !== "Ultimate Duality") items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc);
for (const n of ["Fire Bolt", "Elemental Armor", "Fireball"]) items.push(creation(n));
for (const n of ["Charger", "Alert"]) items.push(emb("feats", n)); // ASI feats chosen with the user

// ---- Devil fruit: real zoan rules items, Hybrid and Full Beast as transforms into standalone actors
for (const n of ["Devil Fruit Uses", "Devil Fruit Ability Check, Fruit-Fruit DC and Attack", "Zoan Hybrid Form", "Zoan Full Beast Form", "Zoan Enhanced Form", "Ocean's Scorn"]) items.push(emb("feats", n));
const auto = refreshFromPacks(items); console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
for (const n of ["Zoan Hybrid Form", "Zoan Full Beast Form"]) {
  const it = items.find((i) => i.name === n)!;
  for (const [k, a] of Object.entries(it.system.activities) as [string, any][]) if (!/mythical/.test(a.name)) delete it.system.activities[k];
}
const profile = (id: string, name: string, uuid: string) => [{ _id: generateId(id), name, uuid: `Actor.${uuid}`, cr: "", level: { min: null, max: null }, movement: [], sizes: [], types: [], count: null }];
for (const a of Object.values(items.find((i) => i.name === "Zoan Full Beast Form")!.system.activities) as any[]) a.profiles = profile("homebrew/malphas/beast-profile", "Thunderbird", BEAST_ID);
{
  const hf = items.find((i) => i.name === "Zoan Hybrid Form")!, fb = Object.values(items.find((i) => i.name === "Zoan Full Beast Form")!.system.activities)[0] as any;
  hf.effects = []; // the +proficiency damage lives on the hybrid actor ("Hybrid Strikes"); the token swap comes from its prototype token
  const id = generateId("homebrew/malphas/hybrid-transform");
  const act = structuredClone(fb); act._id = id; act.name = "Hybrid Form (mythical zoan)";
  act.settings = { ...act.settings, keep: ["physical", "mental", "saves", "skills", "gearProf", "languages", "class", "feats", "items", "spells", "bio", "hp"], merge: [], other: [], tempFormula: "4 * @details.level" };
  act.profiles = profile("homebrew/malphas/hybrid-profile", "Thunderbird (Hybrid)", HYBRID_ID);
  hf.system.activities = { [id]: act };
}
items.find((i) => i.name === "Zoan Devil Fruit (Template)")!.name = "Tori Tori no Mi, Model: Raicho (Mythical Zoan)";

// Lightning creations (the legacy spell kit that existed as creations): usable only in Hybrid Form, one use each per long rest
for (const [n, label] of [["Call Lightning", "Stormcall"], ["Lightning Bolt", "Thunderstroke"], ["Thunder Step", "Skystep"], ["Thunderwave", "Thunderclap"], ["Shatter", "Shatter"], ["Gust of Wind", "Gust"]] as const) {
  const it = creation(n); items.push(it);
  it.system.uses = { spent: 0, max: "1", recovery: [{ period: "lr", type: "recoverAll" }] };
  it.system.description.value = `<p><strong>${label} (Hybrid Form only).</strong> Usable while in Hybrid Form. One use per long rest.</p>` + it.system.description.value;
}

for (const i of items) {
  if (i.type === "tool") i.system.proficient = ["Navigator's Tools", "Cartographer's Tools"].includes(i.name ?? "") ? 1 : (i.name === "Dice Set" ? 1 : 0);
  const parts = i.system?.damage?.parts;
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
  const u = i.system?.uses;
  if (u?.max && ["sr", "lr"].includes(u.per)) { u.recovery = [{ period: u.per, type: "recoverAll" }]; u.per = null; }
  for (const e of (i.effects ?? []) as Record<string, any>[]) if (e.flags) delete e.flags.dae;
}

const sys = ch.system;
// final scores per the user: Dex 20 and Wis 18 (ASIs 4, 8), Charger Con +1, Keen Mind Int +1; Lunarian +3 spread over Dex, Wis, Int
const abil = { str: 10, dex: 20, con: 15, int: 12, wis: 18, cha: 10 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
for (const k of Object.keys(abil)) sys.abilities[k].proficient = ["str", "dex"].includes(k) ? 1 : 0; // Brawler saves
sys.attributes.spellcasting = "dex"; // creations and the Fruit-Fruit DC use Dexterity (highest of the three)
sys.attributes.movement = { ...sys.attributes.movement, fly: 30, swim: 0 }; // Lunarian wings; Ocean's Scorn
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { ins: 1, sur: 1, acr: 1, ste: 1, nat: 1 }; // Wanderer; Brawler; Navigator
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.details.level = 12; sys.details.cr = 11;
// CR balance pass: a straight Brawler 12 is about 110 HP; DMG bands put CR 11 at 221-235 with AC 17, and AC 19 is two points over, so HP 215 holds CR 11 (defence), and about 70 damage a round at +10 holds CR 11 (offence)
sys.attributes.hp = { value: 215, max: 215, temp: 0, tempmax: 0, formula: "12d10 + 36" };
sys.details.biography.value = "<p>Malphas \"The Waning Fist\": a Lunarian navigator of the Blackhand crew, brother of Alice, eater of the Tori Tori no Mi, Model: Raicho (Thunderbird, mythical zoan). He fights drunk and fast, then calls the storm in Hybrid Form or Full Beast Form.</p><p><strong>Balance note (CR 11):</strong> a straight Brawler 12 is about 110 HP, so HP is overridden to 215. The legacy fruit techniques were dropped (Hybrid and Full Beast only); the lightning creations (Stormcall, Thunderstroke, Skystep, Thunderclap, Shatter, Gust) ride on Hybrid Form, one use each per long rest.</p>";
ch.items = items; ch.name = "Malphas";
ch.img = "one-piece-5e/npcs/Lunarfolds/malphas-new.png";
ch.prototypeToken = { ...(ch.prototypeToken ?? {}), texture: { ...(ch.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Lunarfolds/malphas-new-token.png" } };
writeFileSync(`${ACTORS}/malphas.json`, JSON.stringify(ch, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/malphas.json (${items.length} items)`);
