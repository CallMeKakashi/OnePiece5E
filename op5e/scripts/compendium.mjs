import { initOp5eAnimations } from "./animations.mjs";
import { applyOp5eCriticalDamage, looksLikeDamageRollConfig } from "./crit-damage.mjs";
import { MODULE_ID, MODULE_VERSION } from "./constants.mjs";
import { registerOp5eFeatureHooks } from "./feature-hooks.mjs";
import { registerOp5eEquipmentGrantHooks } from "./equipment-grant-advancement.mjs";
import { initSkillsAndTools } from "./skills-and-tools.mjs";
import { registerOptionalRules } from "./optional-rules.mjs";

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

Hooks.once("init", () => {
  applyBerriesCurrency();
  initSkillsAndTools();
  registerOptionalRules();

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

  // Homebrew tools: register as dnd5e tool ids so "tool:dial" etc. are valid proficiency keys.
  CONFIG.DND5E.tools ??= {};
  Object.assign(CONFIG.DND5E.tools, {
    dial: { ability: "int", id: "Compendium.op5e.items.Item.fb24d51356cb6401" },
    appraiser: { ability: "int", id: "Compendium.op5e.items.Item.df75cb11f0029ff4" },
    fishing: { ability: "wis", id: "Compendium.op5e.items.Item.859c52e5b4fa8cef" },
  });

  CONFIG.DND5E.sourceBooks ??= {};
  CONFIG.DND5E.sourceBooks.OP5e = {
    label: "One Piece 5e",
    abbreviation: "OP5e",
  };
});

Hooks.once("setup", () => {
  registerOp5eFeatureHooks();
  registerOp5eEquipmentGrantHooks();
});

Hooks.once("ready", async () => {
  applyBerriesEncumbrance(game.settings.get(MODULE_ID, "berriesWeightless"));
  initOp5eAnimations();
});

Hooks.on("settingChange", (moduleId, key, value) => {
  if (moduleId === MODULE_ID && key === "berriesWeightless") {
    applyBerriesEncumbrance(value);
  }
});
/** OP5e criticals keep one set of dice plus max dice (no doubling); see crit-damage.mjs. */
function onPreRollDamage(rollConfig, _dialog, _message, source) {
  try {
    if (looksLikeDamageRollConfig(rollConfig)) applyOp5eCriticalDamage(rollConfig, source);
  } catch (err) {
    console.error(`${MODULE_ID} | crit damage override failed (${source})`, err);
  }
}

Hooks.on("dnd5e.preRollDamageV2", (rollConfig, dialog, message) => {
  onPreRollDamage(rollConfig, dialog, message, "dnd5e.preRollDamageV2");
});

