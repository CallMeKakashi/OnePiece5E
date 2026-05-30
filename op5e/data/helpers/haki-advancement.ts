import { generateId } from "./id.js";
import { compendiumUuid } from "./uuid.js";
import {
  createItemChoiceRestricted,
  createScaleValue,
  type AdvancementEntry,
} from "./advancement.js";

/** Haki branches in compendium slug form. */
export const HAKI_BRANCHES = ["armament", "observation", "conqueror"] as const;
export type HakiBranch = (typeof HAKI_BRANCHES)[number];

/** Tier order within each branch (Novice → Master). */
export const HAKI_TIERS = [
  "novice",
  "apprentice",
  "journeyman",
  "adept",
  "master",
] as const;
export type HakiTier = (typeof HAKI_TIERS)[number];

/** Class levels that grant one Haki choice. */
export const HAKI_CHOICE_LEVELS = [8, 10, 12, 14, 16] as const;

const TIER_LABELS: Record<HakiTier, string> = {
  novice: "Novice",
  apprentice: "Apprentice",
  journeyman: "Journeyman",
  adept: "Adept",
  master: "Master",
};

export function hakiSlug(branch: HakiBranch, tier: HakiTier): string {
  return `${branch}-${tier}`;
}

export function hakiUuid(slug: string): string {
  return compendiumUuid("class-features", generateId(`feature/haki/${slug}`));
}

export function allHakiSlugs(): string[] {
  return HAKI_BRANCHES.flatMap((branch) =>
    HAKI_TIERS.map((tier) => hakiSlug(branch, tier)),
  );
}

export function allHakiUuids(): string[] {
  return allHakiSlugs().map(hakiUuid);
}

/**
 * Compute the valid Haki feat slugs for the next choice.
 * - Unstarted branch → Novice
 * - Started branch → next tier (if not Master)
 * - Mastered branch → omitted
 */
export function getAvailableHakiSlugs(ownedSlugs: Iterable<string>): string[] {
  const owned = new Set(ownedSlugs);
  const pool: string[] = [];

  for (const branch of HAKI_BRANCHES) {
    let highestTierIndex = -1;
    for (let i = 0; i < HAKI_TIERS.length; i++) {
      if (owned.has(hakiSlug(branch, HAKI_TIERS[i]!))) {
        highestTierIndex = i;
      }
    }

    if (highestTierIndex === -1) {
      pool.push(hakiSlug(branch, "novice"));
    } else if (highestTierIndex < HAKI_TIERS.length - 1) {
      pool.push(hakiSlug(branch, HAKI_TIERS[highestTierIndex + 1]!));
    }
  }

  return pool;
}

function hakiChoiceLabel(level: number): string {
  const tier = HAKI_TIERS[HAKI_CHOICE_LEVELS.indexOf(level as (typeof HAKI_CHOICE_LEVELS)[number])];
  return tier ? `Haki (${TIER_LABELS[tier]})` : "Haki Advancement";
}

/**
 * ItemChoice with the full Haki tree in pool; runtime hook filters to valid branches.
 */
export function createHakiItemChoice(classId: string, level: number): AdvancementEntry {
  const entry = createItemChoiceRestricted(classId, level, allHakiUuids(), {
    label: hakiChoiceLabel(level),
  });

  entry.configuration.op5eHakiChoice = true;
  entry.hint =
    "Choose one Haki feat. Upgrade a branch you have started, or begin a new branch at Novice.";

  return entry;
}

/** All five Haki choice advancements for a class (levels 8/10/12/14/16). */
export function createHakiAdvancementChoices(classId: string): AdvancementEntry[] {
  return HAKI_CHOICE_LEVELS.map((level) => createHakiItemChoice(classId, level));
}

/** Informational scale tracking how many Haki choices the class grants by level. */
export function createHakiTierScaleValue(classId: string): AdvancementEntry {
  return createScaleValue(classId, "haki-tier", "number", {
    1: { value: 0 },
    8: { value: 1 },
    10: { value: 2 },
    12: { value: 3 },
    14: { value: 4 },
    16: { value: 5 },
  });
}
