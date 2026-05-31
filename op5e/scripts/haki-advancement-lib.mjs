import { MODULE_ID } from "./constants.mjs";

/** @typedef {"armament"|"observation"|"conqueror"} HakiBranch */
/** @typedef {"novice"|"apprentice"|"journeyman"|"adept"|"master"} HakiTier */

export const HAKI_BRANCHES = Object.freeze(["armament", "observation", "conqueror"]);
export const HAKI_TIERS = Object.freeze([
  "novice",
  "apprentice",
  "journeyman",
  "adept",
  "master",
]);

/** Stable compendium item IDs (`generateId("feature/haki/<slug>")`). */
export const HAKI_FEAT_IDS = Object.freeze({
  "armament-novice": "16bc2636849312ce",
  "armament-apprentice": "c04321ae3bf3215f",
  "armament-journeyman": "46bb0c4613daad05",
  "armament-adept": "6b2a722fa61c9cfd",
  "armament-master": "0b0bd55e123f5a50",
  "observation-novice": "96dcda2a40ae256f",
  "observation-apprentice": "7395019d993a1891",
  "observation-journeyman": "2ce8a781717e7925",
  "observation-adept": "f615a9813a58ebab",
  "observation-master": "fd4062b1dd6625f7",
  "conqueror-novice": "409ca29b4a12db94",
  "conqueror-apprentice": "882fa5d6cef02212",
  "conqueror-journeyman": "691d3f9d84866b56",
  "conqueror-adept": "1eb133f6e6c5d1e4",
  "conqueror-master": "3162d3653418d74f",
});

const HAKI_ID_TO_SLUG = Object.freeze(
  Object.fromEntries(Object.entries(HAKI_FEAT_IDS).map(([slug, id]) => [id, slug])),
);

const HAKI_SLUG_TO_UUID = Object.freeze(
  Object.fromEntries(
    Object.entries(HAKI_FEAT_IDS).map(([slug, id]) => [
      slug,
      `Compendium.${MODULE_ID}.class-features.${id}`,
    ]),
  ),
);

/**
 * @param {string} branch
 * @param {string} tier
 * @returns {string}
 */
export function hakiSlug(branch, tier) {
  return `${branch}-${tier}`;
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function hakiUuid(slug) {
  return HAKI_SLUG_TO_UUID[slug];
}

/**
 * @param {Iterable<string>} ownedSlugs
 * @returns {string[]}
 */
export function getAvailableHakiSlugs(ownedSlugs) {
  const owned = new Set(ownedSlugs);
  /** @type {string[]} */
  const pool = [];

  for (const branch of HAKI_BRANCHES) {
    let highestTierIndex = -1;
    for (let i = 0; i < HAKI_TIERS.length; i++) {
      if (owned.has(hakiSlug(branch, HAKI_TIERS[i]))) {
        highestTierIndex = i;
      }
    }

    if (highestTierIndex === -1) {
      pool.push(hakiSlug(branch, "novice"));
    } else if (highestTierIndex < HAKI_TIERS.length - 1) {
      pool.push(hakiSlug(branch, HAKI_TIERS[highestTierIndex + 1]));
    }
  }

  return pool;
}

/**
 * @param {string} itemId
 * @returns {string|null}
 */
export function hakiSlugFromItemId(itemId) {
  return HAKI_ID_TO_SLUG[itemId] ?? null;
}

/**
 * @param {object|null|undefined} item Foundry Item-like
 * @returns {string|null}
 */
export function hakiSlugFromItem(item) {
  if (!item) return null;
  const fromId = hakiSlugFromItemId(item.id ?? item._id);
  if (fromId) return fromId;

  const source = item.flags?.dnd5e?.sourceId ?? item._stats?.compendiumSource;
  if (typeof source === "string") {
    const match = source.match(/class-features\.([a-f0-9]{16})/i);
    if (match) return hakiSlugFromItemId(match[1]);
  }

  return null;
}

/**
 * Collect Haki slugs already on an actor (from class Haki choices or other sources).
 *
 * @param {object|null|undefined} actor Foundry Actor-like
 * @returns {Set<string>}
 */
export function collectOwnedHakiSlugs(actor) {
  /** @type {Set<string>} */
  const owned = new Set();
  if (!actor?.items) return owned;

  for (const item of actor.items) {
    const slug = hakiSlugFromItem(item);
    if (slug) owned.add(slug);
  }

  return owned;
}

/**
 * @param {Iterable<string>} ownedSlugs
 * @returns {Set<string>}
 */
export function getAvailableHakiUuids(ownedSlugs) {
  return new Set(getAvailableHakiSlugs(ownedSlugs).map(hakiUuid));
}

/**
 * @param {object|null|undefined} config ItemChoice advancement configuration
 * @returns {boolean}
 */
export function isHakiItemChoiceConfig(config) {
  return config?.op5eHakiChoice === true;
}

/**
 * @param {string|null|undefined} uuid
 * @returns {string|null}
 */
export function hakiSlugFromUuid(uuid) {
  if (typeof uuid !== "string") return null;
  const match = uuid.match(/class-features\.([a-f0-9]{16})/i);
  if (!match) return null;
  return hakiSlugFromItemId(match[1]);
}

/**
 * Haki slugs chosen at earlier class Haki choice levels (strictly before choiceLevel).
 *
 * @param {object|null|undefined} manager dnd5e AdvancementManager
 * @param {number} choiceLevel
 * @returns {Set<string>}
 */
export function collectPriorHakiSlugsForChoiceLevel(manager, choiceLevel) {
  /** @type {Set<string>} */
  const owned = new Set();

  for (const step of manager?.steps ?? []) {
    const adv = step.advancement;
    if (!isHakiItemChoiceConfig(adv?.configuration)) continue;
    if (adv.level >= choiceLevel) continue;

    const added = adv.value?.added?.[adv.level] ?? {};
    for (const uuid of Object.values(added)) {
      const slug = hakiSlugFromUuid(uuid);
      if (slug) owned.add(slug);
    }
  }

  return owned;
}

/**
 * Filter an ItemChoice pool to valid Haki options for the current choice level.
 *
 * @param {object[]} pool
 * @param {object|null|undefined} manager
 * @param {number} choiceLevel
 * @returns {object[]}
 */
export function filterHakiPoolForAdvancementStep(pool, manager, choiceLevel) {
  const validUuids = getAvailableHakiUuids(
    collectPriorHakiSlugsForChoiceLevel(manager, choiceLevel),
  );
  return (pool ?? []).filter(entry => validUuids.has(entry.uuid));
}
