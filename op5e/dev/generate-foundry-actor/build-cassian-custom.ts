// Cassian Valehart: Human Bard 8 (College of Eloquence), Noble, Role: Scholar, no fruit, level 8, CR 6. Lawyer at the Lex Imperia high court. Built 2026-10-11.
// Chassis from specs/cassian-spec.json. Custom: courtroom creation set (compendium only), Observation Novice, scores, HP override.
import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks } from "./refresh-from-packs.js";
import { ensureItemActivities } from "../../data/helpers/activities.js";
import creations from "../../data/src/creations/index.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const actor = JSON.parse(readFileSync(`${ACTORS}/cassian-chassis.json`, "utf-8")) as Doc;
const creation = (name: string) => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  return embedOwnedItem(ensureItemActivities({ ...structuredClone(c), system: { ...structuredClone(c.system), preparation: { mode: "always", prepared: true } } } as never) as never) as Doc;
};

const DROP = ["Clothes, Common", "Dagger", "No Devil Fruit (yet)"];
const seen = new Set<string>(); // the pipeline embeds the role, Silver Tongue and Investigator more than once
actor.items = actor.items.filter((i) => {
  if (DROP.includes(i.name ?? "")) return false;
  if (!(i.name?.startsWith("Role: ") || ["Silver Tongue", "Investigator"].includes(i.name ?? ""))) return true;
  if (seen.has(i.name!)) return false; seen.add(i.name!); return true;
});
// Tricks and creations (user's courtroom set): Vicious Mockery comes from Silver Tongue
for (const n of ["Vicious Mockery", "Thunder Bolt", "Sonic Boom", "Guidance", // tricks
  "Thunderwave", "Command", "Healing Word", "Bane", // 1st
  "Shatter", "Hold Person", "Suggestion", "Truth Zone", // 2nd: Dissonant Verdict, Cease and Desist, Cross-Examiner
  "Counter Creation", "Fear", // 3rd
  "Confusion", "Hold Monster"]) actor.items.push(creation(n)); // 4th
for (const i of actor.items) {
  if (["Quarterstaff", "Leather Armor"].includes(i.name ?? "")) i.system.equipped = true; // Requiem of Clause (quarterstaff form); the suit is Leather Armor
  if (i.type === "tool") i.system.proficient = 1;
}

// point-buy 12/13/13/10/12/8 on Cha/Dex/Con/Int/Wis/Str (cost 20); Human +1 all; Silver Tongue Cha +1; Investigator Int +1; ASIs 4 and 8: Cha +2 each
const sys = actor.system;
const abil = { str: 9, dex: 14, con: 14, int: 12, wis: 13, cha: 18 };
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
for (const k of Object.keys(abil)) sys.abilities[k].proficient = ["dex", "cha"].includes(k) ? 1 : 0; // Bard saves
sys.attributes.spellcasting = "cha";
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
// Noble: Persuasion, History; Bard: Deception, Intimidation, Performance; Scholar: Insight, Investigation; expertise: Persuasion, Insight; Silver Tongue doubles Deception, Investigator doubles Investigation
const VALUES: Record<string, number> = { per: 2, ins: 2, dec: 2, inv: 2, his: 1, itm: 1, prf: 1 };
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.details.level = 8; sys.details.cr = 6;
sys.attributes.hp = { value: 140, max: 140, temp: 0, tempmax: 0, formula: "8d8 + 16" }; // override: DMG CR 6 band 131-145 (real about 43, legacy 91)
sys.details.biography.value = "<p>Cassian Valehart: lawyer at the Lex Imperia high court, son of Judge Valehart, Goru's cousin, and a fighter whose flute extends into the long baton Requiem of Clause (here a Quarterstaff).</p><p><strong>Balance note (CR 6):</strong> a straight Bard 8 is about 43 HP, so HP is overridden to 140 (DMG CR 6 band 131-145; the legacy sheet said 91). The legacy sound powers map to compendium creations: Dissonant Verdict = Shatter, Cease and Desist = Hold Person, Cross-Examiner = Truth Zone, Closing Argument = Bardic Inspiration.</p>";
actor.name = "Cassian Valehart";

const r = refreshFromPacks(actor.items);
console.log(`Refreshed ${r.refreshed.length} items; unmatched: ${r.unmatched.join(", ") || "none"}`);
writeFileSync(`${ACTORS}/cassian.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/cassian.json (${actor.items.length} items)`);
