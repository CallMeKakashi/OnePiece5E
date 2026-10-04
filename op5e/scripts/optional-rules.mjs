import { MODULE_ID } from "./constants.mjs";

/**
 * Optional rulings from Sourcebook Appendix B, Suggested Rulings, as world settings (all default OFF).
 * Table-only rulings (Creations and Objects, Allied Space Occupancy, Destroying Special Objects) have no dnd5e hook,
 * so they stay as text in the reference journals.
 */

const KEYS = { crit: "optCriticalSaves", siege: "optSiegeConstructs", strength: "optUnreasonableStrength" };
const on = (k) => {
  try { return !!game.settings.get(MODULE_ID, KEYS[k]); } catch { return false; }
};

function reg(key, name, hint) {
  game.settings.register(MODULE_ID, key, { name, hint, scope: "world", config: true, type: Boolean, default: false });
}

/** Add flat damage to a Midi damage item (the same fields Midi's own modifyDamageBy and applyTokenDamage keep in step). */
function addDamage(ditem, value, type, reason) {
  if (!(value > 0)) return;
  ditem.hpDamage += value;
  if (ditem.newHP !== undefined) ditem.newHP = Math.max(0, ditem.newHP - value);
  ditem.totalDamage = (ditem.totalDamage ?? 0) + value;
  ditem.damageDetail?.push?.({ value, active: { multiplier: 1 }, type, properties: new Set() });
  ditem.details?.push?.(reason);
}

const isSiege = (item) =>
  item?.system?.type?.value === "siege" || /\bsiege\s+(weapon|property)\b/i.test(String(item?.system?.description?.value ?? ""));

const isConstruct = (actor) => actor?.system?.details?.type?.value === "construct";

/** First damage die size of the rolled damage, and the damage type of the first damage detail. */
function damageDie(workflow, ditem) {
  let faces = 0;
  for (const roll of workflow.damageRolls ?? []) {
    for (const t of roll.terms ?? []) if (t.faces) { faces = t.faces; break; }
    if (faces) break;
  }
  const type = ditem.damageDetail?.[0]?.type ?? workflow.damageRolls?.[0]?.options?.type ?? "none";
  return { faces, type };
}

export function registerOptionalRules() {
  reg(KEYS.crit, "Critical saving throws (optional ruling)",
    "Sourcebook, Appendix B, Suggested Rulings: when a creature critically succeeds a saving throw of any kind (natural 20), it automatically succeeds and is unaffected by it completely, be it damage or any other effect. When it critically fails (natural 1), it automatically fails, and if the effect deals damage, it deals an additional damage die. Needs Midi-QOL auto-checked saves; without Midi a chat note is posted instead.");
  reg(KEYS.siege, "Siege against Constructs (optional ruling)",
    "Sourcebook, Appendix B, Suggested Rulings: when a Construct is damaged via the Siege property, it takes an additional 1d8 damage of the damage type. Needs Midi-QOL; applies to weapons of the Siege type or whose text says Siege weapon.");
  reg(KEYS.strength, "Unreasonable Strength (optional ruling)",
    "Sourcebook, Appendix B, Suggested Rulings: multiply the weight a character can carry, push, drag and lift by character level (a 5th-level Fighter with Strength 18 carries 18 x 15 x 5 = 1350 lbs; push, lift and drag are twice that). Racial, class and size modifiers still apply as normal.");

  Hooks.once("setup", () => {
    // Unreasonable Strength: dnd5e maximum capacity = Str x 15 x size x multipliers.maximum, so scale that multiplier by level.
    const proto = CONFIG.Actor.dataModels?.character?.prototype;
    if (proto?.prepareBaseData && !proto.prepareBaseData.__op5eStrength) {
      const original = proto.prepareBaseData;
      const wrapped = function (...args) {
        const out = original.apply(this, args);
        if (on("strength")) {
          const level = Math.max(1, (this.parent?.items ?? []).filter((i) => i.type === "class").reduce((s, c) => s + (Number(c.system?.levels) || 0), 0));
          const m = this.attributes?.encumbrance?.multipliers;
          if (m) m.maximum = String((Number(m.maximum) || 1) * level);
        }
        return out;
      };
      wrapped.__op5eStrength = true;
      proto.prepareBaseData = wrapped;
    }
  });

  // Critical saves, Midi path: after Midi has checked every target's save, force natural 20 / natural 1 outcomes.
  Hooks.on("midi-qol.postCheckSaves", (workflow) => {
    if (!on("crit")) return;
    for (const t of workflow.criticalSaves ?? []) {
      workflow.saves.add(t);
      workflow.failedSaves.delete(t);
      workflow.superSavers.add(t); // saved + super saver = no damage at all
    }
    for (const t of workflow.fumbleSaves ?? []) {
      workflow.saves.delete(t);
      workflow.failedSaves.add(t);
      workflow.superSavers.delete(t); // a fumbled save takes full damage
    }
  });

  // dnd5e path (Midi inactive): the roll cannot be intercepted, so only announce the outcome.
  Hooks.on("dnd5e.rollSavingThrow", (rolls, { ability, subject } = {}) => {
    if (!on("crit") || game.modules.get("midi-qol")?.active) return;
    const roll = rolls?.[0];
    const text = roll?.isCritical ? "critical success: automatically succeeds and is unaffected completely"
      : roll?.isFumble ? "critical failure: automatically fails, and if it deals damage, it deals an additional damage die" : "";
    if (!text) return;
    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: subject }), content: `<p><strong>${subject?.name ?? "Creature"}</strong> ${CONFIG.DND5E?.abilities?.[ability]?.label ?? ability} save, ${text} (Critical Saving Throws ruling).</p>` });
  });

  // Extra damage per target: fumbled saves (+1 damage die) and Siege vs Constructs (+1d8).
  Hooks.on("midi-qol.preTargetDamageApplication", async (token, { workflow, ditem } = {}) => {
    if (!workflow || !ditem || !(ditem.hpDamage > 0)) return;
    if (on("crit") && workflow.fumbleSaves?.has?.(token)) {
      const { faces, type } = damageDie(workflow, ditem);
      if (faces) addDamage(ditem, (await new Roll(`1d${faces}`).evaluate()).total, type, `Critical save failure: +1d${faces}`);
    }
    if (on("siege") && isSiege(workflow.item) && isConstruct(token.actor)) {
      const { type } = damageDie(workflow, ditem);
      addDamage(ditem, (await new Roll("1d8").evaluate()).total, type, "Siege against Constructs: +1d8");
    }
  });
}
