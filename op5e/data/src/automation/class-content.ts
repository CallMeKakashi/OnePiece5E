import type { Spec } from "../../helpers/spec.js";
import { allDefs } from "../class-features/class-content.js";
import { augmentationActs, augmentationsHtml } from "../class-features/augmentations.js";

// Mastercraft items with a fixed number of charges that come back on a long rest
const CHARGES: Record<string, Spec["uses"]> = {
  "Armor of Mechanical Strength": { max: "@prof", per: "lr" }, "Repulsion Shield": { max: "4", per: "lr" },
  "Glowing Weapon": { max: "6", per: "lr" }, "Creation Refueling Ring": { max: "1", per: "lr" },
};

/** Specs for the Defs in class-features/class-content.ts (maneuvers, shots, ammo, mods) + Experimental Augmentations. */
export const classContentSpecs: Record<string, Spec> = {
  ...Object.fromEntries(allDefs.filter((d) => d.acts.length).map((d) => [`class-features/${d.name}`, { activities: d.acts, ...(CHARGES[d.name] ? { uses: CHARGES[d.name] } : {}) }] as [string, Spec])),
  "class-features/Experimental Augmentations": { descriptionHtml: augmentationsHtml, activities: augmentationActs },
};
