import manifest from "../data/generated/haki-manifest.json" with { type: "json" };

/** @typedef {"armament"|"observation"|"conqueror"} HakiBranch */
/** @typedef {"novice"|"apprentice"|"journeyman"|"adept"|"master"} HakiTier */

export const HAKI_BRANCHES = Object.freeze([...manifest.branches]);
export const HAKI_TIERS = Object.freeze([...manifest.tiers]);
export const HAKI_CHOICE_LEVELS = Object.freeze([...manifest.choiceLevels]);

/** Stable compendium item IDs — generated from op5e/data/helpers/haki-advancement.ts */
export const HAKI_FEAT_IDS = Object.freeze({ ...manifest.featIds });

const HAKI_ID_TO_SLUG = Object.freeze(
  Object.fromEntries(Object.entries(HAKI_FEAT_IDS).map(([slug, id]) => [id, slug])),
);

const HAKI_SLUG_TO_UUID = Object.freeze({ ...manifest.slugToUuid });

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
    const match = source.match(/([a-f0-9]{16})$/i);
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
  const match = uuid.match(/([a-f0-9]{16})$/i);
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
