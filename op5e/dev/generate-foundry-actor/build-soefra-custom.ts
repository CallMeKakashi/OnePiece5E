// Lady Soefra Anthem: Human Bard 11 (College of Bewitchment), Entertainer, Musician, Heart Strings (no Devil Fruit), CR 9. Built 2026-10-10.
// Chassis comes from the real pipeline (specs/soefra-spec.json). Custom: creations, Heart Strings, Lucky, gown AC, and a CR balance feature.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import { heartStringsFeatures } from "../../data/src/class-features/additional/heart-strings.js";
import creations from "../../data/src/creations/index.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const PORTRAIT = "one-piece-5e/npcs/Decibella/soefra-new.jpg";
const TOKEN = "one-piece-5e/npcs/Decibella/soefra-new-token.png";
const DC = 17; // 8 + proficiency (+4) + Charisma (+5)
const actor = JSON.parse(readFileSync(`${ACTORS}/soefra-chassis.json`, "utf-8")) as Doc;
const pack = (p: string, name: string): Doc => {
  const dir = `packs-src/${p}`;
  for (const f of readdirSync(dir)) {
    const d = JSON.parse(readFileSync(`${dir}/${f}`, "utf-8"));
    if (d.name === name) return d;
  }
  throw new Error(`${p}/${name} not found`);
};

function feat(idPath: string, name: string, img: string, description: string, o: {
  activation: { type: string; cost: number | null; condition?: string };
  actionType?: string; damage?: [string, string][]; save?: { ability: string; dc: number };
  uses?: Doc; recharge?: number; range?: Doc; target?: Doc; duration?: Doc; requirements?: string;
}): Doc {
  return embedOwnedItem(ensureFeatureActivities({
    _id: generateId(idPath), name, type: "feat", img,
    system: {
      description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" }, requirements: o.requirements ?? "Shire Shire no Mi",
      activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" },
      duration: o.duration ?? { value: null, units: "" }, target: o.target ?? { value: null, width: null, units: "", type: "" },
      range: o.range ?? { value: 60, long: null, units: "ft" }, uses: o.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" },
      save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "", recharge: { value: o.recharge ?? null, charged: !!o.recharge },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem) as never) as Doc;
}
const lr3 = { value: 3, max: "3", per: "lr", recovery: "", prompt: true };
const one = { value: 1, width: null, units: "ft", type: "creature" };

const ICON = "icons/magic/sonic/projectile-sound-rings-wave.webp";

// ---- 1. Chapter 7 additional power: Heart Strings (no Devil Fruit); the "No Devil Fruit (yet)" placeholder goes
actor.items = actor.items.filter((i) => i.name !== "No Devil Fruit (yet)");
for (const f of heartStringsFeatures) actor.items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc);

// ---- 2. ASI feat at level 8: Lucky
actor.items.push(embedOwnedItem(pack("feats", "Lucky") as never) as Doc);

// ---- 3. Creations (Bard 11 full caster: 4/3/3/3/2/1), from the real list
const creation = (name: string) => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  let doc = structuredClone(c) as Doc;
  doc.system.preparation = { mode: "prepared", prepared: true };
  doc = ensureItemActivities(doc as never) as Doc;
  return embedOwnedItem(doc as never) as Doc;
};
const have = new Set(actor.items.map((i) => i.name));
const TRICKS = ["Vicious Mockery", "Mind Slash", "Whisper", "Guidance", "Thunder Bolt"];
const SPELLS = ["Thunderwave", "Shatter", "Charm Person", "Healing Word", "Mass Healing Word", "Compulsion", "Confusion", "Greater Invisibility", "Charm Monster", "Freedom of Movement"]; // 4th level: 4 known, 3 slots
for (const n of [...TRICKS, ...SPELLS]) if (!have.has(n)) actor.items.push(creation(n));

// ---- 4. Gown: the chassis only carries Leather Armor, reflavoured as the stained-glass dress, light armour with base AC 14
const gown = actor.items.find((i) => i.name === "Leather Armor");
if (!gown) throw new Error("Soefra chassis has no Leather Armor to reflavour");
gown.name = "Stained-Glass Gown"; gown.system.armor = { value: 14 }; gown.system.equipped = true;
gown.system.description = { value: "<p>A gown of stained glass that rings when struck. Light armour, base AC 14. <em>Balance note: bespoke AC so Soefra reaches the CR 9 band.</em></p>", chat: "" };

// ---- 5. Cleanup
const seen = new Set<string>();
actor.items = actor.items.filter((i) => {
  if (!i.name?.startsWith("Role: ")) return true;
  if (seen.has(i.name)) return false;
  seen.add(i.name); return true;
});
for (const i of actor.items) { if (i.name === "Rapier") i.system.equipped = true; if (i.type === "tool") i.system.proficient = 1; }

