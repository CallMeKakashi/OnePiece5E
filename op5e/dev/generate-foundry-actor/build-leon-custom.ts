// Commander Leon (G-9): Human Fighter 6 (Samurai) / Brawler 6 (Six Powers Master), Marine/Soldier, Captain role, level 12. Built 2026-10-10.
// Chassis halves: specs/leon-spec.json (Fighter) + specs/leon-brawler-spec.json (Brawler). Mera Mera no Mi (Logia) is the compendium fruit item;
// Flame body / slash / burst / command are reflavoured compendium creations (user's choice), each spending one Devil Fruit Use.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, wireSpirit } from "./refresh-from-packs.js";
import { ensureItemActivities } from "../../data/helpers/activities.js";
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

const ch = read("leon-chassis"), part = read("leon-brawler-part");
const KEEP = ["Six Techniques", "Six Techniques (Remaining)", "Brawling", "Unarmored Defense", "Brawler Unarmed Strike", "Spirit", "Flurry of Blows", "Patient Defense", "Deft Escape", "Unarmored Movement", "Deflect Missiles", "Brace for Impact", "Stunning Strike"];
const DROP = ["Handaxe", "Arrows (20)", "No Devil Fruit (yet)", "Fighting Style", "Brawler Extra Attack"];
const fromPart = (part.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || KEEP.includes(i.name ?? ""));
const merged = [...(ch.items as Doc[]).filter((i) => !DROP.includes(i.name ?? "")), ...fromPart];
const seen = new Set<string>();
const items: Doc[] = merged.filter((i) => { // one Role, one Haki, one Extra Attack (the two do not stack)
  if (!i.name || !(i.name.startsWith("Role: ") || i.name === "Extra Attack")) return true;
  if (seen.has(i.name)) return false; seen.add(i.name); return true;
});

// Fighting Style: Dueling (Fighter), Haki (Armament Novice L8, Observation Novice L10, Armament Apprentice L12), level 4/6/8/12 feats
items.push(embId("class-features", "e9178a9c2b55cc91"));
for (const n of ["Color of Armament Novice", "Color of Observation Novice", "Color of Armament Apprentice"]) items.push(emb("class-features", n));
for (const n of ["Flying Strikes", "Permanent Haki-Imbuement"]) items.push(emb("feats", n));

// Mera Mera no Mi (Logia) with the Logia feats and the Devil Fruit Uses pool (Logia table: 6 uses at level 11)
const fruit = emb("devil-fruits", "Mera Mera no Mi"); items.push(fruit);
const dfu = emb("feats", "Devil Fruit Uses");
dfu.system.uses = { spent: 0, max: "6", recovery: [{ period: "lr", type: "recoverAll" }] };
dfu.system.description.value += "<p>Leon (level 12, Logia): 6 uses (Logia table, level 11). Regain all on a long rest.</p>";
items.push(dfu);
for (const n of ["Devil Fruit Ability Check, Fruit-Fruit DC and Attack", "Ocean's Scorn", "Logia Elemental Domain", "Logia Improved Elemental Domain"]) items.push(emb("feats", n));
fruit.system.description.value = "<p><strong>Flame-Flame Fruit (Logia).</strong> Flame body = Embody Flames; Flame slash = Burning Blade; Fire burst = Fireball; Flame command = Fire Bolt and Wall of Fire. Each spends one Devil Fruit Use of 6. Fruit-Fruit DC is 8 + highest ability modifier + proficiency (17). At 100 HP the old sheet had him ignite fully (Phase 2): use Logia Elemental Domain's transformation. <em>Reflavoured compendium creations; the Sourcebook gives fruit abilities no stats.</em></p>" + fruit.system.description.value;
const spend = (n: string, text: string) => {
  const it = items.find((i) => i.name === n); if (!it) throw new Error(`spend: ${n} missing`);
  it.system.uses = { spent: 0, max: "", recovery: [] };
  it.system.description.value = `<p>${text}</p>` + it.system.description.value;
  for (const a of Object.values(it.system.activities ?? {}) as any[]) a.consumption = { ...(a.consumption ?? {}), spellSlot: false, targets: [{ type: "itemUses", target: dfu._id, value: "1", scaling: {} }] };
};
for (const n of ["Embody Flames", "Burning Blade", "Fireball", "Fire Bolt", "Wall of Fire"]) items.push(creation(n));
spend("Embody Flames", "<strong>Flame-Flame: Flame body (Mera Mera no Mi).</strong> Leon becomes living fire. Spends one Devil Fruit Use.");
spend("Burning Blade", "<strong>Flame-Flame: Flame slash (Mera Mera no Mi).</strong> A rapier strike laced with fire (piercing plus fire). Spends one Devil Fruit Use.");
spend("Fireball", "<strong>Flame-Flame: Fire burst (Mera Mera no Mi).</strong> Detonates fire in a 20 ft radius; Dexterity save for half. Spends one Devil Fruit Use.");
spend("Fire Bolt", "<strong>Flame-Flame: Flame command (Mera Mera no Mi).</strong> Throws a bolt of fire. Spends one Devil Fruit Use.");
spend("Wall of Fire", "<strong>Flame-Flame: Flame command (Mera Mera no Mi).</strong> Shapes a wall of fire. Spends one Devil Fruit Use.");

