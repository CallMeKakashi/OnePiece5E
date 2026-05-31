/**
 * Foundry ItemGrant dedupes by compendium UUID (one actor item per UUID).
 * dnd5e 5.1 ItemGrant configuration schema has no quantity field — stack sizes live in
 * flags.op5e.grantQuantities / op5eGrantQuantities and are applied at runtime via hooks.
 */

/**
 * @param {object|null|undefined} item Foundry Item document or plain data
 * @returns {object|null}
 */
export function itemDocumentData(item) {
  if (!item) return null;
  return typeof item.toObject === "function" ? item.toObject() : item;
}

/**
 * @param {object|null|undefined} itemData
 * @returns {string}
 */
export function itemSourceUuid(itemData) {
  return String(
    itemData?.flags?.dnd5e?.sourceId
    ?? itemData?._stats?.compendiumSource
    ?? "",
  );
}

/**
 * @param {object|null|undefined} config ItemGrant advancement configuration
 * @param {Map<string, number>} quantities
 */
export function mergeQuantitiesFromItemGrantConfig(config, quantities) {
  if (!config || typeof config !== "object") return;

  const configured = config.op5eGrantQuantities;
  if (configured && typeof configured === "object") {
    for (const [uuid, qty] of Object.entries(configured)) {
      const n = Number(qty);
      if (!uuid || !Number.isFinite(n) || n <= 1) continue;
      quantities.set(uuid, Math.max(quantities.get(uuid) ?? 0, n));
    }
  }

  for (const entry of config.items ?? []) {
    const uuid = entry?.uuid;
    const n = Number(entry?.quantity ?? 1);
    if (!uuid || !Number.isFinite(n) || n <= 1) continue;
    quantities.set(uuid, Math.max(quantities.get(uuid) ?? 0, n));
  }
}

/**
 * @param {object|null|undefined} item Foundry item-like document or plain data
 * @param {Map<string, number>} quantities
 */
export function mergeQuantitiesFromItemFlags(item, quantities) {
  const configured = typeof item?.getFlag === "function"
    ? item.getFlag("op5e", "grantQuantities")
    : item?.flags?.op5e?.grantQuantities;
  if (!configured || typeof configured !== "object") return;
  for (const [uuid, qty] of Object.entries(configured)) {
    const n = Number(qty);
    if (!uuid || !Number.isFinite(n) || n <= 1) continue;
    quantities.set(uuid, Math.max(quantities.get(uuid) ?? 0, n));
  }
}

/**
 * @param {object|null|undefined} item
 * @param {Map<string, number>} quantities
 */
export function mergeQuantitiesFromItemAdvancements(item, quantities) {
  if (item?.advancement?.length) {
    for (const adv of item.advancement) {
      if (adv?.type !== "ItemGrant") continue;
      const config = adv.configuration?.toObject?.() ?? adv.configuration;
      mergeQuantitiesFromItemGrantConfig(config, quantities);
      mergeQuantitiesFromItemGrantConfig(adv._source?.configuration, quantities);
    }
  }

  const data = itemDocumentData(item);
  for (const adv of data?.system?.advancement ?? []) {
    if (adv?.type !== "ItemGrant") continue;
    mergeQuantitiesFromItemGrantConfig(adv.configuration, quantities);
  }
}

/**
 * @param {object|null|undefined} step dnd5e AdvancementManager step
 * @param {Map<string, number>} quantities
 */
export function mergeQuantitiesFromManagerStep(step, quantities) {
  const advancement = step?.flow?.advancement ?? step?.advancement;
  mergeQuantitiesFromItemGrantConfig(advancement?.configuration, quantities);
  mergeQuantitiesFromItemGrantConfig(advancement?._source?.configuration, quantities);

  const stepItem = step?.flow?.item ?? step?.item;
  mergeQuantitiesFromItemFlags(stepItem, quantities);
  mergeQuantitiesFromItemAdvancements(stepItem, quantities);
}

/**
 * Collect intended stack sizes from an advancement manager session.
 *
 * @param {object|null|undefined} manager dnd5e AdvancementManager
 * @returns {Map<string, number>}
 */
export function collectGrantQuantitiesFromManager(manager) {
  const quantities = new Map();

  // Legacy/test shape (manager.item is not set by dnd5e AdvancementManager)
  mergeQuantitiesFromItemFlags(manager?.item, quantities);
  mergeQuantitiesFromItemAdvancements(manager?.item, quantities);

  for (const step of manager?.steps ?? []) {
    mergeQuantitiesFromManagerStep(step, quantities);
  }

  for (const item of manager?.clone?.items ?? []) {
    mergeQuantitiesFromItemFlags(item, quantities);
    mergeQuantitiesFromItemAdvancements(item, quantities);
  }

  return quantities;
}

/**
 * @param {object[]} itemArrays
 * @param {Map<string, number>} quantities
 */
export function applyGrantQuantitiesToItems(itemArrays, quantities) {
  if (!quantities?.size) return;

  const lists = Array.isArray(itemArrays?.[0]) ? itemArrays : [itemArrays];
  for (const toMutate of lists) {
    if (!Array.isArray(toMutate)) continue;
    for (const itemData of toMutate) {
      const uuid = itemSourceUuid(itemData);
      const qty = quantities.get(uuid);
      if (!qty || qty <= 1) continue;
      if (globalThis.foundry?.utils?.setProperty) {
        foundry.utils.setProperty(itemData, "system.quantity", qty);
      } else {
        itemData.system ??= {};
        itemData.system.quantity = qty;
      }
    }
  }
}
