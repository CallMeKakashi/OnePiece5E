import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compilePack } from "@foundryvtt/foundryvtt-cli";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PACKS_SRC = join(ROOT, "packs-src");
const PACKS_OUT = join(ROOT, "packs");

async function main(): Promise<void> {
  console.log("=== OP5e Compendium — LevelDB Compilation ===\n");

  if (!existsSync(PACKS_SRC)) {
    console.error(
      "No packs-src/ directory found. Run `npm run build:json` first.",
    );
    process.exit(1);
  }

  const packDirs = readdirSync(PACKS_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (packDirs.length === 0) {
    console.log("  No pack directories in packs-src/. Nothing to compile.");
    return;
  }

  if (!existsSync(PACKS_OUT)) {
    mkdirSync(PACKS_OUT, { recursive: true });
  }

  let compiled = 0;
  for (const packName of packDirs) {
    const src = join(PACKS_SRC, packName);
    const dest = join(PACKS_OUT, packName);

    const jsonFiles = readdirSync(src).filter((f) => f.endsWith(".json"));
    if (jsonFiles.length === 0) {
      continue;
    }

    console.log(`  Compiling ${packName} (${jsonFiles.length} documents) …`);
    await compilePack(src, dest, { yaml: false });
    console.log(`  ✓ ${packName}`);
    compiled++;
  }

  if (compiled === 0) {
    console.log("  No packs with JSON content found. Nothing compiled.");
  } else {
    console.log(`\nDone — ${compiled} LevelDB packs written to packs/`);
  }
}

main().catch((err) => {
  console.error("Compilation failed:", err);
  process.exit(1);
});
