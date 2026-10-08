// Meridian Island guards: Coast Guard and Pirate Guard (generic mooks), Judith (special Coast Guard), May and Jay (pirate lieutenants), Shin (pirate captain).
// Chassis from prep-guards.mjs (real pipeline); this merges Shin's Rogue half, adds the Chapter 7 powers and weapons, applies the CR balance pass and writes standalone JSON.
// Usage: node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/build-guards-custom.ts [slug ...]
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import creations from "../../data/src/creations/index.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const pack = (p: string, name: string, type?: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name && (!type || d.type === type)) return d; }
  throw new Error(`${p}/${name} not found`);
};
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const SAVES: Record<string, string[]> = { fighter: ["str", "con"], rogue: ["dex", "int"], bard: ["dex", "cha"] };

type Cfg = { name: string; cls: "fighter" | "rogue" | "bard"; level: number; cr: number; abil: Record<string, number>; hp: number; hpFormula: string; bonus: string; weapons: string[];
  powers: [string, string][]; haki?: string; extraSaves?: string[]; note: string; spells?: { tricks: string[]; spells: string[]; slots: number[] }; rogueHalf?: boolean };
const CFGS: Record<string, Cfg> = {
  "coast-guard": { name: "Coast Guard", cls: "fighter", level: 3, cr: 0.5, abil: { str: 16, dex: 12, con: 14, int: 8, wis: 12, cha: 10 }, hp: 36, hpFormula: "3d10 + 9", bonus: "1d8", weapons: ["Cutlass", "Flintlock", "Shield"], powers: [],
    note: "A rank-and-file guard of Meridian Island's coast. Built as Fighter 3 (Champion), CR 1/2: hit points are raised to the CR 1/2 band and Veteran's Edge adds +1d8 weapon damage." },
  "pirate-guard": { name: "Pirate Guard", cls: "rogue", level: 6, cr: 3, abil: { str: 10, dex: 16, con: 12, int: 10, wis: 12, cha: 12 }, hp: 100, hpFormula: "6d8 + 18", bonus: "1d8", weapons: ["Cutlass", "Flintlock"], powers: [],
    note: "A pirate hired to guard the island's boss, in white clothes with a floral pattern. Built as Rogue 6 (Swashbuckler), CR 3: hit points are raised to the CR 3 band and Veteran's Edge adds +1d8 weapon damage." },
  judith: { name: "Judith", cls: "fighter", level: 8, cr: 5, abil: { str: 18, dex: 12, con: 16, int: 10, wis: 12, cha: 10 }, hp: 133, hpFormula: "8d10 + 32", bonus: "2d6", weapons: ["Katana", "Flintlock", "Shield"], haki: "Color of Armament Novice", extraSaves: ["wis"],
    powers: [["class-features", "Fearsome Fortitude"]], note: "Judith, the Coast Guard's veteran sergeant. Fighter 8 (Champion), CR 5: hit points raised to the CR 5 band, Veteran's Edge adds +2d6 weapon damage." },
  may: { name: "May", cls: "rogue", level: 9, cr: 6, abil: { str: 8, dex: 20, con: 14, int: 12, wis: 12, cha: 12 }, hp: 148, hpFormula: "9d8 + 27", bonus: "3d6", weapons: ["Rapier", "Shortsword", "Flintlock"], haki: "Color of Observation Novice",
    powers: [["class-features", "Dodge Roll"], ["class-features", "Defense Roll"]], note: "May, a pirate lieutenant in floral clothing. Rogue 9 (Assassin), CR 6: hit points raised to the CR 6 band, Veteran's Edge adds +3d6 weapon damage." },
  jay: { name: "Jay", cls: "bard", level: 9, cr: 6, abil: { str: 8, dex: 14, con: 14, int: 10, wis: 12, cha: 20 }, hp: 148, hpFormula: "9d8 + 27", bonus: "3d6", weapons: ["Rapier", "Flintlock"], haki: "Color of Observation Novice",
    powers: [["class-features", "Heart Strings"], ["class-features", "Song of Life and Death"]], spells: { tricks: ["Vicious Mockery", "Guidance", "Prestidigitation"], spells: ["Healing Word", "Cure Wounds", "Heroism", "Hold Person", "Mirror Image", "Fear", "Bestow Curse", "Greater Invisibility", "Hold Monster"], slots: [4, 3, 3, 3, 1] },
    note: "Jay, a pirate lieutenant in floral clothing. Bard 9 (College of Swords), CR 6: hit points raised to the CR 6 band, Veteran's Edge adds +3d6 weapon damage." },
  shin: { name: "Shin", cls: "fighter", level: 12, cr: 8, abil: { str: 16, dex: 18, con: 16, int: 10, wis: 10, cha: 14 }, hp: 180, hpFormula: "8d10 + 4d8 + 48", bonus: "3d8", weapons: ["Cutlass", "Flintlock"], haki: "Color of Armament Novice", rogueHalf: true,
    powers: [["class-features", "Machiavellian Misfit"], ["class-features", "Pinpoint Precision"], ["class-features", "Evasive Maneuvers"]], note: "Shin, the pirate captain, the scum of the earth in floral clothing. Fighter 8 (Brute) / Rogue 4 (Thief), level 12, CR 8: hit points raised to the CR 8 band, Veteran's Edge adds +3d8 weapon damage." },
};

