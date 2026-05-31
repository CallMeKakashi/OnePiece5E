import {
  cpSync,
  createWriteStream,
  existsSync,
  mkdirSync,
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
const DIST = join(ROOT, "dist");
const MODULE_ID = "op5e";

const INCLUDE = ["module.json", "scripts", "lang", "packs", "templates", "styles"];

function normalizeVersionFromTag(tag) {
  if (!tag) return undefined;
  return String(tag).replace(/^v/i, "");
}

function getReleaseUrls({ repo, tag }) {
  if (!repo) throw new Error("RELEASE mode requires GITHUB_REPOSITORY (owner/repo).");
  if (!tag) throw new Error("RELEASE mode requires RELEASE_TAG (e.g. v0.2.0).");
  return {
    manifest: `https://github.com/${repo}/releases/latest/download/module.json`,
    download: `https://github.com/${repo}/releases/download/${tag}/${MODULE_ID}.zip`,
  };
}

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

function isReleaseMode() {
  return process.env.RELEASE === "true" || process.env.RELEASE === "1";
}

function buildPackagedManifest() {
  const manifest = JSON.parse(readFileSync(join(ROOT, "module.json"), "utf8"));
  const releaseMode = isReleaseMode();

  if (releaseMode) {
    const repo = process.env.GITHUB_REPOSITORY;
    const tag = process.env.RELEASE_TAG;
    const urls = getReleaseUrls({ repo, tag });
    manifest.manifest = urls.manifest;
    manifest.download = urls.download;
    manifest.version = normalizeVersionFromTag(tag) ?? manifest.version;
  } else {
    const port = process.env.SERVE_PORT ?? "8080";
    const baseUrl = `http://localhost:${port}`;
    manifest.manifest = `${baseUrl}/module.json`;
    manifest.download = `${baseUrl}/${MODULE_ID}.zip`;
  }

  return {
    manifest,
    manifestJson: `${JSON.stringify(manifest, null, 2)}\n`,
    releaseMode,
  };
}

async function main() {
  console.log("=== OP5e — Package ===\n");

  const packsDir = join(ROOT, "packs");
  if (!existsSync(packsDir)) {
    console.error("No packs/ directory. Run `npm run build` first.");
    process.exit(1);
  }

  if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });

  const { manifestJson, releaseMode } = buildPackagedManifest();
  const zip = new yazl.ZipFile();
  let totalFiles = 0;

  for (const inc of INCLUDE) {
    const full = join(ROOT, inc);
    if (!existsSync(full) && inc !== "module.json") {
      console.warn(`  ⚠ Missing: ${inc}`);
      continue;
    }
    if (inc === "module.json") {
      zip.addBuffer(Buffer.from(manifestJson, "utf8"), `${MODULE_ID}/module.json`);
      console.log(`  + module.json (packaged manifest URLs)`);
      totalFiles++;
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
  await new Promise((resolve, reject) => {
    const out = createWriteStream(zipPath);
    zip.outputStream.pipe(out);
    zip.outputStream.on("error", reject);
    out.on("close", resolve);
    out.on("error", reject);
  });

  const sizeMb = (statSync(zipPath).size / 1024 / 1024).toFixed(2);
  console.log(`\n✓ ${zipPath} (${sizeMb} MB, ${totalFiles} files)`);

  if (releaseMode) {
    const repo = process.env.GITHUB_REPOSITORY;
    const tag = process.env.RELEASE_TAG;
    console.log(`✓ dist/module.json (GitHub Releases URLs → ${repo}@${tag})`);
  } else {
    const port = process.env.SERVE_PORT ?? "8080";
    const baseUrl = `http://localhost:${port}`;
    console.log(`✓ dist/module.json (manifest URLs → ${baseUrl})`);
  }
  writeFileSync(join(DIST, "module.json"), manifestJson);

  for (const dir of ["scripts", "lang", "packs", "templates", "styles"]) {
    const src = join(ROOT, dir);
    if (existsSync(src)) {
      cpSync(src, join(DIST, dir), { recursive: true });
      console.log(`✓ dist/${dir}/ synced`);
    }
  }

  if (!releaseMode) {
    const port = process.env.SERVE_PORT ?? "8080";
    const baseUrl = `http://localhost:${port}`;
    console.log(`\nInstall in Foundry via manifest URL:\n  ${baseUrl}/module.json`);
  }
}

main().catch((err) => {
  console.error("Packaging failed:", err);
  process.exit(1);
});
