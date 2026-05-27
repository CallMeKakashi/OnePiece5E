import type { FoundryItem } from "../../schemas/common.js";
import { assignIcons } from "../../helpers/icons.js";
import { backgrounds } from "./backgrounds.js";
import { roles } from "./roles.js";

export const items: FoundryItem[] = assignIcons([
  ...backgrounds,
  ...roles,
]);

export default items;
