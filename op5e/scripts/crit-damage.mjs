/** dnd5e 5.1.10 CriticalDamageConfiguration — multiplier 2 + powerfulCritical → 1× dice + max(dice). */
export const OP5E_CRITICAL_DAMAGE = Object.freeze({
  powerfulCritical: true,
  multiplier: 2,
});

/**
 * @param {object} critical
 * @returns {object}
 */
export function patchCriticalConfig(critical = {}) {
  critical.powerfulCritical = OP5E_CRITICAL_DAMAGE.powerfulCritical;
  critical.multiplier ??= OP5E_CRITICAL_DAMAGE.multiplier;
  return critical;
}

/**
 * Effective dice count multiplier dnd5e applies in configureDamage (alter(cm) with bonusDice 0).
 *
 * @param {object} critical
 * @returns {number}
 */
export function criticalDiceMultiplier(critical = {}) {
  let cm = critical.multiplier ?? 2;
  if (critical.powerfulCritical) {
    cm = Math.max(1, cm - 1);
  }
  return cm;
}

/**
 * @param {object} rollConfig
 * @param {string} [source]
 */
export function applyOp5eCriticalDamage(rollConfig, source = "unknown") {
  if (!rollConfig || typeof rollConfig !== "object") return;

  rollConfig.critical = patchCriticalConfig(rollConfig.critical ?? {});

  if (Array.isArray(rollConfig.rolls)) {
    for (const roll of rollConfig.rolls) {
      if (!roll || typeof roll !== "object") continue;

      roll.critical = patchCriticalConfig(roll.critical ?? {});

      roll.options ??= {};
      roll.options.critical = patchCriticalConfig(roll.options.critical ?? {});
    }
  }

  return rollConfig;
}

/**
 * @param {object} rollConfig
 * @returns {boolean}
 */
export function looksLikeDamageRollConfig(rollConfig) {
  if (!rollConfig || typeof rollConfig !== "object") return false;
  if (rollConfig.critical && typeof rollConfig.critical === "object") return true;
  if (rollConfig.hookNames?.includes("damage")) return true;
  return Array.isArray(rollConfig.rolls)
    && rollConfig.rolls.some(r => r?.options?.type || r?.options?.types?.length);
}

/**
 * Weapon crit formulas must not double dice (e.g. 1d6+6 → 2d6+6 is wrong for OP5e).
 *
 * @param {string} formula
 * @param {object} [options]
 * @param {string} [options.baseDice="1d6"] Base weapon die expression to guard against doubling.
 * @returns {{ ok: boolean, reason?: string }}
 */
export function assertOp5eCritFormula(formula, { baseDice = "1d6" } = {}) {
  const compact = String(formula ?? "").replace(/\s+/g, "").toLowerCase();
  if (!compact) {
    return { ok: false, reason: "empty formula" };
  }

  const doubled = `2${baseDice.toLowerCase()}`;
  if (compact.includes(doubled)) {
    return { ok: false, reason: `formula contains doubled dice "${doubled}" (${formula})` };
  }

  if (!compact.includes(baseDice.toLowerCase())) {
    return { ok: false, reason: `formula missing base die "${baseDice}" (${formula})` };
  }

  return { ok: true };
}
