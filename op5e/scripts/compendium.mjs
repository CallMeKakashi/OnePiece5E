import {
  OP5E_CRITICAL_DAMAGE,
  applyOp5eCriticalDamage,
  looksLikeDamageRollConfig,
  patchCriticalConfig,
} from "./crit-damage.mjs";
import { initOp5eAnimations } from "./animations.mjs";
import { MODULE_ID, MODULE_VERSION } from "./constants.mjs";

export { MODULE_ID } from "./constants.mjs";

const DEFAULT_CURRENCY_PER_WEIGHT = { imperial: 50, metric: 110 };
const WEIGHTLESS_CURRENCY_PER_WEIGHT = { imperial: 1_000_000, metric: 1_000_000 };

function applyBerriesCurrency() {
  CONFIG.DND5E.currencies = {
    gp: {
      label: "Berries",
      abbreviation: "ʙ",
      conversion: 1,
      icon: "systems/dnd5e/icons/currency/gold.webp",
    },
  };
  CONFIG.DND5E.defaultCurrency = "gp";
}

function applyBerriesEncumbrance(weightless) {
  CONFIG.DND5E.encumbrance ??= {};
  CONFIG.DND5E.encumbrance.currencyPerWeight ??= {};
  const perWeight = CONFIG.DND5E.encumbrance.currencyPerWeight;
  const values = weightless ? WEIGHTLESS_CURRENCY_PER_WEIGHT : DEFAULT_CURRENCY_PER_WEIGHT;
  perWeight.imperial = values.imperial;
  perWeight.metric = values.metric;
}

function debugCritDamage(...args) {
  try {
    if (game.settings.get(MODULE_ID, "debugCritDamage")) {
      console.log(`${MODULE_ID} | crit damage`, ...args);
    }
  } catch {
    // game.settings unavailable during early init
  }
}

function shouldUseOp5eCriticalDamage() {
  try {
    return !game.settings.get(MODULE_ID, "vanillaCritDoubleDice");
  } catch {
    return true;
  }
}

/**
 * @param {object} rollConfig dnd5e damage roll process configuration
 * @param {string} source hook name for debug logging
 */
function applyOp5eCriticalDamageWithDebug(rollConfig, source = "unknown") {
  if (!shouldUseOp5eCriticalDamage()) return;
  applyOp5eCriticalDamage(rollConfig, source);

  debugCritDamage(source, foundry.utils.deepClone({
    processCritical: rollConfig.critical,
    rolls: rollConfig.rolls?.map(r => ({
      critical: r.critical,
      optionsCritical: r.options?.critical,
    })),
  }));
}

/**
 * Re-apply crit rules after the dialog finalizes (safety net if another module overwrote config).
 *
 * @param {import("systems/dnd5e/module/dice/damage-roll.mjs").default[]} rolls
 * @param {object} rollConfig
 */
function reconfigureCriticalDamageRolls(rolls, rollConfig) {
  if (!shouldUseOp5eCriticalDamage()) return;
  if (!Array.isArray(rolls) || !rollConfig) return;

  const critical = patchCriticalConfig(foundry.utils.deepClone(rollConfig.critical ?? {}));

  for (const roll of rolls) {
    if (!roll?.isCritical) continue;

    for (const term of roll.terms) {
      if ("options" in term && term.options?.baseNumber !== undefined) {
        term.number = term.options.baseNumber;
      }
    }

    roll.options ??= {};
    roll.options.critical = patchCriticalConfig(
      foundry.utils.mergeObject(roll.options.critical ?? {}, critical, { inplace: false })
    );
    roll.options.configured = false;
    roll.options.preprocessed ??= true;
    roll.configureDamage({ critical });
    debugCritDamage("postRollConfiguration", { formula: roll.formula, total: roll.total });
  }
}

/**
 * Align dnd5e's native criticalDamageMaxDice with OP5e crit style (same as powerfulCritical).
 */
async function syncDnd5eCriticalSetting() {
  if (!game.user?.isGM) return;
  try {
    const wantMaxDice = shouldUseOp5eCriticalDamage();
    const current = game.settings.get("dnd5e", "criticalDamageMaxDice");
    if (current !== wantMaxDice) {
      await game.settings.set("dnd5e", "criticalDamageMaxDice", wantMaxDice);
      debugCritDamage("synced dnd5e.criticalDamageMaxDice", wantMaxDice);
    }
  } catch (err) {
    console.warn(`${MODULE_ID} | could not sync dnd5e.criticalDamageMaxDice`, err);
  }
}

/**
 * Patch DamageRoll at the point formulas are built (configureDamage / build / fromConfig).
 * Hooks alone are insufficient: configureDamage merges roll.options.critical when isCritical is set.
 *
 * @returns {boolean}
 */
