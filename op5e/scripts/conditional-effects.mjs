// Conditional effects (issue #46), the dnd5e 6 idea built on 5.3: an effect with flags.op5e.condition = a formula (for example "@attributes.hp.value < @attributes.hp.max / 2")
// switches itself on while the formula is true and off while it is false. Evaluated against the owner's roll data whenever the character or its items change.
// Put the flag on any effect, on a character or on one of its items. Also: game.op5eConditions.refresh(actor).
import { MODULE_ID } from "./constants.mjs";

/** True/false for a condition formula against some roll data; anything that does not evaluate counts as false. The evaluator is injectable for tests. */
export function evaluateCondition(formula, rollData, safeEval = (f) => Roll.safeEval(f), replace = (f, d) => Roll.replaceFormulaData(f, d, { missing: "0" })) {
  try { return !!safeEval(replace(String(formula), rollData)); } catch { return false; }
}

const flagged = (actor) => [...actor.effects, ...actor.items.flatMap((i) => [...i.effects])].filter((e) => e.getFlag(MODULE_ID, "condition"));

/** Switches every conditional effect on the actor to match its formula. Returns how many changed. */
export async function refresh(actor) {
  if (!actor || !actor.isOwner) return 0;
  const rollData = actor.getRollData(); let n = 0;
  for (const fx of flagged(actor)) {
    const on = evaluateCondition(fx.getFlag(MODULE_ID, "condition"), rollData);
    if (fx.disabled === on) { await fx.update({ disabled: !on }); n++; }
  }
  return n;
}

const timers = new Map();
const queue = (actor) => {
  if (!actor || !flagged(actor).length) return;
  clearTimeout(timers.get(actor.id));
  timers.set(actor.id, setTimeout(() => refresh(actor).catch((e) => console.error(`${MODULE_ID} | conditional effect failed`, e)), 250));
};

export function registerConditionalEffects() {
  Hooks.on("updateActor", (actor) => queue(actor));
  for (const h of ["createItem", "updateItem", "deleteItem"]) Hooks.on(h, (item) => queue(item.parent));
  Hooks.on("createActiveEffect", (fx) => { const a = fx.parent?.documentName === "Item" ? fx.parent.parent : fx.parent; if (fx.getFlag(MODULE_ID, "condition")) queue(a); });
  game.op5eConditions = { refresh, evaluateCondition };
}
