import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { FoundryItem } from "../data/schemas/common.js";
import type { FeatureItem } from "../data/schemas/feature.js";
import { ensureFeatureActivities, ensureItemActivities } from "../data/helpers/activities.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCEBOOK = join(ROOT, "..", "Sourcebook");
const DATA_SRC = join(ROOT, "data", "src");
const REPORT_DIR = join(ROOT, "reports");

interface SourceCandidate {
  title: string;
  category: string;
  expectedPack: string;
  sourcePath: string;
  page: string;
}

interface CompendiumEntry {
  item: FoundryItem;
  pack: string;
}

interface ChecklistRow {
  title: string;
  category: string;
  expectedPack: string;
  status: "present" | "missing" | "under-automated";
  compendiumName: string;
  compendiumPack: string;
  automation: AutomationSummary;
  sourcePath: string;
  page: string;
}

interface AutomationSummary {
  grade: "reference" | "needs review" | "partial" | "usable" | "complete";
  hasActivity: boolean;
  hasConsumption: boolean;
  hasUses: boolean;
  hasRecovery: boolean;
  hasEffects: boolean;
  hasMidiFlags: boolean;
  hasDamageOrSave: boolean;
  notes: string[];
}

const PACK_LOADS: Array<{ pack: string; rel: string }> = [
  { pack: "classes", rel: "classes/index.ts" },
  { pack: "subclasses", rel: "subclasses/index.ts" },
  { pack: "class-features", rel: "class-features/index.ts" },
  { pack: "races", rel: "races/index.ts" },
  { pack: "racial-features", rel: "racial-features/index.ts" },
  { pack: "feats", rel: "feats/index.ts" },
  { pack: "items", rel: "items/index.ts" },
  { pack: "creations", rel: "creations/index.ts" },
  { pack: "backgrounds", rel: "backgrounds/index.ts" },
];

const REFERENCE_CATEGORY = new Set([
  "class",
  "subclass",
  "race",
  "background",
  "role",
  "tool",
  "vehicle",
  "rule-reference",
  "source-section",
]);

const EXCLUDED_FILE_NAMES = new Set([
  "Sourcebook.md",
  "Credits.md",
  "General Sub Sections.md",
  "Chapter 1 Races.md",
  "Chapter 2 Classes.md",
  "Chapter 3 Character Origins.md",
  "Chapter 4 Equipment and Items.md",
  "Chapter 5 Customization.md",
  "Chapter 6 Devil Fruits.md",
  "Chapter 7 Additional Powers.md",
  "Chapter 8 Special Items.md",
  "Appendix A Creations.md",
  "Appendix B Running The Game.md",
]);

const EXCLUDED_SECTION_NAMES = new Set([
  "Weapons",
  "Additional Melee Weapons",
  "Additional Ranged Weapons",
  "Armor and Shields",
  "Armor",
  "Consumables",
  "Rings",
  "Staff and Wands",
  "Wondrous Items",
  "Tools",
  "Adventuring Gear",
  "Mounts and Vehicles",
  "Shipbuilding and Repair",
  "Wealth",
  "Expenses",
  "Class Features",
  "Primal Paths",
  "Bard College",
  "Brawling Style",
  "Martial Archetypes",
  "Marksman Archetype",
  "Medical Specialization",
  "Roguish Archetypes",
  "Specialist Paths",
  "Backgrounds",
  "Roles",
  "Dreams",
  "Fighting Styles",
  "Feats",
  "Racial Feats",
  "Haki",
  "Example Logias",
  "Example Paramecias",
  "Example Zoans",
  "Creation Lists",
  "Creation Descriptions",
  "Tricks",
  "1st Level",
  "2nd Level",
  "3rd Level",
  "4th Level",
  "5th Level",
  "6th Level",
  "7th Level",
  "8th Level",
  "9th Level",
  "Suggested Rulings",
  "Making Devil Fruits",
  "Purchasing Goods",
  "Rewards",
  "The Environment",
  "Crafting",
  "Choosing a Race",
  "Ability Score Improvement",
  "Arcana = Engineering",
  "Ardent Soul",
  "Blademaster Barbarian Styles",
  "College Of Swords Bard Styles",
  "Fighter Styles",
  "Learning Haki",
  "List of Haki Abilities",
  "Marksman Styles",
  "Martial Archetype",
  "Primal Path",
  "Roguish Archetype",
  "Savant Styles",
  "Specialist Path",
  "Spells = Creations",
  "Sword Sage Brawler Styles",
  "Creation Lists",
  "Creations 2",
  "Creations",
  "Creations Descriptions",
  "Bard Creations Charm Person",
  "Bards - Stories to Shape the World",
  "Channel Conviction",
  "Gadgeteers - Brains over Brawn",
  "Greater Restoration Gadgeteer",
  "Marksman Entangle",
  "Marksmen - Always Prepared",
  "Medic Creations",
  "Medics - Miracle Workers",
  "Savant Creations Lesser Restoration",
  "Savants - Power from Within",
  "Building a Ship",
  "Damage and Repairs",
  "Food, Drink, and Lodging",
  "Ship Building and Repair",
  "Ship Rooms",
  "Treasure and Loot",
  "Upgrading your Ship",
]);

