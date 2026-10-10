// Vesper Grimrose: Human Rogue 8 (Assassin), level 8, CR 5, Bounty Hunter, Scholar, Cheater Cheater, Shadow Guild Scorpion Unit. Built 2026-10-10.
// Compendium only, no Devil Fruit, no Haki (user's choice).
import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { cheaterCheaterFeatures } from "../../data/src/class-features/additional/cheater-cheater.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/vesper-chassis.json`, "utf-8"));
const pack = (p: string, id: string): Doc => JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8"));
const embed = (p: string, id: string) => embedOwnedItem(pack(p, id) as never) as Doc;

const DROP = ["Dagger", "Arrows (20)", "No Devil Fruit (yet)"];
let items: Doc[] = (chassis.items as Doc[]).filter((i) => !DROP.includes(i.name ?? ""));
const seen = new Set<string>();
items = items.filter((i) => { if (!i.name?.startsWith("Role: ")) return true; if (seen.has(i.name)) return false; seen.add(i.name); return true; });
items.push(embed("feats", "b651df7d208d04de")); // Poisoner (level 4)
items.push(embed("feats", "4e7abe5deef318b7")); // Mobile (level 8)
for (const f of cheaterCheaterFeatures) items.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc); // Chapter 7 additional power (user pick)
const kit = embed("items", "dcb059006db4975a"); kit.system.proficient = 1; items.push(kit); // Poisoner feat grants kit proficiency
for (const i of items) if (["Leather Armor", "Rapier", "Shortsword"].includes(i.name ?? "") && i.system) i.system.equipped = true;

// ---- Numbers. Array 10/16/14/12/12/10 + Human +1 Dex/Con/Int + Skill Expert +1 Dex; both ASIs were feats.
const sys = chassis.system;
const abil = { str: 10, dex: 18, con: 15, int: 13, wis: 12, cha: 10 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.dex.proficient = 1; sys.abilities.int.proficient = 1; // Rogue saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
// Bounty Hunter Prc/Ins; Rogue Ste/Slt/Acr/Dec; Skill Expert Inv (+ Prc expertise); expertise Ste/Slt (level 1), Acr/Inv (level 6). Scholar's Stealth duplicated a Rogue pick.
const VALUES: Record<string, number> = { prc: 2, ins: 1, ste: 2, slt: 2, acr: 2, dec: 1, inv: 2 };
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.traits.armorProf = { value: ["lgt"], custom: "" };
sys.traits.weaponProf = { value: ["sim"], custom: "hand crossbows, longswords, rapiers, shortswords" };

// ---- CR 5 pass (band: AC 15, HP 131-145, attack +6, damage/round 33-38, DC 15 n/a)
// AC leather 11 + Dex 4 = 15. Attack +3 prof +4 Dex = +7. HP: 8d8+16 is 52, overridden to 138.
sys.attributes.hp = { value: 138, max: 138, temp: 0, tempmax: 0, formula: "8d8 + 16" };
// DPR: rapier 1d8+4 with 4d6 Sneak Attack and an off-hand shortsword is ~26/round. Rapier bumped to 3d8+4 gives ~35.
const rap = items.find((i) => i.name === "Rapier")!;
for (const a of Object.values(rap.system.activities ?? {}) as any[]) {
  const p = a.damage?.parts?.[0]; if (!p) continue;
  p.number = 3; p.denomination = 8; p.bonus = "4"; p.types = ["piercing"];
  if (p.custom) { p.custom.enabled = false; p.custom.formula = ""; }
}
rap.system.damage = { base: { number: 3, denomination: 8, bonus: "4", types: ["piercing"], custom: { enabled: false, formula: "" }, scaling: { mode: "", number: 1 } } };
rap.system.description.value += "<p><em>Bespoke CR 5 damage bump (3d8 + 4) over the real 1d8 + 4.</em></p>";
sys.details.cr = 5; sys.details.level = 8;
chassis.items = items;
chassis.name = "Vesper Grimrose";
chassis.img = "one-piece-5e/npcs/Shadows Guild/vesper-new.jpg";
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Shadows Guild/vesper-new-token.png" } };
sys.details.biography.value = "<p>Vesper Grimrose, rank 19 of the Shadow Guild's Scorpion Unit, an assassin.</p><p><strong>Balance note (CR 5):</strong> a straight Rogue 8 is far under CR 5 on hit points, so HP is overridden to 138 and the rapier is bumped to 3d8 + 4.</p>";

writeFileSync(`${ACTORS}/vesper.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/vesper.json (${items.length} items)`);
