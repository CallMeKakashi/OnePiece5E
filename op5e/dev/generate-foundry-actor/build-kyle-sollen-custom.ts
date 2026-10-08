// Kyle Sollen: Human Bard 11 (College of Lore) / Rogue 4 (Inquisitive), Sphinx mythical zoan, CR 13 duo boss.
// Chassis comes from the real pipeline (specs/kyle-sollen-spec.json = Bard 11, specs/kyle-sollen-rogue-spec.json = the Rogue 4 half, merged here).
// Homebrew (Sphinx fruit powers, weapon, boss kit) goes through ensureFeatureActivities/generateId like every compendium item.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { refreshFromPacks } from "./refresh-from-packs.js";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import creations from "../../data/src/creations/index.js";
import { SPHINX_ID, HYBRID_ID } from "./build-kyle-sollen-sphinx.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/kyle-sollen-chassis.json`, "utf-8"));
const rogue = JSON.parse(readFileSync(`${ACTORS}/kyle-sollen-rogue-part.json`, "utf-8"));
const pack = (p: string, name: string): Doc => {
  const dir = `packs-src/${p}`;
  for (const f of readdirSync(dir)) {
    const d = JSON.parse(readFileSync(`${dir}/${f}`, "utf-8"));
    if (d.name === name) return d;
  }
  throw new Error(`${p}/${name} not found`);
};

// ---- 1. Rogue 4 (Inquisitive) merged in as the second class
const ROGUE_FEATS = ["Decipher Deceit", "Observe Opponent", "Expertise", "Sneak Attack", "Thieves' Cant", "Cunning Action", "Steady Aim"];
const fromRogue = (rogue.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || ROGUE_FEATS.includes(i.name ?? "") || i.name === "Thieves' Tools");
for (const i of fromRogue) if (i.type === "feat" && i.name === "Expertise") i.name = "Expertise (Rogue)";
const items: Doc[] = [...chassis.items, ...fromRogue];

// ---- 2. Haki: the pipeline only offered Novice twice; the second pick was "upgrade Observation to Apprentice"
const novice = items.filter((i) => i.name === "Color of Observation Novice");
if (novice.length === 2) items.splice(items.indexOf(novice[1]), 1, embedOwnedItem(pack("class-features", "Color of Observation Apprentice") as never) as Doc);

// ---- 3. Feats chosen: Lucky (Rogue 4 ASI); Skill Expert came with the chassis
items.push(embedOwnedItem(pack("feats", "Lucky") as never) as Doc);

