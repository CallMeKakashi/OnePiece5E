import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "./helpers/id.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = join(__dirname, "..", "..", "source", "Chapter 8 Special Items", "Creations Descriptions");
const OUT_DIR = join(__dirname, "src", "creations");

const SCHOOL_MAP: Record<string, string> = {
  abjuration: "abj",
  conjuration: "con",
  divination: "div",
  enchantment: "enc",
  evocation: "evo",
  illusion: "ill",
  necromancy: "nec",
  transmutation: "trs",
};

interface ParsedCreation {
  name: string;
  level: number;
  school: string;
  ritual: boolean;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higherLevels: string;
  target: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSchoolAndLevel(line: string): { level: number; school: string; ritual: boolean } {
  const cleaned = line.trim().replace(/^\*+|\*+$/g, "").trim();

  let ritual = false;
  let text = cleaned;
  if (/\(routine\)/i.test(text) || /\(ritual\)/i.test(text)) {
    ritual = true;
    text = text.replace(/\s*\(routine\)\s*/i, " ").replace(/\s*\(ritual\)\s*/i, " ").trim();
  }

  // Trick pattern: "evocation trick" or "school-name trick"
  const trickMatch = text.match(/^(\w+)\s+trick$/i);
  if (trickMatch) {
    const school = SCHOOL_MAP[trickMatch[1].toLowerCase()] || "evo";
    return { level: 0, school, ritual };
  }

  // Leveled pattern: "1st-level evocation" or "Nth-level school"
  const levelMatch = text.match(/^(\d+)(?:st|nd|rd|th)-level\s+(\w+)$/i);
  if (levelMatch) {
    const level = parseInt(levelMatch[1], 10);
    const school = SCHOOL_MAP[levelMatch[2].toLowerCase()] || "evo";
    return { level, school, ritual };
  }

  return { level: 0, school: "evo", ritual };
}

function parseActivation(castingTime: string): { type: string; cost: number; condition: string } {
  const ct = castingTime.toLowerCase().trim();

  if (ct.startsWith("1 reaction")) {
    const condition = castingTime.replace(/^1 reaction,?\s*/i, "").trim();
    return { type: "reaction", cost: 1, condition };
  }
  if (ct.startsWith("1 bonus action")) return { type: "bonus", cost: 1, condition: "" };
  if (ct.startsWith("1 action")) return { type: "action", cost: 1, condition: "" };
  if (ct.startsWith("1 minute")) return { type: "minute", cost: 1, condition: "" };
  if (ct.startsWith("10 minutes")) return { type: "minute", cost: 10, condition: "" };
  if (ct.startsWith("1 hour")) return { type: "hour", cost: 1, condition: "" };
  if (ct.startsWith("8 hours")) return { type: "hour", cost: 8, condition: "" };
  if (ct.startsWith("24 hours")) return { type: "hour", cost: 24, condition: "" };

  const minMatch = ct.match(/^(\d+)\s*minutes?/);
  if (minMatch) return { type: "minute", cost: parseInt(minMatch[1], 10), condition: "" };

  return { type: "action", cost: 1, condition: "" };
}

function parseDuration(duration: string): { value: string | null; units: string; concentration: boolean } {
  const d = duration.toLowerCase().trim();
  let concentration = false;

  let text = d;
  if (text.startsWith("concentration,")) {
    concentration = true;
    text = text.replace(/^concentration,\s*/i, "").replace(/^up to\s*/i, "").trim();
  } else if (text.startsWith("concentration")) {
    concentration = true;
    text = text.replace(/^concentration\s*/i, "").replace(/^,?\s*up to\s*/i, "").trim();
  }

  if (text === "instantaneous" || text.startsWith("instantaneous")) return { value: null, units: "inst", concentration };
  if (text === "permanent" || text === "indefinite") return { value: null, units: "perm", concentration };
  if (text === "until disabled or triggered" || text === "special") return { value: null, units: "spec", concentration };
  if (text === "unlimited" || text.startsWith("unlimited")) return { value: null, units: "perm", concentration };

  const roundMatch = text.match(/^(\d+)\s*rounds?/);
  if (roundMatch) return { value: roundMatch[1], units: "round", concentration };

  const minMatch = text.match(/^(\d+)\s*minutes?/);
  if (minMatch) return { value: minMatch[1], units: "minute", concentration };

  const hourMatch = text.match(/^(\d+)\s*hours?/);
  if (hourMatch) return { value: hourMatch[1], units: "hour", concentration };

  const dayMatch = text.match(/^(\d+)\s*days?/);
  if (dayMatch) return { value: dayMatch[1], units: "day", concentration };

  if (text.includes("minute")) return { value: "1", units: "minute", concentration };
  if (text.includes("hour")) return { value: "1", units: "hour", concentration };
  if (text.includes("round")) return { value: "1", units: "round", concentration };

  return { value: null, units: "inst", concentration };
}

function parseRange(range: string): { value: number | null; units: string } {
  const r = range.toLowerCase().trim();

  if (r === "self" || r.startsWith("self")) {
    return { value: null, units: "self" };
  }
  if (r === "touch") return { value: null, units: "touch" };
  if (r === "sight") return { value: null, units: "spec" };
  if (r === "special") return { value: null, units: "spec" };
  if (r === "unlimited") return { value: null, units: "spec" };

  const ftMatch = r.match(/^(\d+)\s*(?:ft|feet)/);
  if (ftMatch) return { value: parseInt(ftMatch[1], 10), units: "ft" };

  const mileMatch = r.match(/^(\d+)\s*miles?/);
  if (mileMatch) return { value: parseInt(mileMatch[1], 10) * 5280, units: "ft" };

  return { value: null, units: "" };
}

function parseTarget(range: string, targetField: string): { value: number | null; width: number | null; units: string; type: string } {
  const r = range.toLowerCase().trim();

  // Self area patterns
  const coneMatch = r.match(/self\s*\((\d+)[- ]?(?:foot|ft) cone\)/i);
  if (coneMatch) return { value: parseInt(coneMatch[1], 10), width: null, units: "ft", type: "cone" };

  const sphereMatch = r.match(/self\s*\((\d+)[- ]?(?:foot|ft) (?:radius|sphere)\)/i);
  if (sphereMatch) return { value: parseInt(sphereMatch[1], 10), width: null, units: "ft", type: "sphere" };

  const lineMatch = r.match(/self\s*\((\d+)[- ]?(?:foot|ft) line\)/i);
  if (lineMatch) return { value: parseInt(lineMatch[1], 10), width: null, units: "ft", type: "line" };

  const cubeMatch = r.match(/self\s*\((\d+)[- ]?(?:foot|ft) cube\)/i);
  if (cubeMatch) return { value: parseInt(cubeMatch[1], 10), width: null, units: "ft", type: "cube" };

  if (r === "self") return { value: null, width: null, units: "", type: "self" };

  if (targetField) {
    const t = targetField.toLowerCase();
    if (t.includes("creature")) return { value: null, width: null, units: "", type: "creature" };
    if (t.includes("object")) return { value: null, width: null, units: "", type: "object" };
    if (t.includes("point")) return { value: null, width: null, units: "", type: "space" };
  }

  return { value: null, width: null, units: "", type: "" };
}

function parseComponents(comp: string): {
  vocal: boolean;
  somatic: boolean;
  material: boolean;
  materialDesc: string;
} {
  const vocal = /\bV\b/.test(comp);
  const somatic = /\bS\b/.test(comp);
  const materialMatch = comp.match(/M\s*\(([^)]+)\)/i);
  const material = /\bM\b/.test(comp);
  const materialDesc = materialMatch ? materialMatch[1].trim() : "";

