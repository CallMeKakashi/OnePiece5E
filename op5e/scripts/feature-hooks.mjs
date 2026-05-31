import { MODULE_ID } from "./constants.mjs";
import { OP5E_FEATURE_IDS } from "./feature-ids.mjs";
import {
  actorHasDiamondSoul,
  actorHasUltimateDuality,
  applyAttackDisadvantage,
  applyDexSaveAdvantage,
  BUBBLE_FLOATER_DURATION_SECONDS,
  buildBubbleFloaterChanges,
  buildFlamingDualityChanges,
  buildInnerBeastChanges,
  buildRageChanges,
  canSpendFlamingDualityUse,
  canSpendSpiritPoint,
  canUseFlameInvestureFireball,
  findActorCreationById,
  findExperimentalMedicinePair,
  findFlameInvestureSpells,
  findFlamingDualityEffect,
  findSpiritItem,
  FLAMING_DUALITY_DURATION_SECONDS,
  FLAMING_DUALITY_FORM,
  getFlamingDualityFormFromActivity,
  getActiveFlamingDualityForm,
  getActorCharacterLevel,
  getCombatMedicineRedirectTarget,
  getItemUsesRemaining,
  getRelentlessRageDcFromActor,
  getSpiritUsesRemaining,
  INNER_BEAST_DURATION_SECONDS,
  isBubbleFloaterItem,
  isExperimentalMedicineItem,
  isExperimentalMedicinePoolItem,
  isFlameInvestureItem,
  isFlamingDualityItem,
  isGiantsEnduranceItem,
  isInnerBeastItem,
  isRageItem,
  nextRelentlessRageDc,
  RELENTLESS_RAGE_BASE_DC,
  savingThrowFailed,
  shouldApplyDangerSenseDexAdvantage,
  shouldApplyEmpoweredGodspeedToAttack,
  shouldOfferRelentlessRage,
  shouldRedirectExperimentalMedicineToCombat,
  spendItemUse,
} from "./feature-hooks-lib.mjs";

/** Actors currently resolving a Diamond Soul reroll (avoid prompt loops). */
const diamondSoulRerollInFlight = new WeakSet();

/** Actors currently resolving Relentless Rage (avoid duplicate prompts). */
const relentlessRageInFlight = new WeakSet();


/**
 * @param {object} config
 * @returns {string|undefined}
 */
function abilityFromSaveConfig(config) {
  return config?.ability ?? config?.abilityId ?? config?.rolls?.[0]?.options?.ability;
}

/**
 * @param {object} config
 * @returns {import("documents/actor.mjs").default|undefined}
 */
function subjectFromSaveConfig(config) {
  return config?.subject ?? config?.actor;
}

/**
 * @param {object} config
 * @param {string} ability
 */
function onPreRollSavingThrow(config, _dialog, _message) {
  const ability = abilityFromSaveConfig(config);
  if (!shouldApplyDangerSenseDexAdvantage(config, ability)) return;

  applyDexSaveAdvantage(config);

  config.flags ??= {};
  config.flags[MODULE_ID] ??= {};
  config.flags[MODULE_ID].dangerSenseAdvantage = true;
}

/**
 * @param {object} config
 */
function onPreRollAttack(config, _dialog, _message) {
  if (!shouldApplyEmpoweredGodspeedToAttack(config)) return;
  applyAttackDisadvantage(config);
  config.flags ??= {};
  config.flags[MODULE_ID] ??= {};
  config.flags[MODULE_ID].empoweredGodspeedDisadvantage = true;
}

/**
 * @param {object[]} rolls
 * @param {object} data
 */
async function onRollSavingThrow(rolls, data) {
  const actor = data?.subject;
  if (!actor || !game.user?.isActorOwner(actor)) return;
  if (diamondSoulRerollInFlight.has(actor)) return;
  if (!actorHasDiamondSoul(actor)) return;

  const ability = data?.ability;
  if (!ability) return;

  const dc = data?.dc ?? rolls?.[0]?.options?.target;
  if (!savingThrowFailed(rolls, dc)) return;
  if (!canSpendSpiritPoint(actor)) return;

  const spirit = findSpiritItem(actor);
  const remaining = getSpiritUsesRemaining(spirit);
  const confirmed = await Dialog.confirm({
    title: game.i18n.localize(`${MODULE_ID}.diamondSoul.dialogTitle`),
    content: `<p>${game.i18n.format(`${MODULE_ID}.diamondSoul.dialogContent`, { remaining })}</p>`,
    yes: () => true,
    no: () => false,
    defaultYes: false,
  });

  if (!confirmed) return;

  const newValue = Math.max(0, (remaining ?? 1) - 1);
  await spirit.update({ "system.uses.value": newValue });

  diamondSoulRerollInFlight.add(actor);
  try {
    await actor.rollAbilitySave(ability, {
      event: new Event("click"),
      dialog: { configure: true },
    });
  } finally {
    diamondSoulRerollInFlight.delete(actor);
  }
}

