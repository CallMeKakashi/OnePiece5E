// Token-attached auras (issue #41). When the Aura Effects module is active, the aura features get an "auraeffects.aura" effect: Aura Effects copies its changes
// onto every creature within the radius (10 ft, 30 ft from level 18) and removes them when they leave. The compendium data stays plain on purpose: an effect
// type from a module that is not installed would make the item invalid. disposition: 1 friendly (and yourself), -1 hostile, 0 any.
import { MODULE_ID } from "./constants.mjs";

const RADIUS = "10 + 20 * floor(@details.level / 18)";
const ch = (key, value, mode = 2) => ({ key, mode, value, priority: 20 });
const MIDI = (what) => ch(`flags.midi-qol.${what}`, "1", 5);

export const AURAS = {
  "Aura of Freedom": { disposition: 1, changes: [ch("system.attributes.movement.ignoredDifficultTerrain", "all"), MIDI("advantage.ability.save.all")] },
  "Aura of Courage": { disposition: 1, changes: [ch("system.traits.ci.value", "frightened")] },
  "Aura of Devotion": { disposition: 1, changes: [ch("system.traits.ci.value", "charmed")] },
  "Aura of Tenacity": { disposition: -1, changes: [MIDI("disadvantage.attack.all")] },
};

export const auraEffectData = (name) => {
  const def = AURAS[name]; if (!def) return null;
  return {
    name, img: "icons/svg/aura.svg", type: "auraeffects.aura", transfer: true, changes: def.changes, flags: { [MODULE_ID]: { aura: name } },
    system: { applyToSelf: def.disposition !== -1, distanceFormula: RADIUS, disposition: def.disposition, canStack: false, combatOnly: false, disableOnHidden: false, showRadius: false, collisionTypes: ["move"], opacity: 0.25 },
  };
};

/** Adds the aura effect to an owned feature when it is one of ours and Aura Effects is active. Returns true if one was added. */
export async function addAura(item) {
  if (!game.modules.get("auraeffects")?.active || !item?.parent || item.type !== "feat" || !AURAS[item.name]) return false;
  if (item.effects.some((e) => e.getFlag(MODULE_ID, "aura") === item.name)) return false;
  await item.createEmbeddedDocuments("ActiveEffect", [auraEffectData(item.name)]);
  return true;
}

export function registerAuras() {
  Hooks.on("createItem", (item, _o, userId) => { if (userId === game.user.id) addAura(item).catch((e) => console.error(`${MODULE_ID} | aura failed`, e)); });
  Hooks.once("ready", async () => {   // features already on sheets before Aura Effects was on
    if (!game.user.isGM || !game.modules.get("auraeffects")?.active) return;
    for (const actor of game.actors) for (const item of actor.items) await addAura(item).catch(() => {});
  });
  game.op5eAuras = { addAura, AURAS };
}