// ---- 4. Devil fruit: real zoan rules items (uses, ability check/DC/attack, hybrid, beast, enhanced, drawback) + the fruit itself renamed
for (const n of ["Devil Fruit Uses", "Devil Fruit Ability Check, Fruit-Fruit DC and Attack", "Zoan Hybrid Form", "Zoan Full Beast Form", "Zoan Enhanced Form", "Ocean's Scorn"]) items.push(embedOwnedItem(pack("feats", n) as never) as Doc);
// automation from the built packs first, so the zoan wiring below is not overwritten by it
const auto = refreshFromPacks(items);
console.log(`automation copied from the built packs onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);

// Kyle is a mythical zoan: keep only the mythical activities, point Full Beast Form at the Sphinx actor, and swap the token for Hybrid Form (ATL)
for (const n of ["Zoan Hybrid Form", "Zoan Full Beast Form"]) {
  const it = items.find((i) => i.name === n)!;
  for (const [k, a] of Object.entries(it.system.activities) as [string, any][]) if (!/mythical/.test(a.name)) delete it.system.activities[k];
}
for (const a of Object.values(items.find((i) => i.name === "Zoan Full Beast Form")!.system.activities) as any[]) a.profiles = [{ _id: generateId("homebrew/kyle-sollen/sphinx-profile"), name: "Sphinx", uuid: `Actor.${SPHINX_ID}`, cr: "", level: { min: null, max: null }, movement: [], sizes: [], types: [], count: null }];
// Hybrid Form is a transform too: it points at the Sphinx (Hybrid) actor, keeps Kyle's own scores/hp/class/feats/items/spells, and grants temp hp = 4 x level
{
  const hf = items.find((i) => i.name === "Zoan Hybrid Form")!, fb = Object.values(items.find((i) => i.name === "Zoan Full Beast Form")!.system.activities)[0] as any;
  hf.effects = [];   // the +proficiency damage now lives on the hybrid actor ("Hybrid Strikes") and the token swap comes from its prototype token
  const id = generateId("homebrew/kyle-sollen/hybrid-transform");
  const act = structuredClone(fb); act._id = id; act.name = "Hybrid Form (mythical zoan)";
  act.settings = { ...act.settings, keep: ["physical", "mental", "saves", "skills", "gearProf", "languages", "class", "feats", "items", "spells", "bio", "hp"], merge: [], other: [], tempFormula: "4 * @details.level" };
  act.profiles = [{ _id: generateId("homebrew/kyle-sollen/hybrid-profile"), name: "Sphinx (Hybrid)", uuid: `Actor.${HYBRID_ID}`, cr: "", level: { min: null, max: null }, movement: [], sizes: [], types: [], count: null }];
  hf.system.activities = { [id]: act };
}
const fruit = items.find((i) => i.name === "Zoan Devil Fruit (Template)")!;
fruit.name = "Sphinx-Sphinx Fruit (Mythical Zoan)";

// ---- 5. Homebrew features
const eff = (idPath: string, name: string, img: string, changes: { key: string; mode: number; value: string }[]) => ({
  _id: generateId(`effect/${idPath}`), name, img, changes: changes.map((c) => ({ ...c, priority: 20 })), disabled: false,
  duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, transfer: true, flags: {}, statuses: [], tint: null,
});
function feat(idPath: string, name: string, img: string, description: string, o: {
  actionType?: string; activation: { type: string; cost: number | null; condition?: string }; damage?: [string, string][];
  save?: { ability: string; dc: number | null }; uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
  range?: { value: number | null; long?: number | null; units: string }; target?: { value: number | null; width?: number | null; units: string; type: string };
  effects?: ReturnType<typeof eff>[]; recharge?: number | null;
}): FeatureItem {
  const item = {
    _id: generateId(idPath), name, type: "feat", img,
    system: {
      description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" }, requirements: "",
      activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" },
      duration: { value: null, units: "" }, target: o.target ?? { value: null, width: null, units: "", type: "" },
      range: o.range ?? { value: 5, long: null, units: "ft" }, uses: o.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" },
      save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "", recharge: { value: o.recharge ?? null, charged: !!o.recharge },
    },
    effects: o.effects ?? [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
  return ensureFeatureActivities(item);
}
const ICON = {
  eye: "icons/magic/perception/eye-ringed-glow-angry-large-red.webp",
  psych: "icons/magic/control/hypnosis-mesmerism-eye.webp",
  shield: "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  wing: "icons/commodities/biological/wing-bird-white.webp",
  sand: "icons/magic/air/wind-tornado-wall-blue.webp",
  curse: "icons/magic/unholy/hand-marked-pink.webp",
};
const DC = 19;   // 8 + proficiency (+5) + Charisma (+6)

const eyeOfTheSphinx = feat("homebrew/kyle-sollen/eye-of-the-sphinx", "Eye of the Sphinx", ICON.eye,
  "<p><strong>Mark (action):</strong> Kyle looks at a creature he can see in person and sets his gaze on it. The creature becomes <em>Marked</em>. Kyle can track any creature he has Marked, no matter how far away, as long as it is on the same plane: he always knows its direction, distance and general condition (unharmed, bloodied, near death, dead). He cannot Mark anyone he has not seen in person, and a Mark ends when the creature dies or Kyle ends it as a free action. There is no limit to the number of Marks.</p>"
  + "<p><strong>Judge (bonus action):</strong> Kyle studies a Marked creature he can see and learns what it is capable of in combat: its damage resistances, immunities and vulnerabilities, its best and worst saving throws, and what it can do with its action, bonus action and reaction.</p>",
  { actionType: "util", activation: { type: "action", cost: 1 }, range: { value: 120, units: "ft" }, target: { value: 1, units: "", type: "creature" } });
// a second activity on the same item for the bonus action
const judgeActivity = feat("homebrew/kyle-sollen/eye-judge", "Eye of the Sphinx: Judge", ICON.eye, "<p>Learn a Marked creature's resistances, immunities, vulnerabilities, best and worst saves and combat options.</p>",
  { actionType: "util", activation: { type: "bonus", cost: 1 }, range: { value: 120, units: "ft" } });
{
  const acts = eyeOfTheSphinx.system.activities as Record<string, any>;
  const [orig] = Object.values((judgeActivity.system as any).activities) as any[];
  const id = generateId("homebrew/kyle-sollen/eye-of-the-sphinx/judge-activity");
  acts[id] = { ...orig, _id: id, name: "Judge" };
  const [first] = Object.values(acts) as any[]; first.name = "Mark";
}

const riddle = feat("homebrew/kyle-sollen/riddle-of-the-sphinx", "Riddle of the Sphinx", ICON.psych,
  `<p>Action. Kyle poses an unanswerable riddle to one creature within 60 feet that can hear him. It must make a DC ${DC} Wisdom saving throw. On a failed save it takes 12d8 psychic damage and is stunned until the end of its next turn. On a success it takes half damage and is not stunned. Kyle can use this three times per long rest.</p>`,
  { actionType: "save", activation: { type: "action", cost: 1 }, save: { ability: "wis", dc: DC }, damage: [["12d8", "psychic"]], range: { value: 60, units: "ft" }, uses: { value: 3, max: "3", per: "lr", recovery: "", prompt: true } });

const judgment = feat("homebrew/kyle-sollen/judgment-of-the-sphinx", "Judgment of the Sphinx", ICON.shield,
  "<p>Reaction, once per round. When a Marked creature hits an ally Kyle can see within 60 feet, Kyle passes judgment: the damage is reduced by 2d10 + 6. Kyle can use this a number of times equal to his Charisma modifier per long rest.</p>",
  { actionType: "util", activation: { type: "reaction", cost: 1, condition: "A Marked creature hits an ally within 60 ft" }, uses: { value: 6, max: "@abilities.cha.mod", per: "lr", recovery: "", prompt: true }, range: { value: 60, units: "ft" } });

const wings = feat("homebrew/kyle-sollen/wings-of-the-sphinx", "Wings of the Sphinx", ICON.wing,
  "<p>While in his Hybrid Form or Full Beast Form, Kyle has a flying speed of 40 feet and can hover. He keeps to the air above his allies and out of reach of melee fighters.</p>",
  { activation: { type: "special", cost: null, condition: "Hybrid Form or Full Beast Form" } });

const veil = feat("homebrew/kyle-sollen/sphinxs-veil", "Sphinx's Veil", ICON.shield,
  "<p>While in his Hybrid Form or Full Beast Form, Kyle has advantage on saving throws against being charmed, frightened or compelled, and on Wisdom (Insight) checks.</p>",
  { activation: { type: "special", cost: null, condition: "Hybrid Form or Full Beast Form" } });

const sandstorm = feat("homebrew/kyle-sollen/sandstorm-roar", "Sandstorm Roar", ICON.sand,
  `<p>Action, Hybrid Form only. Kyle roars and a 30-foot cone of sand and wind erupts. Each creature in the cone makes a DC ${DC} Dexterity saving throw, taking 10d8 bludgeoning damage and becoming blinded until the end of its next turn on a failed save, or half damage and no blindness on a success. Recharge 5-6.</p>`,
  { actionType: "save", activation: { type: "action", cost: 1 }, save: { ability: "dex", dc: DC }, damage: [["10d8", "bludgeoning"]], range: { value: null, units: "self" }, target: { value: 30, width: null, units: "ft", type: "cone" }, recharge: 5 });

const curse = feat("homebrew/kyle-sollen/pharaohs-curse", "Pharaoh's Curse", ICON.curse,
  `<p>Bonus action, once per round. Kyle curses a Marked creature he can see within 60 feet. It must make a DC ${DC} Wisdom saving throw or have disadvantage on its next attack roll or saving throw before the end of its next turn.</p>`,
  { actionType: "save", activation: { type: "bonus", cost: 1 }, save: { ability: "wis", dc: DC }, range: { value: 60, units: "ft" } });

const eyeSeesAll = feat("homebrew/kyle-sollen/eye-sees-all", "Eye Sees All", ICON.eye,
  "<p>Bonus action. Kyle shares a Marked creature's position and weak points with his allies. For 1 minute, allies within 60 feet who can hear him gain a +2 bonus to attack rolls against that creature. Kyle can use this twice per long rest.</p>",
  { actionType: "util", activation: { type: "bonus", cost: 1 }, uses: { value: 2, max: "2", per: "lr", recovery: "", prompt: true }, range: { value: 60, units: "ft" } });

// ---- 6. Boss kit
const legRes = feat("homebrew/kyle-sollen/legendary-resistance", "Legendary Resistance (3/Day)", ICON.shield, "<p>If Kyle fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 3, max: "3", per: "day", recovery: "", prompt: true } });
const legHeader = feat("homebrew/kyle-sollen/legendary-actions", "Legendary Actions", "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Kyle can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p><ul><li><strong>Vicious Mockery</strong> (1 action): casts the cantrip.</li><li><strong>Gilded Step</strong> (1 action): moves up to half his speed without provoking opportunity attacks.</li><li><strong>Judge</strong> (1 action): uses Judge on a Marked creature.</li><li><strong>Sunbrand Strike</strong> (2 actions): makes one attack with the Sunbrand Khopesh.</li></ul>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy" } });
const legStrike = feat("homebrew/kyle-sollen/legendary-sunbrand-strike", "Sunbrand Strike (Legendary Action)", "icons/weapons/swords/scimitar-guard-gold.webp",
  "<p>Costs 2 legendary actions. Kyle makes one attack with the Sunbrand Khopesh.</p>",
  { actionType: "mwak", activation: { type: "legendary", cost: 2 }, damage: [["4d8 + 4 + 2", "slashing"]] });

// Shared lair-action block: the other duo boss has none of these; it belongs to the lair.
const lair = feat("homebrew/kyle-sollen/lair-actions", "Lair Actions (shared with the duo)", "icons/environment/settlement/market-stall.webp",
  `<p>On initiative count 20 (losing ties), the lair takes one of these actions, and cannot use the same one two rounds in a row. Kyle or his partner may trigger it. (Reflavour for the actual lair as needed.)</p><ul>
<li><strong>Shifting Floor.</strong> The floor in a 20-foot square shifts. Each creature there makes a DC 17 Dexterity saving throw or falls prone and is moved 10 feet in a direction the lair chooses.</li>
<li><strong>Dust Cloud.</strong> A 20-foot-radius cloud of choking dust fills a point in the lair until the next count 20. Creatures in it are blinded and make a DC 17 Constitution saving throw or are poisoned until the cloud clears.</li>
<li><strong>Guards' Call.</strong> Two guards (commoners or similar) arrive at the lair's edge and act on the lair's initiative.</li></ul>`,
  { activation: { type: "special", cost: null, condition: "Initiative count 20" } });