function feat(idPath: string, name: string, img: string, description: string, o: { activation: { type: string; cost: number | null; condition?: string } }): FeatureItem {
  return ensureFeatureActivities({
    _id: generateId(idPath), name, type: "feat", img,
    system: { description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "class", subtype: "" }, requirements: "",
      activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" }, duration: { value: null, units: "" }, target: { value: null, width: null, units: "", type: "" },
      range: { value: 5, long: null, units: "ft" }, uses: { value: null, max: "", per: null, recovery: "", prompt: true }, actionType: "", damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" }, chatFlavor: "", recharge: { value: null, charged: false } },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem);
}

function build(slug: string) {
  const c = CFGS[slug]; if (!c) throw new Error(`unknown npc ${slug}`);
  const chassis = JSON.parse(readFileSync(`${ACTORS}/${slug}-chassis.json`, "utf-8"));
  const meta = JSON.parse(readFileSync(`reports/.meta-${slug}.json`, "utf-8")) as { skills: string[]; expertise: string[]; tools: string[] };
  let items: Doc[] = chassis.items as Doc[];

  // ---- Shin: merge the Rogue 4 half (its class, subclass and features; names already on the Fighter half are skipped)
  if (c.rogueHalf) {
    const r = JSON.parse(readFileSync(`${ACTORS}/${slug}-rogue-chassis.json`, "utf-8")), have = new Set(items.map((i) => i.name));
    const add = (r.items as Doc[]).filter((i) => (["class", "subclass", "feat"].includes(i.type ?? "") && !have.has(i.name ?? "") && !(i.name ?? "").startsWith("Role:")) || i.name === "Thieves' Tools");
    for (const i of add) if (i.name === "Expertise") i.name = "Expertise (Rogue)";
    items = [...items, ...add];
  }

  // ---- Weapons: the pipeline's starting weapons are replaced by the wielded ones
  const want = new Set(c.weapons);
  items = items.filter((i) => !(["weapon", "consumable"].includes(i.type ?? "") && !want.has(i.name ?? "")) || i.name === "Small Medkit" || i.name === "Rations (1 day)");
  for (const w of c.weapons) if (!items.some((i) => i.name === w)) items.push(embedOwnedItem(pack("items", w) as never) as Doc);
  for (const i of items) if (want.has(i.name ?? "")) i.system.equipped = true;
  // one body armour only (the best base AC; the starting "Navy Uniform" counts as armour but is only worn when nothing better exists) plus a shield if he carries one
  const bodies = items.filter((i) => i.type === "equipment" && ["light", "medium", "heavy"].includes(i.system?.type?.value));
  const real = bodies.filter((i) => i.name !== "Navy Uniform"), best = [...(real.length ? real : bodies)].sort((x, y) => (y.system.armor?.value ?? 0) - (x.system.armor?.value ?? 0))[0];
  for (const b of bodies) b.system.equipped = b === best;
  for (const i of items) if (i.type === "equipment" && i.system?.type?.value === "shield") i.system.equipped = true;

  // ---- Haki bonus (levels below the class's level 8 choice) and Chapter 7 powers
  if (c.haki && !items.some((i) => /^Color of|^Conqueror/.test(i.name ?? ""))) items.push(embedOwnedItem(pack("class-features", c.haki) as never) as Doc);
  for (const [p, n] of c.powers) items.push(embedOwnedItem(pack(p, n) as never) as Doc);

  const auto = refreshFromPacks(items);
  const summons = standaloneSummons(items, ACTORS, slug);
  console.log(`${c.name}: automation onto ${auto.refreshed.length} features${summons.length ? "; summons " + summons.join(",") : ""}`);

  // ---- Veteran's Edge: bespoke damage bonus so the CR band is reached (a straight class build undershoots)
  const edge = feat(`homebrew/${slug}/veterans-edge`, "Veteran's Edge", "icons/skills/melee/strike-slashes-orange.webp", `<p>Weapon attacks deal an extra ${c.bonus} damage. <em>Balance note: a bespoke feature, not a class feature, so ${c.name} reaches the CR ${c.cr === 0.5 ? "1/2" : c.cr} damage band.</em></p>`, { activation: { type: "special", cost: null, condition: "Passive" } });
  edge.effects = [{ _id: generateId(`effect/${slug}/veterans-edge`), name: "Veteran's Edge", img: "icons/skills/melee/strike-slashes-orange.webp", disabled: false, transfer: true,
    changes: ["mwak", "rwak"].map((t) => ({ key: `system.bonuses.${t}.damage`, mode: 2, value: `+${c.bonus}`, priority: 20 })), duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null }] as never;
  items.push(embedOwnedItem(edge as never) as Doc);

  // ---- Spells (Jay)
  if (c.spells) {
    const cr = (name: string) => { const x = (creations as Doc[]).find((y) => y.name === name); if (!x) throw new Error(`creation ${name}`); const d = structuredClone(x) as Doc; d.system.preparation = { mode: "prepared", prepared: true }; return embedOwnedItem(ensureItemActivities(d as never) as never) as Doc; };
    items.push(...c.spells.tricks.map(cr), ...c.spells.spells.map(cr));
  }

  // ---- Numbers
  const sys = chassis.system;
  for (const [k, v] of Object.entries(c.abil)) { sys.abilities[k].value = v; sys.abilities[k].proficient = 0; }
  for (const k of [...SAVES[c.cls], ...(c.extraSaves ?? [])]) sys.abilities[k].proficient = 1;
  const prof = new Set(meta.skills), exp = new Set(meta.expertise);
  sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: exp.has(k) ? 2 : prof.has(k) ? 1 : c.cls === "bard" ? 0.5 : 0, ability: ab }]));
  sys.traits.armorProf = { value: c.cls === "fighter" ? ["lgt", "med", "hvy", "shl"] : ["lgt"], custom: "" };
  sys.traits.weaponProf = { value: c.cls === "fighter" ? ["sim", "mar"] : ["sim"], custom: c.cls === "fighter" ? "" : "hand crossbows, longswords, rapiers, shortswords, firearms" };
  if (c.spells) { sys.attributes.spellcasting = "cha"; sys.spells = Object.fromEntries([...c.spells.slots, 0, 0, 0, 0].slice(0, 9).map((m, i) => [`spell${i + 1}`, { value: m, max: m }])); }
  sys.attributes.hp = { value: c.hp, max: c.hp, temp: 0, tempmax: 0, formula: c.hpFormula };   // CR balance: the class formula undershoots the CR band, so the maximum is set
  sys.details.cr = c.cr; sys.details.level = c.level;
  sys.details.biography.value = `<p>${c.note}</p>`;
  chassis.name = c.name;

  // ---- Clean-up: no DAE flags, no legacy @scale damage parts, one Role item
  for (const i of items) {
    for (const e of (i.effects ?? []) as Record<string, any>[]) if (e.flags) delete e.flags.dae;
    const parts = i.system?.damage?.parts;
    if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
  }
  const roles = items.map((i, k) => ((i.name ?? "").startsWith("Role:") ? k : -1)).filter((k) => k >= 0);
  for (const k of roles.slice(1).reverse()) items.splice(k, 1);
  chassis.items = items;
  writeFileSync(`${ACTORS}/${slug}.json`, JSON.stringify(chassis, null, 2), "utf-8");
  console.log(`Wrote ${ACTORS}/${slug}.json (${items.length} items)`);
}
const todo = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(CFGS);
for (const s of todo) build(s);
void existsSync;
