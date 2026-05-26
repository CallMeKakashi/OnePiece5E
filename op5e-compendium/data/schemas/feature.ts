import { z } from "zod";
import { foundryItemBase, descriptionSchema, sourceSchema } from "./common.js";

const featureTypeSchema = z.object({
  value: z.enum(["class", "race", "feat", "monster", "background", "enchantment"]),
  subtype: z.string().default(""),
});

const activationSchema = z
  .object({
    type: z.string().default(""),
    cost: z.number().nullable().default(null),
    condition: z.string().default(""),
  })
  .default({});

const durationSchema = z
  .object({
    value: z.union([z.string(), z.number()]).nullable().default(null),
    units: z.string().default(""),
  })
  .default({});

const targetSchema = z
  .object({
    value: z.union([z.string(), z.number()]).nullable().default(null),
    width: z.number().nullable().default(null),
    units: z.string().default(""),
    type: z.string().default(""),
  })
  .default({});

const rangeSchema = z
  .object({
    value: z.number().nullable().default(null),
    long: z.number().nullable().default(null),
    units: z.string().default(""),
  })
  .default({});

const usesSchema = z
  .object({
    value: z.number().nullable().default(null),
    max: z.string().default(""),
    per: z.string().nullable().default(null),
    recovery: z.string().default(""),
    prompt: z.boolean().default(true),
  })
  .default({});

const damageSchema = z
  .object({
    parts: z.array(z.tuple([z.string(), z.string()])).default([]),
    versatile: z.string().default(""),
  })
  .default({});

const saveSchema = z
  .object({
    ability: z.string().default(""),
    dc: z.number().nullable().default(null),
    scaling: z.string().default("spell"),
  })
  .default({});

const featureSystemSchema = z.object({
  description: descriptionSchema.default({}),
  source: sourceSchema.default({}),
  type: featureTypeSchema,
  requirements: z.string().default(""),
  activation: activationSchema,
  duration: durationSchema,
  target: targetSchema,
  range: rangeSchema,
  uses: usesSchema,
  actionType: z.string().default(""),
  damage: damageSchema,
  save: saveSchema,
  chatFlavor: z.string().default(""),
  recharge: z
    .object({
      value: z.number().nullable().default(null),
      charged: z.boolean().default(false),
    })
    .default({}),
});

export type FeatureSystem = z.infer<typeof featureSystemSchema>;

export const featureItemSchema = foundryItemBase.extend({
  type: z.literal("feat"),
  system: featureSystemSchema,
});

export type FeatureItem = z.infer<typeof featureItemSchema>;
