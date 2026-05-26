import { createWriteStream, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const MODULE_ID = "op5e-compendium";

const INCLUDE = ["module.json", "scripts", "packs"];

interface TarEntry {
  name: string;
  data: Buffer;
  mode: number;
}

function collectFiles(base: string, subpath: string): TarEntry[] {
  const entries: TarEntry[] = [];
  const full = join(base, subpath);

  if (!existsSync(full)) {
    console.warn(`  ⚠ Missing: ${subpath}`);
    return entries;
  }

  const stat = statSync(full);
  if (stat.isFile()) {
    entries.push({
      name: `${MODULE_ID}/${subpath}`,
      data: readFileSync(full),
      mode: 0o644,
    });
  } else if (stat.isDirectory()) {
    for (const child of readdirSync(full, { withFileTypes: true })) {
      entries.push(...collectFiles(base, join(subpath, child.name)));
    }
  }

  return entries;
}

function tarBlock(size: number): number {
  return Math.ceil(size / 512) * 512;
}

function createTarHeader(name: string, size: number, mode: number): Buffer {
  const header = Buffer.alloc(512);
  const nameBytes = Buffer.from(name, "utf8");

  if (nameBytes.length > 100) {
    // Use UStar prefix for long names
    const parts = name.split("/");
    let prefix = "";
    let shortName = name;
    for (let i = 0; i < parts.length - 1; i++) {
      const tryPrefix = parts.slice(0, i + 1).join("/");
      const tryName = parts.slice(i + 1).join("/");
      if (Buffer.byteLength(tryName, "utf8") <= 100 && Buffer.byteLength(tryPrefix, "utf8") <= 155) {
        prefix = tryPrefix;
        shortName = tryName;
      }
    }
    header.write(shortName, 0, 100, "utf8");
    if (prefix) header.write(prefix, 345, 155, "utf8");
  } else {
    nameBytes.copy(header, 0, 0, Math.min(nameBytes.length, 100));
  }

  header.write(mode.toString(8).padStart(7, "0"), 100, 8, "utf8");
  header.write("0".padStart(7, "0"), 108, 8, "utf8"); // uid
  header.write("0".padStart(7, "0"), 116, 8, "utf8"); // gid
  header.write(size.toString(8).padStart(11, "0"), 124, 12, "utf8");
  header.write(Math.floor(Date.now() / 1000).toString(8).padStart(11, "0"), 136, 12, "utf8");
  header.write("ustar\x00", 257, 6, "utf8");
  header.write("00", 263, 2, "utf8");

  // Compute checksum
  header.fill(0x20, 148, 156); // space-fill checksum field
  let cksum = 0;
  for (let i = 0; i < 512; i++) cksum += header[i];
  header.write(cksum.toString(8).padStart(6, "0") + "\x00 ", 148, 8, "utf8");

  return header;
}

function buildTar(entries: TarEntry[]): Buffer {
  const parts: Buffer[] = [];

  for (const entry of entries) {
    const header = createTarHeader(entry.name, entry.data.length, entry.mode);
    parts.push(header);
    parts.push(entry.data);
    const padding = tarBlock(entry.data.length) - entry.data.length;
    if (padding > 0) parts.push(Buffer.alloc(padding));
  }

  // Two 512-byte zero blocks to end
  parts.push(Buffer.alloc(1024));
  return Buffer.concat(parts);
}

async function main(): Promise<void> {
  console.log("=== OP5e Compendium — Package ===\n");

  const packsDir = join(ROOT, "packs");
  if (!existsSync(packsDir)) {
    console.error("No packs/ directory. Run `npm run build` first.");
    process.exit(1);
  }

  const allEntries: TarEntry[] = [];
  for (const inc of INCLUDE) {
    const entries = collectFiles(ROOT, inc);
    allEntries.push(...entries);
    console.log(`  ${inc}: ${entries.length} files`);
  }

  if (allEntries.length === 0) {
    console.error("No files collected. Aborting.");
    process.exit(1);
  }

  const { mkdirSync } = await import("node:fs");
  if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });

  const tarData = buildTar(allEntries);
  const outPath = join(DIST, `${MODULE_ID}.tar.gz`);
  const gzip = createGzip({ level: 9 });
  const outStream = createWriteStream(outPath);

  await pipeline(Readable.from(tarData), gzip, outStream);

  const sizeMb = (statSync(outPath).size / 1024 / 1024).toFixed(2);
  console.log(`\n✓ ${outPath} (${sizeMb} MB, ${allEntries.length} files)`);

  const port = process.env.SERVE_PORT ?? "8080";
  const baseUrl = `http://localhost:${port}`;

  const manifest = JSON.parse(readFileSync(join(ROOT, "module.json"), "utf8"));
  manifest.manifest = `${baseUrl}/module.json`;
  manifest.download = `${baseUrl}/${MODULE_ID}.tar.gz`;

  const { writeFileSync: writeFs } = await import("node:fs");
  writeFs(join(DIST, "module.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`✓ dist/module.json (manifest URLs → ${baseUrl})`);
  console.log(`\nTo install in Foundry, serve dist/ and use this manifest URL:`);
  console.log(`  ${baseUrl}/module.json`);
}

main().catch((err) => {
  console.error("Packaging failed:", err);
  process.exit(1);
});
