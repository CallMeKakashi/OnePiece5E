const MODULE_ID = "op5e-compendium";

export type PackName =
  | "classes"
  | "subclasses"
  | "class-features"
  | "races"
  | "racial-features"
  | "feats"
  | "items"
  | "creations"
  | "backgrounds";

/**
 * Build a Foundry compendium UUID for a document in this module.
 *
 * @example compendiumUuid("class-features", "a3f1bc90de4567ab")
 *          // "Compendium.op5e-compendium.class-features.a3f1bc90de4567ab"
 */
export function compendiumUuid(packName: PackName, documentId: string): string {
  return `Compendium.${MODULE_ID}.${packName}.${documentId}`;
}
