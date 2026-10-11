// Dravos "The Mole": Human Gadgeteer 13 (Alchemist), Sailor, Role: Navigator, eater of the Toneru Toneru no Mi (Tunnel-Tunnel, Paramecia), no Haki, level 13, CR 8. Built 2026-10-11.
// Chassis from specs/dravos-spec.json. The compendium fruit item has no activities, so the legacy pipe techniques are reflavoured creations
// that each spend one Devil Fruit Use (tricks are free). Legacy Redirect, Catch Me If You Can and Pipes Protect Me had no compendium match and are dropped.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks } from "./refresh-from-packs.js";
import { ensureItemActivities } from "../../data/helpers/activities.js";
import creations from "../../data/src/creations/index.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const actor = JSON.parse(readFileSync(`${ACTORS}/dravos-chassis.json`, "utf-8")) as Doc;
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

const DROP = ["Clothes, Common", "Dagger", "No Devil Fruit (yet)"];
const seen = new Set<string>(); // the pipeline embeds the role twice
const items: Doc[] = actor.items.filter((i) => {
  if (DROP.includes(i.name ?? "")) return false;
  if (!i.name?.startsWith("Role: ")) return true;
  if (seen.has(i.name)) return false; seen.add(i.name); return true;
});

// Toneru Toneru no Mi (Paramecia) from the compendium, with the Devil Fruit Uses pool: level 13 gives 7 uses, Paramecia +1 = 8 (long rest)
items.push(emb("devil-fruits", "Toneru Toneru no Mi"));
const dfu = emb("feats", "Devil Fruit Uses");
dfu.system.uses = { spent: 0, max: "8", recovery: [{ period: "lr", type: "recoverAll" }] };
dfu.system.description.value += "<p>Dravos (level 13, Paramecia): 7 uses from level + 1 for Paramecia = 8. Regain all on a long rest.</p>";
items.push(dfu);
for (const n of ["Devil Fruit Ability Check, Fruit-Fruit DC and Attack", "Ocean's Scorn"]) items.push(emb("feats", n));
items.push(emb("items", "Maul")); // Pipe Wrench

const spend = (name: string, label: string) => {
  const it = creation(name); items.push(it);
  it.system.uses = { spent: 0, max: "", recovery: [] };
  it.system.description.value = `<p><strong>${label} (Toneru Toneru no Mi).</strong> Spends one Devil Fruit Use.</p>` + it.system.description.value;
  for (const a of Object.values(it.system.activities ?? {}) as any[]) a.consumption = { ...(a.consumption ?? {}), targets: [{ type: "itemUses", target: dfu._id, value: "1", scaling: {} }] };
};
spend("Misty Step", "Get Me Out");
spend("Dimension Door", "Thousand-Mile Tunnel (the closest creation: 500 ft and one passenger, not the legacy long-range party transport)");
spend("Vortex Warp", "Linked Portals (closest creation)");
spend("Wall of Force", "Wall of Pipes");
spend("Web", "Pipe Network");
spend("Levitate", "Keep Me High");
spend("Haste", "Run Away");
spend("Feather Fall", "Catch Me");
spend("Thunderwave", "Blast");
for (const [n] of [["Thorn Lash"], ["Windblast"], ["Manipulate Earth"], ["Water Flow"]]) items.push(creation(n)); // Pipe Vines, Wind Pipe, Tunnel, Water Hose (free tricks)

const auto = refreshFromPacks(items); console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
for (const i of items) {
  if (["Maul", "Flintlock"].includes(i.name ?? "") && i.system) i.system.equipped = true;
  if (i.type === "tool") i.system.proficient = ["Navigator's Tools", "Cartographer's Tools", "Tinker's Tools", "Carpenter's Tools"].includes(i.name ?? "") ? 1 : 0;
  const parts = i.system?.damage?.parts;
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
  const u = i.system?.uses;
  if (u?.max && ["sr", "lr"].includes(u.per)) { u.recovery = [{ period: u.per, type: "recoverAll" }]; u.per = null; }
}

const sys = actor.system;
// point-buy base Int 13, Dex 12, Con 11, Wis 11, Cha 9, Str 8 (cost 16); Human +1 all; Keen Mind Int +1; Observant Wis +1; ASIs 4, 8, 12: Int +3, Con +2, Dex +1
const abil = { str: 9, dex: 14, con: 14, int: 18, wis: 13, cha: 10 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
for (const k of Object.keys(abil)) sys.abilities[k].proficient = ["con", "int"].includes(k) ? 1 : 0; // Gadgeteer saves
sys.attributes.spellcasting = "int"; // Creativity and the Fruit-Fruit DC (highest modifier is Int)
sys.attributes.movement = { ...sys.attributes.movement, swim: 0 }; // Ocean's Scorn
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { prc: 1, nat: 1, arc: 1, inv: 1, ath: 1, his: 1 }; // Sailor; Gadgeteer; Navigator
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.details.level = 13; sys.details.cr = 8;
sys.attributes.hp = { value: 170, max: 170, temp: 0, tempmax: 0, formula: "13d8 + 26" }; // override: legacy value (real about 90; DMG CR 8 band 156-170)
sys.details.biography.value = "<p>Dravos \"The Mole\": navigator for the Gentle Giant Pirates, brother of Droven Calligos, eater of the Toneru Toneru no Mi (Tunnel-Tunnel). He moves people and walls through PVC pipe tunnels.</p><p><strong>Balance note (CR 8):</strong> a straight Gadgeteer 13 is about 90 HP, so HP is the legacy 170 (DMG CR 8 band 156-170). The legacy pipe techniques are reflavoured compendium creations that spend Devil Fruit Uses; Redirect, Catch Me If You Can and Pipes Protect Me were dropped.</p>";
actor.items = items; actor.name = "Dravos";

writeFileSync(`${ACTORS}/dravos.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/dravos.json (${items.length} items)`);
