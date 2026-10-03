import { createItemChoiceRestricted, createTrait, type AdvancementEntry } from "../../helpers/advancement.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import feats from "../feats/index.js";

// Background text -> real advancements (skills, tools, feat choice). Source of truth is the background description itself.
const SKILL: Record<string, string> = {
  acrobatics: "acr", "animal handling": "ani", arcana: "arc", engineering: "arc", /* "Arcana = Engineering" in this setting */
  athletics: "ath", deception: "dec", history: "his", insight: "ins", intimidation: "itm", investigation: "inv",
  medicine: "med", nature: "nat", perception: "prc", performance: "prf", persuasion: "per", religion: "rel",
  "sleight of hand": "slt", stealth: "ste", survival: "sur",
};
const NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, "1": 1, "2": 2, "3": 3, "4": 4 };
const TOOL: Record<string, string> = {
  "disguise kit": "tool:disg", "fishing tackle": "tool:fishing", "dial kit": "tool:dial", "appraiser's tools": "tool:appraiser", "thieves' tools": "tool:thief", "herbalism kit": "tool:herb", "forgery kit": "tool:forg",
  "poisoner's kit": "tool:pois", "navigator's tools": "tool:navg",
  "alchemist's supplies": "tool:alchemist", "brewer's supplies": "tool:brewer", "calligrapher's supplies": "tool:calligrapher",
  "carpenter's tools": "tool:carpenter", "cartographer's tools": "tool:cartographer", "cobbler's tools": "tool:cobbler",
  "cook's utensils": "tool:cook", "glassblower's tools": "tool:glassblower", "jeweler's tools": "tool:jeweler",
  "leatherworker's tools": "tool:leatherworker", "mason's tools": "tool:mason", "painter's supplies": "tool:painter",
  "potter's tools": "tool:potter", "smith's tools": "tool:smith", "tinker's tools": "tool:tinker", "weaver's tools": "tool:weaver",
  "woodcarver's tools": "tool:woodcarver", "gaming set": "tool:game:*", "water vehicles": "tool:water", "vehicles (water)": "tool:water", "vehicles (land)": "tool:land",
};

/** "Gaming set", "one musical instrument", "1 set of Artisan's tools of your choice" -> choice over the whole dnd5e tool category. */
const genericTool = (p: string): { count: number; pool: string[] } | null => {
  const t = p.toLowerCase(); const n = NUM[(t.match(/(one|two|1|2)/) ?? [])[1] ?? ""] ?? 1;
  if (/gaming set/.test(t) && !/ or /.test(t)) return { count: n, pool: ["tool:game:*"] };
  if (/musical instrument|^one instrument/.test(t)) return { count: n, pool: ["tool:music:*"] };
  if (/artisan/.test(t)) return { count: n, pool: ["tool:art:*"] };
  // "2 tool kits": the kits in this setting (dial, disguise, forgery, herbalism, poisoner's)
  if (/tool kits?/.test(t)) return { count: n, pool: ["tool:dial", "tool:disg", "tool:forg", "tool:herb", "tool:pois"] };
  // "1 tool of your choosing": any tool proficiency
  if (/\btool of your choos|set of tools of your choice/.test(t)) return { count: n, pool: ["tool:art:*", "tool:game:*", "tool:music:*", "tool:dial", "tool:disg", "tool:forg", "tool:herb", "tool:navg", "tool:pois", "tool:thief", "tool:appraiser", "tool:fishing"] };
  return null;
};
// Weapon feats by the weapon each one covers (from the feat text): ranged simple/martial weapons, and melee ones dealing piercing or slashing.
const RANGED_WEAPON_FEATS = ["Bow Mastery", "Dart Master", "Handgun Master", "Rifle Master", "Shotgun Master", "Sling Master"];
const MELEE_PIERCING_SLASHING_FEATS = ["Rapier Mastery", "Longsword Master", "Katana Master", "Axe Mastery", "Scimitar Master", "Short Blade Master", "Spear Mastery", "Warpick Mastery", "Whip Master", "Cutlass Mastery", "Lance Master", "Polearm Master"];
const ALIAS: Record<string, string> = { "warpick master": "warpick mastery" };
const strip = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const names = (s: string) => s.split(/,|\band\b|\bor\b/i).map((x) => x.trim().toLowerCase().replace(/\.$/, "")).filter(Boolean);

