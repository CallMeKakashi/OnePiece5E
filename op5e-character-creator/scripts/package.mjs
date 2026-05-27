import {
  createWriteStream,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yazl = require("yazl");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MODULE_ID = "op5e-character-creator";
const PORT = process.env.SERVE_PORT ?? "8081";

const INCLUDE = ["module.json", "scripts", "templates", "styles"];

function addDirectory(zip, dir, zipPrefix) {
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

async function main() {
  console.log("=== OP5e Character Creator — Package ===\n");

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

  const zipPath = join(ROOT, `${MODULE_ID}.zip`);
  await new Promise((resolve, reject) => {
    const out = createWriteStream(zipPath);
    out.on("close", resolve);
    out.on("error", reject);
    zip.outputStream.pipe(out);
  });

  const sizeKb = (statSync(zipPath).size / 1024).toFixed(1);
  console.log(`\n✓ ${zipPath} (${sizeKb} KB, ${totalFiles} files)`);

  const baseUrl = `http://localhost:${PORT}`;
  const manifestPath = join(ROOT, "module.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.manifest = `${baseUrl}/module.json`;
  manifest.download = `${baseUrl}/${MODULE_ID}.zip`;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`✓ module.json (manifest → ${baseUrl}/module.json)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
