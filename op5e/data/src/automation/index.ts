import type { Spec } from "../../helpers/spec.js";
import { classFeatureSpecs } from "./class-features.js";

/** "pack/Item Name" -> hand-written automation. See helpers/spec.ts. */
export const AUTOMATION: Record<string, Spec> = { ...classFeatureSpecs };
