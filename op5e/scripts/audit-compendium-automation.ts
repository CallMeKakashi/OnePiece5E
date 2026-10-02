import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { FoundryItem } from "../data/schemas/common.js";
import type { FeatureItem } from "../data/schemas/feature.js";
import { ensureFeatureActivities, ensureItemActivities } from "../data/helpers/activities.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_SRC = join(ROOT, "data", "src");
const REPORT_DIR = join(ROOT, "reports");

type Status = "ready" | "needs-automation" | "reference";

interface PackLoad {
  pack: string;
  rel: string;
  featureLike?: boolean;
}

interface AutomationRow {
  pack: string;
  name: string;
  type: string;
  status: Status;
  activityCount: number;
  activityTypes: string[];
  hasConsumption: boolean;
  hasUses: boolean;
  hasRecovery: boolean;
  hasEffects: boolean;
  hasMidiOrDae: boolean;
  hasDamageOrSaveOrHealing: boolean;
  sourceDamageDice: string[];
  sourceSaveAbilities: string[];
  notes: string[];
}

const PACK_LOADS: PackLoad[] = [
  { pack: "classes", rel: "classes/index.ts" },
  { pack: "subclasses", rel: "subclasses/index.ts" },
  { pack: "class-features", rel: "class-features/index.ts", featureLike: true },
  { pack: "races", rel: "races/index.ts" },
  { pack: "racial-features", rel: "racial-features/index.ts", featureLike: true },
  { pack: "feats", rel: "feats/index.ts", featureLike: true },
  { pack: "items", rel: "items/index.ts" },
  { pack: "creations", rel: "creations/index.ts" },
  { pack: "backgrounds", rel: "backgrounds/index.ts" },
];

const REFERENCE_PACKS = new Set(["classes", "subclasses", "races", "backgrounds"]);
const RECOVERY_PERIODS = new Set(["sr", "shortRest", "lr", "longRest", "day", "daily"]);

async function loadItemsFromIndex(rel: string): Promise<FoundryItem[]> {
  const url = pathToFileURL(join(DATA_SRC, rel)).href;
  const mod = await import(url);
  return (mod.default ?? mod.items ?? []) as FoundryItem[];
}

function hasMidiOrDaeFlags(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if ("midi-qol" in value) return true;
  if ("dae" in value) return true;
  return Object.values(value as Record<string, unknown>).some(hasMidiOrDaeFlags);
}

function isReferenceOnly(item: FoundryItem, pack: string): boolean {
  const system = item.system as Record<string, any>;
  if (REFERENCE_PACKS.has(pack)) return true;
  if (item.type === "loot") return true;
  if (!system.activation?.type && !system.actionType && !system.uses?.max && !system.damage?.parts?.length && !system.save?.ability) {
    return true;
  }
  return false;
}

