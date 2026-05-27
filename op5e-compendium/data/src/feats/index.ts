import type { FeatureItem } from "../../schemas/feature.js";
import { assignIcons } from "../../helpers/icons.js";

import { generalACFeats } from "./general-a-c.js";
import { generalDFFeats } from "./general-d-f.js";
import { generalGJFeats } from "./general-g-j.js";
import { generalKMFeats } from "./general-k-m.js";
import { generalNRFeats } from "./general-n-r.js";
import { generalSWFeats } from "./general-s-w.js";
import { racialFeats } from "./racial.js";

export const items: FeatureItem[] = assignIcons([
  ...generalACFeats,
  ...generalDFFeats,
  ...generalGJFeats,
  ...generalKMFeats,
  ...generalNRFeats,
  ...generalSWFeats,
  ...racialFeats,
]);
export default items;
