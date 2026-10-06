// Canvas shake and an impact burst for big hits (issue #44). A damage roll at or above the GM's threshold (or a critical hit) shakes every player's canvas and,
// with Sequencer and JB2A, plays an explosion on the target. The shake is a CSS animation on the board, so each player can switch it off in their own settings.
// Also usable from a macro: game.op5eFx.bigHit({ total: 40 }) or game.op5eFx.shake(30, 600).
import { MODULE_ID } from "./constants.mjs";

const SOCKET = `module.${MODULE_ID}`;

/** Shake strength (px) and duration (ms) for a hit of `total` damage. */
export const hitScale = (total) => ({ strength: Math.min(40, Math.round(8 + Math.max(0, total) / 2)), ms: Math.min(1000, 350 + Math.max(0, total) * 8) });

/** Shakes this client's canvas, if the player allows it. */
export function shakeLocal(strength = 20, ms = 500) {
  if (!game.settings.get(MODULE_ID, "bigHitShake")) return;
  const board = document.getElementById("board"); if (!board?.animate) return;
  const frames = [{ transform: "translate(0,0)" }], steps = Math.max(4, Math.round(ms / 45));
  for (let i = 1; i <= steps; i++) { const decay = 1 - i / steps; frames.push({ transform: `translate(${((Math.random() * 2 - 1) * strength * decay).toFixed(1)}px,${((Math.random() * 2 - 1) * strength * decay).toFixed(1)}px)` }); }
  frames.push({ transform: "translate(0,0)" });
  board.animate(frames, { duration: ms, easing: "linear" });
}

/** Shakes every connected client's canvas. */
export function shake(strength = 20, ms = 500) { game.socket.emit(SOCKET, { fx: "shake", strength, ms }); shakeLocal(strength, ms); }

const BURST = "jb2a.explosion.01.orange";
async function burst(token, total) {
  if (!game.modules.get("sequencer")?.active || !globalThis.Sequencer?.Database?.entryExists(BURST) || !token) return;
  const size = total >= 60 ? 6 : total >= 40 ? 4 : 3;
  await new Sequence().effect().file(BURST).atLocation(token).scale(size / 5).play();
}

/** A big hit: shake everyone's canvas and burst on the target. */
export async function bigHit({ total, token = game.user.targets.first() ?? null }) {
  const { strength, ms } = hitScale(total);
  shake(strength, ms);
  await burst(token, total).catch(() => {});
}

export function registerCanvasFx() {
  game.settings.register(MODULE_ID, "bigHitFx", { name: `${MODULE_ID}.settings.bigHitFx.name`, hint: `${MODULE_ID}.settings.bigHitFx.hint`, scope: "world", config: true, type: Boolean, default: true });
  game.settings.register(MODULE_ID, "bigHitThreshold", { name: `${MODULE_ID}.settings.bigHitThreshold.name`, hint: `${MODULE_ID}.settings.bigHitThreshold.hint`, scope: "world", config: true, type: Number, default: 25, range: { min: 5, max: 100, step: 5 } });
  game.settings.register(MODULE_ID, "bigHitShake", { name: `${MODULE_ID}.settings.bigHitShake.name`, hint: `${MODULE_ID}.settings.bigHitShake.hint`, scope: "client", config: true, type: Boolean, default: true });
  Hooks.once("ready", () => game.socket.on(SOCKET, (msg) => { if (msg?.fx === "shake") shakeLocal(msg.strength, msg.ms); }));
  // the player who rolled the damage triggers it once for everybody
  Hooks.on("dnd5e.rollDamageV2", (rolls) => {
    if (!game.settings.get(MODULE_ID, "bigHitFx")) return;
    const total = (rolls ?? []).reduce((n, r) => n + (r.total ?? 0), 0), crit = (rolls ?? []).some((r) => r.isCritical);
    if (total >= game.settings.get(MODULE_ID, "bigHitThreshold") || (crit && total >= 10)) bigHit({ total }).catch(() => {});
  });
  game.op5eFx = { bigHit, shake, shakeLocal, hitScale };
}
