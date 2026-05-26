import { z } from "zod";
import { foundryItemBase, descriptionSchema, sourceSchema } from "./common.js";

const advancementEntrySchema = z.object({
  _id: z.string().min(1),
  type: z.enum([
    "HitPoints",
    "ItemGrant",
    "ScaleValue",
    "Subclass",
    "Trait",
    "AbilityScoreImprovement",
    "Size",
  ]),
  configuration: z.record(z.unknown()).default({}),
  value: z.record(z.unknown()).default({}),
  level: z.number().int().min(0).default(0),
  title: z.string().default(""),
  icon: z.string().default(""),
  hint: z.string().default(""),
});

const movementSchema = z
  .object({
    walk: z.number().default(30),
    swim: z.number().default(0),
    fly: z.number().default(0),
    climb: z.number().default(0),
    burrow: z.number().default(0),
    hover: z.boolean().default(false),
    units: z.string().default("ft"),
  })
  .default({});

const creatureTypeSchema = z
  .object({
    value: z.string().default("humanoid"),
    subtype: z.string().default(""),
    custom: z.string().default(""),
  })
  .default({});

const raceSystemSchema = z.object({
  description: descriptionSchema.default({}),
  source: sourceSchema.default({}),
  identifier: z.string(),
  advancement: z.record(z.string(), advancementEntrySchema),
  movement: movementSchema,
  type: creatureTypeSchema,
});

export type RaceSystem = z.infer<typeof raceSystemSchema>;

export const raceItemSchema = foundryItemBase.extend({
  type: z.literal("race"),
  system: raceSystemSchema,
});

export type RaceItem = z.infer<typeof raceItemSchema>;
