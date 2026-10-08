// Tyrell: moose Mink, Barbarian 8 (Path of the Pugilist) / Brawler 7 (Sumo Wrestler), level 15, CR 12 duo boss, Kyle Sollen's bodyguard. No devil fruit, fists only.
// Chassis from the real pipeline: specs/tyrell-spec.json (Barbarian 8) + specs/tyrell-brawler-spec.json (the Brawler 7 half, merged here).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { refreshFromPacks } from "./refresh-from-packs.js";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { minkDarkvision, minkNaturalWeapons, innerBeast, electro, diurnalNature } from "../../data/src/racial-features/mink.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/tyrell-chassis.json`, "utf-8"));
const brawler = JSON.parse(readFileSync(`${ACTORS}/tyrell-brawler-part.json`, "utf-8"));
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};

// ---- 1. Fists only: drop the pipeline's starting weapons (Javelin, Handaxe, Club) and merge the Brawler 7 half
const BRAWLER_FEATS = ["Sumo Stance", "Mountain Stance", "Surface Pressure", "Brawling", "Spirit", "Flurry of Blows", "Patient Defense", "Deft Escape", "Unarmored Movement", "Deflect Missiles", "Brace for Impact", "Stunning Strike", "Evasion", "Shake it Off"];
// Extra Attack does not stack with the Barbarian's; the Barbarian's Unarmored Defense (10 + Dex + Con) is the one Tyrell uses
const fromBrawler = (brawler.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || BRAWLER_FEATS.includes(i.name ?? "") || i.name === "Brawler Unarmed Strike");
for (const i of fromBrawler) if (i.name === "Unarmored Movement") i.name = "Unarmored Movement (Brawler)";
const items: Doc[] = [...(chassis.items as Doc[]).filter((i) => !["Javelin", "Handaxe", "Club"].includes(i.name ?? "")), ...fromBrawler];

// ---- 2. Mink racial traits (darkvision, natural weapons = the moose's antlers, Inner Beast, Electro, Diurnal Nature) and the Charger feat
for (const r of [minkDarkvision, minkNaturalWeapons, innerBeast, electro, diurnalNature]) items.push(embedOwnedItem(r as never) as Doc);
items.push(embedOwnedItem(pack("feats", "Charger") as never) as Doc);
// Chapter 7 additional power (no devil fruit): Armorless Guardian (+ its Duck and Dodge AC bonus, which grows at level 10)
for (const n of ["Armorless Guardian", "Duck and Dodge"]) items.push(embedOwnedItem(pack("class-features", n) as never) as Doc);

