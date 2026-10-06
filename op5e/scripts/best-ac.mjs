// Best armor class (issue #46), the dnd5e 6 idea built on 5.3: with the world setting on, a character automatically uses whichever armor class calculation gives the
// highest number (armor, unarmored defense, mage armor ...). dnd5e 5.3 only lets you pick one calculation by hand and computes AC in one static function with no hook,
// so op5e computes the value under every calculation on a clone whenever armor, class features or effects change, and switches the actor to the best one.
import { MODULE_ID } from "./constants.mjs";

/** Picks the calculation key with the highest AC; on a tie the current one stays (so nothing flips back and forth). */
export function pickBest(results, current) {
  let best = null;
  for (const [key, ac] of Object.entries(results)) if (best === null || ac > results[best] || (ac === results[best] && key === current)) best = key;
  return best;
}

const timers = new Map();
const FIXED = ["flat", "custom", "natural"];
const candidates = () => Object.keys(CONFIG.DND5E.armorClasses).filter((k) => !FIXED.includes(k));

/** Computes the best calculation for one character and switches to it. Returns the key now in use, or null if nothing changed. */
export async function applyBestAc(actor) {
  if (!actor || actor.type !== "character" || !actor.isOwner) return null;
  const current = actor.system.attributes.ac.calc;
  if (FIXED.includes(current)) return null;   // a hand-set flat, custom or natural AC is the player's choice
  const results = {};
  for (const key of candidates()) {
    const clone = actor.clone({ "system.attributes.ac.calc": key }, { keepId: true });
    results[key] = clone.system.attributes.ac.value;
  }
  const best = pickBest(results, current);
  if (!best || best === current) return null;
  await actor.update({ "system.attributes.ac.calc": best });
  return best;
}

const queue = (actor) => {
  if (!game.settings.get(MODULE_ID, "bestAc") || actor?.type !== "character") return;
  clearTimeout(timers.get(actor.id));
  timers.set(actor.id, setTimeout(() => applyBestAc(actor).catch((e) => console.error(`${MODULE_ID} | best AC failed`, e)), 400));
};

export function registerBestAc() {
  game.settings.register(MODULE_ID, "bestAc", { name: `${MODULE_ID}.settings.bestAc.name`, hint: `${MODULE_ID}.settings.bestAc.hint`, scope: "world", config: true, type: Boolean, default: false });
  Hooks.on("updateActor", (actor, changes) => { if (changes.system?.abilities || changes.system?.details) queue(actor); });
  for (const h of ["createItem", "updateItem", "deleteItem"]) Hooks.on(h, (item) => queue(item.parent));
  for (const h of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) Hooks.on(h, (fx) => queue(fx.parent?.documentName === "Item" ? fx.parent.parent : fx.parent));
  game.op5eBestAc = { applyBestAc, pickBest };
}
