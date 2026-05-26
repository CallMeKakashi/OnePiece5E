import { generateId } from "./id.js";

// --- Public types ---

export interface ItemGrantEntry {
  uuid: string;
  optional?: boolean;
}

export interface TraitConfig {
  mode: "default" | "expertise" | "upgrade";
  grants: string[];
  choices?: { count: number; pool: string[] }[];
  allowReplacements?: boolean;
  hint?: string;
}

export interface ScaleValueDie {
  number: number;
  faces: number;
}

export interface ScaleValueEntry {
  type?: string;
  value?: number | string;
  number?: number;
  formula?: string;
  die?: ScaleValueDie;
}

// --- Factory functions ---

/**
 * HitPoints advancement — determines HP gained on level-up.
 * Configured once at level 0; the hit die size comes from the class's hitDice field.
 */
export function createHitPoints(classId: string): Record<string, unknown> {
  const id = generateId(`${classId}/advancement/hit-points`);
  return {
    [id]: {
      _id: id,
      type: "HitPoints",
      configuration: {},
      value: {},
      level: 0,
      title: "",
      icon: "",
      classRestriction: "",
      hint: "",
    },
  };
}

/**
 * ItemGrant advancement — grants features at a specific level.
 * Each item is referenced by compendium UUID.
 */
export function createItemGrant(
  classId: string,
  level: number,
  items: ItemGrantEntry[],
  label?: string,
): Record<string, unknown> {
  const tag = label ?? `level-${level}`;
  const id = generateId(`${classId}/advancement/item-grant/${tag}`);
  return {
    [id]: {
      _id: id,
      type: "ItemGrant",
      configuration: {
        items: items.map((i) => ({
          uuid: i.uuid,
          optional: i.optional ?? false,
        })),
      },
      value: {},
      level,
      title: label ?? "",
      icon: "",
      classRestriction: "",
      hint: "",
    },
  };
}

/**
 * ScaleValue advancement — tracks a value that scales with level.
 * Useful for Sneak Attack dice, Rage damage, Martial Arts die, etc.
 */
export function createScaleValue(
  classId: string,
  identifier: string,
  scaleType: string,
  values: Record<number, ScaleValueEntry>,
): Record<string, unknown> {
  const id = generateId(`${classId}/advancement/scale-value/${identifier}`);
  return {
    [id]: {
      _id: id,
      type: "ScaleValue",
      configuration: {
        identifier,
        type: scaleType,
        scale: values,
      },
      value: {},
      level: 0,
      title: "",
      icon: "",
      classRestriction: "",
      hint: "",
    },
  };
}

/**
 * Subclass advancement — prompts the player to choose a subclass.
 */
export function createSubclass(
  classId: string,
  level: number,
): Record<string, unknown> {
  const id = generateId(`${classId}/advancement/subclass`);
  return {
    [id]: {
      _id: id,
      type: "Subclass",
      configuration: {},
      value: {},
      level,
      title: "",
      icon: "",
      classRestriction: "",
      hint: "",
    },
  };
}

/**
 * Trait advancement — grants proficiencies (armor, weapons, saves, skills).
 */
export function createTrait(
  classId: string,
  level: number,
  traits: TraitConfig,
  label?: string,
): Record<string, unknown> {
  const tag = label ?? `${traits.mode}-${level}`;
  const id = generateId(`${classId}/advancement/trait/${tag}`);
  return {
    [id]: {
      _id: id,
      type: "Trait",
      configuration: {
        mode: traits.mode,
        grants: traits.grants,
        choices: traits.choices ?? [],
        allowReplacements: traits.allowReplacements ?? false,
        hint: traits.hint ?? "",
      },
      value: {},
      level,
      title: label ?? "",
      icon: "",
      classRestriction: "",
      hint: "",
    },
  };
}

/**
 * AbilityScoreImprovement advancement — ASI or feat choice at a level.
 */
export function createASI(
  classId: string,
  level: number,
): Record<string, unknown> {
  const id = generateId(`${classId}/advancement/asi/${level}`);
  return {
    [id]: {
      _id: id,
      type: "AbilityScoreImprovement",
      configuration: {
        points: 2,
        fixed: {},
        cap: 2,
      },
      value: {},
      level,
      title: "",
      icon: "",
      classRestriction: "",
      hint: "",
    },
  };
}

/**
 * Merge multiple advancement records into a single object.
 */
export function mergeAdvancements(
  ...advancements: Record<string, unknown>[]
): Record<string, unknown> {
  return Object.assign({}, ...advancements);
}
