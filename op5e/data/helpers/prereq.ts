// Parses a feat's/feature's free-text "requirements" into a structured prerequisite stored at flags.op5e.prereq.
// dnd5e natively validates only item presence, level and repeatability (system.prerequisites); everything the book words
// (ability scores, proficiencies, race, creation use) is checked at runtime by scripts/prerequisites.mjs from this flag.
// Anything we can't machine-check is kept in `manual` so the player and DM still see it.

export interface Prereq {
  /** every entry must hold; `any` = at least one of the abilities meets `min` */
  abilities?: { any: string[]; min: number }[];
  /** weapon/armor/tool/skill proficiency; any one of `names` is enough */
  proficiencies?: { kind: "weapon" | "armor" | "tool" | "skill"; names: string[] }[];
  /** race names (any one matches); the race item's name is compared case-insensitively */
  races?: string[];
  notRaces?: string[];
  /** the character can use at least one creation / has creativity */
  creation?: boolean;
  /** minimum character level */
  level?: number;
  /** requirement text we could not check automatically */
  manual?: string[];
}

const ABIL: Record<string, string> = { strength: "str", dexterity: "dex", constitution: "con", intelligence: "int", wisdom: "wis", charisma: "cha" };
const ABIL_RE = "strength|dexterity|constitution|intelligence|wisdom|charisma";
const SKILLS = "acrobatics|athletics|animal handling|arcana|deception|history|insight|intimidation|investigation|medicine|nature|perception|performance|persuasion|religion|sleight of hand|stealth|survival";
// race tokens; the two hyphenated ones are placeholders for phrases that would otherwise match two races
const RACES = ["Artificial-Augmented", "Kuja-Human", "Augmented", "Dwarves", "Dwarf", "Fishman", "Giants", "Giant", "Human", "Lunarian", "Merfolk", "Mink", "Sky Islander"];
const RACE_CANON: Record<string, string> = { "Artificial-Augmented": "Augmented", "Kuja-Human": "Human", Dwarves: "Dwarf", Giants: "Giant" };
const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").trim();