// ---- 7. Homebrew weapon: Sunbrand Khopesh (Alabastan)
const khopesh = (() => {
  const d = structuredClone(pack("items", "Scimitar"));
  d._id = generateId("homebrew/kyle-sollen/sunbrand-khopesh");
  d.name = "Sunbrand Khopesh";
  d.img = "icons/weapons/swords/scimitar-guard-gold.webp";
  d.system.description = { value: "<p>A gilded, sickle-curved khopesh from Kyle's home island, Alabasta, with a sun carved into the blade. A flashy blade for a flashy man. <strong>+2 weapon</strong> (finesse, light, 4d8 slashing: a deliberate boss-balance bump, see the Balance note). <strong>Verdict:</strong> see the Sunbrand Verdict feature (extra 4d6 psychic once per turn against a Marked creature).</p>", chat: "" };
  d.system.damage = { parts: [["4d8", "slashing"]], versatile: "" };   // the +2 comes from magicalBonus (adds to attack and damage); the psychic Verdict is its own feature item (a legacy second damage part is dropped on import)
  d.system.attackBonus = "2"; d.system.magicalBonus = 2; d.system.properties = { fin: true, lgt: true, mgc: true }; d.system.rarity = "rare";
  d.system.equipped = true; d.system.price = { value: 0, denomination: "gp" };
  const out = embedOwnedItem(ensureItemActivities(d as never) as never, { equipped: true }) as Doc;
  for (const a of Object.values(out.system.activities ?? {}) as Record<string, any>[]) a.name = "Sunbrand Khopesh";
  return out;
})();
const verdict = feat("homebrew/kyle-sollen/sunbrand-verdict", "Sunbrand Verdict", "icons/weapons/swords/scimitar-guard-gold.webp",
  "<p>Once per turn, when Kyle hits a Marked creature with the Sunbrand Khopesh, it takes an extra 4d6 psychic damage.</p>",
  { actionType: "other", activation: { type: "special", cost: null, condition: "Once per turn, on a hit against a Marked creature" }, damage: [["4d6", "psychic"]] });

