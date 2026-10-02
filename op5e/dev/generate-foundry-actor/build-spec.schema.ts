import { z } from "zod";

export const ChoiceEntrySchema = z.object({
  stepId: z.string(),
  level: z.number().int().optional(),
  source: z.string().optional(),
  uuids: z.array(z.string()).optional(),
  slugs: z.array(z.string()).optional(),
});

export const BuildSpecSchema = z.object({
  buildPath: z.enum(["class-based", "monster-statblock"]).default("class-based"),
  name: z.string().min(1),
  actorKind: z.enum(["pc", "npc"]).default("npc"),
  level: z.number().int().min(1).max(20),
  cr: z.number().optional(),
  raceIdentifier: z.string().min(1),
  classIdentifier: z.string().min(1),
  subclassIdentifier: z.string().optional(),
  /** @deprecated use subclassCustom — homebrew subclass adapter key */
  subclassCustom: z.string().optional(),
  backgroundSlug: z.string().optional(),
  roleSlug: z.string().optional(),
  backgroundUuid: z.string().optional(),
  roleUuid: z.string().optional(),
  powerFork: z.enum(["neither", "fork", "style"]).optional(),
  additionalPowerSlug: z.string().optional(),
  devilFruit: z
    .object({
      slug: z.string(),
      type: z.string().optional(),
    })
    .nullable()
    .optional(),
  startingHaki: z.array(z.string()).optional(),
  choices: z.array(ChoiceEntrySchema).optional(),
  abilities: z.record(z.string(), z.number()).optional(),
  abilityMethod: z.string().optional(),
  skills: z.record(z.string(), z.number()).optional(),
  tools: z.record(z.string(), z.number()).optional(),
  currencyGp: z.number().optional(),
  img: z.string().optional(),
  tokenImg: z.string().optional(),
  portraitImg: z.string().optional(),
  equipment: z.record(z.string(), z.string()).optional(),
  biography: z.string().optional(),
});

export type BuildSpec = z.infer<typeof BuildSpecSchema>;
export type ChoiceEntry = z.infer<typeof ChoiceEntrySchema>;

export function parseBuildSpec(raw: unknown): BuildSpec {
  return BuildSpecSchema.parse(raw);
}
