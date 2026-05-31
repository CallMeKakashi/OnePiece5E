/**
 * One-shot generator: parses feat markdown sources and writes TypeScript feat files.
 * Run with: npx tsx data/src/feats/_generate.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..", "..");
const SOURCE_DIR = join(ROOT, "source", "Chapter 5 Customization");

interface ParsedFeat {
  name: string;
  prerequisites: string;
  descriptionMd: string;
}

function parseFeatsMd(filePath: string): ParsedFeat[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/);
  const feats: ParsedFeat[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Match feat headers: #### Feat Name or ####  Feat Name (extra space)
    const headerMatch = line.match(/^####\s+(.+)$/);
    if (headerMatch && !line.startsWith("#####")) {
      const name = headerMatch[1].trim();
      i++;
      let prerequisites = "";
      let descLines: string[] = [];

      // Check for prerequisites line
      if (i < lines.length) {
        const prereqMatch = lines[i].match(/^##+\s*\*(?:Prerequisites?|Proficiency[^*]*):?\s*(.+)\*$/i);
        if (prereqMatch) {
          prerequisites = prereqMatch[1].replace(/\*$/g, "").trim();
          i++;
        }
      }

      // Collect description until next #### header or EOF
      while (i < lines.length && !lines[i].match(/^####\s+[^#]/)) {
        descLines.push(lines[i]);
        i++;
      }

      feats.push({
        name,
        prerequisites,
        descriptionMd: descLines.join("\n").trim(),
      });
    } else {
      i++;
    }
  }

  return feats;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mdToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  let inTable = false;
  let tableHeaders: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (inTable) {
        html += "</tbody></table>";
        inTable = false;
      }
      continue;
    }

    // Table rows
    if (line.trim().startsWith("|")) {
      const cells = line.split("|").filter((c) => c.trim()).map((c) => c.trim());
      // Skip separator rows
      if (cells.every((c) => /^[-:]+$/.test(c))) continue;

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
        html += "<table><thead><tr>";
        for (const h of cells) html += `<th>${inlineFormat(h)}</th>`;
        html += "</tr></thead><tbody>";
        continue;
      }
      html += "<tr>";
      for (const c of cells) html += `<td>${inlineFormat(c)}</td>`;
      html += "</tr>";
      continue;
    }

    if (inTable) {
      html += "</tbody></table>";
      inTable = false;
    }

    // Sub-headers (##### or ######)
    const subHeaderMatch = line.match(/^#{5,6}\s+(.+)$/);
    if (subHeaderMatch) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p><strong>${inlineFormat(subHeaderMatch[1])}</strong></p>`;
      continue;
    }

    // List items
    if (line.match(/^\s*\*\s+/) || line.match(/^\s*-\s+/)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      const content = line.replace(/^\s*[\*\-]\s+/, "");
      html += `<li>${inlineFormat(content)}</li>`;
      continue;
    }

    // Regular paragraph
    if (inList) { html += "</ul>"; inList = false; }
    html += `<p>${inlineFormat(line)}</p>`;
  }

  if (inList) html += "</ul>";
  if (inTable) html += "</tbody></table>";

  return html;
}

function inlineFormat(text: string): string {
  // Bold+italic: ***text***
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic: *text* (but not inside HTML tags)
  text = text.replace(/(?<![<\/\w])\*([^*]+)\*/g, "<em>$1</em>");
  // Special chars
  text = text.replace(/⁠/g, "");
  return text;
}