  return { vocal, somatic, material, materialDesc };
}

function inferActionType(desc: string, creation: ParsedCreation): string {
  const d = desc.toLowerCase();
  if (d.includes("ranged creation attack") || d.includes("ranged weapon attack")) return "rsak";
  if (d.includes("melee creation attack") || d.includes("melee weapon attack") || d.includes("melee attack")) return "msak";
  if (d.includes("saving throw") || d.includes("must succeed on")) return "save";
  if (d.includes("regains") && d.includes("hit points")) return "heal";
  if (d.includes("temporary hit points")) return "util";
  return "util";
}

function inferSaveAbility(desc: string): string {
  const d = desc.toLowerCase();
  const saveMatch = d.match(/(?:must\s+(?:succeed\s+on|make)\s+a[n]?\s+)(\w+)\s+saving\s+throw/);
  if (saveMatch) {
    const abilityMap: Record<string, string> = {
      strength: "str", dexterity: "dex", constitution: "con",
      intelligence: "int", wisdom: "wis", charisma: "cha",
    };
    return abilityMap[saveMatch[1].toLowerCase()] || "";
  }
  return "";
}

function inferDamage(desc: string): [string, string][] {
  const parts: [string, string][] = [];
  const damagePattern = /(\d+d\d+(?:\s*\+\s*\d+)?)\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s+damage/gi;
  let match;
  const seen = new Set<string>();
  while ((match = damagePattern.exec(desc)) !== null) {
    const key = `${match[1]}|${match[2]}`;
    if (!seen.has(key)) {
      seen.add(key);
      parts.push([match[1], match[2].toLowerCase()]);
    }
  }
  return parts;
}