const SOURCEBOOK_ALIASES = new Map<string, string[]>([
  ["Smiles", ["SMILE Fruit"]],
  ["Special Books (Non-Canon)", ["Special Book (Non-Canon)"]],
  ["White Weapons (Non-Canon)", ["White Weapon (Non-Canon)"]],
  ["Black Blades", ["Black Blade"]],
  ["Cursed Weapons", ["Cursed Weapon (Template)"]],
  ["Ranked Weapons", ["Ranked Weapon (Template)"]],
  ["Devil Fruit Objects", ["Devil Fruit Object"]],
]);

const SYNTHETIC_CANDIDATES: SourceCandidate[] = [
  ...[
    "Club",
    "Dagger",
    "Greatclub",
    "Handaxe",
    "Javelin",
    "Light Hammer",
    "Mace",
    "Quarterstaff",
    "Spear",
    "Unarmed Strike",
    "Musket",
    "Crossbow, Light",
    "Dart",
    "Flintlock",
    "Shortbow",
    "Sling",
    "Battleaxe",
    "Cutlass",
    "Flail",
    "Glaive",
    "Greataxe",
    "Greatsword",
    "Halberd",
    "Katana",
    "Lance",
    "Longsword",
    "Manacles",
    "Maul",
    "Odachi",
    "Pike",
    "Rapier",
    "Scimitar",
    "Shortsword",
    "Trident",
    "War Pick",
    "Warhammer",
    "Whip",
    "Blowgun",
    "Crossbow, Hand",
    "Crossbow, Heavy",
    "Longbow",
    "Rifle",
    "Net",
    "Pistol",
    "Revolver",
    "Shotgun",
  ].map((title) => ({
    title,
    category: "weapon",
    expectedPack: "items",
    sourcePath: "Chapter 4 Equipment and Items/Weapons/Weapons.md",
    page: "198",
  })),
  ...[
    "Leather Armor",
    "Navy Uniform",
    "Studded Leather Armor",
    "Light Longcoat",
    "Hide Armor",
    "Chain Shirt",
    "Scale Mail",
    "Heavy Longcoat",
    "Breastplate",
    "Chain Mail",
    "Splint Armor",
    "Plate Armor",
    "Shield",
  ].map((title) => ({
    title,
    category: "armor",
    expectedPack: "items",
    sourcePath: "Chapter 4 Equipment and Items/Armor and Shields/Armor and Shields.md",
    page: "197",
  })),
  ...[
    "Firearms Bullets",
    "Apparatus",
    "Log Pose",
    "Preservation Box",
    "Sea Charts",
  ].map((title) => ({
    title,
    category: "gear",
    expectedPack: "items",
    sourcePath: "Chapter 4 Equipment and Items/Adventuring Gear/Adventuring Gear.md",
    page: "201",
  })),
  ...[
    "Alchemist's Supplies",
    "Appraiser's Tools",
    "Brewer's Supplies",
    "Calligrapher's Supplies",
    "Carpenter's Tools",
    "Cartographer's Tools",
    "Cobbler's Tools",
    "Cook's Utensils",
    "Glassblower's Tools",
    "Jeweler's Tools",
    "Leatherworker's Tools",
    "Mason's Tools",
    "Painter's Supplies",
    "Potter's Tools",
    "Smith's Tools",
    "Tinker's Tools",
    "Weaver's Tools",
    "Woodcarver's Tools",
    "Dial Kit",
    "Disguise Kit",
    "Forgery Kit",
    "Dice Set",
    "Chess Set",
    "Playing Card Set",
    "Herbalism Kit",
    "Bagpipes",
    "Drum",
    "Dulcimer",
    "Flute",
    "Guitar",
    "Lyre",
    "Horn",
    "Shamisen",
    "Tambourine",
    "Trumpet",
    "Viol",
    "Navigator's Tools",
    "Poisoner's Kit",
    "Thieves' Tools",
  ].map((title) => ({
    title,
    category: "tool",
    expectedPack: "items",
    sourcePath: "Chapter 4 Equipment and Items/Tools/Tools.md",
    page: "202",
  })),
  ...["Sky Vehicles", "Surfers", "Shooters", "Wavers"].map((title) => ({
    title,
    category: "vehicle",
    expectedPack: "items",
    sourcePath: "Chapter 4 Equipment and Items/Tools/Tools.md",
    page: "202",
  })),
  ...[
    "Ships and Waterborne Vessels",
    "Caravel",
    "Carrack",
    "Galleon",
    "Galley",
    "Keelboat",
    "Longship",
    "Rowboat",
    "Sloop",
  ].map((title) => ({
    title,
    category: "vehicle",
    expectedPack: "items",
    sourcePath: "Chapter 4 Equipment and Items/Mounts and Vehicles/Ships and Waterborne Vessels.md",
    page: "191",
  })),
  ...[
    "Cannons",
    "Swivel Gun",
    "8-pounder",
    "12-pounder",
    "18-pounder",
    "24-pounder",
    "36-pounder",
    "42-pounder",
    "64-pounder",
  ].map((title) => ({
    title,
    category: "weapon",
    expectedPack: "items",
    sourcePath: "Chapter 4 Equipment and Items/Mounts and Vehicles/Cannons.md",
    page: "191",
  })),
];

