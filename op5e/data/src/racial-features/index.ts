import type { FeatureItem } from "../../schemas/feature.js";
import { assignIcons } from "../../helpers/icons.js";

import { humanFeatures } from "./human.js";
import { fishmanFeatures } from "./fishman.js";
import { minkFeatures } from "./mink.js";
import { giantFeatures } from "./giant.js";
import { skyIslanderFeatures } from "./sky-islander.js";
import { dwarvesFeatures } from "./dwarves.js";
import { merfolkFeatures } from "./merfolk.js";
import { lunarianFeatures } from "./lunarian.js";
import { augmentedFeatures } from "./augmented.js";

export const items: FeatureItem[] = assignIcons([
  ...humanFeatures,
  ...fishmanFeatures,
  ...minkFeatures,
  ...giantFeatures,
  ...skyIslanderFeatures,
  ...dwarvesFeatures,
  ...merfolkFeatures,
  ...lunarianFeatures,
  ...augmentedFeatures,
]);
export default items;