const multiattack = feat("homebrew/kyle-sollen/multiattack", "Multiattack", "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Kyle makes two attacks with the Sunbrand Khopesh (or one attack and one cantrip). <em>Balance note: this is a bespoke boss feature, not a Bard or Rogue class feature; a Bard 11 / Rogue 4 chassis has no Extra Attack and falls far short of the CR 13 damage-per-round expectation.</em></p>",
  { activation: { type: "special", cost: null, condition: "Part of the Attack action" } });

items.push(...[multiattack, verdict, eyeOfTheSphinx, riddle, judgment, wings, veil, sandstorm, curse, eyeSeesAll, legRes, legHeader, legStrike, lair].map((f) => embedOwnedItem(f as never) as Doc), khopesh);

// ---- 8. Spellcasting: Bard 11 full caster (Rogue 4 Inquisitive adds none): 4/3/3/3/2/1 slots, creations from the real list
const creation = (name: string) => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  let doc = structuredClone(c) as Doc;
  doc.system.preparation = { mode: "prepared", prepared: true };
  doc = ensureItemActivities(doc as never) as Doc;
  return embedOwnedItem(doc as never) as Doc;
};
const TRICKS = ["Vicious Mockery", "Guidance", "Prestidigitation"];
const SPELLS = ["Healing Word", "Cure Wounds", "Heroism", "Sanctuary", "Hold Person", "Invisibility", "Mirror Image", "Clairvoyance", "Fear", "Bestow Curse", "Greater Invisibility", "Dimension Door", "Hold Monster", "Mass Cure Wounds"];
items.push(...TRICKS.map(creation), ...SPELLS.map(creation));

