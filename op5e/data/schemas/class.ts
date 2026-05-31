import { z } from "zod";
import { foundryItemBase, descriptionSchema, sourceSchema } from "./common.js";

export const advancementEntrySchema = z.object({
  _id: z.string().min(1),
  type: z.enum([
    "HitPoints",
    "ItemGrant",
    "ItemChoice",
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
  classRestriction: z.string().default(""),
  hint: z.string().default(""),
});

export type AdvancementEntry = z.infer<typeof advancementEntrySchema>;

const classSystemSchema = z.object({
  description: descriptionSchema.default({}),
  source: sourceSchema.default({}),
  identifier: z.string(),
  levels: z.number().int().default(1),
  hitDice: z.string().regex(/^d\d+$/),
  hitDiceUsed: z.number().int().default(0),
  advancement: z.array(advancementEntrySchema),
  spellcasting: z
    .object({
      progression: z
        .enum(["none", "full", "half", "third", "pact", "artificer"])
        .default("none"),
      ability: z.string().default(""),
    })
    .default({}),
  wealth: z.string().default(""),
});

export type ClassSystem = z.infer<typeof classSystemSchema>;

export const classItemSchema = foundryItemBase.extend({
  type: z.literal("class"),
  system: classSystemSchema,
});

export type ClassItem = z.infer<typeof classItemSchema>;