/**
 * @param {import("documents/actor.mjs").default} actor
 * @param {import("documents/item.mjs").default} item
 * @param {string} name
 * @param {object[]} changes
 * @param {number} seconds
 * @param {Record<string, unknown>} moduleFlags
 */
async function applyTimedActorEffect(actor, item, name, changes, seconds, moduleFlags = {}) {
  const effectData = {
    name,
    icon: item.img ?? "icons/svg/aura.svg",
    origin: item.uuid,
    disabled: false,
    duration: { seconds, startTime: game.time?.worldTime ?? null },
    changes,
    flags: {
      [MODULE_ID]: moduleFlags,
      dae: { transfer: false, stackable: "noneName" },
    },
    statuses: moduleFlags.rage ? ["rage"] : [],
  };

  return actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
}

/**
 * @param {import("documents/actor.mjs").default} actor
 * @param {import("documents/item.mjs").default} investureItem
 * @returns {Promise<string|null>}
 */
function promptFlameInvestureCast(actor, investureItem) {
  const level = getActorCharacterLevel(actor);
  const spells = findFlameInvestureSpells(actor);

  return new Promise(resolve => {
    /** @type {Record<string, object>} */
    const buttons = {
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("Cancel"),
        callback: () => resolve(null),
      },
    };

    if (spells.fireBolt) {
      buttons.fireBolt = {
        label: game.i18n.localize(`${MODULE_ID}.flameInvesture.fireBolt`),
        callback: () => resolve("fireBolt"),
      };
    }

    if (level >= 3 && spells.elementalArmor) {
      buttons.elementalArmor = {
        label: game.i18n.localize(`${MODULE_ID}.flameInvesture.elementalArmor`),
        callback: () => resolve("elementalArmor"),
      };
    }

    if (level >= 5 && spells.fireball) {
      const remaining = getItemUsesRemaining(investureItem);
      const disabled = !canUseFlameInvestureFireball(actor, investureItem);
      buttons.fireball = {
        label: game.i18n.format(`${MODULE_ID}.flameInvesture.fireball`, {
          remaining: remaining ?? "?",
        }),
        callback: () => resolve("fireball"),
        disabled,
      };
    }

    if (Object.keys(buttons).length === 1) {
      ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.flameInvesture.noSpells`));
      resolve(null);
      return;
    }

    new Dialog({
      title: game.i18n.localize(`${MODULE_ID}.flameInvesture.dialogTitle`),
      content: `<p>${game.i18n.localize(`${MODULE_ID}.flameInvesture.dialogContent`)}</p>`,
      buttons,
      default: "fireBolt",
      close: () => resolve(null),
    }).render(true);
  });
}

/**
 * @param {import("documents/actor.mjs").default} actor
 * @param {import("documents/item.mjs").default} item
 * @param {string} form
 */
async function applyFlamingDualityForm(actor, item, form) {
  const existing = findFlamingDualityEffect(actor);
  if (existing) await existing.delete();

  const label =
    form === FLAMING_DUALITY_FORM.IGNITED
      ? game.i18n.localize(`${MODULE_ID}.flamingDuality.ignited`)
      : game.i18n.localize(`${MODULE_ID}.flamingDuality.godspeed`);

  await applyTimedActorEffect(
    actor,
    item,
    `${item.name} — ${label}`,
    buildFlamingDualityChanges(actor, form),
    FLAMING_DUALITY_DURATION_SECONDS,
    { flamingDualityForm: form },
  );

  ui.notifications.info(
    game.i18n.format(`${MODULE_ID}.flamingDuality.applied`, { form: label }),
  );
}

/**
 * @param {object} activity
 * @param {object} usageConfig
 */
async function handleFlamingDuality(activity, usageConfig) {
  const item = activity?.item;
  const actor = item?.actor;
  if (!actor || !game.user?.isActorOwner(actor)) return false;

  const existing = findFlamingDualityEffect(actor);
  const switching = Boolean(existing);
  const unlimited = actorHasUltimateDuality(actor);

  const form = getFlamingDualityFormFromActivity(activity);
  if (!form) return false;

  if (!switching && !canSpendFlamingDualityUse(actor, item, unlimited)) {
    ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.flamingDuality.noUses`));
    return false;
  }

  if (!switching && !unlimited) {
    const spent = await spendItemUse(item);
    if (!spent) {
      ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.flamingDuality.noUses`));
      return false;
    }
  }

  await applyFlamingDualityForm(actor, item, form);

  const event = usageConfig?.event;
  if (event?.preventDefault) event.preventDefault();
  return false;
}

/**
 * @param {object} activity
 * @param {object} usageConfig
 */
async function handleFlameInvesture(activity, usageConfig) {
  const item = activity?.item;
  const actor = item?.actor;
  if (!actor || !game.user?.isActorOwner(actor)) return false;

  const choice = await promptFlameInvestureCast(actor, item);
  if (!choice) return false;

  const spells = findFlameInvestureSpells(actor);
  const level = getActorCharacterLevel(actor);

  /** @type {import("documents/item.mjs").default|null} */
  let spell = null;

  if (choice === "fireBolt") spell = spells.fireBolt;
  if (choice === "elementalArmor") {
    if (level < 3) {
      ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.flameInvesture.needLevel3`));
      return false;
    }
    spell = spells.elementalArmor;
  }
  if (choice === "fireball") {
    if (level < 5) {
      ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.flameInvesture.needLevel5`));
      return false;
    }
    if (!canUseFlameInvestureFireball(actor, item)) {
      ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.flameInvesture.noFireballUses`));
      return false;
    }
    spell = spells.fireball;
  }

  if (!spell) {
    ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.flameInvesture.missingSpell`));
    return false;
  }

  if (choice === "fireball") {
    const spent = await spendItemUse(item);
    if (!spent) {
      ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.flameInvesture.noFireballUses`));
      return false;
    }
  }

  const event = usageConfig?.event;
  spell.use({ event }).catch(err => {
    console.error(`${MODULE_ID} | Flame Investure spell use failed`, err);
  });

  return false;
}

