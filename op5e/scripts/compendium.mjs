import { initOp5eAnimations, registerOp5eAnimationsAutorec } from "./animations.mjs";
import { applyOp5eCriticalDamage, looksLikeDamageRollConfig } from "./crit-damage.mjs";
import { MODULE_ID, MODULE_VERSION } from "./constants.mjs";
import { registerOp5eFeatureHooks } from "./feature-hooks.mjs";
import { registerOp5eEquipmentGrantHooks } from "./equipment-grant-advancement.mjs";
import { initSkillsAndTools } from "./skills-and-tools.mjs";
import { registerOptionalRules } from "./optional-rules.mjs";
import { registerImportJournals } from "./import-journals.mjs";
import { registerImportOldCharacter } from "./import-old-character.mjs";
import { registerFruitCasting } from "./fruit-casting.mjs";
import { registerFalling } from "./falling.mjs";
import { registerAuras } from "./auras.mjs";
import { registerCanvasFx } from "./canvas-fx.mjs";
import { registerExtraSources } from "./extra-sources.mjs";
import { registerBestAc } from "./best-ac.mjs";
import { registerConditionalEffects } from "./conditional-effects.mjs";
import { registerCompactChat } from "./compact-chat.mjs";
import { initShop, readyShop } from "./shop/shop.mjs";
import { registerSelfUpdate } from "./self-update.mjs";
import { registerHealthCheck } from "./health-check.mjs";
import { registerMcpApi } from "./mcp-api.mjs";
import { registerRefreshActor } from "./refresh-actor.mjs";
import { registerWorldPackSync } from "./world-pack-sync.mjs";

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
  registerImportJournals();
  registerRefreshActor();
  registerImportOldCharacter();
  registerMcpApi();
  registerFruitCasting();
  registerFalling();
  registerAuras();
  registerCanvasFx();
  registerExtraSources();
  registerBestAc();
  registerConditionalEffects();
  registerCompactChat();
  initShop();
  registerSelfUpdate();
  registerHealthCheck();
  registerWorldPackSync();

  game.settings.register(MODULE_ID, "berriesWeightless", {
    name: `${MODULE_ID}.settings.berriesWeightless.name`,
    hint: `${MODULE_ID}.settings.berriesWeightless.hint`,
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  registerOp5eAnimationsAutorec();

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
  // dnd5e's sourceBooks maps a key to a plain label string (an object here made its pre-localizer log an error on every load)
  CONFIG.DND5E.sourceBooks.OP5e = "One Piece 5e";
});

Hooks.once("setup", () => {
  registerOp5eFeatureHooks();
  registerOp5eEquipmentGrantHooks();
});

Hooks.once("ready", async () => {
  readyShop();
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


// Zoan Hybrid/Full Beast Form last 10 minutes, 1 hour at 5th level, 8 hours at 10th, 24 hours at 15th and unlimited at 20th.
// The effect ships with 10 minutes; set the real length from the actor's level when it lands on the actor.
const SIZES = ["tiny", "sm", "med", "lg", "huge", "grg"];
Hooks.on("preCreateActiveEffect", (effect) => {
  if (!(effect.parent instanceof Actor)) return;
  // Zoan Enhanced Form: one size category bigger while it lasts
  if (effect.getFlag?.(MODULE_ID, "sizeUp")) {
    const next = SIZES[Math.min(SIZES.indexOf(effect.parent.system.traits?.size ?? "med") + 1, SIZES.length - 1)];
    effect.updateSource({ changes: [...effect.changes, { key: "system.traits.size", mode: 5, value: next }] });
  }
  if (!effect.getFlag?.(MODULE_ID, "levelDuration")) return;
  const level = effect.parent.system.details?.level ?? 1;
  const hours = [[20, 8760], [15, 24], [10, 8], [5, 1]].find(([l]) => level >= l)?.[1] ?? 1 / 6;
  effect.updateSource({ "duration.seconds": Math.round(hours * 3600) });
});

// Sulong ends: one level of exhaustion (only the client that removed the effect applies it)
Hooks.on("deleteActiveEffect", (effect, _options, userId) => {
  if (userId !== game.user.id || !effect.getFlag?.(MODULE_ID, "exhaustOnEnd") || !(effect.parent instanceof Actor)) return;
  const a = effect.parent;
  a.update({ "system.attributes.exhaustion": Math.min((a.system.attributes.exhaustion ?? 0) + 1, 6) });
});

// Zoan Full Beast Form (a dnd5e transform activity tagged "op5e:hpmult:N"): hit points are N x level + the beast's Con modifier
Hooks.on("dnd5e.transformActorV2", (actor, source, data, settings) => {
  const mult = [...(settings.other ?? [])].map((x) => /^op5e:hpmult:(\d+)$/.exec(x)?.[1]).find(Boolean);
  if (!mult) return;
  const hp = Number(mult) * (actor.system.details?.level ?? 1) + (source.system.abilities?.con?.mod ?? 0);
  data.system.attributes.hp = { ...data.system.attributes.hp, value: hp, max: hp, temp: 0, tempmax: 0 };
});
