// Read-only: writes every playlist sound (playlist, folder, file) of the active test/bb-rehearsal world to a JSON file.
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const out = process.argv[2] ?? "../Foundry/actors-json/playlists-dump.json";
const run = () => game.playlists.contents.map((p) => ({ playlist: p.name, folder: p.folder?.name ?? null, mode: p.mode, sounds: p.sounds.contents.map((s) => ({ name: s.name, path: decodeURIComponent(s.path), volume: s.volume, repeat: s.repeat })) }));
await withFoundry(async (page) => { const d = await page.evaluate(`(${run.toString()})()`); writeFileSync(out, JSON.stringify(d, null, 1)); console.log(`${d.length} playlists, ${d.reduce((n, p) => n + p.sounds.length, 0)} sounds -> ${out}`); });
