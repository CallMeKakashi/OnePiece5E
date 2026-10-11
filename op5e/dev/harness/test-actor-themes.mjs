// bb-rehearsal/test only: injects scripts/actor-themes.mjs into the page, makes temporary theme playlists, opens actor sheets and checks the header buttons and name matching. Deletes what it made.
import { readFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const src = readFileSync(new URL("../../scripts/actor-themes.mjs", import.meta.url), "utf8");
const run = async (src) => {
  const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" })); await import(url);
  const made = [];
  for (const n of ["Theme: Tigor", "Theme: Kanto", "Theme: The Gallows", "Theme: Gallows"]) made.push(await Playlist.create({ name: n, mode: 0 }));
  const out = {};
  for (const name of ['Cade "Tigor" Hunt', "Kanto (Fenrir)", "The Gallows (Boss)", "Calder Voss", "Baptiste"]) {
    const actor = game.actors.getName(name); if (!actor) { out[name] = "actor missing"; continue; }
    const app = actor.sheet; await app.render({ force: true }); await new Promise((r) => setTimeout(r, 1200));
    app.element.querySelector('[data-action="toggleControls"]')?.click(); await new Promise((r) => setTimeout(r, 300));
    out[name] = [...app.element.querySelectorAll('[data-action^="op5eTheme"]')].map((b) => b.textContent.trim() || b.getAttribute("aria-label") || b.dataset.action);
    out[name + " isGM"] = game.user.isGM;
    await app.close();
  }
  for (const p of made) await p.delete();
  return out;
};
await withFoundry(async (page) => console.log(JSON.stringify(await page.evaluate(`(${run.toString()})(${JSON.stringify(src)})`), null, 1)));