function norm(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/\(.+?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function titleFromPath(path: string): string {
  return path
    .replace(/\.md$/i, "")
    .split("/")
    .at(-1)!
    .replace(/\s+/g, " ")
    .trim();
}

function collectMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) out.push(full);
    }
  };
  walk(dir);
  return out;
}

function extractPage(md: string): string {
  const match = md.match(/<!-- Page (\d+) -->/);
  return match?.[1] ?? "";
}

function classifySource(relPath: string): { category: string; expectedPack: string } | null {
  const parts = relPath.split("/");
  const fileName = parts.at(-1)!;
  const title = titleFromPath(relPath);

  if (EXCLUDED_FILE_NAMES.has(fileName) || EXCLUDED_SECTION_NAMES.has(title)) return null;
  if (title === "Actions") return null;
  if (/\s+\d+$/.test(title)) return null;
  if (/^Great (Bat|Saber-Tooth|Werewolf)$/i.test(title)) return null;
  if (/^Chapter \d+/i.test(title)) return null;

  if (parts[0] === "Chapter 1 Races") {
    if (parts.length === 2) return { category: "race", expectedPack: "races" };
    if (parts.length >= 3 && parts.at(-2) === title) return { category: "race", expectedPack: "races" };
    return null;
  }

  if (parts[0] === "Chapter 2 Classes") {
    const section = parts[1] ?? "";
    const classNames = new Set([
      "Barbarian",
      "Bard",
      "Brawler",
      "Fighter",
      "Gadgeteer",
      "Marksman",
      "Medic",
      "Rogue",
      "Savant",
    ]);
    if (classNames.has(section) && title === section) return { category: "class", expectedPack: "classes" };
    if ([
      "Primal Paths",
      "Bard College",
      "Brawling Style",
      "Martial Archetypes",
      "Marksman Archetype",
      "Medical Specialization",
      "Roguish Archetypes",
      "Specialist Paths",
    ].includes(section)) {
      return { category: "subclass", expectedPack: "subclasses" };
    }
    if ([
      "Amalgamation",
      "Beast of the Air",
      "Beast of the Land",
      "Beast of the Sea",
      "Flora",
      "Iron Defender",
      "Mechanical Servant",
    ].includes(section)) {
      return null;
    }
    return { category: "class-feature", expectedPack: "class-features" };
  }

  if (parts[0] === "Chapter 3 Character Origins") {
    if (parts[1] === "Backgrounds") return { category: "background", expectedPack: "backgrounds" };
    if (parts[1] === "Roles") return { category: "role", expectedPack: "backgrounds" };
    return { category: "source-section", expectedPack: "backgrounds" };
  }

  if (parts[0] === "Chapter 4 Equipment and Items") {
    const section = parts[1] ?? "";
    if (section === "Weapons") return { category: "weapon", expectedPack: "items" };
    if (section === "Armor and Shields") return { category: "armor", expectedPack: "items" };
    if (section === "Tools") return { category: "tool", expectedPack: "items" };
    if (section === "Mounts and Vehicles") return { category: "vehicle", expectedPack: "items" };
    if (section === "Adventuring Gear") return { category: "gear", expectedPack: "items" };
    if (section === "Shipbuilding and Repair") return { category: "ship", expectedPack: "items" };
    return { category: "loot", expectedPack: "items" };
  }

  if (parts[0] === "Chapter 5 Customization") {
    if (parts[1] === "Feats" || parts[1] === "Racial Feats") return { category: "feat", expectedPack: "feats" };
    if (parts[1] === "Fighting Styles") return { category: "class-feature", expectedPack: "class-features" };
    if (parts[1] === "Haki") return { category: "class-feature", expectedPack: "class-features" };
    return { category: "source-section", expectedPack: "feats" };
  }

  if (parts[0] === "Chapter 6 Devil Fruits") {
    if (parts[1]?.startsWith("Example")) return { category: "devil-fruit", expectedPack: "items" };
    return null;
  }

  if (parts[0] === "Chapter 7 Additional Powers") {
    return { category: "additional-power", expectedPack: "class-features" };
  }

  if (parts[0] === "Chapter 8 Special Items") {
    if (["Armor", "Weapons", "Rings", "Scrolls", "Staff and Wands", "Wondrous Items", "Consumables"].includes(parts[1] ?? "")) {
      return { category: "special-item", expectedPack: "items" };
    }
    return { category: "loot", expectedPack: "items" };
  }

  if (parts[0] === "Appendix A Creations") {
    if (parts[1] === "Creation Descriptions" || parts[1] === "Creations Descriptions") return { category: "creation", expectedPack: "creations" };
    return null;
  }

  if (parts[0] === "Appendix B Running The Game") {
    return null;
  }

  return null;
}

