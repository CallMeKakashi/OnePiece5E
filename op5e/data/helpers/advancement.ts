import { generateId } from "./id.js";

// --- Public types ---

export const ADVANCEMENT_TYPES = [
  "HitPoints",
  "ItemGrant",
  "ItemChoice",
  "ScaleValue",
  "Subclass",
  "Trait",
  "AbilityScoreImprovement",
  "Size",
] as const;

export type AdvancementType = (typeof ADVANCEMENT_TYPES)[number];

export interface AdvancementEntry {
  _id: string;
  type: AdvancementType;
  configuration: Record<string, unknown>;
  value: Record<string, unknown>;
  level: number;
  title: string;
  icon: string;
  classRestriction: string;
  hint: string;
}

export interface ItemGrantEntry {
  uuid: string;
  optional?: boolean;
}

export interface ItemChoiceRestriction {
  type: string;
  subtype: string;
  level: string;
  list: string[];
}

export interface ItemChoiceConfig {
  allowDrops: boolean;
  choices: Record<number, { count: number; replacement: boolean }>;
  pool: { uuid: string }[];
  restriction: ItemChoiceRestriction;
  spell: unknown | null;
  type: string;
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
export function createHitPoints(classId: string): AdvancementEntry {
  const id = generateId(`${classId}/advancement/hit-points`);
  return {
    _id: id,
    type: "HitPoints",
    configuration: {},
    value: {},
    level: 0,
    title: "",
    icon: "",
    classRestriction: "",
    hint: "",
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
): AdvancementEntry {
  const tag = label ?? `level-${level}`;
  const id = generateId(`${classId}/advancement/item-grant/${tag}`);
  return {
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
  };
}

/**
 * ItemChoice advancement — offers a restricted choice from a pre-configured pool.
 *
 * dnd5e 5.1.10 expects advancement type "ItemChoice" with a configuration containing:
 * - allowDrops (boolean)
 * - type (allowed item type, e.g. "feat")
 * - pool ([{ uuid }...])
 * - choices ({ [level]: { count, replacement } })
 * - restriction ({ type, subtype, level, list })
 * - spell (null unless choosing spells)
 */
export function createItemChoiceRestricted(
  classId: string,
  level: number,
  uuids: string[],
  options: {
    count?: number;
    replacement?: boolean;
    itemType?: string;
    restrictionType?: string;
    label?: string;
  } = {},
): AdvancementEntry {
  const tag = options.label ?? `level-${level}`;
  const id = generateId(`${classId}/advancement/item-choice/${tag}`);

  const count = options.count ?? 1;
  const replacement = options.replacement ?? false;
  const itemType = options.itemType ?? "feat";
  const restrictionType = options.restrictionType ?? itemType;

  const configuration: ItemChoiceConfig = {
    allowDrops: false,
    choices: {
      [level]: { count, replacement },
    },
    pool: uuids.map((uuid) => ({ uuid })),
    restriction: {
      type: restrictionType,
      subtype: "",
      level: "",
      list: [],
    },
    spell: null,
    type: itemType,
  };

  return {
    _id: id,
    type: "ItemChoice",
    configuration,
    value: { ability: "", added: {}, replaced: {} },
    level,
    title: options.label ?? "",
    icon: "",
    classRestriction: "",
    hint: "",
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
): AdvancementEntry {
  const id = generateId(`${classId}/advancement/scale-value/${identifier}`);
  return {
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
  };
}

/**
 * Subclass advancement — prompts the player to choose a subclass.
 */
export function createSubclass(
  classId: string,
  level: number,
): AdvancementEntry {
  const id = generateId(`${classId}/advancement/subclass`);
  return {
    _id: id,
    type: "Subclass",
    configuration: {},
    value: {},
    level,
    title: "",
    icon: "",
    classRestriction: "",
    hint: "",
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
): AdvancementEntry {
  const tag = label ?? `${traits.mode}-${level}`;
  const id = generateId(`${classId}/advancement/trait/${tag}`);
  return {
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
  };
}

/**
 * AbilityScoreImprovement advancement — ASI or feat choice at a level.
 */
export function createASI(
  classId: string,
  level: number,
): AdvancementEntry {
  const id = generateId(`${classId}/advancement/asi/${level}`);
  return {
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
  };
}

/**
 * Size advancement — sets available sizes for a race.
 */
export function createSize(
  parentId: string,
  sizes: string[],
): AdvancementEntry {
  const id = generateId(`${parentId}/advancement/size`);
  return {
    _id: id,
    type: "Size",
    configuration: { sizes },
    value: {},
    level: 0,
    title: "",
    icon: "",
    classRestriction: "",
    hint: "",
  };
}

/**
 * Collect advancement entries into a flat array (dnd5e 5.1.x format).
 */
export function mergeAdvancements(
  ...advancements: AdvancementEntry[]
): AdvancementEntry[] {
  return advancements;
}
