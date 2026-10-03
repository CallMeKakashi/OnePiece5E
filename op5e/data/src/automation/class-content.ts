import type { Spec } from "../../helpers/spec.js";
import { allDefs } from "../class-features/class-content.js";
import { augmentationActs, augmentationsHtml } from "../class-features/augmentations.js";

/** Specs for the Defs in class-features/class-content.ts (maneuvers, shots, ammo, mods) + Experimental Augmentations. */
export const classContentSpecs: Record<string, Spec> = {
  ...Object.fromEntries(allDefs.filter((d) => d.acts.length).map((d) => [`class-features/${d.name}`, { activities: d.acts }] as [string, Spec])),
  "class-features/Experimental Augmentations": { descriptionHtml: augmentationsHtml, activities: augmentationActs },
};