// ---- 6. CR 9 balance: HP to the DMG band (191-205) and a labelled bespoke sonic attack
const crescendo = feat("homebrew/soefra/crescendo", "Soundless Crescendo", ICON,
  `<p>Action. Soefra releases a stored note in a 30-foot cone. Each creature in it makes a DC ${DC} Constitution saving throw, taking 6d8 thunder damage on a failure, or half as much on a success. Recharge 5-6. <em>Balance note: bespoke CR 9 feature, not a class feature.</em></p>`,
  { activation: { type: "action", cost: 1 }, actionType: "save", save: { ability: "con", dc: DC }, damage: [["6d8", "thunder"]], range: { value: 30, long: null, units: "ft" },
    target: { value: 30, width: null, units: "ft", type: "cone" }, requirements: "" });
// dnd5e 5.x recharge: one use on the item, recovered on a 5-6, spent by the activity
crescendo.system.uses = { spent: 0, max: "1", recovery: [{ period: "recharge", type: "recoverAll", formula: "5" }] };
for (const act of Object.values(crescendo.system.activities ?? {}) as Doc[]) act.consumption = { ...(act.consumption ?? {}), targets: [{ type: "itemUses", target: "", value: "1", scaling: {} }] };
actor.items.push(crescendo);

// ---- 7. Numbers
const sys = actor.system;
sys.abilities.dex.proficient = 1; sys.abilities.cha.proficient = 1; // Bard saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const PROF = new Set(["acr", "prf", "per", "dec", "ins", "his", "ani"]); // Entertainer, Bard, Musician
const EXPERT = new Set(["prf", "per", "dec", "ins"]); // Bard expertise at 3 and 10
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: EXPERT.has(k) ? 2 : PROF.has(k) ? 1 : 0, ability: ab }]));
sys.attributes.spellcasting = "cha";
sys.spells = Object.fromEntries([4, 3, 3, 3, 2, 1, 0, 0, 0].map((max, i) => [`spell${i + 1}`, { value: max, max }]));
sys.attributes.hp = { value: 198, max: 198, temp: 0, tempmax: 0, formula: "11d8 + 22" }; // real formula gives about 80; overridden to 198 for CR 9 (DMG hp 191-205)
sys.details.cr = 9; sys.details.level = 11;
sys.details.biography.value = "<p>Lady Soefra Anthem, one of the Soundless 5 and enforcer of silence in Decibella Kingdom. Twin sister of Sephra, and the jealous diva who had Cadence masked early. Tall and slender in a stained-glass gown, she conducts with a baton-blade and a loud, opera-trained voice.</p><p><strong>Balance note (CR 9):</strong> a straight Bard 11 is well under CR 9, so hit points are overridden to 198, the gown sets her AC, and Potent Creativity adds +5 to trick damage and Soundless Crescendo (6d8 thunder cone, DC 17) is a bespoke attack.</p>";
actor.name = "Lady Soefra Anthem";
actor.img = PORTRAIT;
actor.prototypeToken = { ...(actor.prototypeToken ?? {}), texture: { ...(actor.prototypeToken?.texture ?? {}), src: TOKEN } };

const refreshed = refreshFromPacks(actor.items);
console.log(`Refreshed ${refreshed.refreshed.length} Soefra items; unmatched: ${refreshed.unmatched.join(", ") || "none"}`);
// ---- 8. Activity fixes (after refresh so they stick): healing formulas, utility types
const acts = (n: string) => Object.values(actor.items.find((i) => i.name === n)!.system.activities ?? {}) as Doc[];
const heal = (a: Doc, formula: string) => { a.type = "heal"; delete a.damage; delete a.roll; a.healing = { number: null, denomination: null, bonus: "", types: ["healing"], custom: { enabled: true, formula }, scaling: { mode: "", number: null, formula: "" } }; };
const util = (a: Doc, formula: string) => { a.type = "utility"; delete a.damage; delete a.save; a.roll = { formula, name: "", prompt: false, visible: false }; };
for (const a of acts("Healing Word")) heal(a, "2d6 + @mod"); // description: 2d6 + creativity modifier (not 1d4)
for (const a of acts("Mass Healing Word")) { heal(a, "2d6 + @mod"); a.target.affects = { count: "6", type: "creature", choice: true, special: "" }; }
for (const a of acts("Harmonic Vitality")) heal(a, "@scale.bard.harmonic-vitality");
for (const a of acts("Bardic Inspiration")) util(a, "@scale.bard.bardic-inspiration");
for (const a of acts("Guidance")) util(a, "1d4");
// Trick scaling at level 11 (stored cantrip scaling is not trusted: set dice explicitly) and Potent Creativity (Bewitchment 6: + Cha mod to Bard trick damage)
for (const [n, dice] of [["Vicious Mockery", 3], ["Mind Slash", 3], ["Thunder Bolt", 3]] as [string, number][]) {
  const it = actor.items.find((i) => i.name === n)!;
  it.system.damage.parts = it.system.damage.parts.map(([f, t]: [string, string]) => [f.replace(/^\d+/, String(dice)), t]);
  for (const a of acts(n)) for (const p of a.damage?.parts ?? []) { p.number = dice; p.bonus = "@abilities.cha.mod"; }
}
const summons = standaloneSummons(actor.items, ACTORS, "soefra");
console.log(`Summon files: ${summons.join(", ") || "none"}`);
writeFileSync(`${ACTORS}/soefra.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/soefra.json (${actor.items.length} items)`);
