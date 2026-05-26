import { z } from "zod";

export const FOUNDRY_ID_REGEX = /^[a-f0-9]{16}$/;

export const foundryId = z
  .string()
  .regex(FOUNDRY_ID_REGEX, "Must be a 16-character lowercase hex string");

// --- Active Effect schemas ---

export const activeEffectChangeSchema = z.object({
  key: z.string(),
  mode: z.number().int().min(0).max(5),
  value: z.string(),
  priority: z.number().int().optional().default(20),
});

export type ActiveEffectChange = z.infer<typeof activeEffectChangeSchema>;

export const activeEffectSchema = z.object({
  _id: foundryId,
  name: z.string(),
  img: z.string().default(""),
  changes: z.array(activeEffectChangeSchema).default([]),
  disabled: z.boolean().default(false),
  duration: z
    .object({
      startTime: z.number().nullable().default(null),
      seconds: z.number().nullable().default(null),
      rounds: z.number().nullable().default(null),
      turns: z.number().nullable().default(null),
      combat: z.string().nullable().default(null),
    })
    .default({}),
  origin: z.string().nullable().default(null),
  transfer: z.boolean().default(true),
  flags: z.record(z.unknown()).default({}),
  statuses: z.array(z.string()).default([]),
  tint: z.string().nullable().default(null),
});

export type ActiveEffect = z.infer<typeof activeEffectSchema>;

// --- Shared sub-schemas used across item types ---

export const descriptionSchema = z.object({
  value: z.string().default(""),
  chat: z.string().default(""),
});

export const sourceSchema = z.object({
  book: z.string().default("OP5e"),
  page: z.string().default(""),
  custom: z.string().default(""),
  license: z.string().default(""),
});

export const statsSchema = z.object({
  compendiumSource: z.string().nullable().default(null),
  duplicateSource: z.string().nullable().default(null),
  coreVersion: z.string().default("13"),
  systemId: z.string().default("dnd5e"),
  systemVersion: z.string().default("5.1.10"),
  createdTime: z.number().nullable().default(null),
  modifiedTime: z.number().nullable().default(null),
  lastModifiedBy: z.string().nullable().default(null),
});

// --- Base Foundry Item document ---

export const foundryItemBase = z.object({
  _id: foundryId,
  name: z.string(),
  type: z.string(),
  img: z.string().default("icons/svg/item-bag.svg"),
  system: z.record(z.unknown()),
  effects: z.array(activeEffectSchema).default([]),
  flags: z.record(z.unknown()).default({}),
  folder: z.string().nullable().default(null),
  sort: z.number().default(0),
  ownership: z
    .object({
      default: z.number().default(0),
    })
    .default({}),
  _stats: statsSchema.default({}),
});

export type FoundryItem = z.infer<typeof foundryItemBase>;

// --- DAE constants ---

export const DAE_MODES = {
  CUSTOM: 0,
  MULTIPLY: 1,
  ADD: 2,
  DOWNGRADE: 3,
  UPGRADE: 4,
  OVERRIDE: 5,
} as const;

export const DAE_KEYS = {
  STR_SCORE: "system.abilities.str.value",
  DEX_SCORE: "system.abilities.dex.value",
  CON_SCORE: "system.abilities.con.value",
  INT_SCORE: "system.abilities.int.value",
  WIS_SCORE: "system.abilities.wis.value",
  CHA_SCORE: "system.abilities.cha.value",

  STR_CHECK_BONUS: "system.abilities.str.bonuses.check",
  DEX_CHECK_BONUS: "system.abilities.dex.bonuses.check",
  CON_CHECK_BONUS: "system.abilities.con.bonuses.check",
  INT_CHECK_BONUS: "system.abilities.int.bonuses.check",
  WIS_CHECK_BONUS: "system.abilities.wis.bonuses.check",
  CHA_CHECK_BONUS: "system.abilities.cha.bonuses.check",

  STR_SAVE_BONUS: "system.abilities.str.bonuses.save",
  DEX_SAVE_BONUS: "system.abilities.dex.bonuses.save",
  CON_SAVE_BONUS: "system.abilities.con.bonuses.save",
  INT_SAVE_BONUS: "system.abilities.int.bonuses.save",
  WIS_SAVE_BONUS: "system.abilities.wis.bonuses.save",
  CHA_SAVE_BONUS: "system.abilities.cha.bonuses.save",

  AC_BONUS: "system.attributes.ac.bonus",
  AC_FORMULA: "system.attributes.ac.formula",

  HP_BONUS: "system.attributes.hp.bonuses.overall",
  HP_PER_LEVEL: "system.attributes.hp.bonuses.level",

  SPEED_WALK: "system.attributes.movement.walk",
  SPEED_SWIM: "system.attributes.movement.swim",
  SPEED_FLY: "system.attributes.movement.fly",
  SPEED_CLIMB: "system.attributes.movement.climb",

  DAMAGE_RESISTANCE: "system.traits.dr.value",
  DAMAGE_IMMUNITY: "system.traits.di.value",
  DAMAGE_VULNERABILITY: "system.traits.dv.value",
  CONDITION_IMMUNITY: "system.traits.ci.value",

  MELEE_ATTACK_BONUS: "system.bonuses.mwak.attack",
  RANGED_ATTACK_BONUS: "system.bonuses.rwak.attack",
  SPELL_ATTACK_BONUS: "system.bonuses.msak.attack",

  MIDI_ADVANTAGE_ATTACK_MWAK: "flags.midi-qol.advantage.attack.mwak",
  MIDI_ADVANTAGE_ATTACK_RWAK: "flags.midi-qol.advantage.attack.rwak",
  MIDI_ADVANTAGE_ABILITY_CHECK_ALL: "flags.midi-qol.advantage.ability.check.all",
  MIDI_ADVANTAGE_DEATH_SAVE: "flags.midi-qol.advantage.deathSave",
} as const;
