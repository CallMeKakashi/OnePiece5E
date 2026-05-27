const MODULE_ID = "op5e-compendium-test";
const COMPENDIUM_ID = "op5e-compendium";
const BASE_FORMULA = "1d6+6";
const BASE_DICE = "1d6";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function compactFormula(formula) {
  return String(formula ?? "").replace(/\s+/g, "").toLowerCase();
}

function assertOp5eCritFormula(formula, { baseDice = BASE_DICE } = {}) {
  const compact = compactFormula(formula);
  assert(compact, "empty formula");

  const doubled = `2${baseDice.toLowerCase()}`;
  assert(
    !compact.includes(doubled),
    `OP5e crit must not double weapon dice (got "${doubled}" in ${formula})`
  );
  assert(
    compact.includes(baseDice.toLowerCase()),
    `expected base die "${baseDice}" in formula (${formula})`
  );
}

function getDamageRollClass() {
  return CONFIG.Dice?.DamageRoll;
}

function freshCriticalRoll(formula = BASE_FORMULA, critical = {}) {
  const DamageRoll = getDamageRollClass();
  assert(DamageRoll, "CONFIG.Dice.DamageRoll unavailable — is dnd5e active?");

  const roll = new DamageRoll(formula, {}, {
    isCritical: true,
    configured: false,
    preprocessed: false,
  });
  roll.configureDamage({ critical });
  return roll;
}

async function withVanillaCritSetting(enabled, fn) {
  const prior = game.settings.get(COMPENDIUM_ID, "vanillaCritDoubleDice");
  if (prior !== enabled) {
    await game.settings.set(COMPENDIUM_ID, "vanillaCritDoubleDice", enabled);
  }
  try {
    return await fn();
  } finally {
    if (prior !== enabled) {
      await game.settings.set(COMPENDIUM_ID, "vanillaCritDoubleDice", prior);
    }
  }
}

export async function runCritConfigureDamageTest() {
  const DamageRoll = getDamageRollClass();
  assert(DamageRoll?._op5eConfigurePatched, "op5e-compendium crit patch not applied on DamageRoll");

  return withVanillaCritSetting(false, async () => {
    const roll = freshCriticalRoll();
    assertOp5eCritFormula(roll.formula);

    const diceTerm = roll.terms.find(t => t?.faces === 6 && t?.number !== undefined);
    assert(diceTerm, "expected a d6 DiceTerm in roll");
    assert(diceTerm.number === 1, `weapon die count should stay 1, got ${diceTerm.number}`);

    return {
      passed: true,
      message: `Critical ${BASE_FORMULA} → "${roll.formula}" (one d6, not 2d6)`,
      formula: roll.formula,
    };
  });
}

export async function runCritVanillaContrastTest() {
  return withVanillaCritSetting(true, async () => {
    const roll = freshCriticalRoll(BASE_FORMULA, {
      powerfulCritical: false,
      multiplier: 2,
    });
    const compact = compactFormula(roll.formula);
    assert(
      compact.includes("2d6"),
      `vanilla 5e crit should double dice to 2d6 (got "${roll.formula}")`
    );

    return {
      passed: true,
      message: `Vanilla setting doubles dice: "${roll.formula}"`,
      formula: roll.formula,
    };
  });
}

export async function runCritDamageRollBuildTest() {
  const DamageRoll = getDamageRollClass();
  assert(DamageRoll, "CONFIG.Dice.DamageRoll unavailable");

  return withVanillaCritSetting(false, async () => {
    const rolls = await DamageRoll.build({
      isCritical: true,
      critical: {},
      rolls: [{ parts: [BASE_FORMULA], options: { isCritical: true } }],
    }, { configure: false }, { create: false });

    assert(Array.isArray(rolls) && rolls.length, "DamageRoll.build returned no rolls");
    const roll = rolls[0];
    assertOp5eCritFormula(roll.formula);

    return {
      passed: true,
      message: `DamageRoll.build crit → "${roll.formula}"`,
      formula: roll.formula,
    };
  });
}

export async function runCritDamageTests() {
  const results = [];
  const tests = [
    ["configureDamage crit (OP5e)", runCritConfigureDamageTest],
    ["DamageRoll.build crit (OP5e)", runCritDamageRollBuildTest],
    ["vanilla contrast (2d6)", runCritVanillaContrastTest],
  ];

  for (const [label, fn] of tests) {
    try {
      const result = await fn();
      results.push({ label, ok: true, message: result.message, formula: result.formula });
      ui.notifications?.info(`${MODULE_ID}: PASS — ${label}`);
      console.log(`${MODULE_ID} | PASS — ${label}: ${result.message}`);
    } catch (err) {
      results.push({ label, ok: false, message: err.message ?? String(err) });
      ui.notifications?.error(`${MODULE_ID}: FAIL — ${label}: ${err.message ?? err}`);
      console.error(`${MODULE_ID} | FAIL — ${label}`, err);
    }
  }

  const passed = results.filter(r => r.ok).length;
  const summary = `${passed}/${results.length} crit damage tests passed`;
  ui.notifications?.info(`${MODULE_ID}: ${summary}`);
  console.table(results);
  return { summary, results };
}
