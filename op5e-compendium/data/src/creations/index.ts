import type { FoundryItem } from "../../schemas/common.js";

import { tricks } from "./tricks.js";
import { level1 } from "./level-1.js";
import { level2 } from "./level-2.js";
import { level3 } from "./level-3.js";
import { level4 } from "./level-4.js";
import { level5 } from "./level-5.js";
import { level6 } from "./level-6.js";
import { level7 } from "./level-7.js";
import { level8 } from "./level-8.js";
import { level9 } from "./level-9.js";

export const items: FoundryItem[] = [
  ...tricks,
  ...level1,
  ...level2,
  ...level3,
  ...level4,
  ...level5,
  ...level6,
  ...level7,
  ...level8,
  ...level9,
];

export default items;
