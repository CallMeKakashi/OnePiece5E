import type { Spec } from "../../helpers/spec.js";
import { classFeatureSpecs } from "./class-features.js";
import { classFeatureSpecs2 } from "./class-features-2.js";
import { featItemSpecs } from "./feats-items.js";
import { creationSpecs1 } from "./creations-1.js";

/** "pack/Item Name" -> hand-written automation. See helpers/spec.ts. */
export const AUTOMATION: Record<string, Spec> = { ...classFeatureSpecs, ...classFeatureSpecs2, ...featItemSpecs, ...creationSpecs1 };