function plainText(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&(?:#39|apos);/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sourceMechanics(item: FoundryItem): { damageDice: string[]; saveAbilities: string[] } {
  const text = plainText(String((item.system as Record<string, any>).description?.value ?? ""));
  const damageDice = [...text.matchAll(/\b(\d+d\d+)\b(?=[^.!?]{0,80}\bdamage\b)/gi)]
    .map((match) => match[1].toLowerCase());
  const abilityMap: Record<string, string> = {
    strength: "str", dexterity: "dex", constitution: "con",
    intelligence: "int", wisdom: "wis", charisma: "cha",
  };
  const saveAbilities = [...text.matchAll(/\b(?:must\s+)?(?:succeed\s+on|make)\s+(?:a|an)\s+(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+saving\s+throw/gi)]
    .map((match) => abilityMap[match[1].toLowerCase()]);
  return {
    damageDice: [...new Set(damageDice)],
    saveAbilities: [...new Set(saveAbilities)],
  };
}

function analyze(item: FoundryItem, pack: string): AutomationRow {
  const system = item.system as Record<string, any>;
  const activities = system.activities && typeof system.activities === "object"
    ? Object.values(system.activities) as Array<Record<string, any>>
    : [];
  const activityTypes = activities.map((activity) => activity.type).filter(Boolean);
  const hasActivity = activities.length > 0;
  const hasConsumption = activities.some((activity) => activity?.consumption?.targets?.length > 0);
  const hasUses = !!system.uses?.max || activities.some((activity) => activity?.uses?.max || activity?.consumption?.targets?.length > 0);
  const hasRecovery = !!system.uses?.recovery || activities.some((activity) => activity?.uses?.recovery?.length > 0);
  const hasEffects = Array.isArray(item.effects) && item.effects.length > 0;
  const hasMidiOrDae = hasMidiOrDaeFlags(item.flags) || hasMidiOrDaeFlags(item.effects);
  const hasDamageOrSaveOrHealing =
    !!system.damage?.parts?.length ||
    !!system.save?.ability ||
    activities.some((activity) => activity?.damage?.parts?.length || activity?.save?.ability?.length || activity?.healing);
  const activatable =
    !!system.activation?.type ||
    !!system.actionType ||
    !!system.uses?.max ||
    !!system.damage?.parts?.length ||
    !!system.save?.ability;

  const notes: string[] = [];
  const expected = sourceMechanics(item);
  const activityDamageDice = activities.flatMap((activity) =>
    (activity?.damage?.parts ?? []).map((part: Record<string, any>) =>
      part?.number && part?.denomination ? `${part.number}d${part.denomination}`.toLowerCase() : "",
    ),
  ).filter(Boolean);
  const activitySaveAbilities = activities.flatMap((activity) => activity?.save?.ability ?? []);
  if (activatable && !hasActivity) notes.push("missing activity");
  if (system.uses?.max && !hasConsumption) notes.push("uses do not auto-consume");
  if (system.uses?.max && RECOVERY_PERIODS.has(system.uses?.per) && !hasRecovery) notes.push("uses lack recharge/recovery");
  if (activityTypes.includes("damage") && !activities.some((activity) => activity?.damage?.parts?.length > 0)) {
    notes.push("damage activity lacks damage data");
  }
  if (activityTypes.includes("save") && !activities.some((activity) => activity?.save?.ability?.length > 0)) {
    notes.push("save activity lacks save data");
  }
  if (activityTypes.includes("heal") && !activities.some((activity) => activity?.healing)) {
    notes.push("heal activity lacks healing data");
  }
  if (hasEffects && !hasMidiOrDae && !activities.some((activity) => activity?.effects?.length > 0)) {
    notes.push("effects are not connected to Midi/DAE or activities");
  }
  if (expected.damageDice.length > 0 && activityDamageDice.length === 0) {
    notes.push(`source damage (${expected.damageDice.join(", ")}) is not on an activity`);
  }
  for (const ability of expected.saveAbilities) {
    if (!activitySaveAbilities.includes(ability)) {
      notes.push(`source ${ability.toUpperCase()} save is not on an activity`);
    }
  }

  const reference = isReferenceOnly(item, pack);
  return {
    pack,
    name: item.name,
    type: item.type,
    status: reference ? "reference" : notes.length > 0 ? "needs-automation" : "ready",
    activityCount: activities.length,
    activityTypes,
    hasConsumption,
    hasUses,
    hasRecovery,
    hasEffects,
    hasMidiOrDae,
    hasDamageOrSaveOrHealing,
    sourceDamageDice: expected.damageDice,
    sourceSaveAbilities: expected.saveAbilities,
    notes,
  };
}

function cell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function renderMarkdown(rows: AutomationRow[]): string {
  const actionable = rows.filter((row) => row.status !== "reference");
  const packs = [...new Set(rows.map((row) => row.pack))].sort();
  return [
    "# OP5e Full Compendium Automation Audit",
    "",
    "Generated from every source pack after applying generated dnd5e activities.",
    "",
    `Total compendium items: ${rows.length}`,
    `Automation-ready items: ${actionable.filter((row) => row.status === "ready").length}`,
    `Needs automation: ${actionable.filter((row) => row.status === "needs-automation").length}`,
    `Reference-only items: ${rows.filter((row) => row.status === "reference").length}`,
    "",
    "## Pack Summary",
    "",
    "| Pack | Total | Ready | Needs Automation | Reference |",
    "|---|---:|---:|---:|---:|",
    ...packs.map((pack) => {
      const scoped = rows.filter((row) => row.pack === pack);
      return `| ${pack} | ${scoped.length} | ${scoped.filter((row) => row.status === "ready").length} | ${scoped.filter((row) => row.status === "needs-automation").length} | ${scoped.filter((row) => row.status === "reference").length} |`;
    }),
    "",
    "## Needs Automation",
    "",
    "| Pack | Item | Type | Activities | Consume | Recharge | Damage/Save/Heal | Effects | Midi/DAE | Notes |",
    "|---|---|---|---|---|---|---|---|---|---|",
    ...rows
      .filter((row) => row.status === "needs-automation")
      .map((row) => `| ${row.pack} | ${cell(row.name)} | ${row.type} | ${row.activityTypes.join(", ") || row.activityCount} | ${row.hasConsumption ? "yes" : "no"} | ${row.hasRecovery ? "yes" : "no"} | ${row.hasDamageOrSaveOrHealing ? "yes" : "no"} | ${row.hasEffects ? "yes" : "no"} | ${row.hasMidiOrDae ? "yes" : "no"} | ${cell(row.notes.join("; "))} |`),
  ].join("\n") + "\n";
}

async function main(): Promise<void> {
  const rows: AutomationRow[] = [];
  for (const pack of PACK_LOADS) {
    const items = await loadItemsFromIndex(pack.rel);
    for (let item of items) {
      if (pack.featureLike) item = ensureFeatureActivities(item as FeatureItem) as FoundryItem;
      else item = ensureItemActivities(item);
      rows.push(analyze(item, pack.pack));
    }
  }

  rows.sort((a, b) => a.pack.localeCompare(b.pack) || a.status.localeCompare(b.status) || a.name.localeCompare(b.name));
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const jsonPath = join(REPORT_DIR, "compendium-automation-audit.json");
  const mdPath = join(REPORT_DIR, "compendium-automation-audit.md");
  writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2) + "\n");
  writeFileSync(mdPath, renderMarkdown(rows));
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
