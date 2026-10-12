// Alice: Lunarian Fighter 6 (Banneret) / Savant 6 (Radiant Superiority), Noble, Role: Master at Arms, no fruit, level 12, CR 10. Built 2026-10-11.
// Chassis halves: specs/alice-spec.json (Fighter) + specs/alice-savant-spec.json (Savant). Lunarian traits are added by hand (the pipeline does not grant them).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks } from "./refresh-from-packs.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { lunarianFeatures } from "../../data/src/racial-features/lunarian.js";
import creations from "../../data/src/creations/index.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const read = (f: string) => JSON.parse(readFileSync(`${ACTORS}/${f}.json`, "utf-8"));
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};
const emb = (p: string, name: string) => embedOwnedItem(pack(p, name) as never) as Doc;
const embId = (p: string, id: string) => embedOwnedItem(JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8")) as never) as Doc;
const creation = (name: string) => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  return embedOwnedItem(ensureItemActivities({ ...structuredClone(c), system: { ...structuredClone(c.system), preparation: { mode: "always", prepared: true } } } as never) as never) as Doc;
};

const ch = read("alice-chassis"), part = read("alice-savant-part");
const DROP = ["Clothes, Common", "Handaxe", "Shortsword", "Arrows (20)", "No Devil Fruit (yet)", "Fighting Style"];
const KEEP = ["Shining Soul", "Channel Conviction: Radiant Superiority", "Rallying Presence", "Creativity", "Ardent Smite", "Aura of Protection"];
const fromPart = (part.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || i.type === "spell" || KEEP.includes(i.name ?? ""));
const seen = new Set<string>();
const items: Doc[] = [...(ch.items as Doc[]).filter((i) => !DROP.includes(i.name ?? "")), ...fromPart].filter((i) => {
  if (!i.name || !(i.name.startsWith("Role: ") || i.name === "Extra Attack")) return true;
  if (seen.has(i.name)) return false; seen.add(i.name); return true;
});

items.push(embId("class-features", "e9178a9c2b55cc91")); // Fighting Style: Dueling
items.push(emb("class-features", "Burn Baby, Burn")); // additional power (needs fire damage), user's pick
for (const n of ["Conqueror's Haki Novice", "Conqueror's Haki Apprentice"]) items.push(emb("class-features", n));
for (const f of lunarianFeatures) if (f.name !== "Ultimate Duality") items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc); // Flaming Duality, Flame Investure, Omni-Adapted, wings, Godspeed
for (const n of ["Fire Bolt (Flame Investure)", "Elemental Armor (Flame Investure)", "Fireball (Flame Investure)"]) items.push(creation(n)); // the Lunarian species versions: no slot, Elemental Armor and Fireball once per long rest

const auto = refreshFromPacks(items); console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
for (const i of items) {
  if (["Longsword", "Leather Armor"].includes(i.name ?? "") && i.system) i.system.equipped = true;
  if (i.type === "tool") i.system.proficient = 1;
  const parts = i.system?.damage?.parts;
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
  const u = i.system?.uses;
  if (u?.max && ["sr", "lr"].includes(u.per)) { u.recovery = [{ period: u.per, type: "recoverAll" }]; u.per = null; }
}

const sys = ch.system;
// point-buy 14/14/12/13/10/8 style: Dex base 15, Cha 14, Con 12, Wis 13, Int 10, Str 8 (cost 27); Lunarian Cha +2 Dex +1; ASIs (Fighter 4 and 6, Savant 4): Dex +2, Cha +2, Con +2
const abil = { str: 8, dex: 18, con: 14, int: 10, wis: 13, cha: 18 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
for (const k of Object.keys(abil)) sys.abilities[k].proficient = ["str", "con"].includes(k) ? 1 : 0; // Fighter saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { per: 1, ins: 1, ath: 1, acr: 1, itm: 1, his: 1 }; // Noble; Fighter; Master at Arms
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.attributes.movement = { ...sys.attributes.movement, fly: 30 }; // Lunarian wings
sys.attributes.spellcasting = "cha"; // Savant Creativity; Flame Investure's creative ability is Constitution by the race text
sys.details.level = 12; sys.details.cr = 10;
sys.attributes.hp = { value: 210, max: 210, temp: 0, tempmax: 0, formula: "12d10 + 24" }; // override: DMG CR 10 band 206-220 (real about 90, legacy 170)
sys.details.biography.value = "<p>Alice, Malphas's sister: a Lunarian flyer rescued from a Marine enclosure, now at Droven Calligos's side. Her Conqueror's Haki can knock out a whole ship.</p><p><strong>Balance note (CR 10):</strong> a straight Fighter 6 / Savant 6 is about 90 HP, so HP is overridden to 210 (DMG CR 10 band 206-220).</p>";
ch.items = items; ch.name = "Alice";
ch.img = "one-piece-5e/npcs/Blackhand/alice-new.jpg";
ch.prototypeToken = { ...(ch.prototypeToken ?? {}), texture: { ...(ch.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Blackhand/alice-new-token.png" } };
for (const i of (ch.items as Doc[])) if (i.type === "spell" && i.system?.preparation?.mode === "prepared") i.system.preparation.prepared = true; // NPC: every creation is ready (audit S2)
writeFileSync(`${ACTORS}/alice.json`, JSON.stringify(ch, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/alice.json (${items.length} items)`);
