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

/** GM helper: jump every client to `seconds` in a playing sound, e.g. game.op5eMusic.seek(game.playlists.getName("Battle").sounds.contents[0], 30). */
async function seek(ps, seconds) {
  if (!game.user.isGM || !ps?.sound?.playing) return;
  await ps.sound.stop({ fade: 0, volume: 0 });
  await ps.sound.play({ offset: seconds, loop: !!ps.repeat, volume: ps.volume, fade: 0 });
  broadcast();
}

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
  }
});