function collectSourceCandidates(): SourceCandidate[] {
  const files = collectMarkdownFiles(SOURCEBOOK);
  const seen = new Set<string>();
  const candidates: SourceCandidate[] = [];

  for (const file of files) {
    const relPath = relative(SOURCEBOOK, file).replace(/\\/g, "/");
    const classification = classifySource(relPath);
    if (!classification) continue;

    const title = titleFromPath(relPath);
    const key = `${classification.expectedPack}:${norm(title)}:${relPath}`;
    if (seen.has(key)) continue;
    seen.add(key);

    candidates.push({
      title,
      category: classification.category,
      expectedPack: classification.expectedPack,
      sourcePath: relPath,
      page: extractPage(readFileSync(file, "utf8")),
    });
  }

  for (const candidate of SYNTHETIC_CANDIDATES) {
    const key = `${candidate.expectedPack}:${norm(candidate.title)}:${candidate.sourcePath}`;
    if (seen.has(key)) continue;
    seen.add(key);
    candidates.push(candidate);
  }

  return candidates.sort((a, b) => {
    const pack = a.expectedPack.localeCompare(b.expectedPack);
    if (pack !== 0) return pack;
    const category = a.category.localeCompare(b.category);
    if (category !== 0) return category;
    return a.title.localeCompare(b.title);
  });
}