// ---- 3. Homebrew
function feat(idPath: string, name: string, img: string, description: string, o: {
  actionType?: string; activation: { type: string; cost: number | null; condition?: string }; damage?: [string, string][];
  save?: { ability: string; dc: number | null }; uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
  range?: { value: number | null; long?: number | null; units: string }; target?: { value: number | null; width?: number | null; units: string; type: string };
}): FeatureItem {
  return ensureFeatureActivities({
    _id: generateId(idPath), name, type: "feat", img,
    system: {
      description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" }, requirements: "",
      activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" },
      duration: { value: null, units: "" }, target: o.target ?? { value: null, width: null, units: "", type: "" },
      range: o.range ?? { value: 5, long: null, units: "ft" }, uses: o.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" },
      save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "", recharge: { value: null, charged: false },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem);
}
const DC = 18;   // 8 + proficiency (+5) + Strength (+5)

const takeTheHit = feat("homebrew/tyrell/take-the-hit", "Take the Hit", "icons/magic/defensive/shield-barrier-glowing-blue.webp",
  "<p>Reaction. When Kyle Sollen, or any ally Tyrell can see within 10 feet, would be hit by an attack or damaged by an effect, Tyrell moves up to 10 feet without provoking opportunity attacks, ends in an unoccupied space adjacent to them, and becomes the target instead. He takes the damage with resistance to it. Tyrell can use this three times per long rest.</p>",
  { actionType: "util", activation: { type: "reaction", cost: 1, condition: "An ally within 10 ft would be hit or damaged" }, uses: { value: 3, max: "3", per: "lr", recovery: "", prompt: true }, range: { value: 10, units: "ft" } });

const mooseRut = feat("homebrew/tyrell/moose-rut", "Moose Rut", "icons/commodities/bones/horn-antler-brown.webp",
  `<p>Bonus action. Tyrell lowers his antlers and charges, moving up to 20 feet in a straight line. The first creature in his path must make a DC ${DC} Strength saving throw, taking 4d10 bludgeoning damage and being knocked prone and pushed 10 feet on a failed save, or half damage and no other effect on a success. Tyrell can use this twice per long rest.</p>`,
  { actionType: "save", activation: { type: "bonus", cost: 1 }, save: { ability: "str", dc: DC }, damage: [["4d10", "bludgeoning"]], range: { value: 20, units: "ft" }, uses: { value: 2, max: "2", per: "lr", recovery: "", prompt: true } });

const legRes = feat("homebrew/tyrell/legendary-resistance", "Legendary Resistance (2/Day)", "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp", "<p>If Tyrell fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 2, max: "2", per: "day", recovery: "", prompt: true } });
const legHeader = feat("homebrew/tyrell/legendary-actions", "Legendary Actions", "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Tyrell can take 2 legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p><ul><li><strong>Strike</strong> (1 action): makes one unarmed strike.</li><li><strong>Shoulder Check</strong> (2 actions): moves up to half his speed without provoking opportunity attacks and shoves one creature he passes.</li></ul>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy" } });
const legStrike = feat("homebrew/tyrell/legendary-strike", "Strike (Legendary Action)", "icons/skills/melee/unarmed-punch-fist.webp", "<p>Costs 1 legendary action. Tyrell makes one unarmed strike.</p>",
  { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: [["2d8 + 5", "bludgeoning"]] });
const shoulder = feat("homebrew/tyrell/shoulder-check", "Shoulder Check (Legendary Action)", "icons/magic/earth/barrier-stone-brown-green.webp", "<p>Costs 2 legendary actions. Tyrell moves up to half his speed without provoking opportunity attacks and shoves one creature he passes.</p>",
  { actionType: "util", activation: { type: "legendary", cost: 2 } });
// CR balance pass: a straight Barbarian 8 / Brawler 7 lands near CR 7 (173 hp, AC 16, about 50 damage a round); HP is overridden to 240 and a bespoke feature
// adds +2d8 unarmed damage (Armorless Guardian supplies the AC) so he reaches the CR 12 band (hp 221-235, AC 17, about 75 damage a round). Labelled on the sheet.
const bruiser = feat("homebrew/tyrell/bruisers-build", "Bodyguard's Build", "icons/commodities/bones/horn-antler-brown.webp",
  "<p>Years of hauling and fighting for Kyle have made Tyrell a wall. <em>Balance note: bespoke boss feature, not a class feature.</em> His melee attacks deal an extra 2d8 damage.</p>",
  { activation: { type: "special", cost: null, condition: "Passive" } });
bruiser.effects = [{
  _id: generateId("effect/tyrell/bruisers-build"), name: "Bodyguard's Build", img: "icons/commodities/bones/horn-antler-brown.webp", disabled: false, transfer: true,
  changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "+2d8", priority: 20 }],
  duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null,
}] as never;
items.push(...[bruiser, takeTheHit, mooseRut, legRes, legHeader, legStrike, shoulder].map((f) => embedOwnedItem(f as never) as Doc));

// ---- 4. Numbers and proficiencies
const sys = chassis.system;
const abil = { str: 20, dex: 14, con: 18, int: 8, wis: 12, cha: 10 };   // base 18/14/16 + 2 STR (Barbarian 4) + 2 CON (Barbarian 8); Brawler 4 took the Charger feat
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.con.proficient = 1;   // Barbarian saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const PROF = new Set(["ath", "itm", "sur", "ins"]);   // Athletics, Intimidation (Barbarian), Survival, Insight (Slave); the role's Survival repeats
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: PROF.has(k) ? 1 : 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt", "med", "shl"], custom: "" };
sys.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
sys.attributes.ac = { flat: null, calc: "unarmoredBarb", formula: "" };   // 10 + Dex + Con while unarmored
sys.attributes.hp = { value: 240, max: 240, temp: 0, tempmax: 0, formula: "8d12 + 7d8 + 90" };   // real formula gives about 173; overridden to 240 for CR 12 (DMG hp 236-250)
sys.attributes.senses.darkvision = 60;
sys.resources = { legact: { value: 2, max: 2 }, legres: { value: 2, max: 2 }, lair: { value: true, initiative: 20 } };
sys.details.cr = 12; sys.details.level = 15;
sys.details.biography.value = "<p>Tyrell, a moose Mink, bodyguard and oldest friend of Kyle Sollen. The two grew up as slaves together, and Tyrell has never stopped standing between Kyle and the world. He fights bare-handed: antlers, shoulders and fists.</p><p><strong>Balance note (CR 12):</strong> a straight Barbarian 8 / Brawler 7 is near CR 7, so hit points are overridden to 240 and Bodyguard's Build adds +2d8 unarmed damage.</p>";

const auto = refreshFromPacks(items);
console.log(`automation copied from the built packs onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);

// ---- 5. Clean-up: no DAE flags, no legacy damage.parts holding @scale (the real formula is in the activity)
for (const i of items) {
  for (const e of (i.effects ?? []) as Record<string, any>[]) if (e.flags) delete e.flags.dae;
  const parts = i.system?.damage?.parts;
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
}
const roles = items.map((i, k) => (i.name === "Role: Master at Arms" ? k : -1)).filter((k) => k >= 0);
for (const k of roles.slice(1).reverse()) items.splice(k, 1);
chassis.items = items;
writeFileSync(`${ACTORS}/tyrell.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/tyrell.json (${items.length} items)`);