/** Returns the advancement entries (Trait for skills/tools, ItemChoice for the feat pair) parsed from a background description. */
export function backgroundOriginAdvancement(backgroundId: string, desc: string, log: (m: string) => void = () => {}): AdvancementEntry[] {
  const out: AdvancementEntry[] = [];
  const id = `background/${backgroundId}`;
  const skillText = strip(desc.match(/Skill Proficiencies:<\/strong>\s*([^<]*)/)?.[1] ?? "").replace(/^Role:\s*[^:]+:\s*/i, "");

  // skills: "2 from A, B, C", "Choose two from A, B", "Persuasion, choose two from A, B"
  const choose = skillText.match(/^(?:(.*?),\s*)?(?:choose\s+)?(\w+)\s+from\s+(.+)$/i);
  if (choose) {
    const fixed = names(choose[1] ?? "").map((n) => SKILL[n]).filter(Boolean).map((k) => `skills:${k}`);
    const count = NUM[choose[2].toLowerCase()];
    const pool = [...new Set(names(choose[3]).map((n) => SKILL[n]).filter(Boolean))].map((k) => `skills:${k}`);
    if (count && pool.length >= count) {
      out.push(createTrait(id, 0, { mode: "default", grants: fixed, choices: [{ count, pool }], hint: skillText }, "skills"));
    } else log(`${backgroundId}: could not parse skills "${skillText}"`);
  } else if (skillText) {
    const grants = names(skillText).map((n) => SKILL[n]).filter(Boolean).map((k) => `skills:${k}`);
    if (grants.length) out.push(createTrait(id, 0, { mode: "default", grants, hint: skillText }, "skills"));
    else log(`${backgroundId}: could not parse skills "${skillText}"`);
  }

  // tools: fixed when every named tool maps to a known key; "X or Y" becomes a choice of one
  const toolText = strip(desc.match(/Tool Proficiencies:<\/strong>\s*([^<]*)/)?.[1] ?? "").replace(/\.$/, "")
    .replace(/Woodcarver's and Carpenter's tools/i, "Woodcarver's tools, Carpenter's tools")
    .replace(/Calligrapher's Supplies and one musical instrument of your choice/i, "Calligrapher's Supplies, one musical instrument");
  if (toolText && !/^none$/i.test(toolText)) {
    const parts = toolText.split(/,|\band\b/i).map((p) => p.trim()).filter(Boolean);
    const grants: string[] = [], choices: { count: number; pool: string[] }[] = []; let ok = true;
    for (const p of parts) {
      const generic = genericTool(p);
      if (generic) { choices.push(generic); continue; }
      const alts = p.split(/\s+or\s+/i).map((a) => TOOL[a.trim().toLowerCase()]);
      if (alts.some((a) => !a)) { ok = false; break; }
      if (alts.length === 1) grants.push(alts[0]); else choices.push({ count: 1, pool: alts });
    }
    if (ok) out.push(createTrait(id, 0, { mode: "default", grants, choices, hint: toolText }, "tools"));
    else log(`${backgroundId}: tools left as text "${toolText}"`);
  }

  // feat: "choice of the X Feat or the Y Feat" -> ItemChoice over those feats in the feats pack
  const featText = strip(desc.match(/<h4>Feature:[^<]*<\/h4>\s*<p>([^<]*)/)?.[1] ?? "");
  const m = featText.match(/choice of (?:a |an |the )?(.+?)(?:\.|$)/i);
  // "a weapon mastery feat with a ... weapon": pool of the matching weapon feats (weapon types per each feat's own text)
  if (m && /weapon mastery feat/i.test(m[1])) {
    const names = /ranged/i.test(m[1]) ? RANGED_WEAPON_FEATS : /melee/i.test(m[1]) && /piercing or slashing/i.test(m[1]) ? MELEE_PIERCING_SLASHING_FEATS : [];
    const uuids = names.map((n) => feats.find((f) => f.name === n)).filter(Boolean).map((f) => compendiumUuid("feats", f!._id));
    if (uuids.length === names.length && uuids.length) out.push(createItemChoiceRestricted(id, 0, uuids, { count: 1, label: "feat" }));
    else log(`${backgroundId}: weapon mastery feat pool not resolved`);
  } else if (m && /feat/i.test(m[1])) {
    const wanted = m[1].split(/\s+or\s+|,/i).map((n) => n.replace(/^(?:the\s+)/i, "").replace(/\s*feat$/i, "").trim().toLowerCase()).map((n) => ALIAS[n] ?? n).filter(Boolean);
    const uuids = wanted.map((n) => feats.find((f) => f.name.toLowerCase() === n || f.name.toLowerCase() === `${n} feat`)).filter(Boolean)
      .map((f) => compendiumUuid("feats", f!._id));
    if (uuids.length === wanted.length && uuids.length) out.push(createItemChoiceRestricted(id, 0, uuids, { count: 1, label: "feat" }));
    else log(`${backgroundId}: feat choice not resolved for "${wanted.join(" | ")}"`);
  }
  return out;
}