async function loadItemsFromIndex(rel: string): Promise<FoundryItem[]> {
  const url = pathToFileURL(join(DATA_SRC, rel)).href;
  const mod = await import(url);
  return (mod.default ?? mod.items ?? []) as FoundryItem[];
}

async function collectCompendium(): Promise<Map<string, CompendiumEntry[]>> {
  const compendium = new Map<string, CompendiumEntry[]>();
  for (const pack of PACK_LOADS) {
    const items = await loadItemsFromIndex(pack.rel);
    for (let item of items) {
      if (["class-features", "feats", "racial-features"].includes(pack.pack)) {
        item = ensureFeatureActivities(item as FeatureItem) as FoundryItem;
      } else {
        item = ensureItemActivities(item);
      }
      const key = norm(item.name);
      const entries = compendium.get(key) ?? [];
      entries.push({ item, pack: pack.pack });
      compendium.set(key, entries);
    }
  }
  return compendium;
}

function hasMidiOrDaeFlags(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if ("midi-qol" in value) return true;
  if ("dae" in value) return true;
  return Object.values(value as Record<string, unknown>).some(hasMidiOrDaeFlags);
}

function analyzeAutomation(item: FoundryItem, category: string): AutomationSummary {
  const system = item.system as Record<string, any>;
  const activities = system.activities && typeof system.activities === "object" ? Object.values(system.activities) : [];
  const hasActivity = activities.length > 0;
  const hasConsumption = activities.some((activity: any) => activity?.consumption?.targets?.length > 0);
  const hasUses = !!system.uses?.max || activities.some((activity: any) => activity?.uses?.max);
  const hasRecovery = !!system.uses?.recovery || activities.some((activity: any) => activity?.uses?.recovery?.length > 0);
  const hasEffects = Array.isArray(item.effects) && item.effects.length > 0;
  const hasDamageOrSave =
    !!system.damage?.parts?.length ||
    !!system.save?.ability ||
    activities.some((activity: any) => activity?.damage?.parts?.length || activity?.save?.ability?.length || activity?.healing);
  const midi = hasMidiOrDaeFlags(item.flags) || hasMidiOrDaeFlags(item.effects);
  const activatable =
    !!system.activation?.type ||
    !!system.actionType ||
    !!system.uses?.max ||
    !!system.damage?.parts?.length ||
    !!system.save?.ability;

  const notes: string[] = [];
  if (activatable && !hasActivity) notes.push("missing activity");
  if (system.uses?.max && !hasConsumption) notes.push("uses do not auto-consume");
  if (system.uses?.max && system.uses?.per && !hasRecovery) notes.push("uses lack recharge/recovery");
  if (hasEffects && !midi && ["class-feature", "feat", "additional-power", "special-item", "creation"].includes(category)) {
    notes.push("effects need Midi/DAE review");
  }
  let grade: AutomationSummary["grade"] = "reference";
  if (!REFERENCE_CATEGORY.has(category)) {
    if (!activatable) grade = "complete";
    else if (notes.length === 0 && hasActivity) grade = "complete";
    else if (hasActivity) grade = "usable";
    else grade = "partial";
  }

  return {
    grade,
    hasActivity,
    hasConsumption,
    hasUses,
    hasRecovery,
    hasEffects,
    hasMidiFlags: midi,
    hasDamageOrSave,
    notes,
  };
}

