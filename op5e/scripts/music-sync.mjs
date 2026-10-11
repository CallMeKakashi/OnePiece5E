// Synchronized playlist music. Core Foundry starts each sound on every client as the update arrives (plus its own load time), so players drift
// from the GM. The GM's playback position is authoritative: the GM broadcasts it, every other client seeks when it has drifted too far.
// Core already mirrors play, pause and track changes (document updates); this only fixes the timing. Uses the module socket ("socket": true).
const MODULE = "op5e", EVENT = `module.${MODULE}`;
const TICK_MS = 4000, BURST_MS = [400, 1500, 3000]; // regular broadcast, plus quick ones right after a play/pause change
const DRIFT_S = 0.3, COOLDOWN_MS = 3000;           // seek only past this drift; leave a corrected sound alone while it settles
const lastSeek = new Map();

/** Smallest signed difference a - b on a loop of length d (or plain difference when the sound does not loop). */
const diff = (a, b, d, loop) => loop && d ? ((((a - b) % d) + d + d / 2) % d) - d / 2 : a - b;

function snapshot() {
  const sounds = [];
  for (const pl of game.playlists) for (const ps of pl.sounds) {
    const s = ps.sound;
    if (ps.playing && s?.playing) sounds.push({ pl: pl.id, id: ps.id, t: s.currentTime, loop: !!ps.repeat });
  }
  return sounds.length ? { sounds, at: game.time.serverTime } : null;
}

const broadcast = () => { if (!game.user.isGM || !game.settings.get(MODULE, "musicSync")) return; const m = snapshot(); if (m) game.socket.emit(EVENT, { type: "music-sync", ...m }); };
const burst = () => { for (const ms of BURST_MS) setTimeout(broadcast, ms); };

async function correct({ sounds, at }) {
  const lag = Math.max(0, (game.time.serverTime - at) / 1000); // message transit, so the target is where the GM is now
  for (const { pl, id, t, loop } of sounds) {
    const ps = game.playlists.get(pl)?.sounds.get(id), s = ps?.sound;
    if (!ps?.playing || !s?.playing || !s.loaded) continue;
    if (Date.now() - (lastSeek.get(id) ?? 0) < COOLDOWN_MS) continue;
    const dur = s.duration, target = t + lag, d = diff(target, s.currentTime, dur, loop);
    if (Math.abs(d) <= DRIFT_S) continue;
    lastSeek.set(id, Date.now());
    const wanted = dur && loop ? ((target % dur) + dur) % dur : target;
    if (dur && wanted >= dur) continue; // the GM's track is past this client's end; let it finish
    await s.stop({ fade: 0, volume: 0 });
    await s.play({ offset: wanted, loop, volume: ps.volume, fade: 0 });
  }
}

/** GM helper: jump every client to `seconds` in a sound, e.g. game.op5eMusic.seek(game.playlists.getName("Battle").sounds.contents[0], 30). A paused sound resumes from there. */
async function seek(ps, seconds) {
  if (!game.user.isGM || !ps?.sound) return;
  const dur = ps.sound.duration || Infinity, t = Math.max(0, Math.min(seconds, dur - 0.5));
  if (!ps.sound.playing) return ps.pausedTime != null ? ps.update({ pausedTime: t }) : undefined; // paused: the document carries the position to every client
  await ps.sound.stop({ fade: 0, volume: 0 });
  await ps.sound.play({ offset: t, loop: !!ps.repeat, volume: ps.volume, fade: 0 });
  broadcast();
}
const seekBy = (ps, delta) => seek(ps, (ps.sound?.playing ? ps.sound.currentTime : ps.pausedTime ?? 0) + delta);
const pos = (ps) => ps.sound?.playing ? ps.sound.currentTime : ps.pausedTime ?? 0;

/** GM seek row in the "Currently playing" widget: back 10 s, a slider, forward 10 s. Re-added on every render; the slider follows playback while not being dragged. */
function addSeekRows(html) {
  for (const li of html.querySelectorAll(".currently-playing li.sound")) {
    const ps = game.playlists.get(li.dataset.playlistId)?.sounds.get(li.dataset.soundId);
    const row = li.querySelector(".sound-playback");
    if (!ps || !row || li.querySelector(".op5e-seek")) continue;
    const div = document.createElement("div"); div.className = "op5e-seek flexrow";
    div.innerHTML = `<button type="button" class="inline-control icon fa-solid fa-backward" data-op5e="back" data-tooltip="Back 10 s" aria-label="Back 10 seconds"></button>
      <input type="range" min="0" max="${Math.floor(ps.sound?.duration || 0)}" step="1" value="${Math.floor(pos(ps))}" aria-label="Seek">
      <button type="button" class="inline-control icon fa-solid fa-forward" data-op5e="fwd" data-tooltip="Forward 10 s" aria-label="Forward 10 seconds"></button>`;
    const range = div.querySelector("input");
    div.addEventListener("click", (ev) => { const b = ev.target.closest("button[data-op5e]"); if (b) seekBy(ps, b.dataset.op5e === "back" ? -10 : 10); });
    range.addEventListener("change", () => seek(ps, Number(range.value)));
    row.after(div);
  }
}
const follow = () => {
  for (const range of document.querySelectorAll(".op5e-seek input[type=range]")) {
    if (range.matches(":active")) continue;
    const li = range.closest("li.sound"), ps = game.playlists.get(li?.dataset.playlistId)?.sounds.get(li.dataset.soundId);
    if (!ps?.sound) continue;
    if (ps.sound.duration && Number(range.max) !== Math.floor(ps.sound.duration)) range.max = Math.floor(ps.sound.duration);
    range.value = Math.floor(pos(ps));
  }
};

Hooks.once("init", () => {
  game.settings.register(MODULE, "musicSync", {
    name: "Synchronized music", hint: "The GM's playlist position is sent to players, who skip ahead or back when they drift.",
    scope: "world", config: true, type: Boolean, default: true,
  });
});

Hooks.once("ready", () => {
  game.op5eMusic = { seek, broadcast };
  game.socket.on(EVENT, (msg) => { if (msg?.type === "music-sync" && !game.user.isGM && game.settings.get(MODULE, "musicSync")) correct(msg); });
  if (game.user.isGM) {
    setInterval(broadcast, TICK_MS);
    Hooks.on("updatePlaylistSound", (_ps, change) => { if ("playing" in change || "pausedTime" in change) burst(); });
    Hooks.on("updatePlaylist", burst);
    Hooks.on("renderPlaylistDirectory", (_app, html) => addSeekRows(html instanceof HTMLElement ? html : html[0]));
    setInterval(follow, 1000);
  }
});
