import { MODULE_ID } from "./constants.mjs";
import {
  OP5E_CREATION_IDS,
  OP5E_FEATURE_IDS,
  OP5E_FLAMING_DUALITY_ACTIVITY_IDS,
} from "./feature-ids.mjs";

export const FLAMING_DUALITY_FORM = Object.freeze({
  IGNITED: "ignited",
  GODSPEED: "godspeed",
});

/** Damage types for Improved Ignite (all except psychic). */
export const IMPROVED_IGNITE_DAMAGE_TYPES = Object.freeze([
  "acid",
  "bludgeoning",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "piercing",
  "poison",
  "radiant",
  "slashing",
  "thunder",
]);

const IGNITED_BASE_DAMAGE_TYPES = Object.freeze(["bludgeoning", "piercing", "slashing"]);

export const FLAMING_DUALITY_DURATION_SECONDS = 60;
export const BUBBLE_FLOATER_DURATION_SECONDS = 8 * 60 * 60;
export const INNER_BEAST_DURATION_SECONDS = 60;

/** Conditions that suppress Danger Sense Dex-save advantage. */
export const DANGER_SENSE_BLOCKING_STATUSES = Object.freeze([
  "blinded",
  "deafened",
  "incapacitated",
]);

/**
 * @param {Iterable<string>|undefined} statuses
 * @returns {boolean}
 */
export function hasDangerSenseBlockingStatus(statuses) {
  if (!statuses) return false;
  for (const id of statuses) {
    if (DANGER_SENSE_BLOCKING_STATUSES.includes(id)) return true;
  }
  return false;
}

/**
 * @param {object|null|undefined} actor Foundry Actor5e-like
 * @returns {boolean}
 */
export function actorHasBlockingConditionForDangerSense(actor) {
  if (!actor) return true;
  if (hasDangerSenseBlockingStatus(actor.statuses)) return true;
  const conditions = actor.system?.conditions;
  if (Array.isArray(conditions)) {
    const ids = conditions.map(c => (typeof c === "string" ? c : c?.id)).filter(Boolean);
    if (hasDangerSenseBlockingStatus(ids)) return true;
  }
  return false;
}

/**
 * @param {object|null|undefined} actor
 * @param {string} featureId
 * @returns {boolean}
 */
export function actorHasFeatureById(actor, featureId) {
  if (!actor?.items) return false;
  return actor.items.some(item => item.id === featureId || item._id === featureId);
}

/**
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function actorHasDangerSense(actor) {
  return actorHasFeatureById(actor, OP5E_FEATURE_IDS.dangerSense);
}

/**
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function actorHasDiamondSoul(actor) {
  return actorHasFeatureById(actor, OP5E_FEATURE_IDS.diamondSoul);
}

/**
 * Apply advantage to all rolls in an ability-save process config (dnd5e 5.1+).
 *
 * @param {object} config AbilityRollProcessConfiguration
 */
export function applyDexSaveAdvantage(config) {
  if (!config || typeof config !== "object") return;

  config.rolls ??= [{}];
  if (!Array.isArray(config.rolls) || config.rolls.length === 0) {
    config.rolls = [{}];
  }

  for (const roll of config.rolls) {
    roll.options ??= {};
    if (roll.options.disadvantage) continue;
    roll.options.advantage = true;
  }
}

/**
 * @param {object} config
 * @param {string} ability
 * @returns {boolean}
 */
export function shouldApplyDangerSenseDexAdvantage(config, ability) {
  if (ability !== "dex") return false;
  const subject = config?.subject ?? config?.actor;
  if (!actorHasDangerSense(subject)) return false;
  if (actorHasBlockingConditionForDangerSense(subject)) return false;
  return true;
}

/**
 * @param {object[]} rolls D20Roll[]
 * @param {number|undefined} dc
 * @returns {boolean}
 */
export function savingThrowFailed(rolls, dc) {
  if (dc === undefined || dc === null || Number.isNaN(Number(dc))) return false;
  const roll = rolls?.[0];
  if (!roll || typeof roll.total !== "number") return false;
  return roll.total < Number(dc);
}