function parseCreationsFromMarkdown(content: string, defaultLevel: number): ParsedCreation[] {
  const creations: ParsedCreation[] = [];
  const sections = content.split(/^####\s+/m);

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split("\n");
    const name = lines[0].trim();

    if (!name) continue;

    let school = "evo";
    let level = defaultLevel;
    let ritual = false;
    let castingTime = "";
    let range = "";
    let components = "";
    let duration = "";
    let target = "";
    const descLines: string[] = [];
    let higherLevels = "";
    let inDescription = false;

    for (let j = 1; j < lines.length; j++) {
      const line = lines[j];

      if (line.startsWith("*") && !line.startsWith("**") && !line.startsWith("* ")) {
        const parsed = parseSchoolAndLevel(line);
        school = parsed.school;
        level = parsed.level !== undefined ? parsed.level : defaultLevel;
        ritual = parsed.ritual;
        continue;
      }

      const ctMatch = line.match(/^\s*-?\s*\*\*Casting Time:\*\*\s*(.+)/i);
      if (ctMatch) { castingTime = ctMatch[1].trim(); continue; }

      const rangeMatch = line.match(/^\s*-?\s*\*\*Range:\*\*\s*(.+)/i);
      if (rangeMatch) { range = rangeMatch[1].trim(); continue; }

      const targetMatch = line.match(/^\s*-?\s*\*\*Target:\*\*\s*(.+)/i);
      if (targetMatch) { target = targetMatch[1].trim(); continue; }

      const compMatch = line.match(/^\s*-?\s*\*\*Components:\*\*\s*(.+)/i);
      if (compMatch) { components = compMatch[1].trim(); continue; }

      const durMatch = line.match(/^\s*-?\s*\*\*Duration:\*\*\s*(.+)/i);
      if (durMatch) {
        duration = durMatch[1].trim();
        inDescription = true;
        continue;
      }

      if (inDescription) {
        if (line.match(/^\*\*At Higher Levels?\.\*\*/i)) {
          higherLevels = line.replace(/^\*\*At Higher Levels?\.\*\*\s*/i, "").trim();
          // Collect remaining lines for higher levels
          for (let k = j + 1; k < lines.length; k++) {
            const hl = lines[k];
            if (hl.startsWith("####") || hl.trim() === "") break;
            higherLevels += " " + hl.trim();
          }
          break;
        }
        if (line.trim()) {
          descLines.push(line);
        }
      }
    }

    const description = descLines.join("\n").trim();

    creations.push({
      name,
      level,
      school,
      ritual,
      castingTime,
      range,
      components,
      duration,
      description,
      higherLevels,
      target,
    });
  }

  return creations;
}

function markdownToHtml(text: string): string {
  if (!text) return "";
  let html = text.replace(/\r/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\n\*\s+/g, "\n<li>")
    .replace(/^\*\s+/gm, "<li>");

  if (html.includes("<li>")) {
    html = html.replace(/(<li>[^\n]*)/g, "$1</li>");
    html = "<ul>" + html.replace(/<li>/g, "\n<li>") + "</ul>";
  }

  const paragraphs = html.split(/\n{2,}/);
  if (paragraphs.length > 1) {
    html = paragraphs.map(p => p.trim() ? `<p>${p.trim()}</p>` : "").join("");
  } else if (!html.startsWith("<")) {
    html = `<p>${html}</p>`;
  }

  return html;
}

