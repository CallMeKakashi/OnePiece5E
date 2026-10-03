import { generateId } from "./id.js";
import { createTrait, type AdvancementEntry } from "./advancement.js";
import { createDAEEffect, addBonus } from "./effects.js";

// Feat description -> advancement + effects. Only unambiguous, unconditional sentences are wired; everything else stays text.
const ABILITIES: Record<string, string> = { strength: "str", dexterity: "dex", constitution: "con", intelligence: "int", wisdom: "wis", charisma: "cha" };
const SKILLS: Record<string, string> = {
  acrobatics: "acr", "animal handling": "ani", arcana: "arc", engineering: "arc", athletics: "ath", deception: "dec", history: "his",
  insight: "ins", intimidation: "itm", investigation: "inv", medicine: "med", nature: "nat", perception: "prc", performance: "prf",
  persuasion: "per", religion: "rel", "sleight of hand": "slt", stealth: "ste", survival: "sur",
};
const TOOL_STEM: Record<string, string> = {
  alchemist: "alchemist", brewer: "brewer", calligrapher: "calligrapher", carpenter: "carpenter", cartographer: "cartographer",
  cobbler: "cobbler", cook: "cook", glassblower: "glassblower", jeweler: "jeweler", leatherworker: "leatherworker", mason: "mason",
  painter: "painter", potter: "potter", smith: "smith", tinker: "tinker", weaver: "weaver", woodcarver: "woodcarver",
  disguise: "disg", dial: "dial", fishing: "fishing", appraiser: "appraiser", forgery: "forg", herbalism: "herb", navigator: "navg", poisoner: "pois", thieves: "thief",
};
const NUM: Record<string, number> = { one: 1, two: 2, three: 3, "1": 1, "2": 2, "3": 3 };

