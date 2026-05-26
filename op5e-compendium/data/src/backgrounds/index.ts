import type { FoundryItem } from "../../schemas/common.js";
import { backgrounds } from "./backgrounds.js";
import { roles } from "./roles.js";

export const items: FoundryItem[] = [
  ...backgrounds,
  ...roles,
];

export default items;
