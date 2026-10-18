// Creates a Scene from scripts/mapgen.py output (<slug>.scene.json + <slug>.png in Foundry Data/bb-maps). Never replaces or activates; refuses if a scene of that name exists.
// Usage: node dev/harness/import-map.mjs <path-to-scene.json> [--folder name]
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { withFoundry } from "./drive.mjs";
const path = process.argv[2]; if (!path) throw new Error("usage: node dev/harness/import-map.mjs <scene.json>");
const data = JSON.parse(readFileSync(path, "utf8"));
const src = `bb-maps/${basename(path).replace(".scene.json", ".png")}`;
const folderName = process.argv.includes("--folder") ? process.argv[process.argv.indexOf("--folder") + 1] : null;
const run = async (data, src, folderName, replace) => {
  const old = game.scenes.getName(data.name); if (old && !replace) return { error: `a scene named "${data.name}" already exists; pass --replace to replace it` }; if (old) await old.delete();
  const folder = folderName ? (game.folders.find((f) => f.type === "Scene" && f.name === folderName) ?? await Folder.create({ name: folderName, type: "Scene" })) : null;
  const { walls, lights, ...rest } = data;
  const s = await Scene.create({ ...rest, folder: folder?.id, background: { src }, padding: 0, tokenVision: true, fog: { exploration: true }, environment: { globalLight: { enabled: false }, darknessLevel: 0.6 }, initial: { x: rest.width / 2, y: rest.height / 2, scale: 0.4 } });
  await s.createEmbeddedDocuments("Wall", walls);
  await s.createEmbeddedDocuments("AmbientLight", lights);
  const t = await s.createThumbnail().catch(() => null); if (t?.thumb) await s.update({ thumb: t.thumb });
  return { id: s.id, name: s.name, walls: s.walls.size, lights: s.lights.size, size: `${s.width}x${s.height}` };
};
await withFoundry(async (page) => { console.log(JSON.stringify(await page.evaluate(`(${run.toString()})(${JSON.stringify(data)}, ${JSON.stringify(src)}, ${JSON.stringify(folderName)}, ${process.argv.includes("--replace")})`))); });