// ---- 8b. Gilded Merchant's Vest: Leather Armor reflavoured as light armour with base AC 13 so AC reaches the CR 13 band (18 = 13 + 4 Dex + 1 from a class feature)
const vest = items.find((i) => i.name === "Leather Armor")!;
vest.name = "Gilded Merchant's Vest"; vest.system.armor = { value: 13 };   // dnd5e 5.3 armour has no magical-bonus field, so the +2 is baked into the base (12 + 2 would be 14, but a +1 AC feature already stacks, so 13) vest.system.rarity = "rare";
vest.system.description = { value: "<p>A gold-threaded, flamboyant vest of reinforced silk that turns blades like leather. Light armour, base AC 13. <em>Balance note: bespoke AC so Kyle reaches the CR 13 band.</em></p>", chat: "" };

// ---- 9. Equip, proficiencies and numbers
for (const i of items) if (["Gilded Merchant's Vest", "Flintlock"].includes(i.name ?? "") && i.system) i.system.equipped = true;
for (const i of items) if (["Thieves' Tools", "Tambourine"].includes(i.name ?? "") && i.system) i.system.proficient = 1;
const sys = chassis.system;
sys.abilities.str.value = 8; sys.abilities.dex.value = 18; sys.abilities.con.value = 14; sys.abilities.int.value = 14; sys.abilities.wis.value = 13; sys.abilities.cha.value = 22;   // 20 CHA +2 (Bard 4), 16 DEX +2 (Bard 8), +1 WIS (Skill Expert)
sys.abilities.dex.proficient = 1; sys.abilities.cha.proficient = 1;   // Bard saves
const SKILLS: Record<string, number> = { ins: 2, inv: 2, prf: 2, per: 2, dec: 2, prc: 2, his: 2, slt: 1, arc: 1, ste: 1, itm: 1 };
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
// every skill needs its ability written out: a bare { value } entry leaves the ability unset and Foundry falls back to Dexterity for all of them
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: k === "ins" || k === "inv" || k === "prf" || k === "per" || k === "dec" || k === "prc" || k === "his" ? 2 : SKILLS[k] ?? (k === "ath" ? 0 : 0.5), ability: ab }]));
sys.traits.armorProf = { value: ["lgt"], custom: "" };
sys.traits.weaponProf = { value: ["sim"], custom: "hand crossbows, longswords, rapiers, shortswords, firearms" };
sys.attributes.spellcasting = "cha";
sys.spells = Object.fromEntries([4, 3, 3, 3, 2, 1, 0, 0, 0].map((max, i) => [`spell${i + 1}`, { value: max, max }]));
// CR balance pass: a real Bard 11 / Rogue 4 (15d8 + 2 CON per level + Tough = 127 hp, AC 15) lands near CR 5; HP is overridden to 245 for the CR 13 band (DMG hp 236-250)
// (the formula cannot get there at level 15 even with 20 CON). Documented on the sheet.
sys.attributes.hp = { value: 245, max: 245, temp: 0, tempmax: 0, formula: "15d8 + 60" };
sys.attributes.movement.swim = 0;   // devil fruit user: cannot swim
sys.resources = { legact: { value: 3, max: 3 }, legres: { value: 3, max: 3 }, lair: { value: true, initiative: 20 } };
sys.details.cr = 13; sys.details.level = 15;
sys.details.biography.value = "<p>Kyle Sollen, a flamboyant Alabastan businessman, once a slave and now a Scholar of the seas. He eats the Sphinx-Sphinx Fruit, a mythical zoan, and quietly serves the island's boss for his own ends. He fights from the backline with the Eye of the Sphinx, spells and the Sunbrand Khopesh.</p><p><strong>Balance note (CR 13):</strong> built as Bard 11 / Rogue 4, level 15. A straight class build lands near CR 5, so hit points are overridden to 245, armour is a magic vest (AC 18), the Khopesh deals 4d8 + 4d6 psychic Verdict, and Kyle has a bespoke Multiattack. Fruit powers and save DCs (19) are as written.</p>";
// ---- 10. Clean-up: one Role item, no DAE flags (target world may not run DAE), and no legacy damage.parts holding @scale formulas
// (the real formula lives in the activity; a leftover legacy part with @scale makes Foundry throw "Unresolved StringTerm" when the actor imports)
const roleIdx = items.map((i, k) => (i.name === "Role: Scholar" ? k : -1)).filter((k) => k >= 0);
for (const k of roleIdx.slice(1).reverse()) items.splice(k, 1);
for (const i of items) {
  for (const e of (i.effects ?? []) as Record<string, any>[]) if (e.flags) delete e.flags.dae;
  const parts = i.system?.damage?.parts;
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
}
chassis.items = items;

writeFileSync(`${ACTORS}/kyle-sollen.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/kyle-sollen.json (${items.length} items)`);
