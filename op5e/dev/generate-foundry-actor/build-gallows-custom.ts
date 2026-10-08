// The Gallows: a former marine turned vigilante hunting the people behind his family's death, two homebrew batons.
// Ally: Human Fighter 7 (Blitzkrieg) / Rogue 3 (Bruiser), level 10, CR 8.   Usage: node ...build-gallows-custom.ts [ally|boss]
// Chassis from the real pipeline: specs/gallows-spec.json (Fighter) + specs/gallows-rogue-spec.json (the Rogue half, merged here).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const VARIANT = (process.argv[2] ?? "ally") as "ally" | "boss";
const ACTORS = "../Foundry/actors-json";
const SUFFIX = VARIANT === "boss" ? "-boss" : "";
const chassis = JSON.parse(readFileSync(`${ACTORS}/gallows${SUFFIX}-chassis.json`, "utf-8"));
const rogue = JSON.parse(readFileSync(`${ACTORS}/gallows${SUFFIX}-rogue-part.json`, "utf-8"));
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};
const CFG = VARIANT === "boss"
  ? { name: "The Gallows (Boss)", level: 15, cr: 12, prof: 5, hp: 232, dex: 20, baton: "3d6", takeDownDc: 18, bonusAtk: 0 }
  : { name: "The Gallows", level: 10, cr: 8, prof: 4, hp: 182, dex: 18, baton: "2d6", takeDownDc: 15, bonusAtk: 0 };

// ---- 1. Merge the Rogue half; drop the pipeline's starting weapons (his weapons are the two batons)
const ROGUE_FEATS = ["Hired Thug", "Armed and Dangerous", "Expertise", "Sneak Attack", "Thieves' Cant", "Cunning Action", "Steady Aim", "Uncanny Dodge", "Evasion", "Reliable Talent"];
const fromRogue = (rogue.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || ROGUE_FEATS.includes(i.name ?? "") || i.name === "Thieves' Tools");
for (const i of fromRogue) if (i.type === "feat" && i.name === "Expertise") i.name = "Expertise (Rogue)";
const DROP = ["Mace", "Crossbow, Light", "Handaxe", "Arrows (20)", "Crossbow Bolts (20)", "Explorer's Pack"];
const items: Doc[] = [...(chassis.items as Doc[]).filter((i) => !DROP.includes(i.name ?? "")), ...fromRogue];
items.push(embedOwnedItem(pack("feats", "Dual Wielder") as never) as Doc);
// Chapter 7 additional power (no devil fruit): Multiple Weapon Style needs the Two-Weapon Fighting style, so he takes that Fighter style too
const fs = items.findIndex((i) => i.name === "Fighting Style" && i.type === "feat");
if (fs >= 0) items.splice(fs, 1, embedOwnedItem(pack("class-features", "Fighting Style: Two-Weapon Fighting") as never) as Doc);
for (const n of ["Multiple Weapon Style", "Additional Strike"]) items.push(embedOwnedItem(pack("class-features", n) as never) as Doc);
const haki = ["Color of Armament Novice"];
if (VARIANT === "ally") items.push(embedOwnedItem(pack("class-features", "Color of Armament Novice") as never) as Doc);   // a marine's training (his classes stop short of the level 8 Haki choice)
else { const nov = items.filter((i) => i.name === "Color of Armament Novice"); if (nov.length === 2) items.splice(items.indexOf(nov[1]), 1, embedOwnedItem(pack("class-features", "Color of Armament Apprentice") as never) as Doc); }   // level 10 pick: upgrade Armament
void haki;

