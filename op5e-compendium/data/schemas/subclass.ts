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
  classRestriction: z.string().default(""),
  hint: z.string().default(""),
});

const subclassSystemSchema = z.object({
  description: descriptionSchema.default({}),
  source: sourceSchema.default({}),
  identifier: z.string(),
  classIdentifier: z.string(),
  advancement: z.record(z.string(), advancementEntrySchema),
  spellcasting: z
    .object({
      progression: z
        .enum(["none", "full", "half", "third", "pact", "artificer"])
        .default("none"),
      ability: z.string().default(""),
    })
    .default({}),
});

export type SubclassSystem = z.infer<typeof subclassSystemSchema>;

export const subclassItemSchema = foundryItemBase.extend({
  type: z.literal("subclass"),
  system: subclassSystemSchema,
});

export type SubclassItem = z.infer<typeof subclassItemSchema>;