function patchCriticalDamageSystem() {
  const DamageRoll = CONFIG.Dice?.DamageRoll;
  if (!DamageRoll) return false;

  if (!DamageRoll._op5eConfigurePatched) {
    const originalConfigure = DamageRoll.prototype.configureDamage;
    DamageRoll.prototype.configureDamage = function op5eConfigureDamage(options = {}) {
      if (shouldUseOp5eCriticalDamage() && this.isCritical) {
        options = foundry.utils.deepClone(options);
        options.critical = patchCriticalConfig(options.critical ?? {});
        this.options.critical = patchCriticalConfig(
          foundry.utils.mergeObject(this.options.critical ?? {}, options.critical, { inplace: false })
        );
      }
      return originalConfigure.call(this, options);
    };
    DamageRoll._op5eConfigurePatched = true;
  }

  if (!DamageRoll._op5eFromConfigPatched) {
    const originalFromConfig = DamageRoll.fromConfig;
    DamageRoll.fromConfig = function op5eFromConfig(config, process) {
      if (shouldUseOp5eCriticalDamage() && process) {
        process = foundry.utils.deepClone(process);
        process.critical = patchCriticalConfig(process.critical ?? {});
        if (config?.options) {
          config = foundry.utils.deepClone(config);
          config.options.critical = patchCriticalConfig(config.options.critical ?? {});
        }
      }
      return originalFromConfig.call(this, config, process);
    };
    DamageRoll._op5eFromConfigPatched = true;
  }

  if (!DamageRoll._op5eBuildPatched) {
    const originalBuild = DamageRoll.build;
    DamageRoll.build = async function op5eDamageRollBuild(config = {}, dialog = {}, message = {}) {
      if (shouldUseOp5eCriticalDamage()) {
        applyOp5eCriticalDamageWithDebug(config, "DamageRoll.build");
      }
      return originalBuild.call(this, config, dialog, message);
    };
    DamageRoll._op5eBuildPatched = true;
  }

  return true;
}

Hooks.once("init", () => {
  applyBerriesCurrency();

  game.settings.register(MODULE_ID, "vanillaCritDoubleDice", {
    name: "Use Standard 5e Critical Damage",
    hint:
      "When enabled, critical hits double weapon damage dice (e.g. 1d6+6 becomes 2d6+6). " +
      "When disabled (default), critical hits add the die maximum as a flat bonus instead (e.g. 1d6+6+6).",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(MODULE_ID, "debugCritDamage", {
    name: "Debug Critical Damage Hooks",
    hint: "Log OP5e critical-damage hook activity to the browser console (F12).",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(MODULE_ID, "berriesWeightless", {
    name: `${MODULE_ID}.settings.berriesWeightless.name`,
    hint: `${MODULE_ID}.settings.berriesWeightless.hint`,
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  try {
    applyBerriesEncumbrance(game.settings.get(MODULE_ID, "berriesWeightless"));
  } catch {
    applyBerriesEncumbrance(true);
  }

  CONFIG.DND5E.sourceBooks ??= {};
  CONFIG.DND5E.sourceBooks.OP5e = {
    label: "One Piece 5e",
    abbreviation: "OP5e",
  };
});

Hooks.once("setup", () => {
  if (patchCriticalDamageSystem()) {
    console.log(`${MODULE_ID} v${MODULE_VERSION} loaded, crit patch active`);
  } else {
    console.warn(`${MODULE_ID} v${MODULE_VERSION} loaded, crit patch deferred (DamageRoll missing)`);
  }
});

Hooks.once("ready", async () => {
  applyBerriesEncumbrance(game.settings.get(MODULE_ID, "berriesWeightless"));
  if (!patchCriticalDamageSystem()) {
    console.warn(`${MODULE_ID} v${MODULE_VERSION} ready: crit patch still unavailable`);
  }
  await syncDnd5eCriticalSetting();
  initOp5eAnimations();
});

Hooks.on("settingChange", (moduleId, key, value) => {
  if (moduleId === MODULE_ID && key === "berriesWeightless") {
    applyBerriesEncumbrance(value);
    return;
  }
  if (moduleId === MODULE_ID && key === "vanillaCritDoubleDice") {
    syncDnd5eCriticalSetting();
  }
});

function onPreRollDamage(rollConfig, _dialog, _message, source) {
  try {
    applyOp5eCriticalDamageWithDebug(rollConfig, source);
  } catch (err) {
    console.error(`${MODULE_ID} | crit damage override failed (${source})`, err);
  }
}

Hooks.on("dnd5e.preRollDamage", (rollConfig, dialog, message) => {
  onPreRollDamage(rollConfig, dialog, message, "dnd5e.preRollDamage");
});
Hooks.on("dnd5e.preRollDamageV2", (rollConfig, dialog, message) => {
  onPreRollDamage(rollConfig, dialog, message, "dnd5e.preRollDamageV2");
});

Hooks.on("dnd5e.buildDamageRollConfig", (app, rollConfig, _formData, _index) => {
  try {
    if (!shouldUseOp5eCriticalDamage()) return;
    if (app?.config) app.config.critical = patchCriticalConfig(app.config.critical ?? {});
    if (rollConfig?.options) {
      rollConfig.options.critical = patchCriticalConfig(rollConfig.options.critical ?? {});
    }
  } catch (err) {
    console.error(`${MODULE_ID} | crit damage override failed (buildDamageRollConfig)`, err);
  }
});

Hooks.on("dnd5e.postBuildDamageRollConfig", (processConfig, rollConfig) => {
  try {
    if (!shouldUseOp5eCriticalDamage()) return;
    processConfig.critical = patchCriticalConfig(processConfig.critical ?? {});
    if (rollConfig?.options) {
      rollConfig.options.critical = patchCriticalConfig(rollConfig.options.critical ?? {});
    }
  } catch (err) {
    console.error(`${MODULE_ID} | crit damage override failed (postBuildDamageRollConfig)`, err);
  }
});

Hooks.on("dnd5e.preRoll", (rollConfig) => {
  try {
    if (!looksLikeDamageRollConfig(rollConfig)) return;
    applyOp5eCriticalDamageWithDebug(rollConfig, "dnd5e.preRoll");
  } catch (err) {
    console.error(`${MODULE_ID} | crit damage override failed (preRoll)`, err);
  }
});

Hooks.on("dnd5e.postDamageRollConfiguration", (rolls, rollConfig) => {
  try {
    reconfigureCriticalDamageRolls(rolls, rollConfig);
  } catch (err) {
    console.error(`${MODULE_ID} | crit damage override failed (postDamageRollConfiguration)`, err);
  }
});
