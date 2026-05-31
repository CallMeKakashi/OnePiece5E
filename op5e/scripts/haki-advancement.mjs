import { MODULE_ID } from "./constants.mjs";
import {
  collectPriorHakiSlugsForChoiceLevel,
  filterHakiPoolForAdvancementStep,
  getAvailableHakiUuids,
  hakiSlugFromItem,
  isHakiItemChoiceConfig,
} from "./haki-advancement-lib.mjs";

const ORIGINAL_POOL_KEY = Symbol.for(`${MODULE_ID}.hakiOriginalPool`);

/** @type {object|null} */
let activeAdvancementManager = null;

/**
 * @param {object} manager dnd5e AdvancementManager
 */
function filterCurrentHakiStepPool(manager) {
  const step = manager?.step;
  const config = step?.advancement?.configuration;
  if (!isHakiItemChoiceConfig(config)) return;

  if (!config[ORIGINAL_POOL_KEY]) {
    config[ORIGINAL_POOL_KEY] = foundry.utils.deepClone(config.pool ?? []);
  }

  config.pool = filterHakiPoolForAdvancementStep(
    config[ORIGINAL_POOL_KEY],
    manager,
    step.advancement.level,
  );
}

/**
 * @param {object} manager
 */
function onPreAdvancementManagerRender(manager) {
  activeAdvancementManager = manager;
  filterCurrentHakiStepPool(manager);
}

function onAdvancementManagerComplete() {
  activeAdvancementManager = null;
}

/**
 * @param {object} actor
 * @param {number} choiceLevel
 * @param {object[]} toCreate
 * @returns {boolean}
 */
function validateHakiAdvancementGrants(actor, choiceLevel, toCreate) {
  const manager = activeAdvancementManager;
  const prior = collectPriorHakiSlugsForChoiceLevel(manager, choiceLevel);
  const validUuids = getAvailableHakiUuids(prior);

  for (const itemData of toCreate ?? []) {
    const slug = hakiSlugFromItem(itemData);
    if (!slug) continue;

    const uuid = itemData.flags?.dnd5e?.sourceId ?? itemData._stats?.compendiumSource;
    if (uuid && !validUuids.has(uuid)) {
      ui.notifications?.error(
        game.i18n.localize(`${MODULE_ID}.hakiAdvancement.invalidChoice`),
      );
      return false;
    }
  }

  return true;
}

/**
 * @param {object} updates
 * @param {object[]} toCreate
 * @param {object[]} _toUpdate
 * @param {string[]} _toDelete
 */
function onPreCommitAdvancementUpdates(updates, toCreate, _toUpdate, _toDelete) {
  const manager = activeAdvancementManager;
  const step = manager?.step;
  const config = step?.advancement?.configuration;
  if (!isHakiItemChoiceConfig(config)) return;

  const actor = manager?.clone ?? manager?.actor;
  if (!actor) return;

  if (!validateHakiAdvancementGrants(actor, step.advancement.level, toCreate)) {
    return false;
  }
}

export function registerOp5eHakiAdvancementHooks() {
  Hooks.on("dnd5e.preAdvancementManagerRender", onPreAdvancementManagerRender);
  Hooks.on("dnd5e.advancementManagerComplete", onAdvancementManagerComplete);
  Hooks.on("dnd5e.preCommitAdvancementUpdates", onPreCommitAdvancementUpdates);

  console.log(`${MODULE_ID} | Haki advancement hooks registered (branching pool filter)`);
}
