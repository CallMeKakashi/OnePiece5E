// Read-only: playlist folders, playlists and sound counts of the active test/bb-rehearsal world.
import { withFoundry } from "./drive.mjs";
const run = () => {
  const path = (f) => { const p = []; for (let x = f; x; x = x.folder) p.unshift(x.name); return p.join("/"); };
  return game.playlists.contents.map((p) => `${path(p.folder) || "(root)"} :: ${p.name} [${p.mode}] ${p.sounds.size} sounds${p.sounds.size ? ` e.g. ${p.sounds.contents[0].path.split("/").slice(-2).join("/")}` : ""}`).sort();
};
await withFoundry(async (page) => { const l = await page.evaluate(`(${run.toString()})()`); console.log(l.length, "playlists"); console.log(l.slice(0, 60).join("\n")); });