function varName(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function generateFeatFile(feats: ParsedFeat[], racial: boolean, filename: string): void {
  const prefix = racial ? "feat/racial" : "feat";

  let code = `import { makeFeat } from "./_make-feat.js";\nimport type { FeatureItem } from "../../schemas/feature.js";\n\n`;

  const exports: string[] = [];

  for (const feat of feats) {
    const slug = slugify(feat.name);
    const vName = varName(slug);
    const descHtml = mdToHtml(feat.descriptionMd);

    // Detect activation type
    let activation = "";
    let activationType = "";
    const descLower = feat.descriptionMd.toLowerCase();
    if (descLower.includes("as a bonus action") || descLower.includes("use a bonus action")) {
      activationType = "bonus";
    } else if (descLower.includes("as a reaction") || descLower.includes("use your reaction")) {
      activationType = "reaction";
    } else if (descLower.includes("as an action")) {
      activationType = "action";
    }

    // Detect uses
    let usesStr = "";
    const lrMatch = feat.descriptionMd.match(/regain(?:ing)?\s+(?:all\s+)?(?:expended\s+)?uses?\s+(?:at the end of|when you finish)\s+a\s+long\s+rest/i);
    const srMatch = feat.descriptionMd.match(/regain(?:ing)?\s+(?:all\s+)?(?:expended\s+)?uses?\s+(?:at the end of|when you finish)\s+a\s+short\s+(?:or\s+long\s+)?rest/i);
    const profMatch = feat.descriptionMd.match(/(?:a number of times|number of uses?)\s+equal\s+to\s+your\s+proficiency\s+bonus/i);
    const twoUses = feat.descriptionMd.match(/(?:You can use this (?:feature|ability)|you can use it)\s+(?:two|2)\s+times/i);
    const threeUses = feat.descriptionMd.match(/(?:You gain|You have)\s+(?:three|3)\s+(?:\w+\s+)?(?:dice|points|uses)/i);

    let usesMax = "";
    let usesPer: string = "";

    if (profMatch) {
      usesMax = "@prof";
    } else if (twoUses) {
      usesMax = "2";
    } else if (threeUses) {
      usesMax = "3";
    }

    if (usesMax) {
      if (srMatch) {
        usesPer = "sr";
      } else if (lrMatch) {
        usesPer = "lr";
      }
    }

    // Build options
    let opts: string[] = [];
    if (feat.prerequisites) {
      opts.push(`  prerequisites: ${JSON.stringify(feat.prerequisites)},`);
    }
    if (activationType) {
      opts.push(`  activation: { type: "${activationType}", cost: 1 },`);
    }
    if (usesMax && usesPer) {
      opts.push(`  uses: { max: "${usesMax}", per: "${usesPer}" },`);
    }

    code += `export const ${vName}: FeatureItem = makeFeat({\n`;
    code += `  name: ${JSON.stringify(feat.name)},\n`;
    code += `  slug: "${slug}",\n`;
    if (racial) code += `  racial: true,\n`;
    if (opts.length > 0) code += opts.join("\n") + "\n";
    code += `  description: ${JSON.stringify(descHtml)},\n`;
    code += `});\n\n`;

    exports.push(vName);
  }

  const rawBase = racial ? "racial" : filename.replace(".ts", "");
  const arrayName = rawBase.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + "Feats";
  code += `export const ${arrayName}: FeatureItem[] = [\n`;
  for (const e of exports) {
    code += `  ${e},\n`;
  }
  code += `];\n`;

  writeFileSync(join(__dirname, filename), code);
  console.log(`  ✓ ${filename}: ${feats.length} feats`);
}

function main() {
  console.log("Generating feat source files...\n");
  // Parse general feats
  const generalPath = join(SOURCE_DIR, "Feats", "Feats.md");
  const generalFeats = parseFeatsMd(generalPath);
  console.log(`Parsed ${generalFeats.length} general feats`);

  // Parse racial feats
  const racialPath = join(SOURCE_DIR, "Racial Feats", "Racial Feats.md");
  const racialFeats = parseFeatsMd(racialPath);
  console.log(`Parsed ${racialFeats.length} racial feats`);

  // Split general feats alphabetically
  const sorted = [...generalFeats].sort((a, b) => a.name.localeCompare(b.name));

  const splits: { feats: ParsedFeat[]; file: string }[] = [];
  const cutoffs = ["D", "G", "K", "N", "S"];
  let currentFeats: ParsedFeat[] = [];
  let cutIdx = 0;
  let startLetter = "a";

  for (const feat of sorted) {
    const firstLetter = feat.name[0].toUpperCase();
    if (cutIdx < cutoffs.length && firstLetter >= cutoffs[cutIdx]) {
      if (currentFeats.length > 0) {
        const endLetter = currentFeats[currentFeats.length - 1].name[0].toLowerCase();
        splits.push({ feats: currentFeats, file: `general-${startLetter}-${endLetter}.ts` });
      }
      currentFeats = [];
      startLetter = firstLetter.toLowerCase();
      cutIdx++;
    }
    currentFeats.push(feat);
  }
  if (currentFeats.length > 0) {
    const endLetter = currentFeats[currentFeats.length - 1].name[0].toLowerCase();
    splits.push({ feats: currentFeats, file: `general-${startLetter}-${endLetter}.ts` });
  }

  for (const split of splits) {
    generateFeatFile(split.feats, false, split.file);
  }

  // Racial feats in one file
  generateFeatFile(racialFeats, true, "racial.ts");

  // Generate index.ts
  let indexCode = `import type { FeatureItem } from "../../schemas/feature.js";\n\n`;
  const allArrayNames: string[] = [];

  for (const split of splits) {
    const baseName = split.file.replace(".ts", "");
    const exportedArrayName = baseName.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + "Feats";
    indexCode += `import { ${exportedArrayName} } from "./${baseName}.js";\n`;
    allArrayNames.push(exportedArrayName);
  }

  indexCode += `import { racialFeats } from "./racial.js";\n\n`;
  allArrayNames.push("racialFeats");

  indexCode += `export const items: FeatureItem[] = [\n`;
  for (const name of allArrayNames) {
    indexCode += `  ...${name},\n`;
  }
  indexCode += `];\nexport default items;\n`;

  writeFileSync(join(__dirname, "index.ts"), indexCode);
  console.log(`\n  ✓ index.ts (barrel export)`);
  console.log(`\nDone! Total: ${generalFeats.length} general + ${racialFeats.length} racial = ${generalFeats.length + racialFeats.length} feats`);
}

main();
