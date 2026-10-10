// Calder Voss (Vorro): Lunarian Brawler 12 (Six Powers Master), Marine/Soldier, Captain role, level 12. Marine commodore, boss. Built 2026-10-10.
// Chassis from the real pipeline: specs/calder-spec.json -> ../Foundry/actors-json/calder-chassis.json.
import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, wireSpirit } from "./refresh-from-packs.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { lunarianFeatures } from "../../data/src/racial-features/lunarian.js";
import { flowingMindFeatures } from "../../data/src/class-features/additional/flowing-mind.js";
import creations from "../../data/src/creations/index.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any>; effects?: any[] } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/calder-chassis.json`, "utf-8"));
const pack = (p: string, id: string): Doc => JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8"));

const DROP = ["Sling Bullets (20)", "No Devil Fruit (yet)", "Role: Captain"];
let roleSeen = false;
const out: Doc[] = (chassis.items as Doc[]).filter((i) => !DROP.includes(i.name ?? ""));
for (const i of chassis.items as Doc[]) if (i.name === "Role: Captain" && !roleSeen) { roleSeen = true; out.push(i); } // pipeline embeds the role twice
chassis.items = out;

// Lunarian traits the pipeline does not grant (Ultimate Duality is level 15)
for (const f of lunarianFeatures) if (f.name !== "Ultimate Duality") out.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc);
const creation = (name: string) => { // Flame Investure: Fire Bolt, Elemental Armor (fire only), Fireball
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  return embedOwnedItem(ensureItemActivities({ ...structuredClone(c), system: { ...structuredClone(c.system), preparation: { mode: "always", prepared: true } } } as never) as never) as Doc;
};
for (const n of ["Fire Bolt", "Elemental Armor", "Fireball"]) out.push(creation(n));
out.push(embedOwnedItem(pack("feats", "2f6cd976e5725c37") as never) as Doc); // Flying Strikes (level 12 feat)
for (const f of flowingMindFeatures) out.push(embedOwnedItem(ensureFeatureActivities(f as never) as never) as Doc); // Chapter 7 additional power, user pick

const auto = refreshFromPacks(out); console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
console.log(`spirit cost wired on: ${wireSpirit(out).join(", ")}`);
for (const i of out) {
  if (["Brawler Unarmed Strike", "Flintlock"].includes(i.name ?? "") && i.system) i.system.equipped = true;
  if (i.type === "tool") i.system.proficient = 1;
  const parts = i.system?.damage?.parts; // Foundry refuses legacy @scale parts; the real formula lives in the activity
  if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = [];
  const u = i.system?.uses; // legacy uses.per -> uses.recovery
  if (u?.max && ["sr", "lr"].includes(u.per)) { u.recovery = [{ period: u.per, type: "recoverAll" }]; u.per = null; }
}

const sys = chassis.system;
const abil = { str: 11, dex: 20, con: 14, int: 10, wis: 17, cha: 12 }; // 10/16/14/10/14/12 + Lunarian +2 Dex +1 Wis + L4/L8 +2 Dex, +2 Wis + Flying Strikes +1 Str
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.str.proficient = 1; sys.abilities.dex.proficient = 1; // Brawler saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { ath: 1, acr: 1, itm: 1, ins: 1, per: 1 }; // Marine: Athletics, Acrobatics; Brawler: Intimidation, Insight; Captain: Persuasion (picks duplicated)
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.attributes.movement = { ...sys.attributes.movement, fly: 30 }; // Lunarian wings
sys.attributes.spellcasting = "con"; // Flame Investure creative ability is Constitution
sys.details.level = 12;
// CR balance pass (DMG): real HP is 87 (111 with Tough) = defensive CR 6 and AC 18 = +1; attack +10 and about 46 damage across Extra Attack plus Flurry of Blows = offensive CR 10; Spirit DC 16 matches CR 10.
// HP is overridden to 210 (DMG CR 10 band 206-220) because he is a solo boss without legendary actions (the Sourcebook has none). Real HP is 111 with Tough.
sys.attributes.hp = { value: 210, max: 210, temp: 0, tempmax: 0, formula: "12d8 + 24" };
sys.details.cr = 10;
sys.details.biography.value = "<p>Calder Voss, born Vorro of the Motley Crew: a Marine captain and later commodore at Spirit Cliff (G-45), a Lunarian who fights with the Six Powers.</p><p><strong>Balance note (CR 10):</strong> a straight Brawler 12 is about CR 8 to 9 on defenses, so HP is overridden to 210 for a solo boss.</p>";
const sp = out.find((i) => i.name === "Spirit"); if (sp) sp.system.uses.max = `${sp.system.uses.max} + @abilities.wis.mod`; // Flowing Mind: Free Spirit
chassis.name = "Calder Voss";
chassis.img = "one-piece-5e/npcs/Marines/calder-new.jpg";
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Marines/calder-new-token.png" } };
writeFileSync(`${ACTORS}/calder.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/calder.json (${out.length} items)`);
