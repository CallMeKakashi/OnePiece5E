import {
  createWriteStream,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yazl = require("yazl") as typeof import("yazl");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const MODULE_ID = "op5e-compendium";

const INCLUDE = ["module.json", "scripts", "packs"];

function addDirectory(zip: InstanceType<typeof yazl.ZipFile>, dir: string, zipPrefix: string): number {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const zipPath = `${zipPrefix}/${entry.name}`;
    if (entry.isDirectory()) {
      count += addDirectory(zip, full, zipPath);
    } else if (entry.isFile()) {
      zip.addFile(full, zipPath);
      count++;
    }
  }
  return count;
}

async function main(): Promise<void> {
  console.log("=== OP5e Compendium — Package ===\n");

  const packsDir = join(ROOT, "packs");
  if (!existsSync(packsDir)) {
    console.error("No packs/ directory. Run `npm run build` first.");
    process.exit(1);
  }

  const { mkdirSync } = await import("node:fs");
  if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });

  const zip = new yazl.ZipFile();
  let totalFiles = 0;

  for (const inc of INCLUDE) {
    const full = join(ROOT, inc);
    if (!existsSync(full)) {
      console.warn(`  ⚠ Missing: ${inc}`);
      continue;
    }
    const stat = statSync(full);
    if (stat.isDirectory()) {
      const count = addDirectory(zip, full, `${MODULE_ID}/${inc}`);
      console.log(`  + ${inc}/ (${count} files)`);
      totalFiles += count;
    } else {
      zip.addFile(full, `${MODULE_ID}/${inc}`);
      console.log(`  + ${inc}`);
      totalFiles++;
    }
  }

  zip.end();

  const zipPath = join(DIST, `${MODULE_ID}.zip`);
  await new Promise<void>((resolve, reject) => {
    const out = createWriteStream(zipPath);
    out.on("close", resolve);
    out.on("error", reject);
    zip.outputStream.pipe(out);
  });

  const sizeMb = (statSync(zipPath).size / 1024 / 1024).toFixed(2);
  console.log(`\n✓ ${zipPath} (${sizeMb} MB, ${totalFiles} files)`);

  const port = process.env.SERVE_PORT ?? "8080";
  const baseUrl = `http://localhost:${port}`;

  const manifest = JSON.parse(readFileSync(join(ROOT, "module.json"), "utf8"));
  manifest.manifest = `${baseUrl}/module.json`;
  manifest.download = `${baseUrl}/${MODULE_ID}.zip`;

  const { writeFileSync } = await import("node:fs");
  writeFileSync(join(DIST, "module.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`✓ dist/module.json (manifest URLs → ${baseUrl})`);
  console.log(`\nTo install in Foundry, serve dist/ and use this manifest URL:`);
  console.log(`  ${baseUrl}/module.json`);
}

main().catch((err) => {
  console.error("Packaging failed:", err);
  process.exit(1);
});