/**
 * @param {object|null|undefined} item Spirit feature item
 * @returns {number|null} remaining uses, or null if unavailable
 */
export function getSpiritUsesRemaining(item) {
  const value = item?.system?.uses?.value;
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * @param {object|null|undefined} actor
 * @returns {object|null} Spirit item on actor
 */
export function findSpiritItem(actor) {
  if (!actor?.items) return null;
  return actor.items.find(i => i.id === OP5E_FEATURE_IDS.spirit || i._id === OP5E_FEATURE_IDS.spirit) ?? null;
}

/**
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function canSpendSpiritPoint(actor) {
  const spirit = findSpiritItem(actor);
  const remaining = getSpiritUsesRemaining(spirit);
  return remaining !== null && remaining > 0;
}

/**
 * @param {object|null|undefined} actor
 * @returns {{ experimental: object|null, combat: object|null }}
 */
export function findExperimentalMedicinePair(actor) {
  if (!actor?.items) return { experimental: null, combat: null };
  const experimental =
    actor.items.find(i => i.id === OP5E_FEATURE_IDS.experimentalMedicine) ?? null;
  const combat =
    actor.items.find(i => i.id === OP5E_FEATURE_IDS.combatMedicine) ?? null;
  return { experimental, combat };
}

/**
 * @param {string} itemId
 * @returns {boolean}
 */
export function isExperimentalMedicinePoolItem(itemId) {
  return (
    itemId === OP5E_FEATURE_IDS.experimentalMedicine
    || itemId === OP5E_FEATURE_IDS.combatMedicine
  );
}

/** @param {string} itemId */
export function isExperimentalMedicineItem(itemId) {
  return itemId === OP5E_FEATURE_IDS.experimentalMedicine;
}

/**
 * Field Surgeons with Combat Medicine should activate that item instead of base EM.
 *
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function shouldRedirectExperimentalMedicineToCombat(actor) {
  const { experimental, combat } = findExperimentalMedicinePair(actor);
  return Boolean(experimental && combat);
}

/**
 * @param {object|null|undefined} actor
 * @returns {object|null}
 */
export function getCombatMedicineRedirectTarget(actor) {
  return findExperimentalMedicinePair(actor).combat;
}

export const RELENTLESS_RAGE_BASE_DC = 10;
export const RELENTLESS_RAGE_DC_STEP = 5;

/**
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function actorHasRelentlessRage(actor) {
  return actorHasFeatureById(actor, OP5E_FEATURE_IDS.relentlessRage);
}

/**
 * @param {number|null|undefined} stored
 * @returns {number}
 */
export function resolveRelentlessRageDc(stored) {
  const n = Number(stored);
  return Number.isFinite(n) && n >= RELENTLESS_RAGE_BASE_DC ? n : RELENTLESS_RAGE_BASE_DC;
}

/**
 * @param {number} currentDc
 * @returns {number}
 */
export function nextRelentlessRageDc(currentDc) {
  return resolveRelentlessRageDc(currentDc) + RELENTLESS_RAGE_DC_STEP;
}

/**
 * @param {object|null|undefined} actor
 * @returns {number}
 */
export function getRelentlessRageDcFromActor(actor) {
  return resolveRelentlessRageDc(actor?.flags?.op5e?.relentlessRageDc);
}

/**
 * Detect raging via dnd5e statuses or an active effect tied to the Rage feature.
 *
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function actorIsRaging(actor) {
  if (!actor) return false;

  if (typeof actor.statuses?.has === "function" && actor.statuses.has("rage")) return true;
  if (Array.isArray(actor.statuses) && actor.statuses.includes("rage")) return true;

  for (const effect of actor.effects ?? []) {
    if (effect.disabled || effect.active === false) continue;
    const origin = String(effect.origin ?? effect.flags?.origin ?? "");
    if (origin.includes(OP5E_FEATURE_IDS.rage)) return true;
    if (String(effect.name ?? "").toLowerCase() === "rage") return true;
  }

  return false;
}

/**
 * @param {number} hpChange negative when damaged
 * @param {number} hpAfter actor HP after the update applied
 * @returns {boolean}
 */
export function droppedToZeroHitPoints(hpChange, hpAfter) {
  return hpChange < 0 && hpAfter === 0;
}

/**
 * @param {object|null|undefined} actor
 * @param {number} hpChange
 * @param {number} hpAfter
 * @returns {boolean}
 */
export function shouldOfferRelentlessRage(actor, hpChange, hpAfter) {
  if (!actorHasRelentlessRage(actor)) return false;
  if (!actorIsRaging(actor)) return false;
  return droppedToZeroHitPoints(hpChange, hpAfter);
}

/**
 * @param {object|null|undefined} actor
 * @returns {number}
 */
export function getActorCharacterLevel(actor) {
  if (!actor) return 1;
  const detailLevel = Number(actor.system?.details?.level);
  if (Number.isFinite(detailLevel) && detailLevel > 0) return detailLevel;

  let total = 0;
  for (const item of actor.items ?? []) {
    if (item.type !== "class") continue;
    const levels = Number(item.system?.levels);
    if (Number.isFinite(levels)) total += levels;
  }
  return total > 0 ? total : 1;
}

/**
 * @param {string} itemId
 * @returns {boolean}
 */
export function isFlamingDualityItem(itemId) {
  return itemId === OP5E_FEATURE_IDS.flamingDuality;
}

/**
 * @param {object|null|undefined} activity
 * @returns {string|null}
 */
export function getFlamingDualityFormFromActivity(activity) {
  const id = activity?.id ?? activity?._id ?? "";
  if (id === OP5E_FLAMING_DUALITY_ACTIVITY_IDS.ignited) {
    return FLAMING_DUALITY_FORM.IGNITED;
  }
  if (id === OP5E_FLAMING_DUALITY_ACTIVITY_IDS.godspeed) {
    return FLAMING_DUALITY_FORM.GODSPEED;
  }
  return null;
}

/**
 * @param {string} itemId
 * @returns {boolean}
 */
export function isFlameInvestureItem(itemId) {
  return itemId === OP5E_FEATURE_IDS.flameInvesture;
}

/**
 * @param {string} itemId
 * @returns {boolean}
 */
export function isRageItem(itemId) {
  return itemId === OP5E_FEATURE_IDS.rage;
}

/**
 * @param {string} itemId
 * @returns {boolean}
 */
export function isInnerBeastItem(itemId) {
  return itemId === OP5E_FEATURE_IDS.innerBeast;
}

/**
 * @param {string} itemId
 * @returns {boolean}
 */
export function isBubbleFloaterItem(itemId) {
  return itemId === OP5E_FEATURE_IDS.bubbleFloater;
}

/**
 * @param {string} itemId
 * @returns {boolean}
 */
export function isGiantsEnduranceItem(itemId) {
  return itemId === OP5E_FEATURE_IDS.giantsEndurance;
}

/**
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function actorHasUltimateDuality(actor) {
  return actorHasFeatureById(actor, OP5E_FEATURE_IDS.ultimateDuality);
}

/**
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function actorHasImprovedIgnite(actor) {
  return actorHasFeatureById(actor, OP5E_FEATURE_IDS.improvedIgnite);
}

/**
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function actorHasEmpoweredGodspeed(actor) {
  return actorHasFeatureById(actor, OP5E_FEATURE_IDS.empoweredGodspeed);
}

/**
 * @param {object|null|undefined} effect
 * @returns {string|null}
 */
export function getFlamingDualityFormFromEffect(effect) {
  const form = effect?.flags?.[MODULE_ID]?.flamingDualityForm;
  return form === FLAMING_DUALITY_FORM.IGNITED || form === FLAMING_DUALITY_FORM.GODSPEED
    ? form
    : null;
}

/**
 * @param {object|null|undefined} actor
 * @returns {object|null}
 */
export function findFlamingDualityEffect(actor) {
  if (!actor?.effects) return null;
  return (
    actor.effects.find(
      e =>
        !e.disabled
        && (e.active === undefined || e.active !== false)
        && getFlamingDualityFormFromEffect(e),
    ) ?? null
  );
}

/**
 * @param {object|null|undefined} actor
 * @returns {string|null}
 */
export function getActiveFlamingDualityForm(actor) {
  return getFlamingDualityFormFromEffect(findFlamingDualityEffect(actor));
}

/**
 * @param {object|null|undefined} actor
 * @param {string} form
 * @returns {object[]}
 */
export function buildFlamingDualityChanges(actor, form) {
  const changes = [];

  if (form === FLAMING_DUALITY_FORM.IGNITED) {
    const types = actorHasImprovedIgnite(actor)
      ? IMPROVED_IGNITE_DAMAGE_TYPES
      : IGNITED_BASE_DAMAGE_TYPES;
    for (const type of types) {
      changes.push({ key: "system.traits.dr.value", mode: 0, value: type, priority: 20 });
    }
    return changes;
  }

  if (form === FLAMING_DUALITY_FORM.GODSPEED) {
    if (actorHasUltimateDuality(actor)) {
      changes.push({
        key: "system.attributes.movement.walk",
        mode: 1,
        value: "2",
        priority: 20,
      });
    } else {
      changes.push({
        key: "system.attributes.movement.walk",
        mode: 2,
        value: "10",
        priority: 20,
      });
    }
  }

  return changes;
}

/**
 * @param {object|null|undefined} actor
 * @param {string} form
 * @returns {boolean}
 */
export function shouldApplyEmpoweredGodspeedDisadvantage(actor, form) {
  return (
    form === FLAMING_DUALITY_FORM.GODSPEED
    && actorHasEmpoweredGodspeed(actor)
  );
}

/**
 * @param {object} config
 * @returns {boolean}
 */
export function isOpportunityAttackRoll(config) {
  const activation = config?.activity?.activation?.type ?? config?.workflow?.activation?.type;
  if (activation === "opportunity") return true;
  if (config?.options?.opportunityAttack) return true;
  if (config?.data?.opportunityAttack) return true;
  return false;
}

/**
 * @param {object} config
 * @returns {object|null|undefined}
 */
export function attackTargetFromConfig(config) {
  return config?.targets?.[0]?.actor ?? config?.target?.actor ?? config?.subject;
}

/**
 * @param {object} config
 * @returns {boolean}
 */
export function shouldApplyEmpoweredGodspeedToAttack(config) {
  if (!isOpportunityAttackRoll(config)) return false;
  const target = attackTargetFromConfig(config);
  if (!target) return false;
  const form = getActiveFlamingDualityForm(target);
  return shouldApplyEmpoweredGodspeedDisadvantage(target, form);
}

/**
 * Apply disadvantage to attack roll config (mirrors applyDexSaveAdvantage).
 *
 * @param {object} config
 */
export function applyAttackDisadvantage(config) {
  if (!config || typeof config !== "object") return;

  config.rolls ??= [{}];
  if (!Array.isArray(config.rolls) || config.rolls.length === 0) {
    config.rolls = [{}];
  }

  for (const roll of config.rolls) {
    roll.options ??= {};
    if (roll.options.advantage) continue;
    roll.options.disadvantage = true;
  }
}

/**
 * @param {object|null|undefined} item
 * @returns {number|null}
 */
export function getItemUsesRemaining(item) {
  const value = item?.system?.uses?.value;
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * @param {object|null|undefined} item
 * @returns {number|null}
 */
export function getItemUsesMax(item) {
  const max = item?.system?.uses?.max;
  if (max === null || max === undefined || max === "") return null;
  const n = Number(max);
  if (Number.isFinite(n)) return n;
  return null;
}

/**
 * @param {object|null|undefined} actor
 * @param {boolean} unlimited
 * @returns {boolean}
 */
export function canSpendFlamingDualityUse(actor, item, unlimited) {
  if (unlimited) return true;
  const remaining = getItemUsesRemaining(item);
  if (remaining === null) {
    const max = getItemUsesMax(item);
    return max === null || max > 0;
  }
  return remaining > 0;
}

/**
 * @param {object|null|undefined} actor
 * @param {object|null|undefined} item
 * @returns {Promise<boolean>}
 */
export async function spendItemUse(item) {
  if (!item?.update) return false;
  const remaining = getItemUsesRemaining(item);
  if (remaining === null) return true;
  if (remaining <= 0) return false;
  await item.update({ "system.uses.value": remaining - 1 });
  return true;
}

/**
 * @param {string} creationId
 * @returns {string}
 */
export function creationCompendiumSource(creationId) {
  return `Compendium.${MODULE_ID}.creations.${creationId}`;
}

/**
 * @param {object|null|undefined} actor
 * @param {string} creationId
 * @returns {object|null}
 */
export function findActorCreationById(actor, creationId) {
  if (!actor?.items) return null;
  const source = creationCompendiumSource(creationId);
  return (
    actor.items.find(
      item =>
        item.id === creationId
        || item._id === creationId
        || item._stats?.compendiumSource === source
        || String(item._stats?.compendiumSource ?? "").includes(creationId),
    ) ?? null
  );
}

/**
 * @param {object|null|undefined} actor
 * @returns {{ fireBolt: object|null, elementalArmor: object|null, fireball: object|null }}
 */
export function findFlameInvestureSpells(actor) {
  return {
    fireBolt: findActorCreationById(actor, OP5E_CREATION_IDS.fireBolt),
    elementalArmor: findActorCreationById(actor, OP5E_CREATION_IDS.elementalArmor),
    fireball: findActorCreationById(actor, OP5E_CREATION_IDS.fireball),
  };
}

/**
 * @param {object|null|undefined} actor
 * @returns {boolean}
 */
export function canUseFlameInvestureFireball(actor, investureItem) {
  if (getActorCharacterLevel(actor) < 5) return false;
  const remaining = getItemUsesRemaining(investureItem);
  if (remaining === null) {
    const max = getItemUsesMax(investureItem);
    return max === null || max > 0;
  }
  return remaining > 0;
}

/**
 * @param {string} form
 * @returns {boolean}
 */
export function isValidFlamingDualityForm(form) {
  return form === FLAMING_DUALITY_FORM.IGNITED || form === FLAMING_DUALITY_FORM.GODSPEED;
}

/**
 * @param {object|null|undefined} actor
 * @returns {object[]}
 */
export function buildRageChanges() {
  return [
    { key: "system.traits.dr.value", mode: 0, value: "bludgeoning", priority: 20 },
    { key: "system.traits.dr.value", mode: 0, value: "piercing", priority: 20 },
    { key: "system.traits.dr.value", mode: 0, value: "slashing", priority: 20 },
    { key: "flags.dnd5e.grants.advantage.ability.check.str", mode: 5, value: "1", priority: 20 },
    { key: "flags.dnd5e.grants.advantage.ability.save.str", mode: 5, value: "1", priority: 20 },
    { key: "system.bonuses.mwak.damage", mode: 2, value: "@prof", priority: 20 },
  ];
}

/**
 * @param {object|null|undefined} actor
 * @returns {object[]}
 */
export function buildInnerBeastChanges() {
  return [
    { key: "flags.dnd5e.grants.advantage.ability.check.str", mode: 5, value: "1", priority: 20 },
    { key: "flags.dnd5e.grants.advantage.ability.check.dex", mode: 5, value: "1", priority: 20 },
    { key: "system.attributes.movement.walk", mode: 2, value: "10", priority: 20 },
  ];
}

/**
 * @returns {object[]}
 */
export function buildBubbleFloaterChanges() {
  return [{ key: "system.attributes.movement.walk", mode: 2, value: "20", priority: 20 }];
}

/**
 * @param {number} reduction
 * @returns {object[]}
 */
export function buildGiantsEnduranceChanges(reduction) {
  return [{ key: "system.attributes.hp.temp", mode: 2, value: String(reduction), priority: 20 }];
}