const strip = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const toolKey = (raw: string): string | null => {
  const stem = raw.toLowerCase().replace(/[’'`]/g, "").replace(/\s+(tools?|supplies|utensils|kit|tackle)$/, "").replace(/s$/, "").trim();
  const hit = TOOL_STEM[stem] ?? TOOL_STEM[stem.replace(/s$/, "")];
  return hit ? `tool:${hit}` : null;
};

export interface FeatAutomation { advancement: AdvancementEntry[]; effects: ReturnType<typeof createDAEEffect>[] }

export function featAutomation(featId: string, descHtml: string, log: (m: string) => void = () => {}, opts: { proficienciesOnly?: boolean } = {}): FeatAutomation {
  const text = strip(descHtml);
  const advancement: AdvancementEntry[] = [], effects: FeatAutomation["effects"] = [];
  const path = `feat/${featId}`;

  // 1. Ability score increase: "Increase your A (or B, or C) score by 1"
  const asi = opts.proficienciesOnly ? null : text.match(/Increase (?:your|one) ([^.]*?) scores? (?:of your choice )?by (\d+)/i);
  if (asi) {
    const named = [...asi[1].matchAll(/Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma/gi)].map((m) => ABILITIES[m[0].toLowerCase()]);
    const amount = Number(asi[2]);
    const all = Object.values(ABILITIES);
    const choices = named.length ? [...new Set(named)] : all;
    const single = choices.length === 1;
    advancement.push({
      _id: generateId(`${path}/advancement/asi`), type: "AbilityScoreImprovement",
      configuration: {
        cap: amount, max: 20,
        fixed: single ? { [choices[0]]: amount } : {},
        locked: single ? all.filter((a) => a !== choices[0]) : all.filter((a) => !choices.includes(a)),
        points: single ? 0 : amount,
      },
      value: {}, level: 0, title: "", icon: "", classRestriction: "", hint: asi[0],
    } as unknown as AdvancementEntry);
  }

  // 2. Proficiencies (unconditional, explicitly named)
  const grants: string[] = [], choicePools: { count: number; pool: string[] }[] = [];
  let mode: "default" | "upgrade" = "default";
  for (const m of text.matchAll(/You (?:gain|have) proficiency (?:in|with) ([^.]*)\.|You are proficient (?:in|with) ([^.]*)\./gi)) {
    const phrase = (m[1] ?? m[2]).replace(/, or expertise if you were already proficient/i, "").trim();
    // plain skill lists: "the Deception and Insight skills", "Acrobatics and Stealth"
    const names = phrase.replace(/^the /i, "").replace(/ skills?$/i, "").split(/,\s*(?:and\s+)?|\s+and\s+/i).map((n) => n.trim().toLowerCase().replace(/\s+checks$/, "").replace(/^[a-z]+ \(([a-z ]+)\)$/, "$1"));
    if (names.length > 1 && names.every((n) => SKILLS[n])) { grants.push(...names.map((n) => `skills:${SKILLS[n]}`)); continue; }
    // "or expertise if already proficient" stays manual: dnd5e upgrade mode grants expertise outright for tools the actor lacks
    let hit = phrase.match(/^the ([A-Za-z ]+) skill$/i)?.[1];
    if (hit && SKILLS[hit.toLowerCase()]) { grants.push(`skills:${SKILLS[hit.toLowerCase()]}`); continue; }
    hit = phrase.match(/^[A-Za-z]+ \(([A-Za-z ]+)\) checks$/i)?.[1];
    if (hit && SKILLS[hit.toLowerCase()]) { grants.push(`skills:${SKILLS[hit.toLowerCase()]}`); continue; }
    hit = phrase.match(/^(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) saving throws$/i)?.[1];
    if (hit) { grants.push(`saves:${ABILITIES[hit.toLowerCase()]}`); continue; }
    if (/^heavy armor$/i.test(phrase)) { grants.push("armor:hvy"); continue; }
    const n = phrase.match(/^(?:any )?(one|two|three|\d) (skills?|tools?)(?: or (skills?|tools?))? (?:of your choice)$/i);
    if (n) {
      const pool = [...(/skill/i.test(phrase) ? ["skills:*"] : []), ...(/tool/i.test(phrase) ? ["tool:*"] : [])];
      choicePools.push({ count: NUM[n[1].toLowerCase()], pool }); continue;
    }
    const fromList = phrase.match(/^(one|two|three|\d) of the following skills(?: of your choice)?:\s*(.+)$/i);
    if (fromList) {
      const pool = fromList[2].split(/,\s*(?:or\s+|and\s+)?|\s+or\s+/i).map((n) => SKILLS[n.trim().toLowerCase()]).filter(Boolean).map((k) => `skills:${k}`);
      if (pool.length >= NUM[fromList[1].toLowerCase()]) { choicePools.push({ count: NUM[fromList[1].toLowerCase()], pool }); continue; }
    }
    const skillAndTool = phrase.match(/^([A-Za-z ]+?) and one tool of your choice$/i);
    if (skillAndTool && SKILLS[skillAndTool[1].toLowerCase()]) {
      grants.push(`skills:${SKILLS[skillAndTool[1].toLowerCase()]}`); choicePools.push({ count: 1, pool: ["tool:*"] }); continue;
    }
    if (/^all Vehicles/i.test(phrase)) { grants.push("tool:land", "tool:water", "tool:air"); continue; }
    const tool = toolKey(phrase);
    if (tool) { grants.push(tool); continue; }
    log(`${featId}: proficiency left as text: "${phrase}"`);
  }
  if (grants.length || choicePools.length) {
    advancement.push(createTrait(path, 0, { mode, grants, choices: choicePools, hint: "" }, "proficiencies"));
  }

  // 3. Flat passive bonuses
  if (/You gain a \+5 bonus to initiative\./i.test(text)) {
    effects.push(createDAEEffect(`${path}/initiative`, "Initiative Bonus", [addBonus("system.attributes.init.bonus", 5)]));
  }
  if (/hit point maximum increases by an amount equal to twice your level[^.]*\. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points/i.test(text)) {
    effects.push(createDAEEffect(`${path}/hp`, "Tough", [addBonus("system.attributes.hp.bonuses.level", 2)]));
  }
  const passive = text.match(/\+(\d+) bonus to your passive (\w+) \(([A-Za-z ]+)\)(?: and passive (\w+) \(([A-Za-z ]+)\))? scores?/i);
  if (passive) {
    const changes = [[passive[3]], passive[5] ? [passive[5]] : []].flat().map((s) => SKILLS[s.toLowerCase()]).filter(Boolean)
      .map((k) => addBonus(`system.skills.${k}.bonuses.passive`, passive[1]));
    if (changes.length) effects.push(createDAEEffect(`${path}/passive`, "Passive Bonus", changes));
  }
  return { advancement, effects };
}
