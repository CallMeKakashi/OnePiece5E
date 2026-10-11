// Actor theme songs: a music-note button in the actor sheet header (GM only) plays or stops that actor's theme playlist. The theme is the playlist stored in the
// actor flag flags.op5e.theme, or else the playlist "Theme: <name>" whose name appears in the actor's name ("Theme: Tigor" fits Cade "Tigor" Hunt, "Theme: Kanto" fits
// Kanto (Fenrir)). A second header button, Set theme, picks a different playlist. Playback is the normal playlist playback, so the music sync keeps players aligned.
const MODULE = "op5e", PREFIX = "Theme:";
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function themeFor(actor) {
  const id = actor.getFlag(MODULE, "theme");
  if (id && game.playlists.has(id)) return game.playlists.get(id);
  const name = ` ${norm(actor.name)} `;
  const hits = game.playlists.filter((p) => p.name.startsWith(PREFIX) && name.includes(` ${norm(p.name.slice(PREFIX.length))} `));
  return hits.sort((a, b) => b.name.length - a.name.length)[0] ?? null; // the longest match wins ("The Gallows" over "Gallows")
}

async function toggle(actor) {
  const pl = themeFor(actor);
  if (!pl) return ui.notifications.warn(`No theme playlist for ${actor.name}`);
  return pl.playing ? pl.stopAll() : pl.playAll();
}

async function pick(actor) {
  const options = game.playlists.contents.sort((a, b) => a.name.localeCompare(b.name)).map((p) => `<option value="${p.id}" ${themeFor(actor)?.id === p.id ? "selected" : ""}>${foundry.utils.escapeHTML(p.name)}</option>`).join("");
  const res = await foundry.applications.api.DialogV2.prompt({
    window: { title: `Theme for ${actor.name}` },
    content: `<div class="form-group"><label>Playlist</label><select name="playlist"><option value="">(automatic by name)</option>${options}</select></div>`,
    ok: { label: "Save", callback: (_e, button) => button.form.elements.playlist.value },
    rejectClose: false,
  });
  if (res === undefined || res === null) return;
  return res ? actor.setFlag(MODULE, "theme", res) : actor.unsetFlag(MODULE, "theme");
}

Hooks.on("getHeaderControlsActorSheetV2", (app, controls) => {
  const actor = app.document ?? app.actor;
  if (!game.user.isGM || !actor) return;
  const pl = themeFor(actor);
  controls.push({ icon: "fa-solid fa-music", label: pl?.playing ? "Stop theme" : "Play theme", action: "op5eTheme", visible: !!pl, onClick: () => toggle(actor) });
  controls.push({ icon: "fa-solid fa-sliders", label: "Set theme", action: "op5eThemePick", visible: true, onClick: () => pick(actor) });
});