// automation from the built packs first (see refresh-from-packs.ts)
const auto = refreshFromPacks(items);
console.log(`automation copied from the built packs onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);

const summons = standaloneSummons(items, ACTORS, "gallows");
if (summons.length) console.log(`summon actors written (import them with ids kept): ${summons.join(", ")}`);

// ---- 2. Homebrew
function feat(idPath: string, name: string, img: string, description: string, o: {
  actionType?: string; activation: { type: string; cost: number | null; condition?: string }; damage?: [string, string][];
  save?: { ability: string; dc: number | null }; uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
  range?: { value: number | null; long?: number | null; units: string };
}): FeatureItem {
  return ensureFeatureActivities({
    _id: generateId(idPath), name, type: "feat", img,
    system: {
      description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "class", subtype: "" }, requirements: "",
      activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" }, duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" }, range: o.range ?? { value: 5, long: null, units: "ft" }, uses: o.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" },
      save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" }, chatFlavor: "", recharge: { value: null, charged: false },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem);
}
const baton = (side: "Left" | "Right"): Doc => {
  const d = structuredClone(pack("items", "Club")) as Doc;
  d._id = generateId(`homebrew/gallows/baton-${side.toLowerCase()}`); d.name = `Gallows Baton (${side})`;
  d.img = "icons/weapons/clubs/club-baton-blue.webp";
  d.system.description = { value: "<p>One of a pair of weighted steel batons the Gallows carries; worn like a marine's truncheon, used like a duelist's blades. <strong>+1 weapon</strong> (finesse, light). See <em>Take-Down</em> for the rider.</p>", chat: "" };
  d.system.damage = { parts: [[CFG.baton, "bludgeoning"]], versatile: "" };
  d.system.properties = { fin: true, lgt: true, mgc: true }; d.system.magicalBonus = 1; d.system.attackBonus = "1"; d.system.rarity = "uncommon";
  d.system.type = { value: "martialM", baseItem: "" }; d.system.price = { value: 0, denomination: "gp" };
  const out = embedOwnedItem(ensureItemActivities(d as never) as never, { equipped: true }) as Doc;
  for (const a of Object.values(out.system.activities ?? {}) as Record<string, any>[]) a.name = `Gallows Baton (${side})`;
  return out;
};
const takeDown = feat("homebrew/gallows/take-down", "Take-Down", "icons/skills/melee/unarmed-punch-fist.webp",
  `<p>Once per turn, when the Gallows hits a creature with a Gallows Baton, it must make a DC ${CFG.takeDownDc} Strength saving throw or be knocked prone.</p>`,
  { actionType: "save", activation: { type: "special", cost: null, condition: "Once per turn, on a baton hit" }, save: { ability: "str", dc: CFG.takeDownDc }, range: { value: 5, units: "ft" } });
const extras: Doc[] = [takeDown, baton("Left"), baton("Right")].map((f) => (f.type === "weapon" ? f : (embedOwnedItem(f as never) as Doc)));
items.push(...extras);

if (VARIANT === "boss") {
  const legRes = feat("homebrew/gallows/legendary-resistance", "Legendary Resistance (3/Day)", "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp", "<p>If the Gallows fails a saving throw, he can choose to succeed instead.</p>",
    { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 3, max: "3", per: "day", recovery: "", prompt: true } });
  const legHeader = feat("homebrew/gallows/legendary-actions", "Legendary Actions", "icons/skills/melee/strike-slashes-orange.webp",
    "<p>The Gallows can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p><ul><li><strong>Baton Strike</strong> (1 action): one attack with a Gallows Baton.</li><li><strong>Vanish into the Crowd</strong> (1 action): the Cunning Action Hide or Disengage, no bonus action needed.</li><li><strong>Hanging Sentence</strong> (2 actions): one attack with each baton against the same target.</li></ul>",
    { activation: { type: "special", cost: null, condition: "Legendary action economy" } });
  const legStrike = feat("homebrew/gallows/legendary-baton-strike", "Baton Strike (Legendary Action)", "icons/weapons/clubs/club-baton-blue.webp", "<p>Costs 1 legendary action. One attack with a Gallows Baton.</p>",
    { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: [[`${CFG.baton} + 6`, "bludgeoning"]] });
  const lair = feat("homebrew/gallows/lair-actions", "Lair Actions", "icons/environment/settlement/castle-gatehouse.webp",
    `<p>On initiative count 20 (losing ties), the Gallows takes one lair action, not the same one two rounds in a row. (Written for a marine outpost or the gallows themselves; reflavour as needed.)</p><ul><li><strong>Gallows Drop.</strong> A trapdoor in a 10-foot square opens. Each creature there makes a DC 17 Dexterity saving throw or falls 20 feet, taking 2d6 bludgeoning damage and landing prone.</li><li><strong>Alarm Bell.</strong> A bell tolls. Each creature that can hear it makes a DC 17 Wisdom saving throw or is stunned until the end of its next turn.</li><li><strong>Manacles Out.</strong> Chains lash out at one creature within 60 feet: DC 17 Strength saving throw or it is restrained until the end of its next turn.</li></ul>`,
    { activation: { type: "special", cost: null, condition: "Initiative count 20" } });
  items.push(...[legRes, legHeader, legStrike, lair].map((f) => embedOwnedItem(f as never) as Doc));
}

// the pipeline embeds starting armour unequipped
for (const i of items) if (["Heavy Longcoat"].includes(i.name ?? "") && i.system) i.system.equipped = true;

// ---- 3. Numbers and proficiencies
const sys = chassis.system;
const abil = VARIANT === "boss" ? { str: 12, dex: 20, con: 16, int: 10, wis: 14, cha: 8 } : { str: 12, dex: 18, con: 14, int: 10, wis: 14, cha: 8 };   // base 12/16/14/10/14/8: +2 DEX (Fighter 4); boss adds later bumps
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.con.proficient = 1;   // Fighter saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { ath: 2, acr: 1, itm: 1, ins: 2, prc: 1 };   // Rogue expertise: Insight and Athletics; Acrobatics taken twice (background and Fighter), Intimidation (Fighter), Perception (Rogue class pick)
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
sys.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
// CR balance pass (see the sheet): a straight Fighter 7 / Rogue 3 has far fewer hit points than the CR 8 band, so HP is overridden.
sys.attributes.hp = { value: CFG.hp, max: CFG.hp, temp: 0, tempmax: 0, formula: VARIANT === "boss" ? "10d10 + 5d8 + 75" : "7d10 + 3d8 + 60" };
sys.details.cr = CFG.cr; sys.details.level = CFG.level;
if (VARIANT === "boss") sys.resources = { legact: { value: 3, max: 3 }, legres: { value: 3, max: 3 }, lair: { value: true, initiative: 20 } };
chassis.name = CFG.name;
sys.details.biography.value = VARIANT === "boss"
  ? "<p>The Gallows, as an enemy: a former marine turned vigilante, driven by the death of his family, who believes the party has betrayed the only cause he has left. Two weighted steel batons, no mercy, no more warnings.</p><p><strong>Balance note (CR 12):</strong> built as Fighter 10 / Rogue 5, level 15, with HP overridden to 232 and a boss kit (legendary resistance, legendary actions, lair actions).</p>"
  : "<p>The Gallows: a former marine turned vigilante hunting the people behind the deaths of his family. He fights crime with two weighted steel batons and a marine's discipline. An ally of the party.</p><p><strong>Balance note (CR 8):</strong> built as Fighter 7 (Blitzkrieg) / Rogue 3 (Bruiser), level 10, with HP overridden to 182 so he reaches the CR 8 band.</p>";

// ---- 4. Clean-up: no DAE flags, no legacy damage.parts holding @scale
for (const i of items) {
  for (const e of (i.effects ?? []) as Record<string, any>[]) if (e.flags) delete e.flags.dae;
  const parts = i.system?.damage?.parts;
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
}
const roles = items.map((i, k) => (i.name === "Role: Captain" ? k : -1)).filter((k) => k >= 0);
for (const k of roles.slice(1).reverse()) items.splice(k, 1);
for (const n of ["Hired Thug"]) void n;
chassis.items = items;
writeFileSync(`${ACTORS}/gallows${SUFFIX === "-boss" ? "-boss" : ""}.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/gallows${SUFFIX}.json (${items.length} items)`);