/**
 * @param {object} activity
 * @param {object} usageConfig
 */
async function handleRage(activity, usageConfig) {
  const item = activity?.item;
  const actor = item?.actor;
  if (!actor || !game.user?.isActorOwner(actor)) return false;

  const remaining = getItemUsesRemaining(item);
  if (remaining !== null && remaining <= 0) {
    ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.rage.noUses`));
    return false;
  }

  const spent = await spendItemUse(item);
  if (!spent && remaining !== null) {
    ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.rage.noUses`));
    return false;
  }

  const existing = actor.effects?.filter(
    e => !e.disabled && e.flags?.[MODULE_ID]?.rage,
  );
  for (const effect of existing ?? []) {
    await effect.delete();
  }

  await applyTimedActorEffect(
    actor,
    item,
    item.name,
    buildRageChanges(),
    FLAMING_DUALITY_DURATION_SECONDS,
    { rage: true },
  );

  ui.notifications.info(game.i18n.localize(`${MODULE_ID}.rage.applied`));
  return false;
}

/**
 * @param {object} activity
 * @param {object} usageConfig
 */
async function handleInnerBeast(activity, usageConfig) {
  const item = activity?.item;
  const actor = item?.actor;
  if (!actor || !game.user?.isActorOwner(actor)) return false;

  const remaining = getItemUsesRemaining(item);
  if (remaining !== null && remaining <= 0) {
    ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.innerBeast.noUses`));
    return false;
  }

  const spent = await spendItemUse(item);
  if (!spent && remaining !== null) return false;

  const existing = actor.effects?.filter(e => !e.disabled && e.flags?.[MODULE_ID]?.innerBeast);
  for (const effect of existing ?? []) {
    await effect.delete();
  }

  await applyTimedActorEffect(
    actor,
    item,
    item.name,
    buildInnerBeastChanges(),
    INNER_BEAST_DURATION_SECONDS,
    { innerBeast: true },
  );

  ui.notifications.info(game.i18n.localize(`${MODULE_ID}.innerBeast.applied`));
  return false;
}

/**
 * @param {object} activity
 * @param {object} usageConfig
 */
async function handleBubbleFloater(activity, usageConfig) {
  const item = activity?.item;
  const actor = item?.actor;
  if (!actor || !game.user?.isActorOwner(actor)) return false;

  const existing = actor.effects?.filter(e => !e.disabled && e.flags?.[MODULE_ID]?.bubbleFloater);
  for (const effect of existing ?? []) {
    await effect.delete();
  }

  await applyTimedActorEffect(
    actor,
    item,
    item.name,
    buildBubbleFloaterChanges(),
    BUBBLE_FLOATER_DURATION_SECONDS,
    { bubbleFloater: true },
  );

  ui.notifications.info(game.i18n.localize(`${MODULE_ID}.bubbleFloater.applied`));
  return false;
}

/**
 * Field Surgeon: block base Experimental Medicine activation and use Combat Medicine instead.
 *
 * @param {object} activity
 * @param {object} usageConfig
 */
function handleCombatMedicineRedirect(activity, usageConfig) {
  const item = activity?.item;
  if (!item || !isExperimentalMedicineItem(item.id)) return;

  const actor = item.actor;
  if (!shouldRedirectExperimentalMedicineToCombat(actor)) return;

  const combat = getCombatMedicineRedirectTarget(actor);
  if (!combat) return;

  ui.notifications.info(game.i18n.localize(`${MODULE_ID}.combatMedicine.redirectNotice`));

  const event = usageConfig?.event;
  setTimeout(() => {
    combat.use({ event }).catch(err => {
      console.error(`${MODULE_ID} | Combat Medicine redirect failed`, err);
    });
  }, 0);

  return false;
}

/**
 * @param {object} activity
 * @param {object} usageConfig
 * @returns {boolean|Promise<boolean>|void}
 */
function onPreUseActivity(activity, usageConfig) {
  const itemId = activity?.item?.id;
  if (!itemId) return;

  if (isFlamingDualityItem(itemId)) {
    handleFlamingDuality(activity, usageConfig).catch(err => {
      console.error(`${MODULE_ID} | Flaming Duality failed`, err);
    });
    return false;
  }

  if (isFlameInvestureItem(itemId)) {
    handleFlameInvesture(activity, usageConfig).catch(err => {
      console.error(`${MODULE_ID} | Flame Investure failed`, err);
    });
    return false;
  }

  if (isRageItem(itemId)) {
    handleRage(activity, usageConfig).catch(err => {
      console.error(`${MODULE_ID} | Rage failed`, err);
    });
    return false;
  }

  if (isInnerBeastItem(itemId)) {
    handleInnerBeast(activity, usageConfig).catch(err => {
      console.error(`${MODULE_ID} | Inner Beast failed`, err);
    });
    return false;
  }

  if (isBubbleFloaterItem(itemId)) {
    handleBubbleFloater(activity, usageConfig).catch(err => {
      console.error(`${MODULE_ID} | Bubble Floater failed`, err);
    });
    return false;
  }

  if (isGiantsEnduranceItem(itemId)) {
    handleGiantsEndurance(activity, usageConfig).catch(err => {
      console.error(`${MODULE_ID} | Giant's Endurance failed`, err);
    });
    return false;
  }

  return handleCombatMedicineRedirect(activity, usageConfig);
}