function buildCreationItem(creation: ParsedCreation, idPath: string) {
  const _id = generateId(idPath);
  const activation = parseActivation(creation.castingTime);
  const dur = parseDuration(creation.duration);
  const rng = parseRange(creation.range);
  const tgt = parseTarget(creation.range, creation.target);
  const comp = parseComponents(creation.components);
  const actionType = inferActionType(creation.description, creation);
  const saveAbility = actionType === "save" ? inferSaveAbility(creation.description) : "";
  const damageParts = inferDamage(creation.description);

  let descHtml = markdownToHtml(creation.description);
  if (creation.higherLevels) {
    descHtml += `<p><strong>At Higher Levels.</strong> ${creation.higherLevels}</p>`;
  }

  const scalingMode = creation.level === 0 ? "cantrip" : (creation.higherLevels ? "level" : "none");

  return {
    _id,
    name: creation.name,
    type: "spell",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: descHtml, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      level: creation.level,
      school: creation.school,
      components: {
        value: "",
        vocal: comp.vocal,
        somatic: comp.somatic,
        material: comp.material,
        ritual: creation.ritual,
        concentration: dur.concentration,
      },
      materials: {
        value: comp.materialDesc,
        consumed: false,
        cost: 0,
        supply: 0,
      },
      preparation: { mode: "prepared", prepared: false },
      scaling: { mode: scalingMode, formula: "" },
      activation: {
        type: activation.type,
        cost: activation.cost,
        condition: activation.condition,
      },
      duration: {
        value: dur.value,
        units: dur.units,
      },
      target: {
        value: tgt.value,
        width: tgt.width,
        units: tgt.units,
        type: tgt.type,
      },
      range: {
        value: rng.value,
        long: null,
        units: rng.units,
      },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: actionType === "rsak" || actionType === "msak" ? actionType : (actionType === "save" ? "save" : (actionType === "heal" ? "heal" : "")),
      attack: { bonus: "", flat: false },
      damage: { parts: damageParts, versatile: "" },
      save: {
        ability: saveAbility,
        dc: null,
        scaling: "spell",
      },
      chatFlavor: "",
      formula: "",
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  };
}

function generateTsFile(variableName: string, items: object[]): string {
  let ts = `import type { FoundryItem } from "../../../schemas/common.js";\n\n`;
  ts += `export const ${variableName}: FoundryItem[] = `;
  ts += JSON.stringify(items, null, 2);
  ts += `;\n`;
  return ts;
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const files: { filename: string; defaultLevel: number; varName: string; outFile: string; idPrefix: string }[] = [
    { filename: "Tricks.md", defaultLevel: 0, varName: "tricks", outFile: "tricks.ts", idPrefix: "creation/trick" },
    { filename: "1st Level.md", defaultLevel: 1, varName: "level1", outFile: "level-1.ts", idPrefix: "creation/1" },
    { filename: "2nd Level.md", defaultLevel: 2, varName: "level2", outFile: "level-2.ts", idPrefix: "creation/2" },
    { filename: "3rd Level.md", defaultLevel: 3, varName: "level3", outFile: "level-3.ts", idPrefix: "creation/3" },
    { filename: "4th Level.md", defaultLevel: 4, varName: "level4", outFile: "level-4.ts", idPrefix: "creation/4" },
    { filename: "5th Level.md", defaultLevel: 5, varName: "level5", outFile: "level-5.ts", idPrefix: "creation/5" },
    { filename: "6th Level.md", defaultLevel: 6, varName: "level6", outFile: "level-6.ts", idPrefix: "creation/6" },
    { filename: "7th Level.md", defaultLevel: 7, varName: "level7", outFile: "level-7.ts", idPrefix: "creation/7" },
    { filename: "8th Level.md", defaultLevel: 8, varName: "level8", outFile: "level-8.ts", idPrefix: "creation/8" },
    { filename: "9th Level.md", defaultLevel: 9, varName: "level9", outFile: "level-9.ts", idPrefix: "creation/9" },
  ];

  let totalItems = 0;
  const allVarNames: string[] = [];
  const allFileNames: string[] = [];

  for (const file of files) {
    const filePath = join(SOURCE_DIR, file.filename);
    if (!existsSync(filePath)) {
      console.log(`  Skipping ${file.filename} (not found)`);
      continue;
    }

    const content = readFileSync(filePath, "utf-8");
    const creations = parseCreationsFromMarkdown(content, file.defaultLevel);

    const items = creations.map((c) => {
      const slug = slugify(c.name);
      const idPath = `${file.idPrefix}/${slug}`;
      return buildCreationItem(c, idPath);
    });

    const tsContent = generateTsFile(file.varName, items);
    writeFileSync(join(OUT_DIR, file.outFile), tsContent);
    console.log(`  ✓ ${file.outFile}: ${items.length} creations`);
    totalItems += items.length;
    allVarNames.push(file.varName);
    allFileNames.push(file.outFile.replace(".ts", ".js"));
  }

  // Generate index.ts
  let indexContent = `import type { FoundryItem } from "../../schemas/common.js";\n\n`;
  for (let i = 0; i < allVarNames.length; i++) {
    indexContent += `import { ${allVarNames[i]} } from "./${allFileNames[i].replace(".js", ".js")}";\n`;
  }
  indexContent += `\nexport const items: FoundryItem[] = [\n`;
  for (const varName of allVarNames) {
    indexContent += `  ...${varName},\n`;
  }
  indexContent += `];\n\nexport default items;\n`;
  writeFileSync(join(OUT_DIR, "index.ts"), indexContent);

  console.log(`\n  Total: ${totalItems} creations generated`);
}

main();
