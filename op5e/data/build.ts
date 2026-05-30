import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";
import type { ZodType } from "zod";
import { classItemSchema } from "./schemas/class.js";
import { subclassItemSchema } from "./schemas/subclass.js";
import { featureItemSchema } from "./schemas/feature.js";
import type { FeatureItem } from "./schemas/feature.js";
import { raceItemSchema } from "./schemas/race.js";
import { foundryItemBase } from "./schemas/common.js";
import { ensureFeatureActivities } from "./helpers/activities.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PACKS_SRC = join(ROOT, "packs-src");

// foundryvtt-cli compilePack hierarchy: items have embedded effects.
// LevelDB stores them as separate keys with dot-joined paths.
const EMBEDDED_COLLECTIONS: Record<string, string[]> = {
  items: ["effects"],
};

function addLevelDBKeys(
  doc: Record<string, unknown>,
  collection: string,
  sublevelPrefix = "",
  idPrefix = "",
): void {
  const sublevel = [sublevelPrefix, collection].filter(Boolean).join(".");
  const id = [idPrefix, doc._id as string].filter(Boolean).join(".");
  doc._key = `!${sublevel}!${id}`;

  for (const embedded of EMBEDDED_COLLECTIONS[collection] ?? []) {
    const arr = doc[embedded];
    if (!Array.isArray(arr)) continue;
    for (const child of arr) {
      if (child && typeof child === "object" && "_id" in child) {
        addLevelDBKeys(
          child as Record<string, unknown>,
          embedded,
          sublevel,
          id,
        );
      }
    }
  }
}

interface PackConfig {
  name: string;
  srcDir: string;
  schema: ZodType;
}

const PACK_CONFIGS: PackConfig[] = [
  { name: "classes", srcDir: "classes", schema: classItemSchema },
  { name: "subclasses", srcDir: "subclasses", schema: subclassItemSchema },
  { name: "class-features", srcDir: "class-features", schema: featureItemSchema },
  { name: "races", srcDir: "races", schema: raceItemSchema },
  { name: "racial-features", srcDir: "racial-features", schema: featureItemSchema },
  { name: "feats", srcDir: "feats", schema: featureItemSchema },
  { name: "items", srcDir: "items", schema: foundryItemBase },
  { name: "creations", srcDir: "creations", schema: foundryItemBase },
  { name: "backgrounds", srcDir: "backgrounds", schema: foundryItemBase },
];

interface Stats {
  pack: string;
  count: number;
  errors: number;
  activitiesGenerated?: number;
}

const FEATURE_PACKS = new Set(["class-features", "feats", "racial-features"]);

async function loadSourceItems(srcDir: string): Promise<unknown[]> {
  const fullDir = join(__dirname, "src", srcDir);
  if (!existsSync(fullDir)) return [];

  const indexPath = join(fullDir, "index.ts");
  if (!existsSync(indexPath)) return [];

  const moduleUrl = pathToFileURL(indexPath).href;
  try {
    const mod = await import(moduleUrl);
    if (Array.isArray(mod.default)) return mod.default;
    if (Array.isArray(mod.items)) return mod.items;
    return [];
  } catch (err) {
    console.warn(`  ⚠ Could not load ${srcDir}/index.ts: ${(err as Error).message}`);
    return [];
  }
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function buildPack(config: PackConfig): Promise<Stats> {
  const stats: Stats = { pack: config.name, count: 0, errors: 0 };
  const outDir = join(PACKS_SRC, config.name);
  ensureDir(outDir);

  const items = await loadSourceItems(config.srcDir);
  if (items.length === 0) {
    return stats;
  }

  for (let raw of items) {
    if (FEATURE_PACKS.has(config.name)) {
      raw = ensureFeatureActivities(raw as FeatureItem);
    }

    const result = config.schema.safeParse(raw);
    if (!result.success) {
      const label = (raw as Record<string, unknown>).name ?? "unknown";
      console.error(`  ✗ ${config.name}/${String(label)}: validation failed`);
      for (const issue of result.error.issues) {
        console.error(`    ${issue.path.join(".")}: ${issue.message}`);
      }
      stats.errors++;
      continue;
    }

    const doc = result.data as Record<string, unknown>;
    const id = doc._id as string;
    addLevelDBKeys(doc, "items");
    const filename = `${id}.json`;
    writeFileSync(
      join(outDir, filename),
      JSON.stringify(doc, null, 2) + "\n",
    );
    stats.count++;

    if (FEATURE_PACKS.has(config.name)) {
      const activities = (doc.system as Record<string, unknown>).activities;
      if (activities && typeof activities === "object" && Object.keys(activities).length > 0) {
        stats.activitiesGenerated = (stats.activitiesGenerated ?? 0) + 1;
      }
    }
  }

  return stats;
}

async function main(): Promise<void> {
  console.log("=== OP5e Compendium — JSON Build ===\n");

  if (existsSync(PACKS_SRC)) {
    rmSync(PACKS_SRC, { recursive: true, force: true });
  }

  const allStats: Stats[] = [];
  for (const config of PACK_CONFIGS) {
    console.log(`  ${config.name} …`);
    const stats = await buildPack(config);
    allStats.push(stats);
  }

  console.log("\n=== Summary ===");
  let totalItems = 0;
  let totalErrors = 0;
  let totalActivities = 0;
  for (const s of allStats) {
    if (s.count > 0 || s.errors > 0) {
      const status = s.errors > 0 ? "✗" : "✓";
      const activityNote =
        s.activitiesGenerated != null && s.activitiesGenerated > 0
          ? `, ${s.activitiesGenerated} with activities`
          : "";
      console.log(`  ${status} ${s.pack}: ${s.count} items, ${s.errors} errors${activityNote}`);
    }
    totalItems += s.count;
    totalErrors += s.errors;
    totalActivities += s.activitiesGenerated ?? 0;
  }

  if (totalItems === 0 && totalErrors === 0) {
    console.log("  (no source items found — add definitions to data/src/)");
  }

  console.log(`\nTotal: ${totalItems} items, ${totalErrors} errors, ${totalActivities} with activities`);
  if (totalErrors > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