/**
 * @param {object} activity
 * @param {object} usageConfig
 */
async function handleGiantsEndurance(activity, usageConfig) {
  const item = activity?.item;
  const actor = item?.actor;
  if (!actor || !game.user?.isActorOwner(actor)) return false;

  const remaining = getItemUsesRemaining(item);
  if (remaining !== null && remaining <= 0) {
    ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.giantsEndurance.noUses`));
    return false;
  }

  const lastDamage = Number(actor.getFlag?.(MODULE_ID, "lastDamageTaken") ?? 0);
  if (!Number.isFinite(lastDamage) || lastDamage <= 0) {
    ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.giantsEndurance.noRecentDamage`));
    return false;
  }

  const roll = await new Roll("1d12 + @abilities.con.mod", actor.getRollData?.() ?? {}).evaluate();
  await roll.toMessage({ flavor: item.name });

  const reduction = Math.min(lastDamage, roll.total ?? 0);
  if (reduction > 0) {
    const hp = actor.system?.attributes?.hp?.value ?? 0;
    const max = actor.system?.attributes?.hp?.max ?? hp;
    await actor.update({
      "system.attributes.hp.value": Math.min(max, hp + reduction),
    });
  }

  await spendItemUse(item);
  await actor.unsetFlag(MODULE_ID, "lastDamageTaken");

  ui.notifications.info(
    game.i18n.format(`${MODULE_ID}.giantsEndurance.reduced`, { amount: reduction }),
  );
  return false;
}

/**
 * @param {import("documents/actor.mjs").default} actor
 * @param {object} changes
 */