export function parsePrereq(text: string | null | undefined): Prereq | null {
  const t = String(text ?? "").replace(/\s+/g, " ").trim();
  // a bare number (Light Armor Master's requirement is "3") is a data error in the source: nothing to enforce
  if (!t || /^\d+$/.test(t)) return null;
  const out: Prereq = {};
  // "Fishman Karate" is a fighting style, not the Fishman race
  let rest = t.replace(/\bfishman karate\b/gi, "FishmanKarate").replace(/\bartificial human\b/gi, "Artificial-Augmented").replace(/\bkuja\b/gi, "Kuja-Human");

  // ability scores: "Dexterity 13 or higher", "Strength or Dexterity 13 or higher", "Dexterity of 13", "Strength score of 16 or higher"
  const ab = new RegExp(`((?:${ABIL_RE})(?:\\s*(?:or|,)\\s*(?:${ABIL_RE}))*)\\s*(?:score\\s*)?(?:of\\s*)?(\\d{2})(?:\\s*or higher)?`, "gi");
  for (const m of [...rest.matchAll(ab)]) {
    (out.abilities ??= []).push({ any: [...m[1].toLowerCase().matchAll(new RegExp(ABIL_RE, "g"))].map((x) => ABIL[x[0]]), min: Number(m[2]) });
    rest = rest.replace(m[0], " ");
  }
  const mn = rest.match(new RegExp(`minimum\\s+(\\d{2})\\s+(${ABIL_RE})\\s+ability score`, "i"));
  if (mn) { (out.abilities ??= []).push({ any: [ABIL[mn[2].toLowerCase()]], min: Number(mn[1]) }); rest = rest.replace(mn[0], " "); }
  rest = rest.replace(/^[\s,;]+|[\s,;]+$/g, "");

  // proficiencies: everything after "proficiency with/in" up to the end of what is left
  const pm = rest.match(/proficien(?:cy|t)\s+(?:with|in)\s+(?:an?\s+|the\s+)?(.+)$/i);
  if (pm) {
    const raw = pm[1].replace(/\s+checks?$/i, "").trim();
    const names = raw.split(/\s*,\s*(?:or\s+)?|\s+or\s+/i).map((x) => norm(x.replace(/^(?:an?|the)\s+/i, ""))).filter(Boolean);
    const kind = /armor/i.test(raw) ? "armor" : new RegExp(SKILLS, "i").test(raw) ? "skill" : /instrument|tool|kit|\bset\b/i.test(raw) ? "tool" : "weapon";
    (out.proficiencies ??= []).push({ kind, names: kind === "armor" ? [(names[0] ?? "").replace(/\s*armor$/, "")] : names });
    rest = rest.replace(pm[0], " ");
  }
  const sk = rest.match(new RegExp(`proficiency\\s+(?:in\\s+)?(?:(?:${ABIL_RE})\\s*\\()?(${SKILLS})\\)?(?:\\s+checks?)?`, "i"));
  if (sk) { (out.proficiencies ??= []).push({ kind: "skill", names: [norm(sk[1])] }); rest = rest.replace(sk[0], " "); }

  const cr = rest.match(/the ability to use (?:at least one )?creat(?:ion|ivity)/i);
  if (cr) { out.creation = true; rest = rest.replace(cr[0], " "); }

  const lv = rest.match(/\b(\d{1,2})(?:st|nd|rd|th)[- ]level\b/i);
  if (lv) { out.level = Number(lv[1]); rest = rest.replace(lv[0], " "); }

  // race
  const excl = rest.match(/any race excluding ([^,]+?)(?=,|$)/i);
  if (excl) {
    out.notRaces = excl[1].split(/\s*(?:,|and|or)\s*/i).map((x) => norm(x)).map((x) => (x === "dwarves" ? "dwarf" : x === "giants" ? "giant" : x)).filter(Boolean);
    rest = rest.replace(excl[0], " ");
  } else if (/\brace\b/i.test(rest) || RACES.some((r) => new RegExp(`\\b${r}\\b`, "i").test(rest))) {
    const found = [...new Set(RACES.filter((r) => new RegExp(`\\b${r}\\b`, "i").test(rest)).map((r) => RACE_CANON[r] ?? r))];
    // "Artificial Human Augmented race" is an Augmented, not a Human
    const races = /Artificial-Augmented/.test(rest) ? found.filter((r) => r !== "Human") : found;
    const label = rest.replace(/Artificial-Augmented/g, "Artificial Human").replace(/Kuja-Human/g, "Kuja").replace(/\s+/g, " ").trim();
    if (races.length) {
      out.races = races;
      // sub-types ("as a rabbit mink", "Stronghide", "Cyborg") are not recorded on the actor: leave them for the DM to confirm
      const sub = rest.replace(/\b(race|any|standard|augmented|artificial-augmented|kuja-human|sky islander|fishman|merfolk|human|mink|giants?|dwarf|dwarves|lunarian|or|and|the|as)\b/gi, " ").replace(/[,.;]/g, " ").replace(/\s+/g, " ").trim();
      if (sub) (out.manual ??= []).push(`Race type (DM to confirm): ${label}`);
    } else (out.manual ??= []).push(`Race: ${label}`);
    rest = "";
  }

  rest = rest.replace(/[,.;]/g, " ").replace(/\s+/g, " ").trim();
  if (rest && !/^(and|or|that)$/i.test(rest)) {
    const handled = !!(out.abilities || out.proficiencies || out.races || out.notRaces || out.creation || out.level);
    (out.manual ??= []).push(handled ? rest : t);
  }
  if (out.manual) out.manual = out.manual.map((m) => m.replace(/FishmanKarate/g, "Fishman Karate"));
  return Object.keys(out).length ? out : null;
}