function findMatch(candidate: SourceCandidate, compendium: Map<string, CompendiumEntry[]>): CompendiumEntry | null {
  const keys = [
    norm(candidate.title),
    ...(SOURCEBOOK_ALIASES.get(candidate.title) ?? []).map(norm),
    norm(`Role: ${candidate.title}`),
    norm(candidate.title.replace(/s$/, "")),
  ];
  const direct = keys.flatMap((key) => compendium.get(key) ?? []);
  return direct.find((entry) => entry.pack === candidate.expectedPack) ?? direct[0] ?? null;
}

function renderBool(value: boolean): string {
  return value ? "yes" : "no";
}

function cell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function renderMarkdown(rows: ChecklistRow[]): string {
  const totals = {
    total: rows.length,
    present: rows.filter((row) => row.status === "present").length,
    missing: rows.filter((row) => row.status === "missing").length,
    underAutomated: rows.filter((row) => row.status === "under-automated").length,
  };

  const byCategory = [...new Set(rows.map((row) => row.category))].sort();
  return [
    "# OP5e Sourcebook Compendium Checklist",
    "",
    "Generated from the canonical `Sourcebook/` markdown tree.",
    "",
    `Total sourcebook candidates: ${totals.total}`,
    `Present in compendium: ${totals.present}`,
    `Missing from compendium: ${totals.missing}`,
    `Present but under-automated: ${totals.underAutomated}`,
    "",
    "## Category Summary",
    "",
    "| Category | Total | Present | Missing | Under-Automated |",
    "|---|---:|---:|---:|---:|",
    ...byCategory.map((category) => {
      const scoped = rows.filter((row) => row.category === category);
      return [
        category,
        scoped.length,
        scoped.filter((row) => row.status === "present").length,
        scoped.filter((row) => row.status === "missing").length,
        scoped.filter((row) => row.status === "under-automated").length,
      ].join(" | ");
    }).map((line) => `| ${line} |`),
    "",
    "## Checklist",
    "",
    "| Done | Sourcebook Item | Category | Expected Pack | Status | Automation | Activity | Consume | Recharge | Effects | Midi | Source |",
    "|---|---|---|---|---|---|---|---|---|---|---|---|",
    ...rows.map((row) => {
      const done = row.status === "present" ? "x" : " ";
      const automationNotes = row.automation.notes.length > 0 ? `${row.automation.grade}: ${row.automation.notes.join("; ")}` : row.automation.grade;
      return [
        `[${done}]`,
        cell(row.title),
        cell(row.category),
        cell(row.expectedPack),
        cell(row.status),
        cell(automationNotes),
        renderBool(row.automation.hasActivity),
        renderBool(row.automation.hasConsumption),
        renderBool(row.automation.hasRecovery),
        renderBool(row.automation.hasEffects),
        renderBool(row.automation.hasMidiFlags),
        cell(row.sourcePath),
      ].join(" | ");
    }).map((line) => `| ${line} |`),
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  const candidates = collectSourceCandidates();
  const compendium = await collectCompendium();
  const rows: ChecklistRow[] = candidates.map((candidate) => {
    const match = findMatch(candidate, compendium);
    if (!match) {
      return {
        ...candidate,
        status: "missing",
        compendiumName: "",
        compendiumPack: "",
        automation: {
          grade: "needs review",
          hasActivity: false,
          hasConsumption: false,
          hasUses: false,
          hasRecovery: false,
          hasEffects: false,
          hasMidiFlags: false,
          hasDamageOrSave: false,
          notes: ["missing compendium item"],
        },
      };
    }

    const automation = analyzeAutomation(match.item, candidate.category);
    const status = automation.notes.length > 0 ? "under-automated" : "present";
    return {
      ...candidate,
      status,
      compendiumName: match.item.name,
      compendiumPack: match.pack,
      automation,
    };
  });

  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const jsonPath = join(REPORT_DIR, "sourcebook-compendium-checklist.json");
  const mdPath = join(REPORT_DIR, "sourcebook-compendium-checklist.md");
  writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2) + "\n");
  writeFileSync(mdPath, renderMarkdown(rows));
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
