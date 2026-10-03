import type { Spec } from "../../helpers/spec.js";
import { classFeatureSpecs } from "./class-features.js";
import { classFeatureSpecs2 } from "./class-features-2.js";
import { featItemSpecs } from "./feats-items.js";
import { creationSpecs1 } from "./creations-1.js";
import { creationSpecs2 } from "./creations-2.js";
import { creationSpecs3 } from "./creations-3.js";
import { creationSpecs4 } from "./creations-4.js";
import { creationSpecs5 } from "./creations-5.js";

/** "pack/Item Name" -> hand-written automation. See helpers/spec.ts. */
export const AUTOMATION: Record<string, Spec> = { ...classFeatureSpecs, ...classFeatureSpecs2, ...featItemSpecs, ...creationSpecs1, ...creationSpecs2, ...creationSpecs3, ...creationSpecs4, ...creationSpecs5 };