async function onDamageActorRelentlessRage(actor, changes) {
  const hpChange = changes?.hp ?? 0;
  if (hpChange >= 0) return;

  const hpAfter = actor.system?.attributes?.hp?.value ?? 0;
  if (!shouldOfferRelentlessRage(actor, hpChange, hpAfter)) return;
  if (!game.user?.isActorOwner(actor)) return;
  if (relentlessRageInFlight.has(actor)) return;

  const dc = getRelentlessRageDcFromActor(actor);
  const confirmed = await Dialog.confirm({
    title: game.i18n.localize(`${MODULE_ID}.relentlessRage.dialogTitle`),
    content: `<p>${game.i18n.format(`${MODULE_ID}.relentlessRage.dialogContent`, { dc })}</p>`,
    yes: () => true,
    no: () => false,
    defaultYes: true,
  });

  if (!confirmed) return;

  relentlessRageInFlight.add(actor);
  try {
    const results = await actor.rollAbilitySave("con", {
      event: new Event("click"),
      target: dc,
    });

    const roll = Array.isArray(results) ? results[0] : results?.rolls?.[0];
    const total = roll?.total;
    if (typeof total !== "number") return;

    if (total >= dc) {
      await actor.update({ "system.attributes.hp.value": 1 });
      await actor.setFlag(MODULE_ID, "relentlessRageDc", nextRelentlessRageDc(dc));
      ui.notifications.info(game.i18n.format(`${MODULE_ID}.relentlessRage.success`, { dc: nextRelentlessRageDc(dc) }));
    } else {
      ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.relentlessRage.failure`));
    }
  } finally {
    relentlessRageInFlight.delete(actor);
  }
}

/**
 * @param {import("documents/actor.mjs").default} actor
 * @param {object} changes
 */
async function onDamageActor(actor, changes) {
  const hpChange = changes?.hp ?? 0;
  if (hpChange < 0 && actor?.setFlag) {
    const damageTaken = Math.abs(hpChange);
    if (damageTaken > 0) {
      await actor.setFlag(MODULE_ID, "lastDamageTaken", damageTaken);
    }
  }

  await onDamageActorRelentlessRage(actor, changes);
}

/**
 * @param {import("documents/actor.mjs").default} actor
 */
async function onRestCompleted(actor) {
  if (!actor?.setFlag) return;
  const hasRelentless = actor.items?.some(
    i => i.id === OP5E_FEATURE_IDS.relentlessRage || i._id === OP5E_FEATURE_IDS.relentlessRage,
  );
  if (!hasRelentless) return;

  const current = actor.getFlag?.(MODULE_ID, "relentlessRageDc");
  if (current === undefined || current === null) return;

  await actor.setFlag(MODULE_ID, "relentlessRageDc", RELENTLESS_RAGE_BASE_DC);
}

/**
 * Keep Field Surgeon Combat Medicine and base Experimental Medicine use pools aligned.
 *
 * @param {import("documents/item.mjs").default} item
 * @param {object} changes
 * @param {object} options
 */
async function onUpdateItemUses(item, changes, options) {
  if (options?.[`${MODULE_ID}SyncUses`]) return;

  const usesChange = foundry.utils.getProperty(changes, "system.uses.value");
  if (usesChange === undefined) return;

  const actor = item.actor;
  if (!actor) return;

  if (!isExperimentalMedicinePoolItem(item.id)) return;

  const { experimental, combat } = findExperimentalMedicinePair(actor);
  if (!experimental || !combat) return;

  const partner = item.id === OP5E_FEATURE_IDS.combatMedicine ? experimental : combat;
  const partnerValue = partner.system?.uses?.value;
  if (partnerValue === usesChange) return;

  await partner.update(
    { "system.uses.value": usesChange },
    { [`${MODULE_ID}SyncUses`]: true },
  );
}

export function registerOp5eFeatureHooks() {
  Hooks.on("dnd5e.preRollSavingThrow", onPreRollSavingThrow);
  Hooks.on("dnd5e.preRollAttack", onPreRollAttack);
  Hooks.on("dnd5e.rollSavingThrow", onRollSavingThrow);
  Hooks.on("dnd5e.preUseActivity", onPreUseActivity);
  Hooks.on("dnd5e.damageActor", (actor, changes, _update, _userId) => {
    onDamageActor(actor, changes).catch(err => {
      console.error(`${MODULE_ID} | damageActor feature hooks failed`, err);
    });
  });
  Hooks.on("dnd5e.restCompleted", (actor, _result, _config) => {
    onRestCompleted(actor).catch(err => {
      console.error(`${MODULE_ID} | Relentless Rage DC reset failed`, err);
    });
  });
  Hooks.on("updateItem", (item, changes, options, _userId) => {
    onUpdateItemUses(item, changes, options).catch(err => {
      console.error(`${MODULE_ID} | Combat Medicine use sync failed`, err);
    });
  });

  console.log(
    `${MODULE_ID} | feature hooks registered (Diamond Soul, Danger Sense, Combat Medicine, Relentless Rage, Lunarian, Rage, Mink, Merfolk, Giant)`,
  );
}