const auto = refreshFromPacks(items); console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
console.log(`spirit cost wired on: ${wireSpirit(items).join(", ")}`);
for (const i of items) {
  if (["Rapier", "Brawler Unarmed Strike"].includes(i.name ?? "") && i.system) i.system.equipped = true;
  if (["Navy Uniform", "Heavy Longcoat"].includes(i.name ?? "") && i.system) i.system.equipped = false; // Brawler Unarmored Defense (10 + Dex + Wis = 18) beats the longcoat (16)
  if (i.type === "tool") i.system.proficient = 1;
  const parts = i.system?.damage?.parts; // Foundry refuses legacy @scale parts; the real formula lives in the activity
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
  const u = i.system?.uses; // legacy uses.per -> uses.recovery
  if (u?.max && ["sr", "lr"].includes(u.per)) { u.recovery = [{ period: u.per, type: "recoverAll" }]; u.per = null; }
}

const sys = ch.system;
// base 10/16/13/10/13/12; Human +1 all; Fighter 4 and Brawler 4 ASIs: Dex +2, Wis +2; Flying Strikes +1 Dex. Con 14 base for the Tough build.
const abil = { str: 10, dex: 20, con: 14, int: 10, wis: 16, cha: 12 }; // Human +1 only on Dex, Con and Wis (the trait gives +3 in total, corrected 2026-10-11)
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
for (const k of Object.keys(abil)) sys.abilities[k].proficient = ["str", "con"].includes(k) ? 1 : 0;
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { ath: 1, prc: 1, acr: 1, sur: 1, itm: 1, per: 1, ins: 1, ste: 1 }; // Marine; Fighter; Captain; Samurai; Brawler
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
sys.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
sys.attributes.spellcasting = "dex"; // Fruit-Fruit DC uses the highest ability modifier (Dex)
sys.attributes.movement = { ...sys.attributes.movement, swim: 0 }; // Ocean's Scorn
sys.attributes.prof = 4;
sys.details.level = 12;
// CR balance pass: real HP is about 130 (Fighter 6 / Brawler 6 with Tough), well under a CR 10 band; set to 210 (DMG CR 10 band 206-220), like Calder.
sys.attributes.hp = { value: 210, max: 210, temp: 0, tempmax: 0, formula: "6d10 + 6d8 + 36" };
sys.details.cr = 10;
sys.details.biography.value = "<p>Commander Leon of Marine G-9: a rapier duelist with a burn-scarred face, Rokushiki and the Mera Mera no Mi (Logia).</p><p><strong>Balance note (CR 10):</strong> a straight Fighter 6 / Brawler 6 is far below a CR 10 band on hit points, so HP is overridden to 210 for a duelist boss.</p>";
ch.items = items; ch.name = "Commander Leon";
ch.img = "one-piece-5e/npcs/Marines/leon-new.jpg";
ch.prototypeToken = { ...(ch.prototypeToken ?? {}), texture: { ...(ch.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Marines/leon-new-token.png" } };
writeFileSync(`${ACTORS}/leon.json`, JSON.stringify(ch, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/leon.json (${items.length} items)`);
