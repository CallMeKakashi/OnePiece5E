/** Homebrew adapters — campaign content behind the Actor Build seam. */
import type { FeatureItem } from "../../data/schemas/feature.js";
import type { SubclassItem } from "../../data/schemas/subclass.js";
import { mastermindSubclass, mastermindFeatures } from "./mastermind.js";
import { buildSmartSmartFruitItems } from "./smart-smart-fruit.js";

export interface SubclassCustomAdapter {
  subclass: SubclassItem;
  features: FeatureItem[];
  grantLevel: number;
}

export const SUBCLASS_CUSTOM: Record<string, SubclassCustomAdapter> = {
  "5e-mastermind": {
    subclass: mastermindSubclass,
    features: mastermindFeatures,
    grantLevel: 3,
  },
};

export const DEVIL_FRUIT_BUILDERS: Record<string, () => FeatureItem[]> = {
  "smart-smart": buildSmartSmartFruitItems,
};

export function resolveSubclassCustom(key: string | undefined): SubclassCustomAdapter | undefined {
  if (!key) return undefined;
  return SUBCLASS_CUSTOM[key];
}

export function resolveDevilFruit(slug: string | undefined | null): FeatureItem[] {
  if (!slug) return [];
  const builder = DEVIL_FRUIT_BUILDERS[slug];
  return builder ? builder() : [];
}
